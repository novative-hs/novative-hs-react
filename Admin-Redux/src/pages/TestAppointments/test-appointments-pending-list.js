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
  Input
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
      appointmentImg:"",
      testAppointment: "",
      modal: false,
      testAppointmentListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, testAppointment) => <>{testAppointment.id}</>,
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
        },
        {
          dataField: "requested_appointment_date_time",
          text: " requested appointment date time",
          sort: true,
        },
        {
          dataField: "sample_collection_date_time",
          text: "sample collection date time",
          sort: true,
        },
        {
          dataField: "result_upload_date_time",
          text: "result upload date time",
          sort: true,
        },
        {
          dataField: "status",
          text: "status",
          sort: true,
        },
         {
          dataField: "http://127.0.0.1:8000" + "result",
          text: "result",
          sort: true,
          formatter: (cellContent, testAppointment) => (
             <>
                <Link to={{ pathname: "http://127.0.0.1:8000" + testAppointment.result }} target="_blank">
                  Test Result
                </Link>
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
                  onClick={() => this.handleTestAppointmentClick( testAppointment)}
                ></i>
              </Link>
            </div>
          ),
        },
      ],
    };
    this.handleTestAppointmentClick = this.handleTestAppointmentClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleTestAppointmentClicks = this.handleTestAppointmentClicks.bind(this);
  }
  
  // // The code for converting "image source" (url) to "Base64"
  // toDataURL = url =>
  //   fetch(url)
  //     .then(response => response.blob())
  //     .then(
  //       blob =>
  //         new Promise((resolve, reject) => {
  //           const reader = new FileReader();
  //           reader.onloadend = () => resolve(reader.result);
  //           reader.onerror = reject;
  //           reader.readAsDataURL(blob);
  //         })
  //     );

  // // The code for converting "Base64" to javascript "File Object"
  // dataURLtoFile = (dataurl, filename) => {
  //   var arr = dataurl.split(","),
  //     mime = arr[0].match(/:(.*?);/)[1],
  //     bstr = atob(arr[1]),
  //     n = bstr.length,
  //     u8arr = new Uint8Array(n);
  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   return new File([u8arr], filename, { type: mime });
  // };
  componentDidMount() {

    const { testAppointments, onGetTestAppointments } = this.props;
    if (testAppointments && !testAppointments.length) {
      onGetTestAppointments();
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
        requested_appointment_date_time: testAppointment.requested_appointment_date_time,
        sample_collection_date_time: testAppointment.sample_collection_date_time,
        result_upload_date_time: testAppointment.result_upload_date_time,
        status: testAppointment.status,
        result: "http://127.0.0.1:8000" + testAppointment.result,
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

    const { onUpdateTestAppointment, onGetTestAppointments } =
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
            <Breadcrumbs title="Test Appointments" breadcrumbItem="Pending List" />
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
                                              result:
                                              (this.state &&
                                                this.state.appointmentImg) ||
                                                "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            booking_date_time: Yup.string().required(
                                              "Please enter date time"
                                            ),
                                            requested_appointment_date_time: Yup.string()
                                              .required(
                                                "Please enter date time"
                                              ),
                                            sample_collection_date_time: Yup.string()
                                              .required("Please enter date time"),
                                            result_upload_date_time: Yup.string()
                                              .required("Please enter date time"),
                                            result: Yup.string().when(
                                              "hiddenEditFlag",
                                              {
                                                is: hiddenEditFlag =>
                                                  hiddenEditFlag == false, //just an e.g. you can return a function
                                                then: Yup.string().required(
                                                  "Please upload photo"
                                                ),
                                              }
                                            ),
                                          })}
                                          onSubmit={values => {

                                            if (isEdit) {
                                              if (!this.state.appointmentImg) {                                        
                                                this.toDataURL(
                                                  testAppointment.result
                                                ) .then(dataUrl => {
                                                  var fileData =
                                                    this.dataURLtoFile(
                                                      dataUrl,
                                                      testAppointment.result
                                                        .split("/")
                                                        .at(-1)
                                                    );
                                                  this.setState({
                                                    appointmentImg: fileData,
                                                  });

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
                                                  offered_test_name: values.offered_test_name,
                                                  patient_age:
                                                    values.patient_age,
                                                  patient_gender: values.patient_gender,
                                                  booking_date_time:
                                                    values.booking_date_time,
                                                  requested_appointment_date_time:
                                                    values.requested_appointment_date_time,
                                                  sample_collection_date_time:
                                                    values.sample_collection_date_time,
                                                  result_upload_date_time:
                                                    values.result_upload_date_time,
                                                  status:
                                                    values.status,
                                                  result:
                                                    this.state.appointmentImg,
                                              };
                                              
                                              // update TestAppointment
                                              onUpdateTestAppointment(
                                                updateTestAppointment
                                              );

                                              setTimeout(() => {
                                                onGetTestAppointments();
                                              }, 1000);
                                                });
                                              } 
                                              else {
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
                                                offered_test_name: values.offered_test_name,
                                                patient_age:
                                                  values.patient_age,
                                                patient_gender: values.patient_gender,
                                                booking_date_time:
                                                  values.booking_date_time,
                                                requested_appointment_date_time:
                                                  values.requested_appointment_date_time,
                                                sample_collection_date_time:
                                                  values.sample_collection_date_time,
                                                result_upload_date_time:
                                                  values.result_upload_date_time,
                                                status:
                                                  values.status,
                                                result:
                                                   this.state.appointmentImg,
                                              };
                                              
                                              // update TestAppointment
                                              onUpdateTestAppointment(
                                                updateTestAppointment
                                              );

                                              setTimeout(() => {
                                                onGetTestAppointments();
                                              }, 1000);
                                              }

                                              
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
                                                          .testAppointment.patient_name
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              patient_id: testAppointment.patient_id,
                                                              offered_test_id: testAppointment.offered_test_id,

                                                              patient_name: e.target
                                                                .value,
                                                              offered_test_name: testAppointment.offered_test_name,
                                                              patient_age:
                                                                testAppointment.patient_age,
                                                              patient_gender:
                                                                testAppointment.patient_gender,
                                                              booking_date_time: testAppointment
                                                                .booking_date_time,
                                                              requested_appointment_date_time: testAppointment.requested_appointment_date_time,
                                                              sample_collection_date_time:
                                                                testAppointment.sample_collection_date_time,
                                                              result_upload_date_time:
                                                                testAppointment.result_upload_date_time,
                                                              status:
                                                                testAppointment.status,
                                                              result:
                                                              this.state.appointmentImg,
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
                                                          .testAppointment.offered_test_name
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              patient_id: testAppointment.patient_id,
                                                              offered_test_id: testAppointment.offered_test_id,
                                                              patient_name: testAppointment.offered_test_name,
                                                              offered_test_name: e.target
                                                                .value,
                                                              patient_age:
                                                                testAppointment.patient_age,
                                                              patient_gender:
                                                                testAppointment.patient_gender,
                                                              booking_date_time: testAppointment
                                                                .booking_date_time,
                                                              requested_appointment_date_time: testAppointment.requested_appointment_date_time,
                                                              sample_collection_date_time:
                                                                testAppointment.sample_collection_date_time,
                                                              result_upload_date_time:
                                                                testAppointment.result_upload_date_time,
                                                              status:
                                                                testAppointment.status,
                                                              result:
                                                              this.state.appointmentImg,                                                            },
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
                                                          .testAppointment.patient_age
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              patient_id: testAppointment.patient_id,
                                                              offered_test_id: testAppointment.offered_test_id,
                                                              patient_name: testAppointment.patient_name,
                                                              offered_test_name: testAppointment.offered_test_name,
                                                              patient_age:
                                                                e.target
                                                                .value,
                                                              patient_gender:
                                                                testAppointment.patient_gender,
                                                              booking_date_time: testAppointment
                                                                .booking_date_time,
                                                              requested_appointment_date_time: testAppointment.requested_appointment_date_time,
                                                              sample_collection_date_time:
                                                                testAppointment.sample_collection_date_time,
                                                              result_upload_date_time:
                                                                testAppointment.result_upload_date_time,
                                                              status:
                                                                testAppointment.status,
                                                              result:
                                                              this.state.appointmentImg,                                                            },
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
                                                          .testAppointment.patient_gender
                                                          }
                                                          onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              patient_id: testAppointment.patient_id,
                                                              offered_test_id: testAppointment.offered_test_id,
                                                              patient_name: testAppointment.patient_name,
                                                              offered_test_name: testAppointment.offered_test_name,
                                                              patient_age:
                                                              testAppointment.patient_age,
                                                              patient_gender:
                                                                e.target
                                                                .value,
                                                              booking_date_time: testAppointment
                                                                .booking_date_time,
                                                              requested_appointment_date_time: testAppointment.requested_appointment_date_time,
                                                              sample_collection_date_time:
                                                                testAppointment.sample_collection_date_time,
                                                              result_upload_date_time:
                                                                testAppointment.result_upload_date_time,
                                                              status:
                                                                testAppointment.status,
                                                              result:
                                                              this.state.appointmentImg,                                                            },
                                                          });
                                                        } 
                                                        
                                                      }}
                                                          className={
                                                            "form-control" +
                                                            (errors. patient_gender &&
                                                            touched.patient_gender
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          readOnly={true}
                                                          multiple={false}
                                                        >
                                                        
                                                        </Field>
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
                                                      defaultValue={
                                                        this.state
                                                          .testAppointment.booking_date_time.slice(0, -4)
                                                      }
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
                                                    requested appointment date time
                                                    </Label>
                                                    <input
                                                      name="requested_appointment_date_time"
                                                      type="datetime-local"
                                                      readOnly={true}
                                                      defaultValue={
                                                        this.state
                                                          .testAppointment.requested_appointment_date_time.slice(0, -4)
                                                      }
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
                                                    sample collection date time
                                                    </Label>
                                                    <input
                                                      name="sample_collection_date_time"
                                                     type="datetime-local"
                                                      defaultValue={
                                                        this.state
                                                          .testAppointment.sample_collection_date_time.slice(0, -4)
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              patient_id: testAppointment.patient_id,
                                                              offered_test_id: testAppointment.offered_test_id,
                                                              patient_name: testAppointment.patient_name,
                                                              offered_test_name: testAppointment.offered_test_name,
                                                              patient_age:
                                                                testAppointment.patient_age,
                                                              patient_gender:
                                                                testAppointment.patient_gender,
                                                              booking_date_time: testAppointment
                                                                .booking_date_time,
                                                              requested_appointment_date_time: testAppointment.requested_appointment_date_time,
                                                              sample_collection_date_time:
                                                                e.target
                                                                .value  + ":00Z",
                                                              result_upload_date_time:
                                                                testAppointment.result_upload_date_time,
                                                              status:
                                                                testAppointment.status,
                                                              result:
                                                              this.state.appointmentImg,                                                            },
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
                                                      defaultValue={
                                                        this.state
                                                          .testAppointment.result_upload_date_time.slice(0, -4)
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              patient_id: testAppointment.patient_id,
                                                              offered_test_id: testAppointment.offered_test_id,
                                                              patient_name: testAppointment.patient_name,
                                                              offered_test_name: testAppointment.offered_test_name,
                                                              patient_age:
                                                                testAppointment.patient_age,
                                                              patient_gender:
                                                                testAppointment.patient_gender,
                                                              booking_date_time: testAppointment
                                                                .booking_date_time,
                                                              requested_appointment_date_time: testAppointment.requested_appointment_date_time,
                                                              sample_collection_date_time:
                                                                testAppointment.sample_collection_date_time,
                                                              result_upload_date_time:
                                                                e.target
                                                                .value + ":00Z",
                                                              status:
                                                                testAppointment.status,
                                                              result:
                                                              this.state.appointmentImg,                                                            },
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
                                                          Value={
                                                            testAppointment.status
                                                          }
                                                          onChange={e => {
                                                            if (isEdit) {
                                                              this.setState({
                                                                testAppointment: {
                                                                  id: testAppointment.id,
                                                                  patient_id: testAppointment.patient_id,
                                                                  offered_test_id: testAppointment.offered_test_id,
                                                                  patient_name: testAppointment.patient_name,
                                                                  offered_test_name: testAppointment.offered_test_name,
                                                                  patient_age:
                                                                    testAppointment.patient_age,
                                                                  patient_gender:
                                                                    testAppointment.patient_gender,
                                                                  booking_date_time: testAppointment
                                                                    .booking_date_time,
                                                                  requested_appointment_date_time: testAppointment.requested_appointment_date_time,
                                                                  sample_collection_date_time:
                                                                  testAppointment.sample_collection_date_time,
                                                                  result_upload_date_time:
                                                                  testAppointment.result_upload_date_time,
                                                                  status:
                                                                    e.target
                                                                    .value,
                                                                  result:
                                                                  this.state.appointmentImg,                                                            },
                                                              });
                                                            } 
                                                            
                                                          }}
                                                          className={
                                                            "form-control" +
                                                            (errors. status &&
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
                                                          <option value="Sample Collected">
                                                          Sample Collected
                                                          </option>
                                                          <option value="Result Uploaded">
                                                          Result Uploaded
                                                          </option>
                                                          
                                                        </Field> 
                                                        
                                                                                
                                                    <ErrorMessage
                                                      name="status"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  {/* Display current image in edit form only */}
                                                     {testAppointment.photo &&
                                                  testAppointment.photo ? (
                                                    <CardImg
                                                      className="img-fluid"
                                                      src={
                                                        "http://127.0.0.1:8000" + testAppointment.result
                                                      }
                                                      alt="Responsive image"
                                                    />
                                                  ) : null}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                    result
                                                    </Label>
                                                     <Input
                                                      id="formFile"
                                                      name="result"
                                                      placeholder="Choose image"
                                                      type="file"
                                                      multiple={false}
                                                      accept=".jpg,.jpeg,.png"
                                                      onChange={e =>{
                                                        if (isEdit) {
                                                        this.setState({
                                                          appointmentImg:
                                                            e.target.files[0],
                                                        })
                                                      }
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.result &&
                                                        touched.result
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="result"
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
  onGetTestAppointments: PropTypes.func,
  onUpdateTestAppointment: PropTypes.func,
};

const mapStateToProps = ({ testAppointments }) => ({
  testAppointments: testAppointments.testAppointments,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetTestAppointments: () => 
    dispatch(getTestAppointmentsPendingList(ownProps.match.params.id)),
  onUpdateTestAppointment: testAppointment => 
    dispatch(updateTestAppointment(testAppointment)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestAppointmentsPendingList));
