import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Modal, Label, ModalBody, ModalHeader} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Tooltip from "@material-ui/core/Tooltip";


import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import {
  getTestAppointmentsCompletedList,
  updateTestAppointment,
} from "store/test-appointments/actions";

import "assets/scss/table.scss";

class TestAppointmentsCompletedList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      testAppointments: [],
      testAppointment: "",
      btnText: "Copy",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      testAppointmentListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, testAppointment) => (
            <>{testAppointment.id}</>
          ),
        },
        {
          dataField: "order_id",
          text: "Order ID",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <strong>{testAppointment.order_id}</strong>
            </>
          ),
        },
        {
          dataField: "name",
          text: "Patient name",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                  <Link
                    to="#"
                    onClick={e => this.openPatientModal(e, testAppointment)}
                  >
                   {testAppointment.patient_name}
                  </Link>
              </span>
            </>
          ),
        },
        // {
        //   dataField: "booked_at",
        //   text: "Booked at",
        //   sort: true,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       <span>
        //         {new Date(testAppointment.booked_at).toLocaleString("en-US")}
        //       </span>
        //     </>
        //   ),
        // },
        {
          dataField: "is_home_sampling_availed",
          text: "Home sampling",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.is_home_sampling_availed == true ? (
                <span>Yes</span>
              ) : (
                <span>No</span>
              )}
            </>
          ),
        },
        {
          dataField: "estimated_sample_collection_at",
          text: "Collection time by Lab",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.status == "Pending" ? (
                <span>Not available yet</span>
              ) : null}

              {testAppointment.status != "Pending" ? (
                <span>
                  {new Date(
                    testAppointment.estimated_sample_collection_at
                  ).toLocaleString("en-US")}
                </span>
              ) : null}
            </>
          ),
        },
        
        {
          dataField: "sample_collected_at",
          text: "Sample collected at",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.status == "Pending" ||
              testAppointment.status == "Confirmed" ||
              testAppointment.status == "Rescheduled" ? (
                <span>Not available yet</span>
              ) : (
                <span>
                  {new Date(testAppointment.sample_collected_at).toLocaleString(
                    "en-US"
                  )}
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "sample_collector",
          text: "Sample Collector",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                <span>
                  {testAppointment.is_home_sampling_availed &&
                    !testAppointment.collector_name && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                        Not assigned
                      </span>
                    )}

                  {testAppointment.is_home_sampling_availed &&
                    testAppointment.collector_name && (
                      <span>{testAppointment.collector_name}</span>
                    )}

                  {!testAppointment.is_home_sampling_availed && (
                    <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
                      Not availed
                    </span>
                  )}
                  {testAppointment.is_home_sampling_availed &&
                    !testAppointment.collection_status && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                        Pending
                      </span>
                    )}

                  {testAppointment.is_home_sampling_availed &&
                    testAppointment.collection_status == "Assigned" && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-primary">
                        {testAppointment.collection_status}
                      </span>
                    )}

                  {testAppointment.is_home_sampling_availed &&
                    testAppointment.collection_status == "On way" && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning">
                        {testAppointment.collection_status}
                      </span>
                    )}

                  {testAppointment.is_home_sampling_availed &&
                    testAppointment.collection_status == "Reached" && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
                        {testAppointment.collection_status}
                      </span>
                    )}

                  {testAppointment.is_home_sampling_availed &&
                    testAppointment.collection_status == "Patient Unavailable" && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                        {testAppointment.collection_status}
                      </span>
                    )}

                  {testAppointment.is_home_sampling_availed &&
                    testAppointment.collection_status == "Sample+Payment Collected" && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                        {testAppointment.collection_status}
                      </span>
                    )}
                  {testAppointment.is_home_sampling_availed &&
                    testAppointment.collection_status == "Sample+Payment Delivered" && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                        {testAppointment.collection_status}
                      </span>
                    )}

                  {!testAppointment.is_home_sampling_availed && (
                    <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
                      Not availed
                    </span>
                  )}
                </span>
              </span>
            </>
          ),
        },
        {
          dataField: "payment_status",
          text: "Payment Status",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.payment_status == "Not Paid" ? (
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
                  {testAppointment.payment_method},{" "}
                  {testAppointment.payment_status}
                </span>
              ) : (
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-info">
                  {testAppointment.payment_method},{" "}
                  {testAppointment.payment_status}
                </span>
              )}
            </>
          ),
        }, 
        {
          dataField: "estimated_result_uploading_at",
          text: "Reporting Time by Lab",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.status == "Pending" ? (
                <span>Not available yet</span>
              ) : null}

              {testAppointment.status != "Pending" ? (
                <span>
                  {new Date(
                    testAppointment.estimated_result_uploading_at
                  ).toLocaleString("en-US")}
                </span>
              ) : null}
            </>
          ),
        },
        {
          dataField: process.env.REACT_APP_BACKENDURL + "result",
          text: "Result",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
            <div className="d-flex gap-3">
              <Link className="text-success" to="#">
              <Tooltip title="Reschedual Appoitment Info">
                <i
                  className="mdi mdi-calendar-clock font-size-18"
                  id="edittooltip"
                  onClick={e => this.openReshedualModal(e, testAppointment)
                  }
                ></i>
              </Tooltip>

              </Link>
              {testAppointment.result_type == "File" ? (
                <Link
                  to={{
                    pathname:
                      process.env.REACT_APP_BACKENDURL + testAppointment.result,
                  }}
                  target="_blank"
                >
                  View
                </Link>
              ) : (
                <Link
                  to={{
                    pathname: testAppointment.url,
                  }}
                  target="_blank"
                >
                  View
                </Link>
              )}
              
            </div>
              
            </>
          ),
        },
      ],
    };
    // this.toggle = this.toggle.bind(this);
    this.toggleReasonModal = this.toggleReasonModal.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    this.toggleReshedualModal = this.toggleReshedualModal.bind(this);

  }

  componentDidMount() {
    const { onGetTestAppointmentsCompletedList } = this.props;
    onGetTestAppointmentsCompletedList(this.state.user_id);
    this.setState({ testAppointments: this.props.testAppointments });
  }

  // toggle() {
  //   this.setState(prevState => ({
  //     modal: !prevState.modal,
  //   }));
  // }
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      appointment_requested_at: arg.appointment_requested_at,
      patient_unique_id: arg.patient_unique_id,
      patient_gender: arg.patient_gender,
      patient_address: arg.patient_address,
      patient_city: arg.patient_city,
      patient_phone: arg.patient_phone,
      booked_at: arg.booked_at,
    });
  };
  openReshedualModal = (e, arg) => {
    this.setState({
      ReshedualModal: true,
      reschedule_reason: arg.reschedule_reason,
      reason: arg.reason,
      reschedule_count: arg.reschedule_count,
      rescheduled_at: arg.rescheduled_at,
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
  toggleReshedualModal = () => {
    this.setState(prevState => ({
      ReshedualModal: !prevState.ReshedualModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  openReasonModal = (e, arg) => {
    this.setState({ reasonModal: true, reason: arg.reason });
  };

  toggleReasonModal = () => {
    this.setState(prevState => ({
      reasonModal: !prevState.reasonModal,
    }));
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

    const { testAppointments } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: testAppointments.length, // replace later with size(testAppointments),
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
            <title>Test Appointments List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Test Appointments"
              breadcrumbItem="Completed List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.testAppointmentListColumns}
                      data={testAppointments}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.testAppointmentListColumns}
                          data={testAppointments}
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
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Patient Unique Id
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.patient_unique_id
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
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
                                                </div>

                                                <div className="mb-3 row">
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
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      City
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.patient_city
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Schedule time by Patient
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.appointment_requested_at
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Booked At
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.booked_at
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
                                                        this.state.patient_phone
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
                                                            .patient_phone
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
                                  <Modal
                                      isOpen={this.state.ReshedualModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleReshedualModal}
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
                                                    reschedule_reason
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.reschedule_reason
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div> */}
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                    Reschedule Reason
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.reschedule_reason
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                    Reschedule Count
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.reschedule_count
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Reschedule time
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.rescheduled_at
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
                                  <Modal
                                    isOpen={this.state.reasonModal}
                                    role="dialog"
                                    autoFocus={true}
                                    data-toggle="modal"
                                    centered
                                    toggle={this.toggleReasonModal}
                                  >
                                    <div className="modal-content">
                                      <div className="modal-header border-bottom-0">
                                        <button
                                          type="button"
                                          className="btn-close"
                                          onClick={() =>
                                            this.setState({
                                              reasonModal: false,
                                            })
                                          }
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                        ></button>
                                      </div>
                                      <div className="modal-body">
                                        <div className="text-center mb-4">
                                          {/* <div className="avatar-md mx-auto mb-4">
                                              <div className="avatar-title bg-light rounded-circle text-primary h3">
                                                <i className="mdi mdi-email-open"></i>
                                              </div>
                                            </div> */}

                                          <div className="row justify-content-center">
                                            <div className="col-xl-10">
                                              <h4 className="text-danger">
                                                Rescheduling Reason
                                              </h4>
                                              <p className="text-muted font-size-14 mb-4">
                                                {this.state.reason}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </Modal>
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

TestAppointmentsCompletedList.propTypes = {
  match: PropTypes.object,
  testAppointments: PropTypes.array,
  className: PropTypes.any,
  onGetTestAppointmentsCompletedList: PropTypes.func,
  // onUpdateTestAppointment: PropTypes.func,
};

const mapStateToProps = ({ testAppointments }) => ({
  testAppointments: testAppointments.testAppointmentsCompletedList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetTestAppointmentsCompletedList: id =>
    dispatch(getTestAppointmentsCompletedList(id)),
  // onUpdateTestAppointment: testAppointment =>
  //   dispatch(updateTestAppointment(testAppointment)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestAppointmentsCompletedList));