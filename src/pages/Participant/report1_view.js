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
  Legend,
  ResponsiveContainer,
  Label,
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
        const zScore = result.z_score || "--";
        const evaluation = result.evaluation || "--";
  
        const analyteSummary = analyteSummaries.find(
          summary => summary.analyte_id === result.analyte_id
        );
  
        return {
          analyteName: result.analyte_name || "--",
          unit: result.unit || "--",
          instrument: result.instrument || "--",
          count: result.lab_count || "--",
          result: result.result || "--",
          mean: result.mean || "--",
          CV: result.CV || "--",
          robust_mean: result.robust_mean || "--",
          robust_deviation: result.robust_deviation || "--",
          robust_sd: result.robust_sd || "--",
          upper_acceptability_limit: result.upper_acceptability_limit || "--",
          lower_acceptability_limit: result.lower_acceptability_limit || "--",
          zScore: zScore,
          evaluation: evaluation,
          acceptedResults: result.accepted_results || 0,  // Ensure this is included
          rejectedResults: result.rejected_results || 0,  // Ensure this is included
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
  
  handleAnalyteSelection = (analyteName) => {
    this.setState({ selectedAnalyte: analyteName });
  };
  
  render() {
    const { reportDetails, analyteData } = this.state;
    const { selectedAnalyte } = this.state;  // Get selectedAnalyte from state

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
   
// Ensure we filter the data based on selectedAnalyte BEFORE we process Z-Score data
const combinedZScoreData = analyteData
  .filter(analyte => selectedAnalyte ? analyte.analyteName.toLowerCase().trim() === selectedAnalyte.toLowerCase().trim() : true)  // Filter analyte data based on selectedAnalyte
  .map(analyte => {
    // Get filtered results for the current analyte
    const filteredResults = this.props.reportData.participants_results.filter(result => result.analyte_name === analyte.analyteName);

    console.log("Filtered results for analyte:", analyte.analyteName, filteredResults); // Debugging log

    return filteredResults.map(result => ({
      name: `Participant ${result.participant_id}`,
      analyteName: analyte.analyteName,
      ZScore: result.z_score ? parseFloat(result.z_score) : null,
    }));
  }).flat(); // Flatten the array to get all the results in one array

// Debugging: Check the combinedZScoreData
console.log("Combined Z-Score Data:", combinedZScoreData);

// Now, filter out any invalid Z-Scores (null, undefined, or NaN)
const filteredZScoreData = combinedZScoreData.filter(
  data => data.ZScore !== null && data.ZScore !== undefined && !isNaN(data.ZScore)
);

console.log("Filtered Z-Score Data:", filteredZScoreData);



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
    <Col xs={6} className="text-end" style={{ fontWeight: "bold", color: "black" }}>Participant Number:</Col>
    <Col xs={6} className="text-left" style={{ color: "blue" }}>{this.props.match.params.id1}</Col>
  </Row>
  <Row className="mb-2">
    <Col xs={6} className="text-end" style={{ fontWeight: "bold", color: "black" }}>Issue Date:</Col>
    <Col xs={6} className="text-left" style={{ color: "blue" }}>{reportDetails.issueDate}</Col>
  </Row>
  <Row className="mb-2">
    <Col xs={6} className="text-end" style={{ fontWeight: "bold", color: "black" }}>Closing Date:</Col>
    <Col xs={6} className="text-left" style={{ color: "blue" }}>{reportDetails.closingDate}</Col>
  </Row>
  <Row className="mb-2">
    <Col xs={6} className="text-end" style={{ fontWeight: "bold", color: "black" }}>Print Date:</Col>
    <Col xs={6} className="text-left" style={{ color: "blue" }}>{reportDetails.printDate}</Col>
  </Row>
</Col>


  {/* Right Column */}
  <Col md={6}>
  <Row className="mb-2">
    <Col xs={6} className="text-end" style={{ fontWeight: "bold", color: "black" }}>Scheme:</Col>
    <Col xs={6} className="text-left" style={{ color: "blue" }}>{reportDetails.scheme}</Col>
  </Row>
  <Row className="mb-2">
    <Col xs={6} className="text-end" style={{ fontWeight: "bold", color: "black" }}>Cycle:</Col>
    <Col xs={6} className="text-left" style={{ color: "blue" }}>{reportDetails.cycle}</Col>
  </Row>
  <Row className="mb-2">
    <Col xs={6} className="text-end" style={{ fontWeight: "bold", color: "black" }}>Round:</Col>
    <Col xs={6} className="text-left" style={{ color: "blue" }}>{reportDetails.round}</Col>
  </Row>
  <Row className="mb-2">
    <Col xs={6} className="text-end" style={{ fontWeight: "bold", color: "black" }}>Sample:</Col>
    <Col xs={6} className="text-left" style={{ color: "blue" }}>{reportDetails.sample}</Col>
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
                <td style={{ border: "1px solid #dee2e6", textAlign: "center" }}>
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
            <div
              className="analyte-box"
              key={index}
              style={{
                marginBottom: "40px",
                display: "flex",
                gap: "40px",
                alignItems: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {/* Table Section */}
              <div style={{ flex: "1 1 500px" }}>
                <h3>{analyte.analyteName}</h3>
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
                        style={{ width: "16.5%", border: "1px solid #dee2e6" }}
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
                        style={{ width: "12.5%", border: "1px solid #dee2e6" }}
                      >
                        <strong>{analyte.robust_sd}</strong>
                      </td>
                    </tr>
                    {/* Row 3 */}
                    <tr>
                    <td style={{ width: "12.5%", border: "1px solid #dee2e6", backgroundColor: "#f0f0f0" }}>
  Accepted Results
</td>
<td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
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
                        style={{ width: "12.5%", border: "1px solid #dee2e6" }}
                      >
                        <strong>{analyte.rejected_results}</strong>
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
                        style={{ width: "12.5%", border: "1px solid #dee2e6" }}
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
                        style={{ width: "12.5%", border: "1px solid #dee2e6" }}
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
                        style={{ width: "12.5%", border: "1px solid #dee2e6" }}
                      >
                        <strong>
                          {analyte.zScore !== undefined ? analyte.zScore : "--"}
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
                        style={{ width: "12.5%", border: "1px solid #dee2e6" }}
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
                        style={{ width: "12.5%", border: "1px solid #dee2e6" }}
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
                        style={{ width: "12.5%", border: "1px solid #dee2e6" }}
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
                        style={{ width: "12.5%", border: "1px solid #dee2e6" }}
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
                  height: "500px",
                }}
              >
                
                {filteredZScoreData.length > 0 ? (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      barSize={30}
      data={filteredZScoreData}
      margin={{ top: 20, right: 30, left: 30, bottom: 50 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" style={{ fontSize: "14px" }} />
      <YAxis style={{ fontSize: "14px" }} />
      <Tooltip />
      <Legend wrapperStyle={{ fontSize: "14px" }} />
      <Bar dataKey="ZScore" fill="#82ca9d" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
) : (
  <p style={{ color: "red" }}>No Z-Score data available for this analyte.</p>
)}

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

