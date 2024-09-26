import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
} from "reactstrap";
import Select from "react-select";
import { getSelectedSchemesList } from "store/selected-scheme/actions";
import { isEmpty, uniq } from "lodash";
import moment from "moment";

class Roundural extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      SelectedSchemeList: [],
      organization_name: '',
      modal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      nameOptions: [],
      selectedName: "All",
      feedbackListColumns: [
        {
          text: "ID",
          dataField: "id",
          sort: true,
          hidden: true,
        },
        {
          dataField: "scheme_name",
          text: "Scheme Name",
          sort: true,
          formatter: (cellContent, round) => {
            const { organization_name } = this.state; // Access organization_name from state
            return (
              <Link to={`/${organization_name}/${round.id}/participantsResults`}>
                {round.scheme_name}
              </Link>
            );
          },
        },
        {
          dataField: "rounds",
          text: "Rounds",
          sort: true,
          formatter: (cellContent, round) => <>{round.rounds}</>,
        },
        {
          dataField: "issueDate",
          text: "Issue Date",
          sort: true,
          formatter: (cellContent, round) => (
            <>
              <span>
                {moment(round.issue_date).format("DD MMM YYYY, h:mm A")}
              </span>
            </>
          ),
        },
        {
          dataField: "closingDate",
          text: "Closing Date",
          sort: true,
          formatter: (cellContent, round) => (
            <>
              <span>
                {moment(round.closing_date).format("DD MMM YYYY, h:mm A")}
              </span>
            </>
          ),
        },
        // {
        //   dataField: "roundStatus",
        //   text: "Submitted-at",
        //   sort: true,
        // },
        {
          dataField: "status",
          text: "Status",
          sort: true,
        },
      ],
    };
    this.handleNameFilterChange = this.handleNameFilterChange.bind(this);
  }

  componentDidMount() {
    const { organization_name } = this.props.match.params;
    this.setState({ organization_name });
    
    const { onGetRoundList } = this.props;
    onGetRoundList(this.state.user_id);
  }

  componentDidUpdate(prevProps) {
    const { SelectedSchemeList } = this.props;
    if (
      SelectedSchemeList !== prevProps.SelectedSchemeList &&
      !isEmpty(SelectedSchemeList)
    ) {
      const uniqueNames = uniq(SelectedSchemeList.map(item => item.scheme_name));
      // console.log("unique name filters", uniqueNames, item.scheme)
      this.setState({
        SelectedSchemeList,
        nameOptions: ["All", ...uniqueNames],
      });
    }
  }

  handleNameFilterChange(selectedOption) {
    this.setState({
      selectedName: selectedOption ? selectedOption.value : "All",
    });
  }

  filterData() {
    const { SelectedSchemeList, selectedName } = this.state;
    if (selectedName === "All") {
      return SelectedSchemeList;
    }
    return SelectedSchemeList.filter(entry => entry.scheme_name === selectedName);
  }

  render() {
    const { SearchBar } = Search;
    const { nameOptions, selectedName } = this.state;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: this.state.SelectedSchemeList.length,
      custom: true,
    };

    const filteredRoundList = this.filterData();
    const schemeName = nameOptions.map((name) => {
      console.log("Scheme name:", name); // Logs each name inside the map function
      return {
        value: name,
        label: name,
      };
    });
    
    console.log("Final schemeName:", schemeName); // Logs the final array after map is complete
    
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Rounds</title>
          </MetaTags>
          <Container fluid>
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={filteredRoundList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={filteredRoundList}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col xs="4" sm="4" md="3" lg="3">
                                  <div className="mb-3">
                                    <Select
                                      onChange={this.handleNameFilterChange}
                                      options={schemeName}
                                      placeholder="Select Scheme..."
                                      isClearable={true}
                                      value={
                                        selectedName === "All"
                                          ? null
                                          : schemeName.find(
                                              option =>
                                                option.value === selectedName
                                            )
                                      }
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={[
                                        {
                                          dataField: "id",
                                          order: "desc",
                                        },
                                      ]}
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      data={filteredRoundList}
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row>
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

Roundural.propTypes = {
  match: PropTypes.object,
  SelectedSchemeList: PropTypes.array,
  className: PropTypes.any,
  onGetRoundList: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
};

const mapStateToProps = ({ SelectedSchemeList }) => ({
  SelectedSchemeList: SelectedSchemeList.SelectedSchemeList,
});

const mapDispatchToProps = dispatch => ({
  onGetRoundList: id => dispatch(getSelectedSchemesList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Roundural));
