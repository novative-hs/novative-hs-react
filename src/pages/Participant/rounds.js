import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";

import {
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  Input,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getroundlist } from "store/rounds/actions";
import { isEmpty, size, uniq } from "lodash";
import { Tooltip } from "@material-ui/core";
import "assets/scss/table.scss";
import moment from "moment";
import Select from "react-select";

class roundural extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      RoundList: [],
      round: "",
      modal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      nameOptions: [],
      selectedName: "All", // Add this state to keep track of the selected name
      //Filters
      // nameFilter: "",
      roundsFilter: "",
      scheme_nameFilter: "",
      issue_dateFilter: "",
      closing_dateFilter: "",
      statusFilter: "",
      //Sorting
      roundsSort: "asc",
      scheme_nameSort: "asc",
      statusSort: "asc",
      issue_dateSort: "asc",
      closing_dateSort: "asc",
      //Array of objects
      feedbackListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, round) => <>{round.id}</>,
          filter: textFilter(),
        },
        {
          dataField: "scheme_name",
          text: "Scheme Name",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.scheme_nameFilter}
                    onChange={e =>
                      this.handleFilterChange("scheme_nameFilter", e)
                    }
                    className="form-control"
                  />
                </div>
                <div>
                  {column.text}{" "}
                  {column.sort ? (
                    <i
                      className={
                        this.state.scheme_nameSort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{ color: "red" }}
                      onClick={() => this.handleSort("scheme_name")}
                    ></i>
                  ) : null}
                </div>
              </>
            );
          },
        },
        {
          dataField: "rounds",
          text: "Number of Rounds",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.roundsFilter}
                    onChange={e => this.handleFilterChange("roundsFilter", e)}
                    className="form-control"
                  />
                </div>
                <div>
                  {column.text}{" "}
                  {column.sort ? (
                    <i
                      className={
                        this.state.roundsSort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{ color: "red" }}
                      onClick={() => this.handleSort("rounds")}
                    ></i>
                  ) : null}
                </div>
              </>
            );
          },
          // filter: textFilter(),
        },
        {
          dataField: "issue_date",
          text: "Issue Date",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.issue_dateFilter}
                    onChange={e =>
                      this.handleFilterChange("issue_dateFilter", e)
                    }
                    className="form-control"
                  />
                </div>
                <div>
                  {column.text}{" "}
                  {column.sort ? (
                    <i
                      className={
                        this.state.issue_dateSort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{ color: "red" }}
                      onClick={() => this.handleSort("issue_date")}
                    ></i>
                  ) : null}
                </div>
              </>
            );
          },
          formatter: (cellContent, round) => (
            <>
              <span>
                {moment(round.issue_date).format("DD MMM YYYY, h:mm A")}
              </span>
            </>
          ),
        },
        {
          dataField: "closing_date",
          text: "Closing Date",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.closing_dateFilter}
                    onChange={e =>
                      this.handleFilterChange("closing_dateFilter", e)
                    }
                    className="form-control"
                  />
                </div>
                <div>
                  {column.text}{" "}
                  {column.sort ? (
                    <i
                      className={
                        this.state.closing_dateSort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{ color: "red" }}
                      onClick={() => this.handleSort("closing_date")}
                    ></i>
                  ) : null}
                </div>
              </>
            );
          },
          formatter: (cellContent, round) => (
            <>
              <span>
                {moment(round.closing_date).format("DD MMM YYYY, h:mm A")}
              </span>
            </>
          ),
        },

        {
          dataField: "status",
          text: "Round Status",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.statusFilter}
                    onChange={e => this.handleFilterChange("statusFilter", e)}
                    className="form-control"
                  />
                </div>
                <div>
                  {column.text}{" "}
                  {column.sort ? (
                    <i
                      className={
                        this.state.statusSort === "asc"
                          ? "fa fa-arrow-up"
                          : "fa fa-arrow-down"
                      }
                      style={{ color: "red" }}
                      onClick={() => this.handleSort("status")}
                    ></i>
                  ) : null}
                </div>
              </>
            );
          },
        },
        // {
        //   dataField: "status",
        //   text: "Results Status",
        //   sort: true,
        //   headerFormatter: (column, colIndex) => {
        //     return (
        //       <>
        //         <div>
        //           <input
        //             type="text"
        //             value={this.state.statusFilter}
        //             onChange={e => this.handleFilterChange("statusFilter", e)}
        //             className="form-control"
        //           />
        //         </div>
        //         <div>
        //           {column.text}{" "}
        //           {column.sort ? (
        //             <i
        //               className={
        //                 this.state.statusSort === "asc"
        //                   ? "fa fa-arrow-up"
        //                   : "fa fa-arrow-down"
        //               }
        //               style={{ color: "red" }}
        //               onClick={() => this.handleSort("status")}
        //             ></i>
        //           ) : null}
        //         </div>
        //       </>
        //     );
        //   },
        // },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, round) => (
            <Col>
              <Tooltip title="Report">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-file-chart font-size-18"
                    id="edittooltip"
                    // onClick={() => this.handleEditBtnClick(round)}
                  ></i>
                </Link>
              </Tooltip>
              <Tooltip title="Download Result">
                <Link
                  // className="fas fa-comment font-size-18"
                  className="mdi mdi-cloud-download font-size-18"
                  // to={`/csr-notes-complains/${complaint.id}`}
                ></Link>
              </Tooltip>
            </Col>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.handleNameFilterChange = this.handleNameFilterChange.bind(this); // Bind the handler
  }

  componentDidMount() {
    const { RoundList, onGetRoundList } = this.props;
    console.log("DDDDDDDDDD", RoundList);
    onGetRoundList(this.state.user_id);
    this.setState({ RoundList });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  handleFilterChange = (scheme_nameFilter, e) => {
    this.setState({ [scheme_nameFilter]: e.target.value });
  };
  // Filter data based on filter values

  filterData = () => {
    const { RoundList } = this.props;
    const {
      selectedName,
      roundsFilter,
      scheme_nameFilter,
      issue_dateFilter,
      closing_dateFilter,
      statusFilter,
    } = this.state;

    let filteredData = RoundList;

    // Filter by selected name
    if (selectedName !== "All") {
      filteredData = filteredData.filter(
        entry => entry.scheme_name === selectedName
      );
    }

    filteredData = filteredData.filter(entry => {
      const rounds = entry.rounds ? entry.rounds.toString() : "";
      const scheme_name = entry.scheme_name
        ? entry.scheme_name.toLowerCase()
        : "";
      const status = entry.status ? entry.status.toLowerCase() : "";

      const issue_date = entry.issue_date ? entry.issue_date.toString() : "";
      const closing_date = entry.closing_date
        ? entry.closing_date.toString()
        : "";
      return (
        // name.includes(nameFilter.toLowerCase()) &&
        rounds.includes(roundsFilter.toLowerCase()) &&
        scheme_name.includes(scheme_nameFilter.toLowerCase()) &&
        status.includes(statusFilter.toLowerCase()) &&
        issue_date.includes(issue_dateFilter) &&
        closing_date.includes(closing_dateFilter)
      );
    });

    return filteredData;
  };

  // sorting the data
  handleSort = field => {
    const newSortOrder = this.state[field + "Sort"] === "asc" ? "desc" : "asc";
    this.setState({ [field + "Sort"]: newSortOrder }, () => {
      this.sortData(field, newSortOrder);
    });
  };

  sortData = (field, order) => {
    const { RoundList } = this.state;
    if (!Array.isArray(RoundList)) {
      return;
    }

    const sortedData = [...RoundList].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Ensure both values are strings for case-insensitive comparison
      aValue = aValue.toString().toLowerCase();
      bValue = bValue.toString().toLowerCase();

      if (order === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    this.setState({ RoundList: sortedData });
  };

  componentDidUpdate(prevProps) {
    const { RoundList } = this.props;
    if (RoundList !== prevProps.RoundList && !isEmpty(RoundList)) {
      const uniqueNames = uniq(RoundList.map(item => item.scheme_name));
      this.setState({ nameOptions: ["All", ...uniqueNames] });
    }
  }

  // componentDidUpdate(prevProps) {
  //   const { RoundList } = this.props;
  //   if (
  //     !isEmpty(this.props.RoundList) &&
  //     size(prevProps.RoundList) !== size(this.props.RoundList)
  //   ) {
  //     this.setState({ RoundList: this.props.RoundList });
  //   }
  // }

  // handleNameFilterChange(event) {
  //   this.setState({ selectedName: event.target.value });
  // }

  handleNameFilterChange(selectedOption) {
    // selectedOption will be an object { value: 'selectedValue', label: 'selectedLabel' }
    this.setState({
      selectedName: selectedOption ? selectedOption.value : "All",
    });
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
    const { SearchBar } = Search;

    const { RoundList } = this.props;
    const { nameOptions, selectedName } = this.state;

    const { onGetRoundList } = this.props;
    const round = this.state.RoundList;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: RoundList.length, // replace later with size(round),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    // Filter RoundList based on the selectedName
    const filteredroundList =
      selectedName === "All"
        ? RoundList
        : RoundList.filter(round => round.scheme_name === selectedName);

    const schemeName = nameOptions.map(scheme_name => ({
      value: scheme_name,
      label: scheme_name,
    }));
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Rounds</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="" breadcrumbItem="" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      // data={RoundList}
                      data={filteredroundList} // Use filtered list here
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          // data={RoundList}
                          data={filteredroundList} // Use filtered list here
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                {/* <Col sm="3" lg="3">
                                  <div className="ms-2 mb-4">
                                    <div className="">
                                      <div>
                                        <Label
                                          for="nameFilter"
                                          className="form-label"
                                        >
                                          <strong>Search Type</strong>
                                        </Label>
                                        <select
                                          className="form-select"
                                          // name="nameFilter"
                                          id="nameFilter"
                                          value={selectedName}
                                          onChange={this.handleNameFilterChange}
                                          // size={5} // Set the size here
                                          // style={{ height: '50px' }} // Set the desired height here
                                        >
                                          {nameOptions.map(name => (
                                            <option key={name} value={name}>
                                              {name}
                                            </option>
                                          ))}
                                        </select>
                                        <p className="text-danger font-size-10">
                                          Filter the names
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </Col> */}

                                {/* workingg */}
                                <Col xs="4" sm="4" md="3" lg="3">
                                  <div className="mb-3">
                                    <Select
                                      onChange={this.handleNameFilterChange}
                                      options={schemeName}
                                      placeholder="Select Name..."
                                      isSearchable={true}
                                      isClearable={true}
                                      // Find the matching option
                                      value={
                                        selectedName === "All"
                                          ? null
                                          : schemeName.find(
                                              option =>
                                                option.value === selectedName
                                            )
                                      } // Find the matching option
                                      styles={{
                                        control: (provided, state) => ({
                                          ...provided,
                                          border: "2px solid blue",
                                          borderRadius: "5px",
                                        }),
                                        // Add more style overrides as needed
                                      }}
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
                                      defaultSorted={defaultSorted}
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                      // filter={filterFactory()}
                                      data={this.filterData()}
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

roundural.propTypes = {
  match: PropTypes.object,
  RoundList: PropTypes.array,

  className: PropTypes.any,
  onGetRoundList: PropTypes.func,

  error: PropTypes.any,
  success: PropTypes.any,
};

const mapStateToProps = ({ RoundList }) => ({
  RoundList: RoundList.RoundList,
});

const mapDispatchToProps = dispatch => ({
  onGetRoundList: id => dispatch(getroundlist(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(roundural));
