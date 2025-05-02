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
      console.log('Report Data:', reportData);

      const participantId = parseInt(this.props.match.params.id1, 10);
      const participantResults = reportData.participants_results.filter(
        (result) => result.participant_id === participantId
      );

      const analyteData = participantResults.map((result) => {
        const zScore = result.z_score || "N/A";
        const evaluation = result.result_evaluation || "N/A"; // Add if available or needed.
        const rmz = result.result_afterconversion || result.result || "N/A";

        return {
          analyteName: result.analyte_name || "N/A",
          unit: result.unit || "N/A",
          instrument: result.instrument || "N/A",
          count: result.lab_count || "N/A",
          result: result.result || "N/A",
          mean: result.mean || "N/A",
          zScore: zScore,
          rmz: rmz,
          evaluation: evaluation,
        };
      });

      // Extract robustMean and robustSD from participantResults
      let robustMean = "N/A";
      let robustSD = "N/A";

      if (participantResults.length > 0) {
        robustMean = participantResults[0].robust_mean || "N/A";
        robustSD = participantResults[0].robust_sd || "N/A";
      }

      const reportDetails = {
        round: reportData.round_name || "N/A",
        scheme: reportData.scheme_name || "N/A",
        issueDate: reportData.issue_date || "N/A",
        closingDate: reportData.closing_date || "N/A",
        printDate: moment(new Date()).format("DD MMM YYYY"),
        matrix: reportData.matrix || "N/A",
        robustMean: robustMean,
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
          <p className="text-center text-danger">No data available for this participant.</p>
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

        <Breadcrumbs title="Report" breadcrumbItem="Participant Report" className="header" />

          {/* Add Print Button
      <button onClick={() => window.print()} className="btn btn-primary mb-4">
        Print Report
      </button> */}

        {/* Report Header */}
        <div className="report-header my-4">
          <h4 className="text-center " style={{ fontWeight: 'bold', color: 'blue' }}>
            NHS - National External Quality Assessment Scheme
          </h4>
          <Row>
            <Col>
              <h6 style={{ fontWeight: 'bold', color: 'blue', marginBottom: '10px' }}>
                <strong>Round:</strong> {reportDetails.round}
              </h6>
              <h6 style={{ fontWeight: 'bold', color: 'blue', marginBottom: '10px' }}>
                <strong>Participant Number:</strong> {this.props.match.params.id1}
              </h6>
              <h6 style={{ fontWeight: 'bold', color: 'blue', marginBottom: '10px' }}>
                <strong>Issue Date:</strong> {reportDetails.issueDate} - 
                <strong>Closing Date:</strong> {reportDetails.closingDate}
              </h6>
            </Col>

            <Col>
              <h6 style={{ fontWeight: 'bold', color: 'blue', marginBottom: '10px', textAlign: 'right'}}>
                <strong>Print Date:</strong> {reportDetails.printDate}
              </h6>
            </Col>
          </Row>
        </div>

        {/* Analyte Table */}
        <Table bordered style={{ border: "1px solid #dee2e6", borderCollapse: "collapse", marginTop: "20px", marginBottom: "50px" }}>
          <thead>
            <tr className="text-center">
              <th style={{ border: "1px solid #dee2e6" }}>Analyte</th>
              <th style={{ border: "1px solid #dee2e6" }}>Unit</th>
              <th style={{ border: "1px solid #dee2e6" }}>Instrument</th>
              <th style={{ border: "1px solid #dee2e6" }}>Count</th>
              <th style={{ border: "1px solid #dee2e6" }}>Result</th>
              <th style={{ border: "1px solid #dee2e6" }}>Mean</th>
              <th style={{ border: "1px solid #dee2e6" }}>Z-Score</th>
              <th style={{ border: "1px solid #dee2e6" }}>RMZ</th>
              <th style={{ border: "1px solid #dee2e6" }}>Evaluation</th>
            </tr>
          </thead>
          <tbody>
            {analyteData.map((analyte, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #dee2e6" }}>{analyte.analyteName}</td>
                <td style={{ border: "1px solid #dee2e6" }}>{analyte.unit}</td>
                <td style={{ border: "1px solid #dee2e6" }}>{analyte.instrument}</td>
                <td style={{ border: "1px solid #dee2e6" }}>{analyte.count}</td>
                <td style={{ border: "1px solid #dee2e6" }}>{analyte.result}</td>
                <td style={{ border: "1px solid #dee2e6" }}>{analyte.mean}</td>
                <td style={{ border: "1px solid #dee2e6" }}>{analyte.zScore}</td>
                <td style={{ border: "1px solid #dee2e6" }}>{analyte.rmz}</td>
                <td style={{ border: "1px solid #dee2e6" }}>{analyte.evaluation}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Summary Section */}
        {/* Analyte Details: Dynamically rendered */}
        {/* Summary Section */}
       
      {/* Analyte Details: Dynamically rendered */}
      {analyteData.map((analyte, index) => (
        <div
        className="analyte-box"
        key={index}
        style={{ marginBottom: "20px" }} // Add spacing between analyte tables
      >
        <h3></h3>
        {/* <h3>Analyte: {analyte.analyteName}</h3> */}
        <Table bordered style={{ border: "1px solid #dee2e6", borderCollapse: "collapse", marginBottom: "0", marginTop: "20px" }}>
          <tbody>
            {/* Row 1 */}
            <tr>
              <td style={{ width: "16.5%", border: "1px solid #dee2e6" }}>Round Number</td>
              <td style={{ width: "16.5%", border: "1px solid #dee2e6" }}>
                <strong>{reportDetails.round}</strong>
              </td>
              <td style={{ width: "16.5%", border: "1px solid #dee2e6" }}>Matrix</td>
              <td style={{ width: "16.5%", border: "1px solid #dee2e6" }}>
                <strong>{reportDetails.matrix}</strong>
              </td>
              <td style={{ width: "16.5%", border: "1px solid #dee2e6" }}>Robust Mean</td>
              <td style={{ width: "16.5%", border: "1px solid #dee2e6" }}>
                <strong>{reportDetails.robustMean}</strong>
              </td>
            </tr>
            {/* Row 2 */}
            <tr>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>Analyte</td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
                <strong>{analyte.analyteName}</strong>
              </td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>Date</td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
                <strong>{reportDetails.issueDate}</strong>
              </td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>Robust SD</td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
                <strong>{reportDetails.robustSD}</strong>
              </td>
            </tr>
            {/* Row 3 */}
            <tr>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>Valid Results</td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
                <strong>{analyte.count}</strong>
              </td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>Rejected Results</td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
                <strong>{analyte.count}</strong>
              </td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>Robust Deviation</td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
                <strong>{analyte.rmz}</strong>
              </td>
            </tr>
          </tbody>
        </Table>
        <Table bordered style={{ border: "1px solid #dee2e6", borderCollapse: "collapse" }}>
          <tbody>
            {/* Row 4: Labels only */}
            <tr>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>Participant Number</td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>Test Result</td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>Robust Deviation</td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>Z-Score</td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>Coefficient of Variation (CV)</td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>Upper Level of Acceptability</td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>Lower Level of Acceptability</td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>Evaluation</td>
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
  <strong>{analyte.zScore !== undefined ? analyte.zScore : "N/A"}</strong>
</td>

              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
                <strong>{analyte.count}</strong> {/* Coefficient of Variation (CV) */}
              </td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
                <strong>{analyte.upperLevel}</strong> {/* Upper Level of Acceptability */}
              </td>
              <td style={{ width: "12.5%", border: "1px solid #dee2e6" }}>
                <strong>{analyte.lowerLevel}</strong> {/* Lower Level of Acceptability */}
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

const mapDispatchToProps = (dispatch) => ({
  onGetReport: (id) => dispatch(getReport(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportParticipant));
