import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Tooltip from "@material-ui/core/Tooltip";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
} from "reactstrap";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getunitlist, addNewUnit, updateUnits } from "store/units/actions";
import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";
import moment from 'moment';

class InstrumentType extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      nameFilter: '',
      addedbyFilter: '',
      dateFilter: '',
      idFilter:'',
      codeFilter: '',
      statusFilter: '',
      selectedUnit: null,
      isEdit: false,
      ListUnits: [],
      methodlist: "",
      modal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      successMessage: "",
      selectedCheckboxes: {}, // Track selected checkboxes
      tableKey: 0,
      feedbackListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.idFilter}
                    onChange={e => this.handleFilterChange('idFilter', e)}
                    className="form-control"
                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
          headerStyle: { width: '100px' },  // Adjust the width as needed
          style: { width: '100px' },  // Adjust the width as needed
        },
        
        {
          dataField: "name",
          text: "Units",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.nameFilter}
                    onChange={e => this.handleFilterChange('nameFilter', e)}
                    className="form-control"
                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
          headerAlign: 'center',
          align: 'left',
        },
        {
          dataField: "checkbox",
          text: "Allowed Units",
          formatter: (cellContent, row) => {
            return (
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`allowedUnitCheckbox${row.id}`}
                  onChange={() => this.handleCheckboxChange(row.id, "allowedUnit")}
                  style={{ cursor: "pointer" }}
                  checked={this.state.selectedCheckboxes[row.id]?.allowedUnit || false}
                />
              </div>
            );
          },
        },
        {
          dataField: "checkbox",
          text: "Master Unit",
          formatter: (cellContent, row) => {
            return (
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`masterUnitCheckbox${row.id}`}
                  onChange={() => this.handleCheckboxChange(row.id, "masterUnit")}
                  style={{ cursor: "pointer" }}
                  checked={this.state.selectedCheckboxes[row.id]?.masterUnit || false}
                />
              </div>
            );
          },
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { ListUnits, onGetInstrumentTypeList } = this.props;
    onGetInstrumentTypeList(this.state.user_id);
    this.setState({ ListUnits });
  }

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  handleSelectChange = (e, id) => {
    const updatedList = this.state.ListUnits.map(item =>
      item.id === id ? { ...item, status: e.target.value } : item
    );
    this.setState({ ListUnits: updatedList });
  };

  handleCheckboxChange = (id, column) => {
    this.setState(prevState => {
      let selectedCheckboxes = { ...prevState.selectedCheckboxes };

      if (column === "masterUnit") {
        // Uncheck all other checkboxes in the "Master Unit" column
        Object.keys(selectedCheckboxes).forEach(key => {
          if (selectedCheckboxes[key].masterUnit && key !== id.toString()) {
            selectedCheckboxes[key].masterUnit = false;
          }
        });

        // Toggle the selected checkbox in the "Master Unit" column
        selectedCheckboxes[id] = {
          ...selectedCheckboxes[id],
          masterUnit: !selectedCheckboxes[id]?.masterUnit
        };
      } else if (column === "allowedUnit") {
        // Toggle the selected checkbox in the "Allowed Unit" column
        selectedCheckboxes[id] = {
          ...selectedCheckboxes[id],
          allowedUnit: !selectedCheckboxes[id]?.allowedUnit
        };
      }

      return { selectedCheckboxes };
    }, () => {
      // Force table re-render by updating the key
      this.setState(prevState => ({ tableKey: prevState.tableKey + 1 }));
    });
  };


  // Filter data based on filter values
  filterData = () => {
    const { ListUnits } = this.props;
    const { nameFilter, addedbyFilter, dateFilter, statusFilter, codeFilter ,idFilter} = this.state;

    const filteredData = ListUnits.filter(entry => {
      const name = entry.name ? entry.name.toString().toLowerCase() : "";
      const addedBy = entry.added_by ? entry.added_by.toString().toLowerCase() : "";
      const status = entry.status ? entry.status.toString() : "";
      const id = entry.id ? entry.id.toString() : "";
      const code = entry.code ? entry.code.toString() : "";
      const date = entry.date_of_addition ? entry.date_of_addition.toString() : "";

      return (
        name.includes(nameFilter.toLowerCase()) &&
        addedBy.includes(addedbyFilter.toLowerCase()) &&
        id.includes(idFilter) &&
        status.includes(statusFilter) &&
        code.includes(codeFilter) &&
        date.includes(dateFilter)
      );
    });

    return filteredData;
  };

  displaySuccessMessage = message => {
    this.setState({ successMessage: message });

    setTimeout(() => {
      this.setState({ successMessage: "", modal: false });
    }, 3000);
  };

  toggle(unit) {
    if (unit && unit.id) {
      this.setState({
        modal: true,
        selectedUnit: { id: unit.id, name: unit.name, added_by: unit.added_by, code: unit.code, status: unit.status },
        isEdit: true,
      });
    } else {
      this.setState({
        modal: true,
        selectedUnit: null,
        isEdit: false,
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { ListUnits } = this.props;
    if (!isEmpty(ListUnits) && size(prevProps.ListUnits) !== size(ListUnits)) {
      this.setState({ ListUnits: {}, isEdit: false });
    }
  }

  closeModal = () => {
    this.setState({ modal: false });
  };

  render() {
    const { SearchBar } = Search;
    const { ListUnits } = this.props;
    const methodlist = this.state.ListUnits;

    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Unit List</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="List" breadcrumbItem="Unit List" />
            <Row className="justify-content-center">
              <Col lg="5">
                <Card>
                  <CardBody>
                    <ToolkitProvider
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={ListUnits}
                      search
                    >
                      {toolkitprops => (
                        <React.Fragment>
                          <Row className="mb-4">
                            <Col xl="12">
                              <div className="table-responsive">
                              <BootstrapTable
                                  key={this.state.tableKey} // Use tableKey to force re-render
                                  {...toolkitprops.baseProps}
                                  defaultSorted={defaultSorted}
                                  classes={"table align-middle table-hover"}
                                  bordered={false}
                                  striped={true}
                                  headerWrapperClasses={"table-light"}
                                  responsive
                                  ref={this.node}
                                  data={this.filterData()}
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="pagination pagination-rounded justify-content-end mb-2">
                              <button className="btn btn-primary btn-block mb-4" onClick={() => this.toggle()} style={{ background: "#0000CD" }}>Save</button>
                            </Col>
                          </Row>
                        </React.Fragment>
                      )}
                    </ToolkitProvider>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

InstrumentType.propTypes = {
  match: PropTypes.object,
  ListUnits: PropTypes.array,
  className: PropTypes.any,
  onGetInstrumentTypeList: PropTypes.func,
  createInstrumentType: PropTypes.array,
  error: PropTypes.any,
  success: PropTypes.any,
  onAddNewType: PropTypes.func,
  onUpdateType: PropTypes.func,
};

const mapStateToProps = (state) => ({
  ListUnits: state.ListUnits?.ListUnits,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetInstrumentTypeList: (id) => dispatch(getunitlist(id)),
  onAddNewType: (createInstrumentType, id) =>
    dispatch(addNewUnit(createInstrumentType, id)),
  onUpdateType: (id, methodlist) => dispatch(updateUnits({ id, ...methodlist })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InstrumentType));
