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
  getRoundParticipantlist
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
      ],
    };
  }

  componentDidMount() {
    // Fetch data when the component mounts
    this.fetchData();
  }
  componentDidUpdate(prevProps) {
    console.log("componentDidUpdate triggered");
  
    // Check if the participant list in props has changed
    if (this.props.RoundParticipantlist !== prevProps.RoundParticipantlist) {
      console.log("New Props Round Participant List:", this.props.RoundParticipantlist);
  
      // Validate the participant list
      if (Array.isArray(this.props.RoundParticipantlist) && this.props.RoundParticipantlist.length > 0) {
        const transformedData = this.props.RoundParticipantlist.map((participant, index) => ({
          id: participant.id || index + 1, // Participant ID
          name: participant.name || "Unnamed Participant", // Participant Name
        }));
  
        console.log("Transformed Participant Data:", transformedData);
  
        // Update the state with transformed data
        this.setState({ RoundParticipantlist: transformedData, tableKey: this.state.tableKey + 1 });
      } else {
        // Clear the list if it's empty or invalid
        this.setState({ RoundParticipantlist: [] });
      }
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
    const { RoundParticipantlist } = this.state;
    console.log("Participant Scheme List",RoundParticipantlist);
    const defaultSorted = [{ dataField: "id", order: "desc" }];
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Round Participant List</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="List" breadcrumbItem="Round Participant List" />
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
  history: PropTypes.object,
  // onGetSchemeAnalyte: PropTypes.func,
  onGetRoundParticipantList: PropTypes.func,
};
const mapStateToProps = (state) => {
    console.log("Redux State in mapStateToProps:", state); // Debug the entire Redux state
  
    return {
      RoundParticipantlist: state.RoundList?.RoundParticipantlist || [], // Access the correct state slice
    };
  };
  


const mapDispatchToProps = (dispatch, ownProps) => ({
  
    onGetRoundParticipantList: (id) => dispatch(getRoundParticipantlist(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(RoundParticipantlist));