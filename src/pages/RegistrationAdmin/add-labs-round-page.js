import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Tooltip from "@material-ui/core/Tooltip";

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

// Import actions
import { 
  getParticipantRoundList, 
  getRoundLablist, 
  addNewRoundLablist, 
  updateRoundLablist 
} from "store/participant-list/actions";
import "assets/scss/table.scss";
import { Hidden } from "@material-ui/core";

class RoundAddParticipant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      organization_name: "",
      nameFilter: '',
      idFilter: '',
      selectedCheckboxes: {}, // Track checked checkboxes
      tableKey: 0,
      LabRoundList: [],
      feedbackMessage: '',
      user_id: localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : "",
      feedbackListColumns: [
        {
          text: "Participant ID",
          dataField: "id",
          sort: true,
          headerFormatter: (column, colIndex) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.idFilter}
                  onChange={e => this.handleFilterChange('idFilter', e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          headerStyle: { width: '100px' },
          style: { width: '100px' },
        },
        {
          text: "ID",
          dataField: "AccountID",
          sort: true,
          hidden: true,
          formatter: (cellContent, round) => <>{round.AccountID}</>,
         
        },
        {
          dataField: "name",
          text: "Participants",
          sort: true,
          headerFormatter: (column, colIndex) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.nameFilter}
                  onChange={e => this.handleFilterChange('nameFilter', e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>

            </>
          ),
          headerAlign: 'center',
          align: 'left',
          formatter: (cellContent, round) => {
            return (
              <Tooltip title="View Results">
                <Link
                  to={`/${this.state.organization_name}/UpdateParticipantsResults/${this.props.match.params.id}?participantID=${round.AccountID}`}
                  style={{ textDecoration: "underline", color: "#008000" }}
                >
                  <div>{round.name}</div> {/* Corrected to use round.name */}
                </Link>
              </Tooltip>
            );
          }
        },
        
        {
          dataField: "checkbox",
          text: "Select",
          formatter: (cellContent, row) => {
            console.log(`🔘 Rendering checkbox for ID: ${row.id}, Checked: ${this.state.selectedCheckboxes[row.id] || false}`);
            return (
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`checkbox${row.id}`}
                  onChange={() => this.handleCheckboxChange(row.id)}
                  checked={this.state.selectedCheckboxes[row.id] || false}
                  style={{ cursor: "pointer" }}
                />
              </div>
            );
          },
        },
      ],
    };
  }

  componentDidMount() {
    const { organization_name } = this.props.match.params;
    this.setState({ organization_name });
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    // Update selectedCheckboxes when LabRoundList changes
    if (prevProps.LabRoundList !== this.props.LabRoundList) {
      console.log("componentDidUpdate: LabRoundList updated. Previous:", prevProps.LabRoundList, "Current:", this.props.LabRoundList);
      console.log("ParticipantList in Component:", this.props.ParticipantList);
      this.updateSelectedCheckboxes();
    }

    if (prevProps.ParticipantList !== this.props.ParticipantList) {
      console.log("✅ ParticipantList updated in componentDidUpdate", this.props.ParticipantList);
      this.updateSelectedCheckboxes();
    }
  }
//   componentDidUpdate(prevProps) {
//     if (prevProps.RoundList !== this.props.RoundList) {
//         console.log("componentDidUpdate: RoundList updated. Updating checkboxes.");
//         this.updateSelectedCheckboxes();
//     }
// }


  fetchData()  {
    const { ongetParticipantRoundlist, onGetRoundLabs } = this.props;
    const roundId = this.props.match.params.id;
    console.log("fetchData: Fetching data for roundId:", roundId);
    if (roundId) {
      onGetRoundLabs(roundId);
      console.log("fetchData: Called onGetRoundLabs.");
      ongetParticipantRoundlist(roundId);
        console.log("fetchData: Called ongetParticipantRoundlist.");
    } else {
      console.error("round ID not found in URL parameters");
    }
    if (roundId) {
      console.log("User ID found:", roundId);
      ongetParticipantRoundlist(roundId);
    } else {
      console.error("User ID not found in localStorage");
    }
  }

//   updateSelectedCheckboxes() {
//     const selectedCheckboxes = {};
//     const { LabRoundList } = this.props;

//     console.log("updateSelectedCheckboxes: Updating checkboxes with LabRoundList:", LabRoundList);

