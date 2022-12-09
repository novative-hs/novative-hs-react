import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
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
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getDonorReferredAppointmentsList } from "store/donor-referred-appointments/actions";
import { uniqueId } from "lodash";
import { b2bclientAuthProtectedRoutes } from "routes";

class ReferredPatientsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      donorReferredAppointments: [],
      id: "",
      donorReferredAppointment: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      donorReferredAppointmentListColumns: [
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
          dataField: "donated_by",
          text: "Donor ID",
          sort: true,
        },
        {
          dataField: "patient_name",
          text: "Patient Name",
          sort: true,
        },
        {
          dataField: "lab_name",
          text: "Lab Name",
          sort: true,
        },
        {
          dataField: "dues",
          text: "Payment",
          sort: true,
        },

        {
          dataField: "booked_at",
          text: "Booked at",
          sort: true,
          formatter: (cellContent, donorReferredAppointment) => (
            <>
              <span>
                {new Date(donorReferredAppointment.booked_at).toLocaleString(
                  "en-US"
                )}
              </span>
            </>
          ),
        },
        {
          dataField: "payment_method",
          text: "Payment method",
          sort: true,
        },
        {
          dataField: "payment_status",
          text: "Payment status",
          sort: true,
          formatter: (cellContent, donorReferredAppointment) => (
            <>
              {donorReferredAppointment.payment_status == "Not Paid" ? (
                <span className="pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger" style={{ width: "100px" }}>
                  {donorReferredAppointment.payment_status}
                </span>
              ) : (
                <span className="pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-info" style={{ width: "100px" }}>
                  {donorReferredAppointment.payment_status}
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
          formatter: (cellContent, donorReferredAppointment) => (
            <>
              {donorReferredAppointment.status == "Pending" ? (
                <span className="pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger" style={{ width: "150px" }}>
                  {donorReferredAppointment.status}
                </span>
              ) : null}

              {donorReferredAppointment.status == "Confirmed" ? (
                <span className="pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-info" style={{ width: "150px" }}>
                  {donorReferredAppointment.status}
                </span>
              ) : null}

              {donorReferredAppointment.status == "Sample Collected" ? (
                <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-warning" style={{ width: "150px" }}>
                  {donorReferredAppointment.status}
                </span>
              ) : null}

              {donorReferredAppointment.status == "Result Uploaded" ? (
                <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-success">
                  {donorReferredAppointment.status}
                </span>
              ) : null}
            </>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);

  }

  componentDidMount() {
    const { donorReferredAppointments, onGetB2bReferredPatientsList } =
      this.props;
    if (donorReferredAppointments && !donorReferredAppointments.length) {
      console.log(this.state.user_id);
      setTimeout(() => {
        onGetB2bReferredPatientsList(this.state.user_id);
      }, 3000);
    }

    this.setState({ donorReferredAppointments });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
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

  render() {
    const { SearchBar } = Search;

    const { donorReferredAppointments } = this.props;
    const { onGetB2bReferredPatientsList } =
      this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: donorReferredAppointments.length, // replace later with size(donorReferredAppointments),
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
            <title>Donor Appointments List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="B2B Referreds" breadcrumbItem=" List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.donorReferredAppointmentListColumns}
                      data={donorReferredAppointments}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.donorReferredAppointmentListColumns}
                          data={donorReferredAppointments}
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
                                      
                                      {/* <p>{"https://labhazir.com/nearby-labs/?uuid=" + "donorReferredAppointments.uuid"}</p> */}

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
                                      classes={
                                        "table align-middle table-nowrap table-hover"
                                      }
                                      bordered={false}
                                      striped={false}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                    />
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
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

ReferredPatientsList.propTypes = {
  match: PropTypes.object,
  donorReferredAppointments: PropTypes.array,
  className: PropTypes.any,
  onGetB2bReferredPatientsList: PropTypes.func,
};
const mapStateToProps = ({ donorReferredAppointments }) => ({
  donorReferredAppointments: donorReferredAppointments.donorReferredAppointmentsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetB2bReferredPatientsList: id =>
    dispatch(getDonorReferredAppointmentsList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReferredPatientsList));
