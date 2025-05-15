import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import Breadcrumbs from "components/Common/Breadcrumb";
import { getAnalyteResultParticipant } from "store/results/actions";
import "assets/scss/table.scss";

class StatisticParticipant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participantData: [],
      analyteName: "",
      idFilter: "",
      nameFilter: "",
       // Will hold filtered participants
    };
  }

  componentDidMount() {
    const { roundId, analyteId } = this.props.match.params;
    if (roundId && analyteId) {
      this.props.onGetAnalyteResultParticipant(roundId, analyteId);
    } else {
      console.error("roundId or analyteId missing in URL parameters");
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.getAnalyteResultParticipant !==
      prevProps.getAnalyteResultParticipant
    ) {
      this.setParticipantsFromProps();
    }
  }

  setParticipantsFromProps = () => {
    const { getAnalyteResultParticipant } = this.props; // full API response (array of rounds)
    const { roundId, analyteId } = this.props.match.params;

    const roundData = getAnalyteResultParticipant.find(
      (item) => item.round_id === Number(roundId)
    );

    if (!roundData) {
      this.setState({ participantData: [] });
      return;
    }

const analyteData = roundData.analytes.find(
  (a) => a.analyte_id === Number(analyteId)
);

if (!analyteData) {
  this.setState({ participantData: [], analyteName: "" });
  return;
}

const participants = analyteData.participants.map((p) => ({
  id: p.id,
  participant_name: p.name,
}));

this.setState({
  participantData: participants,
  analyteName: analyteData.analyte_name || "", // set analyte name
});
  }

  handleFilterChange = (field, event) => {
    this.setState({ [field]: event.target.value });
  };

  resetFilters = () => {
    this.setState({
      idFilter: "",
      nameFilter: "",
    });
  };

  getFilteredData = () => {
    const { idFilter, nameFilter, participantData } = this.state;

    return participantData.filter((item) => {
      const matchId = item.id
        .toString()
        .toLowerCase()
        .includes(idFilter.toLowerCase());
      const matchName = item.participant_name
        .toLowerCase()
        .includes(nameFilter.toLowerCase());
      return matchId && matchName;
    });
  };
  // Formatter for Participant ID - bold text
  participantIdFormatter = (cell) => <strong>{cell}</strong>;

  // Formatter for Participant Name - blue text
  participantNameFormatter = (cell) => (
    <span style={{ color: "blue" }}>{cell}</span>
  );

  render() {
    const columns = [
{
  dataField: "id",
  text: "ID",
  sort: true,
  formatter: (cell, row) => <strong>{cell}</strong>,
 headerFormatter: (column) => (
  <>
    <div>
      <input
        type="text"
        value={this.state.idFilter}
        onChange={(e) => this.handleFilterChange("idFilter", e)}
        className="form-control"
      />
    </div>
    <div style={{ textAlign: "center", marginTop: "4px" }}>
      {column.text}
    </div>
  </>
),

  
  headerStyle: { width: '50px' },
  style: { width: '50px' },
},

{
  dataField: "participant_name",
  text: "Participant Name",
  sort: true,
  formatter: (cell) => <span style={{ color: "blue" }}>{cell}</span>,
  headerFormatter: (column) => (
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
  align: "center",
   headerStyle: { width: '50px' },
  style: { width: '50px' },
}

    ];

    const defaultSorted = [{ dataField: "id", order: "asc" }];

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Statistic Participants</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs
              title="List"
              breadcrumbItem="Participants List"
            />
            <Row className="justify-content-center">
             
        <h5>
      Analyte:{" "}
      <span className="text-primary">{this.state.analyteName}</span> 
      {/* ID: <span className="text-muted">{this.props.match.params.analyteId}</span> */}
      
    </h5>
              <Col lg="10">
                <Card>
                  <CardBody>
                    <ToolkitProvider
                      keyField="id"
                      data={this.state.participantData}
                      columns={columns}
                      search
                    >
                      {(toolkitprops) => (
                        <div className="table-responsive">
                          
                          <BootstrapTable
                            {...toolkitprops.baseProps}
                            bordered={false}
                            striped
                            hover
                            condensed
                            defaultSorted={defaultSorted}
                            filter={filterFactory()}
                          />
                        </div>
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

StatisticParticipant.propTypes = {
  match: PropTypes.object.isRequired,
  getAnalyteResultParticipant: PropTypes.array.isRequired,
  onGetAnalyteResultParticipant: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const analyteResultParticipant =
    state.SchemeAnalytesList?.getAnalyteResultParticipant || [];
  return {
    getAnalyteResultParticipant: analyteResultParticipant,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onGetAnalyteResultParticipant: (roundId, analyteId) => {
    dispatch(getAnalyteResultParticipant(roundId, analyteId));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StatisticParticipant));
