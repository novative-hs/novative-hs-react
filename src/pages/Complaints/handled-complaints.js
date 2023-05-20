import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import {
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  Form,
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

import { getHandledComplaints } from "store/complaints/actions";

import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";

class handledComplaintsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      handledComplaints: [],
      handledComplaint: "",
      modal: false,
      btnText: "Copy",
      messageModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      handledComplaintListColumns: [
        {
          text: "id",
          dataField: "complaint_id",
          sort: true,
          hidden: true,
          formatter: (cellContent, handledComplaint) => (
            <>{handledComplaint.id}</>
          ),
          filter: textFilter(),
        },
        {
          dataField: "complaint_id",
          text: "Complaint ID",
          sort: true,
          formatter: (cellContent, handledComplaint) => (
            <>
              <strong>{handledComplaint.complaint_id}</strong>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "complainant",
          text: "Complainant",
          sort: true,
          filter: textFilter(),
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
          filter: textFilter(),
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
          dataField: "complainee",
          text: "Complainee",
          sort: true,
          formatter: (cellContent, handledComplaint) => (
            <>
                  {/* {resolvedComplaint.complainee},{" "} */}
                  {handledComplaint.labhazir_complainee}{" "}
                  {handledComplaint.lab_name
                  }
            </>
          ),
          filter: textFilter(),
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
          filter: textFilter(),
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
          filter: textFilter(),
        },
        {
          dataField: "handled_at",
          text: "Handled at",
          sort: true,
          formatter: (cellContent, complaint) => (
            <>
              <span>
                {new Date(complaint.handled_at).toLocaleString("en-US")}
              </span>
            </>
          ),
          filter: textFilter(),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.toggleMessageModal.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);

  }

  componentDidMount() {
    const { handledComplaints, onGetHandledComplaints } = this.props;
    onGetHandledComplaints(this.state.user_id);
    this.setState({ handledComplaints });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
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

  toggleMessageModal = () => {
    this.setState(prevState => ({
      messageModal: !prevState.messageModal,
    }));
  };

  openMessageModal = (e, arg) => {
    this.setState({ messageModal: true, 
      message: arg.message,
      subject: arg.subject,
     });
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { handledComplaints } = this.props;
    if (
      !isEmpty(handledComplaints) &&
      size(prevProps.handledComplaints) !== size(handledComplaints)
    ) {
      this.setState({ handledComplaints: {}, isEdit: false });
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

    const { handledComplaints } = this.props;

    const { onGetHandledComplaints } = this.props;
    const handledComplaint = this.state.handledComplaint;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: handledComplaints.length, // replace later with size(handledComplaints),
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
            <title>Handled Complaints List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Handled Complaints" breadcrumbItem="List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.handledComplaintListColumns}
                      data={handledComplaints}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.handledComplaintListColumns}
                          data={handledComplaints}
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
                                      filter={ filterFactory() }
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
                                                {this.state.subject}
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
                              {/* <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row> */}
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

handledComplaintsList.propTypes = {
  match: PropTypes.object,
  handledComplaints: PropTypes.array,
  className: PropTypes.any,
  onGetHandledComplaints: PropTypes.func,
};

const mapStateToProps = ({ complaints }) => ({
  handledComplaints: complaints.handledComplaints,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetHandledComplaints: id => dispatch(getHandledComplaints(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(handledComplaintsList));
