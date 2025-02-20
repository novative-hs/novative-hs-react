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
                    onChange={(e) => this.handleFilterChange("idFilter", e)}
                    className="form-control"
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
        },
        {
          dataField: "rounds",
          text: "Round No",
          sort: true,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.roundsFilter}
                    onChange={(e) => this.handleFilterChange("roundsFilter", e)}
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
        },
        {
          dataField: "scheme_name",
          text: "Scheme Name",
          sort: true,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.schemenameFilter}
                    onChange={(e) =>
                      this.handleFilterChange("schemenameFilter", e)
                    }
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
        },
        {
          dataField: "cycle_no",
          text: "Cycle Number",
          sort: true,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.cyclenoFilter}
                    onChange={(e) =>
                      this.handleFilterChange("cyclenoFilter", e)
                    }
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
        },
        {
          dataField: "sample",
          text: "Sample Name",
          sort: true,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.sampleFilter}
                    onChange={(e) => this.handleFilterChange("sampleFilter", e)}
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
        },
        {
          dataField: "nooflabs",
          text: "Number of Participants",
          sort: true,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.participantsFilter}
                    onChange={(e) =>
                      this.handleFilterChange("participantsFilter", e)
                    }
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "160px",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
        },
        {
          dataField: "issue_date",
          text: "Issue Date",
          sort: true,
          formatter: (cellContent, methodlist) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {moment(methodlist.issue_date).format("DD MMM YYYY")}
              </span>
            </>
          ),
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.issuedateFilter}
                    onChange={(e) =>
                      this.handleFilterChange("issuedateFilter", e)
                    }
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
        },
        {
          dataField: "closing_date",
          text: "Closing Date",
          sort: true,
          formatter: (cellContent, methodlist) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {moment(methodlist.closing_date).format("DD MMM YYYY")}
              </span>
            </>
          ),
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.closingdateFilter}
                    onChange={(e) =>
                      this.handleFilterChange("closingdateFilter", e)
                    }
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
        },
        {
          dataField: "note",
          text: "Note",
          sort: true,
          formatter: (cellContent, methodlist) => {
            console.log("Debug methodlist.note:", methodlist.note); // Check note value
            return (
              <>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  {methodlist.note || "No note provided"}
                </span>
              </>
            );
          },

          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.notesFilter}
                    onChange={(e) => this.handleFilterChange("notesFilter", e)}
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
        }, 
        {
          dataField: "status",
          text: "Status",
          sort: true,
          formatter: (cellContent, methodlist) => (
            <>
              {methodlist.status === "Created" ? (
                <span>Created</span>
              ) : methodlist.status === "Ready" ? (
                <span>Ready</span>
              ) : methodlist.status === "Open" ? (
                <span>Open</span>
              ) : methodlist.status === "Closed" ? (
                <span>Closed</span>
              ) : methodlist.status === "Report Available" ? (
                <span>Report Available</span>
              ) : (
                <span>{methodlist.status}</span> // Fallback in case of unexpected values
              )}
            </>
          ),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <select
                    value={this.state.statusFilter}
                    onChange={(e) => this.handleFilterChange("statusFilter", e)}
                    className="form-control"
                  >
                    <option value="">All</option>
                    <option value="Created">Created</option>
                    <option value="Ready">Ready</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Report Available">Report Available</option>
                  </select>
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
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
                    onClick={(e) => {
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
                    onClick={(e) => {
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

  handleSchemeChange = (e) => {
    const selectedSchemeId = e.target.value;
  
    // Filter CycleList and SampleList based on the selected scheme
    const filteredCycleList = this.props.CycleList.filter(
      (cycle) => cycle.scheme_id === parseInt(selectedSchemeId)
    );
  
    const filteredSampleList = this.props.ListUnitt.filter(
      (sample) => sample.scheme_id === parseInt(selectedSchemeId)
    );
  
    // Update the state with filtered lists
    this.setState({
      selectedSchemeId,
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
    this.setState((prevState) => ({
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

  onClickDelete = (RoundList) => {
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

  displaySuccessMessage = (message) => {
    this.setState({ successMessage: message });

    setTimeout(() => {
      this.setState({ successMessage: "", modal: false });
    }, 3000);
  };

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  onClickStatistics = (round) => {
    if (round && round.id) {
      // Update the round's status to "report available"
      // const updatedRound = {
      //   ...round,
      //   status: "Report Available",
      // };

      // // Dispatch the update action to save the new status
      // this.props.onUpdateRound(round.id, updatedRound);

      // Optionally, redirect to the statistics page
      this.props.history.push(
        `/${this.state.organization_name}/statistics/${round.id}`
      );
    }
  };
  onClickReport = (id) => {
    this.props.history.push(
      `/${this.state.organization_name}/slectValues/${id}`
    );
  };

  toggle(round) {
    console.log("data in case of update asjdhasdf", round);
    if (round && round.id) {
      this.setState({
        modal: true,
        selectedRound: {
          id: round.id,
          rounds: round.rounds,
          cycle_no: round.cycle_no,
          sample: round.sample,
          participants: round.participants,
          issue_date: round.issue_date
            ? moment(round.issue_date).format("YYYY-MM-DD")
            : "",
          closing_date: round.closing_date
            ? moment(round.closing_date).format("YYYY-MM-DD")
            : "",
          note: round.note,
          status: round.status,
          added_by: round.added_by,
        },
        isEdit: true,
      });
    } else {
      this.setState({
        modal: true,
        selectedRound: null,
        isEdit: false,
      });
    }
  }
  componentDidUpdate(prevProps) {
    if (
      !isEmpty(this.props.RoundList) &&
      size(prevProps.RoundList) !== size(this.props.RoundList)
    ) {
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

    const filteredData = RoundList.filter((entry) => {
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
        status.includes(statusFilter)
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
                          {(toolkitprops) => (
                            <React.Fragment>
                              <Row className="mb-4">
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
                                            scheme: this.state.selectedRound
                                              ? this.state.selectedRound.scheme
                                              : "",
                                            sample: this.state.selectedRound
                                              ? this.state.selectedRound.sample
                                              : "",
                                            participants: this.state
                                              .selectedRound
                                              ? this.state.selectedRound
                                                  .participants
                                              : "",
                                            cycle_no: this.state.selectedCycle
                                              ? this.state.selectedCycle
                                                  .cycle_no
                                              : "",
                                            issue_date: this.state.selectedRound
                                              ? this.state.selectedRound
                                                  .issue_date
                                              : "",
                                            closing_date: this.state
                                              .selectedRound
                                              ? this.state.selectedRound
                                                  .closing_date
                                              : "",
                                            // Use the same key "note" as in the Field and validation schema.
                                            note: this.state.selectedRound
                                              ? this.state.selectedRound.notes
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
                                            ),
                                            issue_date: Yup.string().required(
                                              "Issue date is required"
                                            ),
                                            closing_date: Yup.string().required(
                                              "Closing date is required"
                                            ),
                                            note: Yup.string().required(
                                              "Note is required"
                                            ),
                                            // Only require these fields when editing
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
                                            { setSubmitting, setFieldValue, handleChange, errors, touched }
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
                                              sample: values.sample,
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
                                                    (sample) =>
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
      <label htmlFor="scheme">Select Scheme</label>
      <select
        {...field}
        className={`form-control${
          form.errors.scheme && form.touched.scheme ? " is-invalid" : ""
        }`}
        onChange={(e) => {
          const { value } = e.target;
          form.setFieldValue("scheme", value); // Update Formik value
          this.handleSchemeChange(e); // Custom filtering logic
        }}
      >
        <option value="">Select Scheme</option>
        {this.state.SchemeList.map((scheme) => (
          <option key={scheme.id} value={scheme.id}>
            {scheme.name}
          </option>
        ))}
      </select>
      <ErrorMessage name="scheme" component="div" className="invalid-feedback" />
    </div>
  )}
</Field>

<ErrorMessage name="scheme" component="div" className="invalid-feedback" />

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
  <label htmlFor="cycle_no">Cycle No</label>
  <Field
    as="select"
    name="cycle_no"
    className={`form-control${
      errors.cycle_no && touched.cycle_no ? " is-invalid" : ""
    }`}
  >
    <option value="">Select Cycle</option>
    {this.state.filteredCycleList.map((cycle) => (
      <option key={cycle.id} value={String(cycle.id)}>
        {cycle.cycle_no}
      </option>
    ))}
  </Field>
  <ErrorMessage name="cycle_no" component="div" className="invalid-feedback" />
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
  <Label for="sample">Sample</Label>
  <Field
    as="select"
    name="sample"
    className={`form-control${
      errors.sample && touched.sample ? " is-invalid" : ""
    }`}
  >
    <option value="">Select Sample</option>
    {this.state.filteredSampleList.map((sample) => (
      <option key={sample.id} value={sample.samplename}>
        {sample.samplename}
      </option>
    ))}
  </Field>
  <ErrorMessage name="sample" component="div" className="invalid-feedback" />
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
                                                          <option value="Report Available">
                                                            Report Available
                                                          </option>
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
                                      headerWrapperClasses={"table-light"}
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
  onGetgetschemelist: (id) => dispatch(getSchemelist(id)),
  onGetgetcyclelist: (id) => dispatch(getcyclelist(id)),
  onGetgetSamplelistlist: (id) => dispatch(getSamplelist(id)),
  onGetRoundList: (id) => dispatch(getroundlist(id)),
  onAddNewRound: (id, createround) =>
    dispatch(addNewRoundList(id, createround)),
  onUpdateRound: (id, round) => dispatch(updateRoundList({ id, ...round })),
  onDeleteRound: (round) => dispatch(deleteRound(round)),
  onUpdateSampleList: (id, sample) => dispatch(updateSampleList(id, sample)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InstrumentType));