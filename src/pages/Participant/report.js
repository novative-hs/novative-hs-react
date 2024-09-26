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
      const mean = resultEntry?.mean || 0;
      const CV = resultEntry?.CV || 0;

      // Get the z_scores_with_lab array
      const zScoresArray = resultEntry?.z_scores_with_lab || [];

      // Find the z_score for the specific participant (based on participant_id)
      const zScoreEntry = zScoresArray.find(
        zScore => zScore.lab_id === resultEntry.participant_id
      );

      // Extract the z_score if the participant's entry is found
      const zScore = zScoreEntry ? zScoreEntry.z_score : 0;

      return {
        ...analyte,
        lab_count: labCount,
        unit: unit,
        instrument: instrument,
        result: result,
        mean: mean,
        CV: CV,
        z_score: zScore,
      };
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
  render() {
    const { rounds, issue_date, closing_date } = this.props;
    const { combinedData } = this.state; // Use the combined data

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
                  <span>{this.state.user_id}</span>
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
                {combinedData.map((analyte, index) => (
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
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td >{this.state.user_id}</td>
                            <td>{analyte.result}</td>
                            <td>{analyte.name}</td>
                            <td>{analyte.z_score}</td>
                            <td>{analyte.CV}</td>
                          </tr>
                        </tbody>
                      </table>
                    </CardBody>
                  </Card>
                ))}
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
