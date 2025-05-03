import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Container, Row, Col, Table } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import moment from "moment";
import { getReport } from "store/resultsSubmit/actions";

class ReportParticipant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportDetails: {},
      analyteData: [],
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.onGetReport(id);
  }

  componentDidUpdate(prevProps) {
    const { reportData } = this.props;

    if (prevProps.reportData !== reportData && reportData) {
      console.log("Report Data:", reportData);

      const participantId = this.props.match.params.id1;
      
      // Add a console log to inspect data
      console.log("Looking for participantId:", participantId);
      
      // Fix filter logic here: compare correctly
      const participantResults = reportData.participants_results.filter(
        result => result.participant_id == participantId  // Change to '==' or ensure both are the same type
      );

      const analyteData = participantResults.map(result => {
        const zScore = result.z_score || "N/A";
        const evaluation = result.evaluation || "N/A";
        const rmz = result.CV || result.CV || "N/A";

        return {
          analyteName: result.analyte_name || "N/A",
          unit: result.unit || "N/A",
          instrument: result.instrument || "N/A",
          count: result.lab_count || "N/A",
          result: result.result || "N/A",
          mean: result.mean || "N/A",
          CV: result.CV || "N/A",
          robust_mean: result.robust_mean || "N/A",
          zScore: zScore,
          // rmz: rmz,
          evaluation: evaluation,
        };
      });

      // Extract robustMean and robustSD from participantResults
      let robust_mean = "N/A";
      let robustSD = "N/A";

      if (participantResults.length > 0) {
        robust_mean = participantResults[0].robust_mean || "N/A";
        robustSD = participantResults[0].robust_sd || "N/A";
      }

      const reportDetails = {
        round: reportData.round_name || "N/A",
        scheme: reportData.scheme_name || "N/A",
        issueDate: reportData.issue_date || "N/A",
        closingDate: reportData.closing_date || "N/A",
        printDate: moment(new Date()).format("DD MMM YYYY"),
        matrix: reportData.matrix || "N/A",  // Check if this exists in the reportData
        cycle: reportData.cycle_no || "N/A", // Make sure 'cycle_no' exists
        sample: reportData.sample || "N/A", // Make sure 'sample' exists
        robust_mean: reportData.robust_mean || "N/A",
        robustSD: robustSD,
      };

      // Update state with report details and analyte data
      this.setState({ reportDetails, analyteData });
    }
  }


  render() {
    const { reportDetails, analyteData } = this.state;

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
  <Col>
    <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>
      <span style={{ color: "black" }}>Participant Number: </span>
      <span style={{ color: "blue" }}>
        {this.props.match.params.id1}
      </span>
    </h6>

    <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>
      <span style={{ color: "black" }}>Issue Date: </span>
      <span style={{ color: "blue" }}>{reportDetails.issueDate}</span>
    </h6>

    <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>
      <span style={{ color: "black" }}>Closing Date: </span>
      <span style={{ color: "blue" }}>{reportDetails.closingDate}</span>
    </h6>

    <h6 style={{ fontWeight: "bold", marginBottom: "10px" }}>
      <span style={{ color: "black" }}>Print Date: </span>
      <span style={{ color: "blue" }}>{reportDetails.printDate}</span>
    </h6>
  </Col>

  <Col className="text-right">
  <h6 style={{ fontWeight: "bold", marginBottom: "10px", textAlign: "right" }}>
  <span style={{ color: "black" }}>Round: </span>
  <span style={{ color: "blue" }}>{reportDetails.round}</span>
</h6>
<h6 style={{ fontWeight: "bold", marginBottom: "10px", textAlign: "right" }}>
  <span style={{ color: "black" }}>Scheme: </span>
  <span style={{ color: "blue" }}>{reportDetails.scheme}</span>
</h6>
<h6 style={{ fontWeight: "bold", marginBottom: "10px", textAlign: "right" }}>
  <span style={{ color: "black" }}>Cycle: </span>
  <span style={{ color: "blue" }}>{reportDetails.cycle}</span>
</h6>
<h6 style={{ fontWeight: "bold", marginBottom: "10px", textAlign: "right" }}>
  <span style={{ color: "black" }}>Sample: </span>
  <span style={{ color: "blue" }}>{reportDetails.sample}</span>
</h6>

  </Col>
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
      {["Analyte", "Unit", "Instrument", "Count", "Result", "Mean", "Z-Score", "RMZ", "Evaluation"].map((header, idx) => (
        <th
          key={idx}
          style={{
            border: "1px solid #dee2e6",
            backgroundColor:  "#D0F0FD" // Sky blue color
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
        <td style={{ border: "1px solid #dee2e6", textAlign: "left" }}>{analyte.analyteName}</td>
        <td style={{ border: "1px solid #dee2e6", textAlign: "left" }}>{analyte.unit}</td>
        <td style={{ border: "1px solid #dee2e6", textAlign: "left" }}>{analyte.instrument}</td>
        <td style={{ border: "1px solid #dee2e6" }}>{analyte.count}</td>
        <td style={{ border: "1px solid #dee2e6" }}>{analyte.result}</td>
        <td style={{ border: "1px solid #dee2e6" }}>{analyte.mean}</td>
        <td style={{ border: "1px solid #dee2e6" }}>{analyte.zScore}</td>
        <td style={{ border: "1px solid #dee2e6" }}>{analyte.CV}</td>
        <td style={{ border: "1px solid #dee2e6" }}>{analyte.evaluation}</td>
      </tr>
    ))}
  </tbody>
</Table>

        {/* Summary Section */}
        {/* Analyte Details: Dynamically rendered */}
        {/* Summary Section */}

        {/* Analyte Details: Dynamically rendered */}
        {analyteData
  .filter(analyte => analyte.result !== "N/A" && analyte.result !== "")  // Filter out analytes without results
  .map((analyte, index) => (
    <div
      className="analyte-box"
      key={index}
      style={{ marginBottom: "20px" }} // Add spacing between analyte tables
    >
      <h3>{analyte.analyteName}</h3>
      <Table
        bordered
        style={{
          border: "1px solid #dee2e6",
          borderCollapse: "collapse",
          marginBottom: "0",
          marginTop: "20px",
        }}
      >
        <tbody>
          {/* Row 1 */}
          <tr>
            <td style={{ width: "16.5%", border: "1px solid #dee2e6" }}>
              Robust Mean
            </td>
            <td style={{ width: "16.5%", border: "1px solid #dee2e6" }}>
              <strong>{analyte.robust_mean}</strong>
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              Robust SD
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              <strong>{reportDetails.robustSD}</strong>
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              Valid Results
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              <strong>{analyte.count}</strong>
            </td>
          </tr>
          {/* Row 3 */}
          <tr>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              Rejected Results
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              <strong>{analyte.count}</strong>
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              Robust Deviation
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              <strong>{analyte.rmz}</strong>
            </td>
          </tr>
        </tbody>
      </Table>
      <Table
        bordered
        style={{
          border: "1px solid #dee2e6",
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          {/* Row 4: Labels only */}
          <tr>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              Participant Number
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              Test Result
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              Robust Deviation
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              Z-Score
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              Coefficient of Variation (CV)
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              Upper Level of Acceptability
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              Lower Level of Acceptability
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              Evaluation
            </td>
          </tr>

          {/* Row 5: Dynamic Data */}
          <tr>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              <strong>{this.props.match.params.id1}</strong> {/* Participant Number */}
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              <strong>{analyte.result}</strong> {/* Test Result */}
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              <strong>{analyte.rmz}</strong> {/* Robust Deviation */}
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              <strong>
                {analyte.zScore !== undefined ? analyte.zScore : "N/A"}
              </strong>
            </td>

            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              <strong>{analyte.CV}</strong>{" "}
              {/* Coefficient of Variation (CV) */}
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              <strong>{analyte.upperLevel}</strong>{" "}
              {/* Upper Level of Acceptability */}
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              <strong>{analyte.lowerLevel}</strong>{" "}
              {/* Lower Level of Acceptability */}
            </td>
            <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
              <strong>{analyte.evaluation}</strong> {/* Evaluation */}
            </td>
          </tr>
        </tbody>
      </Table>
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

