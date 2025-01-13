import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import Tooltip from "@material-ui/core/Tooltip";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Alert,

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
import { getApprovedLabs, updateMembershipStatus} from "store/registration-admin/actions";
import "assets/scss/table.scss";

class ApprovedLabs extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      approvedLabs: [],
      id: "",
      successMessage: "",
      btnText: "Copy",
      organization_name: '',
      isHovered: false,
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      approvedLab: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      approvedLabListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, approvedLabs) => <>{approvedLabs.id}</>,
        },
          {
                  dataField: "district",
                  text: "Participant District",
                  sort: true,
                  headerStyle: { textAlign: 'center' }, 
                  style: { textAlign: 'center' },        
                  filter: textFilter(),
                  formatter: (cellContent, AllLabs) => (
                    <>
                      <span style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      {AllLabs.district}
        
                      </span>
                    </>
                  ),filter: textFilter(),
                },
                {
                  dataField: "city",
                  text: "Participant City",
                  sort: true,
                  headerStyle: { textAlign: 'center' }, 
                  style: { textAlign: 'center' },        
                  filter: textFilter(),
                  formatter: (cellContent, AllLabs) => (
                    <>
                      <span  style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      {AllLabs.city}
        
                      </span>
                    </>
                  ),filter: textFilter(),
                },
                {
                  dataField: "name",
                  text: "Participant name",
                  sort: true,
                  headerStyle: { textAlign: 'center' }, 
                  style: { textAlign: 'center' },        
                  filter: textFilter(),
                  formatter: (cellContent, AllLabs) => (
                    <>
                      <span  style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                          <Link
                            to="#"
                            // onClick={e => this.openLabModal(e, AllLabs)}
                            onMouseEnter={e => this.openLabModal(e, AllLabs)}
                            onPointerLeave={this.handleMouseExit()}
                          >
                           {AllLabs.name}
                          </Link>
                      </span>
                    </>
                  ),filter: textFilter(),
                },
                {
                  dataField: "lab_staff_name",
                  text: "Name",
                  sort: true,
                  headerStyle: { textAlign: 'center' }, 
                  style: { textAlign: 'center' },        
                  filter: textFilter(),
                  formatter: (cellContent, AllLabs) => (
                    <>
                      <span style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        {AllLabs.lab_staff_name}
                      </span>
                    </>
                  ),filter: textFilter(),
                },
                {
                  dataField: "email_participant",
                  text: "Email",
                  sort: true,
                  headerStyle: { textAlign: 'center', width: '200px' },
                  style: { textAlign: 'center'  },
                  filter: textFilter(),
                  formatter: (cellContent, AllLabs) => (
                    <>
                      <span
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          width: '200px',
                          gap: '30px',
                          wordBreak: 'break-word',   // Breaks long words if necessary
                          overflowWrap: 'break-word' // Ensures text wraps properly
                        }}
                      >
                        {AllLabs.email_participant}
                      </span>
                    </>
                  ),
                  filter: textFilter()
                },
                {
                  dataField: "landline_registered_by",
                  text: "Contact No.",
                  headerStyle: { textAlign: 'center' }, 
                  style: { textAlign: 'center' },        
                  filter: textFilter(),
                  sort: true,
                  formatter: (cellContent, AllLabs) => (
                    <>
                      <span  style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        {AllLabs.landline_registered_by}
                      </span>
                    </>
                  ),filter: textFilter(),
                },
                {
                  dataField: "membership_status",
                  text: "Membership Status",
                  headerStyle: { textAlign: 'center' }, 
                  style: { textAlign: 'center' },        
                  filter: textFilter(),
                  sort: true,
                  formatter: (cellContent, AllLabs) => (
                    <>
                      <span  style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        {AllLabs.membership_status}
                      </span>
                    </>
                  ),filter: textFilter(),
                },
                {
                  dataField: "data",
                  text: "id",
                  isDummyField: true,
                  editable: false,
                  text: "Action",
                  headerStyle: { textAlign: 'center' }, 
                  style: { textAlign: 'center' },        
                  filter: textFilter(),
                  formatter: (cellContent, AllLabs) => (
                    <>
                    <div  style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <Tooltip title="Update">
                      <Link
                        className="btn btn-success btn-rounded"
                        to="#"
                        onClick={e => this.handleApprovedEvent(AllLabs.id)}
                        
                      >
                        <i className="mdi mdi-check-circle font-size-14"></i>
                      </Link>
                      </Tooltip>
                      {" "}
                      <Tooltip title="Delete">
                      <Link
                        className="btn btn-danger btn-rounded"
                        to="#"
                        onClick={() => this.handleUnapprovedEvent(AllLabs.id)}
                      >
                        <i className="mdi mdi-close-circle font-size-14"></i>
                      </Link>
                      </Tooltip>
                      </div>
                    </>
                  ),
                },
        // {
        //   dataField: "menu",
        //   isDummyField: true,
        //   editable: false,
        //   text: "Action",
        //   formatter: (cellContent, methodlist) => (
        //     <div>
        //       <Tooltip title="Update Membership Status">
        //         <Link className="text-success" to="#">
        //           <i
        //             className="mdi mdi-pencil font-size-18"
        //             id="edittooltip"
        //             onClick={() => this.toggle(methodlist)}
        //             // onClick={e => this.handleCSRClick(e, CSR)}
        //           ></i>
        //         </Link>
        //       </Tooltip>
        //       {/* <Tooltip title="History">
        //         <Link
        //           className="fas fa-comment font-size-18"
        //           to={`/databaseadmin-history/${methodlist.id}`}
        //         ></Link>
        //       </Tooltip> */}
        //     </div>
        //   ),
        // },
        // {
        //   dataField: "registered_by",
        //   text: "Registered by",
        //   sort: true,
        //   formatter: (cellContent, approvedLabs) => (
        //     <>
        //       {approvedLabs.registered_by == 'Lab' ? (
        //         <span>
                 
        //           <Link
        //         to="#"
                
        //         onMouseEnter={e =>  this.openLabModal(e, approvedLabs)}
        //         onPointerLeave={this.handleMouseExit()}
        //       >
        //        {approvedLabs.registered_by}
        //       </Link>
        //       </span>
        //       ) : (
        //         <span>
        //           <Link
        //         to="#"
        //         // onClick={e => this.openMarketerModal(e, approvedLabs)}
        //         onMouseEnter={e =>   this.openMarketerModal(e, approvedLabs)}
        //         onPointerLeave={this.handleMouseExit()}
        //       >
        //        {approvedLabs.registered_by}
        //       </Link>
        //         </span>
        //       )}
        //     </>
        //   ),filter: textFilter(),
        // },
        // {
        //   dataField: "email",
        //   text: "Email",
        //   // sort: true,
        //   formatter: (cellContent, approvedLab) => (
        //     <>
        //       <span className="float-start">
        //         {approvedLab.email}
        //       </span>
        //     </>
        //   ),
        //   filter: textFilter(),
        // },
        // {
        //   dataField: "lab_phone",
        //   text: "Phone",
        //   // sort: true,
        //   formatter: (cellContent, approvedLab) => (
        //     <>
        //       <span className="float-end">
        //         {approvedLab.lab_phone}
        //       </span>
        //     </>
        //   ),
        //   filter: textFilter(),
        // },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.handlePatientFeedbackClick =
      this.handlePatientFeedbackClick.bind(this);
  }
  displaySuccessMessage = message => {
    this.setState({ successMessage: message });

    setTimeout(() => {
      this.setState({ successMessage: "", modal: false });
    }, 3000);
  };

  componentDidMount() {
    const { organization_name } = this.props.match.params;
    this.setState({ organization_name });

    const { onGetApprovedLabs } = this.props;
    onGetApprovedLabs(this.state.user_id);
    // Set the initial dropdown value based on the URL
    this.setInitialDropdownValue();
  }
  setInitialDropdownValue = () => {
    const { pathname } = this.props.history.location;
    let selectedValue = '';

    if (pathname.includes(`/${this.state.organization_name}/pending-participant`)) {
      selectedValue = 'Pending Participant';
    } else if (pathname.includes(`/${this.state.organization_name}/approved-participant`)) {
      selectedValue = 'Approved Participant';
    } else if (pathname.includes(`/${this.state.organization_name}/unapproved-participant`)) {
      selectedValue = 'Unapproved Participant';
    } else if (pathname.includes(`/${this.state.organization_name}/all-participant`)) {
      selectedValue = 'All Participant';
    }

    this.setState({ selectedValue });
  };

  toggle(unit) {
    if (unit && unit.id) {
      this.setState({
        modal: true,
        selectedUnit: {
          id: unit.id,
          membership_status: unit.membership_status,
        },
        isEdit: true,
      });
    } else {
      this.setState({
        modal: true,
        selectedUnit: null,
        isEdit: false,
      });
    }
  }

  openLabModal = (e, arg) => {
    this.setState({
      LabModal: true,
      email: arg.email,
      shipping_address: arg.shipping_address,
      billing_address: arg.billing_address,
      isHovered: true,
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
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      lab_address: arg.lab_address,
      lab_name: arg.lab_name, 
      lab_city: arg.city,
      lab_district: arg.district,
      registered_at: arg.registered_at,
      done_at: arg.done_at,
      isHovered: true,
    });
  };
  handleMouseExit = () => {
    this.setState({
      PatientModal: false,
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

  handlePatientFeedbackClick = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.toggle();
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
  handleSelectChange = (event) => {
    const selectedValue = event.target.value;

    this.setState({ selectedValue });

    // Perform navigation based on the selected value
    if (selectedValue === 'Pending Participant') {
      this.props.history.push(`/${this.state.organization_name}/pending-participant`);
    }
    if (selectedValue === 'Approved Participant') {
      this.props.history.push(`/${this.state.organization_name}/approved-participant`);
    }
    if (selectedValue === 'Unapproved Participant') {
      this.props.history.push(`/${this.state.organization_name}/unapproved-participant`);
    }
    if (selectedValue === 'All Participant') {
      this.props.history.push(`/${this.state.organization_name}/all-participant`);
    }
  };

  render() {
    const { SearchBar } = Search;
    const { approvedLabs } = this.props;
    const data = this.state.data;
    const { onGetApprovedLabs } = this.props;

    const pageOptions = {
      sizePerPage: 50,
      totalSize: approvedLabs.length, // replace later with size(approvedLabs),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];
    const iconStyle = { color: 'red' }; // Customize the color here

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Approved Participant | NEQAS</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Participant " breadcrumbItem="Approved" />
            <Row className="justify-content-center align-item-center">

            <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.closeModal}
                                        tag="h4"
                                      >
                                        {"Update Membership Status"}
                                      </ModalHeader>
                                      <ModalBody>
                                        {this.state.successMessage && (
                                          <div
                                            className="alert alert-success"
                                            role="alert"
                                          >
                                            {this.state.successMessage}
                                          </div>
                                        )}
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                              membership_status: this.state.selectedUnit
                                              ? this.state.selectedUnit.membership_status
                                              : "Suspended",
                                          }}                                   
                                          onSubmit={async (
                                            values,
                                            { setSubmitting }
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

                                            const newUnit = {
                                              membership_status: values.membership_status,
                                              added_by: userId,
                                            };

                                            try {
                                              if (this.state.isEdit) {
                                                await this.props.onupdateMembershipStatus(
                                                  this.state.selectedUnit.id,
                                                  newUnit
                                                );
                                                this.displaySuccessMessage(
                                                  "Membership Status updated successfully!"
                                                );
                                                setTimeout(() => {
                                                  this.props.onGetApprovedLabs(this.state.user_id);
                                                }, 1000);
                                              } 
                                            } catch (error) {
                                              console.error(
                                                "Error updating/adding method:",
                                                error
                                              );
                                            }

                                            setSubmitting(false);
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">
                                                    Membership Status
                                                    </Label>
                                                    <Field
                                                      name="membership_status"
                                                      as="select"
                                                      defaultValue="Suspended"
                                                      className="form-control"
                                                      multiple={false}
                                                    >
                                                      <option value="Suspended">
                                                      Suspended
                                                      </option>
                                                      <option value="Active">
                                                        Active
                                                      </option>
                                                    </Field>
                                                    <ErrorMessage
                                                      name="membership_status"
                                                      component="div"
                                                      className="text-danger"
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
                                                      style={{
                                                        backgroundColor:
                                                          "#0000CD",
                                                        borderColor: "#0000CD",
                                                      }}
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
              <Col lg="10">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.approvedLabListColumns}
                      data={approvedLabs}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.approvedLabListColumns}
                          data={approvedLabs}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                             <Row className="mb-2">
                                <Col sm="4">
                                  <div className="ms-2 mb-4">
                                    <div>

                                      <select
                                        className="form-control select2"
                                        title="main_lab_appointments"
                                        name="main_lab_appointments"
                                        onChange={this.handleSelectChange}
                                        value={this.state.selectedValue}
                                      >
                                        <option value="Pending Participant">Pending Participant</option>
                                        <option value="Approved Participant">Approved Participant</option>
                                        <option value="Unapproved Participant">Unapproved Participant</option>
                                        <option value="All Participant">All Participant</option>
                                      </select>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                              <Row className="mb-2">
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
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-header-sky-blue"}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
                                      // sort={{ sortCaret: (order, column) => order === 'desc' ? <i className="fa fa-arrow-up" style={iconStyle}></i> : <i className="fa fa-arrow-down" style={iconStyle}></i> }} // Customize sort caret icons

                                    />
                                    {/* {this.state.isHovered && ( */}
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
                                                  {/* <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Lab Address
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_address
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div> */}
                                                  {/* <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      City
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_city
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div> */}
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
                                                        City
                                                      </Label>
                                                    </div>
                                                    <div className="col-md-9">
                                                      <input
                                                        type="text"
                                                        value={
                                                          this.state.lab_city
                                                        }
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
                                                          this.state.lab_district
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                      />
                                                    </div>
                                                  </div>
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
                                                          this.state.lab_address
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                      />
                                                    </div>
                                                  </div> */}

                                                  <div className="mb-3 row">
                                                    <div className="col-md-3">
                                                      <Label className="form-label">
                                                        Approvel At
                                                      </Label>
                                                    </div>
                                                    <div className="col-md-9">
                                                      <input
                                                        type="text"
                                                        value={
                                                          new Date(this.state.done_at).toLocaleString('en-US')
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="mb-3 row">
                                                    <div className="col-md-3">
                                                      <Label className="form-label">
                                                        Register At
                                                      </Label>
                                                    </div>
                                                    <div className="col-md-9">
                                                      <input
                                                        type="text"
                                                        value={
                                                          new Date(this.state.registered_at).toLocaleString('en-US')
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
                                    {/* )} */}
                                          <Modal
                                      isOpen={this.state.LabModal}
                                      
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
                                                      Email
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
                                                        this.state.shipping_address
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
                                                        this.state.billing_address
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
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

ApprovedLabs.propTypes = {
  match: PropTypes.object,
  approvedLabs: PropTypes.array,
  className: PropTypes.any,
  onGetApprovedLabs: PropTypes.func,
  onupdateMembershipStatus: PropTypes.func,
  history: PropTypes.any,
};
const mapStateToProps = ({ registrationAdmin }) => ({
  approvedLabs: registrationAdmin.approvedLabs,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetApprovedLabs: (id) => dispatch(getApprovedLabs(id)),
  onupdateMembershipStatus: (id, status) => dispatch(updateMembershipStatus({ id, ...status })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ApprovedLabs));
