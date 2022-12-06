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
  ModalHeader,
  ModalBody,
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
  getResolvedComplaints,
  assignComplaint,
  //   getCSRList,
} from "store/csr-admin/actions";

import "assets/scss/table.scss";

class ResolvedComplaints extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      resolvedComplaints: [],
      id: "",
      btnText: "Copy",
      assignedTo: "",
      ResolvedComplaints: "",
      resolvedComplaint: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      resolvedComplaintListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, resolvedComplaint) => (
            <>{resolvedComplaint.id}</>
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
          text: "Name",
          sort: true,
          formatter: (cellContent, resolvedComplaint) => (
            <>
              <span>
                  <Link
                    to="#"
                    onClick={e => this.openPatientModal(e, resolvedComplaint)}
                  >
                   {resolvedComplaint.name}
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
          text: "Subject",
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
          dataField: "csr_name",
          text: "Assigned to",
          sort: true,
        },
        {
          dataField: "assigned_at",
          text: "Assigned at",
          sort: true,
          formatter: (cellContent, complaint) => (
            <>
              <span>
                {new Date(complaint.assigned_at).toLocaleString("en-US")}
              </span>
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
          formatter: (cellContent, resolvedComplaint) => (
            <>
                  {/* {resolvedComplaint.complainee},{" "} */}
                  {resolvedComplaint.labhazir_complainee}{" "}
                  {resolvedComplaint.lab_name}
            </>
          ),
        },
        {
          dataField: "handled_at",
          text: "Handled at",
          sort: true,
          formatter: (cellContent, complaint) => (
            <>
              <span>
                {new Date(complaint.handled_at).toLocaleString("en-US")}
              </span>
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
    const { resolvedComplaints, onGetResolvedComplaints } = this.props;
    onGetResolvedComplaints();
    this.setState({ resolvedComplaints });
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

  handleApprovedEvent = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.toggle();
  };

  toggleMessageModal = () => {
    this.setState(prevState => ({
      messageModal: !prevState.messageModal,
    }));
  };

  openMessageModal = (e, arg) => {
    this.setState({ messageModal: true, message: arg.message });
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

    const { resolvedComplaints } = this.props;
    const data = this.state.data;
    const { onAssignComplaint, onGetResolvedComplaints } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: resolvedComplaints.length, // replace later with size(resolvedComplaints),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Resolved Complaints | Complaint Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Complaints" breadcrumbItem="Resolved" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.resolvedComplaintListColumns}
                      data={resolvedComplaints}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.resolvedComplaintListColumns}
                          data={resolvedComplaints}
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
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                    />
                                  </div>
                                </Col>
                              </Row>
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
                              {/* <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row> */}
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

ResolvedComplaints.propTypes = {
  match: PropTypes.object,
  resolvedComplaints: PropTypes.array,
  csrList: PropTypes.array,
  className: PropTypes.any,
  onGetResolvedComplaints: PropTypes.func,
  onAssignComplaint: PropTypes.func,
};
const mapStateToProps = ({ csrAdmin }) => ({
  resolvedComplaints: csrAdmin.resolvedComplaints,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAssignComplaint: data => dispatch(assignComplaint(data)),
  onGetResolvedComplaints: () => dispatch(getResolvedComplaints()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ResolvedComplaints));
