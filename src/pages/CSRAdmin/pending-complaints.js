import React, { Component, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";


//Import Breadcrumb
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getPendingComplaints,
  assignComplaint,
  //   getCSRList,
} from "store/csr-admin/actions";

import { getCSRList } from "store/staff/actions";
//Office
import { getCsrCentralList,
       getCsrSouthList,
       getCsrNorthList,
      } from "store/csr-territory-list/actions";

import "assets/scss/table.scss";

class PendingComplaints extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      pendingComplaints: [],
      id: "",
      btnText: "Copy",
      assignedTo: "",
      PendingComplaints: "",
      pendingComplaint: "",
      csrList: [],
      // Office
      csrCentralTerritoryList: [],
      csrSouthTerritoryList: [],
      csrNorthTerritoryList: [],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      pendingComplaintListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, pendingComplaint) => (
            <>{pendingComplaint.id}</>
          ),
        },
        {
          dataField: "",
          text: "Complaint ID",
          sort: true,
          formatter: (cellContent, complaint) => (
            <>
              <strong>{complaint.complaint_id}</strong>
            </>
          ),
        },
        {
          dataField: "name",
          text: "Complainant Name",
          sort: true,
          formatter: (cellContent, pendingComplaint) => (
            <>
              <span>
                  <Link
                    to="#"
                    onClick={e => this.openPatientModal(e, pendingComplaint)}
                  >
                   {pendingComplaint.name}
                  </Link>
              </span>
            </>
          ),
        },
        // {
        //   dataField: "email",
        //   text: "Email",
        //   sort: true,
        // },
        // {
        //   dataField: "phone",
        //   text: "Phone No.",
        //   sort: true,
        // },
        {
          dataField: "subject",
          text: "Complaint Subject",
          sort: true,
        },
        {
          dataField: "message",
          text: "Message",
          sort: true,
          formatter: (cellContent, complaint) => (
            <>
              <Link to="#" onClick={e => this.openMessageModal(e, complaint)}>
                {complaint.message.slice(0, 10) + "..."}
              </Link>{" "}
            </>
          ),
        },
        {
          dataField: "complainant",
          text: "Complainant",
          sort: true,
        },
        {
          dataField: "complainee",
          text: "Complainee",
          sort: true,
          formatter: (cellContent, pendingComplaint) => (
            <>
                  {/* {pendingComplaint.complainee},{" "} */}
                  {pendingComplaint.labhazir_complainee}{" "}
                  {pendingComplaint.lab_name}
            </>
          ),
        },
        {
          dataField: "city",
          text: "Office",
          sort: true,      
        },
        {
          dataField: "data",
          text: "id",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, pendingComplaint) => (
            <>
              <Link
                className="btn btn-success"
                to="#"
                onClick={e => this.handleApprovedEvent(e, pendingComplaint.id)}
              >
                Assign
              </Link>{" "}
            </>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.toggleMessageModal.bind(this);
    this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
  }

  componentDidMount() {
    const { pendingComplaints, onGetPendingComplaints } = this.props;
    onGetPendingComplaints();
    this.setState({ pendingComplaints });
  

    //  csr central list
    const { csrCentralTerritoryList, onGetCsrCentralList } = this.props;
    onGetCsrCentralList();
    this.setState({ csrCentralTerritoryList });
   //  csr south list
    const { csrSouthTerritoryList, onGetCsrSouthList } = this.props;
    onGetCsrSouthList();
    this.setState({ csrSouthTerritoryList });
   //  csr north list
    const { csrNorthTerritoryList, onGetCsrNorthList } = this.props;
    onGetCsrNorthList();
    this.setState({ csrNorthTerritoryList });

   // csrs list
    const { csrList, onGetCSRList } = this.props;
    onGetCSRList();
    this.setState({ csrList });
  }

  
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      email: arg.email,
      phone:arg.phone,
    });
  };
  
  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  toggleMessageModal = () => {
    this.setState(prevState => ({
      messageModal: !prevState.messageModal,
    }));
  };

  openMessageModal = (e, arg) => {
    this.setState({ messageModal: true, message: arg.message });
  };

  handleApprovedEvent = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.toggle();
  };

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

  render() {
    const { SearchBar } = Search;

    const { pendingComplaints } = this.props;
    const data = this.state.data;
    const { onAssignComplaint, onGetPendingComplaints } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: pendingComplaints.length, // replace later with size(pendingComplaints),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const csrList = [];
    for (let i = 0; i < this.props.csrList.length; i++) {
      csrList.push({
        label: this.props.csrList[i].name,
        value: this.props.csrList[i].id,
      });
    }
    // Central Office
    const csrCentralTerritoryList = [];

    for (let i = 0; i < this.props.csrCentralTerritoryList.length; i++) {
      csrCentralTerritoryList.push({
        label: this.props.csrCentralTerritoryList[i].name,
        value: this.props.csrCentralTerritoryList[i].id,
      });
  
    }
    // South Office
    const csrSouthTerritoryList = [];

    for (let i = 0; i < this.props.csrSouthTerritoryList.length; i++) {
      csrSouthTerritoryList.push({
        label: this.props.csrSouthTerritoryList[i].name,
        value: this.props.csrSouthTerritoryList[i].id,
      });
  
    }
    // North Office
    const csrNorthTerritoryList = [];

    for (let i = 0; i < this.props.csrNorthTerritoryList.length; i++) {
      csrNorthTerritoryList.push({
        label: this.props.csrNorthTerritoryList[i].name,
        value: this.props.csrNorthTerritoryList[i].id,
      });
  
    }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Pending Complaints | Complaint Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Complaints" breadcrumbItem="Pending" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.pendingComplaintListColumns}
                      data={pendingComplaints}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.pendingComplaintListColumns}
                          data={pendingComplaints}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                  <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.togglePatientModal}
                                        tag="h4"
                                      >
                                        <span></span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">
                                                {/* <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Age
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.patient_age
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div> */}

                                                {/* <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Address
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .patient_address
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div> */}

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      E-mail
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.email
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Mobile No.
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.phone
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>

                                                  <div className="col-md-3">
                                                    <button
                                                      type="button"
                                                      className="btn btn-secondary"
                                                      onClick={() => {
                                                        navigator.clipboard.writeText(
                                                          this.state
                                                            .phone
                                                        );
                                                        this.setState({
                                                          btnText: "Copied",
                                                        });
                                                      }}
                                                    >
                                                      {this.state.btnText}
                                                    </button>
                                                  </div>
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
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
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                    />
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <div className="modal-header">
                                        <button
                                          type="button"
                                          className="btn-close"
                                          onClick={() =>
                                            this.setState({
                                              modal: false,
                                            })
                                          }
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                        ></button>
                                      </div>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            assignedTo:
                                              (this.state &&
                                                this.state.assignedTo) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            assignedTo: Yup.number().required(
                                              "Please select CSR to assign complaint"
                                            ),
                                          })}
                                          onSubmit={values => {
                                            const data = {
                                              id: this.state.id,
                                              assignedTo: values.assignedTo,
                                            };

                                            // Assign complaint
                                            onAssignComplaint(data);

                                            // Calling to update list record
                                            setTimeout(() => {
                                              onGetPendingComplaints();
                                            }, 1000);

                                            this.toggle();
                                          }}
                                        >
                                          
                                          {({ errors, status, touched }) => (
                                            
                                            <Form>
                                              <Row>
                                              <Col className="col-12">
                                                    <div className="mb-3">
                                                    <Label className="form-label">
                                                      Office
                                                    </Label>
                                                    <Field
                                                      name="office"
                                                      as="select"
                                                      className="form-control"
                                                      onChange={e => {
                                                        this.setState({
                                                          pendingComplaint: {
                                                         
                                                            office: e.target.value,
                                                          
                                                          },
                                                        });
                                                      }}
                                                      multiple={false}
                                                      value={
                                                        this.state.office
                                                      }
                                                    >
                                                       <option value="">
                                                      ---Select Office---
                                                      </option>
                                                      <option value="Central Office">
                                                      Central Office
                                                      </option>
                                                      <option value="South Office">
                                                      South Office
                                                      </option>
                                                      <option value="North Office">
                                                      North Office
                                                      </option>
                                                   
                                                    </Field>
                                                  </div>
                                               
                                          {this.state.pendingComplaint.office =="Central Office"
                                                &&(

                                                  <div className="mb-3 select2-container">
                                                    <Label>Assigned to</Label>
                                                    <Select
                                                      name="assignedTo"
                                                      component="Select"
                                                      onChange={selectedGroup => {
                                                        this.setState({
                                                          assignedTo:
                                                            selectedGroup.value,
                                                        });
                                                      }}
                                                      className={
                                                        "defautSelectParent" +
                                                        (errors.assignedTo
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      styles={{
                                                        control: (
                                                          base,
                                                          state
                                                        ) => ({
                                                          ...base,
                                                          borderColor:
                                                            errors.assignedTo
                                                              ? "#f46a6a"
                                                              : "#ced4da",
                                                        }),
                                                      }}
                                                      options={csrCentralTerritoryList}
                                                      placeholder="Select CSR..."
                                                    />
                                                    <ErrorMessage
                                                      name="assignedTo"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                )} 
                                                 {/* South Office */}
                                                 {this.state.pendingComplaint.office =="South Office"
                                                &&(

                                                  <div className="mb-3 select2-container">
                                                    <Label>Assigned to</Label>
                                                    <Select
                                                      name="assignedTo"
                                                      component="Select"
                                                      onChange={selectedGroup => {
                                                        this.setState({
                                                          assignedTo:
                                                            selectedGroup.value,
                                                        });
                                                      }}
                                                      className={
                                                        "defautSelectParent" +
                                                        (errors.assignedTo
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      styles={{
                                                        control: (
                                                          base,
                                                          state
                                                        ) => ({
                                                          ...base,
                                                          borderColor:
                                                            errors.assignedTo
                                                              ? "#f46a6a"
                                                              : "#ced4da",
                                                        }),
                                                      }}
                                                      options={csrSouthTerritoryList}
                                                      placeholder="Select CSR..."
                                                    />
                                                    <ErrorMessage
                                                      name="assignedTo"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                )} 
                                                 {/* North Office */}
                                                 {this.state.pendingComplaint.office =="North Office"
                                                &&(

                                                  <div className="mb-3 select2-container">
                                                    <Label>Assigned to</Label>
                                                    <Select
                                                      name="assignedTo"
                                                      component="Select"
                                                      onChange={selectedGroup => {
                                                        this.setState({
                                                          assignedTo:
                                                            selectedGroup.value,
                                                        });
                                                      }}
                                                      className={
                                                        "defautSelectParent" +
                                                        (errors.assignedTo
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      styles={{
                                                        control: (
                                                          base,
                                                          state
                                                        ) => ({
                                                          ...base,
                                                          borderColor:
                                                            errors.assignedTo
                                                              ? "#f46a6a"
                                                              : "#ced4da",
                                                        }),
                                                      }}
                                                      options={csrNorthTerritoryList}
                                                      placeholder="Select CSR..."
                                                    />
                                                    <ErrorMessage
                                                      name="assignedTo"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                )} 
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

                                    <Modal
                                      isOpen={this.state.messageModal}
                                      role="dialog"
                                      autoFocus={true}
                                      data-toggle="modal"
                                      centered
                                      toggle={this.toggleMessageModal}
                                    >
                                      <div className="modal-content">
                                        <div className="modal-header border-bottom-0">
                                          <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() =>
                                              this.setState({
                                                messageModal: false,
                                              })
                                            }
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                          ></button>
                                        </div>
                                        <div className="modal-body">
                                          <div className="text-center mb-4">
                                            <div className="avatar-md mx-auto mb-4">
                                              <div className="avatar-title bg-light rounded-circle text-primary h3">
                                                <i className="mdi mdi-email-open"></i>
                                              </div>
                                            </div>

                                            <div className="row justify-content-center">
                                              <div className="col-xl-10">
                                                <h4 className="text-primary">
                                                  Complaint Message
                                                </h4>
                                                <p className="text-muted font-size-14 mb-4">
                                                  {this.state.message}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
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

PendingComplaints.propTypes = {
  match: PropTypes.object,
  pendingComplaints: PropTypes.array,
  csrList: PropTypes.array,
  csrCentralTerritoryList: PropTypes.array,
  csrSouthTerritoryList:  PropTypes.array,
  csrNorthTerritoryList:  PropTypes.array,
  className: PropTypes.any,
  onGetPendingComplaints: PropTypes.func,
  onGetCSRList: PropTypes.func,
  onGetCsrCentralList: PropTypes.func,
  onGetCsrSouthList: PropTypes.func,
  onGetCsrNorthList: PropTypes.func,
  onAssignComplaint: PropTypes.func,
};
const mapStateToProps = ({ csrAdmin, staff, csrTerritoryList }) => ({
  pendingComplaints: csrAdmin.pendingComplaints,
  csrList: staff.csrList,
  csrCentralTerritoryList: csrTerritoryList.csrCentralTerritoryList,
  csrSouthTerritoryList: csrTerritoryList.csrSouthTerritoryList,
  csrNorthTerritoryList: csrTerritoryList.csrNorthTerritoryList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAssignComplaint: data => dispatch(assignComplaint(data)),
  onGetPendingComplaints: () => dispatch(getPendingComplaints()),
  onGetCSRList: () => dispatch(getCSRList()),
  onGetCsrCentralList: () => dispatch(getCsrCentralList()),
  onGetCsrSouthList: () => dispatch(getCsrSouthList()),
  onGetCsrNorthList: () => dispatch(getCsrNorthList()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PendingComplaints));
