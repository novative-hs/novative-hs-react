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

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import "assets/scss/table.scss";

import Breadcrumbs from "components/Common/Breadcrumb";
import { getResultValues } from "store/results/actions";
import "assets/scss/table.scss";
import { size, isEmpty } from "lodash";

class ReportValues extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      ValuesList: [],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      organization_name: "",

      columnsList: [
        {
          text: "Analyte",
          dataField: "analyte_name",
          sort: true,
          formatter: (cellContent, analyte) => {
            return(
            <div className="text-start">{analyte.analyte_name}</div>
          )},
        },
        {
          text: "Type",
          dataField: "type",
          sort: true,
          formatter: (cellContent, analyte) => {
            return(
            <div className="text-start">{analyte.type}</div>
          )},
        },
        {
          text: "Value",
          dataField: "value",
          sort: true,
          formatter: (cellContent, analyte) => {
            return(
            <div className="text-start">{analyte.value}</div>
          )},
        },
        
      ],
    };
  }

  componentDidMount() {
    const { organization_name } = this.props.match.params;
    const { onGetResultValues } = this.props;
    const id = this.props.match.params.id;
  
    // Only set state if organization_name is empty
    if (!this.state.organization_name) {
      this.setState({ organization_name });
    }
  
    const queryParams = new URLSearchParams(this.props.location.search);
    const round_id = queryParams.get('round_id');
    console.log("round_id", round_id);
    
    // Now pass both id and round_id to the function
    if (id && round_id) {
      onGetResultValues(id, round_id);
    } else {
      console.error("ID or round_id is missing in the request.");
    }
  }

  componentDidUpdate(prevProps) {
    const { ValuesList } = this.props;
    // Check if the ValuesList prop has changed
    if (prevProps.ValuesList !== ValuesList) {
      // Update the state with the new ValuesList
      this.setState({
        ValuesList: ValuesList,
      });
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
    const { ValuesList} = this.state;
    const pageOptions = {
      sizePerPage: 10,
      totalSize: ValuesList.length, // Use correct list length
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
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.columnsList}
                      data={ValuesList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.columnsList}
                          data={ValuesList}
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
  location: PropTypes.object,

  ValuesList: PropTypes.array,
  onGetResultValues: PropTypes.func,

  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).i
};

const mapStateToProps = ({ SchemeAnalytesList }) => ({
  ValuesList: SchemeAnalytesList.ValuesList,
});

const mapDispatchToProps = dispatch => ({
  onGetResultValues: (id,round_id) => dispatch(getResultValues(id, round_id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReportValues));
