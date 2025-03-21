import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Col, Container, Row, Alert } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

// Import actions
import { 
  getRoundParticipantlist,
  deleteRoundParticipant,
} from "store/rounds/actions";
import "assets/scss/table.scss";

class RoundParticipantlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: '',
      idFilter: '',
      selectedCheckboxes: {}, // Track checked checkboxes
      tableKey: 0,
      RoundParticipantlist: [],
      feedbackMessage: '',
      errorMessage: '', // State for error message
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
          dataField: "name",
          text: "Participants",
          sort: true,
          formatter: (cell, row) => (typeof cell === "string" ? cell : "Unknown"), // Fallback for invalid data
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
          headerAlign: "center",
          align: "left",
        }
        ,
        {
          dataField: "delete",
          text: "Remove",
          formatter: (cell, row) => (
            <span
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => this.onDeleteRoundParticipant(this.props.roundDetails.round_id, row.id)}


            >
              ❌
            </span>
          ),
          
          headerAlign: "center",
          align: "center",
          headerStyle: { width: '80px' }, // Adjust width if needed
        },
      ],
    };
    // Bind the transformParticipantData method
    this.transformParticipantData = this.transformParticipantData.bind(this);
    this.onDeleteRoundParticipant  = this.onDeleteRoundParticipant .bind(this);
  }

  // Transformation logic for participant data
  transformParticipantData(participantList) {
    // Example transformation logic
    return participantList.map((participant) => ({
      ...participant,
      fullName: `${participant.firstName || "Unknown"} ${participant.lastName || ""}`,
    }));
  }

  componentDidMount() {
    // Fetch data when the component mounts
    this.fetchData();
  }
 
  
  
  componentDidUpdate(prevProps) {
    if (prevProps.RoundParticipantlist !== this.props.RoundParticipantlist) {
      if (typeof this.transformParticipantData === "function") {
        const transformedData = this.transformParticipantData(this.props.RoundParticipantlist);
        console.log("Transformed Participant Data:", transformedData);
        
        // Check if the transformed data is a valid array
        if (Array.isArray(transformedData)) {
          console.log("Transformed data is a valid array.");
        } else {
          console.error("Transformed data is not an array.");
        }
        
        this.setState({ RoundParticipantlist: transformedData });
      } else {
        console.error("transformParticipantData is not defined or not a function");
      }
    }
  }
  
  onDeleteRoundParticipant(round_id, participant_id) {
    if (!window.confirm("Are you sure you want to delete this participant?")) {
        return;
    }

    try {
        this.props.onDeleteRoundParticipant(round_id, participant_id)
            .then(() => {
                console.log(`Participant with ID ${participant_id} deleted.`);

                // ✅ Ensure only the deleted participant is removed
                this.props.deleteParticipantFromLabRound(participant_id);
            });
    } catch (error) {
        console.error("Error removing participant:", error);
    }
}

  fetchData() {
    const { onGetRoundParticipantList } = this.props;
    const RoundParticipantId = this.props.match.params?.id; // Use optional chaining
    if (!RoundParticipantId) {
      console.error("RoundParticipantId not found in URL parameters");
    } else {
      console.log("Fetching data for ID:", RoundParticipantId);
      onGetRoundParticipantList({ id: RoundParticipantId }); // Pass as an object
    }
  }
  
  

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

 

  filterData = () => {
    const { RoundParticipantlist } = this.state;  // Now using the state instead of props
    const { nameFilter, idFilter } = this.state;

    if (!Array.isArray(RoundParticipantlist)) {
      return []; // Return empty array if not an array
    }

    const filteredData = RoundParticipantlist.filter(entry => {
      const name = typeof entry.name === "string" ? entry.name.toLowerCase() : "";
      const id = entry.id ? entry.id.toString() : "";

      return (
        name.includes(nameFilter.toLowerCase()) &&
        id.includes(idFilter)
      );
    });

    return filteredData;
  };

  render() {
    const { RoundParticipantlist, roundDetails } = this.props;
    console.log("RoundParticipantlist in renderrrrrrr:", RoundParticipantlist);  // Add this log
  
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
            <title>Database Admin | Round Participant List</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="List" breadcrumbItem="Round Participant List" />

            {/* Display round details below the breadcrumbs */}
           

            {roundDetails ? (
  <div className="round-details">
    <h4>Round Details:</h4>
    <p className="round-details-text">
      <span className="me-3">Round Number: <strong>{roundDetails.rounds || "No Round Number"}</strong></span>
      <span className="me-3">Scheme Name: <strong>{roundDetails.scheme_name || "No Scheme Name"}</strong></span>
      <span className="me-3">Cycle Number: <strong>{roundDetails.cycle_no || "No Cycle Number"}</strong></span>
      <span className="me-3">Cycle Start Date: <strong>{formatDate(roundDetails.issue_date) || "No Start Date"}</strong></span>
      <span className="me-3">Cycle End Date: <strong>{formatDate(roundDetails.closing_date) || "No End Date"}</strong></span>
      <span className="me-3">Round Start Date: <strong>{roundDetails.round_start_to_end ? formatDate(roundDetails.round_start_to_end.split(' to ')[0]) : "No Round Start Date"}</strong></span>
      <span className="me-3">Round End Date: <strong>{roundDetails.round_start_to_end ? formatDate(roundDetails.round_start_to_end.split(' to ')[1]) : "No Round End Date"}</strong></span>
    </p>
  </div>
) : (
  <div>No round details available.</div>
)}




            <Row className="justify-content-center">
              <Col lg="4">
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
                                  data={this.filterData()}
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

RoundParticipantlist.propTypes = {
  match: PropTypes.object,
  RoundParticipantlist: PropTypes.array,
  roundDetails: PropTypes.object,
  history: PropTypes.object,
  onGetRoundParticipantList: PropTypes.func,
  onDeleteRoundParticipant: PropTypes.func.isRequired,
  deleteParticipantFromLabRound: PropTypes.func.isRequired,  // ✅ Added this line
};

const mapStateToProps = (state) => {
  console.log("Redux State - roundDetails:", state.RoundList?.roundDetails);  // ✅ Add this log
  return {
    roundDetails: state.RoundList?.roundDetails || {},
    RoundParticipantlist: state.RoundList?.RoundParticipantlist || [],
  };
};
const mapDispatchToProps = (dispatch) => ({
  onGetRoundParticipantList: (id) => dispatch(getRoundParticipantlist(id)),
  onDeleteRoundParticipant: (roundId, participantId) => dispatch(deleteRoundParticipant(roundId, participantId)),

  // ✅ Ensure it's mapped properly
  deleteParticipantFromLabRound: (participantId) => dispatch({
      type: "REMOVE_PARTICIPANT_FROM_LAB_ROUND",
      payload: participantId
  }),
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(RoundParticipantlist));