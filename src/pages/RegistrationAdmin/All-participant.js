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
          formatter: (cellContent, AllLabs) => (
            <>
              <span style={{
                 width: '200px', // Set your desired width here
                fontSize: '14px',
              
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'center', // Align text to the left
                display: 'block',
              }}>
              {AllLabs.district}

              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "city",
          text: "Participant City",
          sort: true,
          formatter: (cellContent, AllLabs) => (
            <>
              <span style={{
                 width: '200px', // Set your desired width here
                fontSize: '14px',
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'center', // Align text to the left
                display: 'block',
              }}>
              {AllLabs.city}

              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "name",
          text: "Participant name",
          sort: true,
          formatter: (cellContent, AllLabs) => (
            <>
              <span style={{
                 width: '200px', // Set your desired width here
                fontSize: '14px',
              
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'left', // Align text to the left
                display: 'block',
              }}>
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
          text: "Name of Notification Person",
          sort: true,
          formatter: (cellContent, AllLabs) => (
            <>
              <span>
                {AllLabs.lab_staff_name}
              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "email_participant",
          text: "Email of Notification Person",
          sort: true,
          formatter: (cellContent, AllLabs) => (
            <>
              <span>
                {AllLabs.email_participant}
              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "landline_registered_by",
          text: "Contact No of Notification Person",
          sort: true,
          formatter: (cellContent, AllLabs) => (
            <>
              <span>
                {AllLabs.landline_registered_by}
              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "membership_status",
          text: "Membership Status",
          sort: true,
          formatter: (cellContent, AllLabs) => (
            <>
              <span>
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
          formatter: (cellContent, AllLabs) => (
            <>
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
    const { AllLabs, onGetPendingLabs } = this.props;
    onGetPendingLabs(this.state.user_id);
    this.setState({ AllLabs });
    this.setInitialDropdownValue();
  }
  setInitialDropdownValue = () => {
    const { pathname } = this.props.history.location;
    let selectedValue = '';

    if (pathname.includes('/pending-participant')) {
      selectedValue = 'Pending Participant';
    } else if (pathname.includes('/approved-participant')) {
      selectedValue = 'Approved Participant';
    } else if (pathname.includes('/unapproved-participant')) {
      selectedValue = 'Unapproved Participant';
    } else if (pathname.includes('/all-participant')) {
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

    this.setState({ selectedValue });

    // Perform navigation based on the selected value
    if (selectedValue === 'Pending Participant') {
      this.props.history.push('/pending-participant');
    }
    if (selectedValue === 'Approved Participant') {
      this.props.history.push('/approved-participant');
    }
    if (selectedValue === 'Unapproved Participant') {
      this.props.history.push('/unapproved-participant');
    }
    if (selectedValue === 'All Participant') {
      this.props.history.push('/all-participant');
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
            <title>Pending Labs | Lab Hazir</title>
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
                                      <Label for="main_lab_appointments" className="form-label">
                                      <strong>Select Pending, Approved, Unapproved and All Participant</strong>
                                      </Label>
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
