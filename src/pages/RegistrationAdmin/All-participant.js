import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import { Tooltip } from "@material-ui/core";
import { Alert } from "reactstrap"; // For Alert component
import Select from "react-select"; // For Select component
// import PaymentModal from "../Authentication/participant-payment"; // Adjust the path based on where PaymentModal is located
import { addNewPayment } from "store/Payment/actions";
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
  ModalFooter,
  Button,
  Input,
} from "reactstrap";
import { getApprovedLabs } from "store/registration-admin/actions";
import { getcyclelist } from "store/cycle/actions";
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
  getAllLabs,
  updateAllLabs,
  approveUnapproveLab,
} from "store/registration-admin/actions";

import ApproveUnapproveModal from "components/Common/ApproveUnapproveModal";
import "assets/scss/table.scss";

class PendingLabs extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      AllLabs: [],
      approvedLabs: [],
      CycleList: [],
      id: "",
      btnText: "Copy",
      isPaymentModalOpen: false,
      organization_name: "",
      isApproved: false,
      unapprovedModal: false,
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      AllLabs: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      pendingLabListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, AllLabs) => <>{AllLabs.id}</>,
        },
        {
          dataField: "district",
          text: "Participant District",
          sort: true,
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          formatter: (cellContent, AllLabs) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {AllLabs.district}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "city",
          text: "Participant City",
          sort: true,
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          formatter: (cellContent, AllLabs) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {AllLabs.city}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "name",
          text: "Participant name",
          sort: true,
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          formatter: (cellContent, AllLabs) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Link
                  to="#"
                  // onClick={e => this.openLabModal(e, AllLabs)}
                  onMouseEnter={e => this.openLabModal(e, AllLabs)}
                  onPointerLeave={this.handleMouseExit} // Pass the function reference instead of calling it immediately
                >
                  {AllLabs.name}
                </Link>
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "lab_staff_name",
          text: "Name",
          sort: true,
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          formatter: (cellContent, AllLabs) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {AllLabs.lab_staff_name}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "email_participant",
          text: "Email",
          sort: true,
          headerStyle: { textAlign: "center", width: "200px" },
          style: { textAlign: "center" },
          filter: textFilter(),
          formatter: (cellContent, AllLabs) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "200px",
                  gap: "30px",
                  wordBreak: "break-word", // Breaks long words if necessary
                  overflowWrap: "break-word", // Ensures text wraps properly
                }}
              >
                {AllLabs.email_participant}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "landline_registered_by",
          text: "Contact No.",
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          sort: true,
          formatter: (cellContent, AllLabs) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {AllLabs.landline_registered_by}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "membership_status",
          text: "Membership Status",
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          sort: true,
          formatter: (cellContent, AllLabs) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {AllLabs.membership_status}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "data",
          text: "id",
          isDummyField: true,
          editable: false,
          text: "Action",
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          formatter: (cellContent, AllLabs) => (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {/* {/ Update Button /} */}
                <Tooltip title="Update">
                  <Link
                    className="text-success"
                    to="#"
                    onClick={() => this.toggleEditModal(AllLabs)} // Pass the AllLabs object
                  >
                    <i className="mdi mdi-pencil font-size-18"></i>
                  </Link>
                </Tooltip>

                {/* {/ Revert Status Button /} */}
                {/* <Tooltip title="Revert Status">
                  <Link
                    className="btn btn-danger btn-rounded"
                    to="#"
                    onClick={() => this.handleUnapprovedEvent(AllLabs.id)} // Opens the Approved/Unapproved modal
                  >
                    <i className="mdi mdi-refresh font-size-14"></i>
                  </Link>
                </Tooltip> */}
                <Tooltip title="Payment">
                  <Link
                    className=""
                    to="#"
                    onClick={() => this.isPaymentModalOpen(AllLabs.id)} // Pass the ID of the lab for later use
                  >
                    <i className="fas fa-money-bill-wave"></i>{" "}
                    {/* Payment Icon */}
                  </Link>
                </Tooltip>
              </div>
            </>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    this.toggleMarketerModal = this.toggleMarketerModal.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
  }
  isPaymentModalOpen = id => {
    this.setState(
      {
        isPaymentModalOpen: true,
        selectedLabId: id,
      },
      () => {
        console.log("Modal State Updated:", this.state.isPaymentModalOpen); // Check if state updates correctly
      }
    );
  };
  handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("photo", file);
  };
  togglePaymentModal = () => {
    this.setState(
      prevState => ({
        isPaymentModalOpen: !prevState.isPaymentModalOpen,
      }),
      () => {
        console.log("Modal Toggled, New State:", this.state.isPaymentModalOpen);
      }
    );
  };

  handleEditSubmit(values) {
    console.log("Form values:", values); // Check if the form is submitting correctly
    const updatedData = {
      id: values.id,
      name: values.name,
      email: values.email,
      address: values.address,
      shipping_address: values.shipping_address,
      billing_address: values.billing_address,
      marketer_name: values.marketer_name,
      city: values.city,
      district: values.district,
      lab_staff_name: values.lab_staff_name,
      email_participant: values.email_participant,
      landline_registered_by: values.landline_registered_by,
    };

    this.props.onupdateAllLabs(updatedData); // Dispatch update action

    this.toggleEditModal(); // Close the modal
  }

  componentDidMount() {
    const { organization_name } = this.props.match.params;
    const { ongetApprovedLabs, ongetcyclelist } = this.props;

    console.log("Fetching cycle list for user:", this.state.user_id);
    ongetApprovedLabs(this.state.user_id);

    console.log("Fetching CycleList for user:", this.state.user_id);
    ongetcyclelist(this.state.user_id);
    // this.fetchParticipants();
    this.setState({ organization_name }, () => {
      console.log("Organization name set:", this.state.organization_name);
    });

    const { onGetPendingLabs } = this.props;
    onGetPendingLabs(this.state.user_id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.approvedLabs !== this.props.approvedLabs) {
    }
    if (prevProps.CycleList !== this.props.CycleList) {
      console.log(
        "Updating local state with new CycleList:",
        this.props.CycleList
      );
      this.setState({ CycleList: this.props.CycleList });
    }
  }
  setInitialDropdownValue = () => {
    const { pathname } = this.props.history.location;
    const { organization_name } = this.state; // Now it's properly updated

    let selectedValue = "Pending Participant"; // Default

    if (pathname.includes(`/${organization_name}/pending-participant`)) {
      selectedValue = "Pending Participant";
    } else if (
      pathname.includes(`/${organization_name}/approved-participant`)
    ) {
      selectedValue = "Approved Participant";
    } else if (
      pathname.includes(`/${organization_name}/unapproved-participant`)
    ) {
      selectedValue = "Unapproved Participant";
    } else if (pathname.includes(`/${organization_name}/all-participant`)) {
      selectedValue = "All Participant";
    }

    this.setState({ selectedValue });
  };
  setInitialDropdownValue = () => {
    const { pathname } = this.props.history.location;
    let selectedValue = "";

    if (
      pathname.includes(`/${this.state.organization_name}/pending-participant`)
    ) {
      selectedValue = "Pending Participant";
    } else if (
      pathname.includes(`/${this.state.organization_name}/approved-participant`)
    ) {
      selectedValue = "Approved Participant";
    } else if (
      pathname.includes(
        `/${this.state.organization_name}/unapproved-participant`
      )
    ) {
      selectedValue = "Unapproved Participant";
    } else if (
      pathname.includes(`/${this.state.organization_name}/all-participant`)
    ) {
      selectedValue = "All Participant";
    }

    this.setState({ selectedValue });
  };
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      email: arg.email,
      landline_registered_by: arg.landline_registered_by,
    });
  };

  toggleEditModal = data => {
    this.setState({
      editModal: !this.state.editModal,
      id: data.id,
      name: data.name,
      email: data.email,
      address: data.address,
      district: data.district,
      city: data.city,
      shipping_address: data.shipping_address,
      billing_address: data.billing_address,
      lab_staff_name: data.lab_staff_name,
      marketer_name: data.marketer_name,
      email_participant: data.email_participant,
      landline_registered_by: data.landline_registered_by,
    });
  };
  toggleLabModal = () => {
    this.setState(prevState => ({
      LabModal: !prevState.LabModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  toggleModal = () => {
    this.setState(prevState => ({
      isModalOpen: !prevState.isModalOpen,
    }));
  };
  openLabModal = (e, arg) => {
    this.setState({
      LabModal: true,
      email: arg.email,
      shipping_address: arg.shipping_address,
      billing_address: arg.billing_address,
    });
  };
  handleMouseExit = () => {
    this.setState({
      PatientModal: false,
      MarketerModal: false,
      LabModal: false,
      isHovered: false,
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
  openMarketerModal = (e, arg) => {
    this.setState({
      MarketerModal: true,
      marketer_name: arg.marketer_name,
      marketer_phone: arg.marketer_phone,
    });
  };
  toggleMarketerModal = () => {
    this.setState(prevState => ({
      MarketerModal: !prevState.MarketerModal,
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

  handleApprovedEvent = id => {
    this.setState({ id: id, isApproved: true, unapprovedModal: true });
  };

  handleUnapprovedEvent = id => {
    this.setState({ id: id, isApproved: false, unapprovedModal: true });
  };

  callOnApproveUnapproveLab = () => {
    const { onApproveUnapproveLab, onGetPendingLabs } = this.props;

    const data = {
      id: this.state.user_id,
      labId: this.state.id,
      isApproved: this.state.isApproved,
    };

    // calling to unapprove lab
    onApproveUnapproveLab(data);

    // Calling to update list record
    setTimeout(() => {
      onGetPendingLabs(this.state.user_id);
    }, 1000);

    this.setState({ unapprovedModal: false });
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
  handleSelectChange = event => {
    const selectedValue = event.target.value;

    // Update the state
    this.setState({ selectedValue });

    // Perform navigation immediately using the selectedValue
    const { organization_name } = this.state; // Extract from state
    if (selectedValue === "Pending Participant") {
      this.props.history.push(`/${organization_name}/pending-participant`);
    }
    if (selectedValue === "Approved Participant") {
      this.props.history.push(`/${organization_name}/approved-participant`);
    }
    if (selectedValue === "Unapproved Participant") {
      this.props.history.push(`/${organization_name}/unapproved-participant`);
    }
    if (selectedValue === "All Participant") {
      this.props.history.push(`/${organization_name}/all-participant`);
    }
  };
  render() {
    const { SearchBar } = Search;

    const { AllLabs } = this.props;
    const data = this.state.data;
    const { onApproveUnapproveLab, onGetPendingLabs } = this.props;
    const { isPaymentModalOpen, togglePaymentModal } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: AllLabs.length, // replace later with size(AllLabs),
      custom: true,
    };
    // const { isPaymentModalOpen } = this.state;
    const { approvedLabs, CycleList } = this.state;

    const participantOptions = (this.props.approvedLabs || []).map(
      participant => ({
        value: participant.id, // ensure this is the correct unique identifier
        label: participant.name, // or any other field you'd like to display
      })
    );
    const schemeOptions = CycleList.map(scheme => ({
      value: scheme.id, // Use scheme ID instead of scheme name
      label: `(Scheme Name: ${scheme.scheme_name}) - (Cycle Number: ${scheme.cycle_no})`,
    }));

    console.log("Mapped scheme option:", schemeOptions);
    const { isModalOpen, toggleModal, isOpen, toggle, onSubmit } = this.state;
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
            <title>Pending Labs | External QC</title>
          </MetaTags>

          <ApproveUnapproveModal
            show={this.state.unapprovedModal}
            onYesClick={this.callOnApproveUnapproveLab}
            onCloseClick={() => this.setState({ unapprovedModal: false })}
          />

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Labs" breadcrumbItem="Pending" />
            <Row className="justify-content-center align-item-center">
              <Col lg="10">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.pendingLabListColumns}
                      data={AllLabs}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.pendingLabListColumns}
                          data={AllLabs}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="ms-2 mb-4">
                                    <div>
                                      {/* <Label for="main_lab_appointments" className="form-label"> */}
                                      {/* <strong>Select Pending, Approved, Unapproved and All Participant</strong> */}
                                      {/* </Label> */}
                                      <select
                                        className="form-control select2"
                                        title="main_lab_appointments"
                                        name="main_lab_appointments"
                                        onChange={this.handleSelectChange}
                                        value={this.state.selectedValue}
                                      >
                                        <option value="Pending Participant">
                                          Pending Participant
                                        </option>
                                        <option value="Approved Participant">
                                          Approved Participant
                                        </option>
                                        <option value="Unapproved Participant">
                                          Unapproved Participant
                                        </option>
                                        <option value="All Participant">
                                          All Participant
                                        </option>
                                      </select>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                              <Row className="mb-2 mt-3">
                                {/* <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col> */}
                              </Row>
                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-condensed table-hover"
                                      }
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={
                                        "table-header-sky-blue"
                                      }
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
                                    />
                                    <Modal
                                      isOpen={this.state.LabModal}
                                      className={this.props.className}
                                      onPointerLeave={this.handleMouseExit}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleLabModal}
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
                                                      email
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={this.state.email}
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Shipping Address
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .shipping_address
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Billing Address
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .billing_address
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
                                      isOpen={this.state.MarketerModal}
                                      className={this.props.className}
                                      onPointerLeave={this.handleMouseExit}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleMarketerModal}
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
                                                      Name
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.marketer_name
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
                                                      value={this.state.city}
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      District
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.district
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
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                      onPointerLeave={this.handleMouseExit}
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
                                                      Email
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={this.state.email}
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
                                                          .landline_registered_by
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
                                                            .landline_registered_by
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
                                      isOpen={this.state.editModal}
                                      toggle={this.toggleEditModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleEditModal}
                                      >
                                        Edit Lab Details
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          initialValues={{
                                            id: this.state.id,
                                            name: this.state.name,
                                            email: this.state.email,
                                            address: this.state.address,
                                            district: this.state.district,
                                            city: this.state.city,
                                            shipping_address:
                                              this.state.shipping_address,
                                            billing_address:
                                              this.state.billing_address,
                                            lab_staff_name:
                                              this.state.lab_staff_name,
                                            email_participant:
                                              this.state.email_participant,
                                            landline_registered_by:
                                              this.state.landline_registered_by,
                                          }}
                                          onSubmit={this.handleEditSubmit}
                                        >
                                          {({
                                            values,
                                            handleChange,
                                            handleSubmit,
                                          }) => (
                                            <Form onSubmit={handleSubmit}>
                                              <Row>
                                                <Col className="col-12">
                                                  {/* {/ Name Field /} */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Name
                                                    </Label>
                                                    <input
                                                      type="text"
                                                      value={values.name}
                                                      name="name"
                                                      className="form-control"
                                                      placeholder="Enter Name"
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  {/* {/ Email Field /} */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Email
                                                    </Label>
                                                    <input
                                                      type="email"
                                                      value={values.email}
                                                      name="email"
                                                      className="form-control"
                                                      placeholder="Enter Email"
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  {/* {/ Address Field /} */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Address
                                                    </Label>
                                                    <input
                                                      type="text"
                                                      value={values.address}
                                                      name="address"
                                                      className="form-control"
                                                      placeholder="Enter Address"
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  {/* {/ District and City in one row /} */}

                                                  {/* {/ Shipping Address Field /} */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Shipping Address
                                                    </Label>
                                                    <input
                                                      type="text"
                                                      value={
                                                        values.shipping_address
                                                      }
                                                      name="shipping_address"
                                                      className="form-control"
                                                      placeholder="Enter Shipping Address"
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  {/* / Billing Address Field / */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Billing Address
                                                    </Label>
                                                    <input
                                                      type="text"
                                                      value={
                                                        values.billing_address
                                                      }
                                                      name="billing_address"
                                                      className="form-control"
                                                      placeholder="Enter Billing Address"
                                                      onChange={handleChange}
                                                    />
                                                  </div>
                                                  {/* {/ Email of Notification Person /} */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Email of Notification
                                                      Person
                                                    </Label>
                                                    <input
                                                      type="email"
                                                      value={
                                                        values.email_participant
                                                      }
                                                      name="email_participant"
                                                      className="form-control"
                                                      placeholder="Enter Email"
                                                      onChange={handleChange}
                                                    />
                                                  </div>
                                                  <Row>
                                                    <Col md={6}>
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          District
                                                        </Label>
                                                        <input
                                                          type="text"
                                                          value={
                                                            values.district
                                                          }
                                                          name="district"
                                                          className="form-control"
                                                          placeholder="Enter District"
                                                          onChange={
                                                            handleChange
                                                          }
                                                        />
                                                      </div>
                                                    </Col>
                                                    <Col md={6}>
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          City
                                                        </Label>
                                                        <input
                                                          type="text"
                                                          value={values.city}
                                                          name="city"
                                                          className="form-control"
                                                          placeholder="Enter City"
                                                          onChange={
                                                            handleChange
                                                          }
                                                        />
                                                      </div>
                                                    </Col>
                                                  </Row>
                                                  {/* {/ Name and Contact No of Notification Person in one row /} */}
                                                  <Row>
                                                    <Col md={6}>
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          Name of Notification
                                                          Person
                                                        </Label>
                                                        <input
                                                          type="text"
                                                          value={
                                                            values.lab_staff_name
                                                          }
                                                          name="lab_staff_name"
                                                          className="form-control"
                                                          placeholder="Enter Name"
                                                          onChange={
                                                            handleChange
                                                          }
                                                        />
                                                      </div>
                                                    </Col>
                                                    <Col md={6}>
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          Contact No of
                                                          Notification Person
                                                        </Label>
                                                        <input
                                                          type="text"
                                                          value={
                                                            values.landline_registered_by
                                                          }
                                                          name="landline_registered_by"
                                                          className="form-control"
                                                          placeholder="Enter Contact No"
                                                          onChange={
                                                            handleChange
                                                          }
                                                        />
                                                      </div>
                                                    </Col>
                                                  </Row>

                                                  {/* {/ Submit Button /} */}
                                                  <div className="mb-3 text-end">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-primary"
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
                                      isOpen={this.state.isPaymentModalOpen}
                                      toggle={this.togglePaymentModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.togglePaymentModal}
                                      >
                                        Payment
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            photo: "",
                                            participant: "",
                                            paydate: "",
                                            paymentmethod: "",
                                            scheme: [],
                                            price: "",
                                            discount: 0,
                                            added_by: localStorage.getItem(
                                              "authUser"
                                            )
                                              ? JSON.parse(
                                                  localStorage.getItem(
                                                    "authUser"
                                                  )
                                                ).user_id
                                              : "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            participant: Yup.string().required(
                                              "Participant is required"
                                            ),
                                            scheme: Yup.array().min(
                                              1,
                                              "At least one scheme must be selected"
                                            ),
                                            price:
                                              Yup.string().required(
                                                "Price is required"
                                              ),
                                            paydate:
                                              Yup.string().required(
                                                "Date is required"
                                              ),
                                            photo: Yup.string().required(
                                              "Deposit Slip is required"
                                            ),
                                            paymentmethod:
                                              Yup.string().required(
                                                "Payment Method is required"
                                              ),
                                            discount: Yup.number()
                                              .min(
                                                0,
                                                "Discount must be at least 0%"
                                              )
                                              .max(
                                                100,
                                                "Discount cannot be more than 100%"
                                              )
                                              .required("Discount is required"),
                                          })}
                                          onSubmit={async (
                                            values,
                                            { setSubmitting, resetForm }
                                          ) => {
                                            const userId = localStorage.getItem(
                                              "authUser"
                                            )
                                              ? JSON.parse(
                                                  localStorage.getItem(
                                                    "authUser"
                                                  )
                                                ).user_id
                                              : "";
                                            const roundedPrice = Math.round(
                                              parseFloat(values.price)
                                            );
                                            const AddPayment = {
                                              participant: values.participant,
                                              scheme: values.scheme,
                                              price: roundedPrice,
                                              discount: values.discount,
                                              paydate: values.paydate,
                                              photo: values.photo,
                                              paymentmethod:
                                                values.paymentmethod,
                                              added_by: userId,
                                            };

                                            try {
                                              await this.props.onAddNewPayment(
                                                userId,
                                                AddPayment
                                              );
                                              resetForm();
                                              this.displaySuccessMessage(
                                                "Payment added successfully!"
                                              );
                                            } catch (error) {
                                              console.error(
                                                "Error adding payment:",
                                                error
                                              );
                                            }
                                            setTimeout(() => {
                                              this.props.ongetApprovedLabs(
                                                this.state.user_id
                                              );
                                            }, 1000);
                                            setTimeout(() => {
                                              this.props.ongetcyclelist(
                                                this.state.user_id
                                              );
                                            }, 1000);

                                            setSubmitting(false);
                                          }}
                                        >
                                          {({
                                            values,
                                            errors,
                                            touched,
                                            setFieldValue,
                                          }) => {
                                            const handleSchemeChange =
                                              selectedOption => {
                                                setFieldValue(
                                                  "scheme",
                                                  selectedOption
                                                    ? selectedOption.value
                                                    : null
                                                );
                                                const selectedScheme =
                                                  CycleList.find(
                                                    scheme =>
                                                      scheme.id ===
                                                      selectedOption?.value
                                                  );
                                                if (selectedScheme) {
                                                  const cycle_no =
                                                    selectedScheme.cycle_no;
                                                  let total_price = parseFloat(
                                                    selectedScheme.price
                                                  );
                                                  let roundedPrice =
                                                    Math.round(total_price);
                                                  setFieldValue(
                                                    "cycle_no",
                                                    cycle_no
                                                  );
                                                  setFieldValue(
                                                    "price",
                                                    roundedPrice.toFixed(2)
                                                  );

                                                  if (values.discount) {
                                                    const discountPrice =
                                                      roundedPrice -
                                                      (roundedPrice *
                                                        parseFloat(
                                                          values.discount
                                                        )) /
                                                        100;
                                                    roundedPrice =
                                                      Math.round(discountPrice);
                                                    setFieldValue(
                                                      "price",
                                                      roundedPrice.toFixed(2)
                                                    );
                                                  }
                                                }
                                              };

                                            const handleDiscountChange = e => {
                                              let discountValue = parseFloat(
                                                e.target.value
                                              );
                                              if (
                                                isNaN(discountValue) ||
                                                !discountValue
                                              ) {
                                                discountValue = 0;
                                              }
                                              setFieldValue(
                                                "discount",
                                                discountValue
                                              );

                                              const totalPrice =
                                                values.scheme.reduce(
                                                  (sum, schemeId) => {
                                                    const scheme =
                                                      CycleList.find(
                                                        scheme =>
                                                          scheme.id === schemeId
                                                      );
                                                    return (
                                                      sum +
                                                      (scheme
                                                        ? parseFloat(
                                                            scheme.price
                                                          )
                                                        : 0)
                                                    );
                                                  },
                                                  0
                                                );

                                              let discountedPrice =
                                                totalPrice -
                                                (totalPrice * discountValue) /
                                                  100;
                                              setFieldValue(
                                                "price",
                                                discountedPrice.toFixed(2)
                                              );
                                            };

                                            return (
                                              <Form>
                                                {errors.successMessage && (
                                                  <Alert color="success">
                                                    {errors.successMessage}
                                                  </Alert>
                                                )}

                                                <Row>
                                                  <Col>
                                                    <Label>Participant</Label>
                                                    <Select
                                                      name="participant"
                                                      options={
                                                        participantOptions
                                                      }
                                                      placeholder="Select Participant" // Optional: adds a placeholder
                                                      className={
                                                        errors.participant &&
                                                        touched.participant
                                                          ? "is-invalid"
                                                          : ""
                                                      }
                                                      onChange={selectedOption => {
                                                        setFieldValue(
                                                          "participant",
                                                          selectedOption?.value ||
                                                            ""
                                                        );
                                                      }}
                                                      value={
                                                        participantOptions.find(
                                                          option =>
                                                            option.value ===
                                                            values.participant
                                                        ) || null
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="participant"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>

                                                <Row>
                                                  <Col>
                                                    <Label>Scheme</Label>
                                                    <Select
                                                      name="scheme"
                                                      isMulti
                                                      options={schemeOptions}
                                                      className={
                                                        errors.scheme &&
                                                        touched.scheme
                                                          ? "is-invalid"
                                                          : ""
                                                      }
                                                      onChange={selectedOptions => {
                                                        const selectedValues =
                                                          selectedOptions
                                                            ? selectedOptions.map(
                                                                option =>
                                                                  option.value
                                                              )
                                                            : [];
                                                        setFieldValue(
                                                          "scheme",
                                                          selectedValues
                                                        );

                                                        console.log(
                                                          "Selected Scheme IDs:",
                                                          selectedValues
                                                        ); // Debugging

                                                        const totalPrice =
                                                          selectedValues.reduce(
                                                            (sum, schemeId) => {
                                                              const scheme =
                                                                this.props.CycleList.find(
                                                                  s =>
                                                                    s.id ===
                                                                    schemeId
                                                                );
                                                              return (
                                                                sum +
                                                                (scheme
                                                                  ? parseFloat(
                                                                      scheme.price
                                                                    )
                                                                  : 0)
                                                              );
                                                            },
                                                            0
                                                          );

                                                        console.log(
                                                          "Total Price:",
                                                          totalPrice
                                                        ); // Debugging
                                                        setFieldValue(
                                                          "price",
                                                          totalPrice.toFixed(2)
                                                        );
                                                      }}
                                                      value={schemeOptions.filter(
                                                        option =>
                                                          values.scheme.includes(
                                                            option.value
                                                          )
                                                      )}
                                                    />
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col>
                                                    <div className="mb-3">
                                                      <Label
                                                        for="price"
                                                        className="form-label"
                                                      >
                                                        Price
                                                      </Label>
                                                      <Field
                                                        name="price"
                                                        type="text"
                                                        placeholder="Enter price"
                                                        className={
                                                          "form-control" +
                                                          (errors.price &&
                                                          touched.price
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                        value={new Intl.NumberFormat(
                                                          "en-US"
                                                        ).format(
                                                          values.price || 0
                                                        )} // Format the value
                                                        readOnly
                                                      />
                                                      <ErrorMessage
                                                        name="price"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col>
                                                    <Label>Discount (%)</Label>
                                                    <Field
                                                      name="discount"
                                                      type="number"
                                                      className="form-control"
                                                      onChange={
                                                        handleDiscountChange
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="discount"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>

                                                <Row>
                                                  <Col>
                                                    <Label>Pay Date</Label>
                                                    <Field
                                                      name="paydate"
                                                      type="date"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage
                                                      name="paydate"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>

                                                <Row>
                                                  <Col>
                                                    <Label>Pay Copy</Label>
                                                    <Input
                                                      id="formFile"
                                                      name="photo"
                                                      type="file"
                                                      multiple={false}
                                                      accept=".jpg,.jpeg,.png"
                                                      onChange={event =>
                                                        this.handleFileChange(
                                                          event,
                                                          setFieldValue
                                                        )
                                                      }
                                                      className={
                                                        "form-control" +
                                                        (errors.photo &&
                                                        touched.photo
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="photo"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>

                                                <Row>
                                                  <Col>
                                                    <Label>
                                                      Payment Method
                                                    </Label>
                                                    <Select
                                                      name="paymentmethod"
                                                      options={[
                                                        {
                                                          value: "Online",
                                                          label: "Online",
                                                        },
                                                        {
                                                          value: "Cheque",
                                                          label: "Cheque",
                                                        },
                                                        {
                                                          value: "Cash",
                                                          label: "Cash",
                                                        },
                                                      ]}
                                                      onChange={selectedOption =>
                                                        setFieldValue(
                                                          "paymentmethod",
                                                          selectedOption?.value ||
                                                            ""
                                                        )
                                                      }
                                                      value={
                                                        values.paymentmethod
                                                          ? {
                                                              value:
                                                                values.paymentmethod,
                                                              label:
                                                                values.paymentmethod,
                                                            }
                                                          : null
                                                      }
                                                      className={
                                                        errors.paymentmethod &&
                                                        touched.paymentmethod
                                                          ? "is-invalid"
                                                          : ""
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="paymentmethod"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>

                                                <ModalFooter>
                                                  <Button
                                                    color="primary"
                                                    type="submit"
                                                  >
                                                    Save
                                                  </Button>
                                                </ModalFooter>
                                              </Form>
                                            );
                                          }}
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

PendingLabs.propTypes = {
  match: PropTypes.object,
  AllLabs: PropTypes.array,
  className: PropTypes.any,
  onGetPendingLabs: PropTypes.func,
  onApproveUnapproveLab: PropTypes.func,
  history: PropTypes.any,
  onupdateAllLabs: PropTypes.any,
  onAddNewPayment: PropTypes.func,
  ongetApprovedLabs: PropTypes.func,
  ongetcyclelist: PropTypes.func,
  approvedLabs: PropTypes.array,
  CycleList: PropTypes.array,
  isPaymentModalOpen: PropTypes.array,
  togglePaymentModal: PropTypes.array,
};
const mapStateToProps = ({ Account, registrationAdmin, CycleList }) => {
  const cycleList = registrationAdmin.CycleList || [];
  console.log("CycleList in mapStateToProps:", registrationAdmin, CycleList);
  return {
    userID: Account.userID,
    AllLabs: registrationAdmin.AllLabs,
    approvedLabs: registrationAdmin.approvedLabs || [],
    CycleList: CycleList.CycleList, // Ensure it never returns undefined
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onApproveUnapproveLab: data => dispatch(approveUnapproveLab(data)),
  onGetPendingLabs: id => dispatch(getAllLabs(id)),
  onGetInstrumentTypeList: id => dispatch(getSchemelist(id)),
  onAddNewType: (id, createUnit) => dispatch(addNewSchemeList(id, createUnit)),
  onUpdateType: (id, methodlist) =>
    dispatch(updateSchemeList({ id, ...methodlist })),
  onupdateAllLabs: updatedData => {
    console.log("Dispatching updatedData:", updatedData); // Check if updated data is being passed
    dispatch(updateAllLabs(updatedData));
  },
  ongetApprovedLabs: id => dispatch(getApprovedLabs(id)),
  ongetcyclelist: id => dispatch(getcyclelist(id)),
  onAddNewPayment: (id, payment) => dispatch(addNewPayment(id, payment)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PendingLabs));
