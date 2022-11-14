import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
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
  getSampleCollectionInProcessList,
  updateSampleCollectionStatus,
} from "store/sample-collector-test-appointments/actions";

import { isEmpty, size } from "lodash";

class SampleCollectorTestAppointmentsInProcessList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      testAppointments: [],
      patient: [],
      btnText: "Copy",
      sampleCollector: "",
      resultFile: "",
      testAppointment: "",
      modal: false,
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
          formatter: (cellContent, patientTestAppointment) => (
            <>
              <strong>{patientTestAppointment.order_id}</strong>
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
          dataField: "estimated_sample_collection_at",
          text: "Estimated sample collection time by Lab",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                {new Date(
                  testAppointment.estimated_sample_collection_at
                ).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        {
          dataField: "status",
          text: "Appointment Status",
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
        // {
        //   dataField: "dues",
        //   text: "Dues",
        //   sort: true,
        // },
        // {
        //   dataField: "amount_recieved_by_collector",
        //   text: "Amount Received",
        //   sort: true,
        // },
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
          dataField: "invoice",
          text: "Invoice",
          isDummyField: true,
          editable: false,
          formatter: (cellContent, testAppointment) => (
            <>
              <Link
                className="btn btn-primary btn-rounded font-size-10"
                to={`/lab-invoice-detail/${testAppointment.id}`}
              >
                Invoice
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
    const { onGetTestAppointmentsInProcessList } = this.props;
    onGetTestAppointmentsInProcessList(this.state.user_id);
    this.setState({ testAppointments: this.props.testAppointments });
  }
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
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleTestAppointmentClicks = () => {
    this.setState({ testAppointment: "", resultFile: "" });
    this.toggle();
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
        patient_name: testAppointment.patient_name,
        patient_id: testAppointment.patient_id,
        patient_age: testAppointment.patient_age,
        patient_gender: testAppointment.patient_gender,
        booked_at: testAppointment.booked_at,
        appointment_requested_at: testAppointment.appointment_requested_at,
        estimated_sample_collection_at:
          testAppointment.estimated_sample_collection_at,
        estimated_result_uploading_at:
          testAppointment.estimated_result_uploading_at,
        patient_unique_id: testAppointment.patient_unique_id,
        status: testAppointment.status,
        collection_status: testAppointment.collection_status,
        result_type: "File",
        url: "",
        result: "",
        collector_name: testAppointment.collector_name,
        assigned_to: testAppointment.assigned_to,
        dues: testAppointment.dues,
        // amount_recieved_by_collector: testAppointment.amount_recieved_by_collector,
        is_exact_amount_collected: testAppointment.is_exact_amount_collected,
      },

      resultFile: "",
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { testAppointments } = this.props;

    const {
      onUpdateSampleCollectionStatus,
      onGetTestAppointmentsInProcessList,
    } = this.props;
    const testAppointment = this.state.testAppointment;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: 1, // replace later with size(testAppointments),
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
            <title>Sample Collection Assigned | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Sample Collection"
              breadcrumbItem="Assigned List"
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
                                        Edit Test Appointment
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            collection_status:
                                              (testAppointment &&
                                                testAppointment.collection_status) ||
                                              "",
                                            // amount_recieved_by_collector:
                                            //   (testAppointment &&
                                            //     testAppointment.amount_recieved_by_collector) ||
                                            //   "",
                                            dues:
                                              (testAppointment &&
                                                testAppointment.dues) ||
                                              "",
                                            is_exact_amount_collected:
                                              (testAppointment &&
                                                testAppointment.is_exact_amount_collected) ||
                                              "",
                                          }}
                                          onSubmit={values => {
                                            const updateSampleCollectionStatus =
                                              {
                                                id: testAppointment.id,
                                                patient_id: parseInt(
                                                  values.patient_id
                                                ),
                                                collection_status:
                                                  values.collection_status,
                                                // amount_recieved_by_collector:
                                                //   values.amount_recieved_by_collector,
                                                dues:
                                                  testAppointment.dues,
                                                is_exact_amount_collected:
                                                  values.is_exact_amount_collected,
                                              };

                                            // update TestAppointment
                                            onUpdateSampleCollectionStatus(
                                              updateSampleCollectionStatus
                                            );

                                            setTimeout(() => {
                                              onGetTestAppointmentsInProcessList(
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
                                              {/* Certificate Amount field */}
                                              {this.state.testAppointment
                                                    .collection_status ===
                                                    "Sample+Payment Collected" &&(
                                                      <div className="mb-3 row">
                                                      <div className="col-md-3">
                                                        <Label className="form-label">
                                                          Amount
                                                        </Label>
                                                      </div>
                                                      <div className="col-md-6">
                                                        <input
                                                          type="text"
                                                          value={
                                                          testAppointment.dues
                                                          }
                                                          className="form-control"
                                                          readOnly={true}
                                                        />
                                                      </div>
                                                    </div>
                                                    )}
                                           {/* Certificate Collection status field */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Collection Status
                                                    </Label>
                                                    <Field
                                                      name="collection_status"
                                                      as="select"
                                                      value={
                                                        testAppointment.collection_status
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          testAppointment: {
                                                            id: testAppointment.id,
                                                            collection_status:
                                                              e.target.value,
                                                            // amount_recieved_by_collector: testAppointment.amount_recieved_by_collector,
                                                            is_exact_amount_collected: testAppointment.is_exact_amount_collected,
                                                            dues: testAppointment.dues,
                                                          },
                                                        });
                                                      }}
                                                      className="form-control"
                                                      readOnly={false}
                                                      multiple={false}
                                                    >
                                                      <option value="Assigned">
                                                        Assigned
                                                      </option>
                                                      <option value="On way">
                                                        On way
                                                      </option>
                                                      <option value="Reached">
                                                        Reached
                                                      </option>
                                                      <option value="Patient Unavailable">
                                                        Patient Unavailable
                                                      </option>
                                                      <option value="Sample+Payment Collected">
                                                        Sample+Payment Collected
                                                      </option>
                                                      <option value="Sample+Payment Delivered">
                                                        Sample+Payment Delivered
                                                      </option>
                                                    </Field>
                                                  </div>   

                                                  {/* {this.state.testAppointment
                                                    .collection_status ===
                                                    "Sample+Payment Collected" &&(
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Amount Received
                                                    </Label>
                                                    <Field
                                                      name="amount_recieved_by_collector"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .amount_recieved_by_collector
                                                      }
                                                      onChange={e => {
                                                        
                                                          this.setState({
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              collection_status:
                                                                testAppointment.collection_status,
                                                              amount_recieved_by_collector: e.target.value,
                                                              dues: testAppointment.dues,
                                                            },
                                                          });
                                                        } 
                                                      }
                                                      className={
                                                        "form-control" +
                                                        (errors.amount_recieved_by_collector &&
                                                        touched.amount_recieved_by_collector
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="amount_recieved_by_collector"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>         
                                                    )}    */}

                                                    
                                                  {this.state.testAppointment
                                                    .collection_status ===
                                                    "Sample+Payment Collected" &&(
                                                    
                                                      <div className="mb-3">
                                                      <Label className="form-label">
                                                        Yes! I Collected the Due Amount from Patient
                                                      </Label> 
                                                    
                                                      <input
                                                       name="is_exact_amount_collected"
                                                       type="checkbox"
                                                       required= {true}
                                                      // checked={false}
                                                      checked={this.state.isChecked}
                                                      onChange={e => {
                                                        
                                                        this.setState({
                                                          testAppointment: {
                                                            id: testAppointment.id,
                                                            collection_status:
                                                              testAppointment.collection_status,
                                                            // amount_recieved_by_collector: testAppointment.amount_recieved_by_collector,
                                                            is_exact_amount_collected: e.target.value,
                                                            dues: testAppointment.dues,
                                                          },
                                                        });
                                                      } 
                                                    }
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

SampleCollectorTestAppointmentsInProcessList.propTypes = {
  match: PropTypes.object,
  testAppointments: PropTypes.array,
  className: PropTypes.any,
  onGetTestAppointmentsInProcessList: PropTypes.func,
  onUpdateSampleCollectionStatus: PropTypes.func,
};

const mapStateToProps = ({ sampleCollectorDatas }) => ({
  testAppointments: sampleCollectorDatas.sampleCollectorDatasInProcessList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetTestAppointmentsInProcessList: id =>
    dispatch(getSampleCollectionInProcessList(id)),
  onUpdateSampleCollectionStatus: testAppointment =>
    dispatch(updateSampleCollectionStatus(testAppointment)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SampleCollectorTestAppointmentsInProcessList));