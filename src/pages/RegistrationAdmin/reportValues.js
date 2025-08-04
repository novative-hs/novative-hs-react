import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import "assets/scss/table.scss";

import Breadcrumbs from "components/Common/Breadcrumb";
import { getSchemeAnalytesList } from "store/results/actions";
import { postValues } from "store/results/actions";
import "assets/scss/table.scss";

class ReportValues extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      SchemeAnalytesList: [],
      typeOptions: ["Equivocal", "Positive", "Negative"],
      valueOptions: [0, 1, 2],
      selectedTypes: {},
      selectedPositiveValues: {},
      selectedNegativeValues: {},
      selectedEquivocalValues: {},
      selectedValues: {},
      submissionSuccess: null, // Track success/failure message
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      organization_name: "",

      columnsList: [
        {
          text: "Analyte",
          dataField: "name",
          sort: true,
          formatter: (cellContent, analyte) => {
            const { organization_name } = this.state;
            const url = `/${organization_name}/displayValues/${analyte.id}?round_id=${this.props.match.params.id}`;
            return (
              <div className="text-start">
                {/* Use Link for navigation */}
                <Link to={url} className="text-decoration-none">
                  {analyte.name}
                </Link>
              </div>
            );
          },
        },
        {
          text: "",
          dataField: "positivevalue",
          formatter: (cellContent, analyte) => (
            <div className="d-flex">
              <span className="me-2 align-self-center">Positive</span>
              <select
                className="form-select"
                onChange={e =>
                  this.handleValueChange(analyte.id, e.target.value, "positive")
                }
                defaultValue={
                  this.state.selectedPositiveValues[analyte.id] || ""
                }
              >
                <option value="" disabled>
                  Select Value
                </option>
                <option value={5}>5</option>
                <option value={0}>0</option>
              </select>
            </div>
          ),
        },
        {
          text: "",
          dataField: "negativevalue",
          formatter: (cellContent, analyte) => (
            <div className="d-flex">
              <span className="me-2 align-self-center">Negative</span>
              <select
                className="form-select"
                onChange={e =>
                  this.handleValueChange(analyte.id, e.target.value, "negative")
                }
                defaultValue={
                  this.state.selectedNegativeValues[analyte.id] || ""
                }
              >
                <option value="" disabled>
                  Select Value
                </option>
                <option value={5}>5</option>
                <option value={0}>0</option>
              </select>
            </div>
          ),
        },
        {
          text: "",
          dataField: "equivocalvalue",
          formatter: (cellContent, analyte) => (
            <div className="d-flex">
              <span className="me-2 align-self-center">Equivocal</span>
              <select
                className="form-select"
                onChange={e =>
                  this.handleValueChange(
                    analyte.id,
                    e.target.value,
                    "equivocal"
                  )
                }
                defaultValue={
                  this.state.selectedEquivocalValues[analyte.id] || ""
                }
              >
                <option value="" disabled>
                  Select Value
                </option>
                <option value={5}>5</option>
                <option value={0}>0</option>
              </select>
            </div>
          ),
        },
        // {
        //   text: "Value",
        //   dataField: "value",
        //   formatter: (cellContent, analyte) => (
        //     <select
        //       className="form-select me-2"
        //       onChange={e => this.handleValueChange(analyte.id, e.target.value)}
        //       defaultValue={this.state.selectedValues[analyte.id] || ""}
        //     >
        //       <option value="" disabled>
        //         Select Value
        //       </option>
        //       {this.state.valueOptions.map(option => (
        //         <option key={option} value={option}>
        //           {option}
        //         </option>
        //       ))}
        //     </select>
        //   ),
        // },
        //        {
        //   text: "Actions",
        //   dataField: "actions",
        //   formatter: (cellContent, analyte) => (
        //     <div className="text-start">
        //       <button
        //         className="btn btn-primary"
        //         onClick={() => this.handleSubmit(analyte)}
        //       >
        //         Submit
        //       </button>
        //     </div>
        //   ),
        // },
      ],
    };
  }

  componentDidMount() {
    const { organization_name } = this.props.match.params;

    // Only set state if organization_name is empty
    if (!this.state.organization_name) {
      this.setState({ organization_name });
    }

    const { onGetSchemeAnalyte } = this.props;
    const id = this.props.match.params.id;
    onGetSchemeAnalyte(id);
  }

  componentDidUpdate(prevProps) {
    const { SchemeAnalytesList } = this.props;
    if (prevProps.SchemeAnalytesList !== SchemeAnalytesList) {
      const selectedPositiveValues = {};
      const selectedNegativeValues = {};
      const selectedEquivocalValues = {};

      SchemeAnalytesList.forEach(analyte => {
        selectedPositiveValues[analyte.id] = "";
        selectedNegativeValues[analyte.id] = "";
        selectedEquivocalValues[analyte.id] = "";
      });

      this.setState({
        SchemeAnalytesList,
        selectedPositiveValues,
        selectedNegativeValues,
        selectedEquivocalValues,
      });
    }
  }

  handleTypeChange = (analyteId, value) => {
    this.setState(prevState => ({
      selectedTypes: {
        ...prevState.selectedTypes,
        [analyteId]: value,
      },
    }));
  };
 handleValueChange = (analyteId, value, valueType) => {
  const val = Number(value);

  this.setState(prevState => {
    const updatedState = {
      selectedPositiveValues: { ...prevState.selectedPositiveValues },
      selectedNegativeValues: { ...prevState.selectedNegativeValues },
      selectedEquivocalValues: { ...prevState.selectedEquivocalValues },
    };

    // Set selected value to 5 or 0
    if (valueType === "positive") {
      updatedState.selectedPositiveValues[analyteId] = val;
      updatedState.selectedNegativeValues[analyteId] = val === 5 ? 0 : prevState.selectedNegativeValues[analyteId];
      updatedState.selectedEquivocalValues[analyteId] = val === 5 ? 0 : prevState.selectedEquivocalValues[analyteId];
    } else if (valueType === "negative") {
      updatedState.selectedNegativeValues[analyteId] = val;
      updatedState.selectedPositiveValues[analyteId] = val === 5 ? 0 : prevState.selectedPositiveValues[analyteId];
      updatedState.selectedEquivocalValues[analyteId] = val === 5 ? 0 : prevState.selectedEquivocalValues[analyteId];
    } else if (valueType === "equivocal") {
      updatedState.selectedEquivocalValues[analyteId] = val;
      updatedState.selectedPositiveValues[analyteId] = val === 5 ? 0 : prevState.selectedPositiveValues[analyteId];
      updatedState.selectedNegativeValues[analyteId] = val === 5 ? 0 : prevState.selectedNegativeValues[analyteId];
    }

    return updatedState;
  });
};

  handleSubmit = async analyte => {
    const {
      selectedPositiveValues,
      selectedNegativeValues,
      selectedEquivocalValues,
      user_id,
    } = this.state;

    const round_id = this.props.match.params.id;
    const analyte_id = analyte.id;

    const valuesToSubmit = [];

    if (selectedPositiveValues[analyte_id] !== undefined) {
      valuesToSubmit.push({
        analyte_id,
        account_id: user_id,
        type: "positive",
        value: selectedPositiveValues[analyte_id],
      });
    }

    if (selectedNegativeValues[analyte_id] !== undefined) {
      valuesToSubmit.push({
        analyte_id,
        account_id: user_id,
        type: "negative",
        value: selectedNegativeValues[analyte_id],
      });
    }

    if (selectedEquivocalValues[analyte_id] !== undefined) {
      valuesToSubmit.push({
        analyte_id,
        account_id: user_id,
        type: "equivocal",
        value: selectedEquivocalValues[analyte_id],
      });
    }

    if (valuesToSubmit.length === 0) {
      this.setState({ submissionSuccess: false });
      return;
    }

    try {
      // 🔁 Send each value separately
      await Promise.all(
        valuesToSubmit.map(payload =>
          this.props.onPostValues(payload, round_id)
        )
      );

      this.setState({
        submissionSuccess: true,
        selectedPositiveValues: {},
        selectedNegativeValues: {},
        selectedEquivocalValues: {},
      });
    } catch (error) {
      this.setState({ submissionSuccess: false });
    }

    setTimeout(() => {
      this.setState({ submissionSuccess: null });
    }, 3000);
  };
