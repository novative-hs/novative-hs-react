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
import { getInstrumentlist, addNewInstrument, updateInstrument } from "store/instrument/actions";
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
      Instrument: [],
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
          text: "Equipments",
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
          text: "Select",
          formatter: (cellContent, row) => {
            return (
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`checkbox${row.id}`}
                  onChange={() => this.handleCheckboxChange(row.id)}
                  style={{ cursor: "pointer" }}
                  checked={this.state.selectedCheckboxes[row.id] || false}
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
    const { Instrument, onGetInstrumentTypeList } = this.props;
    onGetInstrumentTypeList(this.state.user_id);
    this.setState({ Instrument });
  }

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  handleSelectChange = (e, id) => {
    const updatedList = this.state.Instrument.map(item =>
      item.id === id ? { ...item, status: e.target.value } : item
    );
    this.setState({ Instrument: updatedList });
  };

  handleCheckboxChange = (id) => {
    this.setState(prevState => ({
      selectedCheckboxes: {
        ...prevState.selectedCheckboxes,
        [id]: !prevState.selectedCheckboxes[id]
      }
    }), () => {
      // Force table re-render by updating the key
      this.setState(prevState => ({ tableKey: prevState.tableKey + 1 }));
    });
  };

  // Filter data based on filter values
  filterData = () => {
    const { Instrument } = this.props;
    const { nameFilter, addedbyFilter, dateFilter, statusFilter, codeFilter ,idFilter} = this.state;

    const filteredData = Instrument.filter(entry => {
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
    const { Instrument } = this.props;
    if (!isEmpty(Instrument) && size(prevProps.Instrument) !== size(Instrument)) {
      this.setState({ Instrument: {}, isEdit: false });
    }
  }

  closeModal = () => {
    this.setState({ modal: false });
  };

  render() {
    const { SearchBar } = Search;
    const { Instrument } = this.props;
    const methodlist = this.state.Instrument;

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
            <title>Database Admin | Equipment List</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="List" breadcrumbItem="Equipment List" />
            <Row className="justify-content-center">
              <Col lg="5">
                <Card>
                  <CardBody>
                    <ToolkitProvider
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={Instrument}
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
  Instrument: PropTypes.array,
  className: PropTypes.any,
  onGetInstrumentTypeList: PropTypes.func,
  createInstrumentType: PropTypes.array,
  error: PropTypes.any,
  success: PropTypes.any,
  onAddNewType: PropTypes.func,
  onUpdateType: PropTypes.func,
};

const mapStateToProps = (state) => ({
  Instrument: state.Instrument?.Instrument,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetInstrumentTypeList: (id) => dispatch(getInstrumentlist(id)),
  onAddNewType: (createInstrumentType, id) =>
    dispatch(addNewInstrument(createInstrumentType, id)),
  onUpdateType: (id, methodlist) => dispatch(updateInstrument({ id, ...methodlist })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InstrumentType));
