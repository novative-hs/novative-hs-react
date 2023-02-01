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
import { getApprovedLabs } from "store/registration-admin/actions";
import "assets/scss/table.scss";

class ApprovedLabs extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      approvedLabs: [],
      id: "",
      btnText: "Copy",
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
          formatter: (cellContent, approvedLab) => <>{approvedLab.id}</>,
        },
        {
          dataField: "name",
          text: "Lab Name",
          sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span>
                  <Link
                    to="#"
                    onClick={e => this.openPatientModal(e, approvedLab)}
                  >
                   {approvedLab.name}
                  </Link>
              </span>
            </>
          ),
        },
        {
          dataField: "address",
          text: "Address",
          sort: true,
        },
        {
          dataField: "city",
          text: "City",
          sort: true,
        },
        // {
        //   dataField: "shared_percentage",
        //   text: "Referee Fee (%)",
        //   sort: true,
        // },
        {
          dataField: "registered_at",
          text: "Registered at",
          sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span>
                {new Date(approvedLab.registered_at).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        {
          dataField: "done_at",
          text: "Approved at",
          sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span>
                {new Date(approvedLab.done_at).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        // {
        //   dataField: "is_blocked",
        //   text: "Blocked",
        //   sort: true,
        //   formatter: (cellContent, donor) => (
        //     <>
        //       {donor.is_blocked == true ? (
        //         <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
        //           Yes
        //         </span>
        //       ) : (
        //         <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
        //           No
        //         </span>
        //       )}
        //     </>
        //   ),
        // },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.handlePatientFeedbackClick =
      this.handlePatientFeedbackClick.bind(this);
  }

  componentDidMount() {
    const { approvedLabs, onGetApprovedLabs } = this.props;
    onGetApprovedLabs(this.state.user_id);
    this.setState({ approvedLabs });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

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

  render() {
    const { SearchBar } = Search;

    const { approvedLabs } = this.props;
    const data = this.state.data;
    const { onGetApprovedLabs } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: approvedLabs.length, // replace later with size(approvedLabs),
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
            <title>Approved Labs | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Labs" breadcrumbItem="Approved" />
            <Row>
              <Col lg="12">
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
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
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
                                      classes={"table align-middle table-condensed table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                    />
                                    <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
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
};
const mapStateToProps = ({ registrationAdmin }) => ({
  approvedLabs: registrationAdmin.approvedLabs,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetApprovedLabs: () => dispatch(getApprovedLabs()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ApprovedLabs));
