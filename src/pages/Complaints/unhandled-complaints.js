import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Row,
  Modal,
  Form,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  Input,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, ErrorMessage } from "formik";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import {
  getUnhandledComplaints,
  updateUnhandledComplaints,
} from "store/complaints/actions";

import { isEmpty, size } from "lodash";

import ConfirmModal from "components/Common/ConfirmModal";

import "assets/scss/table.scss";

class UnhandledComplaintsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      unhandledComplaints: [],
      unhandledComplaint: "",
      btnText: "Copy",
      modal: false,
      messageModal: false,
      handleModal: false,
      id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      unhandledComplaintListColumns: [
        {
          text: "id",
          dataField: "complaint_id",
          sort: true,
          hidden: true,
          formatter: (cellContent, unhandledComplaint) => (
            <>{unhandledComplaint.id}</>
          ),
        },
        {
          dataField: "complaint_id",
          text: "Complaint ID",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <strong>{testAppointment.complaint_id}</strong>
            </>
          ),
        },
        {
          dataField: "name",
          text: "Complainant Name",
          sort: true,
          formatter: (cellContent, unhandledComplaint) => (
            <>
              <span>
                  <Link
                    to="#"
                    onClick={e => this.openPatientModal(e, unhandledComplaint)}
                  >
                   {unhandledComplaint.name}
                  </Link>
              </span>
            </>
          ),
        },
        // {
        //   dataField: "email",
        //   text: "Email",
        //   sort: true,
        // },
        // {
        //   dataField: "phone",
        //   text: "Phone",
        //   sort: true,
        // },
        {
          dataField: "subject",
          text: "Subject",
          sort: true,
        },
        {
          dataField: "complainant",
          text: "Complainant",
          sort: true,
        },
        {
          dataField: "complainee",
          text: "Complainee",
          sort: true,
          formatter: (cellContent, unhandledComplaint) => (
            <>
                  {/* {unhandledComplaint.complainee},{" "} */}
                  {unhandledComplaint.labhazir_complainee}{" "}
                  {unhandledComplaint.lab_name}
            </>
          ),
        },
        {
          dataField: "message",
          text: "Message",
          sort: true,
          formatter: (cellContent, complaint) => (
            <>
              <Link to="#" onClick={e => this.openMessageModal(e, complaint)}>
                {complaint.message.slice(0, 10) + "..."}
              </Link>{" "}
            </>
          ),
        },
        {
          dataField: "registered_at",
          text: "Registered at",
          sort: true,
          formatter: (cellContent, complaint) => (
            <>
              <span>
                {new Date(complaint.registered_at).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        {
          dataField: "data",
          text: "id",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, complaint) => (
            <>
              <Link
                className="btn btn-success btn-rounded"
                to="#"
                onClick={e => this.onClickHandledEvent(e, complaint.id)}
              >
                <i className="mdi mdi-check-circle font-size-14"></i>
              </Link>{" "}
            </>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.onClickHandledEvent = this.onClickHandledEvent.bind(this);
  }

  componentDidMount() {
    const { unhandledComplaints, onGetUnhandledComplaints } = this.props;
    onGetUnhandledComplaints(this.state.user_id);
    this.setState({ unhandledComplaints });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  toggleMessageModal = () => {
    this.setState(prevState => ({
      messageModal: !prevState.messageModal,
    }));
  };
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      email: arg.email,
      phone:arg.phone,
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
  openMessageModal = (e, arg) => {
    this.setState({ messageModal: true, message: arg.message });
  };

  toggleHandleModal = () => {
    this.setState(prevState => ({
      handleModal: !prevState.handleModal,
    }));
  };

  onClickHandledEvent = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.setState({ handleModal: true });
  };

  handleAPICall = () => {
    const { onUpdateUnhandledComplaints, onGetUnhandledComplaints } =
      this.props;

    onUpdateUnhandledComplaints(this.state.id);
    setTimeout(() => {
      onGetUnhandledComplaints(this.state.user_id);
    }, 1000);

    this.setState({ handleModal: false });
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { unhandledComplaints } = this.props;
    if (
      !isEmpty(unhandledComplaints) &&
      size(prevProps.unhandledComplaints) !== size(unhandledComplaints)
    ) {
      this.setState({ unhandledComplaints: {}, isEdit: false });
    }
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

    const { unhandledComplaints } = this.props;

    const { onGetUnhandledComplaints } = this.props;
    const unhandledComplaint = this.state.unhandledComplaint;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: unhandledComplaints.length, // replace later with size(unhandledComplaints),
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
        <ConfirmModal
          show={this.state.handleModal}
          onConfirmClick={this.handleAPICall}
          onCloseClick={() => this.setState({ handleModal: false })}
        />

        <div className="page-content">
          <MetaTags>
            <title>Unhandled Complaints List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="UnhandledComplaints" breadcrumbItem="List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.unhandledComplaintListColumns}
                      data={unhandledComplaints}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.unhandledComplaintListColumns}
                          data={unhandledComplaints}
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
                                                {/* <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Age
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
                                                </div> */}

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
                                                        this.state
                                                          .patient_address
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div> */}

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      E-mail
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
                                                        this.state.phone
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
                                                            .phone
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
                                      isOpen={this.state.messageModal}
                                      role="dialog"
                                      autoFocus={true}
                                      data-toggle="modal"
                                      centered
                                      toggle={this.toggleMessageModal}
                                    >
                                      <div className="modal-content">
                                        <div className="modal-header border-bottom-0">
                                          <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() =>
                                              this.setState({
                                                messageModal: false,
                                              })
                                            }
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                          ></button>
                                        </div>
                                        <div className="modal-body">
                                          <div className="text-center mb-4">
                                            <div className="avatar-md mx-auto mb-4">
                                              <div className="avatar-title bg-light rounded-circle text-primary h3">
                                                <i className="mdi mdi-email-open"></i>
                                              </div>
                                            </div>

                                            <div className="row justify-content-center">
                                              <div className="col-xl-10">
                                                <h4 className="text-primary">
                                                  Complaint Message
                                                </h4>
                                                <p className="text-muted font-size-14 mb-4">
                                                  {this.state.message}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
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

UnhandledComplaintsList.propTypes = {
  match: PropTypes.object,
  unhandledComplaints: PropTypes.array,
  className: PropTypes.any,
  onGetUnhandledComplaints: PropTypes.func,
  onUpdateUnhandledComplaints: PropTypes.func,
};

const mapStateToProps = ({ complaints }) => ({
  unhandledComplaints: complaints.unhandledComplaints,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetUnhandledComplaints: id => dispatch(getUnhandledComplaints(id)),
  onUpdateUnhandledComplaints: id => dispatch(updateUnhandledComplaints(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UnhandledComplaintsList));
