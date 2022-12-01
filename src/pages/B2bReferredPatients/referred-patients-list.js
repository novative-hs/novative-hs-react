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
import { getB2bReferredPatientsList } from "store/b2b-referred-patients/actions";
import "assets/scss/table.scss";

class ReferredPatientsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      b2bReferredPatients: [],
      id: "",
      b2bReferredPatient: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      b2bReferredPatientListColumns: [
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
          dataField: "patient_name",
          text: "Name",
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
          formatter: (cellContent, b2bReferredPatient) => (
            <>
              <span>
                {new Date(b2bReferredPatient.booked_at).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        // {
        //   dataField: "payment_status",
        //   text: "Payment Status",
        //   sort: true,
        //   formatter: (cellContent, b2bReferredPatient) => (
        //     <>
        //       {/* {b2bReferredPatient.payment_status == "Not Paid" ? (
        //         <span
        //           className="pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger"
        //           style={{ width: "100px" }}
        //         >
        //           {b2bReferredPatient.payment_status}
        //         </span>
        //       ) : (
        //         <span
        //           className="pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-info"
        //           style={{ width: "100px" }}
        //         >
        //           {b2bReferredPatient.payment_status}
        //         </span>
        //       )} */}
        //       {b2bReferredPatient.payment_status}
        //     </>
        //   ),
        // },
        {
          dataField: "status",
          text: "Status",
          sort: true,
          formatter: (cellContent, b2bReferredPatient) => (
            <>
              {b2bReferredPatient.status == "Pending" ? (
                <span
                  className="pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger"
                  style={{ width: "150px" }}
                >
                  {b2bReferredPatient.status}
                </span>
              ) : null}

              {b2bReferredPatient.status == "Confirmed" ? (
                <span
                  className="pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-info"
                  style={{ width: "150px" }}
                >
                  {b2bReferredPatient.status}
                </span>
              ) : null}

              {b2bReferredPatient.status == "Sample Collected" ? (
                <span
                  className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-warning"
                  style={{ width: "150px" }}
                >
                  {b2bReferredPatient.status}
                </span>
              ) : null}

              {b2bReferredPatient.status == "Result Uploaded" ? (
                <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-success">
                  {b2bReferredPatient.status}
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
    const { b2bReferredPatients, onGetB2bReferredPatientsList } = this.props;
    onGetB2bReferredPatientsList(this.state.user_id);
    this.setState({ b2bReferredPatients });
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

    const { b2bReferredPatients } = this.props;
    const { onGetB2bReferredPatientsList } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: b2bReferredPatients.length, // replace later with size(b2bReferredPatients),
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
            <title>B2B Referred Patients List | Lab Hazir</title>
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
                      columns={this.state.b2bReferredPatientListColumns}
                      data={b2bReferredPatients}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.b2bReferredPatientListColumns}
                          data={b2bReferredPatients}
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

                                      {/* <p>{"https://labhazir.com/nearby-labs/?uuid=" + "b2bReferredPatients.uuid"}</p> */}
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
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    ></Modal>
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
  b2bReferredPatients: PropTypes.array,
  className: PropTypes.any,
  onGetB2bReferredPatientsList: PropTypes.func,
};
const mapStateToProps = ({ b2bReferredPatients }) => ({
  b2bReferredPatients: b2bReferredPatients.b2bReferredPatientsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetB2bReferredPatientsList: id => dispatch(getB2bReferredPatientsList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReferredPatientsList));