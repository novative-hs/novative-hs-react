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
  ModalBody,
  ModalHeader,

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
  getUnapprovedLabs,
  approveUnapproveLab,
} from "store/registration-admin/actions";
import "assets/scss/table.scss";

class UnapprovedLabs extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      unapprovedLabs: [],
      organization_name: '',
      id: "",
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
          formatter: (cellContent, unapprovedLabs) => <>{unapprovedLabs.id}</>,
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
                  headerStyle: { textAlign: 'center' }, 
                  style: { textAlign: 'center' },        
                  filter: textFilter(),
                  formatter: (cellContent, AllLabs) => (
                    <>
                      <span  style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        {AllLabs.email_participant}
                      </span>
                    </>
                  ),filter: textFilter(),
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
  }

  componentDidMount() {
    const { organization_name } = this.props.match.params;
    this.setState({ organization_name }, () => {
      // Call this function inside the setState callback to ensure organization_name is updated first
      this.setInitialDropdownValue();
    });

    const { unapprovedLabs, onGetUnapprovedLabs } = this.props;
    onGetUnapprovedLabs(this.state.user_id);
    // this.setState({ unapprovedLabs });
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
      name: arg.name,
      city: arg.city,
      district: arg.district,
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

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleApprovedEvent = (e, arg) => {
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

    const { unapprovedLabs } = this.props;
    const data = this.state.data;
    const { onApproveUnapproveLab, onGetUnapprovedLabs } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: unapprovedLabs.length, // replace later with size(unapprovedLabs),
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
            <title>Unapproved Participant | NEQAS</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Participant" breadcrumbItem="Unapproved" />
            <Row className="justify-content-center align-item-center">
            {/* <div> <span className="text-danger font-size-12">
                  <strong>
                    Note: There will be UnapprovedApproved and Inactive Labs Shown on it.
                  </strong>
                  </span>
                </div> */}
              <Col lg="10">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.approvedLabListColumns}
                      data={unapprovedLabs}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.approvedLabListColumns}
                          data={unapprovedLabs}
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
                                      classes={"table align-middle table-condensed table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-header-sky-blue"}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}

                                    />
                                    {this.state.isHovered && (
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
                                                          this.state.name
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
                                    )}
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
                                    <Modal
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
                                              onGetUnapprovedLabs(this.state.user_id);
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
                                                      max="0.9"
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

UnapprovedLabs.propTypes = {
  match: PropTypes.object,
  unapprovedLabs: PropTypes.array,
  className: PropTypes.any,
  onGetUnapprovedLabs: PropTypes.func,
  onApproveUnapproveLab: PropTypes.func,
  history: PropTypes.any,
};
const mapStateToProps = ({ registrationAdmin }) => ({
  unapprovedLabs: registrationAdmin.unapprovedLabs,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onApproveUnapproveLab: data => dispatch(approveUnapproveLab(data)),
  onGetUnapprovedLabs: (id) => dispatch(getUnapprovedLabs(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UnapprovedLabs));
