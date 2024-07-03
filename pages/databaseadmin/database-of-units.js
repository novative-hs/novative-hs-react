import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
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

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getunitlist, addNewUnit, updateUnits } from "store/units/actions";
import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";
import moment from 'moment';

class LabsRating extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      nameFilter: '',
      dateFilter: '',
      idFilter: '',
      selectedUnit: null,
      isEdit: false,
      ListUnits: [],
      unitlist: "",
      modal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      successMessage: "",
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
          headerStyle: { width: '150px' },  // Adjust the width as needed
  style: { width: '150px' },  // Adjust the width as needed
        },
        {
          dataField: "name",
          text: "Unit",
          sort: true,
          style: { textAlign: 'left' },
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
        },
        {
          text: "Date of Addition",
          dataField: "date_of_addition",
          sort: true,
          hidden: false,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.dateFilter}
                    onChange={e => this.handleFilterChange('dateFilter', e)}
                    className="form-control"
                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
          formatter: (cellContent, unitlist) => (
            <>
              <span>
                {moment(unitlist.date_of_addition).format("DD MMM YYYY")}
              </span>
            </>
          ),
        },
        {
          dataField: 'link1',
          text: '',
          formatter: (cellContent, unit) => {
            return (
              <Link to={`/units-analytes/${unit.id}`} style={{ textDecoration: 'underline', color: '#0000CD' }}>
                
                <span>List of Analytes</span>
              </Link>
            );
          }
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, unitlist) => (
            <div>
              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() => this.toggle(unitlist)}
                  ></i>
                </Link>
              </Tooltip>
              <Tooltip title="History">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/databaseadmin-history/${unitlist.id}`}
                ></Link>
              </Tooltip>
            </div>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { ListUnits, onGetUnitsList } = this.props;
    onGetUnitsList(this.state.user_id);
    this.setState({ ListUnits });
  }

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  displaySuccessMessage = message => {
    this.setState({ successMessage: message });

    setTimeout(() => {
      this.setState({ successMessage: "", modal: false });
    }, 3000);
  }

  toggle(unit) {
    if (unit && unit.id) {
      this.setState({
        modal: true,
        selectedUnit: { id: unit.id, name: unit.name, added_by: unit.added_by },
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

  onPaginationPageChange = page => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.props.pagination.options.onPageChange(page);
    }
  };

  closeModal = () => {
    this.setState({ modal: false });
  }

  render() {
    const { SearchBar } = Search;
    const { ListUnits } = this.props;
    const { onGetUnitsList, onUpdateUnit } = this.props;
    const { nameFilter, dateFilter, idFilter } = this.state;

    // Apply the filters to the unit list
    const filteredUnits = ListUnits.filter(entry => {
      const name = entry.name ? entry.name.toString().toLowerCase() : "";
      const id = entry.id ? entry.id.toString() : "";
      const date = entry.date_of_addition ? entry.date_of_addition.toString() : "";

      return (
        name.includes(nameFilter.toLowerCase()) &&
        id.includes(idFilter) &&
        date.includes(dateFilter)
      );
    });

    const pageOptions = {
      sizePerPage: 10,
      totalSize: filteredUnits.length,
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];
    const iconStyle = { color: 'red' };

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Units</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Units" breadcrumbItem="Unit List" />
            <Row className="justify-content-center">
              <Col lg="6">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={filteredUnits}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={filteredUnits}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-4">
                                <Col xl="12">
                                  <Col className="text-end">
                                    <button
                                      className="btn btn-primary btn-block mb-4"
                                      onClick={() => this.toggle()}
                                      style={{ background: "#0000CD" }}
                                    >
                                      Add New Units
                                    </button>

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.closeModal}
                                        tag="h4"
                                      >
                                        {"Add Units"}
                                      </ModalHeader>
                                      <ModalBody>
                                        {this.state.successMessage && (
                                          <div
                                            className="alert alert-success"
                                            role="alert"
                                          >
                                            {this.state.successMessage}
                                          </div>
                                        )}
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            name: this.state.selectedUnit ? this.state.selectedUnit.name : "",
                                            added_by: this.state.selectedUnit ? this.state.selectedUnit.added_by : "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            name: Yup.string().required("Name is required"),
                                            added_by: Yup.string(),
                                          })}
                                          onSubmit={async (
                                            values,
                                            { setSubmitting, resetForm }
                                          ) => {
                                            const userId = localStorage.getItem(
                                              "authUser"
                                            )
                                              ? JSON.parse(
                                                  localStorage.getItem(
                                                    "authUser"
                                                  )
                                                ).user_id
                                              : "";

                                            const newUnit = {
                                              name: values.name,
                                              added_by: userId,
                                            };

                                            if (this.state.isEdit) {
                                              try {
                                                await this.props.onUpdateUnit(
                                                  this.state.selectedUnit.id,
                                                  newUnit
                                                );

                                                this.displaySuccessMessage(
                                                  "Unit updated successfully!"
                                                );

                                                await this.props.onGetUnitsList(
                                                  this.state.user_id
                                                );

                                                // resetForm();
                                              } catch (error) {
                                                // Handle error if any
                                                console.error(
                                                  "Error updating unit:",
                                                  error
                                                );
                                              }
                                            } else {
                                              try {
                                                await this.props.onAddNewUnit(
                                                  newUnit
                                                );

                                                this.displaySuccessMessage(
                                                  "Unit added successfully!"
                                                );

                                                await this.props.onGetUnitsList(
                                                  this.state.user_id
                                                );
                                              } catch (error) {
                                                console.error(
                                                  "Error adding unit:",
                                                  error
                                                );
                                              }
                                            }

                                            setSubmitting(false);
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">
                                                      Unit Name
                                                    </Label>
                                                    <Field
                                                      name="name"
                                                      type="text"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage
                                                      name="name"
                                                      component="div"
                                                      className="text-danger"
                                                    />
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row>
        <Col>
          <div className="text-end">
            <button type="submit" className="btn btn-success save-user"
              style={{ backgroundColor: '#0000CD', borderColor: '#0000CD' }}>Save</button>
          </div>
        </Col>
      </Row>
                                            </Form>
                                          )}
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
                                  </Col>
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
                                      sort={{
                                        sortCaret: (order, column) =>
                                          order === "desc" ? (
                                            <i
                                              className="fa fa-arrow-up"
                                              style={iconStyle}
                                            ></i>
                                          ) : (
                                            <i
                                              className="fa fa-arrow-down"
                                              style={iconStyle}
                                            ></i>
                                          ),
                                      }}
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row>
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
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

LabsRating.propTypes = {
  match: PropTypes.object,
  ListUnits: PropTypes.array,
  className: PropTypes.any,
  onGetUnitsList: PropTypes.func,
  createUnit: PropTypes.array,
  error: PropTypes.any,
  success: PropTypes.any,
  onAddNewUnit: PropTypes.func,
  onUpdateUnit: PropTypes.func,
};

const mapStateToProps = ({ ListUnits }) => ({
  ListUnits: ListUnits.ListUnits,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetUnitsList: (id) => dispatch(getunitlist(id)),
  onAddNewUnit: (createUnit, id) =>
    dispatch(addNewUnit(createUnit, id)),
  onUpdateUnit: (id, unitlist) => dispatch(updateUnits({ id, ...unitlist })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabsRating));
