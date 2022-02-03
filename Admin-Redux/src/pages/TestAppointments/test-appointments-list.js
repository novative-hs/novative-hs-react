import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
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

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getTestAppointments,
  updateTestAppointment,
} from "store/test-appointments/actions";

import { isEmpty, size } from "lodash";

class TestAppointmentsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      selectedFiles: [],
      testAppointments: [],
      patient: [],
      testAppointment: "",
      appointmentImg: "",
      modal: false,
      deleteModal: false,
      testAppointmentColumns: [
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
        //   dataField: "img",
        //   text: "#",
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       {!testAppointment.appointment ? (
        //         <div className="avatar-xs">
        //           <span className="avatar-title rounded-circle">
        //             {testAppointment.name.charAt(0)}
        //           </span>
        //         </div>
        //       ) : (
        //         <div>
        //           <img
        //             className="rounded-circle avatar-xs"
        //             src={
        //               "http://127.0.0.1:8000" + testAppointment.appointment
        //             }
        //             alt=""
        //           />
        //         </div>
        //       )}
        //     </>
        //   ),
        // },
        // {
          dataField: "patient_name",
          text: "Patient",
          sort: true,
        },
        {
          dataField: "offered_test_name",
          text: "Offered Test",
          sort: true,
        },
        {
          dataField: "booking_date_time",
          text: "booking_date_time",
          sort: true,
        },
        {
          dataField: "requested_appointment_date_time",
          text: "requested_appointment_date_time",
          sort: true,
        },
        {
          dataField: "sample_collection_date_time",
          text: "sample_collection_date_time",
          sort: true,
        },
        {
          dataField: "result_upload_date_time",
          text: "result_upload_date_time",
          sort: true,
        },
        {
          dataField: "status",
          text: "status",
          sort: true,
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
                  onClick={e =>
                    this.handleTestAppointmentClick(e, testAppointment)
                  }
                ></i>
              </Link>
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(testAppointment)}
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
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  // The code for converting "image source" (url) to "Base64"
  toDataURL = url =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  // The code for converting "Base64" to javascript "File Object"
  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

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
    this.setState({
      testAppointment: "",
      appointmentImg: "",
      isEdit: false,
    });
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

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = testAppointments => {
    this.setState({ testAppointments: testAppointments });
    this.setState({ deleteModal: true });
  };

  handleDeleteTestAppointment = () => {
    const { onDeleteTestAppointment, onGetTestAppointments } = this.props;
    const { testAppointments } = this.state;
    if (testAppointments.id !== undefined) {
      onDeleteTestAppointment(testAppointments);
      setTimeout(() => {
        onGetTestAppointments();
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleTestAppointmentClick = (e, arg) => {
    const testAppointment = arg;

    this.setState({
      testAppointment: {
        id: testAppointment.id,
        patient_name: testAppointment.patient_name,
        offered_test_name: testAppointment.offered_test_name,
        booking_date_time: testAppointment.booking_date_time,
        requested_appointment_date_time: testAppointment.requested_appointment_date_time,
        sample_collection_date_time: testAppointment.sample_collection_date_time,
        result_upload_date_time: testAppointment.result_upload_date_time,
        status: testAppointment.status,
      },
      appointmentImg: "",
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { testAppointments } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onAddNewTestAppointment,
      onUpdateTestAppointment,
      onGetTestAppointments,
    } = this.props;
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
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteTestAppointment}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Test Appointments List | Ilaaj4u</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Test Appointments"
              breadcrumbItem="Test Appointments List"
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
                                <Col sm="8">
                                  <div className="text-sm-end">
                                    <Button
                                      color="primary"
                                      className="font-16 btn-block btn btn-primary"
                                      onClick={
                                        this.handleTestAppointmentClicks
                                      }
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Test
                                    </Button>
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
                                          ? "Edit Test Appointments"
                                          : "Add Test Appointments"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            patient_name:
                                              (this.state.testAppointment &&
                                                this.state.testAppointment
                                                  .patient_name) ||
                                              "",
                                            offered_test_name:
                                              (this.state.testAppointment &&
                                                this.state.testAppointment
                                                  .offered_test_name) ||
                                              "",
                                            booking_date_time:
                                              (this.state.testAppointment &&
                                                this.state.testAppointment
                                                  .booking_date_time) ||
                                              "",
                                            requested_appointment_date_time:
                                              (this.state.testAppointment &&
                                                this.state.testAppointment
                                                  .requested_appointment_date_time) ||
                                              "",
                                            sample_collection_date_time:
                                              (this.state.testAppointment &&
                                                this.state.testAppointment
                                                  .sample_collection_date_time) ||
                                              "",
                                            result_upload_date_time:
                                              (this.state.testAppointment &&
                                                this.state.testAppointment
                                                  .result_upload_date_time) ||
                                              "",
                                            status:
                                              (this.state.testAppointment &&
                                                this.state.testAppointment
                                                  .status) ||
                                              "Pending",
                                            
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            booking_date_time: Yup.string().required(
                                              "Please enter booking date time"
                                            ),
                                            requested_appointment_date_time: Yup.string().required(
                                              "Please enter requested appointment date time"
                                            ),
                                            sample_collection_date_time: Yup.string().required(
                                              "Please enter sample collection date time"
                                            ),
                                            result_upload_date_time: Yup.string().required(
                                              "Please enter result upload date time"
                                            ),
                                            
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              if (!this.state.appointmentImg) {
                                                this.toDataURL(
                                                  testAppointment.appointment
                                                ).then(dataUrl => {
                                                  var fileData =
                                                    this.dataURLtoFile(
                                                      dataUrl,
                                                      testAppointment.appointment
                                                        .split("/")
                                                        .at(-1)
                                                    );
                                                  this.setState({
                                                    appointmentImg: fileData,
                                                  });

                                                  const updateTestAppointment =
                                                    {
                                                      id: testAppointment.id,
                                                      patient_name: values.patient_name,
                                                      offered_test_name: values.offered_test_name,
                                                      booking_date_time: values.booking_date_time,
                                                      requested_appointment_date_time: requested_appointment_date_time,
                                                      sample_collection_date_time: values.sample_collection_date_time,
                                                      result_upload_date_time: values.result_upload_date_time,
                                                      status: values.status,  
                                                      appointment:
                                                        this.state
                                                          .appointmentImg,
                                                    };

                                                  // update TestAppointment
                                                  onUpdateTestAppointment(
                                                    updateTestAppointment
                                                  );
                                                  setTimeout(() => {
                                                    onGetTestAppointments();
                                                  }, 1000);
                                                });
                                              } else {
                                                const updateTestAppointment =
                                                  {
                                                    id: testAppointment.id,
                                                    patient_name: values.patient_name,
                                                    offered_test_name: values.offered_test_name,
                                                    booking_date_time: values.booking_date_time,
                                                    requested_appointment_date_time: requested_appointment_date_time,
                                                    sample_collection_date_time: values.sample_collection_date_time,
                                                    result_upload_date_time: values.result_upload_date_time,
                                                    status: values.status,
                                                    appointment:
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
                                            } else {
                                              const newTestAppointment = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,
                                                  patient_name: values.patient_name,
                                                  offered_test_name: values.offered_test_name,
                                                  booking_date_time: values.booking_date_time,
                                                  requested_appointment_date_time: requested_appointment_date_time,
                                                  sample_collection_date_time: values.sample_collection_date_time,
                                                  result_upload_date_time: values.result_upload_date_time,
                                                  status: values.status,
                                                appointment:
                                                  this.state.appointmentImg,
                                              };

                                              // save new TestAppointment
                                              onAddNewTestAppointment(
                                                newTestAppointment
                                              );
                                              setTimeout(() => {
                                                onGetTestAppointments();
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
                                                            testAppointment:
                                                              {
                                                                id: testAppointment.id,
                                                                patient_name: e.target
                                                                  .value,
                                                                
                                                                patient_name: testAppointment.offered_test_name,
                                                                offered_test_name: testAppointment.offered_test_name,
                                                                booking_date_time: testAppointment.booking_date_time,
                                                                requested_appointment_date_time: testAppointment.requested_appointment_date_time,
                                                                sample_collection_date_time: testAppointment.sample_collection_date_time,
                                                                result_upload_date_time: testAppointment.result_upload_date_time,
                                                                status: testAppointment.status,
                                                                // appointment:
                                                                //   testAppointment.appointment,
                                                              },
                                                          });
                                                        } else {
                                                          this.setState({
                                                            testAppointment:
                                                              {
                                                                patient_name: e.target
                                                                  .value,
                                                                offered_test_name: testAppointment.offered_test_name,
                                                                booking_date_time: testAppointment.booking_date_time,
                                                                requested_appointment_date_time: testAppointment.requested_appointment_date_time,
                                                                sample_collection_date_time: testAppointment.sample_collection_date_time,
                                                                result_upload_date_time: testAppointment.result_upload_date_time,  
                                                              },
                                                          });
                                                        }
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
                                                      offered_test_name
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
                                                            testAppointment:
                                                              {
                                                                id: testAppointment.id,
                                                                offered_test_name: e.target
                                                                  .value,
                                                                
                                                                patient_name: testAppointment.patient_name,
                                                                offered_test_name: testAppointment.offered_test_name,
                                                                booking_date_time: testAppointment.booking_date_time,
                                                                requested_appointment_date_time: testAppointment.requested_appointment_date_time,
                                                                sample_collection_date_time: testAppointment.sample_collection_date_time,
                                                                result_upload_date_time: testAppointment.result_upload_date_time,
                                                                status: testAppointment.status,
                                                                // appointment:
                                                                //   testAppointment.appointment,
                                                              },
                                                          });
                                                        } else {
                                                          this.setState({
                                                            testAppointment:
                                                              {
                                                                offered_test_name: e.target
                                                                  .value,
                                                                patient_name: testAppointment.offered_test_name,
                                                                offered_test_name: testAppointment.offered_test_name,
                                                                booking_date_time: testAppointment.booking_date_time,
                                                                requested_appointment_date_time: testAppointment.requested_appointment_date_time,
                                                                sample_collection_date_time: testAppointment.sample_collection_date_time,
                                                                result_upload_date_time: testAppointment.result_upload_date_time,  
                                                              },
                                                          });
                                                        }
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
                                                    booking_date_time
                                                    </Label>
                                                    <Field
                                                      name="booking_date_time"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .booking_date_time
                                                      }
                                                      
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment:
                                                              {
                                                                id: testAppointment.id,
                                                                booking_date_time: e.target
                                                                  .value,

                                                                patient_name: testAppointment.patient_name,
                                                                offered_test_name: testAppointment.offered_test_name,
                                                                booking_date_time: testAppointment.booking_date_time,
                                                                requested_appointment_date_time: testAppointment.requested_appointment_date_time,
                                                                sample_collection_date_time: testAppointment.sample_collection_date_time,
                                                                result_upload_date_time: testAppointment.result_upload_date_time,
                                                                status: testAppointment.status,
                                                                // appointment:
                                                                //   testAppointment.appointment,
                                                              },
                                                          });
                                                        } else {
                                                          this.setState({
                                                            testAppointment:
                                                              {
                                                                booking_date_time: e.target
                                                                  .value,
                                                                patient_name: testAppointment.patient_name,
                                                                offered_test_name: testAppointment.offered_test_name,
                                                                booking_date_time: testAppointment.offered_test_name,
                                                                requested_appointment_date_time: testAppointment.requested_appointment_date_time,
                                                                sample_collection_date_time: testAppointment.sample_collection_date_time,
                                                                result_upload_date_time: testAppointment.result_upload_date_time,  
                                                              },
                                                          });
                                                        }
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
                                                    requested_appointment_date_time
                                                    </Label>
                                                    <Field
                                                      name="requested_appointment_date_time"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .requested_appointment_date_time
                                                      }
                                                      
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment:
                                                              {
                                                                id: testAppointment.id,
                                                                requested_appointment_date_time: e.target
                                                                  .value,

                                                                patient_name: testAppointment.patient_name,
                                                                offered_test_name: testAppointment.offered_test_name,
                                                                booking_date_time: testAppointment.requested_appointment_date_time,
                                                                requested_appointment_date_time: testAppointment.requested_appointment_date_time,
                                                                sample_collection_date_time: testAppointment.sample_collection_date_time,
                                                                result_upload_date_time: testAppointment.result_upload_date_time,
                                                                status: testAppointment.status,
                                                                // appointment:
                                                                //   testAppointment.appointment,
                                                              },
                                                          });
                                                        } else {
                                                          this.setState({
                                                            testAppointment:
                                                              {
                                                                requested_appointment_date_time: e.target
                                                                  .value,
                                                                patient_name: testAppointment.patient_name,
                                                                offered_test_name: testAppointment.offered_test_name,
                                                                booking_date_time: testAppointment.requested_appointment_date_time,
                                                                result_upload_date_time: testAppointment.requested_appointment_date_time,
                                                                sample_collection_date_time: testAppointment.sample_collection_date_time,
                                                                result_upload_date_time: testAppointment.result_upload_date_time,  
                                                              },
                                                          });
                                                        }
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
                                                    sample_collection_date_time
                                                    </Label>
                                                    <Field
                                                      name="sample_collection_date_time"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .sample_collection_date_time
                                                      }
                                                      
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment:
                                                              {
                                                                id: testAppointment.id,
                                                                sample_collection_date_time: e.target
                                                                  .value,

                                                                patient_name: testAppointment.patient_name,
                                                                offered_test_name: testAppointment.offered_test_name,
                                                                booking_date_time: testAppointment.requested_appointment_date_time,
                                                                requested_appointment_date_time: testAppointment.sample_collection_date_time,
                                                                result_upload_date_time: testAppointment.result_upload_date_time,
                                                                status: testAppointment.status,
                                                                // appointment:
                                                                //   testAppointment.appointment,
                                                              },
                                                          });
                                                        } else {
                                                          this.setState({
                                                            testAppointment:
                                                              {
                                                                requested_appointment_date_time: e.target
                                                                  .value,
                                                                patient_name: testAppointment.patient_name,
                                                                offered_test_name: testAppointment.offered_test_name,
                                                                booking_date_time: testAppointment.requested_appointment_date_time,
                                                                requested_appointment_date_time: testAppointment.sample_collection_date_time,
                                                                result_upload_date_time: testAppointment.result_upload_date_time,  
                                                              },
                                                          });
                                                        }
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
                                                    result_upload_date_time
                                                    </Label>
                                                    <Field
                                                      name="result_upload_date_time"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .result_upload_date_time
                                                      }
                                                      
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment:
                                                              {
                                                                id: testAppointment.id,
                                                                result_upload_date_time: e.target
                                                                  .value,

                                                                patient_name: testAppointment.patient_name,
                                                                offered_test_name: testAppointment.offered_test_name,
                                                                booking_date_time: testAppointment.requested_appointment_date_time,
                                                                requested_appointment_date_time: testAppointment.sample_collection_date_time,
                                                                sample_collection_date_time: testAppointment.result_upload_date_time,
                                                                status: testAppointment.status,
                                                                // appointment:
                                                                //   testAppointment.appointment,
                                                              },
                                                          });
                                                        } else {
                                                          this.setState({
                                                            testAppointment:
                                                              {
                                                                result_upload_date_time: e.target
                                                                  .value,
                                                                patient_name: testAppointment.patient_name,
                                                                offered_test_name: testAppointment.offered_test_name,
                                                                booking_date_time: testAppointment.requested_appointment_date_time,
                                                                sample_collection_date_time: testAppointment.sample_collection_date_time,
                                            
                                                              },
                                                          });
                                                        }
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
                                                      status
                                                    </Label>
                                                    <Field
                                                      name="result_upload_date_time"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .status
                                                      }
                                                      
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            testAppointment:
                                                              {
                                                                id: testAppointment.id,
                                                                status: e.target
                                                                  .value,

                                                                patient_name: testAppointment.patient_name,
                                                                offered_test_name: testAppointment.offered_test_name,
                                                                booking_date_time: testAppointment.requested_appointment_date_time,
                                                                requested_appointment_date_time: testAppointment.sample_collection_date_time,
                                                                sample_collection_date_time: testAppointment.result_upload_date_time,
                                                                result_upload_date_time: testAppointment.status,
                                                                // appointment:
                                                                //   testAppointment.appointment,
                                                              },
                                                          });
                                                        } else {
                                                          this.setState({
                                                            testAppointment:
                                                              {
                                                                status: e.target
                                                                  .value,
                                                                patient_name: testAppointment.patient_name,
                                                                offered_test_name: testAppointment.offered_test_name,
                                                                booking_date_time: testAppointment.requested_appointment_date_time,
                                                                sample_collection_date_time: testAppointment.sample_collection_date_time,
                                                                
                                                              },
                                                          });
                                                        }
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

                                                  Display current image in edit form only
                                                  {testAppointment.appointment &&
                                                  testAppointment.appointment ? (
                                                    <CardImg
                                                      className="img-fluid"
                                                      src={
                                                        testAppointment.appointment
                                                      }
                                                      alt="Responsive image"
                                                    />
                                                  ) : null}

                                                  {/* Certificate field */}
                                                  <div className="mb-3">
                                                    <Label
                                                      for="name"
                                                      className="form-label"
                                                    >
                                                      Certificate
                                                    </Label>
                                                    <Input
                                                      id="formFile"
                                                      name="appointment"
                                                      placeholder="Choose image"
                                                      type="file"
                                                      multiple={false}
                                                      accept=".jpg,.jpeg,.png"
                                                      onChange={e =>
                                                        this.setState({
                                                          appointmentImg:
                                                            e.target.files[0],
                                                        })
                                                      }
                                                      className={
                                                        "form-control" +
                                                        (errors.appointment &&
                                                        touched.appointment
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />

                                                    <ErrorMessage
                                                      name="appointment"
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

TestAppointmentsList.propTypes = {
  match: PropTypes.object,
  testAppointments: PropTypes.array,
  className: PropTypes.any,
  onGetTestAppointments: PropTypes.func,
  onAddNewTestAppointment: PropTypes.func,
  onDeleteTestAppointment: PropTypes.func,
  onUpdateTestAppointment: PropTypes.func,
};

const mapStateToProps = ({ testAppointments }) => ({
  testAppointments: testAppointments.testAppointments,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetTestAppointments: () =>
    dispatch(getTestAppointments(ownProps.match.params.id)),
  onAddNewTestAppointment: testAppointment =>
    dispatch(
      addNewTestAppointment(testAppointment, ownProps.match.params.id)
    ),
  onUpdateTestAppointment: testAppointment =>
    dispatch(updateTestAppointment(testAppointment)),
  onDeleteTestAppointment: testAppointment =>
    dispatch(deleteTestAppointment(testAppointment)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestAppointmentsList));
