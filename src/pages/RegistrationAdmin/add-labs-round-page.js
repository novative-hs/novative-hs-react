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
          text: "id",
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
          formatter: (cellContent, row) => (
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`checkbox${row.id}`}
                onChange={() => this.handleCheckboxChange(row.id)}
                style={{ cursor: "pointer" }}
                checked={this.state.selectedCheckboxes[row.id] || false} // Check based on selectedCheckboxes state
              />
            </div>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    const { organization_name } = this.props.match.params;
    this.setState({ organization_name });
    // Fetch data when the component mounts
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    // Update selectedCheckboxes when LabRoundList changes
    if (prevProps.LabRoundList !== this.props.LabRoundList) {
      this.updateSelectedCheckboxes();
    }
  }

  fetchData()  {
    const { ongetParticipantRoundlist, onGetRoundLabs } = this.props;
    const roundId = this.props.match.params.id;
    console.log("ffffffffffff", roundId)
    if (roundId) {
      onGetRoundLabs(roundId);
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

  updateSelectedCheckboxes() {
    const selectedCheckboxes = {};
    const { LabRoundList } = this.props;

    if (LabRoundList && Array.isArray(LabRoundList)) {
        LabRoundList.forEach(id => {
            selectedCheckboxes[id] = true; // Assuming LabRoundList is an array of IDs
        });
    }

    this.setState({ selectedCheckboxes });
}

  handleSave = () => {
    const { selectedCheckboxes } = this.state;
    const { onUpdateRoundLabs, match, ParticipantList, history } = this.props;
    const roundId = match.params.id;

    const selectedParticipants = ParticipantList.filter(participant => selectedCheckboxes[participant.id]);
    
    if (selectedParticipants.length === 0) {
      // Display validation message if no labs are selected
      this.setFeedbackMessage("Please select Participants.");
      return;
    }

    if (roundId) {
      const payload = {
        id: roundId,
        participants: selectedParticipants.map(participant => participant.id)  // Map to only participant IDs
      };

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
      console.error("Lab ID not found");
    }
  };

  setFeedbackMessage = (message) => {
    this.setState({ feedbackMessage: message }, () => {
      // Optionally, clear the message after a few seconds
      setTimeout(() => {
        this.setState({ feedbackMessage: '' });
      }, 3000); // 3 seconds
    });
  };

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  handleCheckboxChange = (id) => {
    this.setState(prevState => ({
      selectedCheckboxes: {
        ...prevState.selectedCheckboxes,
        [id]: !prevState.selectedCheckboxes[id]
      }
    }));
  };

  filterData = () => {
    const { ParticipantList } = this.props;
    const { nameFilter, idFilter, selectedCheckboxes } = this.state;

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

    return filteredData;
  };

  render() {
    const { ParticipantList } = this.props;
    const defaultSorted = [{ dataField: "id", order: "desc" }];

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Participants List</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="List" breadcrumbItem="Participants List" />
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
  LabRoundList: PropTypes.array,
  onGetRoundLabs: PropTypes.func,
  ongetParticipantRoundlist: PropTypes.func,
  onAddNewRoundLabs: PropTypes.func,
  onUpdateRoundLabs: PropTypes.func,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  ParticipantList: state.ParticipantList?.ParticipantList,
  LabRoundList: state.ParticipantList?.LabRoundList || [],
});

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
