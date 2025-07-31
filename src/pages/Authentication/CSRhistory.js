import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Search } from "react-bootstrap-table2-toolkit";
import moment from "moment";

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getActivityLogCsr } from "store/registrationdmin-history/actions";
import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class CSRHistory extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      activitylogCsr: [],
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };

    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { ongetActivityLogCsr } = this.props;
    // Get 'id' from route params
    const id = this.props.match.params.id;

    if (id) {
      // Pass both id and type to the action
      ongetActivityLogCsr(id);
    } else {
      console.error("ID  missing in the request.");
    }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  componentDidMount() {
    const { ongetActivityLogCsr } = this.props;
    const routeId = this.props.match?.params?.id;
    const id = routeId || this.state.user_id;

    console.log("componentDidMount - Final ID to use:", id);

    if (id) {
      ongetActivityLogCsr(id);
    } else {
      console.error("ID missing in the request.");
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activitylogCsr !== this.props.activitylogCsr) {
      const logs = this.props.activitylogCsr || [];
      console.log("[Component] Updated activity logs:", logs);
      if (!logs.length) {
        console.warn("[Component] No activity logs found for this user.");
      }
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
    const { activitylogCsr } = this.props;
    const { isEdit, deleteModal } = this.state;
    const pageOptions = {
      sizePerPage: 10,
      totalSize: activitylogCsr ? activitylogCsr.length : 0,
      custom: true,
    };
    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];
    const statusColors = {
      Created: "blue",
      Ready: "orange",
      Open: "green",
      Closed: "red",
      "Report Available": "purple",
    };
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title> History | Rounds</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="History" breadcrumbItem="Activity Log" />
            <Row>
              <Col lg="8" className="offset-lg-2">
                <Card className="mb-2 d-flex justify-content-center">
                  <CardBody>
                    {!isEmpty(this.props.activitylogCsr) &&
                      this.props.activitylogCsr.map((log, key) => {
                        const statusColor = statusColors[log.status] || "gray";
                        const actionType = log.actions;

                        return (
                          <Card
                            key={"_card_" + key}
                            className="mb-2"
                            style={{
                              backgroundColor: "#f2f2f2",
                              borderLeft: `5px solid ${statusColor}`,
                            }}
                          >
                            <CardBody className="p-3">
                              <div style={{ marginBottom: "10px" }}>
                                <span style={{ fontWeight: "bold" }}>
                                  {actionType === "Updated" ||
                                  actionType === "Reconcile"
                                    ? "Update"
                                    : "Addition"}
                                  :
                                </span>
                                <span
                                  style={{
                                    color: statusColor,
                                    marginLeft: "10px",
                                  }}
                                >
                                
                                </span>
                              </div>

                              {/* Handle Reconciliation logs */}
                              {actionType === "Reconcile" && (
                                <div>
                                  <b>
                                    {moment(log.date_of_addition).format(
                                      "DD MMM YYYY, h:mm A"
                                    )}
                                  </b>{" "}
                                  –{" "}
                                  <span style={{ fontWeight: "bold" }}>
                                    {log.username}
                                  </span>{" "}
                                  has reconciled the payment{" "}
                                  <b>{log.payment_id}</b> of lab{" "}
                                  <b>{log.lab_name}</b> with the bank statement{" "}
                                  <i>
                                    (
                                    <strong>
                                      {log.bank_name || "Unknown Bank"}
                                    </strong>{" "}
                                    account:{" "}
                                    <strong>{log.account_number}</strong>)
                                  </i>{" "}
                                  and comments as{" "}
                                  <b>{log.comment || "No comments"}</b>.
                                </div>
                              )}

                              {/* Handle Regular Update logs */}
                              {actionType === "Updated" && (
                                <div style={{ marginBottom: "10px" }}>
                                  <b>
                                    {moment(log.date_of_addition).format(
                                      "DD MMM YYYY, h:mm A"
                                    )}
                                  </b>{" "}
                                  –{" "}
                                  <span style={{ fontWeight: "bold" }}>
                                    {log.username}
                                  </span>{" "}
                                  has reconciled the payment{" "}
                                  <b>{log.payment_id}</b> of lab{" "}
                                  <b>{log.lab_name}</b> with the bank statement{" "}
                                  <i>
                                    (<strong>{log.bank_name}</strong> account:{" "}
                                    <strong>{log.account_number}</strong>)
                                  </i>
                                  .
                                </div>
                              )}

                              {/* Handle Addition logs */}
                              {actionType === "Added" && (
                                <div>
                                  <b>{log.username}</b> added payment for lab{" "}
                                  <b>{log.lab_name}</b> at{" "}
                                  {moment(log.date_of_addition).format(
                                    "DD MMM YYYY, h:mm A"
                                  )}
                                  .
                                </div>
                              )}
                            </CardBody>
                          </Card>
                        );
                      })}

                    {isEmpty(this.props.activitylogCsr) && (
                      <Row>
                        <Col lg="12">
                          <div className="mb-5">
                            <h5 className="text-uppercase">
                              No Comments exist.....
                            </h5>
                          </div>
                        </Col>
                      </Row>
                    )}
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

CSRHistory.propTypes = {
  match: PropTypes.object,
  activitylogCsr: PropTypes.array,
  className: PropTypes.any,
  ongetActivityLogCsr: PropTypes.func,
  location: PropTypes.object,
  error: PropTypes.any, // ✅ Add this line to resolve your warning
};

const mapStateToProps = state => {
  console.log(
    "Redux state slice for registrationAdminHistory:",
    state.activitylogRounds
  );

  return {
    activitylogCsr: state.activitylogRounds.activitylogCsr,
  };
};

const mapDispatchToProps = dispatch => ({
  ongetActivityLogCsr: id => dispatch(getActivityLogCsr(id)), // Pass id and type here
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CSRHistory));