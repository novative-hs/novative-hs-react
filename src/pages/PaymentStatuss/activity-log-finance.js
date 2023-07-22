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
import { getActivityLogFinance } from "store/activtylogfinance/actions";

class ActivityLogFinance extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      activitylogfinance: [],
      activitylogfinance: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    const { activitylogfinance, onGetActivityLogFinance } = this.props;
    console.log(onGetActivityLogFinance(this.state.user_id));
    this.setState({ activitylogfinance });
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

    const { activitylogfinance } = this.props;
    const { onGetActivityLogFinance } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: activitylogfinance.length, // replace later with size(activitylogfinance),
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
                <Breadcrumbs title="Finance" breadcrumbItem="Activity Log" />

                {!isEmpty(this.props.activitylogfinance) &&
                  this.props.activitylogfinance.map(
                    (activitylogfinance, key) => (
                      <Col key={"_col_" + key}>
                        <div className="mt-3">
                          {activitylogfinance.actions === "Added" && activitylogfinance.type !== "Bank Transfer Detail" && (
                            <div>
                              <i className="fas fa-plus-square font-size-18"></i>{" "}
                              {`${activitylogfinance.user_name} Created a `}
                              <b>{activitylogfinance.type}</b> form for{" "}
                              <b>
                                {activitylogfinance.payment_for}{" "}
                                {activitylogfinance.payment_for ===
                                "Advertisement"
                                  ? activitylogfinance.adv_lab_name
                                  : activitylogfinance.lab_name ||
                                    activitylogfinance.donor_name ||
                                    activitylogfinance.b2b_name}
                              </b>{" "}
                              on{" "}
                              {new Date(
                                activitylogfinance.created_at
                              ).toLocaleDateString("en-US")}{" "}
                              at{" "}
                              {new Date(
                                activitylogfinance.created_at
                              ).toLocaleTimeString("en-US")}{" "}
                              with id{" "}
                              <b>
                                {activitylogfinance.payment_in_id ||
                                  activitylogfinance.payment_out_id ||
                                  activitylogfinance.btd_id}
                              </b>
                              .
                            </div>
                          )}
                           {activitylogfinance.actions === "Added" && activitylogfinance.type === "Bank Transfer Detail" && (
                            <div>
                              <i className="fas fa-plus-square font-size-18"></i>{" "}
                              {`${activitylogfinance.user_name} Created a `}
                              <b>{activitylogfinance.type}</b> form on{" "}
                              {new Date(
                                activitylogfinance.created_at
                              ).toLocaleDateString("en-US")}{" "}
                              at{" "}
                              {new Date(
                                activitylogfinance.created_at
                              ).toLocaleTimeString("en-US")}{" "}
                              with id{" "}
                              <b>
                                {activitylogfinance.btd_id}
                              </b>
                              .
                            </div>
                          )}

                          {activitylogfinance.actions === "Updated" && activitylogfinance.type !== "Bank Transfer Detail" && (
                            <div>
                              <i className="fas fa-exchange-alt font-size-18"></i>{" "}
                              {`${activitylogfinance.user_name} Changed Status of `}
                              <b>{activitylogfinance.type}</b> with id{" "}
                              {activitylogfinance.payment_in_id ||
                                activitylogfinance.payment_out_id ||
                                activitylogfinance.btd_id}{" "}
                              for <b>{activitylogfinance.payment_for}</b>{" "}
                              <b>
                                {" "}
                                {activitylogfinance.payment_for ===
                                "Advertisement"
                                  ? activitylogfinance.adv_lab_name
                                  : activitylogfinance.payment_for === "Donor"
                                  ? activitylogfinance.donor_name
                                  : activitylogfinance.lab_name ||
                                    activitylogfinance.b2b_name}
                              </b>{" "}
                              from <b>{activitylogfinance.old_value}</b> to{" "}
                              <b>{activitylogfinance.new_value}</b> on{" "}
                              {new Date(
                                activitylogfinance.created_at
                              ).toLocaleDateString("en-US")}{" "}
                              at{" "}
                              {new Date(
                                activitylogfinance.created_at
                              ).toLocaleTimeString("en-US")}
                              .
                            </div>
                          )}
                          {activitylogfinance.actions === "Updated" && activitylogfinance.type === "Bank Transfer Detail" && (
                            <div>
                              <i className="fas fa-exchange-alt font-size-18"></i>{" "}
                              {`${activitylogfinance.user_name} Changed Status of `}
                              <b>{activitylogfinance.type}</b> with id{" "}
                              {activitylogfinance.btd_id}{" "}
                              from <b>{activitylogfinance.old_value}</b> to{" "}
                              <b>{activitylogfinance.new_value}</b> on{" "}
                              {new Date(
                                activitylogfinance.created_at
                              ).toLocaleDateString("en-US")}{" "}
                              at{" "}
                              {new Date(
                                activitylogfinance.created_at
                              ).toLocaleTimeString("en-US")}
                              .
                            </div>
                          )}

                          {activitylogfinance.actions == "Synchronize" && (
                            <div>
                              <i className="fas fa-sync-alt font-size-18"></i>{" "}
                              {activitylogfinance.lab_name} Synchronizes its
                              main lab tests on{" "}
                              {new Date(
                                activitylogfinance.created_at
                              ).toLocaleDateString("en-US")}{" "}
                              at{" "}
                              {new Date(
                                activitylogfinance.created_at
                              ).toLocaleTimeString("en-US")}
                              .
                            </div>
                          )}
                        </div>
                      </Col>
                    )
                  )}

                {isEmpty(this.props.activitylogfinance) && (
                  <Row>
                    <Col lg="12">
                      <div className=" mb-5">
                        <h5 className="text-uppercase">
                          No activity log exists.....
                        </h5>
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

ActivityLogFinance.propTypes = {
  match: PropTypes.object,
  activitylogfinance: PropTypes.array,
  className: PropTypes.any,
  onGetActivityLogFinance: PropTypes.func,
  history: any,
  success: PropTypes.any,
  error: PropTypes.any,
};
const mapStateToProps = ({ activitylogfinance }) => ({
  activitylogfinance: activitylogfinance.activitylogfinance,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetActivityLogFinance: id => dispatch(getActivityLogFinance(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ActivityLogFinance));
