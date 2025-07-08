import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { Tooltip } from "@material-ui/core";
import { getcyclelist } from "store/cycle/actions";
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
import {
  getPendingLabs,
  approveUnapproveLab,
} from "store/registration-admin/actions";

import ApproveUnapproveModal from "components/Common/ApproveUnapproveModal";
import "assets/scss/table.scss";

class PendingCSRLabs extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      pendingLabs: [],
      id: "",
      organization_name: '',
      selectedParticipantType: "Pending Participant", // Default value
      btnText: "Copy",
      CycleList: [], // Store the cycle list here
      isApproved: false,
      unapprovedModal: false,
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      pendingLab: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      pendingLabListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, pendingLab) => <>{pendingLab.id}</>,
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
                     <span  style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                       {AllLabs.lab_staff_name}
                     </span>
                   </>
                 ),filter: textFilter(),
               },
               {
                dataField: "user_name",
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
                      {AllLabs.user_name}
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
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    this.toggleMarketerModal = this.toggleMarketerModal.bind(this); 
  }

  componentDidMount() {
    const { organization_name } = this.props.match.params;
    
    // Update state with organization_name and then call initial setup
    this.setState({ organization_name }, () => {
      this.setInitialDropdownValue();
    });
  
    const { onGetPendingLabs, ongetcyclelist } = this.props; // Destructure required props
    const { user_id } = this.state; // Get user ID from state
  
    // Fetch pending labs
    if (user_id) {
      onGetPendingLabs(user_id);
      console.log("Fetching pending labs for user:", user_id);
    } else {
      console.warn("User ID is missing. Skipping pending labs fetch.");
    }
  
    // Fetch cycle/scheme list
    if (user_id) {
      ongetcyclelist(user_id);
      console.log("Fetching cycle/scheme list for user:", user_id);
    } else {
      console.warn("User ID is missing. Skipping cycle list fetch.");
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.CycleList !== this.props.CycleList) {
      this.setState({ CycleList: this.props.CycleList });
    }
  }
 
 setInitialDropdownValue = () => {
  const { pathname } = this.props.history.location;
  const organization_name = this.props.match.params.organization_name;

  let selectedValue = "Pending Participant"; // Default

  if (pathname.includes(`/${organization_name}/CSRPendinglabs`)) {
    selectedValue = "Pending Participant";
  } else if (pathname.includes(`/${organization_name}/approvedCSRlabs`)) {
    selectedValue = "Approved Participant";
  } else if (pathname.includes(`/${organization_name}/UnapprovedCSRlabs`)) {
    selectedValue = "Unapproved Participant";
  } else if (pathname.includes(`/${organization_name}/suspendedCSRlabs`)) {
    selectedValue = "Suspended Participant";
  } else if (pathname.includes(`/${organization_name}/all-participants2`)) {
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
  toggleLabModal = () => {
    this.setState(prevState => ({
     LabModal: !prevState.LabModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
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
 handleFilterChange = (filterType, selectedValue) => {
  const { organization_name } = this.state;

  if (!organization_name || !filterType || !selectedValue) {
    console.error("Missing required parameters for navigation.");
    return;
  }

  // ✅ Fixed URL path
  const url = `/${organization_name}/all-participant2?filterType=${filterType}&filterValue=${selectedValue}`;


  this.props.history.push(url);
};


// Example dropdown change handler
onDropdownChange = (event) => {
    const selectedValue = event.target.value;
    this.handleFilterChange("participantType", selectedValue);
};

// Example of calling handleFilterChange from a dropdown selection
onDropdownChange = (event) => {
    const selectedValue = event.target.value;
    this.handleFilterChange("participantType", selectedValue);
};


  render() {
    const { SearchBar } = Search;

    const { pendingLabs } = this.props;
    const data = this.state.data;
    const { onApproveUnapproveLab, onGetPendingLabs } = this.props;

    const pageOptions = {
      sizePerPage: 50,
      totalSize: pendingLabs.length, // replace later with size(pendingLabs),
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
            <title>Pending Labs | NHS NEQAS</title>
          </MetaTags>

           <ApproveUnapproveModal
            show={this.state.unapprovedModal}
            onYesClick={this.callOnApproveUnapproveLab}
            onCloseClick={() => this.setState({ unapprovedModal: false })}
          />

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Labs" breadcrumbItem="Pending Participant " />
            <Row className="justify-content-center align-item-center">
              <Col lg="10">
                <Card>
                  <CardBody>

                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.pendingLabListColumns}
                      data={pendingLabs}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.pendingLabListColumns}
                          data={pendingLabs}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                                              <Col sm="8">
                                                                <div className="ms-2 mb-4">
                                                                  <div className="container">
                                                                    <div className="row align-items-center">
                                                                      {/* Filter 1 */}
                                                                      <div className="col">
                                                                        <select
                                                                          className="form-select"
                                                                          onChange={this.onDropdownChange}
                                                                          value={this.state.selectedParticipantType}
                                                                          style={{ width: "200px" }} // Ensures it takes up full width of the column
                                                                        >
                                                                          <option value="All Participant">All Participant</option>
                                                                          <option value="Approved Participant">Approved Participant</option>
                                                                          <option value="Unapproved Participant">Unapproved Participant</option>
                                                                          <option value="Pending Participant">Pending Participant</option>
                                                                          <option value="Suspended Participant">Suspended Participant</option>
                                                                        </select>
                                                                      </div>
                                                                    </div>
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
                                      classes={"table align-middle table-condensed table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-header-sky-blue"}
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
                                                      value={
                                                        this.state.email
                                                      }
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
                                                {/* <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Contact No.
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.landline
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
                                                            .lab_phone
                                                        );
                                                        this.setState({
                                                          btnText: "Copied",
                                                        });
                                                      }}
                                                    >
                                                      {this.state.btnText}
                                                    </button>
                                                  </div>
                                                </div> */}
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
                                                      value={
                                                        this.state.city
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
                                                        this.state.district
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                {/* <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Mobile No.
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.marketer_phone
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
                                                            .marketer_phone
                                                        );
                                                        this.setState({
                                                          btnText: "Copied",
                                                        });
                                                      }}
                                                    >
                                                      {this.state.btnText}
                                                    </button>
                                                  </div>
                                                </div> */}
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
                                                      value={
                                                        this.state.email
                                                        
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
                                                        this.state.landline_registered_by
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
                                    {/* <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <div className="modal-header">
                                        <button
                                          type="button"
                                          className="btn-close"
                                          onClick={() =>
                                            this.setState({
                                              modal: false,
                                            })
                                          }
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                        ></button>
                                      </div>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            refereree_percentage:
                                              (data &&
                                                data.refereree_percentage) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            refereree_percentage:
                                              Yup.number().required(
                                                "Please enter referee fee percentage"
                                              ),
                                          })}
                                          onSubmit={values => {
                                            const data = {
                                              id: this.state.user_id,
                                              labId: this.state.id,
                                              refereree_percentage:
                                                values.refereree_percentage,
                                            };

                                            // approve lab
                                            onApproveUnapproveLab(data);

                                            // Calling to update list record
                                            setTimeout(() => {
                                              onGetPendingLabs();
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
                                                      Referee Fee Percentage
                                                    </Label>
                                                    <Field
                                                      name="refereree_percentage"
                                                      type="number"
                                                      step="0.1"
                                                      min="0"
                                                      max="100"
                                                      className={
                                                        "form-control" +
                                                        (errors.refereree_percentage &&
                                                        touched.refereree_percentage
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="refereree_percentage"
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
                                    </Modal> */}
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

PendingCSRLabs.propTypes = {
  match: PropTypes.object,
  pendingLabs: PropTypes.array,
  className: PropTypes.any,
  CycleList: PropTypes.array,
  ongetcyclelist: PropTypes.func,
  onGetPendingLabs: PropTypes.func,
  onApproveUnapproveLab: PropTypes.func,
  history: PropTypes.any,
};
const mapStateToProps = ({ registrationAdmin, CycleList, PaymentScheme }) => {
  const cycleList = registrationAdmin.CycleList || [];
  const paymentSchemeList = PaymentScheme?.PaymentSchemeList || [];

  console.log("CycleList in mapStateToProps (registrationAdmin):", registrationAdmin.CycleList);
  console.log("CycleList in mapStateToProps (CycleList):", CycleList.CycleList);

  return {
    pendingLabs: registrationAdmin.pendingLabs || [], // Ensure it's an array
    CycleList: CycleList?.CycleList || [], // Correctly map CycleList
    paymentSchemeList, // Optional: Include if needed for payment-related features
  };
};


const mapDispatchToProps = (dispatch, ownProps) => ({
  onApproveUnapproveLab: data => dispatch(approveUnapproveLab(data)),
  onGetPendingLabs: (id) => dispatch(getPendingLabs(id)),
  onGetInstrumentTypeList: (id) => 
    dispatch(getSchemelist(id)),
  onAddNewType: (id, createUnit) =>
    dispatch(addNewSchemeList(id, createUnit)),
  ongetcyclelist: id => dispatch(getcyclelist(id)),
  onUpdateType: (id, methodlist) => dispatch(updateSchemeList({ id, ...methodlist })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PendingCSRLabs));