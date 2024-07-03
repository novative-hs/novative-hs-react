import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
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
      isHovered: false,
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      approvedLab: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      approvedLabListColumns: [
        // {
        //   text: "S#", // Column header for row numbers
        //   formatter: (cellContent, approvedLab, rowIndex) => (
        //     <>
        //       <span>{rowIndex + 1}</span>
        //     </>
        //   ),
        // },
        {
          text: "id",
          dataField: "id",
          // sort: true,
          hidden: true,
          formatter: (cellContent, approvedLab) => <>{approvedLab.id}</>,
        },
        // {
        //   dataField: "city",
        //   text: "Participant City",
        //   // sort: true,
        //   formatter: (cellContent, approvedLab) => (
        //     <>
        //       <span>
        //         {approvedLab.city}
        //       </span>
        //     </>
        //   ), filter: textFilter(),
        // },
        // {
        //   dataField: "district",
        //   text: "District",
        //   // sort: true,
        //   formatter: (cellContent, approvedLab) => (
        //     <>
        //       <span>
        //         {approvedLab.district}
        //       </span>
        //     </>
        //   ), filter: textFilter(),
        // },
        {
          dataField: "name",
          text: "Participant Name",
          // sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span style={{
                width: '200px', // Set your desired width here
                fontSize: '14px',
              
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'left', // Align text to the left
                display: 'block',
              }}>
                <Link
                  to="#"
                  onMouseEnter={e => this.openPatientModal(e, approvedLab)}
                  onPointerLeave={this.handleMouseExit()}
                >
                  {approvedLab.name}
                </Link>
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "shipping_address",
          text: "Shipping Address",
          sort: true,   
          formatter: (cellContent, pendingLab) => (
            <span style={{
              width: '200px', // Set your desired width here
              fontSize: '14px',
            
              textOverflow: 'ellipsis',
              whiteSpace: 'prewrap',
              textAlign: 'left', // Align text to the left
              display: 'block',
            }}>
                   {pendingLab.shipping_address}
                  
            </span>
          ),filter: textFilter(),  
          
        },
        {
          dataField: "billing_address",
          text: "Billing Address",
          sort: true,   
          formatter: (cellContent, pendingLab) => (
            <span style={{
              width: '200px', // Set your desired width here
              fontSize: '14px',
            
              textOverflow: 'ellipsis',
              whiteSpace: 'prewrap',
              textAlign: 'left', // Align text to the left
              display: 'block',
            }}>
                   {pendingLab.billing_address}
                  
            </span>
          ),filter: textFilter(),  
          
        },
        {
          dataField: "registered_by",
          text: "Registered by",
          sort: true,
          formatter: (cellContent, pendingLab) => (
            <>
              {pendingLab.registered_by == 'Lab' ? (
                <span>
                 
                  <Link
                to="#"
                
                onMouseEnter={e =>  this.openLabModal(e, pendingLab)}
                onPointerLeave={this.handleMouseExit()}
              >
               {pendingLab.registered_by}
              </Link>
              </span>
              ) : (
                <span>
                  <Link
                to="#"
                // onClick={e => this.openMarketerModal(e, pendingLab)}
                onMouseEnter={e =>   this.openMarketerModal(e, pendingLab)}
                onPointerLeave={this.handleMouseExit()}
              >
               {pendingLab.registered_by}
              </Link>
                </span>
              )}
            </>
          ),filter: textFilter(),
        },
        // {
        //   dataField: "email",
        //   text: "Email",
        //   // sort: true,
        //   formatter: (cellContent, approvedLab) => (
        //     <>
        //       <span className="float-start">
        //         {approvedLab.email}
        //       </span>
        //     </>
        //   ),
        //   filter: textFilter(),
        // },
        // {
        //   dataField: "lab_phone",
        //   text: "Phone",
        //   // sort: true,
        //   formatter: (cellContent, approvedLab) => (
        //     <>
        //       <span className="float-end">
        //         {approvedLab.lab_phone}
        //       </span>
        //     </>
        //   ),
        //   filter: textFilter(),
        // },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.handlePatientFeedbackClick =
      this.handlePatientFeedbackClick.bind(this);
  }

  componentDidMount() {
    const { onGetApprovedLabs } = this.props;
    onGetApprovedLabs(this.state.user_id);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  openLabModal = (e, arg) => {
    this.setState({
      LabModal: true,
      email: arg.email,
      landline_registered_by: arg.landline_registered_by,
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
      lab_address: arg.lab_address,
      lab_name: arg.lab_name, 
      lab_city: arg.city,
      lab_district: arg.district,
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
      sizePerPage: 50,
      totalSize: approvedLabs.length, // replace later with size(approvedLabs),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];
    const iconStyle = { color: 'red' }; // Customize the color here

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Approved Participant | NEQAS</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Participant " breadcrumbItem="Approved" />
            <Row className="justify-content-center align-item-center">
                {/* <div> <span className="text-danger font-size-12">
                  <strong>
                    Note: There will be Approved and Active Labs Shown on it.
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
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-header-sky-blue"}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
                                      sort={{ sortCaret: (order, column) => order === 'desc' ? <i className="fa fa-arrow-up" style={iconStyle}></i> : <i className="fa fa-arrow-down" style={iconStyle}></i> }} // Customize sort caret icons

                                    />
                                    {/* {this.state.isHovered && ( */}
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
                                                          this.state.lab_name
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
                                                       District
                                                      </Label>
                                                    </div>
                                                    <div className="col-md-9">
                                                      <input
                                                        type="text"
                                                        value={
                                                          this.state.lab_district
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                      />
                                                    </div>
                                                  </div>
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
                                                          this.state.lab_address
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                      />
                                                    </div>
                                                  </div> */}

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
                                    {/* )} */}
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
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Mobile No.
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.landline_registered_by
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
                                                            .landline_registered_by
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
  onGetApprovedLabs: (id) => dispatch(getApprovedLabs(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ApprovedLabs));
