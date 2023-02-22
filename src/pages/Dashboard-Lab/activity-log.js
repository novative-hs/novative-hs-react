import React, { Component, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { any } from "prop-types";
import { withRouter, Link } from "react-router-dom";
import {
  Alert,
  Card,
  CardBody,
  Col,
  Table,
  Container,
  Input,
  Label,
  Modal,
  Row,
  Button,
  ModalBody,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { isEmpty, map } from "lodash";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
//Import Breadcrumb
import "assets/scss/table.scss";
import Breadcrumbs from "components/Common/Breadcrumb";
import { getActivityLog, addNewAudit } from "store/activtylog/actions";

class LabAudits extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      activitylog: [],
    //   id: "",
    //   assignedTo: "",
    //   LabAudits: "",
    //   auditModal: false,
    //   reason_of_reaudit:"",
      activitylog: "",
    //   audit_status:"",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    //   ActivityLogListColumns: [
    //     {
    //       text: "id",
    //       dataField: "id",
    //       sort: true,
    //       hidden: true,
    //       formatter: (cellContent, activitylog) => <>{activitylog.id}</>,
    //     },
    //     {
    //       dataField: "actions",
    //       text: "Action Performed",
    //       sort: true,
    //     },
    //     {
    //       dataField: "lab_name",
    //       text: "Done by",
    //       sort: true,
    //     },
       
    //     {
    //       dataField: "created_at",
    //       text: "Done at at",
    //       sort: true,
    //       formatter: (cellContent, activitylog) => (
    //         <>
    //           <span>{new Date(activitylog.created_at).toLocaleString("en-US")}</span>
    //         </>
    //       ),
    //     },
    //     {
    //       dataField: "test_name",
    //       text: "Test Name",
    //       sort: true,
    //     },
    //     {
    //       dataField: "field_name",
    //       text: "Field",
    //       sort: true,
    //     },
    //     {
    //       dataField: "old_value",
    //       text: "Previous Value",
    //       sort: true,
    //     },
    //     {
    //     dataField: "new_value",
    //     text: "New Value",
    //     sort: true,
    //   },
    //   ],
    };
    // this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { activitylog, onGetActivityLog } = this.props;
    console.log(onGetActivityLog(this.state.user_id));
    this.setState({ activitylog });
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

    const { activitylog, } = this.props;
    const {  onGetActivityLog } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: activitylog.length, // replace later with size(activitylog),
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
            <title>Activity Log | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
          <Card>
            <CardBody>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Offered Tests" breadcrumbItem="Activity Log" />
            
                {!isEmpty(this.props.activitylog) &&
                  this.props.activitylog.map((activitylog, key) => (
                     <Col  key={"_col_" + key}>
                     
                          <div className="mt-3">
                            {activitylog.actions =="Added" && (
                              <div>
                              <i className="fas fa-plus-square font-size-18"></i>{" "}
                            {activitylog.lab_name} Added <b>{activitylog.test_name}</b> on {new Date(activitylog.created_at).toLocaleDateString("en-US")} at {new Date(activitylog.created_at).toLocaleTimeString("en-US")}.
                            </div>
                            )}
                              {activitylog.actions =="Updated" && (
                              <div>
                              <i className="fas fa-exchange-alt font-size-18"></i>{" "}
                            {activitylog.lab_name} Changed <b>{activitylog.test_name} </b> {activitylog.field_name} from {activitylog.old_value} to {activitylog.new_value} on {new Date(activitylog.created_at).toLocaleDateString("en-US")} at {new Date(activitylog.created_at).toLocaleTimeString("en-US")}.
                              
                            </div>
                            )}
                            {activitylog.actions =="Synchronize" && (
                              <div>
                              <i className="fas fa-sync-alt font-size-18"></i>{" "}
                                {activitylog.lab_name} Synchronizes its main lab tests on {new Date(activitylog.created_at).toLocaleDateString("en-US")} at {new Date(activitylog.created_at).toLocaleTimeString("en-US")}.
                              
                            </div>
                            )}
                          </div>
                        
                     </Col>
                  ))}
                  

                {isEmpty(this.props.activitylog) && (
                  <Row>
                    <Col lg="12">
                      <div className=" mb-5">
                        <h5 className="text-uppercase">No activity log exists.....</h5>
                      </div>
                    </Col>
                  </Row>
                )}
                </CardBody>
                      </Card>
             
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

LabAudits.propTypes = {
  match: PropTypes.object,
  activitylog: PropTypes.array,
  className: PropTypes.any,
  onGetActivityLog: PropTypes.func,
  history: any,
  success: PropTypes.any,
  error: PropTypes.any,
};
const mapStateToProps = ({ activitylog }) => ({
  activitylog: activitylog.activitylog,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetActivityLog: id => dispatch(getActivityLog(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabAudits));
