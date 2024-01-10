import React, { Component, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import moment from 'moment';
import {
  Card,
  CardBody,
  Col,
  Container,
  ModalHeader,
  Row,
  Label,
  Modal,
  ModalBody,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";

//Import Breadcrumb
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getDonorsA,
} from "store/labs-list/actions";


class LabsLists extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      labsList: [],
      id: "",
      LabsLists: "",
      btnText: "Copy",
      labsList: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      labsListListColumns: [

        {
          dataField: "order_id",
          text: "Order ID",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              <strong>{labsList.id}</strong>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "patient_name",
          text: "Patient Name",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
            <span>
              <Link
                    to="#"
                    onClick={e => this.openNamePatientModal(e, labsList)}
                  >
                   {labsList.patient_name}
                  </Link>
            </span>
              {/* <strong>{labsList.patient_name}</strong> */}
            </>
          ),filter: textFilter(), 
        },
        {
          dataField: "lab_name",
          text: "Lab Name",
          sort: true,
          formatter: (cellContent, labsList) => (
            <><span>
              <Link
                    to="#"
                    onClick={e => this.openPatientModal(e, labsList)}
                  >
                   {labsList.lab_name}
                  </Link>
            </span>
            
              {/* <strong>{labsList.lab_name}</strong> */}
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "is_home_sampling_availed",
          text: "Home sampling",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              {labsList.is_home_sampling_availed == true || labsList.is_state_sampling_availed == true ? (
                <span>Yes</span>
              ) : (
                <span>No</span>
              )}
            </>
          ),
          filter: selectFilter({
            options: {
              '': 'All',
              'true': 'Yes',
              'false': 'No',
            },
            defaultValue: 'All',
          }),
        },
        {
          dataField: "payment_status",
          text: "Payment Status",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              {labsList.payment_status == "Not Paid" ? (
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
                  {labsList.payment_method},{" "}
                  {labsList.payment_status}
                </span>
              ) : (
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                  {labsList.payment_method},{" "}
                  {labsList.payment_status}
                </span>
              )}
            </>
          ),
          filter: selectFilter({
            options: {
              '': 'All',
              'Paid': 'Paid',
              'Not Paid': 'Not Paid',
              'Allocate': 'Allocate',
            },
            defaultValue: 'All',
          }),
        },
        {
          dataField: 'status',
          text: 'Appointment Status',
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              {labsList.status == "Pending" && (
                <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                  {labsList.status}
                </span>

              )}
              {labsList.status == "Confirmed" && (
                <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-info">
                  {labsList.status}
                </span>
              )}

              {labsList.status == "Sample Collected" && (
                <span className="badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning">
                  {labsList.status}
                </span>
              )}

              {labsList.status == "Rescheduled" && (
                <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                  {labsList.status}
                </span>
              )}


              {labsList.status == "Result Uploaded" && (
                <span className="badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                  {labsList.status}
                </span>
              )}

            </>
          ),
          filter: selectFilter({
            options: {
              '': 'All',
              'Pending': 'Pending',
              'Confirmed': 'Confirmed',
              'Sample Collected': 'Sample Collected',
              'Rescheduled': 'Rescheduled',
              'Result Uploaded': 'Result Uploaded',
            },
            defaultValue: 'All',
          }),
        },
        // {
        //   dataField: "appointment_requested_at",
        //   text: "Sampling time by Patient",
        //   sort: true,
        //   formatter: (cellContent, labsList) => (
        //     <>
        //       <span>
        //         {/* {new Date(
        //           labsList.appointment_requested_at
        //         ).toLocaleString("en-US")} */}
        //         {moment(labsList.appointment_requested_at).format("DD MMM YYYY, h:mm A")}
        //       </span>
        //     </>
        //   ), filter: textFilter(),
        // },
        // {
        //   dataField: "estimated_sample_collection_at",
        //   text: "Sampling time by Lab",
        //   sort: true,
        //   formatter: (cellContent, labsList) => (
        //     <>
        //       {labsList.status == "Pending" ? (
        //         <span>Not available yet</span>
        //       ) : (
        //         <span>
        //           {/* {new Date(
        //             labsList.estimated_sample_collection_at
        //           ).toLocaleString("en-US")} */}
        //            {labsList.estimated_sample_collection_at
        //           ? moment(labsList.estimated_sample_collection_at).format("DD MMM YYYY, h:mm A")
        //           : "--"}
        //         </span>
        //       )}
        //     </>
        //   ), filter: textFilter(),
        // },
        {
          dataField: "dues",
          text: "Invoice Value",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>             
             <div className="text-end">
            {labsList.dues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div></>
        ),filter: textFilter(),
        },
        {
          dataField: "donor_name",
          text: "Donor Name",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              <strong>{labsList.donor_name}</strong>
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
      ],
    };
  }

  // componentDidMount() {
  //   const { labsList, onGetDonorsA } = this.props;
  //   console.log(onGetDonorsA());
  //   this.setState({ labsList });
  // }
  componentDidMount() {
    const { labsList, onGetDonorsA } = this.props;
    onGetDonorsA(this.state.user_id);
    console.log(onGetDonorsA());
    this.setState({ labsList });
  }
  // componentDidMount() {
  //   const { b2bAllClients, onGetB2bAllClientsList } = this.props;
  //   onGetB2bAllClientsList(this.state.user_id);
  //   this.setState({ b2bAllClients });
  // }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  openNamePatientModal = (e, arg) => {
    this.setState({
      NamePatientModal: true,
      patient_phone: arg.patient_phone,
      patient_age: arg.patient_age,
      patient_gender: arg.patient_gender,
    });
  };
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      lab_address: arg.lab_address,
      lab_city: arg.lab_city,
      lab_phone: arg.lab_phone,
      lab_email: arg.lab_email,
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
  toggleNamePatientModal = () => {
    this.setState(prevState => ({
      NamePatientModal: !prevState.NamePatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
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

  render() {
    const { SearchBar } = Search;

    const { labsList } = this.props;
    const data = this.state.data;
    const { onGetDonorsA } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: labsList.length, // replace later with size(labsList),
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
            <title>Appointments for Donation | Lab Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="List" breadcrumbItem="Appointments for Donation" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.labsListListColumns}
                      data={labsList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.labsListListColumns}
                          data={labsList}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    {/* <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div> */}
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
                                      filter={filterFactory()} // Enable filtering for the entire table
                                    />
                                      <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.togglePatientModal}
                                        tag="h4"
                                      >
                                        <span>Lab Details: </span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">
                                                <div className="mb-3 row">
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
                                                      email
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_email
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Contact No.
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_phone
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
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                  </Modal>
                                  <Modal
                                      isOpen={this.state.NamePatientModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleNamePatientModal}
                                        tag="h4"
                                      >
                                        <span>Patient Details: </span>
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
                                                      Patient Gender
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.patient_gender
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Patient Age
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
                                                      Contact No.
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

LabsLists.propTypes = {
  match: PropTypes.object,
  labsList: PropTypes.array,
  className: PropTypes.any,
  onGetDonorsA: PropTypes.func,
};
const mapStateToProps = ({ labsList}) => ({
  labsList: labsList.labsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetDonorsA: id => dispatch(getDonorsA(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabsLists));
