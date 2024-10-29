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
import { Bar } from "react-chartjs-2";
import "assets/scss/table.scss";
import { getSchemeAnalytesList } from "store/results/actions";
import { getReport, getSereologyResult } from "store/resultsSubmit/actions";
import "assets/scss/table.scss";

class Results extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      SchemeAnalytesList: [],
      Report: [],
      SerologyResult: [],
      zScoresData: {}, // Store the fetched z-scores data
      combinedData: [], // Store the combined data here
      totalScore: "",
      possibleScore: "",
      accuracy: 0,
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
          text: "Your Result",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div
              className="text-start"
              style={{
                color:
                  analyte.result_type === "Not Submitted" ? "red" : "inherit",
              }}
            >
              {analyte.result_type}
            </div>
          ),
        },
        {
          text: "Expected Result",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.serology_type}</div>
          ),
        },
        {
          text: "Score",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.score}</div>
          ),
        },
      ],
    };
  }
  // combineData = (analytes, report, serologyResults) => {
  //   let totalScore = 0; // Initialize total score
  //   let possibleScore = 0; // Initialize possible score
  //   return analytes.map(analyte => {
  //     const resultEntry = report.find(
  //       result =>
  //         result.analyte_id === analyte.id &&
  //         result.account_id === this.state.user_id
  //     );

  //     const labCount = resultEntry?.lab_count || 0;
  //     const instrument = resultEntry?.instrument || "";
  //     const result_type = resultEntry?.result_type || "Not Submitted";

  //     // Find matching serology results based on analyte_id and round_id
  //     const matchingSerologyResults = serologyResults.filter(
  //       serology =>
  //         serology.analyte_id === analyte.id &&
  //         serology.round_id === this.props.round_id
  //     );
  //     // Determine the serology type with the highest value
  //     let serologyType = "N/A"; // Default if no match is found
  //     let score = 0; // Initialize score
  //     if (matchingSerologyResults.length > 0) {
  //       const highestValueSerology = matchingSerologyResults.reduce(
  //         (prev, curr) =>
  //           parseFloat(curr.value) > parseFloat(prev.value) ? curr : prev
  //       );
  //       serologyType = highestValueSerology.type;

  //       // Calculate the score based on expected and actual results
  //       if (serologyType === result_type) {
  //         // If expected result matches your result
  //         score = parseFloat(highestValueSerology.value);
  //         totalScore += score; // Add to total score
  //       } else if (result_type === "Equivocal") {
  //         // If result is Equivocal but doesn't match expected result
  //         score = 1;
  //         totalScore += score; // Add to total score
  //       } else {
  //         // If result is incorrect and not Equivocal
  //         score = 0;
  //       }
  //       // Calculate possible score (sum of expected results)
  //       if (result_type && result_type !== "Not Submitted") {
  //         possibleScore += parseFloat(highestValueSerology.value || 0);
  //         console.log("possibleScore", possibleScore);
  //     }
  //     }

  //     return {
  //       ...analyte,
  //       lab_count: labCount,
  //       instrument: instrument,
  //       result_type: result_type,
  //       serology_type: serologyType,
  //       score: score,
  //     };
  //   });
  // };
  combineData = (analytes, report, serologyResults) => {
    let totalScore = 0; // Initialize total score
    let possibleScore = 0; // Initialize possible score
    const combinedData = analytes.map(analyte => {
      const resultEntry = report.find(
        result =>
          result.analyte_id === analyte.id &&
          result.account_id === this.state.user_id
      );

      const labCount = resultEntry?.lab_count || 0;
      const instrument = resultEntry?.instrument || "";
      const result_type = resultEntry?.result_type || "Not Submitted";

      // Find matching serology results based on analyte_id and round_id
      const matchingSerologyResults = serologyResults.filter(
        serology =>
          serology.analyte_id === analyte.id &&
          serology.round_id === this.props.round_id
      );

      // Determine the serology type with the highest value
      let serologyType = "N/A"; // Default if no match is found
      let score = 0; // Initialize score
      if (matchingSerologyResults.length > 0) {
        const highestValueSerology = matchingSerologyResults.reduce(
          (prev, curr) =>
            parseFloat(curr.value) > parseFloat(prev.value) ? curr : prev
        );
        serologyType = highestValueSerology.type;

        // Calculate the score based on expected and actual results
        if (serologyType === result_type) {
          score = parseFloat(highestValueSerology.value);
          totalScore += score; // Add to total score
        } else if (result_type === "Equivocal") {
          score = 1;
          totalScore += score; // Add to total score
        } else {
          score = 0;
        }

        // Calculate possible score (sum of expected results)
        if (result_type && result_type !== "Not Submitted") {
          possibleScore += parseFloat(highestValueSerology.value || 0);
        }
      }

      return {
        ...analyte,
        lab_count: labCount,
        instrument: instrument,
        result_type: result_type,
        serology_type: serologyType,
        score: score,
      };
    });
    // Calculate accuracy
    possibleScore = Math.max(possibleScore, 1); // Prevent division by zero
    const accuracy = (totalScore / possibleScore) * 100;
    return { combinedData, totalScore, possibleScore, accuracy  };
  };

  componentDidMount() {
    console.log("userid", this.state.user_id);
    const { onGetSchemeAnalyte, onGetReport, onGetSereologyResult } =
      this.props;

    const id = this.props.match.params.id;
    onGetSchemeAnalyte(id);
    onGetReport(id);
    onGetSereologyResult(id);
  }

  componentDidUpdate(prevProps) {
    const { SchemeAnalytesList, Report, SerologyResult } = this.props;
    if (
      (SchemeAnalytesList !== prevProps.SchemeAnalytesList ||
        Report !== prevProps.Report ||
        SerologyResult !== prevProps.SerologyResult) &&
      !isEmpty(SchemeAnalytesList) &&
      !isEmpty(Report) &&
      !isEmpty(SerologyResult)
    ) {
      const { combinedData, totalScore, possibleScore, accuracy  } = this.combineData(
        SchemeAnalytesList,
        Report,
        SerologyResult
      );

      // Check if the combinedData is different from the current state
      if (
        JSON.stringify(combinedData) !== JSON.stringify(this.state.combinedData)
      ) {
        // Only update state if the data has changed
        this.setState({ combinedData, totalScore, possibleScore, accuracy  });
      }
    }
  }
  render() {
    const { rounds, issue_date, closing_date } = this.props;
    const { combinedData, totalScore, possibleScore, accuracy  } = this.state;
    // Count total analytes and submitted results
    const totalAnalytes = combinedData.length; // Total number of analytes
    const submittedResultsCount = combinedData.filter(
      analyte => analyte.result_type !== "Not Submitted"
    ).length; // Count of submitted results

    const participant_id = this.props.match.params.id1;
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
                    {/* Add the note below the table */}
                    <div className="mt-3" style={{ color: "#6C48C5" }}>
                      You have submitted results for{" "}
                      <strong>{submittedResultsCount}</strong> analytes out of
                      total <strong>{totalAnalytes}</strong> analytes.
                      <div>
                        Your TOTAL SCORE is <strong>{totalScore}</strong> out of
                        a possible score of <strong>{possibleScore}</strong>
                      </div>
                      <div>Your accuracy is <strong>{accuracy.toFixed(2)}%</strong></div> {/* Display accuracy */}

                    </div>
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

Results.propTypes = {
  match: PropTypes.object,
  className: PropTypes.any,

  SchemeAnalytesList: PropTypes.array,
  Report: PropTypes.array,
  SerologyResult: PropTypes.array,

  rounds: PropTypes.number,
  round_id: PropTypes.number,
  sample: PropTypes.string,
  issue_date: PropTypes.string,
  closing_date: PropTypes.string,
  onGetSchemeAnalyte: PropTypes.func,
  onGetReport: PropTypes.func,
  onGetSereologyResult: PropTypes.func,
};

const mapStateToProps = ({ SchemeAnalytesList, ResultSubmit }) => ({
  SchemeAnalytesList: SchemeAnalytesList.SchemeAnalytesList,
  rounds: SchemeAnalytesList.rounds,
  sample: SchemeAnalytesList.sample,
  round_id: SchemeAnalytesList.round_id,
  issue_date: SchemeAnalytesList.issue_date,
  closing_date: SchemeAnalytesList.closing_date,
  Report: ResultSubmit.Report,
  SerologyResult: ResultSubmit.SerologyResult,
});

const mapDispatchToProps = dispatch => ({
  onGetSchemeAnalyte: id => dispatch(getSchemeAnalytesList(id)),
  onGetReport: id => dispatch(getReport(id)),
  onGetSereologyResult: id => dispatch(getSereologyResult(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Results));
