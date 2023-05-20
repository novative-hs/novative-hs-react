import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

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
  Input,
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

import { getUnhandledComplaints, updateUnhandledComplaints } from "store/complaints/actions";
import * as Yup from "yup";
import "assets/scss/table.scss";

class UnhandledComplaints extends Component {
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
      btnText: "Copy",
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
          filter: textFilter(),
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
          text: "Name",
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
          formatter: (cellContent, unhandledComplaint) => (
            <>
                  {/* {unhandledComplaint.complainee},{" "} */}
                  {unhandledComplaint.labhazir_complainee}{" "}
                  {unhandledComplaint.lab_name}
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
          dataField: "registered_at",
          text: "Pending Since",
          sort: true,
          formatter: (cellContent, complaint) => (
            <>
              <span>
              {new Date().getDate() - new Date(complaint.registered_at).getDate()} days

              </span>
            </>
          ),
          filter: textFilter(),
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
                onClick={e => this.onClickAuditedEvent(e, complaint.id)}
              >
                <i className="mdi mdi-check-circle font-size-14"></i>
              </Link>{" "}
            </>
          ),
        },
      ],
    };
    // this.toggle = this.toggle.bind(this);
    this.onClickAuditedEvent = this.onClickAuditedEvent.bind(this);
    this.toggleMessageModal.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
  }

  toggleHandleModal = () => {
    this.setState(prevState => ({
      auditModal: !prevState.auditModal,
    }));
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
  onClickAuditedEvent = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.setState({ auditModal: true });
  };

  // handleAPICall = () => {
  //   const { onUpdateUnhandledComplaints, onGetUnhandledComplaints } = this.props;

  //   onUpdateUnhandledComplaints(this.state.id);
  //   setTimeout(() => {
  //     onGetUnhandledComplaints(this.state.user_id);
  //   }, 1000);

  //   this.setState({ auditModal: false });
  // };

  componentDidMount() {
    const { onGetUnhandledComplaints } = this.props;
    onGetUnhandledComplaints(this.state.user_id);
    this.setState({ unhandledComplaints: this.props.unhandledComplaints });
  }

  // toggle() {
  //   this.setState(prevState => ({
  //     modal: !prevState.modal,
  //   }));
  // }

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
        {/* <DeleteModal
          show={this.state.auditModal}
          onDeleteClick={this.handleAPICall}
          onCloseClick={() => this.setState({ auditModal: false })}
        /> */}

        <div className="page-content">
          <MetaTags>
            <title>Unhandled Complaints| Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="CSR" breadcrumbItem="Unhandled Complaints" />
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
                              {/* <Row className="mb-2">
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
                              </Row> */}
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
                                    <Modal
                                      isOpen={this.state.auditModal}
                                      className={this.props.className}
                                    >
                                      <div className="modal-header">
                                        <button
                                          type="button"
                                          className="btn-close"
                                          onClick={() =>
                                            this.setState({
                                              auditModal: false,
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
                                            
                                            comment:
                                              (this.state &&
                                                this.state.comment) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                           
                                            comment: Yup.string().required(
                                              "Please enter your comments/reason of result"
                                            ),
                                          })}
                                          onSubmit={values => {
                                            const {
                                              onUpdateUnhandledComplaints,
                                              onGetUnhandledComplaints,
                                            } = this.props;

                                            const data = {
                                              id: this.state.id,
                                              comment: values.comment,
                                            };

                                            console.log(data);

                                            onUpdateUnhandledComplaints(data);
                                            setTimeout(() => {
                                              onGetUnhandledComplaints(
                                                this.state.user_id
                                              );
                                            }, 1000);

                                            this.setState({
                                              auditModal: false,
                                            });
                                            setTimeout(() => {
                                              onGetUnhandledComplaints(
                                                this.state.user_id
                                              );
                                            }, 100);
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  
                                                    <div className="mb-3">
                                                      <Label className="form-label">
                                                        Comment
                                                      </Label>
                                                      <Field
                                                        name="comment"
                                                        as="textarea"
                                                        rows="4"
                                                        cols="50"
                                                        className={
                                                          "form-control" +
                                                          (errors.comment &&
                                                          touched.comment
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                        value={
                                                          this.state.comment
                                                        }
                                                        onChange={e =>
                                                          this.setState({
                                                            comment:
                                                              e.target.value,
                                                          })
                                                        }
                                                      />
                                                      <ErrorMessage
                                                        name="comment"
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

UnhandledComplaints.propTypes = {
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
  onUpdateUnhandledComplaints: data => dispatch(updateUnhandledComplaints(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UnhandledComplaints));