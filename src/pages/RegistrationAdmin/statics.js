import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import { Card, CardBody, Col, Container, Row, Button } from "reactstrap";
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
import "assets/scss/table.scss";

class Results extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      SchemeAnalytesList: [],
      ResultSubmit: [],
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
    const {
      onGetSchemeAnalyte,
      onGetResultSubmit,
      ResultSubmit,
      SchemeAnalytesList,
    } = this.props;
    // console.log("dataaaa", ResultSubmit)
    const id = this.props.match.params.id;
    onGetSchemeAnalyte(id);
    onGetResultSubmit(id);
  }

  componentDidUpdate(prevProps) {
    const { SchemeAnalytesList, ResultSubmit } = this.props;

    console.log("aaaaaaaa", SchemeAnalytesList);
    // console.log("bbbbbbbbbb",ResultSubmit )

    // Check if SchemeAnalytesList has changed and is not empty
    if (
      SchemeAnalytesList !== prevProps.SchemeAnalytesList &&
      !isEmpty(SchemeAnalytesList)
    ) {
      const combinedData = this.combineData(
        SchemeAnalytesList,
        this.props.ResultSubmit
      );
      // console.log("schememanalyteeeee",SchemeAnalytesList )
      // console.log("Combined data after SchemeAnalytesList update:", combinedData);
      this.setState({ SchemeAnalytesList: SchemeAnalytesList, combinedData });
    }

    // Check if ResultSubmit has changed and is not empty
    if (ResultSubmit !== prevProps.ResultSubmit && !isEmpty(ResultSubmit)) {
      const combinedData = this.combineData(
        this.props.SchemeAnalytesList,
        ResultSubmit
      );
      // console.log("reultttttttttttttt",ResultSubmit )
      this.setState({ ResultSubmitList: ResultSubmit, combinedData });
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

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Unapproved Participant | NEQAS</title>
          </MetaTags>
          <Container fluid>
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
  rounds: PropTypes.string,

  closing_date: PropTypes.string,
  onGetSchemeAnalyte: PropTypes.func,
  onGetResultSubmit: PropTypes.func,
};

const mapStateToProps = ({ SchemeAnalytesList, ResultSubmit }) => ({
  SchemeAnalytesList: SchemeAnalytesList.SchemeAnalytesList,
  ResultSubmit: ResultSubmit.ResultSubmit,
  rounds: SchemeAnalytesList.rounds,
  closing_date: SchemeAnalytesList.closing_date,
});

const mapDispatchToProps = dispatch => ({
  onGetSchemeAnalyte: id => dispatch(getSchemeAnalytesList(id)),
  onGetResultSubmit: id => dispatch(getResultSubmit(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Results));
