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
  getcsrroundlist,
  // addNewRoundList,
  // updateRoundList,
  // deleteRound,
} from "store/rounds/actions";

import { isEmpty, size } from "lodash";
import DeleteModal from "components/Common/DeleteModal";
import "assets/scss/table.scss";
import moment from "moment";
class InstrumentType2 extends Component {
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
          formatter: (cellContent, methodlist) => <>R-{methodlist.id}</>,
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
                    style={{
                      textAlign: "center",
                      width: "70px",
                      margin: "auto",
                    }}
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
          dataField: "participant_count",
          text: "Participants",
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
  const organization_name = window.location.pathname.split("/")[1];
  return (
    <Link
      to={`/${organization_name}/CSRroundparticipants/${row.id}`}
      style={{ textDecoration: "underline", color: "#0000CD" }}
    >
      {cell}
    </Link>
  );
}

        },
     {
  dataField: "noofresults",
  text: "Submitted Results",
  sort: true,
  formatter: (cell, row) => {
    const organization_name = window.location.pathname.split("/")[1]; // safely extract org name
    return (
      <Link
        to={`/${organization_name}/CSRroundsubmittedresults/${row.id}`} // dynamic path
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
  },
},


    {
  dataField: "noofresultsnotsubmitted",
  text: "Pending Submissions",
  sort: true,
  formatter: (cell, row) => {
    const organization_name = window.location.pathname.split("/")[1]; // get org from URL
    return (
      <Link
        to={`/${organization_name}/CSRroundpendingsubmission/${row.id}`} // correct route
        style={{ textDecoration: "underline", color: "red" }}
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
  },
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
              return round.status === "Statistics Done";
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
                    <option value="Statistics Done">Statistics Done</option>
                    {canShowReportAvailable && (
                      <option value="Report Available">Report Available</option>
                    )}
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
    <Tooltip title="History">
  <Link
    className="fas fa-comment font-size-18"
    to={`/${this.state.organization_name}/CSRroundHistory/${round.id}`}
    onClick={e => {
      e.preventDefault();

      if (!this.state.organization_name) {
        console.error("Invalid organization name");
        return;
      }

      const url = `/${this.state.organization_name}/CSRroundHistory/${round.id}`;
      this.props.history.push(url);
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
      ongetcsrroundlist,
      onGetgetschemelist,
      onGetgetcyclelist,
      onGetgetSamplelistlist,
    } = this.props;
    const userId = this.state.user_id;

    ongetcsrroundlist(userId);
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
    const { onDeleteRound, ongetcsrroundlist } = this.props;
    const { RoundList } = this.state;
    if (RoundList.id !== undefined) {
      onDeleteRound(RoundList);
      setTimeout(() => {
        ongetcsrroundlist(this.state.user_id);
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
      const updatedRound = {
        ...round,
        status: "Statistics Done",
      };

      this.props.onUpdateRound(round.id, updatedRound);

      // Reload RoundList after update
      setTimeout(() => {
        this.props.ongetcsrroundlist(this.state.user_id);
      }, 500);

      // Navigate after update
      setTimeout(() => {
        this.props.history.push(
          `/${this.state.organization_name}/statistics/${round.id}`
        );
      }, 600); // Slight delay to give update a chance
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
      ongetcsrroundlist,
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
      sizePerPage: 50,
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

InstrumentType2.propTypes = {
  match: PropTypes.object,
  RoundList: PropTypes.array,
  SchemeList: PropTypes.array,
  CycleList: PropTypes.array,
  // sample: PropTypes.array,
  ListUnitt: PropTypes.array,
  className: PropTypes.any,
  ongetcsrroundlist: PropTypes.func,
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
  ongetcsrroundlist: (csrId, orgId) => dispatch(getcsrroundlist(csrId, orgId)),
  onAddNewRound: (id, createround) =>
    dispatch(addNewRoundList(id, createround)),
  onUpdateRound: (id, round) => dispatch(updateRoundList({ id, ...round })),
  onDeleteRound: round => dispatch(deleteRound(round)),
  onUpdateSampleList: (id, sample) => dispatch(updateSampleList(id, sample)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InstrumentType2));
