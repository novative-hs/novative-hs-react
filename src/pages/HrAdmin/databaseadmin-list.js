import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import moment from "moment";
import {
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  Input,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import {
  getDatabaseadminList,
  updateStaff,
  deleteStaff,
} from "store/staff/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class DatabaseAdminList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      nameFilter: "",
      emailFilter: "",
      cnicFilter: "",
      phoneFilter: "",
      dateFilter: "",
      isActive: true, // Initial state
      statusFilter: "", 

      databaseadminList: [],
      staff: "",
      collectorImg: "",
      modal: false,
      nameSort: "asc",
      emailSort: "asc",
      cnicSort: "asc",
      phoneSort: "asc",
      dateSort: "asc",
      // deleteModal: false,
      auditorListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, DatabaseAdmin) => <>{DatabaseAdmin.id}</>,
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.nameFilter}
                    onChange={e => this.handleFilterChange("nameFilter", e)}
                    className="form-control"
                  />
                </div>
                <div>
                  {column.text}{" "}
                  {column.sort ? (
                    <i
                      className={
                        this.state.nameSort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{ color: "red" }}
                      onClick={() => this.handleSort("name")}
                    ></i>
                  ) : null}
                </div>
              </>
            );
          },
          formatter: (cellContent, DatabaseAdmin) => (
            <>
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + DatabaseAdmin.photo,
                }}
                target="_blank"
              >
                {DatabaseAdmin.name}
              </Link>
            </>
          ),
          headerAlign: "center", // Align header text to center
          align: "left",
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
          headerFormatter: (column, colIndex) => {
            // Add iconStyle as a parameter
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.emailFilter}
                    onChange={e => this.handleFilterChange("emailFilter", e)}
                    className="form-control"
                  />
                  <div>
                    {column.text}{" "}
                    {column.sort ? (
                      <i
                        className={
                          this.state.emailSort === "asc"
                            ? "fa fa-arrow-up"
                            : "fa fa-arrow-down"
                        }
                        style={{ color: "red" }}
                        onClick={() => this.handleSort("email")}
                      ></i>
                    ) : null}{" "}
                  </div>
                </div>
              </>
            );
          },
          headerAlign: "center",
          align: "left",
        },
        {
          dataField: "cnic",
          text: "CNIC",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.cnicFilter}
                    onChange={e => this.handleFilterChange("cnicFilter", e)}
                    className="form-control"
                  />
                </div>
                <div>
                  {column.text}{" "}
                  {column.sort ? (
                    <i
                      className={
                        this.state.cnicSort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{ color: "red" }}
                      onClick={() => this.handleSort("cnic")}
                    ></i>
                  ) : null}
                </div>
              </>
            );
          },
          headerAlign: "center", // Align header text to center
        },
        {
          dataField: "phone",
          text: "Mobile No.",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div className="d-flex justify-content-between align-items-center">
                  <input
                    type="text"
                    value={this.state.phoneFilter}
                    onChange={e => this.handleFilterChange("phoneFilter", e)}
                    className="form-control"
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  {column.text}
                  {column.sort ? (
                    <i
                      className={
                        this.state.phoneSort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{
                        marginLeft: "5px",
                        cursor: "pointer",
                        color: "red",
                      }}
                      onClick={() => this.handleSort("phone")}
                    />
                  ) : null}
                </div>
              </>
            );
          },
          headerAlign: "center", // Align header text to center
        },
        {
          dataField: "registered_at",
          text: "Date of Addition",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div className="d-flex justify-content-between align-items-center">
                  <input
                    type="text"
                    value={this.state.dateFilter}
                    onChange={e => this.handleFilterChange("dateFilter", e)}
                    className="form-control"
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  {column.text}
                  {column.sort ? (
                    <i
                      className={
                        this.state.dateSort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{
                        marginLeft: "5px",
                        cursor: "pointer",
                        color: "red",
                      }}
                      onClick={() => this.handleSort("registered_at")}
                    />
                  ) : null}
                </div>
              </>
            );
          },
          formatter: (cellContent, DatabaseAdmin) => (
            <>
              <span>
                {moment(DatabaseAdmin.registered_at).format(
                  "DD MMM YYYY, h:mm A"
                )}
              </span>
            </>
          ),
          headerAlign: "center", // Align header text to center
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, DatabaseAdmin) => (
            <div className="d-flex align-items-center">
              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={e =>
                      this.handleDatabaseAdminClick(e, DatabaseAdmin)
                    }
                  ></i>
                </Link>
              </Tooltip>
              <div key={DatabaseAdmin.id}>
                {/* <Tooltip title="Account Inactive">
                  <Link className="text-danger" to="#">
                    <i
                      className="mdi mdi-account-remove font-size-18"
                      id="deletetooltip"
                      onClick={() => this.handleStatusUpdateInactive(DatabaseAdmin)}
                    ></i>
                  </Link>
                </Tooltip> */}
                {/* <Tooltip title={DatabaseAdmin.status === "Active" ? "Account Inactive" : "Account Active"}>
                <Link className={DatabaseAdmin.status === "Active" ? "text-danger" : "text-success"} to="#">
                  <i
                    className={DatabaseAdmin.status === "Active" ? "mdi mdi-account-remove font-size-18" : "mdi mdi-account-plus font-size-18"}
                    id="statusToggleTooltip"
                    onClick={() => this.handleStatusUpdateInactive(DatabaseAdmin)}
                  ></i>
                </Link>
              </Tooltip> */}
                {DatabaseAdmin.status === "Active" ? (
                  <Tooltip title="Delete Account">
                    <Link className="text-danger" to="#">
                      <i
                        className="mdi mdi-account-remove font-size-18"
                        id="deletetooltip"
                        onClick={() => this.handleStatusUpdateInactive(DatabaseAdmin)}
                      ></i>
                    </Link>
                  </Tooltip>
                ) : (
                  <Tooltip title="Restore Account">
                    <Link className="text-success" to="#">
                      <i
                        className="mdi mdi-account-plus font-size-18"
                        id="addtooltip"
                        onClick={() =>
                          this.handleStatusUpdatActive(DatabaseAdmin)
                        }
                      ></i>
                    </Link>
                  </Tooltip>
                )}
              </div>
            </div>
          ),
        },
      ],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.handleDatabaseAdminClick = this.handleDatabaseAdminClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleAuditorClicks = this.handleAuditorClicks.bind(this);
    this.handleStatusUpdateInactive =
      this.handleStatusUpdateInactive.bind(this);
    this.handleStatusUpdatActive =
      this.handleStatusUpdatActive.bind(this);

    // this.onClickDelete = this.onClickDelete.bind(this);
  }

  handleSort = field => {
    const newSortOrder = this.state[field + "Sort"] === "asc" ? "desc" : "asc";
    this.setState({ [field + "Sort"]: newSortOrder }, () => {
      this.sortData(field, newSortOrder);
    });
  };

  sortData = (field, order) => {
    const { databaseadminList } = this.state;
    if (!Array.isArray(databaseadminList)) {
      return;
    }

    const sortedData = [...databaseadminList].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Ensure both values are strings for case-insensitive comparison
      aValue = aValue.toString().toLowerCase();
      bValue = bValue.toString().toLowerCase();

      if (order === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    this.setState({ databaseadminList: sortedData });
  };
  componentDidMount() {
    const { onGetDatabaseAdminList } = this.props;
    const { user_id } = this.state;
    onGetDatabaseAdminList(user_id);

    this.setState({ databaseadminList: this.props.databaseadminList });
    console.log(
      "the data received on the page is:",
      this.props.databaseadminList
    );
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };
  // Filter data based on filter values
  filterData = () => {
    const { databaseadminList } = this.props;
    const {
      nameFilter,
      emailFilter,
      cnicFilter,
      phoneFilter,
      dateFilter,
      statusFilter,
    } = this.state;

    const filteredData = databaseadminList.filter(
      entry =>
        entry.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        entry.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
        entry.cnic.includes(cnicFilter) &&
        entry.phone.includes(phoneFilter) &&
        entry.registered_at.includes(dateFilter) &&
        // entry.status === statusFilter // filter based on status
        (statusFilter === "" || entry.status === statusFilter) // filter based on status
    );

    return filteredData;
  };
  handleAuditorClicks = () => {
    this.setState({ DatabaseAdmin: "", collectorImg: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { databaseadminList } = this.props;
    if (
      !isEmpty(databaseadminList) &&
      size(prevProps.databaseadminList) !== size(databaseadminList)
    ) {
      this.setState({ databaseadminList: {}, isEdit: false });
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

  /* Insert,Update Delete data */

  // toggleDeleteModal = () => {
  //   this.setState(prevState => ({
  //     deleteModal: !prevState.deleteModal,
  //   }));
  // };

  // onClickDelete = databaseadminList => {
  //   this.setState({ databaseadminList: databaseadminList });
  //   this.setState({ deleteModal: true });
  // };

  // handleDeleteDatabaseadmin = () => {
  //   const { onDeleteStaff, onGetDatabaseAdminList } = this.props;
  //   const { databaseadminList } = this.state;
  //   if (databaseadminList.id !== undefined) {
  //     onDeleteStaff(databaseadminList);
  //     setTimeout(() => {
  //       onGetDatabaseAdminList(this.state.user_id);
  //     }, 1000);
  //     this.setState({ deleteModal: false });
  //   }
  // };

  handleDatabaseAdminClick = (e, arg) => {
    this.setState({
      staff: {
        id: arg.id,
        name: arg.name,
        cnic: arg.cnic,
        phone: arg.phone,
      },
      isEdit: true,
    });

    this.toggle();
  };

  // Method to handle status change

  handleStatusUpdateInactive = DatabaseAdmin => {
    const updatedAdmin = {
      ...DatabaseAdmin,
      isActive: false,
    };

    this.props.onUpdateStaff(updatedAdmin);
    setTimeout(() => {
      this.props.onGetDatabaseAdminList(
        this.state.user_id
      );
    }, 1000);// Adjust the delay as needed
  
  };

  handleStatusUpdatActive = DatabaseAdmin => {
    const updatedAdmin = {
      ...DatabaseAdmin,
      isActive: true,
    };
  
    this.props.onUpdateStaff(updatedAdmin);
    setTimeout(() => {
      this.props.onGetDatabaseAdminList(
        this.state.user_id
      );
    }, 1000);// Adjust the delay as needed
  
  };
  render() {
    const { nameFilter, emailFilter, cnicFilter, phoneFilter, dateFilter } =
      this.state;
    const { databaseadminList } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onUpdateStaff, onGetDatabaseAdminList } = this.props;
    const staff = this.state.staff;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: databaseadminList.length, // replace later with size(DatabaseAdminList),
      custom: true,
    };

    // const defaultSorted = [
    //   {
    //     dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
    //     order: "desc", // desc or asc
    //   },
    // ];

    return (
      <React.Fragment>
        {/* <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteDatabaseadmin}
          onCloseClick={() => this.setState({ deleteModal: false })}
        /> */}
        <div className="page-content">
          <MetaTags>
            <title>Database Admin List | NEQAS</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Database Admin"
              breadcrumbItem="Database Admin List"
            />
            <Row className="justify-content-center">
              <Col lg="10">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.auditorListColumns}
                      data={databaseadminList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.auditorListColumns}
                          data={databaseadminList}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                              <Col xl="12">
                                <h6>Activate/Deactivate Staff Accounts</h6> </Col>
                                <Col xs="5" sm="5" md="4" lg="3">
                                  <div className="mb-3">
                                    <select
                                      className="form-control"
                                      value={this.state.statusFilter}
                                      onChange={e =>
                                        this.handleFilterChange(
                                          "statusFilter",
                                          e
                                        )
                                      }
                                    >
                                      <option value="">All</option>
                                      <option value="Active">Active</option>
                                      <option value="Inactive">Inactive</option>
                                    </select>
                                  </div>
                                </Col>
                              </Row>

                              <Row className=" mb-4 navbar-nav">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      // defaultSorted={defaultSorted}
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={
                                        "table-header-sky-blue"
                                      }
                                      responsive
                                      ref={this.node}
                                      data={this.filterData()}
                                      headerFormatter={(column, colIndex) =>
                                        column.headerFormatter(column, colIndex)
                                      }
                                    />

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        Edit Database Admin
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            name: (staff && staff.name) || "",
                                            cnic: (staff && staff.cnic) || "",
                                            phone: (staff && staff.phone) || "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            name: Yup.string()
                                              .trim()
                                              .required("Please enter name"),
                                            cnic: Yup.string()
                                              .required(
                                                "Please enter your CNIC"
                                              )
                                              .matches(
                                                /^[0-9]{5}-[0-9]{7}-[0-9]$/,
                                                "Please enter a valid CNIC e.g. 37106-8234782-3"
                                              ),
                                            phone: Yup.string()
                                              .required("Please enter phone")
                                              .matches(
                                                /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                                "Please enter a valid Pakistani phone number e.g. 03123456789"
                                              ),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              const staffData = {
                                                id: staff.id,
                                                name: values.name,
                                                cnic: values.cnic,
                                                phone: values.phone,
                                              };

                                              // save new Staff
                                              onUpdateStaff(staffData);
                                              setTimeout(() => {
                                                onGetDatabaseAdminList(
                                                  this.state.user_id
                                                );
                                              }, 1000);
                                            }
                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <Field
                                                    type="hidden"
                                                    className="form-control"
                                                    name="hiddenEditFlag"
                                                    value={isEdit}
                                                  />

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Name
                                                    </Label>
                                                    <Field
                                                      name="name"
                                                      type="text"
                                                      value={
                                                        this.state.staff.name
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          staff: {
                                                            id: staff.id,
                                                            name: e.target
                                                              .value,
                                                            cnic: staff.cnic,
                                                            phone: staff.phone,
                                                            roles: staff.roles,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.name &&
                                                        touched.name
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="name"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      CNIC
                                                    </Label>
                                                    <Field
                                                      name="cnic"
                                                      type="text"
                                                      value={
                                                        this.state.staff.cnic
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            staff: {
                                                              id: staff.id,
                                                              name: staff.name,
                                                              cnic: e.target
                                                                .value,
                                                              phone:
                                                                staff.phone,
                                                              roles:
                                                                staff.roles,
                                                            },
                                                          });
                                                        }
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.cnic &&
                                                        touched.cnic
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="cnic"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Mobile No
                                                    </Label>
                                                    <Field
                                                      name="phone"
                                                      type="text"
                                                      value={
                                                        this.state.staff.phone
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          staff: {
                                                            id: staff.id,
                                                            name: staff.name,
                                                            cnic: staff.cnic,
                                                            phone:
                                                              e.target.value,
                                                            roles: staff.roles,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.phone &&
                                                        touched.phone
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="phone"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col>
                                                  <div className="text-end">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-success save-user"
                                                    >
                                                      Save
                                                    </button>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </Form>
                                          )}
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
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

DatabaseAdminList.propTypes = {
  match: PropTypes.object,
  databaseadminList: PropTypes.array,
  className: PropTypes.any,
  onGetDatabaseAdminList: PropTypes.func,
  onDeleteStaff: PropTypes.func,
  onUpdateStaff: PropTypes.func,
};

const mapStateToProps = ({ staff }) => ({
  databaseadminList: staff.databaseadminList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetDatabaseAdminList: id => dispatch(getDatabaseadminList(id)),
  onUpdateStaff: DatabaseAdmin => dispatch(updateStaff(DatabaseAdmin)),
  onDeleteStaff: DatabaseAdmin => dispatch(deleteStaff(DatabaseAdmin)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DatabaseAdminList));
