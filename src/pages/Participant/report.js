import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import { Card, CardBody, Col, Container, Row, Button } from "reactstrap";
import { isEmpty, sample } from "lodash";
import moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import { Bar } from 'react-chartjs-2';
import "assets/scss/table.scss";
import { getSchemeAnalytesList } from "store/results/actions";
import { getReport } from "store/resultsSubmit/actions";
import "assets/scss/table.scss";

class Results extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      SchemeAnalytesList: [],
      Report: [],
      zScoresData: {}, // Store the fetched z-scores data
      combinedData: [], // Store the combined data here
      // analyte: "",
      // rounds: [],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      columnsList: [
        {
          text: "Analyte",
          dataField: "name",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.name}</div>
          ),
        },
        {
          text: "Unit",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.unit}</div>
          ),
        },
        {
          text: "Instrument",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.instrument}</div>
          ),
        },
        {
          text: "Count",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.lab_count}</div>
          ),
        },
        {
          text: "Result",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.result}</div>
          ),
        },
        {
          text: "Result After Conversion",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.result_afterconversion}</div>
          ),
        },
        {
          text: "Mean",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.mean}</div>
          ),
        },
        {
          text: "Z-Score",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.z_score}</div>
          ),
        },
        {
          text: "Evaluation",
          sort: true,
          formatter: (cellContent, analyte) => (
            <>
              {analyte.result_evaluation === "Reject" ? (
                <div className="text-start text-danger">{analyte.result_evaluation}</div>
              ) : analyte.result_evaluation === "Warning" ? (
                <div className="text-start" style={{ backgroundColor: "orange", color: "white" }}>
                  {analyte.result_evaluation}
                </div>
              ) : (
                <div className="text-start">{analyte.result_evaluation}</div>
              )}
            </>
          ),
        },
        {
          text: "Accepted Results",
          dataField: "accepted_results",  // New field for accepted results
          sort: true,
          formatter: (cellContent, analyte) => (
              <div className="text-start">{analyte.accepted_results}</div>
          ),
      },
      {
          text: "Rejected Results",
          dataField: "rejected_results",  // New field for rejected results
          sort: true,
          formatter: (cellContent, analyte) => (
              <div className="text-start">{analyte.rejected_results}</div>
          ),
      },
        
      ],
    };
  }
  combineData = (analytes, report) => {
    return analytes.map(analyte => {
      // Find the result entry for the current analyte
      const resultEntry = report.find(
        result =>
          result.analyte_id === analyte.id &&
          result.account_id === this.state.user_id
      );
  
      const labCount = resultEntry?.lab_count || 0;
      const unit = resultEntry?.unit || 0;
      const instrument = resultEntry?.instrument || 0;
      const result = resultEntry?.result || 0;
      const result_afterconversion = resultEntry?.result_afterconversion || 0;
      const mean = resultEntry?.mean || 0;
      const CV = resultEntry?.CV || 0;
  
      // Get the z_scores_with_lab array
      const zScoresArray = resultEntry?.z_scores_with_lab || [];
      // Initialize counts for accepted and rejected results
      let acceptedCount = 0;
      let rejectedCount = 0;
  
      // Find the z_score for the specific participant (based on participant_id)
      const zScoreEntry = zScoresArray.find(
        zScore => zScore.lab_id === resultEntry?.participant_id
      );
  
      // Check if zScoreEntry is valid and an array
      if (Array.isArray(zScoresArray) && zScoreEntry) {
        // Check the result evaluation for each zScoreEntry directly
        zScoresArray.forEach(item => {
          // Count based on result_evaluation
          if (item.result_evaluation === "Accepted") {
            acceptedCount++;
          } else if (item.result_evaluation === "Reject") {
            rejectedCount++;
          }
        });
        
        // Extract the z_score if the participant's entry is found
        const zScore = zScoreEntry.z_score || 0;
        const Evaluation = zScoreEntry.result_evaluation || "Not Submitted";
        
        return {
          ...analyte,
          lab_count: labCount,
          unit: unit,
          instrument: instrument,
          result: result,
          mean: mean,
          result_afterconversion: result_afterconversion,
          CV: CV,
          z_score: zScore,
          result_evaluation: Evaluation,
          accepted_results: acceptedCount, 
          rejected_results: rejectedCount, 
        };
      } else {
        // Handle the case where zScoreEntry is not valid
        return {
          ...analyte,
          lab_count: labCount,
          unit: unit,
          instrument: instrument,
          result: result,
          mean: mean,
          result_afterconversion: result_afterconversion,
          CV: CV,
          z_score: 0,
          result_evaluation: "Not Submitted",
          accepted_results: acceptedCount, 
          rejected_results: rejectedCount, 
        };
      }
    });
  };
  componentDidMount() {
    console.log("userid", this.state.user_id);
    const { onGetSchemeAnalyte, onGetReport } = this.props;

    const id = this.props.match.params.id;
    onGetSchemeAnalyte(id);
    onGetReport(id);
  }

  componentDidUpdate(prevProps) {
    const { SchemeAnalytesList, Report } = this.props;
    if (
      (SchemeAnalytesList !== prevProps.SchemeAnalytesList ||
        Report !== prevProps.Report) &&
      !isEmpty(SchemeAnalytesList) &&
      !isEmpty(Report)
    ) {
      // Combine the data
      const combinedData = this.combineData(SchemeAnalytesList, Report);

      // Check if the combinedData is different from the current state
      if (
        JSON.stringify(combinedData) !== JSON.stringify(this.state.combinedData)
      ) {
        // Only update state if the data has changed
        this.setState({ combinedData });
      }
    }
  }
  // Function to fetch Z-Scores data from the API
  fetchZScores = async (analyte_id) => {
    const { user_id } = this.state;
    const round_id = this.props.match.params.id; // Accessing round_id directly from params

    console.log("Fetching Z-Scores with the following parameters:");
    console.log("Analyte ID:", analyte_id);
    console.log("User ID:", user_id);
    console.log("Raw Round ID:", round_id); // Logging round_id to ensure it's correct

    // Convert round_id to a number
    const roundIdNumber = parseInt(round_id, 10); // or use +round_id

    // Check if conversion was successful
    if (isNaN(roundIdNumber)) {
      console.error("Conversion to number failed. round_id:", round_id);
      return []; // Handle this case as needed
    }

    console.log("Converted Round ID:", roundIdNumber); // This will now print as a number

    try {
      const response = await fetch(`https://externalqcapi.com/api/lab/AnalyteZScoreChart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ analyte_id, user_id, round_id: roundIdNumber }) // Use roundIdNumber here
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorResponse}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      return data.z_scores;
    } catch (error) {
      console.error("Error fetching z-scores:", error);
      return [];
    }
  };

  // Function to group Z-scores into ranges for chart display
  groupZScores = (zScores) => {
    // Define groups for Z-scores
    const groups = {
      '< -3': 0,
      '-3 to -2.5': 0,
      '-2.5 to -2': 0,
      '-2 to -1.5': 0,
      '-1.5 to -1': 0,
      '-1 to -0.5': 0,
      '-0.5 to 0': 0,
      '0 to 0.5': 0,
      '0.5 to 1': 0,
      '1 to 1.5': 0,
      '1.5 to 2': 0,
      '2 to 2.5': 0,
      '2.5 to 3': 0,
      '> 3': 0
    };

    zScores.forEach(({ z_score }) => {
      if (z_score < -3) {
        groups['< -3'] += 1;
      } else if (z_score >= -3 && z_score < -2.5) {
        groups['-3 to -2.5'] += 1;
      } else if (z_score >= -2.5 && z_score < -2) {
        groups['-2.5 to -2'] += 1;
      } else if (z_score >= -2 && z_score < -1.5) {
        groups['-2 to -1.5'] += 1;
      } else if (z_score >= -1.5 && z_score < -1) {
        groups['-1.5 to -1'] += 1;
      } else if (z_score >= -1 && z_score < -0.5) {
        groups['-1 to -0.5'] += 1;
      } else if (z_score >= -0.5 && z_score < 0) {
        groups['-0.5 to 0'] += 1;
      } else if (z_score >= 0 && z_score < 0.5) {
        groups['0 to 0.5'] += 1;
      } else if (z_score >= 0.5 && z_score < 1) {
        groups['0.5 to 1'] += 1;
      } else if (z_score >= 1 && z_score < 1.5) {
        groups['1 to 1.5'] += 1;
      } else if (z_score >= 1.5 && z_score < 2) {
        groups['1.5 to 2'] += 1;
      } else if (z_score >= 2 && z_score < 2.5) {
        groups['2 to 2.5'] += 1;
      } else if (z_score >= 2.5 && z_score < 3) {
        groups['2.5 to 3'] += 1;
      } else if (z_score >= 3) {
        groups['> 3'] += 1;
      }
    });

    return groups;
  };


  renderChart = (groups, combinedData) => {
    const zScores = combinedData.map(analyte => analyte.z_score); // Create an array of z-scores for comparison

    const data = {
        labels: Object.keys(groups),
        datasets: [{
            label: 'Number of Participants',
            data: Object.values(groups),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
      
    };
    const options = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Participants',
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Z-Score Ranges',
                },
            }
        }
    };

    return (
        <>
            <Bar data={data}  options={options} />
        </>
    );
};

  render() {
    const { rounds, issue_date, closing_date } = this.props;
    // const { combinedData } = this.state; // Use the combined data
    const { combinedData, zScoresData } = this.state;

    const participant_id = this.props.match.params.id1
    const defaultSorted = [
      {
        dataField: "analyte_name",
        order: "desc",
      },
    ];

    return (
      <React.Fragment>
        <style>
          {`
          .table thead th {
            background-color: #6C48C5;
            // background-color: #C68FE6;
            color: white; /* White text for contrast */
          }
          .table td {
            text-align: left !important; /* Use this if necessary */
          }
          `}
        </style>
        <div className="page-content">
          <MetaTags>
            <title></title>
          </MetaTags>
          <Container fluid>
            <Row className="mb-3">
              <Col
                className="d-flex flex-wrap justify-content-md-around justify-content-sm-start  p-3 "
                style={{ color: "#6C48C5" }}
              >
                <div className="d-flex flex-column flex-md-row align-items-start  mb-2 mb-md-0 p-2">
                  <span className="me-2 font-weight-bold">Round:</span>
                  <span>{rounds ? rounds : "N/A"}</span>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-start  mb-2 mb-md-0 p-2">
                  <span className="me-2">Issue Date:</span>
                  <span>
                    {moment(issue_date).format("DD MMM YYYY, h:mm A")}
                  </span>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-start  mb-2 mb-md-0 p-2">
                  <span className="me-2">Closing Date:</span>
                  <span>
                    {moment(closing_date).format("DD MMM YYYY, h:mm A")}
                  </span>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-start  mb-2 mb-md-0 p-2">
                  <span className="me-2">Participant No:</span>
                  <span>{participant_id}</span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div style={{ color: "#6C48C5", marginLeft: "100px" }}>
                  Sample:<span className="ms-2">{this.props.sample} </span>
                </div>{" "}
              </Col>
            </Row>
            <Row className="justify-content-center align-item-center">
              <Col lg="10">
                <Card>
                  <CardBody>
                    <div className="table-responsive">
                      <BootstrapTable
                        id="printable-table"
                        keyField="id"
                        ref={this.node}
                        responsive
                        bordered={false}
                        striped={false}
                        defaultSorted={defaultSorted}
                        classes={
                          "table table-bordered table-hover table-striped table-primary"
                        }
                        data={combinedData}
                        columns={this.state.columnsList}
                      // Remove pagination-related props
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            {/* New Section for Separate Tables */}
            <Row className="justify-content-center">
              <Col lg="10">
                {combinedData.map((analyte, index) => {
                  // Check if Z-Scores are already fetched for this analyte
                  const zScores = zScoresData[analyte.id];

                  // Fetch Z-Scores if they haven't been fetched yet
                  if (!zScores) {
                    this.fetchZScores(analyte.id, analyte.rounds).then(zScores => {
                      // Update state with the fetched Z-Scores
                      this.setState(prevState => ({
                        zScoresData: { ...prevState.zScoresData, [analyte.id]: zScores }
                      }));
                    });
                  }

                  return (
                    <Card key={index} className="mb-4">
                      <CardBody>
                        <table className="table table-bordered table-striped table-hover text-left">
                          <thead className="thead-dark">
                            <tr>
                              <th>Participant Number</th>
                              <th>Test Result</th>
                              <th>Analyte Name</th>
                              <th>Z-Score</th>
                              <th>Coefficient of Variance (CV)</th>
                              <th>Evaluation</th>

                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{participant_id}</td>
                              <td>{analyte.result}</td>
                              <td>{analyte.name}</td>
                              <td>{analyte.z_score}</td>
                              <td>{analyte.CV}</td>
                              <td>{analyte.result_evaluation}</td>
                            </tr>
                          </tbody>
                        </table>
                        {/* Render Z-Scores chart if available */}
                        {zScores ? (
                          this.renderChart(this.groupZScores(zScores), combinedData)
                        ) : (
                          <p>Loading Z-Scores...</p> // Optionally show a loading message
                        )}
                      </CardBody>
                    </Card>
                  );
                })}
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

Results.propTypes = {
  match: PropTypes.object,
  className: PropTypes.any,

  SchemeAnalytesList: PropTypes.array,
  Report: PropTypes.array,

  rounds: PropTypes.number,
  sample: PropTypes.string, 
  issue_date: PropTypes.string,
  closing_date: PropTypes.string,
  onGetSchemeAnalyte: PropTypes.func,
  onGetReport: PropTypes.func,
};

const mapStateToProps = ({ SchemeAnalytesList, ResultSubmit }) => ({
  SchemeAnalytesList: SchemeAnalytesList.SchemeAnalytesList,
  rounds: SchemeAnalytesList.rounds,
  sample: SchemeAnalytesList.sample,
  issue_date: SchemeAnalytesList.issue_date,
  closing_date: SchemeAnalytesList.closing_date,
  Report: ResultSubmit.Report,
});

const mapDispatchToProps = dispatch => ({
  onGetSchemeAnalyte: id => dispatch(getSchemeAnalytesList(id)),
  onGetReport: id => dispatch(getReport(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Results));
