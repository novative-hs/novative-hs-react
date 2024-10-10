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
          // dataField: "lab_count",
          sort: true,
          formatter: (cellContent, analyte) => (
            <div className="text-start">{analyte.lab_count}</div>
          ),
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
    return analytes.map(analyte => {
      // console.log("Analyte:", analyte);
      // Find the result entry for the current analyte
      const resultEntry = results.find(result => result.analyte === analyte.id);
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
  componentDidMount() {
    const { onGetSchemeAnalyte, onGetStatisticsList } = this.props;
    const id = this.props.match.params.id;
  
    // Check if statistics data exists
    // if (this.props.Statistics && !isEmpty(this.props.Statistics)) {
      // If statistics data is available, fetch it along with SchemeAnalyte
      onGetSchemeAnalyte(id);
      onGetStatisticsList(id);
    // }
    // If no statistics data is present, show nothing (handled by not calling the API)
  }

  componentDidUpdate(prevProps) {
   
    const { SchemeAnalytesList, ResultSubmit, Statistics } = this.props;
  
    // Check if SchemeAnalytesList has changed and is not empty
    if (
      SchemeAnalytesList !== prevProps.SchemeAnalytesList &&
      !isEmpty(SchemeAnalytesList)
    ) {
      const combinedData = this.combineData(SchemeAnalytesList, this.props.ResultSubmit);
      this.setState({ SchemeAnalytesList: SchemeAnalytesList, combinedData });
    }
  
    // Check if ResultSubmit has changed and is not empty
    if (ResultSubmit !== prevProps.ResultSubmit && !isEmpty(ResultSubmit)) {
      const combinedData = this.combineData(this.props.SchemeAnalytesList, ResultSubmit);
      this.setState({ ResultSubmitList: ResultSubmit, combinedData });
    }
  
    // Check if Statistics has changed and is not empty
    if (Statistics !== prevProps.Statistics && !isEmpty(Statistics)) {
      const combinedData = this.combineData(this.props.SchemeAnalytesList, Statistics);
      this.setState({ StatisticsList: Statistics, combinedData });
    }
  }

  onPaginationPageChange = page => {
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

    // Change button text to "Recalculate"
    this.setState({ buttonText: "Recalculate" });

    // Combine data using ResultSubmit for calculation
    this.setState(prevState => ({
      combinedData: this.combineData(
        prevState.SchemeAnalytesList,
        this.props.ResultSubmit
      ),
    }));
  };

  handleReport = round => {
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
  displaySuccessMessage = message => {
    this.setState({ successMessage: message, modal: true }); // Open the modal

    setTimeout(() => {
      this.setState({ successMessage: "", modal: false }); // Close the modal after 2 seconds
    }, 3000);
  };

  render() {
    // const { SchemeAnalytesList } = this.props; // Destructure from props

    // const pageOptions = {
    //   sizePerPage: 10,
    //   totalSize: SchemeAnalytesList.length, // Fix here
    //   custom: true,
    // };
    const { closing_date, rounds } = this.props;

    const { combinedData } = this.state; // Use the combined data
    // Assuming all entries have the same rounds value
    // const rounds = combinedData.length > 0 ? combinedData[0].rounds : null;
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
    const { rounds_instance } = this.props;
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
                {this.state.buttonText === "Recalculate" && (
                  <Button
                    color="secondary"
                    onClick={() => this.handleReport(rounds_instance)}
                    className=""
                  >
                    Report
                  </Button>
                )}
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

            <Row className="mb-3">
              <Col className="d-flex  justify-content-around">
                <div className="d-flex  align-items-center">
                  <span className="me-2">Round:</span>
                  <span>{rounds ? rounds : "N/A"}</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-2">Closing Date:</span>
                  {moment(closing_date).format("DD MMM YYYY, h:mm A")}
                </div>
              </Col>
            </Row>
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
                          {toolkitprops => (
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
  rounds_instance: PropTypes.object,

  closing_date: PropTypes.string,
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
});

const mapDispatchToProps = dispatch => ({
  onGetSchemeAnalyte: id => dispatch(getSchemeAnalytesList(id)),
  onGetResultSubmit: id => dispatch(getResultSubmit(id)),
  onGetStatisticsList: id => dispatch(getStatisticsList(id)),
  onUpdateRound: (id, round) => dispatch(updateRoundList({ id, ...round })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Results));