//     if (LabRoundList && Array.isArray(LabRoundList)) {
//         LabRoundList.forEach(participantId => {
//             selectedCheckboxes[participantId] = true; // Mark as checked
//         });
//     }

//     console.log("updateSelectedCheckboxes: New selectedCheckboxes state:", selectedCheckboxes);

//     this.setState({ selectedCheckboxes });
// }
updateSelectedCheckboxes() {
  const selectedCheckboxes = {};
  const { ParticipantList } = this.props; // Use ParticipantList here

  console.log("🚀 Running updateSelectedCheckboxes...");
  console.log("📝 Full ParticipantList:", JSON.stringify(ParticipantList, null, 2));

  if (ParticipantList && Array.isArray(ParticipantList)) {
    ParticipantList.forEach(participant => {
      console.log(`🔍 Checking participant ID: ${participant.id}, auto_selected: ${participant.auto_selected}`);
      if (participant.auto_selected) {  
        console.log(`✅ Participant ID ${participant.id} is auto-selected. Marking checkbox as checked.`);
        selectedCheckboxes[participant.id] = true;
      }
    });
  }

  console.log("🎯 Final selectedCheckboxes state before update:", selectedCheckboxes);

  this.setState({ selectedCheckboxes, tableKey: this.state.tableKey + 1 }, () => {
    console.log("📌 State updated! New selectedCheckboxes:", this.state.selectedCheckboxes);
  });
}

  handleSave = () => {
    const { selectedCheckboxes } = this.state;
    const { onUpdateRoundLabs, match, ParticipantList, history } = this.props;
    const roundId = match.params.id;
    console.log("handleSave: Saving selected checkboxes. Selected:", selectedCheckboxes);

    const selectedParticipants = ParticipantList.filter(participant => selectedCheckboxes[participant.id]);
    
    if (selectedParticipants.length === 0) {
      console.warn("handleSave: No participants selected.");
      // Display validation message if no labs are selected
      this.setFeedbackMessage("Please select Participants.");
      return;
    }

    if (roundId) {
      const payload = {
        id: roundId,
        participants: selectedParticipants.map(participant => participant.id)  // Map to only participant IDs
      };
      console.log("handleSave: Payload prepared for saving:", payload);

      // Determine if we are adding or updating based on roundId presence
      if (roundId) {
        // If roundId exists, we are updating
        onUpdateRoundLabs(payload);
        this.setFeedbackMessage("Labs updated successfully.");
      } else {
        // Otherwise, we are adding new
        // Call your add new method here if needed
        // this.props.onAddNewRoundLabs(payload, someOtherId); 
        this.setFeedbackMessage("Labs added successfully.");
      }
      history.push(`/${this.state.organization_name}/round`);
    } else {
      console.error("handleSave: roundId not found.");
    }
  };

  setFeedbackMessage = (message) => {
    console.log("setFeedbackMessage: Setting feedback message:", message);
    this.setState({ feedbackMessage: message }, () => {
      // Optionally, clear the message after a few seconds
      setTimeout(() => {
        console.log("setFeedbackMessage: Clearing feedback message.");
        this.setState({ feedbackMessage: '' });
      }, 3000); // 3 seconds
    });
  };

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  handleCheckboxChange = (id) => {
    console.log("handleCheckboxChange: Toggling checkbox for id:", id);
    this.setState(prevState => ({
      selectedCheckboxes: {
        ...prevState.selectedCheckboxes,
        [id]: !prevState.selectedCheckboxes[id]
      }
    }), () => {
      console.log("handleCheckboxChange: Updated selectedCheckboxes state:", this.state.selectedCheckboxes);
  });
  };


  filterData = () => {
    const { ParticipantList } = this.props;
    const { nameFilter, idFilter, selectedCheckboxes } = this.state;

    // Log the initial state of inputs and ParticipantList
    console.log("filterData: Filtering data with nameFilter:", nameFilter, "idFilter:", idFilter);
    console.log("filterData: Original ParticipantList:", ParticipantList);

    if (!ParticipantList || ParticipantList.length === 0) {
        console.warn("filterData: ParticipantList is empty. No data to filter.");
        return [];
    }

    // Perform the filtering
    const filteredData = ParticipantList.filter(entry => {
        const name = entry.name ? entry.name.toString().toLowerCase() : "";
        const id = entry.id ? entry.id.toString() : "";

        return (
            name.includes(nameFilter.toLowerCase()) &&
            id.includes(idFilter)
        );
    }).map(entry => ({
        ...entry,
        checkbox: (
            <div className="form-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id={`checkbox${entry.id}`}
                    onChange={() => this.handleCheckboxChange(entry.id)}
                    style={{ cursor: "pointer" }}
                    checked={selectedCheckboxes[entry.id] || false}
                />
            </div>
        )
    }));

    // Log the filtered results
    console.log("filterData: Filtered data:", filteredData);

    return filteredData;
};




  render() {
    const { ParticipantList, roundDetails } = this.props;
    const defaultSorted = [{ dataField: "id", order: "desc" }];

      // Use roundDetails for breadcrumb
   const formatDate = (date) => {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };
  
  const breadcrumbItem = roundDetails
    ? `Round Number: ${roundDetails.rounds || "No Round Number"}, 
       Scheme Name: ${roundDetails.scheme_name || "No Scheme Name"}, 
       Cycle Number: ${roundDetails.cycle_no || "No Cycle Number"}, 
       Cycle Start Date: ${formatDate(roundDetails.issue_date) || "No Start Date"}, 
       Cycle End Date: ${formatDate(roundDetails.closing_date) || "No End Date"}, 
       Round Start Date: ${roundDetails.round_start_to_end ? formatDate(roundDetails.round_start_to_end.split(' to ')[0]) : "No Round Start Date"}, 
     Round End Date: ${roundDetails.round_start_to_end ? formatDate(roundDetails.round_start_to_end.split(' to ')[1]) : "No Round End Date"}`
    : "No Data Available";
  
  console.log("Generated Breadcrumb Item:", breadcrumbItem);
  
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Participants List</title>
          </MetaTags>
          <Container fluid>
           <Breadcrumbs title="List" breadcrumbItem="Round Participant List" />

 {/* Display round details below the breadcrumbs */}
           
     {roundDetails ? (
              <div className="round-details">
                <h4 className="text-primary text-center">
                  List of Participants Who Submit Results for This Round
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
              <Col lg="5">
                <Card>
                  <CardBody>
                    <Row>
                      <Col className="pagination pagination-rounded justify-content-center mb-2">
                        {this.state.feedbackMessage && (
                          <div className="alert alert-danger" role="alert">
                            {this.state.feedbackMessage}
                          </div>
                        )}
                      </Col>
                    </Row>
                    <ToolkitProvider
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={ParticipantList}
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
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="pagination pagination-rounded justify-content-end mb-2">
                              <button
                                onClick={this.handleSave}
                                className="btn btn-primary btn-block mb-4"
                                style={{ background: "#0000CD" }}
                              >
                                Save
                              </button>
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

RoundAddParticipant.propTypes = {
  match: PropTypes.object,
  ParticipantList: PropTypes.array,
  roundDetails: PropTypes.object,
  LabRoundList: PropTypes.array,
  onGetRoundLabs: PropTypes.func,
  ongetParticipantRoundlist: PropTypes.func,
  onAddNewRoundLabs: PropTypes.func,
  // RoundDetails: PropTypes.object,
  onUpdateRoundLabs: PropTypes.func,
  data: PropTypes.array,
  RoundList: PropTypes.array,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  console.log("Redux State in mapStateToProps:", state);
  console.log("ParticipantList in Redux State:", state.ParticipantList);
  console.log("LabRoundList in Redux State:", state.ParticipantList?.LabRoundList);
  

  return {
      ParticipantList: state.ParticipantList?.ParticipantList || [],
      // RoundDetails: state.ParticipantList?.RoundDetails || {}, // Map round details
      LabRoundList: state.ParticipantList?.LabRoundList || [],
      roundDetails: state.ParticipantList?.roundDetails || {}, // Ensure correct mapping
      data: state.ParticipantList?.data || [], // Map `data` field from Redux state
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetRoundLabs: id => dispatch(getRoundLablist(id)),
  ongetParticipantRoundlist: (id) => dispatch(getParticipantRoundList(id)),
  onAddNewRoundLabs: (createRoundLab, id) => dispatch(addNewRoundLablist(createRoundLab, id)),
  onUpdateRoundLabs: (roundslab) => dispatch(updateRoundLablist(roundslab)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(RoundAddParticipant));