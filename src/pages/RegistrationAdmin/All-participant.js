import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { Tooltip } from "@material-ui/core";
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
  getAllLabs,
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
      id: "",
      btnText: "Copy",
      organization_name: '',
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
          headerStyle: { textAlign: 'center' }, 
          style: { textAlign: 'center' },        
          filter: textFilter(),
          formatter: (cellContent, AllLabs) => (
            <>
              <span  style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
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
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    this.toggleMarketerModal = this.toggleMarketerModal.bind(this);

    
  }

  componentDidMount() {
    const { organization_name } = this.props.match.params;
    this.setState({ organization_name }, () => {
      // Call this function inside the setState callback to ensure organization_name is updated first
      this.setInitialDropdownValue();
    });

    const { AllLabs, onGetPendingLabs } = this.props;
    onGetPendingLabs(this.state.user_id);
    //this.setState({ AllLabs });
    //this.setInitialDropdownValue();
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
  handleSelectChange = (event) => {
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

    const pageOptions = {
      sizePerPage: 10,
      totalSize: AllLabs.length, // replace later with size(AllLabs),
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
                                        <option value="Pending Participant">Pending Participant</option>
                                        <option value="Approved Participant">Approved Participant</option>
                                        <option value="Unapproved Participant">Unapproved Participant</option>
                                        <option value="All Participant">All Participant</option>
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
};
const mapStateToProps = ({ registrationAdmin }) => ({
  AllLabs: registrationAdmin.AllLabs,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onApproveUnapproveLab: data => dispatch(approveUnapproveLab(data)),
  onGetPendingLabs: (id) => dispatch(getAllLabs(id)),
  onGetInstrumentTypeList: (id) => 
    dispatch(getSchemelist(id)),
  onAddNewType: (id, createUnit) =>
    dispatch(addNewSchemeList(id, createUnit)),
  onUpdateType: (id, methodlist) => dispatch(updateSchemeList({ id, ...methodlist })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PendingLabs));
