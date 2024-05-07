
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
  getPendingCorporate,
  approveUnapproveCorporate,
} from "store/registration-admin/actions";

import ApproveUnapproveModal from "components/Common/ApproveUnapproveModal";
import "assets/scss/table.scss";

class PendingLabs extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      pendingCorporate: [],
      id: "",
      btnText: "Copy",
      isApproved: false,
      unapprovedModal: false,
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      pendingCorporates: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      pendingCorporatesListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, pendingCorporates) => <>{pendingCorporates.id}</>,
        },
        {
          dataField: "name",
          text: "Corporate name",
          sort: true,
          formatter: (cellContent, pendingCorporates) => (
            <>
              <span style={{
                width: '200px', // Set your desired width here
                fontSize: '14px',

                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'left', // Align text to the left
                display: 'block',
              }}>
                {/* <Link
                  to="#"
                  // onClick={e => this.openLabModal(e, pendingCorporates)}
                  onMouseEnter={e => this.openLabModal(e, pendingCorporates)}
                  onPointerLeave={this.handleMouseExit()}
                > */}
                  {pendingCorporates.name}
                {/* </Link> */}
              </span>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
          formatter: (cellContent, pendingCorporates) => (
            <>
              <span style={{
                width: '200px', // Set your desired width here
                fontSize: '14px',

                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'left', // Align text to the left
                display: 'block',
              }}>
                
                  {pendingCorporates.email}
                
              </span>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "city",
          text: "City",
          sort: true,
          formatter: (cellContent, pendingCorporates) => (
            <>
              <span style={{
                width: '200px', // Set your desired width here
                fontSize: '14px',

                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'left', // Align text to the left
                display: 'block',
              }}>
                {pendingCorporates.city}

              </span>
            </>
          ), filter: textFilter(),
        },
        
        {
          dataField: "address",
          text: "Address",
          sort: true,
          formatter: (cellContent, pendingCorporates) => (
            <span style={{
              width: '200px', // Set your desired width here
              fontSize: '14px',

              textOverflow: 'ellipsis',
              whiteSpace: 'prewrap',
              textAlign: 'left', // Align text to the left
              display: 'block',
            }}>
              {pendingCorporates.address}

            </span>
          ), filter: textFilter(),

        },

        {
          dataField: "landline",
          text: "Phone No",
          sort: true,
          formatter: (cellContent, pendingCorporates) => (
            <span style={{
              width: '200px', // Set your desired width here
              fontSize: '14px',

              textOverflow: 'ellipsis',
              whiteSpace: 'prewrap',
              textAlign: 'center', 
              display: 'block',
            }}>
              {pendingCorporates.landline}

            </span>
          ), filter: textFilter(),
        },
        {
          dataField: "data",
          text: "id",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, pendingCorporates) => (
            <>
              <Tooltip title="Update">
                <Link
                  className="btn btn-success btn-rounded"
                  to="#"
                  onClick={e => this.handleApprovedEvent(pendingCorporates.id)}

                >
                  <i className="mdi mdi-check-circle font-size-14"></i>
                </Link>
              </Tooltip>
              {" "}
              <Tooltip title="Delete">
                <Link
                  className="btn btn-danger btn-rounded"
                  to="#"
                  onClick={() => this.handleUnapprovedEvent(pendingCorporates.id)}
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
    // this.togglePatientModal = this.togglePatientModal.bind(this);
    this.toggleMarketerModal = this.toggleMarketerModal.bind(this);


  }

  componentDidMount() {
    const { pendingCorporate, onGetPendingLabs } = this.props;
    onGetPendingLabs();
    this.setState({ pendingCorporate });
  }
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      lab_staff_name: arg.lab_staff_name,
      lab_staff_designation: arg.lab_staff_designation,

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
      landline: arg.landline,
      email: arg.email,
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
  // togglePatientModal = () => {
  //   this.setState(prevState => ({
  //     PatientModal: !prevState.PatientModal,
  //   }));
  //   this.state.btnText === "Copy"
  //     ? this.setState({ btnText: "Copied" })
  //     : this.setState({ btnText: "Copy" });
  // };
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

  callOnapproveUnapproveCorporate = () => {
    const { onapproveUnapproveCorporate, onGetPendingLabs } = this.props;

    const data = {
      id: this.state.user_id,
      corporate_id: this.state.id,
      isApproved: this.state.isApproved,
    };

    // calling to unapprove lab
    onapproveUnapproveCorporate(data);

    // Calling to update list record
    setTimeout(() => {
      onGetPendingLabs();
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

  render() {
    const { SearchBar } = Search;

    const { pendingCorporate } = this.props;
    const data = this.state.data;
    const { onapproveUnapproveCorporate, onGetPendingLabs } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: pendingCorporate.length, // replace later with size(pendingCorporate),
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
            <title>Pending Corporates | Lab Hazir</title>
          </MetaTags>

          <ApproveUnapproveModal
            show={this.state.unapprovedModal}
            onYesClick={this.callOnapproveUnapproveCorporate}
            onCloseClick={() => this.setState({ unapprovedModal: false })}
          />

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Corporates" breadcrumbItem="Pending" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.pendingCorporatesListColumns}
                      data={pendingCorporate}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.pendingCorporatesListColumns}
                          data={pendingCorporate}
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
                                      filter={filterFactory()}

                                    />
                                    {/* <Modal
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
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                    </Modal> */}
                                    {/* <Modal
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
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                    </Modal> */}
                                    {/* <Modal
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
                                                      Name
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_staff_name

                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Designation
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_staff_designation
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
                                    </Modal> */}
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
                                              corporate_id: this.state.id,
                                              refereree_percentage:
                                                values.refereree_percentage,
                                            };

                                            // approve lab
                                            onapproveUnapproveCorporate(data);

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
  pendingCorporate: PropTypes.array,
  className: PropTypes.any,
  onGetPendingLabs: PropTypes.func,
  onapproveUnapproveCorporate: PropTypes.func,
};
const mapStateToProps = ({ registrationAdmin }) => ({
  pendingCorporate: registrationAdmin.pendingCorporate,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onapproveUnapproveCorporate: data => dispatch(approveUnapproveCorporate(data)),
  onGetPendingLabs: () => dispatch(getPendingCorporate()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PendingLabs));