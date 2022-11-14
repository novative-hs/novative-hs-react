import React, { Component } from "react";
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
  Modal,
  ModalHeader,
  ModalBody,
  Label,
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

import { updatePaymentInfo } from "store/invoices/actions";

import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";

import "assets/scss/table.scss";

class TestAppointmentsPendingList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      testAppointments: [],
      testAppointment: "",
      modal: false,
      btnText: "Copy",
      confirmModal: false,
      appointmentId: "",
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
            <>;
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
        {
          dataField: "booked_at",
          text: "Booked at",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                {new Date(testAppointment.booked_at).toLocaleString("en-US")}
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
        // {
        //   dataField: "payment",
        //   isDummyField: true,
        //   editable: false,
        //   text: "Payment",
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       {testAppointment.payment_status == "Not Paid" && (
        //         <div className="d-flex gap-3">
        //           <Link
        //             className="btn btn-success btn-rounded"
        //             onClick={() =>
        //               this.onClickAccept(testAppointment.id)
        //             }
        //             // to={"/b2b-clients-list"}
        //           >
        //             <i className="mdi mdi-check-bold"></i> Accept
        //           </Link>
        //         </div>
        //       )}
        //     </>
        //   ),
        // },
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
    this.togglePatientModal = this.togglePatientModal.bind(this);
  }

  componentDidMount() {
    const { onGetTestAppointmentsPendingList } = this.props;
    onGetTestAppointmentsPendingList(this.state.user_id);
    this.setState({ testAppointments: this.props.testAppointments });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  toggleConfirmModal = () => {
    this.setState(prevState => ({
      confirmModal: !prevState.confirmModal,
    }));
  };
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      patient_age: arg.patient_age,
      patient_gender: arg.patient_gender,
      patient_address: arg.patient_address,
      patient_city: arg.patient_city,
      patient_phone: arg.patient_phone,
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

  handleTestAppointmentClicks = () => {
    this.setState({ testAppointment: "" });
    this.toggle();
  };

  onClickAccept = id => {
    this.setState({ appointmentId: id });
    this.setState({ confirmModal: true });
  };

  handeAcceptPayment = () => {
    const { onGetTestAppointmentsPendingList, onUpdatePaymentInfo } =
      this.props;

    onUpdatePaymentInfo(this.state.appointmentId); // Calling Payment API to update the payment info when payment is accepted by lab

    setTimeout(() => {
      onGetTestAppointmentsPendingList(this.state.user_id);
    }, 1000);

    this.setState({ confirmModal: false });
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { testAppointments } = this.props;
    if (
      !isEmpty(testAppointments) &&
      size(prevProps.testAppointments) !== size(testAppointments)
    ) {
      this.setState({ testAppointments: {} });
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
        estimated_sample_collection_at:
          testAppointment.estimated_sample_collection_at,
        // estimated_result_uploading_at:
        //   testAppointment.estimated_result_uploading_at,
      },
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { testAppointments } = this.props;

    const { confirmModal } = this.state;

    const { onUpdateTestAppointment, onGetTestAppointmentsPendingList } =
      this.props;
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

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Lab Hazir | Test Appointments List</title>
          </MetaTags>
          <ConfirmModal
            show={this.state.confirmModal}
            onConfirmClick={this.handeAcceptPayment}
            onCloseClick={() => this.setState({ confirmModal: false })}
          />
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
                                            patient_id:
                                              (testAppointment &&
                                                testAppointment.patient_id) ||
                                              "",
                                            patient_name:
                                              (testAppointment &&
                                                testAppointment.patient_name) ||
                                              "",
                                            patient_age:
                                              (testAppointment &&
                                                testAppointment.patient_age) ||
                                              "",
                                            patient_gender:
                                              (testAppointment &&
                                                testAppointment.patient_gender) ||
                                              "",
                                            booked_at:
                                              (testAppointment &&
                                                testAppointment.booked_at) ||
                                              "",
                                            appointment_requested_at:
                                              (testAppointment &&
                                                testAppointment.appointment_requested_at) ||
                                              "",
                                            estimated_sample_collection_at:
                                              (testAppointment &&
                                                testAppointment.estimated_sample_collection_at) ||
                                              "",
                                            // estimated_result_uploading_at:
                                            //   (testAppointment &&
                                            //     testAppointment.estimated_result_uploading_at) ||
                                            //   "",
                                            // patient_unique_id:
                                            //   (testAppointment &&
                                            //     testAppointment.patient_unique_id) ||
                                            //   "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            estimated_sample_collection_at:
                                              Yup.string().required(
                                                "Please select sample collection date time"
                                              ),
                                            // estimated_result_uploading_at:
                                            //   Yup.string().required(
                                            //     "Please select result upload date time"
                                            //   ),
                                            // patient_unique_id:
                                            //   Yup.string().required(
                                            //     "Please enter patient unique id"
                                            //   ),
                                          })}
                                          onSubmit={values => {
                                            const updateTestAppointment = {
                                              id: testAppointment.id,
                                              estimated_sample_collection_at:
                                                values.estimated_sample_collection_at,
                                              // estimated_result_uploading_at:
                                              //   values.estimated_result_uploading_at,
                                              status: "Confirmed",
                                              process: "pending",
                                            };

                                            // update TestAppointment
                                            onUpdateTestAppointment(
                                              updateTestAppointment
                                            );

                                            setTimeout(() => {
                                              onGetTestAppointmentsPendingList(
                                                this.state.user_id
                                              );
                                            }, 1000);

                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Patient name
                                                    </Label>
                                                    <Field
                                                      name="patient_name"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .patient_name
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div> */}

                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Patient age
                                                    </Label>
                                                    <Field
                                                      name="patient_age"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .patient_age
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div> */}

                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Patient gender
                                                    </Label>
                                                    <Field
                                                      name="patient_gender"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .patient_gender
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div> */}

                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Booked at
                                                    </Label>
                                                    <input
                                                      name="booked_at"
                                                      type="datetime-local"
                                                      readOnly={true}
                                                      defaultValue={this.state.testAppointment.booked_at.slice(
                                                        0,
                                                        -9
                                                      )}
                                                      className="form-control"
                                                    />
                                                  </div> */}

                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Booked for
                                                    </Label>
                                                    <input
                                                      name="appointment_requested_at"
                                                      type="datetime-local"
                                                      readOnly={true}
                                                      defaultValue={this.state.testAppointment.appointment_requested_at.slice(
                                                        0,
                                                        -9
                                                      )}
                                                      className="form-control"
                                                    />
                                                  </div> */}

                                                  <div className="mb-3">
                                                    <Label
                                                      for="Estimated sample
                                                      collection at"
                                                    >
                                                      Estimated sample
                                                      collection at
                                                    </Label>
                                                    <input
                                                      type="datetime-local"
                                                      id="Estimated sample
                                                      collection at"
                                                      name="Estimated sample
                                                      collection at"
                                                      min={new Date(
                                                        new Date()
                                                          .toString()
                                                          .split("GMT")[0] +
                                                          " UTC"
                                                      )
                                                        .toISOString()
                                                        .slice(0, -8)}
                                                      onChange={e => {
                                                        this.setState({
                                                          testAppointment: {
                                                            id: testAppointment.id,
                                                            estimated_sample_collection_at:
                                                              e.target.value +
                                                              ":00Z",
                                                            // estimated_result_uploading_at:
                                                            //   testAppointment.estimated_result_uploading_at,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.estimated_sample_collection_at &&
                                                        touched.estimated_sample_collection_at
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="estimated_sample_collection_at"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  {/* <div className="mb-3">
                                                    <Label
                                                      for="Estimated result uploading
                                                      at"
                                                    >
                                                      Estimated result uploading
                                                      at
                                                    </Label>
                                                    <input
                                                      type="datetime-local"
                                                      id="Estimated result uploading
                                                      at"
                                                      name="Estimated result uploading
                                                      at"
                                                      min={new Date(
                                                        new Date()
                                                          .toString()
                                                          .split("GMT")[0] +
                                                          " UTC"
                                                      )
                                                        .toISOString()
                                                        .slice(0, -8)}
                                                      onChange={e => {
                                                        this.setState({
                                                          testAppointment: {
                                                            id: testAppointment.id,
                                                            estimated_sample_collection_at:
                                                              testAppointment.estimated_sample_collection_at,
                                                            estimated_result_uploading_at:
                                                              e.target.value +
                                                              ":00Z",
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.estimated_result_uploading_at &&
                                                        touched.estimated_result_uploading_at
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="estimated_result_uploading_at"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div> */}

                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Patient Unique ID
                                                      (optional)
                                                    </Label>
                                                    <input
                                                      name="patient_unique_id"
                                                      type="text"
                                                      onChange={e => {
                                                        this.setState({
                                                          testAppointment: {
                                                            id: testAppointment.id,
                                                            patient_id:
                                                              testAppointment.patient_id,
                                                            patient_name:
                                                              testAppointment.patient_name,
                                                            patient_age:
                                                              testAppointment.patient_age,
                                                            patient_gender:
                                                              testAppointment.patient_gender,
                                                            booked_at:
                                                              testAppointment.booked_at,
                                                            appointment_requested_at:
                                                              testAppointment.appointment_requested_at,
                                                            estimated_sample_collection_at:
                                                              testAppointment.estimated_sample_collection_at,
                                                            estimated_result_uploading_at:
                                                              testAppointment.estimated_result_uploading_at,
                                                            patient_unique_id:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.patient_unique_id &&
                                                        touched.patient_unique_id
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="patient_unique_id"
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

TestAppointmentsPendingList.propTypes = {
  match: PropTypes.object,
  testAppointments: PropTypes.array,
  className: PropTypes.any,
  onGetTestAppointmentsPendingList: PropTypes.func,
  onUpdateTestAppointment: PropTypes.func,
  onUpdatePaymentInfo: PropTypes.func,
};

const mapStateToProps = ({ testAppointments }) => ({
  testAppointments: testAppointments.testAppointmentsPendingList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetTestAppointmentsPendingList: id =>
    dispatch(getTestAppointmentsPendingList(id)),
  onUpdateTestAppointment: testAppointment =>
    dispatch(updateTestAppointment(testAppointment)),
  onUpdatePaymentInfo: id => dispatch(updatePaymentInfo(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestAppointmentsPendingList));