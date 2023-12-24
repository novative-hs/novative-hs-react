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
  Button,
  ModalHeader,
  ModalBody,
  Label,
  Input,
} from "reactstrap";
import filterFactory, {textFilter} from "react-bootstrap-table2-filter";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import Tooltip from "@material-ui/core/Tooltip";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getCsrAppointments,
  updateCsrAppointments,
} from "store/csr-admin-appointments/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class csrAppointments extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      csrAppointments: [],
      csrAppointment: "",
      modal: false,
      btnText: "Copy",
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      paymentOutStatusListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, csrAppointment) => <>{csrAppointment.id}</>,
        },
        {
          dataField: "order_id",
          text: "Order ID",
          sort: true,
          formatter: (cellContent, csrAppointment) => (
            <>
              <strong>{csrAppointment.order_id}</strong>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "patient_name",
          text: "Patient Name",
          sort: true,
          formatter: (cellContent, csrAppointment) => (
            <>
              <span>
                <Link
                  to="#"
                  // onClick={e => this.openPatientModal(e, csrAppointment)}
                  onMouseEnter={e => this.openPatientModal(e, csrAppointment)}
                  onPointerLeave={this.handleMouseExit()}
                >
                  {csrAppointment.patient_name}
                </Link>
              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "lab_name",
          text: "Lab Name",
          sort: true,
          formatter: (cellContent, csrAppointment) => (
            <>
              <span>
                <Link to="#" 
                // onClick={e => this.openLabModal(e, csrAppointment)}
                onMouseEnter={e => this.openLabModal(e, csrAppointment)}
                onPointerLeave={this.handleMouseExit()}
                >
                  {csrAppointment.lab_name}
                </Link>
              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "is_home_sampling_availed",
          text: "Home Sampling",
          sort: true,
          formatter: (cellContent, csrAppointment) => (
            <>
              {csrAppointment.is_home_sampling_availed == true || csrAppointment.is_state_sampling_availed == true ? (
                <span>Yes</span>
              ) : (
                <span>No</span>
              )}
            </>
          ),filter: textFilter(),
        },
        // {
        //   dataField: "is_state_sampling_availed",
        //   text: "State Sampling",
        //   sort: true,
        //   formatter: (cellContent, csrAppointment) => (
        //     <>
        //       {csrAppointment.is_home_sampling_availed == true ? (
        //         <span>Yes</span>
        //       ) : (
        //         <span>No</span>
        //       )}
        //     </>
        //   ),filter: textFilter(),
        // },
        {
          dataField: "status",
          text: "Status",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "appointment_requested_at",
          text: "Appointment Requested at",
          sort: true,
          formatter: (cellContent, csrAppointment) => (
            <>
              <span>
                {new Date(csrAppointment.appointment_requested_at).toLocaleString(
                  "en-US"
                )}
              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "estimated_sample_collection_at",
          text: "Schedule time by lab",
          sort: true,
          formatter: (cellContent, csrAppointment) => (
            <>
              <span>
                {new Date(csrAppointment.estimated_sample_collection_at).toLocaleString(
                  "en-US"
                )}
              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, csrAppointment) => (
            <div className="d-flex gap-3">
              
              <Link className="text-success" to="#">
                <Tooltip title="Update">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={e =>
                      this.handlePaymentStatusClick(e, csrAppointment)
                    }
                  ></i>
                </Tooltip>
              </Link>
              <Tooltip title="Add Comment">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/csr-notes-lists/${csrAppointment.id}`}
                ></Link>
              </Tooltip>
            </div>
          ),
        },
      ],
    };
    this.handlePaymentStatusClick = this.handlePaymentStatusClick.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    this.toggleLabModal = this.toggleLabModal.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount() {
    const { csrAppointments, onGetCsrAppointments } = this.props;
    onGetCsrAppointments(this.state.user_id);
    this.setState({ csrAppointments });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      patient_phone: arg.patient_phone,
      patient_city: arg.patient_city,
    });
  };
  handleMouseExit = () => {
    this.setState({
      PatientModal: false,
      isHovered: false,
      LabModal:  false,
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
  openLabModal = (e, arg) => {
    this.setState({
      LabModal: true,

      lab_phone: arg.lab_phone,
      lab_city: arg.lab_city,
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

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { csrAppointments } = this.props;
    if (
      !isEmpty(csrAppointments) &&
      size(prevProps.csrAppointments) !== size(csrAppointments)
    ) {
      this.setState({ csrAppointments: {}, isEdit: false });
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

  /* Insert,Update Delete data */

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  handlePaymentStatusClick = (e, arg) => {
    this.setState({
      csrAppointment: {
        id: arg.id,
        // cleared_at: arg.cleared_at,
        appointment_requested_at: arg.appointment_requested_at,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { csrAppointments } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onUpdateCsrAppointments, onGetCsrAppointments } = this.props;
    const csrAppointment = this.state.csrAppointment;

    const pageOptions = {
      sizePerPage: 100,
      totalSize: csrAppointments.length, // replace later with size(csrAppointments),
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
            <title>Pending Appointment List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="List" breadcrumbItem="Pending Appointment" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.paymentOutStatusListColumns}
                      data={csrAppointments}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.paymentOutStatusListColumns}
                          data={csrAppointments}
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
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      filter={filterFactory()}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
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
                                                      Mobile No.
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
                                                          this.state.lab_phone
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
                                      isOpen={this.state.PatientModal}
                                      onPointerLeave={this.handleMouseExit}
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
                                                      City
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.patient_city
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
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? "Edit Pending Appointment"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            status:
                                              (this.state.csrAppointment &&
                                                this.state.csrAppointment
                                                  .status) ||
                                              "",
                                            appointment_option:
                                              (this.state &&
                                                this.state
                                                  .appointment_option) ||
                                              "",
                                            comments:
                                              (this.state &&
                                                this.state.comments) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                          })}
                                          onSubmit={values => {
                                            const updateCsrAppointments = {
                                              id: csrAppointment.id,
                                              status:
                                                values.status,
                                              comments:
                                                values.comments,
                                              staff: this.state.user_id,
                                            };

                                            // update PaymentStatus
                                            onUpdateCsrAppointments(
                                              updateCsrAppointments
                                            );
                                            setTimeout(() => {
                                              onGetCsrAppointments(
                                                this.state.user_id
                                              );
                                            }, 1000);
                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <Field
                                                    type="hidden"
                                                    className="form-control"
                                                    name="hiddenEditFlag"
                                                    value={isEdit}
                                                  />
                                                  <div className="mb-3">
                                                    <Label
                                                      for="status"
                                                      className="form-label"
                                                    >
                                                      Select
                                                    </Label>
                                                    <Field
                                                      name="status"
                                                      component="select"
                                                      // onChange={e =>
                                                      //   this.setState({
                                                      //     status:
                                                      //       e.target.value,
                                                      //   })
                                                      // }
                                                      onChange={e => {
                                                        this.setState({
                                                          csrAppointment: {
                                                            id: csrAppointment.id,
                                                            status:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      className="form-select"
                                                    > <option value="">
                                                    --- Please Select---
                                                  </option>
                                                      <option value="Cancel">
                                                        Cancel
                                                      </option>
                                                    </Field>
                                                  </div>
                                                  {this.state.status=="Cancel" ? (
                                                    <div className="mb-3">
                                                      <Label className="form-label">
                                                        <b>Comment</b>
                                                      </Label>
                                                      <Field
                                                        name="comments"
                                                        as="textarea"
                                                        rows="2"
                                                        cols="20"
                                                        className={
                                                          "form-control" +
                                                          (errors.comments &&
                                                          touched.comments
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                        value={
                                                          this.state.comments
                                                        }
                                                        onChange={e =>
                                                          this.setState({
                                                            comments:
                                                              e.target.value,
                                                          })
                                                        }
                                                      />
                                                      <ErrorMessage
                                                        name="comments"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  ):null}
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

csrAppointments.propTypes = {
  match: PropTypes.object,
  csrAppointments: PropTypes.array,
  className: PropTypes.any,
  onGetCsrAppointments: PropTypes.func,
  onUpdateCsrAppointments: PropTypes.func,
};

const mapStateToProps = ({ csrappointments }) => ({
  csrAppointments: csrappointments.csrAppointments,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetCsrAppointments: id => dispatch(getCsrAppointments(id)),
  onUpdateCsrAppointments: csrAppointment =>
    dispatch(updateCsrAppointments(csrAppointment)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(csrAppointments));
