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
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Tooltip from "@material-ui/core/Tooltip";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Alert,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import { getSchemelist } from "store/scheme/actions";
import { getcyclelist } from "store/cycle/actions";
// import { getSamplelist } from "store/sample/actions";
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getSamplelist, updateSampleList } from "store/sample/actions";

import {
  getroundlist,
  addNewRoundList,
  updateRoundList,
  deleteRound,
} from "store/rounds/actions";

import { isEmpty, size } from "lodash";
import DeleteModal from "components/Common/DeleteModal";
import "assets/scss/table.scss";
import moment from "moment";
class InstrumentType extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.handleSchemeChange = this.handleSchemeChange.bind(this);
    this.state = {
      filteredCycleList: this.props.CycleList,
      filteredSampleList: this.props.ListUnitt,
      selectedRound: null,
      isEdit: false,
      organization_name: "",
      selectedSchemeId: "", // New state
      selectedFormSchemeId: "", // for modal form
      idFilter: "",
      roundsFilter: "",
      schemenameFilter: "",
      cyclenoFilter: "",
      sampleFilter: "",
      participantsFilter: "",
      issuedateFilter: "",
      closingdateFilter: "",
      notesFilter: "",
      statusFilter: "",
      errorMessage: "",
      RoundList: [],
      round: [],
      SchemeList: [],
      CycleList: [],
      // sample: [],
      ListUnitt: [],
      methodlist: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      successMessage: "",
      feedbackListColumns: [
        {
          text: "ID",
          dataField: "id",
          sort: true,
          hidden: false,
          formatter: (cellContent, methodlist) => <>{methodlist.id}</>,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div style={{ textAlign: "center", marginBottom: "5px" }}>
                  {column.text}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.idFilter}
                    onChange={e => this.handleFilterChange("idFilter", e)}
                    className="form-control"
                  />
                </div>
              </>
            );
          },
        },
        {
          dataField: "rounds",
          text: "Round No",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <div style={{ textAlign: "center" }}>
                <div>{column.text}</div>
                <div style={{ marginTop: "5px" }}>
                  <input
                    type="text"
                    value={this.state.roundsFilter}
                    onChange={e => this.handleFilterChange("roundsFilter", e)}
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                      margin: "auto",
                    }}
                  />
                </div>
              </div>
            );
          },
        },
        {
          dataField: "scheme_name",
          text: "Scheme Name",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <div style={{ textAlign: "center" }}>
                <div>{column.text}</div>
                <div style={{ marginTop: "5px" }}>
                  <input
                    type="text"
                    value={this.state.schemenameFilter}
                    onChange={e =>
                      this.handleFilterChange("schemenameFilter", e)
                    }
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                      margin: "auto",
                    }}
                  />
                </div>
              </div>
            );
          },
        },
        {
          dataField: "cycle_no",
          text: "Cycle Number",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <div style={{ textAlign: "center" }}>
                <div>{column.text}</div>
                <div style={{ marginTop: "5px" }}>
                  <input
                    type="text"
                    value={this.state.cyclenoFilter}
                    onChange={e => this.handleFilterChange("cyclenoFilter", e)}
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                      margin: "auto",
                    }}
                  />
                </div>
              </div>
            );
          },
        },
        {
          dataField: "sample",
          text: "Sample Name",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <div style={{ textAlign: "center" }}>
                <div>{column.text}</div>
                <div style={{ marginTop: "5px" }}>
                  <input
                    type="text"
                    value={this.state.sampleFilter}
                    onChange={e => this.handleFilterChange("sampleFilter", e)}
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                      margin: "auto",
                    }}
                  />
                </div>
              </div>
            );
          },
        },
        {
          dataField: "nooflabs",
          text: "Number of Participants",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <div style={{ textAlign: "center" }}>
                <div>{column.text}</div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "5px",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.participantsFilter}
                    onChange={e =>
                      this.handleFilterChange("participantsFilter", e)
                    }
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "160px",
                      margin: "auto",
                    }}
                  />
                </div>
              </div>
            );
          },
          formatter: (cell, row) => {
            return (
              <Link
                to={`/round-participant-list/${row.id}`}
                style={{ textDecoration: "underline", color: "#0000CD" }}
                onClick={() =>
                  console.log(
                    `Navigating to payment-scheme-list with ID: ${row.id}`
                  )
                }
              >
                {cell}
              </Link>
            );
          },
        },
                {
  dataField: "noofresults",
  text: "Submitted Results",
  sort: true,
  formatter: (cell, row) => {
    return (
      <Link
        to={`/submitted-participants/${row.id}`}  // Navigate to a new page using round ID
        style={{ textDecoration: "underline", color: "#0000CD" }}
      >
        {cell}
      </Link>
    );
  },
  headerFormatter: (column, colIndex) => {
    return (
      <div style={{ textAlign: "center" }}>
        <div>{column.text}</div>
        <div style={{ marginTop: "5px" }}>
          <input
            type="text"
            value={this.state.roundsFilter}
            onChange={e => this.handleFilterChange("roundsFilter", e)}
            className="form-control"
            style={{
              textAlign: "center",
              width: "100px",
              margin: "auto",
            }}
          />
        </div>
      </div>
    );
  }
},
        {
          dataField: "issue_date",
          text: "Issue Date",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <div style={{ textAlign: "center" }}>
                <div>{column.text}</div>
                <div style={{ marginTop: "5px" }}>
                  <input
                    type="text"
                    value={this.state.issuedateFilter}
                    onChange={e =>
                      this.handleFilterChange("issuedateFilter", e)
                    }
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                      margin: "auto",
                    }}
                  />
                </div>
              </div>
            );
          },
          formatter: (cellContent, methodlist) => (
            <span>{moment(methodlist.issue_date).format("DD MMM YYYY")}</span>
          ),
        },
        {
          dataField: "closing_date",
          text: "Closing Date",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <div style={{ textAlign: "center" }}>
                <div>{column.text}</div>
                <div style={{ marginTop: "5px" }}>
                  <input
                    type="text"
                    value={this.state.closingdateFilter}
                    onChange={e =>
                      this.handleFilterChange("closingdateFilter", e)
                    }
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                      margin: "auto",
                    }}
                  />
                </div>
              </div>
            );
          },
          formatter: (cellContent, methodlist) => (
            <span>{moment(methodlist.closing_date).format("DD MMM YYYY")}</span>
          ),
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
          headerFormatter: (column, colIndex) => {
            const canShowReportAvailable = this.props.RoundList?.some(round => {
              return round.status === "Closed" && round.statistics_status === "Complete";
            });
          
            return (
              <div style={{ textAlign: "center" }}>
                <div>{column.text}</div>
                <div style={{ marginTop: "5px" }}>
                  <select
                    value={this.state.statusFilter}
                    onChange={e => this.handleFilterChange("statusFilter", e)}
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                      margin: "auto",
                    }}
                  >
                    <option value="">All</option>
                    <option value="Created">Created</option>
                    <option value="Ready">Ready</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    {/* {canShowReportAvailable && (
                      <option value="Report Available">Report Available</option>
                    )} */}
                  </select>
                </div>
              </div>
            );
          },
          
          
          formatter: (cellContent, methodlist) => (
            <span>{methodlist.status || "Unknown"}</span>
          ),
        },
        // {
        //   dataField: 'link',
        //   text: '',
        // formatter: (cellContent, round) => {
        //   return (
        //     <Link to={`/add-labs-round-page/${round.id}`} style={{ textDecoration: 'underline', color: '#0000CD' }}>

        //       <span>Add Participants</span>
        //     </Link>

        //   );
        // }
        // },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          headerStyle: {
            textAlign: "center", // Center the text
            verticalAlign: "middle", // Align text in the center vertically
          },
          formatter: (cellContent, round) => {
            const { organization_name } = this.state;

            return (
              <div
                className="d-flex gap-3 ml-3"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Tooltip title="Add Participants">
                  <Link
                    to="#"
                    onClick={e => {
                      e.preventDefault(); // Prevent default navigation

                      // Check if organization_name is valid
                      if (!this.state.organization_name) {
                        return; // Prevent navigation if invalid
                      }

                      const url = `/${this.state.organization_name}/add-labs-round-page/${round.id}`;
                      this.props.history.push(url); // Navigate to the new URL
                    }}
                    style={{ textDecoration: "underline", color: "#008000" }}
                  >
                    <i
                      className="mdi mdi-account-plus-outline font-size-18"
                      id="participantsIcon"
                    ></i>
                  </Link>
                </Tooltip>

                {round.scheme_type === "Qualitative" &&
                  round.status === "Report Available" && (
                    <Tooltip title="Report">
                      <Link
                        to="#"
                        onClick={() => this.onClickReport(round.id)}
                        style={{
                          textDecoration: "underline",
                          color: "#008000",
                        }}
                      >
                        <i
                          className="mdi mdi-file-chart font-size-18"
                          id="reportIcon"
                        ></i>
                      </Link>
                    </Tooltip>
                  )}

                {/* {/ Show statistics icon only when the status is "Closed" or "Report Available" /} */}
                {(round.status === "Closed" ||
                  round.status === "Report Available") && (
                  <Tooltip title="Statistics">
                    <Link
                      to="#"
                      onClick={() => this.onClickStatistics(round)}
                      style={{ textDecoration: "underline", color: "#008000" }}
                    >
                      <i
                        className="mdi mdi-chart-bar font-size-18"
                        id="statisticsIcon"
                      ></i>
                    </Link>
                  </Tooltip>
                )}

                <Tooltip title="Update">
                  <Link className="text-success" to="#">
                    <i
                      className="mdi mdi-pencil font-size-18"
                      id="edittooltip"
                      onClick={() => this.toggle(round)}
                    ></i>
                  </Link>
                </Tooltip>

                {(round.status === "Created" || round.status === "Ready") && ( // Changed condition here
                  <Tooltip title="Delete">
                    <Link className="text-danger" to="#">
                      <i
                        className="mdi mdi-delete font-size-18"
                        id="deletetooltip"
                        onClick={() => this.onClickDelete(round)}
                      ></i>
                    </Link>
                  </Tooltip>
                )}

                <Tooltip title="History">
                  <Link
                    className="fas fa-comment font-size-18"
                    to={`/${organization_name}/rounds-history/${round.id}`}
                    onClick={e => {
                      e.preventDefault(); // Prevent the default navigation

                      // Check if organization_name is valid
                      if (!this.state.organization_name) {
                        console.error("Invalid organization name");
                        return; // Prevent navigation if invalid
                      }

                      const url = `/${this.state.organization_name}/rounds-history/${round.id}`;
                      this.props.history.push(url); // Navigate to the new URL
                    }}
                  ></Link>
                </Tooltip>
              </div>
            );
          },
        },
      ],
    };

    this.toggle = this.toggle.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickStatistics = this.onClickStatistics.bind(this);
  }

  handleSchemeChange = e => {
    const selectedSchemeId = parseInt(e.target.value);
    this.setState({ selectedFormSchemeId: selectedSchemeId }); // ✅ only affect modal

    console.log("Selected Scheme ID:", selectedSchemeId);
    console.log("CycleList:", this.props.CycleList);
    console.log("ListUnitt (Samples):", this.props.ListUnitt);
    console.log("RoundList:", this.props.RoundList);

    // ✅ Ensure `CycleList` and `ListUnitt` exist before filtering
    if (
      !this.props.CycleList ||
      !this.props.ListUnitt ||
      !this.props.RoundList
    ) {
      console.error("Data is missing!");
      return;
    }

    // Filter CycleList and SampleList based on the selected scheme
    const filteredCycleList = this.props.CycleList.filter(
      cycle => cycle.scheme_id === selectedSchemeId
    );

    console.log("Filtered Cycle List:", filteredCycleList);
    const filteredSampleList = this.props.ListUnitt.filter(
      sample =>
        sample.scheme_id === selectedSchemeId &&
        !this.props.RoundList.some(
          round =>
            round.sample === sample.samplename &&
            round.id !== this.state.selectedRound?.id // Exclude current round's sample
        )
    );

    console.log("Filtered Sample List:", filteredSampleList);

    console.log("Final Filtered Sample List:", filteredSampleList);
    console.log("Filtered sample List:", filteredSampleList);

    this.setState({
      filteredCycleList,
      filteredSampleList,
    });
  };

  componentDidMount() {
    const { organization_name } = this.props.match.params;

    // Only set state if organization_name is empty
    if (!this.state.organization_name) {
      this.setState({ organization_name });
    }

    const {
      onGetRoundList,
      onGetgetschemelist,
      onGetgetcyclelist,
      onGetgetSamplelistlist,
    } = this.props;
    const userId = this.state.user_id;

    onGetRoundList(userId);
    onGetgetschemelist(userId);
    onGetgetcyclelist(userId);
    onGetgetSamplelistlist(userId);
  }

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  handleDeleteRound = () => {
    const { onDeleteRound, onGetRoundList } = this.props;
    const { RoundList } = this.state;
    if (RoundList.id !== undefined) {
      onDeleteRound(RoundList);
      setTimeout(() => {
        onGetRoundList(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  // onClickDelete = RoundList => {
  //   this.setState({ RoundList: RoundList });
  //   this.setState({ deleteModal: true });
  // };

  onClickDelete = RoundList => {
    // Allowed statuses for deletion
    const allowedStatuses = ["Open", "Closed", "Report Available"];

    if (allowedStatuses.includes(RoundList.status)) {
      this.setState({
        errorMessage: `Cannot delete. Round status is ${RoundList.status}`,
      });
      // Clear error message after 2 seconds
      setTimeout(() => {
        this.setState({ errorMessage: "" });
      }, 2000);
    } else {
      this.setState({ RoundList: RoundList });
      this.setState({ deleteModal: true });
    }
  };

  displaySuccessMessage = message => {
    this.setState({ successMessage: message });

    setTimeout(() => {
      this.setState({ successMessage: "", modal: false });
    }, 3000);
  };

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  onClickStatistics = round => {
    if (round && round.id) {
      if (round.status === "Closed") {
        // Automatically change status to "Report Available" if Statistics completed
        const updatedRound = {
          ...round,
          status: "Report Available",
        };
  
        this.props.onUpdateRound(round.id, updatedRound);
  
        // OPTIONAL: reload RoundList after small delay
        setTimeout(() => {
          this.props.onGetRoundList(this.state.user_id);
        }, 500);
      }
  
      this.props.history.push(
        `/${this.state.organization_name}/statistics/${round.id}`
      );
    }
  };
  
  onClickReport = id => {
    this.props.history.push(
      `/${this.state.organization_name}/slectValues/${id}`
    );
  };

  toggle(round) {
    const { onGetgetschemelist } = this.props;

    // Ensure the scheme list is fetched
    onGetgetschemelist(this.state.user_id);

    if (round && round.id) {
      this.setState(
        {
          modal: true,
          selectedRound: round,
          selectedFormSchemeId: round.scheme,
          selectedCycle: round.cycle_no,
          selectedSample: round.sample || "", // Set the previously selected sample
          isEdit: true,
        },
        () => {
          console.log("Selected Sample in State:", this.state.selectedSample);
          // ⏳ Delay the execution of handleSchemeChange to ensure state updates first
          setTimeout(() => {
            this.handleSchemeChange({ target: { value: round.scheme } });
          }, 100);
        }
      );
    } else {
      this.setState({
        modal: true,
        selectedRound: null,
        selectedSchemeId: null,
        selectedCycle: null,
        selectedSample: null,
        isEdit: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      !isEmpty(this.props.RoundList) &&
      size(prevProps.RoundList) !== size(this.props.RoundList)
    ) {
      console.log("Debug RoundList data:", this.props.RoundList);
      this.setState({ RoundList: this.props.RoundList });
    }
    if (
      !isEmpty(this.props.SchemeList) &&
      size(prevProps.SchemeList) !== size(this.props.SchemeList)
    ) {
      this.setState({ SchemeList: this.props.SchemeList });
    }
    if (
      !isEmpty(this.props.CycleList) &&
      size(prevProps.CycleList) !== size(this.props.CycleList)
    ) {
      this.setState({ CycleList: this.props.CycleList });
    }
    if (
      !isEmpty(this.props.ListUnitt) &&
      size(prevProps.ListUnitt) !== size(this.props.ListUnitt)
    ) {
      this.setState({ ListUnitt: this.props.ListUnitt });
    }
    if (prevProps.SchemeList !== this.props.SchemeList) {
      this.setState({ SchemeList: this.props.SchemeList });
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
  closeModal = () => {
    this.setState({ modal: false });
  };

  render() {
    const { SearchBar } = Search;
    const { RoundList, SchemeList, CycleList, ListUnitt } = this.props;
    // console.log('SchemeList in render:', SchemeList);

    const { isEdit, deleteModal, errorMessage } = this.state;
    const round = this.state.round;
    const {
      onGetRoundList,
      onGetgetschemelist,
      onGetgetcyclelist,
      onGetgetSamplelistlist,
      onAddNewRound,
      onUpdateRound,
    } = this.props;

    const {
      idFilter,
      roundsFilter,
      schemenameFilter,
      cyclenoFilter,
      sampleFilter,
      participantsFilter,
      issuedateFilter,
      closingdateFilter,
      notesFilter,
      statusFilter,
    } = this.state;

    const filteredData = (RoundList || []).filter(entry => {
      // Modify accordingly for each filter condition
      const id = entry.id ? entry.id.toString() : "";
      const rounds = entry.rounds ? entry.rounds.toString() : "";
      const scheme_name = entry.scheme_name
        ? entry.scheme_name.toString().toLowerCase()
        : "";
      const cycle_no = entry.cycle_no
        ? entry.cycle_no.toString().toLowerCase()
        : "";
      const sample = entry.sample ? entry.sample.toString() : "";
      const participants = entry.participants
        ? entry.participants.toString()
        : "";
      const issue_date = entry.issue_date ? entry.issue_date.toString() : "";
      const closing_date = entry.closing_date
        ? entry.closing_date.toString()
        : "";
      const note = entry.note ? entry.note.toString() : "";
      const status = entry.status ? entry.status.toString() : "";
      const scheme_type = entry.scheme_type ? entry.scheme_type.toString() : "";

      const matchesScheme =
        !this.state.selectedSchemeId ||
        entry.scheme?.toString() === this.state.selectedSchemeId.toString();

      return (
        id.includes(idFilter) &&
        rounds.includes(roundsFilter) &&
        scheme_name.includes(schemenameFilter.toLowerCase()) &&
        cycle_no.includes(cyclenoFilter.toLowerCase()) &&
        sample.includes(sampleFilter) &&
        participants.includes(participantsFilter) &&
        issue_date.includes(issuedateFilter) &&
        closing_date.includes(closingdateFilter) &&
        note.includes(notesFilter) &&
        status.includes(statusFilter) &&
        matchesScheme
        // scheme_type
      );
    });

    const pageOptions = {
      sizePerPage: 10,
      // totalSize: RoundList.length,
      totalSize: filteredData.length,
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteRound}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Registeration Admin | Round List</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="List" breadcrumbItem="Round List" />
            <Row className="justify-content-center">
              <Col lg="10">
                <Card>
                  <CardBody>
                    <Row>
                      <Col className="pagination pagination-rounded justify-content-center mb-2">
                        {errorMessage && (
                          <Alert color="danger">{errorMessage}</Alert>
                        )}
                      </Col>
                    </Row>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={filteredData}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={filteredData}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-4">
                                <select
                                  className="form-select mb-3"
                                  onChange={e =>
                                    this.setState({
                                      selectedSchemeId: e.target.value,
                                    })
                                  }
                                  value={this.state.selectedSchemeId}
                                  style={{ width: "300px" }}
                                >
                                  <option value="">Filter by Scheme</option>

                                  {Array.isArray(this.state.SchemeList) &&
                                  Array.isArray(this.props.RoundList) &&
                                  this.state.SchemeList.length > 0 ? (
                                    this.state.SchemeList.filter(scheme =>
                                      this.props.RoundList.some(
                                        round =>
                                          round.scheme?.toString() ===
                                          scheme.id.toString()
                                      )
                                    ).map(scheme => (
                                      <option key={scheme.id} value={scheme.id}>
                                        {scheme.scheme_name ||
                                          scheme.name ||
                                          "Unnamed Scheme"}
                                      </option>
                                    ))
                                  ) : (
                                    <option disabled>
                                      No Schemes Available
                                    </option>
                                  )}
                                </select>

                                <Col xl="12">
                                  <Col className="text-end">
                                    <button
                                      className="btn btn-primary btn-block mb-4"
                                      onClick={() => this.toggle()}
                                      style={{ background: "#0000CD" }}
                                    >
                                      Add Rounds
                                    </button>
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.closeModal}
                                        tag="h4"
                                      >
                                        {"Round Form"}
                                      </ModalHeader>
                                      <ModalBody>
                                        {this.state.successMessage && (
                                          <div
                                            className="alert alert-success"
                                            role="alert"
                                          >
                                            {this.state.successMessage}
                                          </div>
                                        )}
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            rounds: this.state.selectedRound
                                              ? this.state.selectedRound.rounds
                                              : "",
                                            scheme:
                                              this.state.selectedFormSchemeId ||
                                              "",

                                            sample: this.state.selectedRound
                                              ? this.state.selectedRound.sample
                                              : "",
                                            participants: this.state
                                              .selectedRound
                                              ? this.state.selectedRound
                                                  .participants
                                              : "",
                                            cycle_no: this.state.selectedCycle
                                              ? String(this.state.selectedCycle)
                                              : "", // ✅ Ensure it's a string
                                            issue_date: this.state.selectedRound
                                              ? this.state.selectedRound
                                                  .issue_date
                                              : "",
                                            closing_date: this.state
                                              .selectedRound
                                              ? this.state.selectedRound
                                                  .closing_date
                                              : "",
                                            note: this.state.selectedRound
                                              ? this.state.selectedRound.note
                                              : "",
                                            status: this.state.selectedRound
                                              ? this.state.selectedRound.status
                                              : "Created",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            rounds: Yup.string().required(
                                              "Round number is required"
                                            ),
                                            scheme:
                                              Yup.string().required(
                                                "Scheme is required"
                                              ),
                                            cycle_no: Yup.string().required(
                                              "Cycle number is required"
                                            ), // ✅ Ensure validation is expecting a string
                                            issue_date: Yup.string().required(
                                              "Issue date is required"
                                            ),
                                            closing_date: Yup.string().required(
                                              "Closing date is required"
                                            ),
                                            note: Yup.string().required(
                                              "Note is required"
                                            ),
                                            sample: this.state.isEdit
                                              ? Yup.string().required(
                                                  "Sample is required"
                                                )
                                              : Yup.string(),
                                            status: this.state.isEdit
                                              ? Yup.string().required(
                                                  "Status is required"
                                                )
                                              : Yup.string(),
                                          })}
                                          onSubmit={async (
                                            values,
                                            {
                                              setSubmitting,
                                              setFieldValue,
                                              handleChange,
                                              errors,
                                              touched,
                                            }
                                          ) => {
                                            const userId = localStorage.getItem(
                                              "authUser"
                                            )
                                              ? JSON.parse(
                                                  localStorage.getItem(
                                                    "authUser"
                                                  )
                                                ).user_id
                                              : "";

                                            const newround = {
                                              rounds: values.rounds,
                                              scheme: values.scheme,
                                              sample: this.state.selectedSample, // Ensure the selected sample is saved
                                              cycle_no: values.cycle_no,
                                              participants: values.participants,
                                              issue_date: values.issue_date,
                                              closing_date: values.closing_date,
                                              note: values.note,
                                              status: values.status,
                                              added_by: userId,
                                            };

                                            try {
                                              if (this.state.isEdit) {
                                                await this.props.onUpdateRound(
                                                  this.state.selectedRound.id,
                                                  newround
                                                );
                                                this.displaySuccessMessage(
                                                  "Round updated successfully!"
                                                );
                                              } else {
                                                await this.props.onAddNewRound(
                                                  newround
                                                );
                                                this.displaySuccessMessage(
                                                  "Round added successfully!"
                                                );
                                                if (newround.sample) {
                                                  const updatedSample = {
                                                    ...values.sample,
                                                    status: "Rounded", // Update sample status as needed
                                                  };
                                                  await this.props.onUpdateSampleList(
                                                    newround.sample,
                                                    updatedSample
                                                  );
                                                }
                                              }
                                              if (values.sample) {
                                                const sampleToUpdate =
                                                  this.props.ListUnitt.find(
                                                    sample =>
                                                      sample.samplename ===
                                                      values.sample
                                                  );
                                                if (sampleToUpdate) {
                                                  const updatedSample = {
                                                    ...sampleToUpdate,
                                                    status: "Rounded",
                                                  };
                                                  await this.props.onUpdateSampleList(
                                                    sampleToUpdate.id,
                                                    updatedSample
                                                  );
                                                }
                                              }
                                              // Refetch data and update local state
                                              setTimeout(async () => {
                                                const updatedData =
                                                  await this.props.onGetRoundList(
                                                    this.state.user_id
                                                  );
                                                this.setState({
                                                  RoundList: updatedData,
                                                });
                                              }, 300);
                                            } catch (error) {
                                              console.error(
                                                "Error updating/adding rounds:",
                                                error
                                              );
                                            }

                                            setSubmitting(false);
                                          }}
                                        >
                                          {({ errors, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <Field name="scheme">
                                                    {({ field, form }) => (
                                                      <div className="mb-3">
                                                        <label htmlFor="scheme">
                                                          Select Scheme
                                                        </label>
                                                        <select
                                                          {...field}
                                                          className={`form-control${
                                                            form.errors
                                                              .scheme &&
                                                            form.touched.scheme
                                                              ? " is-invalid"
                                                              : ""
                                                          }`}
                                                          value={
                                                            this.state
                                                              .selectedFormSchemeId ||
                                                            ""
                                                          }
                                                          onChange={e => {
                                                            const value =
                                                              e.target.value;
                                                            form.setFieldValue(
                                                              "scheme",
                                                              value
                                                            );
                                                            this.setState({
                                                              selectedFormSchemeId:
                                                                value,
                                                            }); // ✅ update form-only value
                                                            this.handleSchemeChange(
                                                              {
                                                                target: {
                                                                  value,
                                                                },
                                                              }
                                                            ); // ⚠️ if handleSchemeChange still sets selectedSchemeId, fix it too
                                                          }}
                                                          disabled={
                                                            this.state.isEdit
                                                          }
                                                        >
                                                          <option value="">
                                                            Select Scheme
                                                          </option>
                                                          {this.state.SchemeList.map(
                                                            scheme => (
                                                              <option
                                                                key={scheme.id}
                                                                value={
                                                                  scheme.id
                                                                }
                                                              >
                                                                {scheme.name}
                                                              </option>
                                                            )
                                                          )}
                                                        </select>
                                                        <ErrorMessage
                                                          name="scheme"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </div>
                                                    )}
                                                  </Field>

                                                  <ErrorMessage
                                                    name="scheme"
                                                    component="div"
                                                    className="invalid-feedback"
                                                  />

                                                  <div className="mb-3">
                                                    <Label className="col-form-label">
                                                      Round Number
                                                    </Label>
                                                    <Field
                                                      name="rounds"
                                                      type="text"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage
                                                      name="rounds"
                                                      component="div"
                                                      className="text-danger"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    {/* <label htmlFor="cycle_no">
                                                      Select Cycle
                                                    </label> */}
                                                    <Field name="cycle_no">
                                                      {({ field, form }) => (
                                                        <div className="mb-3">
                                                          <label htmlFor="cycle_no">
                                                            Select Cycle
                                                          </label>
                                                          <select
                                                            {...field}
                                                            className={`form-control${
                                                              form.errors
                                                                .cycle_no &&
                                                              form.touched
                                                                .cycle_no
                                                                ? " is-invalid"
                                                                : ""
                                                            }`}
                                                            disabled={
                                                              this.state.isEdit
                                                            } // ✅ Disable only in Edit Mode
                                                          >
                                                            <option value="">
                                                              Select Cycle
                                                            </option>
                                                            {this.state.filteredCycleList
                                                              .filter(
                                                                cycle =>
                                                                  cycle.status &&
                                                                  cycle.status.toLowerCase() ===
                                                                    "active"
                                                              )
                                                              .map(cycle => (
                                                                <option
                                                                  key={cycle.id}
                                                                  value={String(
                                                                    cycle.cycle_no
                                                                  )}
                                                                >
                                                                  {" "}
                                                                  {/* Use cycle_no instead */}
                                                                  {
                                                                    cycle.cycle_no
                                                                  }
                                                                </option>
                                                              ))}
                                                          </select>
                                                          <ErrorMessage
                                                            name="cycle_no"
                                                            component="div"
                                                            className="invalid-feedback"
                                                          />
                                                        </div>
                                                      )}
                                                    </Field>

                                                    <ErrorMessage
                                                      name="cycle_no"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="col-form-label">
                                                      Issue Date
                                                    </Label>
                                                    <Field
                                                      name="issue_date"
                                                      type="date"
                                                      id="issue_date"
                                                      className={
                                                        "form-control" +
                                                        (errors.issue_date &&
                                                        touched.issue_date
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="issue_date"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">
                                                      Closing Date
                                                    </Label>
                                                    <Field
                                                      name="closing_date"
                                                      type="date"
                                                      id="closing_date"
                                                      className={
                                                        "form-control" +
                                                        (errors.closing_date &&
                                                        touched.closing_date
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="closing_date"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">
                                                      Notes
                                                    </Label>
                                                    <Field
                                                      name="note"
                                                      type="text"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage
                                                      name="note"
                                                      component="div"
                                                      className="text-danger"
                                                    />
                                                  </div>
                                                  {/* Only render Sample and Status fields if editing */}
                                                  {this.state.isEdit && (
                                                    <>
                                                      <div className="mb-3">
                                                        <Label for="sample">
                                                          Sample
                                                        </Label>
                                                        <Field name="sample">
                                                          {({
                                                            field,
                                                            form,
                                                          }) => (
                                                            <select
                                                              {...field}
                                                              className={`form-control${
                                                                form.errors
                                                                  .sample &&
                                                                form.touched
                                                                  .sample
                                                                  ? " is-invalid"
                                                                  : ""
                                                              }`}
                                                              value={
                                                                this.state
                                                                  .selectedSample ||
                                                                ""
                                                              } // Set the default value
                                                              onChange={e => {
                                                                this.setState({
                                                                  selectedSample:
                                                                    e.target
                                                                      .value,
                                                                }); // Update the state
                                                                form.setFieldValue(
                                                                  "sample",
                                                                  e.target.value
                                                                ); // Update the form value
                                                              }}
                                                              disabled={[
                                                                "Ready",
                                                                "Open",
                                                                "Closed",
                                                                "Report Available",
                                                              ].includes(
                                                                form.values
                                                                  .status
                                                              )} // Disable based on status
                                                            >
                                                              <option value="">
                                                                Select Sample
                                                              </option>
                                                              {this.state.filteredSampleList.map(
                                                                sample => (
                                                                  <option
                                                                    key={
                                                                      sample.id
                                                                    }
                                                                    value={
                                                                      sample.samplename
                                                                    }
                                                                  >
                                                                    {
                                                                      sample.samplename
                                                                    }
                                                                  </option>
                                                                )
                                                              )}
                                                            </select>
                                                          )}
                                                        </Field>
                                                        <ErrorMessage
                                                          name="sample"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </div>

                                                      <div className="mb-3">
                                                        <Label className="col-form-label">
                                                          Status
                                                        </Label>
                                                        <Field
                                                          name="status"
                                                          as="select"
                                                          className="form-control"
                                                          multiple={false}
                                                        >
                                                          <option value="Ready">
                                                            Ready
                                                          </option>
                                                          <option value="Open">
                                                            Open
                                                          </option>
                                                          <option value="Closed">
                                                            Closed
                                                          </option>
                                                          {/* <option value="Report Available">
                                                            Report Available
                                                          </option> */}
                                                        </Field>
                                                        <ErrorMessage
                                                          name="status"
                                                          component="div"
                                                          className="text-danger"
                                                        />
                                                      </div>
                                                    </>
                                                  )}
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col>
                                                  <div className="text-end">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-success save-user"
                                                      style={{
                                                        backgroundColor:
                                                          "#0000CD",
                                                        borderColor: "#0000CD",
                                                      }}
                                                    >
                                                      Save
                                                    </button>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </Form>
                                          )}
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
                                  </Col>
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={
                                        "table-header-sky-blue"
                                      }
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
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

InstrumentType.propTypes = {
  match: PropTypes.object,
  RoundList: PropTypes.array,
  SchemeList: PropTypes.array,
  CycleList: PropTypes.array,
  // sample: PropTypes.array,
  ListUnitt: PropTypes.array,
  className: PropTypes.any,
  onGetRoundList: PropTypes.func,
  onGetgetschemelist: PropTypes.func,
  onGetgetcyclelist: PropTypes.func,
  onGetgetSamplelistlist: PropTypes.func,
  createInstrumentType: PropTypes.array,
  error: PropTypes.any,
  success: PropTypes.any,
  onAddNewRound: PropTypes.func,
  onUpdateRound: PropTypes.func,
  onDeleteRound: PropTypes.func,
  onUpdateSampleList: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = ({
  RoundList,
  SchemeList,
  CycleList,
  sample,
  ListUnitt,
}) => ({
  RoundList: RoundList.RoundList,
  SchemeList: SchemeList.SchemeList,
  // sample: sample.sample,
  CycleList: CycleList.CycleList,
  ListUnitt: ListUnitt.ListUnitt,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetgetschemelist: id => dispatch(getSchemelist(id)),
  onGetgetcyclelist: id => dispatch(getcyclelist(id)),
  onGetgetSamplelistlist: id => dispatch(getSamplelist(id)),
  onGetRoundList: id => dispatch(getroundlist(id)),
  onAddNewRound: (id, createround) =>
    dispatch(addNewRoundList(id, createround)),
  onUpdateRound: (id, round) => dispatch(updateRoundList({ id, ...round })),
  onDeleteRound: round => dispatch(deleteRound(round)),
  onUpdateSampleList: (id, sample) => dispatch(updateSampleList(id, sample)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InstrumentType));
