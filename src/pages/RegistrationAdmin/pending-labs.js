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
  getPendingLabs,
  approveUnapproveLab,
} from "store/registration-admin/actions";

import ApproveUnapproveModal from "components/Common/ApproveUnapproveModal";
import "assets/scss/table.scss";

class PendingLabs extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      pendingLabs: [],
      id: "",
      btnText: "Copy",
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
          formatter: (cellContent, pendingLab) => (
            <>
              <span style={{
                 width: '200px', // Set your desired width here
                fontSize: '14px',
              
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'center', // Align text to the left
                display: 'block',
              }}>
              {pendingLab.district}

              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "city",
          text: "Participant City",
          sort: true,
          formatter: (cellContent, pendingLab) => (
            <>
              <span style={{
                 width: '200px', // Set your desired width here
                fontSize: '14px',
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'center', // Align text to the left
                display: 'block',
              }}>
              {pendingLab.city}

              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "name",
          text: "Participant name",
          sort: true,
          formatter: (cellContent, pendingLab) => (
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
                    // onClick={e => this.openLabModal(e, pendingLab)}
                    onMouseEnter={e => this.openLabModal(e, pendingLab)}
                    onPointerLeave={this.handleMouseExit()}
                  >
                   {pendingLab.name}
                  </Link>
              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "lab_staff_name",
          text: "Name of Notification Person",
          sort: true,
          formatter: (cellContent, pendingLab) => (
            <>
              <span>
                {pendingLab.lab_staff_name}
              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "email_participant",
          text: "Email of Notification Person",
          sort: true,
          formatter: (cellContent, pendingLab) => (
            <>
              <span>
                {pendingLab.email_participant}
              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "landline_registered_by",
          text: "Contact No of Notification Person",
          sort: true,
          formatter: (cellContent, pendingLab) => (
            <>
              <span>
                {pendingLab.landline_registered_by}
              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "membership_status",
          text: "Membership Status",
          sort: true,
          formatter: (cellContent, pendingLab) => (
            <>
              <span>
                {pendingLab.membership_status}
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
          formatter: (cellContent, pendingLab) => (
            <>
            <Tooltip title="Update">
              <Link
                className="btn btn-success btn-rounded"
                to="#"
                onClick={e => this.handleApprovedEvent(pendingLab.id)}
                
              >
                <i className="mdi mdi-check-circle font-size-14"></i>
              </Link>
              </Tooltip>
              {" "}
              <Tooltip title="Delete">
              <Link
                className="btn btn-danger btn-rounded"
                to="#"
                onClick={() => this.handleUnapprovedEvent(pendingLab.id)}
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
    const { pendingLabs, onGetPendingLabs } = this.props;
    onGetPendingLabs(this.state.user_id);
    this.setState({ pendingLabs });
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

    const { pendingLabs } = this.props;
    const data = this.state.data;
    const { onApproveUnapproveLab, onGetPendingLabs } = this.props;

    const pageOptions = {
      sizePerPage: 10,
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
            <Breadcrumbs title="Labs" breadcrumbItem="Pending" />
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

PendingLabs.propTypes = {
  match: PropTypes.object,
  pendingLabs: PropTypes.array,
  className: PropTypes.any,
  onGetPendingLabs: PropTypes.func,
  onApproveUnapproveLab: PropTypes.func,
  history: PropTypes.any,
};
const mapStateToProps = ({ registrationAdmin }) => ({
  pendingLabs: registrationAdmin.pendingLabs,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onApproveUnapproveLab: data => dispatch(approveUnapproveLab(data)),
  onGetPendingLabs: (id) => dispatch(getPendingLabs(id)),
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
