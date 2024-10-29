import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import "assets/scss/table.scss";

import Breadcrumbs from "components/Common/Breadcrumb";
import { getSchemeAnalytesList } from "store/results/actions";
import { postValues} from "store/results/actions";
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
          )},
        },
        {
          text: "Type",
          dataField: "type",
          formatter: (cellContent, analyte) => (
            <select
              className="form-select me-2"
              onChange={e => this.handleTypeChange(analyte.id, e.target.value)}
              defaultValue={this.state.selectedTypes[analyte.id] || ""}
            >
              <option value="" disabled>
                Select Type
              </option>
              {this.state.typeOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ),
        },
        {
          text: "Value",
          dataField: "value",
          formatter: (cellContent, analyte) => (
            <select
              className="form-select me-2"
              onChange={e => this.handleValueChange(analyte.id, e.target.value)}
              defaultValue={this.state.selectedValues[analyte.id] || ""}
            >
              <option value="" disabled>
                Select Value
              </option>
              {this.state.valueOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ),
        },
        {
          text: "Actions",
          dataField: "actions",
          formatter: (cellContent, analyte) => (
            <div className="text-start">
              <button
                className="btn btn-primary" // Use Bootstrap button styles
                onClick={() => this.handleSubmit(analyte)}
              >
                Submit
              </button>
            </div>
          ),
        },
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
    onGetSchemeAnalyte(id)
    
  }

  componentDidUpdate(prevProps) {
    const { SchemeAnalytesList } = this.props;
    // Check if the SchemeAnalytesList prop has changed
    if (prevProps.SchemeAnalytesList !== SchemeAnalytesList) {
      // Update the state with the new SchemeAnalytesList
      this.setState({
        SchemeAnalytesList: SchemeAnalytesList,
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

  handleValueChange = (analyteId, value) => {
    this.setState(prevState => ({
      selectedValues: {
        ...prevState.selectedValues,
        [analyteId]: value,
      },
    }));
  };

  handleSubmit = async (analyte) => {
  const { selectedTypes, selectedValues } = this.state;
  const id = this.props.match.params.id;
  const payload = {
    analyte_id: analyte.id,
    account_id: this.state.user_id,
    type: selectedTypes[analyte.id] || "",
    value: selectedValues[analyte.id] || "",
  };

  try {
    // Call the API with the payload
    await this.props.onPostValues(payload, id);

    // Set submissionSuccess to true and reset selected values
    this.setState({
      submissionSuccess: true,
      selectedTypes: {},
      selectedValues: {},
    });
  } catch (error) {
    // Set submissionSuccess to false if there's an error
    this.setState({
      submissionSuccess: false,
    });
  }

  // Clear the message after a delay (applies to both success and error cases)
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
    const { SchemeAnalytesList, submissionSuccess  } = this.state;
    const pageOptions = {
      sizePerPage: 10,
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
                <Card>
                  <CardBody>
                  {submissionSuccess !== null && (
                      <div className={`alert ${submissionSuccess ? "alert-success" : "alert-danger"}`} role="alert">
                        {submissionSuccess ? "Values submitted successfully!" : "Failed to submit values."}
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
  }).i
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