handleSubmitAll = async () => {
  const {
    selectedPositiveValues,
    selectedNegativeValues,
    selectedEquivocalValues,
    user_id,
    SchemeAnalytesList,
    scheme_id,   // ✅ Get from state
    cycle_id,    // ✅ Get from state
  } = this.state;

  const round_id = this.props.match.params.id;
  const valuesToSubmit = [];

  SchemeAnalytesList.forEach(analyte => {
    const analyte_id = analyte.id;
    const payload = {
      analyte_id,
      account_id: user_id,
      round_id,
      scheme_id,  // ✅ include scheme_id
      cycle_id,   // ✅ include cycle_id
    };

   if (selectedPositiveValues[analyte_id] !== undefined && selectedPositiveValues[analyte_id] !== "") {
  payload.positivetype = selectedPositiveValues[analyte_id];
}

if (selectedNegativeValues[analyte_id] !== undefined && selectedNegativeValues[analyte_id] !== "") {
  payload.negativetype = selectedNegativeValues[analyte_id];
}

if (selectedEquivocalValues[analyte_id] !== undefined && selectedEquivocalValues[analyte_id] !== "") {
  payload.equivocaltype = selectedEquivocalValues[analyte_id];
}


    valuesToSubmit.push(payload);
  });

  if (valuesToSubmit.length === 0) {
    this.setState({ submissionSuccess: false });
    return;
  }

  try {
    await Promise.all(
      valuesToSubmit.map(payload =>
        this.props.onPostValues(payload, round_id)
      )
    );

    this.setState({
      submissionSuccess: true,
      selectedPositiveValues: {},
      selectedNegativeValues: {},
      selectedEquivocalValues: {},
    });
  } catch (error) {
    this.setState({ submissionSuccess: false });
  }

  setTimeout(() => {
    this.setState({ submissionSuccess: null });
  }, 3000);
};

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
    const { SchemeAnalytesList, submissionSuccess } = this.state;
    const pageOptions = {
      sizePerPage: 50,
      totalSize: SchemeAnalytesList.length, // Use correct list length
      custom: true,
    };

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>{/* <title>Report Values | Your App</title> */}</MetaTags>
          <Container fluid>
            <Row className="justify-content-center align-item-center">
              <Col lg="10">
                <p>
                  <strong>
                    Please select the True Value for each analyte, the Score for
                    True value will be 5.
                  </strong>
                </p>
                <p>
                  <strong>
                    Just define the True values, by assigning Score 5 all Analytes False values will be assign Score 0 automatically.  
                  </strong>
                </p>
                <Card>
                  <CardBody>
                    {submissionSuccess !== null && (
                      <div
                        className={`alert ${
                          submissionSuccess ? "alert-success" : "alert-danger"
                        }`}
                        role="alert"
                      >
                        {submissionSuccess
                          ? "Values submitted successfully!"
                          : "Failed to submit values."}
                      </div>
                    )}
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.columnsList}
                      data={SchemeAnalytesList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.columnsList}
                          data={SchemeAnalytesList}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <div className="text-end mt-3">
                                <button
                                  className="btn btn-success"
                                  onClick={this.handleSubmitAll}
                                >
                                  Submit All
                                </button>
                              </div>
                              <div className="table-responsive">
                                <BootstrapTable
                                  id="printable-table"
                                  keyField="id"
                                  ref={this.node}
                                  responsive
                                  bordered={false}
                                  striped={false}
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

ReportValues.propTypes = {
  match: PropTypes.object,
  className: PropTypes.any,
  SchemeAnalytesList: PropTypes.array,

  onGetSchemeAnalyte: PropTypes.func,
  onPostValues: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).i,
};

const mapStateToProps = ({ SchemeAnalytesList }) => ({
  SchemeAnalytesList: SchemeAnalytesList.SchemeAnalytesList,
});

const mapDispatchToProps = dispatch => ({
  onGetSchemeAnalyte: id => dispatch(getSchemeAnalytesList(id)),
  onPostValues: (result, id) => dispatch(postValues(result, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReportValues));
