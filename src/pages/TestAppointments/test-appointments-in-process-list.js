import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';


import {
  Alert,
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
  getTestAppointmentsInProcessList,
  updateTestAppointment,
} from "store/test-appointments/actions";

import { updatePaymentInfo } from "store/invoices/actions";

import { getSampleCollectors } from "store/sample-collectors/actions";

import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";

class TestAppointmentsInProcessList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      labs: [],
      testAppointments: [],
      patient: [],
      sampleCollectors: [],
      sampleCollector: "",
      btnText: "Copy",
      resultFile: "",
      testAppointment: "",
      modal: false,
      PaymentModal: false,
      ReshedualModal: false,
      reasonModal: false,
      isRescheduled: false,
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
          dataField: "order_id",
          text: "Lab Type / Address",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <strong>
                {testAppointment.type}{" ("}
                {testAppointment.address}{")"}
              </strong>
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
              <Tooltip title="Patient Info">
                <Link
                  to="#"
                  onClick={e => this.openPatientModal(e, testAppointment)}
                >
                  {testAppointment.patient_name}
                </Link>
              </Tooltip>
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
          text: "Sampling time by Lab",
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
                // patientTestAppointment.status == "Sample Collected" ||
                patientTestAppointment.status == "Rescheduled" ? (
                <span>----</span>
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
        // {
        //   dataField: "sample_collector",
        //   text: "Sample Collector",
        //   sort: true,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       <span>
        //         <span>
        //           {testAppointment.is_home_sampling_availed &&
        //             !testAppointment.collector_name && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
        //                 Not assigned
        //               </span>
        //             )}

        //           {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collector_name && (
        //               <span>{testAppointment.collector_name}</span>
        //             )}

        //           {!testAppointment.is_home_sampling_availed && (
        //             <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
        //               Not availed
        //             </span>
        //           )}
        //            {testAppointment.is_home_sampling_availed &&
        //             !testAppointment.collection_status && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
        //                 Pending
        //               </span>
        //             )} 

             
        //         </span>
        //       </span>
        //     </>
        //   ),
        // },
        // {
        //   dataField: "collection status",
        //   text: "Sample Collection Status",
        //   sort: true,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       <span>
        //         <span>
        //           {/* {testAppointment.is_home_sampling_availed &&
        //             !testAppointment.collector_name && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
        //                 Not assigned
        //               </span>
        //             )}

        //           {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collector_name && (
        //               <span>{testAppointment.collector_name}</span>
        //             )}

        //           {!testAppointment.is_home_sampling_availed && (
        //             <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
        //               Not availed
        //             </span>
        //           )} */}
        //           {/* {testAppointment.is_home_sampling_availed &&
        //             !testAppointment.collection_status && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
        //                 Pending
        //               </span>
        //             )} */}

        //           {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collection_status == "Assigned" && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-primary">
        //                 {testAppointment.collection_status}
        //               </span>
        //             )}

        //           {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collection_status == "On way" && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning">
        //                 {testAppointment.collection_status}
        //               </span>
        //             )}

        //           {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collection_status == "Reached" && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
        //                 {testAppointment.collection_status}
        //               </span>
        //             )}

        //           {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collection_status == "Patient Unavailable" && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
        //                 {testAppointment.collection_status}
        //               </span>
        //             )}
        //               {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collection_status == "Sample+Payment Collected" && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
        //                 {testAppointment.collection_status}
        //               </span>
        //             )}

        //           {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collection_status == "Sample+Payment Delivered" && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
        //                 {testAppointment.collection_status}
        //               </span>
        //             )}

        //           {!testAppointment.is_home_sampling_availed && (
        //             <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
        //               Not availed
        //             </span>
        //           )}
        //         </span>
        //       </span>
        //     </>
        //   ),
        // },
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
//         {
//           dataField: "reschedule_count",
//           text: "Rescheduling",
//           sort: true,
//           formatter: (cellContent, testAppointment) => (
//             <>
//               <span>
//                 <span>
//                   {testAppointment.reschedule_count > 1 && (
//                     <span className="text-danger">
//                       {testAppointment.reschedule_count} Used, Limit Reached
//                     </span>
//                   )}

//                   {(!testAppointment.reschedule_reason ||
//                     testAppointment.reschedule_count < 2) && (
//                       <span className="text-info">
//                         {testAppointment.reschedule_count} Used,{" "}
//                         {2 - testAppointment.reschedule_count} Left
//                       </span>
//                     )}
//                   {testAppointment.reschedule_reason &&
//                     testAppointment.reschedule_reason == "Other" && (
//                       <Link
//                         className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger"
//                         to="#"
//                         onClick={e => this.openReasonModal(e, testAppointment)}
//                       >
//                         {testAppointment.reason.slice(0, 10) + "..."}
//                       </Link>
//                     )}

//                   {testAppointment.reschedule_reason &&
//                     testAppointment.reschedule_reason != "Other" && (
//                       <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
//                         {testAppointment.reschedule_reason}
//                       </span>
//                     )}

//                   {!testAppointment.reschedule_reason && (
//                     <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-primary">
//                       Not Rescheduled
//                     </span>
//                   )}
//                   {/* <Link
// to="#"
// onClick={e => this.openMessageModal(e, testAppointment)}
// >
// {testAppointment.reschedule_reason.slice(0, 10) + "..."}
// </Link>{" "} */}
//                 </span>
//               </span>
//             </>
//           ),
//         },
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
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                  {testAppointment.payment_method},{" "}
                  {testAppointment.payment_status}
                </span>
              )}
            </>
          ),
        },
        // {
        //   dataField: "invoice",
        //   text: "Invoice",
        //   isDummyField: true,
        //   editable: false,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       <Link
        //         className="btn btn-primary btn-rounded font-size-10"
        //         to={`/lab-invoice-detail/${testAppointment.id}`}
        //       >
        //         Invoice
        //       </Link>
        //     </>
        //   ),
        // },
        // {
        //   dataField: "payment",
        //   text: "Payment",
        //   isDummyField: true,
        //   editable: false,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       <Link
        //         className="btn btn-primary btn-rounded font-size-10"
        //         to={`/lab-payments/${testAppointment.id}`}
        //       >
        //         Payment
        //       </Link>
        //     </>
        //   ),
        // },

        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, testAppointment) => (
            
            
            <div className="d-flex gap-2">
{testAppointment.payment_status == "Not Paid"&& (
            <Tooltip title="Payment">
               <Link
                className="far fa-money-bill-alt font-size-18"
                to={`/lab-payments/${testAppointment.id}`}
              >
              </Link>
            </Tooltip>
            
          )}
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
              <Tooltip title="Invoice">
              <Link
                className="mdi mdi-receipt font-size-18"
                to={`/lab-invoice-detail/${testAppointment.id}`}
              >
              </Link>
              </Tooltip>
              <Link className="text-success" to="#">
              <Tooltip title="Update">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() =>
                    this.handleTestAppointmentClick(testAppointment)
                  }
                ></i>
              </Tooltip>
              </Link>
              <Tooltip title="Add Comment">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/lab-note-list/${testAppointment.id}`}
                ></Link>
              </Tooltip>
            </div>
          ),
        },
      ],

    };
    // this.openPaymentModal =
    // this.openPaymentModal.bind(this);
    this.handleTestAppointmentClick =
      this.handleTestAppointmentClick.bind(this);
    this.toggleReasonModal = this.toggleReasonModal.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleTestAppointmentClicks =
      this.handleTestAppointmentClicks.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    this.toggleReshedualModal = this.toggleReshedualModal.bind(this);

  }
  componentDidMount() {
    const { onGetTestAppointmentsInProcessList } = this.props;
    onGetTestAppointmentsInProcessList(this.state.user_id);
    this.setState({ testAppointments: this.props.testAppointments });

    const { onGetSampleCollectors } = this.props;
    onGetSampleCollectors(this.state.user_id);
    this.setState({ sampleCollectors: this.props.sampleCollectors });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  openReasonModal = (e, arg) => {
    this.setState({ reasonModal: true, reason: arg.reason });
  };

  toggleReasonModal = () => {
    this.setState(prevState => ({
      reasonModal: !prevState.reasonModal,
    }));
  };

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

    console.log("payment_status: ");

    this.setState({
      testAppointment: {
        id: testAppointment.id,
        payment_status: testAppointment.payment_status,
        patient_unique_id: testAppointment.patient_unique_id,
        status: testAppointment.status,
        reschedule_reason: testAppointment.reschedule_reason,
        reason: testAppointment.reason,
        reschedule_count: testAppointment.reschedule_count,
        rescheduled_at: testAppointment.rescheduled_at,
        is_home_sampling_availed: testAppointment.is_home_sampling_availed,
        result_type: "File",
        url: "",
        result: "",
        collector_name: testAppointment.collector_name,
        assigned_to: testAppointment.assigned_to,
      },
      resultFile: "",
      isRescheduled: false,
    });

    this.toggle();
  };
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      appointment_requested_at: arg.appointment_requested_at,
      patient_unique_id: arg.patient_unique_id,
      patient_gender: arg.patient_gender,
      patient_age: arg.patient_age,
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



  handleAPICall = () => {
    const { onGetTestAppointmentsInProcessList, onUpdatePaymentInfo } =
      this.props;

    if (this.state.testAppointment) {
      onUpdatePaymentInfo(this.state.testAppointment);

      setTimeout(() => {
        onGetTestAppointmentsInProcessList(this.state.user_id);
      }, 1000);
    }
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

  // openPaymentModal = (e, arg) => {
  //   this.setState({
  //     // patient_id: testAppointment.patient_id,
  //     amount_received: arg.amount_received,
  //     conflict_reason: arg.conflict_reason,

  //   });
  //   this.togglePaymentModal();
  // };

  // togglePaymentModal = () => {
  //   this.setState(prevState => ({
  //     PaymentModal: !prevState.PaymentModal,
  //   }));
  // };
  render() {
    const { SearchBar } = Search;

    const { testAppointments } = this.props;

    const { onUpdateTestAppointment, onGetTestAppointmentsInProcessList } =
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

    const sampleCollectorList = [];
    for (let i = 0; i < this.props.sampleCollectors.length; i++) {
      sampleCollectorList.push({
        label: this.props.sampleCollectors[i].name,
        value: this.props.sampleCollectors[i].id,
      });
    }

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
              breadcrumbItem="In Process List"
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
                                                     Sampling Time by Patient
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
                                    {/* 
                                    <Modal
                                      isOpen={this.state.PaymentModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.togglePaymentModal}
                                        tag="h4"
                                      >
                                        <span></span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            amount_received:
                                              (testAppointment &&
                                                testAppointment.amount_received) ||
                                              "",
                                            conflict_reason:
                                              (testAppointment &&
                                                testAppointment.conflict_reason) ||
                                              "",
                                          
                                          }}
                                          validationSchema={Yup.object().shape({

                                          })}
                                          onSubmit={values => {
                                            if (this.state.testAppointment)  {
                                              const updatePaymentInfo = {
                                                id: testAppointment.id,
                                                amount_received:
                                                  values.amount_received,
                                                conflict_reason:
                                                  values.conflict_reason,
                                                
                                                process: "inprocess",
                                              };

                                              // update TestAppointment
                                              onUpdatePaymentInfo(
                                                updatePaymentInfo 
                                              );
                                            }

                                            setTimeout(() => {
                                              onGetTestAppointmentsInProcessList(
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
                                                  

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                    amount_received
                                                    </Label>
                                                    <input
                                                      name="amount_received"
                                                      type="text"
                                                      // readOnly={true}
                                                      value={
                                                        testAppointment.amount_received
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          testAppointment: {
                                                            id: testAppointment.id,
                                                            conflict_reason:
                                                              testAppointment.conflict_reason,
                                                            amount_received:
                                                              e.target.value,
                                                           
                                                          },
                                                        });
                                                      }}
                                                      className="form-control"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                    conflict_reason
                                                    </Label>
                                                    <input
                                                      name="conflict_reason"
                                                      type="text"
                                                      // readOnly={true}
                                                      value={
                                                        testAppointment.conflict_reason
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          testAppointment: {
                                                            id: testAppointment.id,
                                                            amount_received:
                                                              testAppointment.amount_received,
                                                            conflict_reason:
                                                              e.target.value,
                                                           
                                                          },
                                                        });
                                                      }}
                                                      className="form-control"
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
                                                      onClick={
                                                        this.handleAPICall
                                                      }
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
                                    </Modal> */}

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
                                            // patient_name:
                                            //   (testAppointment &&
                                            //     testAppointment.patient_name) ||
                                            //   "",
                                            // patient_age:
                                            //   (testAppointment &&
                                            //     testAppointment.patient_age) ||
                                            //   "",
                                            // patient_gender:
                                            //   (testAppointment &&
                                            //     testAppointment.patient_gender) ||
                                            //   "",
                                            // booked_at:
                                            //   (testAppointment &&
                                            //     testAppointment.booked_at) ||
                                            //   "",
                                            // appointment_requested_at:
                                            //   (testAppointment &&
                                            //     testAppointment.appointment_requested_at) ||
                                            //   "",
                                            estimated_sample_collection_at:
                                              (testAppointment &&
                                                testAppointment.estimated_sample_collection_at) ||
                                              "",
                                            // estimated_result_uploading_at:
                                            //   (testAppointment &&
                                            //     testAppointment.estimated_result_uploading_at) ||
                                            //   "",
                                            patient_unique_id:
                                              (testAppointment &&
                                                testAppointment.patient_unique_id) ||
                                              "",
                                            status:
                                              (testAppointment &&
                                                testAppointment.status) ||
                                              "",
                                            reschedule_reason:
                                              (testAppointment &&
                                                testAppointment.reschedule_reason) ||
                                              "",
                                            reason:
                                              (testAppointment &&
                                                testAppointment.reason) ||
                                              "",
                                            result_type:
                                              (testAppointment &&
                                                testAppointment.result_type) ||
                                              "File",
                                            url:
                                              (testAppointment &&
                                                testAppointment.url) ||
                                              "",
                                            result:
                                              (this.state &&
                                                this.state.resultFile) ||
                                              "",
                                            assigned_to:
                                              (testAppointment &&
                                                testAppointment.assigned_to) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            url: Yup.string()
                                              .url("Please enter a valid url")
                                              .when(["status", "result_type"], {
                                                is: (status, result_type) =>
                                                  status ===
                                                  "Result Uploaded" &&
                                                  result_type === "Link",
                                                then: Yup.string().required(
                                                  "Please enter url to the patient's result"
                                                ),
                                              }),
                                            reschedule_reason:
                                              Yup.string().when("status", {
                                                is: status =>
                                                  status === "Rescheduled",
                                                then: Yup.string().required(
                                                  "Please select rescheduling reason"
                                                ),
                                              }),
                                            reason: Yup.string().when(
                                              "reschedule_reason",
                                              {
                                                is: reschedule_reason =>
                                                  reschedule_reason === "Other",
                                                then: Yup.string().required(
                                                  "Please enter rescheduling reason"
                                                ),
                                              }
                                            ),
                                            result: Yup.string().when(
                                              ["status", "result_type"],
                                              {
                                                is: (status, result_type) =>
                                                  status ===
                                                  "Result Uploaded" &&
                                                  result_type === "File",
                                                then: Yup.string().required(
                                                  "Please upload the file of patient's result"
                                                ),
                                              }
                                            ),
                                          })}
                                          onSubmit={values => {
                                            if (this.state.isRescheduled) {
                                              const data = {
                                                id: testAppointment.id,
                                                reschedule_reason:
                                                  values.reschedule_reason,
                                                reason: values.reason,
                                                rescheduledBy: "Lab",
                                                status: "Rescheduled",
                                                process: "rescheduling",
                                              };

                                              // update TestAppointment
                                              onUpdateTestAppointment(data);
                                            } else {
                                              const updateTestAppointment = {
                                                id: testAppointment.id,
                                                patient_unique_id:
                                                  values.patient_unique_id,
                                                status: values.status,
                                                // reschedule_reason:
                                                //   values.reschedule_reason,
                                                // reason: values.reason,
                                                result_type: values.result_type,
                                                url: values.url,
                                                result: this.state.resultFile,
                                                assigned_to:
                                                 values.assigned_to,
                                                process: "inprocess",
                                              };

                                              // update TestAppointment
                                              onUpdateTestAppointment(
                                                updateTestAppointment
                                              );
                                            }

                                            setTimeout(() => {
                                              onGetTestAppointmentsInProcessList(
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
                                                  {testAppointment.reschedule_count >=
                                                    2 && (
                                                      <Alert color="info mb-3">
                                                        We&#39;ve disabled{" "}
                                                        <strong>
                                                          rescheduling option
                                                        </strong>{" "}
                                                        from this appointment as
                                                        you reached the{" "}
                                                        <strong>
                                                          maximum limit
                                                        </strong>{" "}
                                                        of rescheduling that is 2.
                                                      </Alert>
                                                    )}

                                                  {testAppointment.payment_status ==
                                                    "Not Paid" &&
                                                    testAppointment.status ==
                                                    "Sample Collected" && 
                                                    (
                                                      <Alert color="warning mb-3">
                                                        We&#39;ve disabled{" "}
                                                        <strong>
                                                          result uploading
                                                        </strong>{" "}
                                                        option from this
                                                        appointment as
                                                        patient&#39;s payment
                                                        status is{" "}
                                                        <strong>
                                                          Not Paid
                                                        </strong>
                                                        .
                                                      </Alert>
                                                    )}
                                                  {/* {testAppointment.payment_status ==
                                                    "Paid" &&
                                                    testAppointment.status ==
                                                  // "Sample Collected" && 
                                                    "rescheduling" && (
                                                      <Alert color="warning mb-3">
                                                        We&#39;ve disabled{" "}
                                                        <strong>
                                                          result uploading
                                                        </strong>{" "}
                                                        option from this
                                                        appointment as
                                                        patient&#39;s payment
                                                        status is{" "}
                                                        <strong>
                                                          Paid
                                                        </strong>
                                                        .
                                                      </Alert>
                                                  )} */}
                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Name
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
                                                    ></Field>
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
                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Estimated sample
                                                      collection at
                                                    </Label>
                                                    <input
                                                      name="estimated_sample_collection_at"
                                                      type="datetime-local"
                                                      readOnly={true}
                                                      defaultValue={this.state.testAppointment.estimated_sample_collection_at.slice(
                                                        0,
                                                        -9
                                                      )}
                                                      className="form-control"
                                                    />
                                                  </div> */}
                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Estimated result uploading
                                                      at
                                                    </Label>
                                                    <input
                                                      name="estimated_result_uploading_at"
                                                      type="datetime-local"
                                                      readOnly={true}
                                                      defaultValue={this.state.testAppointment.estimated_result_uploading_at.slice(
                                                        0,
                                                        -9
                                                      )}
                                                      className="form-control"
                                                    />
                                                  </div> */}

                                                  {/* <Field
                                                    type="hidden"
                                                    className="form-control"
                                                    name="reschedule_count"
                                                    value={
                                                      testAppointment.reschedule_count
                                                    }
                                                  /> */}

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Patient Unique ID
                                                      (optional)
                                                    </Label>
                                                    <input
                                                      name="patient_unique_id"
                                                      type="text"
                                                      // readOnly={true}
                                                      value={
                                                        testAppointment.patient_unique_id
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          testAppointment: {
                                                            id: testAppointment.id,
                                                            payment_status:
                                                              testAppointment.payment_status,
                                                            patient_unique_id:
                                                              e.target.value,
                                                            is_home_sampling_availed:
                                                              testAppointment.is_home_sampling_availed,
                                                            status:
                                                              testAppointment.status,
                                                            reschedule_reason:
                                                              testAppointment.reschedule_reason,
                                                            reschedule_count:
                                                              testAppointment.reschedule_count,
                                                            reason:
                                                              testAppointment.reason,
                                                            result_type:
                                                              testAppointment.result_type,
                                                            url: testAppointment.url,
                                                            result:
                                                              this.state
                                                                .resultFile,
                                                            assigned_to:
                                                              testAppointment.assigned_to,
                                                          },
                                                        });
                                                      }}
                                                      className="form-control"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Status
                                                    </Label>
                                                    <Field
                                                      name="status"
                                                      as="select"
                                                      value={
                                                        testAppointment.status
                                                      }
                                                      onChange={e => {
                                                        if (
                                                          e.target.value ==
                                                          "Rescheduled"
                                                        ) {
                                                          this.setState({
                                                            isRescheduled: true,
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              payment_status:
                                                                testAppointment.payment_status,
                                                              patient_unique_id:
                                                                testAppointment.patient_unique_id,
                                                              is_home_sampling_availed:
                                                                testAppointment.is_home_sampling_availed,
                                                              status:
                                                                e.target.value,
                                                              reschedule_reason:
                                                                testAppointment.reschedule_reason,
                                                              reschedule_count:
                                                                testAppointment.reschedule_count,
                                                              reason:
                                                                testAppointment.reason,
                                                              result_type:
                                                                testAppointment.result_type,
                                                              url: testAppointment.url,
                                                              result:
                                                                this.state
                                                                  .resultFile,
                                                              assigned_to:
                                                                testAppointment.assigned_to,
                                                            },
                                                          });
                                                        } else {
                                                          this.setState({
                                                            isRescheduled: false,
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              payment_status:
                                                                testAppointment.payment_status,
                                                              patient_unique_id:
                                                                testAppointment.patient_unique_id,
                                                              is_home_sampling_availed:
                                                                testAppointment.is_home_sampling_availed,
                                                              status:
                                                                e.target.value,
                                                              reschedule_reason:
                                                                testAppointment.reschedule_reason,
                                                              reschedule_count:
                                                                testAppointment.reschedule_count,
                                                              reason:
                                                                testAppointment.reason,
                                                              result_type:
                                                                testAppointment.result_type,
                                                              url: testAppointment.url,
                                                              result:
                                                                this.state
                                                                  .resultFile,
                                                              assigned_to:
                                                                testAppointment.assigned_to,
                                                            },
                                                          });
                                                        }
                                                      }}
                                                      className="form-control"
                                                      readOnly={false}
                                                      multiple={false}
                                                    >
                                                      {/* <option value="Confirmed">
                                                        Confirmed
                                                      </option> */}
                                                 
                                                        <option value="Confirmed">
                                                          Confirmed
                                                        </option>
                                                    
                                                          <option value="Sample Collected">
                                                            Sample Collected
                                                          </option>
                                                    
                                            
                                                      {/* <option value="Sample Declined">
                                                        Sample Declined
                                                      </option>
                                                      <option value="Sample Insufficient">
                                                        Sample Insufficient
                                                      </option>
                                                      <option value="Sample Spilled">
                                                        Sample Spilled
                                                      </option> */}

                                                      {testAppointment.reschedule_count <
                                                        2 && (
                                                          <option value="Rescheduled">
                                                            Rescheduled
                                                          </option>
                                                        )}

                                                      {testAppointment.payment_status !=
                                                        "Not Paid" && 
                                                        testAppointment.status !==
                                                        "Rescheduled" && (
                                                          <option value="Result Uploaded">
                                                            Result Uploaded
                                                          </option>
                                                        )}
                                                    </Field>
                                                  </div>

                                                  {this.state.testAppointment
                                                    .status == "Rescheduled" &&
                                                    testAppointment.reschedule_count <
                                                    2 && (
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          Rescheduling Reason
                                                        </Label>
                                                        <Field
                                                          name="reschedule_reason"
                                                          as="select"
                                                          value={
                                                            testAppointment.reschedule_reason
                                                          }
                                                          onChange={e => {
                                                            this.setState({
                                                              isRescheduled: true,
                                                              testAppointment: {
                                                                id: testAppointment.id,
                                                                payment_status:
                                                                  testAppointment.payment_status,
                                                                patient_unique_id:
                                                                  testAppointment.patient_unique_id,
                                                                is_home_sampling_availed:
                                                                  testAppointment.is_home_sampling_availed,
                                                                status:
                                                                  testAppointment.status,
                                                                reschedule_reason:
                                                                  e.target
                                                                    .value,
                                                                reschedule_count:
                                                                  testAppointment.reschedule_count,
                                                                reason:
                                                                  testAppointment.reason,
                                                                result_type:
                                                                  testAppointment.result_type,
                                                                url: testAppointment.url,
                                                                result:
                                                                  this.state
                                                                    .resultFile,
                                                                assigned_to:
                                                                  testAppointment.assigned_to,
                                                              },
                                                            });
                                                          }}
                                                          className={
                                                            "form-control" +
                                                            (errors.reschedule_reason &&
                                                              touched.reschedule_reason
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          readOnly={false}
                                                          multiple={false}
                                                        >
                                                          <option value="">
                                                            ---- Please select
                                                            appointment
                                                            rescheduling reason
                                                            ----
                                                          </option>
                                                          <option value="Sample Declined">
                                                            Sample Declined
                                                          </option>
                                                          <option value="Sample Insufficient">
                                                            Sample Insufficient
                                                          </option>
                                                          <option value="Sample Spilled">
                                                            Sample Spilled
                                                          </option>
                                                          <option value="Other">
                                                            Other
                                                          </option>
                                                        </Field>

                                                        <ErrorMessage
                                                          name="reschedule_reason"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </div>
                                                    )}

                                                  {this.state.testAppointment
                                                    .reschedule_reason ==
                                                    "Other" &&
                                                    this.state.testAppointment
                                                      .reschedule_count < 2 && (
                                                      <div className="mb-3">
                                                        <Label for="reason">
                                                          Reason for
                                                          Rescheduling
                                                        </Label>
                                                        <textarea
                                                          name="reason"
                                                          id="reason"
                                                          rows="2"
                                                          cols="5"
                                                          placeholder="Enter your reason"
                                                          value={
                                                            testAppointment.reason
                                                          }
                                                          onChange={e => {
                                                            this.setState({
                                                              testAppointment: {
                                                                id: testAppointment.id,
                                                                payment_status:
                                                                  testAppointment.payment_status,
                                                                patient_unique_id:
                                                                  testAppointment.patient_unique_id,
                                                                is_home_sampling_availed:
                                                                  testAppointment.is_home_sampling_availed,
                                                                status:
                                                                  testAppointment.status,
                                                                reschedule_reason:
                                                                  testAppointment.reschedule_reason,
                                                                reschedule_count:
                                                                  testAppointment.reschedule_count,
                                                                reason:
                                                                  e.target
                                                                    .value,
                                                                result_type:
                                                                  testAppointment.result_type,
                                                                url: testAppointment.url,
                                                                result:
                                                                  this.state
                                                                    .resultFile,
                                                                assigned_to:
                                                                  testAppointment.assigned_to,
                                                              },
                                                            });
                                                          }}
                                                          className={
                                                            "form-control" +
                                                            (errors.reason &&
                                                              touched.reason
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                        />
                                                        <ErrorMessage
                                                          name="reason"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </div>
                                                    )}

                                                  {this.state.testAppointment
                                                    .is_home_sampling_availed == true && (
                                                      <div className="mb-3">
                                                        <Label>
                                                          Assigned to (Sample
                                                          Collector)
                                                        </Label>
                                                        <Select
                                                          name="assigned_to"
                                                          component="Select"
                                                          placeholder="Select home sample collector..."
                                                          onChange={selectedGroup => {
                                                            this.setState({
                                                              testAppointment: {
                                                                id: testAppointment.id,
                                                                payment_status:
                                                                  testAppointment.payment_status,
                                                                patient_unique_id:
                                                                  testAppointment.patient_unique_id,
                                                                is_home_sampling_availed:
                                                                  testAppointment.is_home_sampling_availed,
                                                                status:
                                                                  testAppointment.status,
                                                                reschedule_reason:
                                                                  testAppointment.reschedule_reason,
                                                                reschedule_count:
                                                                  testAppointment.reschedule_count,
                                                                reason:
                                                                  testAppointment.reason,
                                                                result_type:
                                                                  testAppointment.result_type,
                                                                url: testAppointment.url,
                                                                result:
                                                                  this.state
                                                                    .resultFile,
                                                                assigned_to:
                                                                  selectedGroup.value,
                                                              },
                                                            });
                                                          }}
                                                          className="defautSelectParent"
                                                          options={
                                                            sampleCollectorList
                                                          }
                                                          defaultValue={{
                                                            label:
                                                              testAppointment.collector_name,
                                                            value:
                                                              testAppointment.assigned_to,
                                                          }}
                                                        />
                                                      </div>
                                                    )}
                                                  {this.state.testAppointment
                                                    .status ===
                                                    "Result Uploaded" && (
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          Result type
                                                        </Label>
                                                        <Field
                                                          name="result_type"
                                                          as="select"
                                                          value={
                                                            testAppointment.result_type
                                                          }
                                                          onChange={e => {
                                                            this.setState({
                                                              testAppointment: {
                                                                id: testAppointment.id,
                                                                patient_unique_id:
                                                                  testAppointment.patient_unique_id,
                                                                is_home_sampling_availed:
                                                                  testAppointment.is_home_sampling_availed,
                                                                status:
                                                                  testAppointment.status,
                                                                reschedule_reason:
                                                                  testAppointment.reschedule_reason,
                                                                reschedule_count:
                                                                  testAppointment.reschedule_count,
                                                                reason:
                                                                  testAppointment.reason,
                                                                result_type:
                                                                  e.target.value,
                                                                url: testAppointment.url,
                                                                result:
                                                                  this.state
                                                                    .resultFile,
                                                                assigned_to:
                                                                  testAppointment.assigned_to,
                                                              },
                                                            });
                                                          }}
                                                          className="form-control"
                                                          readOnly={false}
                                                          multiple={false}
                                                        >
                                                          <option value="File">
                                                            File
                                                          </option>
                                                          <option value="Link">
                                                            Link
                                                          </option>
                                                        </Field>
                                                      </div>
                                                    )}
                                                  {this.state.testAppointment
                                                    .status ===
                                                    "Result Uploaded" &&
                                                    this.state.testAppointment
                                                      .result_type ===
                                                    "Link" && (
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          URL
                                                        </Label>
                                                        <input
                                                          type="text"
                                                          className={
                                                            "form-control" +
                                                            (errors.url &&
                                                              touched.url
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          value={
                                                            testAppointment.url
                                                          }
                                                          onChange={e => {
                                                            this.setState({
                                                              testAppointment: {
                                                                id: testAppointment.id,
                                                                patient_unique_id:
                                                                  testAppointment.patient_unique_id,
                                                                is_home_sampling_availed:
                                                                  testAppointment.is_home_sampling_availed,
                                                                status:
                                                                  testAppointment.status,
                                                                reschedule_reason:
                                                                  testAppointment.reschedule_reason,
                                                                reschedule_count:
                                                                  testAppointment.reschedule_count,
                                                                reason:
                                                                  testAppointment.reason,
                                                                result_type:
                                                                  testAppointment.result_type,
                                                                url: e.target
                                                                  .value,
                                                                result:
                                                                  this.state
                                                                    .resultFile,
                                                                assigned_to:
                                                                  testAppointment.assigned_to,
                                                              },
                                                            });
                                                          }}
                                                        />
                                                        <ErrorMessage
                                                          name="url"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </div>
                                                    )}
                                                  {/* Display current image in edit form only */}
                                                  {this.state.testAppointment
                                                    .status ===
                                                    "Result Uploaded" &&
                                                    this.state.testAppointment
                                                      .result_type ===
                                                    "File" && (
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          Result File
                                                        </Label>
                                                        <Input
                                                          id="formFile"
                                                          name="result"
                                                          placeholder="Choose file"
                                                          type="file"
                                                          multiple={false}
                                                          accept=".jpg,.jpeg,.png,.word,.pdf"
                                                          onChange={e => {
                                                            this.setState({
                                                              resultFile:
                                                                e.target
                                                                  .files[0],
                                                            });
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

TestAppointmentsInProcessList.propTypes = {
  match: PropTypes.object,
  testAppointments: PropTypes.array,
  sampleCollectors: PropTypes.array,
  className: PropTypes.any,
  onGetTestAppointmentsInProcessList: PropTypes.func,
  onGetSampleCollectors: PropTypes.func,
  onUpdateTestAppointment: PropTypes.func,
  onUpdatePaymentInfo: PropTypes.func,
};

const mapStateToProps = ({ testAppointments, sampleCollectors }) => ({
  sampleCollectors: sampleCollectors.sampleCollectors,
  testAppointments: testAppointments.testAppointmentsInProcessList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetTestAppointmentsInProcessList: id =>
    dispatch(getTestAppointmentsInProcessList(id)),
  onGetSampleCollectors: id => dispatch(getSampleCollectors(id)),
  onUpdateTestAppointment: testAppointment =>
    dispatch(updateTestAppointment(testAppointment)),
  onUpdatePaymentInfo: id => dispatch(updatePaymentInfo(id)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestAppointmentsInProcessList));
