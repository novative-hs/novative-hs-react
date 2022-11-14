import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import * as Yup from "yup";
import {
  Alert,
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
import Breadcrumbs from "components/Common/Breadcrumb";
import RatingTooltip from "react-rating-tooltip";
import { getPatientTestAppointmentsList } from "store/patient-test-appointments/actions";
import { addNewPatientFeedback } from "store/patient-feedback/actions";
import { updateTestAppointment } from "store/test-appointments/actions";

import "assets/scss/table.scss";

class TestAppointmentsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      patientTestAppointments: [],
      btnText: "Copy",
      id: "",
      reschedule_reason: "",
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      patientTestAppointment: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      patientTestAppointmentListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>{patientTestAppointment.id}</>
          ),
        },
        {
          dataField: "order_id",
          text: "Order ID",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              <strong>{patientTestAppointment.order_id}</strong>
            </>
          ),
        },
        // {
        //   dataField: "patient_unique_id",
        //   text: "Patient ID",
        //   sort: true,
        // },
        {
          dataField: "patient_name",
          text: "Name",
          sort: true,
        },
        {
          dataField: "relationsip_with_patient",
          text: "Booked for",
          sort: true,
        },
        // {
        //   dataField: "patient_city",
        //   text: "City",
        //   sort: true,
        // },
        // {
        //   dataField: "patient_district",
        //   text: "District",
        //   sort: true,
        // },
        {
          dataField: "booked_at",
          text: "Booked at",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              <span>
                {new Date(patientTestAppointment.booked_at).toLocaleString(
                  "en-US"
                )}
              </span>
            </>
          ),
        },
        {
          dataField: "appointment_requested_at",
          text: "Schedule time by Patient",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                {new Date(
                  testAppointment.appointment_requested_at
                ).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        {
          dataField: "is_home_sampling_availed",
          text: "Home sampling availing",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.is_home_sampling_availed == true ? (
                <span>Yes</span>
              ) : (
                <span>No</span>
              )}
            </>
          ),
        },
        {
          dataField: "estimated_sample_collection_at",
          text: "Estimated sample collection time by Lab",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.status == "Pending" ? (
                <span>Not available yet</span>
              ) : (
                <span>
                  {new Date(
                    patientTestAppointment.estimated_sample_collection_at
                  ).toLocaleString("en-US")}
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "sample_collected_at",
          text: "Sample collected at",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.status == "Pending" ||
              patientTestAppointment.status == "Confirmed" ||
              patientTestAppointment.status == "Rescheduled" ? (
                <span>Not available yet</span>
              ) : (
                <span>
                  {new Date(
                    patientTestAppointment.sample_collected_at
                  ).toLocaleString("en-US")}
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "collector_name",
          text: "Sample collector details",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.is_home_sampling_availed &&
                !testAppointment.collector_name && (
                  <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                    Not assigned
                  </span>
                )}

              {testAppointment.is_home_sampling_availed &&
                testAppointment.collector_name && (
                  <Link
                    to="#"
                    onClick={e => this.openCollectorModal(e, testAppointment)}
                  >
                    <i className="mdi mdi-eye font-size-14"></i> View
                  </Link>
                )}

              {!testAppointment.is_home_sampling_availed && (
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
                  Not availed
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "collection_status",
          text: "Collection Status",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
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
            </>
          ),
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.status == "Pending" && (
                <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                  {testAppointment.status}
                </span>
              )}

              {testAppointment.status == "Confirmed" && (
                <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-info">
                  {testAppointment.status}
                </span>
              )}

              {testAppointment.status == "Sample Collected" && (
                <span className="badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning">
                  {testAppointment.status}
                </span>
              )}

              {testAppointment.status == "Rescheduled" && (
                <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                  {testAppointment.status}
                </span>
              )}

              {testAppointment.status == "Result Uploaded" && (
                <span className="badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                  {testAppointment.status}
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "reschedule_count",
          text: "Reschedule Limit",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.reschedule_count > 1 && (
                <span className="text-danger">
                  {testAppointment.reschedule_count} Used, Limit Reached
                </span>
              )}

              {(!testAppointment.reschedule_reason ||
                testAppointment.reschedule_count < 2) && (
                <span className="text-info">
                  {testAppointment.reschedule_count} Used,{" "}
                  {2 - testAppointment.reschedule_count} Left
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "reschedule_reason",
          text: "Rescheduling Reason",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.reschedule_reason &&
                testAppointment.reschedule_reason == "Other" && (
                  <Link
                    className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger"
                    to="#"
                    onClick={e => this.openReasonModal(e, testAppointment)}
                  >
                    {testAppointment.reason.slice(0, 10) + "..."}
                  </Link>
                )}

              {testAppointment.reschedule_reason &&
                testAppointment.reschedule_reason != "Other" && (
                  <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
                    {testAppointment.reschedule_reason}
                  </span>
                )}

              {!testAppointment.reschedule_reason && (
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-primary">
                  Not Rescheduled
                </span>
              )}
              {/* <Link
                to="#"
                onClick={e => this.openMessageModal(e, testAppointment)}
              >
                {testAppointment.reschedule_reason.slice(0, 10) + "..."}
              </Link>{" "} */}
            </>
          ),
        },
        {
          dataField: "reschedule",
          text: "Rescheduling option",
          isDummyField: true,
          editable: false,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.reschedule_count < 2 &&
                testAppointment.is_home_sampling_availed &&
                testAppointment.collection_status == "Patient Unavailable" && (
                  <Link
                    className="btn btn-primary btn-rounded font-size-10"
                    to="#"
                    onClick={e =>
                      this.handleReschedulingClick(e, testAppointment.id)
                    }
                  >
                    Reschedule
                  </Link>
                )}

              {testAppointment.reschedule_count >= 2 &&
                testAppointment.is_home_sampling_availed && (
                  <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
                    Limit Exceeded
                  </span>
                )}

              {(!testAppointment.is_home_sampling_availed ||
                (testAppointment.reschedule_count < 2 &&
                  testAppointment.is_home_sampling_availed &&
                  testAppointment.collection_status !=
                    "Patient Unavailable")) && (
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
                  Not available
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "estimated_result_uploading_at",
          text: "Estimated turn around time by Lab",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.status == "Pending" ? (
                <span>Not available yet</span>
              ) : (
                <span>
                  {new Date(
                    patientTestAppointment.estimated_result_uploading_at
                  ).toLocaleString("en-US")}
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "result_uploaded_at",
          text: "Result uploaded at",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.status != "Result Uploaded" ? (
                <span>Not available yet</span>
              ) : (
                <span>
                  {new Date(
                    patientTestAppointment.result_uploaded_at
                  ).toLocaleString("en-US")}
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "dues",
          text: "Dues",
          sort: true,
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
          dataField: process.env.REACT_APP_BACKENDURL + "result",
          text: "Result",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.status == "Result Uploaded" &&
              patientTestAppointment.result_type == "File" ? (
                <Link
                  to={{
                    pathname:
                      process.env.REACT_APP_BACKENDURL +
                      patientTestAppointment.result,
                  }}
                  target="_blank"
                >
                  <i className="mdi mdi-eye font-size-14" id="edittooltip"></i>{" "}
                  View
                </Link>
              ) : patientTestAppointment.status == "Result Uploaded" &&
                patientTestAppointment.result_type == "Link" ? (
                <Link
                  to={{
                    pathname: patientTestAppointment.url,
                  }}
                  target="_blank"
                >
                  <i className="mdi mdi-eye font-size-14" id="edittooltip"></i>{" "}
                  View
                </Link>
              ) : (
                <span>Not uploaded</span>
              )}
            </>
          ),
        },
        {
          dataField: "feedback",
          text: "id",
          isDummyField: true,
          editable: false,
          text: "Rate Us",
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.status == "Result Uploaded" &&
              !patientTestAppointment.does_feedback_exist ? (
                <Link
                  className="text-warning font-size-12"
                  to="#"
                  onClick={e =>
                    this.handlePatientFeedbackClick(
                      e,
                      patientTestAppointment.id
                    )
                  }
                >
                  <i className="bx bxs-star font-size-14"></i> Give feedback
                </Link>
              ) : patientTestAppointment.status == "Result Uploaded" &&
                patientTestAppointment.does_feedback_exist ? (
                <span className="text-success font-size-12">
                  <i className="bx bxs-happy-alt font-size-14"></i> Given
                  feedback
                </span>
              ) : (
                <span className="text-secondary font-size-12">
                  <i className="bx bxs-notification-off font-size-14"></i> Not
                  available
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "invoice",
          text: "Invoice",
          isDummyField: true,
          editable: false,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              <Link
                className="btn btn-primary btn-rounded font-size-10"
                to={`/invoice-detail/${patientTestAppointment.id}`}
              >
                Invoice
              </Link>
            </>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.toggleCollectorModal = this.toggleCollectorModal.bind(this);
    this.toggleReschedulingModal = this.toggleReschedulingModal.bind(this);
    this.handlePatientFeedbackClick =
      this.handlePatientFeedbackClick.bind(this);
    // this.handlePatientFeedbackClicks = this.handlePatientFeedbackClicks.bind(this);
  }

  componentDidMount() {
    const { patientTestAppointments, onGetPatientTestAppointmentsList } =
      this.props;
    onGetPatientTestAppointmentsList(this.state.user_id);
    this.setState({ patientTestAppointments });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  openCollectorModal = (e, arg) => {
    this.setState({
      collectorModal: true,
      lab_name: arg.lab_name,
      collector_name: arg.collector_name,
      collector_cnic: arg.collector_cnic,
      collector_phone: arg.collector_phone,
      collector_photo: arg.collector_photo,
    });
  };

  toggleCollectorModal = () => {
    this.setState(prevState => ({
      collectorModal: !prevState.collectorModal,
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

  toggleReschedulingModal = () => {
    this.setState(prevState => ({
      reschedulingModal: !prevState.reschedulingModal,
    }));
  };

  handlePatientFeedbackClick = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.toggle();
  };

  handleReschedulingClick = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.toggleReschedulingModal();
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

    const { patientTestAppointments } = this.props;
    const feedback = this.state.feedback;
    const { onAddNewPatientFeedback, onGetPatientTestAppointmentsList } =
      this.props;

    const pageOptions = {
      sizePerPage: 100,
      totalSize: patientTestAppointments.length, // replace later with size(patientTestAppointments),
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
            <Breadcrumbs title="Test Appointments" breadcrumbItem=" List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.patientTestAppointmentListColumns}
                      data={patientTestAppointments}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.patientTestAppointmentListColumns}
                          data={patientTestAppointments}
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

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        <span></span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            rating:
                                              (this.state &&
                                                this.state.rating) ||
                                              "",
                                            review:
                                              (this.state &&
                                                this.state.review) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            rating: Yup.number().required(
                                              "Please select rating"
                                            ),
                                            review: Yup.string().required(
                                              "Please enter rescheduling reason"
                                            ),
                                          })}
                                          onSubmit={values => {
                                            const newPatientFeedback = {
                                              id: this.state.id,
                                              rating: this.state.rating,
                                              review: values.review,
                                            };

                                            // save new Feedback
                                            onAddNewPatientFeedback(
                                              newPatientFeedback
                                            );

                                            // Calling to update list record
                                            setTimeout(() => {
                                              onGetPatientTestAppointmentsList(
                                                this.state.user_id
                                              );
                                            }, 2000);

                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Rate your experience
                                                    </Label>
                                                    <p className="text-danger font-size-10">
                                                      {errors.rating}
                                                    </p>
                                                    <RatingTooltip
                                                      className="justify-content-between d-flex"
                                                      max={5}
                                                      name="rating"
                                                      tooltipContent={
                                                        this.state
                                                          .tooltipContent
                                                      }
                                                      onChange={rating =>
                                                        this.setState({
                                                          rating: rating,
                                                        })
                                                      }
                                                      value={this.state.rating}
                                                      ActiveComponent={
                                                        <i
                                                          key={"active_6"}
                                                          className="mdi mdi-star text-primary"
                                                          style={
                                                            this.state.starStyle
                                                          }
                                                        />
                                                      }
                                                      InActiveComponent={
                                                        <i
                                                          key={"active_06"}
                                                          className="mdi mdi-star-outline text-muted"
                                                          style={
                                                            this.state.starStyle
                                                          }
                                                        />
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="rating"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      What is your feedback?
                                                    </Label>
                                                    <Field
                                                      name="review"
                                                      as="textarea"
                                                      rows="4"
                                                      cols="50"
                                                      className={
                                                        "form-control" +
                                                        (errors.review &&
                                                        touched.review
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={this.state.review}
                                                      onChange={e =>
                                                        this.setState({
                                                          review:
                                                            e.target.value,
                                                        })
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="review"
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

                                    <Modal
                                      isOpen={this.state.collectorModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleCollectorModal}
                                        tag="h4"
                                      >
                                        <span></span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">
                                                <div className="mb-3">
                                                  <center>
                                                    <img
                                                      src={
                                                        process.env
                                                          .REACT_APP_BACKENDURL +
                                                        "/media/" +
                                                        this.state
                                                          .collector_photo
                                                      }
                                                      alt="Photo"
                                                      width="50%"
                                                      height="50%"
                                                      className="img-thumbnail mx-auto rounded"
                                                    />
                                                  </center>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Lab name
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_name
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Name
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .collector_name
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      CNIC
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .collector_cnic
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
                                                        this.state
                                                          .collector_phone
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
                                                            .collector_phone
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
                                      isOpen={this.state.reschedulingModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleReschedulingModal}
                                        tag="h4"
                                      >
                                        <span></span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            reschedule_reason:
                                              (this.state &&
                                                this.state.reschedule_reason) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            reschedule_reason:
                                              Yup.string().required(
                                                "Please enter rescheduling reason"
                                              ),
                                          })}
                                          onSubmit={values => {
                                            const data = {
                                              id: this.state.id,
                                              reschedule_reason:
                                                values.reschedule_reason,
                                              rescheduledBy: "Patient",
                                              status: "Rescheduled",
                                              process: "rescheduling",
                                            };

                                            // save new Feedback
                                            console.log(
                                              this.props.onUpdateTestAppointment(
                                                data
                                              )
                                            );

                                            // Calling to update list record
                                            setTimeout(() => {
                                              onGetPatientTestAppointmentsList(
                                                this.state.user_id
                                              );
                                            }, 1000);

                                            this.toggleReschedulingModal();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      What is rescheduling
                                                      reason?
                                                    </Label>
                                                    <Field
                                                      name="reschedule_reason"
                                                      as="textarea"
                                                      rows="4"
                                                      cols="50"
                                                      className={
                                                        "form-control" +
                                                        (errors.reschedule_reason &&
                                                        touched.reschedule_reason
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="reschedule_reason"
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

TestAppointmentsList.propTypes = {
  match: PropTypes.object,
  patientTestAppointments: PropTypes.array,
  className: PropTypes.any,
  onGetPatientTestAppointmentsList: PropTypes.func,
  onAddNewPatientFeedback: PropTypes.func,
  onUpdateTestAppointment: PropTypes.func,
};
const mapStateToProps = ({ patientTestAppointments }) => ({
  patientTestAppointments: patientTestAppointments.patientTestAppointmentsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAddNewPatientFeedback: feedback =>
    dispatch(addNewPatientFeedback(feedback)),
  onGetPatientTestAppointmentsList: id =>
    dispatch(getPatientTestAppointmentsList(id)),
  onUpdateTestAppointment: testAppointment =>
    dispatch(updateTestAppointment(testAppointment)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestAppointmentsList));