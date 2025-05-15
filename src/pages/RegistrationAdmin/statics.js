import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "reactstrap";
import { isEmpty } from "lodash";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import moment from "moment";

import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import debounce from "lodash/debounce";
import "assets/scss/table.scss";

import Breadcrumbs from "components/Common/Breadcrumb";
import { getSchemeAnalytesList } from "store/results/actions";
import { getResultSubmit } from "store/resultsSubmit/actions";
import { getStatisticsList } from "store/results/actions";
import { updateRoundList } from "store/rounds/actions";
import "assets/scss/table.scss";

class Results extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      SchemeAnalytesList: [],
      buttonText: "Calculate",
      ResultSubmit: [],
      Statistics: [],
      combinedData: [], // Store the combined data here
      // analyte: "",
      // rounds: [],
      isCalculated: false, // Flag to track calculation status
      successMessage: "",
      modal: false, // Modal state for visibility control
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
          text: "N",
          sort: true,
          formatter: (cellContent, analyte) => {
            const roundId = this.props.match.params.id; // get round id from route params
            return (
              <div className="text-start">
                <Link to={`/statistic-participant/${roundId}/${analyte.id}`}>
                  {analyte.lab_count}
                </Link>
              </div>
            );
          },
        },
        {
          text: "Mean",
          // dataField: "lab_count",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.mean_result}</div>
          ),
        },
        {
          text: "Median",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.median_result}</div>
          ),
        },
        {
          text: "Robust Mean",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.robust_mean}</div>
          ),
        },
        {
          text: "SD",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.std_deviation}</div>
          ),
        },
        {
          text: "Uncertainty",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.uncertainty}</div>
          ),
        },
        {
          text: "CV %",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.cv_percentage}</div>
          ),
        },
      ],
    };
  }
  combineData = (analytes, results) => {
    // console.log("SchemeAnalytesList:", analytes);
    // console.log("ResultSubmit:", results);
    return analytes.map((analyte) => {
      // console.log("Analyte:", analyte);
      // Find the result entry for the current analyte
      const resultEntry = results.find(
        (result) => result.analyte === analyte.id
      );
      // console.log("Result Entry:", resultEntry);
      // Extract lab count, mean, and median from the result entry
      const labCount = resultEntry?.lab_count || 0;
      const meanResult = resultEntry?.mean_result || 0;
      const medianResult = resultEntry?.median_result || 0;
      const RobustMean = resultEntry?.robust_mean || 0;
      const standarDeviation = resultEntry?.std_deviation || 0;
      const Uncertainty = resultEntry?.uncertainty || 0;
      const CvPercentage = resultEntry?.cv_percentage || 0;
      return {
        ...analyte,
        lab_count: labCount,
        mean_result: meanResult,
        median_result: medianResult,
        robust_mean: RobustMean,
        std_deviation: standarDeviation,
        uncertainty: Uncertainty,
        cv_percentage: CvPercentage,
      };
    });
  };
  isAllFieldsZero = (data) => {
    // Check if all the relevant fields in the data are equal to 0
    return data.every(
      (item) =>
        item.lab_count === 0 &&
        item.mean_result === 0 &&
        item.median_result === 0 &&
        item.robust_mean === 0 &&
        item.std_deviation === 0 &&
        item.uncertainty === 0 &&
        item.cv_percentage === 0
    );
  };

  componentDidMount() {
    const { onGetSchemeAnalyte, onGetStatisticsList } = this.props;
    const id = this.props.match.params.id;

    // Fetch SchemeAnalytesList and ResultSubmit concurrently
    Promise.all([onGetSchemeAnalyte(id), onGetStatisticsList(id)])
      .then(() => {
        const { SchemeAnalytesList, Statistics } = this.props;
        // Combine data after both API calls succeed
        const combinedData = this.combineData(SchemeAnalytesList, Statistics);

        // Check if all fields are 0 and set buttonText accordingly
        const isZero = this.isAllFieldsZero(combinedData);
        this.setState({
          combinedData,
          buttonText: isZero ? "Calculate" : "Recalculate", // Set button text based on data
        });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }
  componentDidUpdate(prevProps) {
    const { SchemeAnalytesList, ResultSubmit, Statistics } = this.props;

    if (
      SchemeAnalytesList !== prevProps.SchemeAnalytesList &&
      !isEmpty(SchemeAnalytesList)
    ) {
      const combinedData = this.combineData(
        SchemeAnalytesList,
        this.props.ResultSubmit
      );
      const isZero = this.isAllFieldsZero(combinedData);
      this.setState({
        SchemeAnalytesList: SchemeAnalytesList,
        combinedData,
        buttonText: isZero ? "Calculate" : "Recalculate",
      });
    }

    if (ResultSubmit !== prevProps.ResultSubmit && !isEmpty(ResultSubmit)) {
      const combinedData = this.combineData(
        this.props.SchemeAnalytesList,
        ResultSubmit
      );
      const isZero = this.isAllFieldsZero(combinedData);
      this.setState({
        ResultSubmitList: ResultSubmit,
        combinedData,
        buttonText: isZero ? "Calculate" : "Recalculate",
      });
    }

    if (Statistics !== prevProps.Statistics && !isEmpty(Statistics)) {
      const combinedData = this.combineData(
        this.props.SchemeAnalytesList,
        Statistics
      );
      const isZero = this.isAllFieldsZero(combinedData);
      this.setState({
        StatisticsList: Statistics,
        combinedData,
        buttonText: isZero ? "Calculate" : "Recalculate",
      });
    }
  }

  onPaginationPageChange = (page) => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.props.pagination.options.onPageChange(page);
    }
  };

  handleCalculate = () => {
    const { onGetSchemeAnalyte, onGetResultSubmit } = this.props;
    const id = this.props.match.params.id;

    // Call the necessary functions with the id
    onGetSchemeAnalyte(id);
    onGetResultSubmit(id);

    // Combine data using ResultSubmit for calculation
    this.setState((prevState) => ({
      combinedData: this.combineData(
        prevState.SchemeAnalytesList,
        this.props.ResultSubmit
      ),
    }));
  };

  handleReport = (round) => {
    if (round && round.id) {
      // Update the round's status to "report available"
      const updatedRound = {
        ...round,
        status: "Report Available",
        added_by: this.state.user_id,
      };

      // Dispatch the update action to save the new status
      this.props.onUpdateRound(round.id, updatedRound);
      this.displaySuccessMessage("Round Status is changed to Report Available");
    }
  };
  // Function to display the success message
  displaySuccessMessage = (message) => {
    this.setState({ successMessage: message, modal: true }); // Open the modal

    setTimeout(() => {
      this.setState({ successMessage: "", modal: false }); // Close the modal after 2 seconds
    }, 3000);
  };

  render() {
    // };
    const {
      closing_date,
      rounds,
      scheme_name,
      scheme_type,
      cycle_no,
      round_issuedate,
      round_status,
    } = this.props;

    const { combinedData } = this.state; // Use the combined data
    const pageOptions = {
      sizePerPage: 10,
      totalSize: combinedData.length, // Adjust totalSize for combined data
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "analyte_name",
        order: "desc",
      },
    ];
    const { issue_date } = this.props;
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Unapproved Participant | NEQAS</title>
          </MetaTags>
          <Container fluid>
            <Row
              className="mb-3 justify-content-start"
              style={{ marginLeft: "120px" }}
            >
              <Col>
                <Button
                  color="primary"
                  onClick={() => this.handleCalculate()}
                  className="me-2"
                >
                  {this.state.buttonText}
                </Button>
                {/* Show the "Report" button only when the button text is "Recalculate" */}
                {/* {this.state.buttonText === "Recalculate" && (
                  <Button
                    color="secondary"
                    onClick={() => this.handleReport(issue_date)}
                    className=""
                  >
                    Report
                  </Button>
                )} */}
              </Col>
            </Row>

            {/* Modal for displaying success message */}
            <Modal
              isOpen={this.state.modal}
              toggle={() => this.setState({ modal: !this.state.modal })}
            >
              <ModalHeader
                toggle={() => this.setState({ modal: !this.state.modal })}
              >
                Success
              </ModalHeader>
              <ModalBody>{this.state.successMessage}</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => this.setState({ modal: false })}
                >
                  OK
                </Button>
              </ModalFooter>
            </Modal>

            <div className="container">
              <Row className="mb-4">
                <Col md={3}>
                  <div className="d-flex align-items-center">
                    <span className="me-2">Round:</span>
                    <span>
                      <strong>{rounds ? rounds : "N/A"}</strong>
                    </span>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="d-flex align-items-center">
                    <span className="me-2">Scheme Name:</span>
                    <span>
                      <strong>{scheme_name ? scheme_name : "N/A"}</strong>
                    </span>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="d-flex align-items-center">
                    <span className="me-2">Scheme Type:</span>
                    <span>
                      <strong>{scheme_type ? scheme_type : "N/A"}</strong>
                    </span>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="d-flex align-items-center">
                    <span className="me-2">Cycle No:</span>
                    <span>
                      <strong>{cycle_no ? cycle_no : "N/A"}</strong>
                    </span>
                  </div>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={3}>
                  <div className="d-flex align-items-center">
                    <span className="me-2">Issued Date:</span>
                    <span>
                      <strong>
                        {round_issuedate
                          ? moment(round_issuedate).format(
                              "DD MMM YYYY, h:mm A"
                            )
                          : "N/A"}
                      </strong>
                    </span>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="d-flex align-items-center">
                    <span className="me-2">Closing Date:</span>
                    <span>
                      <strong>
                        {closing_date
                          ? moment(closing_date).format("DD MMM YYYY, h:mm A")
                          : "N/A"}
                      </strong>
                    </span>
                  </div>
                </Col>

                <Col md={3}>
                  <div className="d-flex align-items-center">
                    <span className="me-2">Status:</span>
                    <span>
                      <strong>{round_status ? round_status : "N/A"}</strong>
                    </span>
                  </div>
                </Col>
              </Row>
            </div>

            <Row className="justify-content-center align-item-center">
              <Col lg="10">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.columnsList}
                      data={combinedData}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.columnsList}
                          data={combinedData}
                          search
                        >
                          {(toolkitprops) => (
                            <React.Fragment>
                              <div className="table-responsive">
                                <BootstrapTable
                                  id="printable-table"
                                  keyField="id"
                                  ref={this.node}
                                  responsive
                                  bordered={false}
                                  striped={false}
                                  defaultSorted={defaultSorted}
                                  classes={"table table-bordered table-hover"}
                                  {...toolkitprops.baseProps}
                                  {...paginationTableProps}
                                />
                                <div className="float-end">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                    onPageChange={this.onPaginationPageChange}
                                  />
                                </div>
                              </div>
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
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
  ResultSubmit: PropTypes.array,
  Statistics: PropTypes.array,
  rounds: PropTypes.string,
  issue_date: PropTypes.object,
  scheme_name: PropTypes.string,
  scheme_type: PropTypes.string,
  rounds: PropTypes.string,
  closing_date: PropTypes.string,
  round_issuedate: PropTypes.string,
  round_status: PropTypes.string,
  cycle_no: PropTypes.string,

  // closing_date: PropTypes.string,
  onGetSchemeAnalyte: PropTypes.func,
  onGetResultSubmit: PropTypes.func,
  onGetStatisticsList: PropTypes.func,
  onUpdateRound: PropTypes.func,
};

const mapStateToProps = ({ SchemeAnalytesList, ResultSubmit }) => ({
  SchemeAnalytesList: SchemeAnalytesList.SchemeAnalytesList,
  ResultSubmit: ResultSubmit.ResultSubmit,
  rounds: SchemeAnalytesList.rounds,
  rounds_instance: SchemeAnalytesList.rounds_instance,
  closing_date: SchemeAnalytesList.closing_date,
  Statistics: SchemeAnalytesList.Statistics,
  scheme_name: SchemeAnalytesList.schemeName,
  scheme_type: SchemeAnalytesList.schemeType,
  // rounds: SchemeAnalytesList.rounds,
  // closing_date: SchemeAnalytesList.closing_date,
  round_issuedate: SchemeAnalytesList.issue_date,
  round_status: SchemeAnalytesList.round_status,
  cycle_no: SchemeAnalytesList.cycle_no,
});

const mapDispatchToProps = (dispatch) => ({
  onGetSchemeAnalyte: (id) => dispatch(getSchemeAnalytesList(id)),
  onGetResultSubmit: (id) => dispatch(getResultSubmit(id)),
  onGetStatisticsList: (id) => dispatch(getStatisticsList(id)),
  onUpdateRound: (id, round) => dispatch(updateRoundList({ id, ...round })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Results));
