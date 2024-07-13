import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import moment from "moment";
import { Tooltip } from "@material-ui/core";
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

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// import { getFinanceOfficer, updateStaff, deleteStaff } from "store/sample-collectors/actions";
import {
  getRegistrationAdminList,
  updateStaff,
  deleteStaff,
} from "store/staff/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class RegistrationAdminList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      nameFilter: '',
      emailFilter: '',
      cnicFilter: '',
      phoneFilter: '',
      dateFilter: '',
      isActive: true, // Initial state
      statusFilter: "", 
      financeOfficerList: [],
      staff: "",
      collectorImg: "",
      nameSort: 'asc',
      emailSort: 'asc',
      cnicSort: 'asc',
      phoneSort: 'asc',
      dateSort: 'asc',
      modal: false,
      deleteModal: false,
      registrationAdminListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, RegistrationAdmin) => <>{RegistrationAdmin.id}</>,
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <div>
                <div>
                  <input
                    type="text"
                    value={this.state.nameFilter}
                    onChange={(e) => this.handleFilterChange('nameFilter', e)}
                    className="form-control"
                  />
                </div>
                <div>
                  {column.text}{' '}
                  {column.sort ? (
                    <i
                      className={
                        this.state.nameSort === 'asc'
                          ? 'fa fa-arrow-up'
                          : 'fa fa-arrow-down'
                      }
                      style={{ color: 'red' }}
                      onClick={() => this.handleSort('name')}
                    ></i>
                  ) : null}
                </div>
              </div>
            );
          },


          formatter: (cellContent, RegistrationAdmin) => (
            <div className="text-start">
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + RegistrationAdmin.photo,
                }}
                target="_blank"
              >
                {RegistrationAdmin.name}
              </Link>
            </div>
          ),
          headerAlign: 'center',
        },

        {
          dataField: "email",
          text: "Email",
          sort: true,
          headerFormatter: (column, colIndex) => { // Add iconStyle as a parameter
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.emailFilter}
                    onChange={e => this.handleFilterChange('emailFilter', e)}
                    className="form-control"
                  />
                  <div>{column.text}       {column.sort ? (
                    <i className={this.state.emailSort === 'asc' ? 'fa fa-arrow-up' : 'fa fa-arrow-down'} style={{ color: "red" }} onClick={() => this.handleSort('email')}></i>
                  ) : null} </div>
                </div>

              </>
            );
          },
          formatter: (cellContent, RegistrationAdmin) => (
            <div className="text-start">
              {RegistrationAdmin.email}
            </div>
          ),
          headerAlign: 'center',
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
                    onChange={e => this.handleFilterChange('cnicFilter', e)}
                    className="form-control"
                  />

                </div>
                <div>{column.text}  {column.sort ? (
                  <i className={this.state.cnicSort === 'asc' ? 'fa fa-arrow-up' : 'fa fa-arrow-down'} style={{ color: "red" }} onClick={() => this.handleSort('cnic')}></i>
                ) : null}</div>
              </>
            );
          },
          headerAlign: 'center', // Align header text to center

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
                    onChange={e => this.handleFilterChange('phoneFilter', e)}
                    className="form-control"
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  {column.text}
                  {column.sort ? (
                    <i
                      className={this.state.phoneSort === 'asc' ? 'fa fa-arrow-up' : 'fa fa-arrow-down'}
                      style={{ marginLeft: '5px', cursor: 'pointer', color: "red" }}
                      onClick={() => this.handleSort('phone')}
                    />
                  ) : null}
                </div>
              </>
            );
          },
          headerAlign: 'center', // Align header text to center
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
          formatter: (cellContent, RegistrationAdmin) => (
            <>
              <span>
                {moment(RegistrationAdmin.registered_at).format("DD MMM YYYY, h:mm A")}
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
          // formatter: (cellContent, RegistrationAdmin) => (
          //   <div>
          //     <Tooltip title="Update">
          //       <Link className="text-success" to="#">
          //         <i
          //           className="mdi mdi-pencil font-size-18"
          //           id="edittooltip"
          //           onClick={e =>
          //             this.handleRegistrationAdminClick(e, RegistrationAdmin)
          //           }
          //         ></i>
          //       </Link>
          //     </Tooltip>
          //     <Tooltip title="Delete">
          //       <Link className="text-danger" to="#">
          //         <i
          //           className="mdi mdi-delete font-size-18"
          //           id="deletetooltip"
          //           onClick={() => this.onClickDelete(RegistrationAdmin)}
          //         ></i>
          //       </Link>
          //     </Tooltip>
          //   </div>
          // ),
          formatter: (cellContent, RegistrationAdmin) => (
            <div className="d-flex align-items-center">
              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={e =>
                      this.handleRegistrationAdminClick(e, RegistrationAdmin)
                    }
                  ></i>
                </Link>
              </Tooltip>
              <div key={RegistrationAdmin.id}>
                {RegistrationAdmin.status === "Active" ? (
                  <Tooltip title="Delete Account">
                    <Link className="text-danger" to="#">
                      <i
                        className="mdi mdi-account-remove font-size-18"
                        id="deletetooltip"
                        onClick={() => this.handleStatusUpdateInactive(RegistrationAdmin)}
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
                          this.handleStatusUpdatActive(RegistrationAdmin)
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
    this.handleRegistrationAdminClick = this.handleRegistrationAdminClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleRegistrationAdminClicks =
      this.handleRegistrationAdminClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.handleStatusUpdateInactive =
    this.handleStatusUpdateInactive.bind(this);
  this.handleStatusUpdatActive =
    this.handleStatusUpdatActive.bind(this);
  }
  handleSort = (field) => {
    const newSortOrder = this.state[field + 'Sort'] === 'asc' ? 'desc' : 'asc';
    this.setState({ [field + 'Sort']: newSortOrder }, () => {
      this.sortData(field, newSortOrder);
    });
  };

  sortData = (field, order) => {
    const { financeOfficerList } = this.state;
    if (!Array.isArray(financeOfficerList)) {

      return;
    }

    const sortedData = [...financeOfficerList].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Ensure both values are strings for case-insensitive comparison
      aValue = aValue.toString().toLowerCase();
      bValue = bValue.toString().toLowerCase();

      if (order === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    this.setState({ financeOfficerList: sortedData });
  };
  componentDidMount() {
    const { onGetRegistrationAdminListt } = this.props;
    onGetRegistrationAdminListt(this.state.user_id);
    this.setState({ financeOfficerList: this.props.financeOfficerList });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleRegistrationAdminClicks = () => {
    this.setState({ RegistrationAdmin: "", collectorImg: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { financeOfficerList } = this.props;
    if (
      !isEmpty(financeOfficerList) &&
      size(prevProps.financeOfficerList) !== size(financeOfficerList)
    ) {
      this.setState({ financeOfficerList: {}, isEdit: false });
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

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = financeOfficerList => {
    this.setState({ financeOfficerList: financeOfficerList });
    this.setState({ deleteModal: true });
  };

  handleDeleteFinanceOfficer = () => {
    const { onDeleteStaff, onGetRegistrationAdminListt } = this.props;
    const { financeOfficerList } = this.state;
    if (financeOfficerList.id !== undefined) {
      onDeleteStaff(financeOfficerList);
      setTimeout(() => {
        onGetRegistrationAdminListt(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleRegistrationAdminClick = (e, arg) => {
    this.setState({
      staff: {
        id: arg.id,
        name: arg.name,
        cnic: arg.cnic,
        phone: arg.phone,
        // roles: arg.roles,
      },
      isEdit: true,
    });

    this.toggle();
  };
  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };
  filterData = () => {
    const { financeOfficerList } = this.props;
    const { nameFilter, emailFilter, cnicFilter, phoneFilter,dateFilter , statusFilter} = this.state;
    const filteredData = financeOfficerList.filter(entry =>
      entry.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      entry.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
      entry.cnic.includes(cnicFilter) &&
      entry.phone.includes(phoneFilter)&&
      entry.registered_at.includes(dateFilter)&&
      (statusFilter === "" || entry.status === statusFilter) // filter based on status
    );
    return filteredData;
  };
  // Method to handle status change

  handleStatusUpdateInactive = RegistrationAdmin => {
    const updatedAdmin = {
      ...RegistrationAdmin,
      isActive: false,
    };

    this.props.onUpdateStaff(updatedAdmin);
    setTimeout(() => {
      this.props.onGetRegistrationAdminListt(
        this.state.user_id
      );
    }, 1000);// Adjust the delay as needed
  
  };

  handleStatusUpdatActive = RegistrationAdmin => {
    const updatedAdmin = {
      ...RegistrationAdmin,
      isActive: true,
    };
  
    this.props.onUpdateStaff(updatedAdmin);
    setTimeout(() => {
      this.props.onGetRegistrationAdminListt(
        this.state.user_id
      );
    }, 1000);// Adjust the delay as needed
  
  };
  render() {
    // const { SearchBar } = Search;
    const { nameFilter, emailFilter, cnicFilter, phoneFilter } = this.state;
    
    const { financeOfficerList } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onUpdateStaff, onGetRegistrationAdminListt } = this.props;
    const staff = this.state.staff;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: financeOfficerList.length, // replace later with size(RegistrationAdminList),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];
    const iconStyle = { color: 'red' }; // Customize the color here

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteFinanceOfficer}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Registration Admin List</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Staff" breadcrumbItem="Registration Admin List" />
            <Row className="justify-content-center">
              <Col lg="10">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.registrationAdminListColumns}
                      data={financeOfficerList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.registrationAdminListColumns}
                          data={financeOfficerList}
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
                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-header-sky-blue"}
                                      responsive
                                      ref={this.node}
                                      data={this.filterData()}
                                      headerFormatter={(column, colIndex) => column.headerFormatter(column, colIndex)}
                                    />

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        Edit RegistrationAdmin
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            name: (staff && staff.name) || "",
                                            cnic: (staff && staff.cnic) || "",
                                            phone: (staff && staff.phone) || "",
                                            // roles: (staff && staff.roles) || "",
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
                                            // roles: Yup.string()
                                            //   .trim()
                                            //   .required("Please enter roles"),
                                          })}
                                          onSubmit={values => {
                                            
                                            if (isEdit) {
                                              const staffData = {
                                                id: staff.id,
                                                name: values.name,
                                                cnic: values.cnic,
                                                phone: values.phone,
                                                // roles: values.roles,
                                              };

                                              // save new Staff
                                              onUpdateStaff(staffData);

                                              // if (this.props.staff.length != 0) {
                                              //   this.props.history.push("/add-")
                                              // }

                                              setTimeout(() => {
                                                onGetRegistrationAdminListt(this.state.user_id);
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
                                                    className="form-control "
                                                    name="hiddenEditFlag"
                                                    value={isEdit}
                                                  />

                                                  <div className="mb-3">
                                                    <Label className="form-label text-center">
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
                                                            // roles: staff.roles,
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
                                                              // roles:
                                                              //   staff.roles,
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
                                                            // roles: staff.roles,
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
                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Roles
                                                    </Label>
                                                    <Field
                                                      name="roles"
                                                      type="text"
                                                      value={
                                                        this.state.staff.roles
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          staff: {
                                                            id: staff.id,
                                                            name: staff.name,
                                                            cnic: staff.cnic,
                                                            phone: staff.phone,
                                                            roles:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.roles &&
                                                        touched.roles
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="roles"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div> */}
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

RegistrationAdminList.propTypes = {
  match: PropTypes.object,
  financeOfficerList: PropTypes.array,
  className: PropTypes.any,
  onGetRegistrationAdminListt: PropTypes.func,
  onDeleteStaff: PropTypes.func,
  onUpdateStaff: PropTypes.func,
};

const mapStateToProps = ({ staff }) => ({
  financeOfficerList: staff.financeOfficerList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetRegistrationAdminListt: (id) => dispatch(getRegistrationAdminList(id)),
  onUpdateStaff: RegistrationAdmin => dispatch(updateStaff(RegistrationAdmin)),
  onDeleteStaff: RegistrationAdmin => dispatch(deleteStaff(RegistrationAdmin)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(RegistrationAdminList));
