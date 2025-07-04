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
// import { Bar } from "react-chartjs-2";
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
          headerClasses: "text-center", // Center header text
          classes: "text-center", // Center cell text
          formatter: (cellContent, analyte) => (
            <div className="text-center">{analyte.name}</div>
          ),
        },
        {
          text: "Instrument",
          sort: true,
          headerClasses: "text-center",
          classes: "text-center",
          formatter: (cellContent, analyte) => (
            <div className="text-center">{analyte.instrument}</div>
          ),
        },
        {
          text: "No of Participants",
          sort: true,
          headerClasses: "text-center",
          classes: "text-center",
          formatter: (cellContent, analyte) => (
            <div className="text-center">{analyte.lab_count}</div>
          ),
        },
        {
          text: "Your Result",
          headerClasses: "text-center",
          classes: "text-center",
          formatter: (cellContent, analyte) => {
            const resultText =
              analyte.result_type === "Not Submitted"
                ? "Not Submitted"
                : analyte.value || "No Result";
            return <div className="text-center">{resultText}</div>;
          },
        },
        {
          text: "Expected Result",
          headerClasses: "text-center",
          classes: "text-center",
          formatter: (cellContent, analyte) => (
            <div className="text-center">{analyte.expected_type || "N/A"}</div>
          ),
        },
        {
          text: "Score",
          headerClasses: "text-center",
          classes: "text-center",
          formatter: (cellContent, analyte) => (
            <div className="text-center">{analyte.score}</div>
          ),
        },
      ],
    };
  }
  combineData = (analytes, report, serologyResults) => {
    const analyteResultSummary =
      this.props.Report?.analyte_result_summary || [];

    let totalScore = 0;
    let possibleScore = 0;

    const combinedData = analytes.map(analyte => {
      const resultEntry = report.find(
        result =>
          result?.analyte_id === analyte.id &&
          result?.account_id === this.state.user_id
      );

      const summaryEntry = analyteResultSummary.find(
        summary => Number(summary.analyte_id) === Number(analyte.id)
      );

      const labCount = summaryEntry?.lab_count || 0;
      const instrument = resultEntry?.instrument || "";
      const result_type =
        resultEntry?.result != null ? "Submitted" : "Not Submitted";
      const result_value = resultEntry?.result || "";
      const score = resultEntry?.score || 0;

      if (result_type === "Submitted") {
        totalScore += score;
        possibleScore += 5;
      }

      const expectedType = resultEntry?.expected_result_type || "Not Available";
      const expectedValue = resultEntry?.expected_result_value || "N/A";
      const expectedResult = `${expectedType} (value: ${expectedValue})`; // 👈 Combine both

      return {
        ...analyte,
        lab_count: labCount,
        instrument,
        result_type,
        result_value,
        value: resultEntry?.qualitative_result_type || "",
        score,
        expected_type: expectedType,
        expected_value: expectedValue,
        expected_result: expectedResult, // ✅ This is what you'll use in your table
      };
    });

    possibleScore = Math.max(possibleScore, 1);
    const accuracy = (totalScore / possibleScore) * 100;

    return { combinedData, totalScore, possibleScore, accuracy };
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
      console.log("🔍 SchemeAnalytesList:", SchemeAnalytesList);
      console.log("📄 Report from API:", Report);
      console.log("🧪 SerologyResult:", SerologyResult);
      const { combinedData, totalScore, possibleScore, accuracy } =
        this.combineData(
          SchemeAnalytesList,
          Report.participants_results || [], // ✅ Use actual array
          SerologyResult
        );

      if (
        JSON.stringify(combinedData) !== JSON.stringify(this.state.combinedData)
      ) {
        this.setState({ combinedData, totalScore, possibleScore, accuracy });
      }
    }
  }

  render() {
    const { rounds, issue_date, closing_date } = this.props;
    const { combinedData, totalScore, possibleScore, accuracy } = this.state;
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
                className="d-flex flex-wrap align-items-center gap-5 px-4 py-3 ms-4"
                style={{ color: "#6C48C5" }}
              >
                <div className="d-flex align-items-center">
                  <span className="me-2 fw-bold">Participant No:</span>
                  <span className="fw-bold">{participant_id}</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-2 fw-bold">Round:</span>
                  <span className="fw-bold">{rounds ? rounds : "N/A"}</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-2 fw-bold">Sample:</span>
                  <span className="fw-bold">{this.props.sample}</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-2 fw-bold">Issue Date:</span>
                  <span className="fw-bold">
                    {moment(issue_date).format("DD MMM YYYY, h:mm A")}
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-2 fw-bold">Closing Date:</span>
                  <span className="fw-bold">
                    {moment(closing_date).format("DD MMM YYYY, h:mm A")}
                  </span>
                </div>
              </Col>
            </Row>

            <Row>
              <Col></Col>
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
                      <div>
                        Your accuracy is <strong>{accuracy.toFixed(2)}%</strong>
                      </div>{" "}
                      {/* Display accuracy */}
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
  sample: ResultSubmit.Report?.sample || "",
  round_id: SchemeAnalytesList.round_id,
  issue_date: SchemeAnalytesList.issue_date,
  closing_date: SchemeAnalytesList.closing_date,
  Report: ResultSubmit.Report, // ✅ important: keep it as an object
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
