import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Table } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import moment from "moment";
import { getReport } from "store/resultsSubmit/actions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
  ReferenceLine,
} from "recharts";

class ReportParticipant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportDetails: {},
      selectedAnalyte: null, // Add selectedAnalyte here
      analyteData: [],
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.onGetReport(id);
  }

  componentDidUpdate(prevProps) {
    const { reportData } = this.props;
    const { selectedAnalyte } = this.state;

    if (prevProps.reportData !== reportData && reportData) {
      const participantId = this.props.match.params.id1;
      console.log("Report Data:", reportData);
      console.log("Looking for participantId:", participantId);

      const participantResults = reportData.participants_results.filter(
        result => result.participant_id == participantId
      );

      const zScoreChartData = reportData.participants_results
        .filter(result => result.analyte_name === selectedAnalyte)
        .map(result => ({
          name: `Participant ${result.participant_id}`,
          ZScore: result.z_score ? parseFloat(result.z_score) : null,
        }));

      console.log("Z-Score Chart Data:", zScoreChartData);

      // Get analyte summaries to retrieve accepted result count
      const analyteSummaries = reportData.analyte_result_summary || [];

      const analyteData = participantResults.map(result => {
        const isNotSubmitted = result.evaluation === "Not Submitted";

        return {
          analyteName: result.analyte_name || "",
          unit: result.unit || "--",
          instrument: result.instrument || "--",
          count: isNotSubmitted ? "--" : result.lab_count || "",
          result: isNotSubmitted ? "--" : result.result || "",
          mean: isNotSubmitted ? "--" : result.mean || "",
          CV: isNotSubmitted ? "--" : result.CV || "",
          robust_mean: isNotSubmitted ? "--" : result.robust_mean || "",
          robust_deviation: isNotSubmitted
            ? "--"
            : result.robust_deviation || "",
          robust_sd: isNotSubmitted ? "--" : result.robust_sd || "",
          upper_acceptability_limit: isNotSubmitted
            ? "--"
            : result.upper_acceptability_limit || "",
          lower_acceptability_limit: isNotSubmitted
            ? "--"
            : result.lower_acceptability_limit || "",
          zScore: isNotSubmitted ? "--" : result.z_score || "",
          evaluation: result.evaluation || "--", // Always shown
          acceptedResults: isNotSubmitted
            ? "--"
            : result.accepted_results || "",
          rejectedResults: isNotSubmitted
            ? "--"
            : result.rejected_results || "",
        };
      });

      let robust_mean = "--";
      let robust_sd = "--";
      if (participantResults.length > 0) {
        robust_mean = participantResults[0].robust_mean || "--";
        robust_sd = participantResults[0].robust_sd || "--";
      }

      const reportDetails = {
        round: reportData.round_name || "--",
        scheme: reportData.scheme_name || "--",
        issueDate: reportData.issue_date || "--",
        closingDate: reportData.closing_date || "--",
        printDate: moment(new Date()).format("DD MMM YYYY"),
        matrix: reportData.matrix || "--",
        cycle: reportData.cycle_no || "--",
        sample: reportData.sample || "--",
        robust_mean: reportData.robust_mean || "--",
        robust_sd: robust_sd,
      };

      // ✅ Update state with everything, including acceptedResults
      this.setState({ reportDetails, analyteData, zScoreChartData });
    }
  }

  handleAnalyteSelection = analyteName => {
    this.setState({ selectedAnalyte: analyteName });
  };

  // Utility function to group Z-scores into bins
  groupZScores = zScores => {
    const bins = [
      { range: "< -3.0", count: 0 },
      { range: "-3.0 to -2.0", count: 0 },
      { range: "-2.0 to -1.0", count: 0 },
      { range: "-1.0 to 0.0", count: 0 },
      { range: "0.0 to 1.0", count: 0 },
      { range: "1.0 to 2.0", count: 0 },
      { range: "2.0 to 3.0", count: 0 },
      { range: "> 3.0", count: 0 },
    ];

    zScores.forEach(score => {
      if (score < -3) {
        bins[0].count++;
      } else if (score >= -3 && score < -2) {
        bins[1].count++;
      } else if (score >= -2 && score < -1) {
        bins[2].count++;
      } else if (score >= -1 && score < 0) {
        bins[3].count++;
      } else if (score >= 0 && score < 1) {
        bins[4].count++;
      } else if (score >= 1 && score < 2) {
        bins[5].count++;
      } else if (score >= 2 && score < 3) {
        bins[6].count++;
      } else if (score > 3) {
        bins[7].count++;
      }
    });

    return bins;
  };

  render() {
    const { reportDetails, analyteData } = this.state;
    const { selectedAnalyte } = this.state; // Get selectedAnalyte from state
    // Step 3: Filter out invalid Z-scores
    // Make sure to declare this only once
    const filteredZScoreData = analyteData
      .filter(analyte =>
        selectedAnalyte
          ? analyte.analyteName.toLowerCase().trim() ===
            selectedAnalyte.toLowerCase().trim()
          : true
      )
      .flatMap(analyte =>
        this.props.reportData.participants_results
          .filter(result => result.analyte_name === analyte.analyteName)
          .map(result => ({
            name: `Participant ${result.participant_id}`,
            analyteName: analyte.analyteName,
            ZScore: result.z_score ? parseFloat(result.z_score) : null,
          }))
      )
      .filter(
        data =>
          data.ZScore !== null &&
          data.ZScore !== undefined &&
          !isNaN(data.ZScore)
      );
    const zScores = filteredZScoreData.map(data => data.ZScore);
    const groupedZScoreBins = this.groupZScores(zScores);

    if (!analyteData.length) {
      return (
        <Container
          fluid
          style={{
            paddingTop: "60px", // Adjust for header height
            paddingBottom: "40px", // Adjust for footer height
          }}
        >
          <Breadcrumbs title="Report" breadcrumbItem="Participant Report" />
          <p className="text-center text-danger">
            No data available for this participant.
          </p>
        </Container>
      );
    }

    return (
      <Container
        fluid
        style={{
          paddingTop: "80px", // Adjust for header height
          paddingBottom: "80px", // Adjust for footer height
          paddingLeft: "80px", // Add padding to the left side
          paddingRight: "80px", // Add padding to the right side
        }}
      >
        <style>
          {`
    @media print {
      /* Hide the navbar, footer, and breadcrumb */
      .navbar, .footer, .breadcrumb {
        display: none !important;
      }

      /* Ensure the page layout for printing is clean */
      body {
        margin: 0;
      }

      .container {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }

      /* Ensure the table has no borders during print */
      table {
        width: 100% !important;
        border: 1px solid #dee2e6;
        border-collapse: collapse;
      }

      th, td {
        padding: 8px;
        text-align: left;
      }

      /* Do not hide report-header during print */
      .report-header {
        display: block !important;
      }

      /* Optional: Adjust font size for print */
      .report-header h4, .report-header h6 {
        font-size: 12px;  /* Adjust the font size for printing */
      }

    }
  `}
        </style>

        <Breadcrumbs
          title="Report"
          breadcrumbItem="Participant Report"
          className="header"
        />

        {/* Add Print Button
      <button onClick={() => window.print()} className="btn btn-primary mb-4">
        Print Report
      </button> */}

        {/* Report Header */}
        <div className="report-header my-4">
          <h4
            className="text-center "
            style={{ fontWeight: "bold", color: "blue" }}
          >
            NHS - National External Quality Assessment Scheme
          </h4>
          <Row>
            <Row>
              {/* Left Column */}
              <Col md={6}>
                <Row className="mb-2">
                  <Col
                    xs={6}
                    className="text-end"
                    style={{ fontWeight: "bold", color: "black" }}
                  >
                    Participant Number:
                  </Col>
                  <Col xs={6} className="text-left" style={{ color: "blue" }}>
                    {this.props.match.params.id1}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col
                    xs={6}
                    className="text-end"
                    style={{ fontWeight: "bold", color: "black" }}
                  >
                    Issue Date:
                  </Col>
                  <Col xs={6} className="text-left" style={{ color: "blue" }}>
                    {reportDetails.issueDate}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col
                    xs={6}
                    className="text-end"
                    style={{ fontWeight: "bold", color: "black" }}
                  >
                    Closing Date:
                  </Col>
                  <Col xs={6} className="text-left" style={{ color: "blue" }}>
                    {reportDetails.closingDate}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col
                    xs={6}
                    className="text-end"
                    style={{ fontWeight: "bold", color: "black" }}
                  >
                    Print Date:
                  </Col>
                  <Col xs={6} className="text-left" style={{ color: "blue" }}>
                    {reportDetails.printDate}
                  </Col>
                </Row>
              </Col>

              {/* Right Column */}
              <Col md={6}>
                <Row className="mb-2">
                  <Col
                    xs={6}
                    className="text-end"
                    style={{ fontWeight: "bold", color: "black" }}
                  >
                    Scheme:
                  </Col>
                  <Col xs={6} className="text-left" style={{ color: "blue" }}>
                    {reportDetails.scheme}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col
                    xs={6}
                    className="text-end"
                    style={{ fontWeight: "bold", color: "black" }}
                  >
                    Cycle:
                  </Col>
                  <Col xs={6} className="text-left" style={{ color: "blue" }}>
                    {reportDetails.cycle}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col
                    xs={6}
                    className="text-end"
                    style={{ fontWeight: "bold", color: "black" }}
                  >
                    Round:
                  </Col>
                  <Col xs={6} className="text-left" style={{ color: "blue" }}>
                    {reportDetails.round}
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col
                    xs={6}
                    className="text-end"
                    style={{ fontWeight: "bold", color: "black" }}
                  >
                    Sample:
                  </Col>
                  <Col xs={6} className="text-left" style={{ color: "blue" }}>
                    {reportDetails.sample}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Row>
        </div>

        {/* Analyte Table */}
        <Table
          bordered
          style={{
            border: "1px solid #dee2e6",
            borderCollapse: "collapse",
            marginTop: "20px",
            marginBottom: "50px",
          }}
        >
          <thead>
            <tr className="text-center">
              {[
                "Analyte",
                "Unit",
                "Instrument",
                "Count",
                "Result",
                "Mean",
                "Z-Score",
                "RMZ",
                "Evaluation",
              ].map((header, idx) => (
                <th
                  key={idx}
                  style={{
                    border: "1px solid #dee2e6",
                    backgroundColor: "#D0F0FD", // Sky blue color
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {analyteData.map((analyte, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #dee2e6", textAlign: "left" }}>
                  {analyte.analyteName}
                </td>
                <td
                  style={{ border: "1px solid #dee2e6", textAlign: "center" }}
                >
                  {analyte.unit}
                </td>
                <td style={{ border: "1px solid #dee2e6", textAlign: "left" }}>
                  {analyte.instrument}
                </td>
                <td style={{ border: "1px solid #dee2e6" }}>{analyte.count}</td>
                <td style={{ border: "1px solid #dee2e6" }}>
                  {analyte.result}
                </td>
                <td style={{ border: "1px solid #dee2e6" }}>{analyte.mean}</td>
                <td style={{ border: "1px solid #dee2e6" }}>
                  {analyte.zScore}
                </td>
                <td style={{ border: "1px solid #dee2e6" }}>{analyte.CV}</td>
                <td
                  style={{
                    width: "12.5%",
                    border: "1px solid #dee2e6",
                    color:
                      analyte.evaluation === "Acceptable"
                        ? "green"
                        : analyte.evaluation === "Warning"
                        ? "blue"
                        : analyte.evaluation === "Rejected"
                        ? "red"
                        : "black", // fallback for "Not Submitted" or other values
                    fontWeight: "bold",
                  }}
                >
                  {analyte.evaluation}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Summary Section */}
        {/* Analyte Details: Dynamically rendered */}
        {/* Summary Section */}

        {/* Analyte Details: Dynamically rendered */}

        {analyteData
          .filter(analyte => analyte.result !== "--" && analyte.result !== "") // Filter out analytes without results
          .map((analyte, index) => (
            <div key={index} style={{ marginBottom: "40px" }}>
              {/* Analyte Name - Displayed Outside of the .analyte-box container */}
              <h3>{analyte.analyteName}</h3>

              <div
                className="analyte-box"
                style={{
                  display: "flex",
                  gap: "40px",
                  alignItems: "stretch",
                  flexWrap: "wrap",
                }}
              >
                {/* Table Section */}
                <div style={{ flex: "1 1 500px" }}>
                  <Table
                    bordered
                    style={{ borderCollapse: "collapse", marginBottom: "20px" }}
                  >
                    <tbody>
                      {/* Row 1 */}
                      <tr>
                        <td
                          style={{
                            width: "16.5%",
                            border: "1px solid #dee2e6",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          Robust Mean
                        </td>
                        <td
                          style={{
                            width: "16.5%",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          <strong>{analyte.robust_mean}</strong>
                        </td>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          Robust SD
                        </td>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          <strong>{analyte.robust_sd}</strong>
                        </td>
                      </tr>
                      {/* Row 3 */}
                      <tr>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          Accepted Results
                        </td>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          <strong>{analyte.acceptedResults}</strong>
                        </td>

                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          Rejected Results
                        </td>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          <strong>{analyte.rejectedResults}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                            backgroundColor: "#f0f0f0", // light gray
                          }}
                        >
                          Test Result
                        </td>

                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          <strong>{analyte.result}</strong>
                        </td>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          Robust Deviation
                        </td>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          <strong>{analyte.robust_deviation}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          Z-Score
                        </td>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          <strong>
                            {analyte.zScore !== undefined
                              ? analyte.zScore
                              : "--"}
                          </strong>
                        </td>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          CV (%)
                        </td>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          <strong>{analyte.CV}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          Upper Acceptability
                        </td>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          <strong>{analyte.upper_acceptability_limit}</strong>
                        </td>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          Lower Acceptability
                        </td>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          <strong>{analyte.lower_acceptability_limit}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          Evaluation
                        </td>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                            color:
                              analyte.evaluation === "Acceptable"
                                ? "green"
                                : analyte.evaluation === "Warning"
                                ? "blue"
                                : analyte.evaluation === "Rejected"
                                ? "red"
                                : "black", // fallback for "Not Submitted" or other values
                            fontWeight: "bold",
                          }}
                        >
                          {analyte.evaluation}
                        </td>

                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                            backgroundColor: "#f0f0f0",
                          }}
                        >
                          MU(Robust Mean)
                        </td>
                        <td
                          style={{
                            width: "12.5%",
                            border: "1px solid #dee2e6",
                          }}
                        >
                          <strong>{}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>

                {/* Graph Section */}
                <div
                  style={{
                    flex: "1 1 600px",
                    minWidth: "400px",
                    height: "100%",
                  }}
                >
                  {(() => {
                    const participantId = this.props.match.params.id1;

                    const allZScores =
                      this.props.reportData.participants_results
                        .filter(
                          result =>
                            result.analyte_name === analyte.analyteName &&
                            result.z_score !== null &&
                            !isNaN(result.z_score)
                        )
                        .slice(0, analyte.count)
                        .map(result => ({
                          name: ` ${result.participant_id}`,
                          id: result.participant_id,
                          ZScore: parseFloat(result.z_score),
                        }));

                    const zScores = allZScores.map(data => data.ZScore);
                    const groupedZScoreBins = this.groupZScores(zScores);

                    const currentZScore = allZScores.find(
                      p => p.id == participantId
                    )?.ZScore;

                    // Find the bin label where the current z-score falls
                    const currentBin = groupedZScoreBins.find(bin => {
                      const [min, max] = bin.range.split(" to ").map(Number);
                      return currentZScore >= min && currentZScore < max;
                    })?.range;

                    return allZScores.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={groupedZScoreBins}
                          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />

                          <XAxis
                            dataKey="range"
                            tickFormatter={tick => {
                              if (
                                tick === "< -3.0" ||
                                tick === "> 3.0" ||
                                tick === "-1.0 to 0.0"
                              ) {
                                return tick === "-1.0 to 0.0" ? "0" : tick;
                              }
                              return ""; // Hide all other labels
                            }}
                            label={{
                              value: "Z-Score",
                              position: "insideBottom",
                              offset: -5,
                              style: { textAnchor: "middle", fontSize: 14 },
                            }}
                            style={{ fontSize: "14px" }}
                          />

                          <YAxis
                            allowDecimals={false}
                            label={{
                              value: "Number of Participants",
                              angle: -90,
                              position: "insideLeft",
                              style: { textAnchor: "middle", fontSize: 14 },
                            }}
                          />
                          <Tooltip />
                          <Bar
                            dataKey="count"
                            fill="#3b82f6"
                            radius={[8, 8, 0, 0]}
                          />
                          {currentBin && (
                            <ReferenceLine
                              x={currentBin}
                              stroke="black"
                              strokeWidth={2}
                              label={{
                                position: "top",
                                fill: "black",
                                fontSize: 12,
                              }}
                            />
                          )}
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p style={{ color: "red" }}>
                        No Z-Score data available for this analyte.
                      </p>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
      </Container>
    );
  }
}

ReportParticipant.propTypes = {
  match: PropTypes.object,
  reportData: PropTypes.object,
  onGetReport: PropTypes.func,
};

ReportParticipant.defaultProps = {
  reportData: {},
};

const mapStateToProps = ({ ResultSubmit }) => ({
  reportData: ResultSubmit.Report || {},
});

const mapDispatchToProps = dispatch => ({
  onGetReport: id => dispatch(getReport(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReportParticipant));
