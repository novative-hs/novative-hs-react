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
import { getActivityLogRounds } from "store/registrationdmin-history/actions";
import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class MsgsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      activitylogRounds: [],
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { onGetActivityLogRounds } = this.props;
    // Get 'id' from route params
    const id = this.props.match.params.id;

    if (id) {
      // Pass both id and type to the action
      onGetActivityLogRounds(id);
    } else {
      console.error("ID  missing in the request.");
    }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  componentDidUpdate(prevProps) {
    const { activitylogRounds } = this.props;
    if (
      !isEmpty(activitylogRounds) &&
      size(prevProps.activitylogRounds) !== size(activitylogRounds)
    ) {
      this.setState({ activitylogRounds: {}, isEdit: false });
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

  formatFieldName(name) {
    if (!name) return "";
    return name.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
  }
  formatReadableValue = value => {
    try {
      const parsed = JSON.parse(value);

      if (typeof parsed === "object" && parsed !== null) {
        const {
          analyte,
          units,
          instrument,
          method,
          reagents,
          result,
          round_name,
          round_status,
          result_status,
          result_type,
        } = parsed;

        const readableParts = [];

        if (analyte)
          readableParts.push(
            `Analyte: ${this.props.analyteMap?.[analyte] || analyte}`
          );
        if (units)
          readableParts.push(`Units: ${this.props.unitMap?.[units] || units}`);
        if (instrument)
          readableParts.push(
            `Instrument: ${
              this.props.instrumentMap?.[instrument] || instrument
            }`
          );
        if (method)
          readableParts.push(
            `Method: ${this.props.methodMap?.[method] || method}`
          );
        if (reagents)
          readableParts.push(
            `Reagents: ${this.props.reagentsMap?.[reagents] || reagents}`
          );
        if (result) readableParts.push(`Result: ${result}`);
        if (round_status) readableParts.push(`Round Status: ${round_status}`);
        if (result_status)
          readableParts.push(`Result Status: ${result_status}`);
        if (result_type) readableParts.push(`Result Type: ${result_type}`);
        if (round_name) readableParts.push(`Round: ${round_name}`);

        return readableParts.join(", ");
      }

      return value;
    } catch (e) {
      return value;
    }
  };

  render() {
    const { SearchBar } = Search;
    const { activitylogRounds } = this.props;
    const { isEdit, deleteModal } = this.state;
    const pageOptions = {
      sizePerPage: 10,
      totalSize: activitylogRounds ? activitylogRounds.length : 0,
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
                    {!isEmpty(this.props.activitylogRounds) &&
                      this.props.activitylogRounds
                        .filter(activitylogRounds => {
                          const allowedResultStatuses = [
                            "saved",
                            "submit",
                            "resubmit",
                          ];
                          const allowedRoundStatus = "report available";

                          const status =
                            activitylogRounds.status?.toLowerCase() || "";
                          const newVal =
                            activitylogRounds.new_value?.toLowerCase() || "";
                          const oldVal =
                            activitylogRounds.old_value?.toLowerCase() || "";

                          const isResultStatusChange =
                            allowedResultStatuses.includes(status) ||
                            allowedResultStatuses.some(s =>
                              newVal.includes(s)
                            ) ||
                            allowedResultStatuses.some(s =>
                              oldVal.includes(s)
                            ) ||
                            status === allowedRoundStatus ||
                            newVal.includes("report available") ||
                            oldVal.includes("report available");

                          // ✅ Only include if status changed TO "report available"
                          const isRoundStatusToReportAvailable =
                            newVal.includes("status: report available") &&
                            !oldVal.includes("status: report available");
                          return (
                            isResultStatusChange ||
                            isRoundStatusToReportAvailable
                          );
                        })

                        .map((activitylogRounds, key) => {
                          // Determine the status color
                          const statusColor =
                            statusColors[activitylogRounds.status] || "gray"; // Default color

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
                                    {activitylogRounds.actions === "Updated"
                                      ? "Update"
                                      : "Result Status"}
                                    :
                                  </span>
                                  <span
                                    style={{
                                      color: statusColor,
                                      marginLeft: "10px",
                                    }}
                                  >
                                    {activitylogRounds.status}
                                  </span>
                                </div>
                                {activitylogRounds.actions === "Updated" && (
                                  <div
                                    key={key}
                                    style={{ marginBottom: "10px" }}
                                  >
                                    <b>{activitylogRounds.added_by}</b> made a
                                    change on{" "}
                                    <b>
                                      {moment(
                                        activitylogRounds.date_of_updation
                                      ).format("DD MMM YYYY, h:mm A")}
                                    </b>
                                    .
                                  </div>
                                )}

                                {/* {activitylogRounds.actions === "Added" && (
                                  <div>
                                    <b>{`${activitylogRounds.added_by}`}</b>{" "}
                                    Added a Round{" "}
                                    <b>{activitylogRounds.new_value}</b> at{" "}
                                    {moment(
                                      activitylogRounds.date_of_addition
                                    ).format("DD MMM YYYY, h:mm A")}{" "}
                                    with Round ID{" "}
                                    <b>{activitylogRounds.round_id}</b>.
                                  </div>
                                )} */}
                              </CardBody>
                            </Card>
                          );
                        })}

                    {isEmpty(this.props.activitylogRounds) && (
                      <Row>
                        <Col lg="12">
                          <div className=" mb-5">
                            <h5 className="text-uppercase">
                              No Comments exists.....
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

MsgsList.propTypes = {
  match: PropTypes.object,
  activitylogRounds: PropTypes.array,
  className: PropTypes.any,
  onGetActivityLogRounds: PropTypes.func,
  location: PropTypes.object,
  analyteMap: PropTypes.object,
  unitMap: PropTypes.object,
  instrumentMap: PropTypes.object,
  methodMap: PropTypes.object,
  reagentsMap: PropTypes.object,
};

const mapStateToProps = ({ activitylogRounds }) => ({
  activitylogRounds: activitylogRounds.activitylogRounds,
});

const mapDispatchToProps = dispatch => ({
  onGetActivityLogRounds: id => dispatch(getActivityLogRounds(id)), // Pass id and type here
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MsgsList));

