import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
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

// import { getCSR, updateStaff, deleteStaff } from "store/sample-collectors/actions";
import { getCSRList, updateStaff, deleteStaff } from "store/staff/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";


class CSRList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      nameFilter: '',
      emailFilter: '',
      cnicFilter: '',
      phoneFilter: '',
      csrList: [],
      staff: "",
      collectorImg: "",
      modal: false,
      nameSort: 'asc', 
      emailSort: 'asc',
      cnicSort: 'asc', 
      phoneSort: 'asc',
      deleteModal: false,
      csrListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, CSR) => <>{CSR.id}</>,
        },
        {
          dataField: "photo",
          text: "Name",
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
              <div>{column.text}   {column.sort ? (
            <i className={this.state.nameSort === 'asc' ? 'fa fa-arrow-up' : 'fa fa-arrow-down'} style={{color: "red"}} onClick={() => this.handleSort('name')}></i>
          ) : null}</div>
              </>
            );
            
          },
          formatter: (cellContent, CSR) => (
            <div className="text-start">
              <Link
                to={{
                  pathname: process.env.REACT_APP_BACKENDURL + CSR.photo,
                }}
                target="_blank"
              >
                {CSR.name}
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
            <i className={this.state.emailSort === 'asc' ? 'fa fa-arrow-up' : 'fa fa-arrow-down'} style={{color: "red"}} onClick={() => this.handleSort('email')}></i>
          ) : null} </div>
                </div>
          
              </>
            );
          },
          formatter: (cellContent, CSR) => (
            <div className="text-start"> {/* Apply Bootstrap text-start class here */}
              {CSR.email}
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
            <i className={this.state.cnicSort === 'asc' ? 'fa fa-arrow-up' : 'fa fa-arrow-down'} style={{color: "red"}} onClick={() => this.handleSort('cnic')}></i>
          ) : null}</div>
              </>
            );
          },
          headerAlign: 'center',
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
          headerAlign: 'center',
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          headerFormatter: (column, colIndex) => {
            return (
              <div style={{ marginTop: '45px' }}>
                {column.text}
              </div>
            );
          },
          formatter: (cellContent, CSR) => (
            <div>
              <Tooltip title="Update">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e => this.handleCSRClick(e, CSR)}
                ></i>
              </Link>
              </Tooltip>
              <Tooltip title="Delete">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(CSR)}
                ></i>
              </Link>
              </Tooltip>
            </div>
          ),
        },
      ],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.handleCSRClick = this.handleCSRClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleCSRClicks = this.handleCSRClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }
  handleSort = (field) => {
    const newSortOrder = this.state[field + 'Sort'] === 'asc' ? 'desc' : 'asc';
    this.setState({ [field + 'Sort']: newSortOrder }, () => {
      this.sortData(field, newSortOrder);
    });
  };
  
  sortData = (field, order) => {
    const { CSRList } = this.state;
    if (!Array.isArray(CSRList)) {
  
      return;
    }
  
    const sortedData = [...CSRList].sort((a, b) => {
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
  
    this.setState({ CSRList: sortedData });
  };

  componentDidMount() {
    const { onGetCSRList } = this.props;
    onGetCSRList(this.state.user_id);
    this.setState({ csrList: this.props.csrList });
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
      const { csrList } = this.props;
      const { nameFilter, emailFilter, cnicFilter, phoneFilter } = this.state;
      const filteredData = csrList.filter(entry =>
        entry.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        entry.email.toLowerCase().includes(emailFilter.toLowerCase()) &&
        entry.cnic.includes(cnicFilter) &&
        entry.phone.includes(phoneFilter)
      );
      return filteredData;
    };

  handleCSRClicks = () => {
    this.setState({ CSR: "", collectorImg: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { csrList } = this.props;
    if (!isEmpty(csrList) && size(prevProps.csrList) !== size(csrList)) {
      this.setState({ csrList: {}, isEdit: false });
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

  onClickDelete = csrList => {
    this.setState({ csrList: csrList });
    this.setState({ deleteModal: true });
  };

  handleDeleteCSR = () => {
    const { onDeleteStaff, onGetCSRList } = this.props;
    const { csrList } = this.state;
    if (csrList.id !== undefined) {
      onDeleteStaff(csrList);
      setTimeout(() => {
        onGetCSRList(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleCSRClick = (e, arg) => {
    console.log("arg: ", arg);

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

  render() {
    const { nameFilter, emailFilter, cnicFilter, phoneFilter } = this.state;

    const { csrList } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onUpdateStaff, onGetCSRList } = this.props;
    const staff = this.state.staff;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: csrList.length, // replace later with size(CSRList),
      custom: true,
    };

    // const defaultSorted = [
    //   { 
    //     dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
    //     order: "desc", // desc or asc
    //   },
    // ];
    // const iconStyle = { color: 'red' }; // Customize the color here

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteCSR}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>CSR List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Staff" breadcrumbItem="CSR List" />
            <Row className="justify-content-center">
              <Col lg="10">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.csrListColumns}
                      data={csrList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.csrListColumns}
                          data={csrList}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              {/* <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col>
                              </Row> */}
                              <Row className="mb-2">
                              </Row >
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
                                        Edit CSR
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
                                                onGetCSRList(this.state.user_id);
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

CSRList.propTypes = {
  match: PropTypes.object,
  csrList: PropTypes.array,
  className: PropTypes.any,
  onGetCSRList: PropTypes.func,
  onDeleteStaff: PropTypes.func,
  onUpdateStaff: PropTypes.func,
};

const mapStateToProps = ({ staff }) => ({
  csrList: staff.csrList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetCSRList: (id) => dispatch(getCSRList(id)),
  onUpdateStaff: CSR => dispatch(updateStaff(CSR)),
  onDeleteStaff: CSR => dispatch(deleteStaff(CSR)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CSRList));
