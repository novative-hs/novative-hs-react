import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Col, Container, Row, Alert } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

// Import actions
import { getUnsubmittedparticipants } from "store/rounds/actions";
import "assets/scss/table.scss";

class PendingSubmission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: "",
      idFilter: "",
      selectedCheckboxes: {}, // Track checked checkboxes
      tableKey: 0,
      RoundParticipantlist: [],
      feedbackMessage: "",
      errorMessage: "", // State for error message
      feedbackListColumns: [
        {
          text: "Lab ID",
          dataField: "id",
          sort: true,
          headerFormatter: (column, colIndex) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.idFilter}
                  onChange={e => this.handleFilterChange("idFilter", e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          headerStyle: { width: "100px" },
          style: { width: "100px" },
        },
        {
          dataField: "name",
          text: "Participant",
          sort: true,
          formatter: (cell, row) =>
            typeof cell === "string" ? cell : "Unknown", // Fallback for invalid data
          headerFormatter: (column, colIndex) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.nameFilter}
                  onChange={e => this.handleFilterChange("nameFilter", e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          headerAlign: "center",
          align: "Left",
        },
{
  dataField: "email",
  text: "Email",
  sort: true,
  formatter: (cell) => <span>{cell}</span>,  // Just show email, no edit icon
  headerFormatter: (column, colIndex) => (
    <>
      <div>
        <input
          type="text"
          value={this.state.nameFilter}
          onChange={(e) => this.handleFilterChange("nameFilter", e)}
          className="form-control"
        />
      </div>
      <div>{column.text}</div>
    </>
  ),
  headerAlign: "center",
  align: "left",
}

,
{
  dataField: "contact", // or "phone" depending on your data field name
  text: "Phone",
  sort: true,
  formatter: (cell) => <span>{cell || "-"}</span>, // shows phone or dash if empty
  headerFormatter: (column, colIndex) => (
    <>
      <div>
        <input
          type="text"
          value={this.state.phoneFilter}
          onChange={(e) => this.handleFilterChange("phoneFilter", e)}
          className="form-control"
        />
      </div>
      <div>{column.text}</div>
    </>
  ),
  headerAlign: "center",
  align: "center",
}
,
{
  dataField: "comments",
  text: "Comments",
  formatter: (cell, row) => (
    <button
      style={{ background: "none", border: "none", cursor: "pointer", color: "#007bff" }}
      title="Add/View Comments"
      onClick={() => this.handleOpenComments(row.AccountID)}
    >
      <i className="fas fa-comments"></i>
    </button>
  ),
  headerAlign: "center",
  align: "center",
}
,

      ],
    };
    this.transformParticipantData = this.transformParticipantData.bind(this);
  }

  // Transformation logic for participant data
  transformParticipantData(participantList) {
    return participantList.map(participant => ({
      ...participant,
      fullName: `${participant.firstName || "Unknown"} ${
        participant.lastName || ""
      }`,
    }));
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    console.log(
      "Previous RoundParticipantlist:",
      prevProps.RoundParticipantlist
    );
    console.log(
      "Current RoundParticipantlist:",
      this.props.RoundParticipantlist
    );

    if (prevProps.RoundParticipantlist !== this.props.RoundParticipantlist) {
      console.log("Detected change in RoundParticipantlist. Updating state...");
      this.setState({ RoundParticipantlist: this.props.RoundParticipantlist });
    }
  }

  fetchData = async () => {
    const { ongetUnsubmittedparticipants } = this.props;
    const RoundParticipantId = this.props.match.params?.id;

    if (!RoundParticipantId) {
      console.error("RoundParticipantId not found in URL parameters");
      return;
    }

    try {
      console.log("Fetching data for ID:", RoundParticipantId);
      await ongetUnsubmittedparticipants(RoundParticipantId); // Dispatch action to fetch data

      const updatedList = this.props.RoundParticipantlist;
      if (Array.isArray(updatedList)) {
        console.log("Fetched participants:", updatedList); // Log the participants fetched
        this.setState({ RoundParticipantlist: updatedList });
      }
    } catch (error) {
      console.error("Error fetching participant data:", error);
    }
  };

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  filterData = () => {
    const { RoundParticipantlist } = this.state;
    const { nameFilter, idFilter } = this.state;

    if (!Array.isArray(RoundParticipantlist)) {
      return []; // Return empty array if not an array
    }

    return RoundParticipantlist.filter(entry => {
      const name =
        typeof entry.name === "string" ? entry.name.toLowerCase() : "";
      const id = entry.id ? entry.id.toString() : "";

      return name.includes(nameFilter.toLowerCase()) && id.includes(idFilter);
    });
  };

  render() {
    const { RoundParticipantlist, roundDetails } = this.props;
    console.log("RoundParticipantlist in render:", RoundParticipantlist); // Log the data in render

    const defaultSorted = [{ dataField: "id", order: "desc" }];

    // Use roundDetails for breadcrumb
    const formatDate = date => {
      if (!date) return "";
      const [year, month, day] = date.split("-");
      return `${day}-${month}-${year}`;
    };

    const breadcrumbItem = roundDetails
      ? `Round Number: ${roundDetails.rounds || "No Round Number"}, 
         Scheme Name: ${roundDetails.scheme_name || "No Scheme Name"}, 
         Round Number: ${roundDetails.rounds || "No Round Number"}, 
         Cycle Number: ${roundDetails.cycle_no || "No Cycle Number"}, 
         Cycle Start Date: ${
           formatDate(roundDetails.issue_date) || "No Start Date"
         }, 
         Cycle End Date: ${
           formatDate(roundDetails.closing_date) || "No End Date"
         }, 
         Round Start Date: ${
           roundDetails.round_start_to_end
             ? formatDate(roundDetails.round_start_to_end.split(" to ")[0])
             : "No Round Start Date"
         }, 
         Round End Date: ${
           roundDetails.round_start_to_end
             ? formatDate(roundDetails.round_start_to_end.split(" to ")[1])
             : "No Round End Date"
         }`
      : "No Data Available";

    console.log("Generated Breadcrumb Item:", breadcrumbItem);

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Round Participant List</title>
          </MetaTags>
          <Container fluid>
            {/* <Breadcrumbs title="List" breadcrumbItem="Round Participant List" /> */}

            {roundDetails ? (
              <div className="round-details">
                <h4 className="text-primary text-center">
                  List of Participants Who have not Submitted Results for This Round
                </h4>

                <h4>Round Details:</h4>
                <p className="round-details-text">
                  {/* Display round details */}
                  <span className="me-3">
                    Scheme Name:{" "}
                    <strong style={{ color: "blue" }}>
                      {roundDetails.scheme_name || "No Scheme Name"}
                    </strong>
                  </span>
                  <span className="me-3">
                    Cycle Number:{" "}
                    <strong style={{ color: "blue" }}>
                      {roundDetails.cycle_no || "No Cycle Number"}
                    </strong>
                  </span>
                  <span className="me-3">
                    Round Number:{" "}
                    <strong style={{ color: "blue" }}>
                      {roundDetails.rounds || "No Round Number"}
                    </strong>
                  </span>
                  <span className="me-3">
                    Cycle Start Date:{" "}
                    <strong style={{ color: "blue" }}>
                      {formatDate(roundDetails.issue_date) || "No Start Date"}
                    </strong>
                  </span>
                  <span className="me-3">
                    Cycle End Date:{" "}
                    <strong style={{ color: "blue" }}>
                      {formatDate(roundDetails.closing_date) || "No End Date"}
                    </strong>
                  </span>
                  <span className="me-3">
                    Round Start Date:{" "}
                    <strong style={{ color: "blue" }}>
                      {roundDetails.round_start_to_end
                        ? formatDate(
                            roundDetails.round_start_to_end.split(" to ")[0]
                          )
                        : "No Round Start Date"}
                    </strong>
                  </span>
                  <span className="me-3">
                    Round End Date:{" "}
                    <strong style={{ color: "blue" }}>
                      {roundDetails.round_start_to_end
                        ? formatDate(
                            roundDetails.round_start_to_end.split(" to ")[1]
                          )
                        : "No Round End Date"}
                    </strong>
                  </span>
                </p>
              </div>
            ) : (
              <div>No round details available.</div>
            )}

            <Row className="justify-content-center">
              <Col lg="10">
                <Card>
                  <CardBody>
                    <ToolkitProvider
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={RoundParticipantlist}
                      search
                    >
                      {toolkitprops => (
                        <React.Fragment>
                          <Row className="mb-4">
                            <Col xl="12">
                              <div className="table-responsive">
                                <BootstrapTable
                                  key={this.state.tableKey}
                                  {...toolkitprops.baseProps}
                                  defaultSorted={defaultSorted}
                                  classes={"table align-middle table-hover"}
                                  bordered={false}
                                  striped={true}
                                  headerWrapperClasses={"table-light"}
                                  responsive
                                  data={RoundParticipantlist} // Use Redux data directly
                                  columns={this.state.feedbackListColumns}
                                />
                              </div>
                            </Col>
                          </Row>
                        </React.Fragment>
                      )}
                    </ToolkitProvider>
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

PendingSubmission.propTypes = {
  match: PropTypes.object,
  RoundParticipantlist: PropTypes.array,
  roundDetails: PropTypes.object,
  history: PropTypes.object,
  ongetUnsubmittedparticipants: PropTypes.func,
};

const mapStateToProps = state => {
  console.log("Redux State - roundDetails:", state.RoundList?.roundDetails); // ✅ Add this log
  console.log(
    "Redux State - RoundParticipantlist:",
    state.RoundList?.RoundParticipantlist
  ); // Log the participants
  return {
    roundDetails: state.RoundList?.roundDetails || {},
    RoundParticipantlist: state.RoundList?.RoundParticipantlist || [],
  };
};

const mapDispatchToProps = dispatch => ({
  ongetUnsubmittedparticipants: id => dispatch(getUnsubmittedparticipants(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PendingSubmission));

