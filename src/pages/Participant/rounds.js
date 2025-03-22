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
import Tooltip from "@material-ui/core/Tooltip";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import Select from "react-select";
import { getSelectedSchemesList } from "store/selected-scheme/actions";
import { isEmpty, uniq } from "lodash";
import moment from "moment";
import { getcyclelist } from "store/cycle/actions";
import ListUnit from "store/databaseofunits/reducer";
import CycleList from "store/cycle/reducer";

class Roundural extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      SelectedSchemeList: [],
      CycleList: [],
      organization_name: "",
      selectedName: "All", // ✅ Default to "All"
      selectedCycle: "Active", // ✅ Default to "All"
      modal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : null, // ✅ Default to null instead of empty string
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
            return round.scheme_name; // Display only the scheme name without a link
          },
        },
        {
          dataField: "cycle_no",
          text: "Cycle No (Status)",
          sort: true,
          formatter: (cellContent, row) => {
            return `${row.cycle_no || "N/A"} (${
              row.cycle_status || "Unknown"
            })`; // ✅ Now includes cycle_status
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
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, round) => {
            const { organization_name } = this.state;
            return (
              <div className="d-flex justify-content-center gap-3 ml-3">
                <Tooltip title="Results">
                  <Link
                    className="fas fa-file-alt font-size-18 text-success"
                    to={`/${organization_name}/${round.id}/${round.participant_id}/participantsResults`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!organization_name) {
                        console.error("Invalid organization name");
                        return;
                      }
                      const url = `/${organization_name}/${round.id}/${round.participant_id}/participantsResults`;
                      console.log("Navigating to:", url);
                      this.props.history.push(url);
                    }}
                  ></Link>
                </Tooltip>

                {/* History Icon */}
                <Tooltip title="History">
                  <Link
                    className="fas fa-comment font-size-18"
                    to={`/${organization_name}/rounds-history/${round.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!organization_name) {
                        console.error("Invalid organization name");
                        return;
                      }
                      const url = `/${organization_name}/rounds-history/participant/${round.id}`;
                      console.log("Navigating to:", url);
                      this.props.history.push(url);
                    }}
                  ></Link>
                </Tooltip>

                {/* Add Result Icon */}
              </div>
            );
          },
        },
      ],
    };
    this.handleNameFilterChange = this.handleNameFilterChange.bind(this);
  }

  // componentDidMount() {
  //   const { organization_name } = this.props.match.params;
  //   this.setState({ organization_name });
  //   console.log("Fetching Cycle List...");
  //   this.props.onGetRoundList(this.state.user_id);
  //     this.props.onGetCycleList(this.state.user_id);

  //   setTimeout(() => {
  //     console.log("CycleList after API call:", this.props.CycleList); // ✅ Log CycleList after fetching
  //   }, 3000); // ✅ Delay to allow Redux state update
  // }
  componentDidMount() {
    const { organization_name } = this.props.match.params;
    this.setState({ organization_name });

    console.log("🚀 Component Mounted: Fetching Round List and Cycle List");

    const user_id = this.state.user_id;
    if (!user_id) {
      console.error(
        "❌ Error: user_id is missing or undefined! API calls will fail."
      );
      return;
    }

    console.log("🔍 Debug: Fetching rounds and cycles for user_id:", user_id);

    this.props.onGetRoundList(user_id);
    this.props.onGetCycleList(user_id);

    setTimeout(() => {
      console.log(
        "📊 Redux SelectedSchemeList after API call:",
        this.props.SelectedSchemeList
      );
      console.log("📊 Redux CycleList after API call:", this.props.CycleList);

      // ✅ Set default selected options to "All" after data loads
      this.setState({
        SelectedSchemeList: this.props.SelectedSchemeList,
        selectedScheme: "All",
        selectedCycle: "Active",
      });
    }, 3000);
  }

  // componentDidUpdate(prevProps) {
  //   const { SelectedSchemeList, CycleList } = this.props;
  //   if (
  //     SelectedSchemeList !== prevProps.SelectedSchemeList &&
  //     !isEmpty(SelectedSchemeList)
  //   ) {
  //     const uniqueNames = uniq(
  //       SelectedSchemeList.map(item => item.scheme_name)
  //     );
  //     this.setState({
  //       SelectedSchemeList,
  //       nameOptions: ["All", ...uniqueNames],
  //     });
  //   }
  //   if (prevProps.CycleList !== this.props.CycleList) {
  //     console.log("CycleList updated in props:", this.props.CycleList); // ✅ Debugging log
  //     this.setState({ CycleList: this.props.CycleList });
  // }
  // }

  componentDidUpdate(prevProps) {
    const { SelectedSchemeList, CycleList } = this.props;

    // ✅ Ensure SelectedSchemeList updates when new data comes in
    if (
      SelectedSchemeList !== prevProps.SelectedSchemeList &&
      Array.isArray(SelectedSchemeList) &&
      SelectedSchemeList.length > 0
    ) {
      console.log("✅ Loaded SelectedSchemeList:", SelectedSchemeList);

      this.setState({
        SelectedSchemeList,
        nameOptions: [
          "All",
          ...uniq(SelectedSchemeList.map((item) => item.scheme_name)),
        ],
      });
    }

    // ✅ Ensure CycleList updates correctly
    if (
      CycleList !== prevProps.CycleList &&
      Array.isArray(CycleList) &&
      CycleList.length > 0
    ) {
      console.log("✅ Loaded CycleList:", CycleList);
      this.setState({ CycleList });
    }
  }

  handleNameFilterChange(selectedOption) {
    this.setState(
      { selectedScheme: selectedOption ? selectedOption.value : "All" },
      () => {
        console.log("✅ Updated Selected Scheme:", this.state.selectedScheme);
        this.forceUpdate(); // ✅ Ensure the component re-renders
      }
    );
  }

  handleCycleFilterChange(selectedOption) {
    this.setState(
      { selectedCycle: selectedOption ? selectedOption.value : "Active" },
      () => {
        console.log("✅ Updated Selected Cycle:", this.state.selectedCycle);
        this.forceUpdate(); // ✅ Ensure the component re-renders
      }
    );
  }

  handleCycleStatusChange = (selectedOption) => {
    this.setState(
      { selectedCycleStatus: selectedOption ? selectedOption.value : "Active" },
      () =>
        console.log("✅ Updated Cycle Status:", this.state.selectedCycleStatus)
    );
  };

  // filterData() {
  //   const { SelectedSchemeList, selectedName, selectedCycle } = this.state;
  //   if (selectedName === "All") {
  //     return SelectedSchemeList;
  //   }
  //   return SelectedSchemeList.filter(entry =>
  //     (selectedName === "All" || entry.scheme_name === selectedName) && // ✅ Filter by scheme
  //     (selectedCycle === "All" || entry.cycle_no === selectedCycle) // ✅ Filter by cycle
  //   );
  //   return SelectedSchemeList.filter(
  //     entry => entry.scheme_name === selectedName,
  //     entry => entry.cycle_no === selectedCycle
  //   );
  // }

  // filterData() {
  //   const { SelectedSchemeList, selectedName, selectedCycle } = this.state;

  //   console.log("🔍 Selected Scheme:", selectedName);
  //   console.log("🔍 Selected Cycle:", selectedCycle);
  //   console.log("📊 Full List Before Filtering:", SelectedSchemeList);

  //   if (!SelectedSchemeList || SelectedSchemeList.length === 0) {
  //     console.warn("⚠️ No data available in SelectedSchemeList!");
  //     return [];
  //   }

  //   return SelectedSchemeList.filter(entry => {
  //     const schemeMatch = selectedName === "All" || entry.scheme_name === selectedName;
  //     const cycleMatch =
  //       selectedCycle === "All" ||
  //       (selectedCycle === "Active" && entry.status?.toLowerCase() === "active") ||
  //       (selectedCycle === "Inactive" && entry.status?.toLowerCase() === "inactive") ||
  //       (entry.cycle_no && entry.cycle_no.toString() === selectedCycle);

  //     return schemeMatch && cycleMatch;
  //   });
  // }

  filterData() {
    const { SelectedSchemeList, selectedScheme, selectedCycle } = this.state;

    console.log("🔍 Selected Scheme:", selectedScheme);
    console.log("🔍 Selected Cycle:", selectedCycle);
    console.log("📊 Full List Before Filtering:", SelectedSchemeList);

    if (!Array.isArray(SelectedSchemeList) || SelectedSchemeList.length === 0) {
      console.warn("⚠️ No data available in SelectedSchemeList!");
      return [];
    }

    return SelectedSchemeList.filter((entry) => {
      const schemeMatch =
        selectedScheme === "All" || entry.scheme_name === selectedScheme;
      const cycleMatch =
        selectedCycle === "All" || entry.cycle_status === selectedCycle; // ✅ Now filters by cycle_status

      return schemeMatch && cycleMatch;
    });
  }

  //  S

  render() {
    const { SearchBar } = Search;
    const { nameOptions, selectedName, selectedCycle } = this.state;

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
    const filteredCycles = this.filterData();
    const cycle_no = nameOptions.map((cycle_no) => {
      console.log("Cycle name:", CycleList);
      return {
        value: cycle_no,
        labe: cycle_no,
      };
    });

    console.log("Final schemeName:", schemeName); // Logs the final array after map is complete

    // ✅ Fix: Ensure `CycleList` is always an array
    const cycleOptions = [
      // { value: "All", label: "All" },
      { value: "Active", label: "Active" },
      { value: "inactive", label: "inactive" },
      ...(Array.isArray(this.props.CycleList)
        ? this.props.CycleList.map((cycle) => ({
            value: cycle.cycle_no, // ✅ Use cycle number instead of ID
            label: cycle.cycle_no,
          }))
        : []),
    ];

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
                          {(toolkitprops) => (
                            <React.Fragment>
                              <Row className="mb-2">
                                {/* Select Scheme */}
                                <Col xs="4" sm="4" md="3" lg="3">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Select Scheme
                                    </label>

                                    <Select
                                      onChange={this.handleNameFilterChange}
                                      options={this.state.nameOptions.map(
                                        (name) => ({ value: name, label: name })
                                      )}
                                      placeholder="Select Scheme..."
                                      isClearable={true}
                                      value={
                                        this.state.selectedScheme
                                          ? {
                                              value: this.state.selectedScheme,
                                              label: this.state.selectedScheme,
                                            }
                                          : null
                                      }
                                    />
                                  </div>
                                </Col>

                                {/* Select Cycle */}
                                <Col xs="4" sm="4" md="3" lg="3">
                                  <div className="mb-3">
                                    <label className="form-label">
                                      Select Cycle
                                    </label>
                                    <Select
                                      onChange={(selectedOption) =>
                                        this.setState({
                                          selectedCycle: selectedOption
                                            ? selectedOption.value
                                            : "Active",
                                        })
                                      }
                                      options={[
                                        { value: "Active", label: "Active" },
                                        {
                                          value: "inactive",
                                          label: "inactive",
                                        },
                                        ...(Array.isArray(this.props.CycleList)
                                          ? this.props.CycleList.map(
                                              (cycle) => ({
                                                value: cycle.cycle_no, // ✅ Use cycle_no for filtering
                                                label: `${cycle.cycle_no} (${cycle.status})`, // ✅ Show status next to cycle_no
                                              })
                                            )
                                          : []),
                                      ]}
                                      placeholder="Select Cycle..."
                                      isClearable={true}
                                      value={
                                        this.state.selectedCycle
                                          ? {
                                              value: this.state.selectedCycle,
                                              label: this.state.selectedCycle,
                                            }
                                          : null
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
  CycleList: PropTypes.array,
  SelectedSchemeList: PropTypes.array,
  onGetCycleList: PropTypes.func, // Fix: Add this line
  className: PropTypes.any,
  onGetRoundList: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
const mapStateToProps = (state) => {
  console.log("🟢 Redux State:", state); // ✅ Debug full Redux state
  console.log(
    "🔵 SelectedSchemeList from Redux:",
    state.SelectedSchemeList?.SelectedSchemeList
  );
  console.log("🟣 CycleList from Redux:", state.CycleList);

  return {
    SelectedSchemeList:
      state.SelectedSchemeList?.SelectedSchemeList?.map((item) => ({
        ...item,
        cycle_status: item.cycle_status || "Unknown", // ✅ Ensure cycle_status is always available
      })) || [],
    CycleList: state.CycleList || [], // ✅ Ensure CycleList is not undefined
  };
};

console.log("CycleList:", CycleList);

const mapDispatchToProps = (dispatch) => ({
  onGetRoundList: (id) => dispatch(getSelectedSchemesList(id)),
  onGetCycleList: (id) => dispatch(getcyclelist(id)), // ✅ Correct name
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Roundural));
