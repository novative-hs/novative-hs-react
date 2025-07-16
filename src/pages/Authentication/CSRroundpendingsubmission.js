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

class PendingSubmission2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: "",
      idFilter: "",
      contactPersonFilter: "",
      cityFilter: "",
      districtFilter: "",
      phoneFilter: "",
      emailFilter:"",
      provinceFilter:"",
      selectedCheckboxes: {}, // Track checked checkboxes
      tableKey: 0,
      RoundParticipantlist: [],
      feedbackMessage: "",
      errorMessage: "", // State for error message
      feedbackListColumns: [
        {
          text: "ID",
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
          dataField: "province",
          text: "Province",
          sort: true,
          headerFormatter: (column, colIndex) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.provinceFilter}
                  onChange={e => this.handleFilterChange("provinceFilter", e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          headerAlign: "center",
          align: "center",
        },
        {
          dataField: "district",
          text: "District",
          sort: true,
          headerFormatter: (column, colIndex) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.districtFilter}
                  onChange={e => this.handleFilterChange("districtFilter", e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          headerAlign: "center",
          align: "center",
        },
        {
          dataField: "city",
          text: "City",
          sort: true,
          headerFormatter: (column, colIndex) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.cityFilter}
                  onChange={e => this.handleFilterChange("cityFilter", e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          headerAlign: "center",
          align: "center",
        },
        {
          dataField: "name",
          text: "Participants",
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
          formatter: cell => <span>{cell}</span>, // Just show email, no edit icon
          headerFormatter: (column, colIndex) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.emailFilter}
                  onChange={e => this.handleFilterChange("emailFilter", e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          headerAlign: "center",
          align: "left",
        },
        {
          dataField: "contact_person_name",
          text: "Contact Person",
          sort: true,
          headerFormatter: (column, colIndex) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.contactPersonFilter}
                  onChange={e =>
                    this.handleFilterChange("contactPersonFilter", e)
                  }
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          headerAlign: "center",
          align: "center",
        },

        {
          dataField: "contact", // or "phone" depending on your data field name
          text: "Phone",
          sort: true,
          formatter: cell => <span>{cell || "-"}</span>, // shows phone or dash if empty
          headerFormatter: (column, colIndex) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.phoneFilter}
                  onChange={e => this.handleFilterChange("phoneFilter", e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          headerAlign: "center",
          align: "center",
        },
       
        {
          dataField: "comments",
          text: "Comments",
          formatter: (cell, row) => {
            const participantId = row.id; // or row.participant_id, etc.
              const organization_name = window.location.pathname.split("/")[1]; // dynamically extract org name
            return (
              <Link
                 to={{
        pathname: `/${organization_name}/csrcomments/${participantId}`,
        state: { fromSubmissionPage: true },
      }}
                title="Add/View Comments"
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#007bff",
                  }}
                >
                  <i className="fas fa-comments" />
                </button>
              </Link>
            );
          },

          headerAlign: "center",
          align: "center",
        },
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
checkRefreshAndFetch = () => {
  const shouldRefresh = this.props.location?.state?.shouldRefresh;

  if (shouldRefresh) {
    console.log("🔁 Refresh triggered via navigation state");
    this.fetchData();

    // Clear the state to avoid repeat triggering
    this.props.history.replace({
      ...this.props.location,
      state: {},
    });
  }
};

componentDidMount() {
  this.fetchData(); // 🔁 keep your existing fetch
  this.checkRefreshAndFetch(); // ✅ NEW: only fetch again if coming back with refresh flag
}

componentDidUpdate(prevProps) {
  // ✅ NEW: If coming back from comments page with refresh flag
  if (this.props.location !== prevProps.location) {
    this.checkRefreshAndFetch();
  }

  // ✅ KEEP this: update state if Redux list changes
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
    const { nameFilter, idFilter, emailFilter, contactPersonFilter, phoneFilter, provinceFilter, cityFilter,districtFilter } = this.state;

    if (!Array.isArray(RoundParticipantlist)) {
      return []; // Return empty array if not an array
    }

    return RoundParticipantlist.filter(entry => {
    const name = typeof entry.name === "string" ? entry.name.toLowerCase() : "";
    const id = entry.id ? entry.id.toString() : "";
    const email = typeof entry.email === "string" ? entry.email.toLowerCase() : "";
    const contactPerson = typeof entry.contact_person === "string" ? entry.contact_person.toLowerCase() : "";
    const phone = typeof entry.phone === "string" ? entry.phone.toLowerCase() : "";
    const province = typeof entry.province === "string" ? entry.province.toLowerCase() : "";
    const city = typeof entry.city === "string" ? entry.city.toLowerCase() : "";
    const district = typeof entry.district === "string" ? entry.district.toLowerCase() : "";

    return (
      name.includes(nameFilter.toLowerCase()) &&
      id.includes(idFilter) &&
      email.includes(emailFilter.toLowerCase()) &&
      contactPerson.includes(contactPersonFilter.toLowerCase()) &&
      phone.includes(phoneFilter.toLowerCase()) &&
      province.includes(provinceFilter.toLowerCase()) &&
      city.includes(cityFilter.toLowerCase()) &&
      district.includes(districtFilter.toLowerCase())
    );
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

    // const {
    //   idFilter,
    //   nameFilter,
    //   emailFilter,
    //   contactPersonFilter,
    //   phoneFilter,
    //   provinceFilter,
    //   cityFilter,
    //   districtFilter,
    // } = this.state;

    // return (
    //     id.includes(idFilter.toLowerCase()) &&
    //     samplename.includes(nameFilter.toLowerCase()) &&
    //     id.includes(idFilter) &&
    //     email.includes(emailFilter) &&
    //     contact_person_name.includes(contactPersonFilter) &&
    //     contact.includes(phoneFilter) &&
    //     province.includes(provinceFilter) &&
    //     city.includes(cityFilter) &&
    //     districtFilter.includes(districtFilter) 
    //   );

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
                  List of Participants Who have not Submitted Results for This
                  Round
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
                      data={this.filterData()}
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
                                  data={this.filterData()}
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

PendingSubmission2.propTypes = {
  match: PropTypes.object,
  RoundParticipantlist: PropTypes.array,
  roundDetails: PropTypes.object,
  history: PropTypes.object,
  ongetUnsubmittedparticipants: PropTypes.func,
   location: PropTypes.shape({
    state: PropTypes.shape({
      shouldRefresh: PropTypes.bool,
    }),
  }),
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
)(withRouter(PendingSubmission2));
