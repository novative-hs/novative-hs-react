import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import appointmentImg from "assets/images";
import {
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Row,
  Modal,
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

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import {
  getTestAppointmentsPendingList,
  updateTestAppointment,
} from "store/test-appointments/actions";

import { isEmpty, result, size, values } from "lodash";
import images from "assets/images";

class TestAppointmentsPendingList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      selectedFiles: [],
      testAppointments: [],
      patient: [],
      appointmentImg: "",
      testAppointment: "",
      modal: false,
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
          dataField: "patient_name",
          text: "patient",
          sort: true,
        },
        {
          dataField: "offered_test_name",
          text: "offered test ",
          sort: true,
        },
        {
          dataField: "patient_age",
          text: "patient age",
          sort: true,
        },
        {
          dataField: "patient_gender",
          text: "patient gender",
          sort: true,
        },
        {
          dataField: "booking_date_time",
          text: "booking date time",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                {new Date(testAppointment.booking_date_time).toLocaleString(
                  "en-US"
                )}
              </span>
            </>
          ),
        },
        {
          dataField: "requested_appointment_date_time",
          text: " requested appointment date time",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                {new Date(
                  testAppointment.requested_appointment_date_time
                ).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        {
          dataField: "sample_collection_date_time",
          text: "sample collection date time",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                {new Date(
                  testAppointment.sample_collection_date_time
                ).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        {
          dataField: "result_upload_date_time",
          text: "result upload date time",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                {new Date(
                  testAppointment.result_upload_date_time
                ).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, testAppointment) => (
            <div className="d-flex gap-3">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() =>
                    this.handleTestAppointmentClick(testAppointment)
                  }
                ></i>
              </Link>
            </div>
          ),
        },
      ],
    };
    this.handleTestAppointmentClick =
      this.handleTestAppointmentClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleTestAppointmentClicks =
      this.handleTestAppointmentClicks.bind(this);
  }

  componentDidMount() {
    const { testAppointments, onGetTestAppointmentsPendingList } = this.props;
    if (testAppointments && !testAppointments.length) {
      setTimeout(() => {
        onGetTestAppointmentsPendingList();
      }, 1000);
    }
    this.setState({ testAppointments });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleTestAppointmentClicks = () => {
    this.setState({ testAppointment: "", appointmentImg: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { testAppointments } = this.props;
    if (
      !isEmpty(testAppointments) &&
      size(prevProps.testAppointments) !== size(testAppointments)
    ) {
      this.setState({ testAppointments: {}, isEdit: false });
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
  handleTestAppointmentClick = arg => {
    const testAppointment = arg;

    this.setState({
      testAppointment: {
        id: testAppointment.id,
        patient_name: testAppointment.patient_name,
        offered_test_name: testAppointment.offered_test_name,
        patient_id: testAppointment.patient_id,
        offered_test_id: testAppointment.offered_test_id,
        patient_age: testAppointment.patient_age,
        patient_gender: testAppointment.patient_gender,
        booking_date_time: testAppointment.booking_date_time,
        requested_appointment_date_time:
          testAppointment.requested_appointment_date_time,
        sample_collection_date_time:
          testAppointment.sample_collection_date_time,
        result_upload_date_time: testAppointment.result_upload_date_time,
        status: testAppointment.status,
        result: "",
      },
      appointmentImg: "",
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { testAppointments } = this.props;
    const { isEdit } = this.state;

    const { onUpdateTestAppointment, onGetTestAppointmentsPendingList } =
      this.props;
    const { selectedTestAppointment } = this.state;
    const testAppointment = this.state.testAppointment;

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

    const selectRow = {
      mode: "checkbox",
    };

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Test Appointments List | Ilaaj4u</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Test Appointments"
              breadcrumbItem="Pending List"
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
                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      selectRow={selectRow}
                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-nowrap table-hover"
                                      }
                                      bordered={false}
                                      striped={false}
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
                                        {!!isEdit
                                          ? "Edit Test Appointment"
                                          : "Add Test Appointment"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            patient_id:
                                              (testAppointment &&
                                                testAppointment.patient_id) ||
                                              "",
                                            offered_test_id:
                                              (testAppointment &&
                                                testAppointment.offered_test_id) ||
                                              "",
                                            patient_name:
                                              (testAppointment &&
                                                testAppointment.patient_name) ||
                                              "",
                                            offered_test_name:
                                              (testAppointment &&
                                                testAppointment.offered_test_name) ||
                                              "",
                                            patient_age:
                                              (testAppointment &&
                                                testAppointment.patient_age) ||
                                              "",
                                            patient_gender:
                                              (testAppointment &&
                                                testAppointment.patient_gender) ||
                                              "",
                                            booking_date_time:
                                              (testAppointment &&
                                                testAppointment.booking_date_time) ||
                                              "",
                                            requested_appointment_date_time:
                                              (testAppointment &&
                                                testAppointment.requested_appointment_date_time) ||
                                              "",
                                            sample_collection_date_time:
                                              (testAppointment &&
                                                testAppointment.sample_collection_date_time) ||
                                              "",
                                            result_upload_date_time:
                                              (testAppointment &&
                                                testAppointment.result_upload_date_time) ||
                                              "",
                                            status:
                                              (testAppointment &&
                                                testAppointment.status) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            booking_date_time:
                                              Yup.string().required(
                                                "Please enter date time"
                                              ),
                                            requested_appointment_date_time:
                                              Yup.string().required(
                                                "Please enter date time"
                                              ),
                                            sample_collection_date_time:
                                              Yup.string().required(
                                                "Please enter date time"
                                              ),
                                            result_upload_date_time:
                                              Yup.string().required(
                                                "Please enter date time"
                                              ),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              const updateTestAppointment = {
                                                id: testAppointment.id,
                                                patient_id: parseInt(
                                                  values.patient_id
                                                ),
                                                offered_test_id: parseInt(
                                                  values.offered_test_id
                                                ),
                                                patient_name:
                                                  values.patient_name,
                                                offered_test_name:
                                                  values.offered_test_name,
                                                patient_age: values.patient_age,
                                                patient_gender:
                                                  values.patient_gender,
                                                booking_date_time:
                                                  values.booking_date_time,
                                                requested_appointment_date_time:
                                                  values.requested_appointment_date_time,
                                                sample_collection_date_time:
                                                  values.sample_collection_date_time,
                                                result_upload_date_time:
                                                  values.result_upload_date_time,
                                                status: values.status,
                                                result: "",
                                              };

                                              // update TestAppointment
                                              onUpdateTestAppointment(
                                                updateTestAppointment
                                              );

                                              setTimeout(() => {
                                                onGetTestAppointmentsPendingList();
                                              }, 1000);
                                            }
                                            this.setState({
                                              selectedTestAppointment: null,
                                            });
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
                                                      patient name
                                                    </Label>
                                                    <Field
                                                      name="patient_name"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .patient_name
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              patient_id:
                                                                testAppointment.patient_id,
                                                              offered_test_id:
                                                                testAppointment.offered_test_id,

                                                              patient_name:
                                                                e.target.value,
                                                              offered_test_name:
                                                                testAppointment.offered_test_name,
                                                              patient_age:
                                                                testAppointment.patient_age,
                                                              patient_gender:
                                                                testAppointment.patient_gender,
                                                              booking_date_time:
                                                                testAppointment.booking_date_time,
                                                              requested_appointment_date_time:
                                                                testAppointment.requested_appointment_date_time,
                                                              sample_collection_date_time:
                                                                testAppointment.sample_collection_date_time,
                                                              result_upload_date_time:
                                                                testAppointment.result_upload_date_time,
                                                              status:
                                                                testAppointment.status,
                                                              result: "",
                                                            },
                                                          });
                                                        }
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.patient_id &&
                                                        touched.patient_id
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      readOnly={true}
                                                      multiple={false}
                                                    />
                                                    <ErrorMessage
                                                      name="name"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      offered test name
                                                    </Label>
                                                    <Field
                                                      name="offered_test_name"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .offered_test_name
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              patient_id:
                                                                testAppointment.patient_id,
                                                              offered_test_id:
                                                                testAppointment.offered_test_id,
                                                              patient_name:
                                                                testAppointment.offered_test_name,
                                                              offered_test_name:
                                                                e.target.value,
                                                              patient_age:
                                                                testAppointment.patient_age,
                                                              patient_gender:
                                                                testAppointment.patient_gender,
                                                              booking_date_time:
                                                                testAppointment.booking_date_time,
                                                              requested_appointment_date_time:
                                                                testAppointment.requested_appointment_date_time,
                                                              sample_collection_date_time:
                                                                testAppointment.sample_collection_date_time,
                                                              result_upload_date_time:
                                                                testAppointment.result_upload_date_time,
                                                              status:
                                                                testAppointment.status,
                                                              result: "",
                                                            },
                                                          });
                                                        }
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.offered_test_id &&
                                                        touched.offered_test_id
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      readOnly={true}
                                                      multiple={false}
                                                    />
                                                    <ErrorMessage
                                                      name="name"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      patient age
                                                    </Label>
                                                    <Field
                                                      name="patient_age"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .patient_age
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              patient_id:
                                                                testAppointment.patient_id,
                                                              offered_test_id:
                                                                testAppointment.offered_test_id,
                                                              patient_name:
                                                                testAppointment.patient_name,
                                                              offered_test_name:
                                                                testAppointment.offered_test_name,
                                                              patient_age:
                                                                e.target.value,
                                                              patient_gender:
                                                                testAppointment.patient_gender,
                                                              booking_date_time:
                                                                testAppointment.booking_date_time,
                                                              requested_appointment_date_time:
                                                                testAppointment.requested_appointment_date_time,
                                                              sample_collection_date_time:
                                                                testAppointment.sample_collection_date_time,
                                                              result_upload_date_time:
                                                                testAppointment.result_upload_date_time,
                                                              status:
                                                                testAppointment.status,
                                                              result: "",
                                                            },
                                                          });
                                                        }
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.patient_age &&
                                                        touched.patient_age
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      readOnly={true}
                                                      multiple={false}
                                                    />
                                                    <ErrorMessage
                                                      name="patient_age"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      patient gender
                                                    </Label>
                                                    <Field
                                                      name="patient_gender"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .patient_gender
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              patient_id:
                                                                testAppointment.patient_id,
                                                              offered_test_id:
                                                                testAppointment.offered_test_id,
                                                              patient_name:
                                                                testAppointment.patient_name,
                                                              offered_test_name:
                                                                testAppointment.offered_test_name,
                                                              patient_age:
                                                                testAppointment.patient_age,
                                                              patient_gender:
                                                                e.target.value,
                                                              booking_date_time:
                                                                testAppointment.booking_date_time,
                                                              requested_appointment_date_time:
                                                                testAppointment.requested_appointment_date_time,
                                                              sample_collection_date_time:
                                                                testAppointment.sample_collection_date_time,
                                                              result_upload_date_time:
                                                                testAppointment.result_upload_date_time,
                                                              status:
                                                                testAppointment.status,
                                                              result: "",
                                                            },
                                                          });
                                                        }
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.patient_gender &&
                                                        touched.patient_gender
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      readOnly={true}
                                                      multiple={false}
                                                    ></Field>
                                                    <ErrorMessage
                                                      name="patient_gender"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      booking date time
                                                    </Label>
                                                    <input
                                                      name="booking_date_time"
                                                      type="datetime-local"
                                                      readOnly={true}
                                                      defaultValue={this.state.testAppointment.booking_date_time.slice(
                                                        0,
                                                        -4
                                                      )}
                                                      className={
                                                        "form-control" +
                                                        (errors.booking_date_time &&
                                                        touched.booking_date_time
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="booking_date_time"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      requested appointment date
                                                      time
                                                    </Label>
                                                    <input
                                                      name="requested_appointment_date_time"
                                                      type="datetime-local"
                                                      readOnly={true}
                                                      defaultValue={this.state.testAppointment.requested_appointment_date_time.slice(
                                                        0,
                                                        -4
                                                      )}
                                                      className={
                                                        "form-control" +
                                                        (errors.requested_appointment_date_time &&
                                                        touched.requested_appointment_date_time
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="requested_appointment_date_time"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      sample collection date
                                                      time
                                                    </Label>
                                                    <input
                                                      name="sample_collection_date_time"
                                                      type="datetime-local"
                                                      defaultValue={this.state.testAppointment.sample_collection_date_time.slice(
                                                        0,
                                                        -4
                                                      )}
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              patient_id:
                                                                testAppointment.patient_id,
                                                              offered_test_id:
                                                                testAppointment.offered_test_id,
                                                              patient_name:
                                                                testAppointment.patient_name,
                                                              offered_test_name:
                                                                testAppointment.offered_test_name,
                                                              patient_age:
                                                                testAppointment.patient_age,
                                                              patient_gender:
                                                                testAppointment.patient_gender,
                                                              booking_date_time:
                                                                testAppointment.booking_date_time,
                                                              requested_appointment_date_time:
                                                                testAppointment.requested_appointment_date_time,
                                                              sample_collection_date_time:
                                                                e.target.value +
                                                                ":00Z",
                                                              result_upload_date_time:
                                                                testAppointment.result_upload_date_time,
                                                              status:
                                                                testAppointment.status,
                                                              result: "",
                                                            },
                                                          });
                                                        }
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.sample_collection_date_time &&
                                                        touched.sample_collection_date_time
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="sample_collection_date_time"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      result upload date time
                                                    </Label>
                                                    <input
                                                      name="result_upload_date_time"
                                                      type="datetime-local"
                                                      defaultValue={this.state.testAppointment.result_upload_date_time.slice(
                                                        0,
                                                        -4
                                                      )}
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              patient_id:
                                                                testAppointment.patient_id,
                                                              offered_test_id:
                                                                testAppointment.offered_test_id,
                                                              patient_name:
                                                                testAppointment.patient_name,
                                                              offered_test_name:
                                                                testAppointment.offered_test_name,
                                                              patient_age:
                                                                testAppointment.patient_age,
                                                              patient_gender:
                                                                testAppointment.patient_gender,
                                                              booking_date_time:
                                                                testAppointment.booking_date_time,
                                                              requested_appointment_date_time:
                                                                testAppointment.requested_appointment_date_time,
                                                              sample_collection_date_time:
                                                                testAppointment.sample_collection_date_time,
                                                              result_upload_date_time:
                                                                e.target.value +
                                                                ":00Z",
                                                              status:
                                                                testAppointment.status,
                                                              result: "",
                                                            },
                                                          });
                                                        }
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.result_upload_date_time &&
                                                        touched.result_upload_date_time
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="result_upload_date_time"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      status
                                                    </Label>
                                                    <Field
                                                      name="status"
                                                      as="select"
                                                      value={
                                                        testAppointment.status
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              patient_id:
                                                                testAppointment.patient_id,
                                                              offered_test_id:
                                                                testAppointment.offered_test_id,
                                                              patient_name:
                                                                testAppointment.patient_name,
                                                              offered_test_name:
                                                                testAppointment.offered_test_name,
                                                              patient_age:
                                                                testAppointment.patient_age,
                                                              patient_gender:
                                                                testAppointment.patient_gender,
                                                              booking_date_time:
                                                                testAppointment.booking_date_time,
                                                              requested_appointment_date_time:
                                                                testAppointment.requested_appointment_date_time,
                                                              sample_collection_date_time:
                                                                testAppointment.sample_collection_date_time,
                                                              result_upload_date_time:
                                                                testAppointment.result_upload_date_time,
                                                              status:
                                                                e.target.value,
                                                              result:
                                                                this.state
                                                                  .appointmentImg,
                                                            },
                                                          });
                                                        }
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.status &&
                                                        touched.status
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      readOnly={false}
                                                      multiple={false}
                                                    >
                                                      <option value="Pending">
                                                        Pending
                                                      </option>
                                                      <option value="Confirmed">
                                                        Confirmed
                                                      </option>
                                                    </Field>

                                                    <ErrorMessage
                                                      name="status"
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

TestAppointmentsPendingList.propTypes = {
  match: PropTypes.object,
  testAppointments: PropTypes.array,
  className: PropTypes.any,
  onGetTestAppointmentsPendingList: PropTypes.func,
  onUpdateTestAppointment: PropTypes.func,
};

const mapStateToProps = ({ testAppointments }) => ({
  testAppointments: testAppointments.testAppointmentsPendingList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetTestAppointmentsPendingList: () =>
    dispatch(getTestAppointmentsPendingList(ownProps.match.params.id)),
  onUpdateTestAppointment: testAppointment =>
    dispatch(updateTestAppointment(testAppointment)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestAppointmentsPendingList));
