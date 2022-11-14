import React, { Component, useState } from "react";
import Select from "react-select";
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
  Input,
  Button,
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
import {
  getInProcessAudits,
  assignAudit,
  //   getAuditorList,
} from "store/auditor-admin/actions";

import { getAuditorCentralList,
  getAuditorSouthList,
  getAuditorNorthList,
 } from "store/auditor-territory-list/actions";

import { getAuditorList } from "store/staff/actions";
import "assets/scss/table.scss";

class InProcessAudits extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      inProcessAudits: [],
      // Office
      auditorCentralTerritoryList: [],
      auditorSouthTerritoryList: [],
      auditorNorthTerritoryList: [],
      id: "",
      auditorName: "",
      assignedTo: "",
      message: "",
      InProcessAudits: "",
      inProcessAudit: "",
      auditorList: [],
      messageModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      inProcessAuditListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, inProcessAudit) => <>{inProcessAudit.id}</>,
        },
        {
          dataField: "lab_name",
          text: "Lab name",
          sort: true,
        },
        {
          dataField: "lab_city",
          text: "City",
          sort: true,
        },
        {
          dataField: "lab_address",
          text: "Lab name",
          sort: true,
        },
        {
          dataField: "office",
          text: "Office",
          sort: true,
        },
        {
          dataField: "generated_at",
          text: "Generated at",
          sort: true,
          formatter: (cellContent, audit) => (
            <>
              <span>
                {new Date(audit.generated_at).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        {
          dataField: "assigned_at",
          text: "Assigned at",
          sort: true,
          formatter: (cellContent, audit) => (
            <>
              <span>{new Date(audit.assigned_at).toLocaleString("en-US")}</span>
            </>
          ),
        },
        {
          dataField: "auditor_name",
          text: "Assigned to",
          sort: true,
        },
        {
          dataField: "data",
          text: "id",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, inProcessAudit) => (
            <>
              <Link
                className="btn btn-success"
                to="#"
                onClick={e => this.handleApprovedEvent(e, inProcessAudit)}
              >
                Reassign
              </Link>{" "}
            </>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.toggleMessageModal.bind(this);
    this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
  }

  componentDidMount() {
    const { inProcessAudits, onGetInProcessAudits } = this.props;
    onGetInProcessAudits();
    this.setState({ inProcessAudits });

    const { auditorList, onGetAuditorList } = this.props;
    onGetAuditorList();
    this.setState({ auditorList });


    //  auditor central list
    const { auditorCentralTerritoryList, onGetAuditorCentralList } = this.props;
    onGetAuditorCentralList();
    this.setState({ auditorCentralTerritoryList });
    //  auditor south list
    const { auditorSouthTerritoryList, onGetAuditorSouthList } = this.props;
    onGetAuditorSouthList();
    this.setState({ auditorSouthTerritoryList });
    //  auditor north list
    const { auditorNorthTerritoryList, onGetAuditorNorthList } = this.props;
    onGetAuditorNorthList();
    this.setState({ auditorNorthTerritoryList });
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

  openMessageModal = (e, arg) => {
    this.setState({ messageModal: true, message: arg.message });
  };

  handleApprovedEvent = (e, arg) => {
    this.setState({
      id: arg.id,
      auditorName: arg.auditor_name,
      assignedTo: arg.assigned_to,
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

    const { inProcessAudits } = this.props;
    const data = this.state.data;
    const { onAssignAudit, onGetInProcessAudits } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: inProcessAudits.length, // replace later with size(inProcessAudits),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const auditorList = [];
    for (let i = 0; i < this.props.auditorList.length; i++) {
      auditorList.push({
        label: this.props.auditorList[i].name,
        value: this.props.auditorList[i].id,
      });
    }

      // Central Office
      const auditorCentralTerritoryList = [];

      for (let i = 0; i < this.props.auditorCentralTerritoryList.length; i++) {
        auditorCentralTerritoryList.push({
          label: this.props.auditorCentralTerritoryList[i].name,
          value: this.props.auditorCentralTerritoryList[i].id,
        });
    
      }
  
      // South Office
      const auditorSouthTerritoryList = [];
  
      for (let i = 0; i < this.props.auditorSouthTerritoryList.length; i++) {
        auditorSouthTerritoryList.push({
          label: this.props.auditorSouthTerritoryList[i].name,
          value: this.props.auditorSouthTerritoryList[i].id,
        });
    
      }
      // North Office
      const auditorNorthTerritoryList = [];
  
      for (let i = 0; i < this.props.auditorNorthTerritoryList.length; i++) {
        auditorNorthTerritoryList.push({
          label: this.props.auditorNorthTerritoryList[i].name,
          value: this.props.auditorNorthTerritoryList[i].id,
        });
      }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>InProcess Audits | Audit Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Audits" breadcrumbItem="InProcess" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.inProcessAuditListColumns}
                      data={inProcessAudits}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.inProcessAuditListColumns}
                          data={inProcessAudits}
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
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                    />
                                    <Modal
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
                                            assignedTo:
                                              (this.state &&
                                                this.state.assignedTo) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            assignedTo: Yup.number().required(
                                              "Please select AuditorList to assign complaint"
                                            ),
                                          })}
                                          onSubmit={values => {
                                            const data = {
                                              id: this.state.id,
                                              assignedTo: values.assignedTo,
                                            };

                                            // Assign complaint
                                            onAssignAudit(data);

                                            // Calling to update list record
                                            setTimeout(() => {
                                              onGetInProcessAudits();
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
                                                      Office
                                                    </Label>
                                                    <Field
                                                      name="office"
                                                      as="select"
                                                      className="form-control"
                                                      onChange={e => {
                                                        this.setState({
                                                          inProcessAudit: {
                                                         
                                                            office: e.target.value,
                                                          
                                                          },
                                                        });
                                                      }}
                                                      multiple={false}
                                                      value={
                                                        this.state.office
                                                      }
                                                    >
                                                       <option value="">
                                                      ---Select Office---
                                                      </option>
                                                      <option value="Central Office">
                                                      Central Office
                                                      </option>
                                                      <option value="South Office">
                                                      South Office
                                                      </option>
                                                      <option value="North Office">
                                                      North Office
                                                      </option>
                                                   
                                                    </Field>
                                                  </div>
                                               
                                          {this.state.inProcessAudit.office =="Central Office"
                                                &&(

                                                  <div className="mb-3 select2-container">
                                                    <Label>Assigned to</Label>
                                                    <Select
                                                      name="assignedTo"
                                                      component="Select"
                                                      onChange={selectedGroup => {
                                                        this.setState({
                                                          assignedTo:
                                                            selectedGroup.value,
                                                        });
                                                      }}
                                                      className={
                                                        "defautSelectParent" +
                                                        (errors.assignedTo
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      styles={{
                                                        control: (
                                                          base,
                                                          state
                                                        ) => ({
                                                          ...base,
                                                          borderColor:
                                                            errors.assignedTo
                                                              ? "#f46a6a"
                                                              : "#ced4da",
                                                        }),
                                                      }}
                                                      options={auditorCentralTerritoryList}
                                                      placeholder="Select Auditor..."
                                                    />
                                                    <ErrorMessage
                                                      name="assignedTo"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                )} 
                                                 {/* South Office */}
                                                 {this.state.inProcessAudit.office =="South Office"
                                                &&(

                                                  <div className="mb-3 select2-container">
                                                    <Label>Assigned to</Label>
                                                    <Select
                                                      name="assignedTo"
                                                      component="Select"
                                                      onChange={selectedGroup => {
                                                        this.setState({
                                                          assignedTo:
                                                            selectedGroup.value,
                                                        });
                                                      }}
                                                      className={
                                                        "defautSelectParent" +
                                                        (errors.assignedTo
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      styles={{
                                                        control: (
                                                          base,
                                                          state
                                                        ) => ({
                                                          ...base,
                                                          borderColor:
                                                            errors.assignedTo
                                                              ? "#f46a6a"
                                                              : "#ced4da",
                                                        }),
                                                      }}
                                                      options={auditorSouthTerritoryList}
                                                      placeholder="Select Auditor..."
                                                    />
                                                    <ErrorMessage
                                                      name="assignedTo"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                )} 
                                                 {/* North Office */}
                                                 {this.state.inProcessAudit.office =="North Office"
                                                &&(

                                                  <div className="mb-3 select2-container">
                                                    <Label>Assigned to</Label>
                                                    <Select
                                                      name="assignedTo"
                                                      component="Select"
                                                      onChange={selectedGroup => {
                                                        this.setState({
                                                          assignedTo:
                                                            selectedGroup.value,
                                                        });
                                                      }}
                                                      className={
                                                        "defautSelectParent" +
                                                        (errors.assignedTo
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      styles={{
                                                        control: (
                                                          base,
                                                          state
                                                        ) => ({
                                                          ...base,
                                                          borderColor:
                                                            errors.assignedTo
                                                              ? "#f46a6a"
                                                              : "#ced4da",
                                                        }),
                                                      }}
                                                      options={auditorNorthTerritoryList}
                                                      placeholder="Select Auditor..."
                                                    />
                                                    <ErrorMessage
                                                      name="assignedTo"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                )} 
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
                                                  Audit Message
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

InProcessAudits.propTypes = {
  match: PropTypes.object,
  inProcessAudits: PropTypes.array,
  auditorList: PropTypes.array,
  className: PropTypes.any,
  onGetInProcessAudits: PropTypes.func,
  onGetAuditorList: PropTypes.func,
  onAssignAudit: PropTypes.func,
  auditorCentralTerritoryList: PropTypes.array,
  auditorSouthTerritoryList:  PropTypes.array,
  auditorNorthTerritoryList:  PropTypes.array,
  onGetAuditorCentralList: PropTypes.func,
  onGetAuditorSouthList: PropTypes.func,
  onGetAuditorNorthList: PropTypes.func,
};
const mapStateToProps = ({ auditorAdmin, staff, auditorTerritoryList }) => ({
  inProcessAudits: auditorAdmin.inProcessAudits,
  auditorList: staff.auditorList,
  auditorCentralTerritoryList: auditorTerritoryList.auditorCentralTerritoryList,
  auditorSouthTerritoryList: auditorTerritoryList.auditorSouthTerritoryList,
  auditorNorthTerritoryList: auditorTerritoryList.auditorNorthTerritoryList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAssignAudit: data => dispatch(assignAudit(data)),
  onGetInProcessAudits: () => dispatch(getInProcessAudits()),
  onGetAuditorList: () => dispatch(getAuditorList()),
  onGetAuditorCentralList: () => dispatch(getAuditorCentralList()),
  onGetAuditorSouthList: () => dispatch(getAuditorSouthList()),
  onGetAuditorNorthList: () => dispatch(getAuditorNorthList()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InProcessAudits));
