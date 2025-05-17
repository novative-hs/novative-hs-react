import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
// import { withRouter } from "react-router-dom";
import { withRouter, Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import DeleteModal from "components/Common/DeleteModal";
// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import Tooltip from "@material-ui/core/Tooltip";
// Import actions
import { getCycleRoundlist, deleteCycleRound } from "store/cycle/actions";

import "assets/scss/table.scss";

class CycleRoundList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: "",
      idFilter: "",
      organization_name: "",
      CycleList: [],
      deleteModal: true,
      tableKey: 0,
      feedbackMessage: "",
      feedbackListColumns: [
        {
          text: "ID",
          dataField: "id",
          sort: true,
          formatter: (cell, row) => <>{row.id}</>,
          headerFormatter: (column, colIndex) => (
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
                  onChange={e => this.handleFilterChange("idFilter", e)}
                  className="form-control"
                  style={{ textAlign: "center", width: "100px" }}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "5px" }}>
                {column.text}
              </div>
            </>
          ),
          headerAlign: "center",
          align: "center",
        },
        {
          text: "Round Number",
          dataField: "rounds", // field inside each round object
          sort: true,
          formatter: (cell, row) => <>{cell}</>, // just show the round_number
          headerFormatter: (column, colIndex) => (
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
                  value={this.state.nameFilter || ""}
                  onChange={e => this.handleFilterChange("nameFilter", e)}
                  className="form-control"
                  style={{ textAlign: "center", width: "100px" }}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "5px" }}>
                {column.text}
              </div>
            </>
          ),
          headerAlign: "center",
          align: "center",
        },

        {
          text: "Issue Date",
          dataField: "issue_date",
          sort: true,
          formatter: (cell, row) => <>{row.issue_date}</>,
          headerFormatter: (column, colIndex) => (
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
                  value={this.state.issue_dateFilter}
                  onChange={e => this.handleFilterChange("issue_dateFilter", e)}
                  className="form-control"
                  style={{ textAlign: "center", width: "100px" }}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "5px" }}>
                {column.text}
              </div>
            </>
          ),
          headerAlign: "center",
          align: "center",
        },
        {
          text: "Closing Date",
          dataField: "closing_date",
          sort: true,
          formatter: (cell, row) => <>{row.closing_date}</>,
          headerFormatter: (column, colIndex) => (
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
                  value={this.state.closing_dateFilter}
                  onChange={e =>
                    this.handleFilterChange("closing_dateFilter", e)
                  }
                  className="form-control"
                  style={{ textAlign: "center", width: "100px" }}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "5px" }}>
                {column.text}
              </div>
            </>
          ),
          headerAlign: "center",
          align: "center",
        },
        {
          text: "Participants",
          dataField: "participant_count",
          sort: true,
          formatter: (cell, row) => <>{row.participant_count}</>,
          headerFormatter: (column, colIndex) => (
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
                  value={this.state.participantFilter}
                  onChange={e =>
                    this.handleFilterChange("participantFilter", e)
                  }
                  className="form-control"
                  style={{ textAlign: "center", width: "100px" }}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "5px" }}>
                {column.text}
              </div>
            </>
          ),
          headerAlign: "center",
          align: "center",
        },
        {
          text: "Result-Submitters",
          dataField: "noofresults",
          sort: true,
          formatter: (cell, row) => <>{row.noofresults}</>,
          headerFormatter: (column, colIndex) => (
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
                  value={this.state.noofresultsFilter}
                  onChange={e =>
                    this.handleFilterChange("noofresultsFilter", e)
                  }
                  className="form-control"
                  style={{ textAlign: "center", width: "100px" }}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "5px" }}>
                {column.text}
              </div>
            </>
          ),
          headerAlign: "center",
          align: "center",
        },
        {
          text: "Status",
          dataField: "status",
          sort: true,
          formatter: (cell, row) => <>{row.status}</>,
          headerFormatter: (column, colIndex) => (
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
                  value={this.state.statusFilter}
                  onChange={e => this.handleFilterChange("statusFilter", e)}
                  className="form-control"
                  style={{ textAlign: "center", width: "100px" }}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "5px" }}>
                {column.text}
              </div>
            </>
          ),
          headerAlign: "center",
          align: "center",
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, row) => (
            <div className="d-flex gap-3 ml-3">
              <Tooltip title="Delete">
                <Link className="text-danger" to="#">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(row)} // Use row.id here
                  ></i>
                </Link>
              </Tooltip>
            </div>
          ),
        },
      ],
    };
    this.onClickDelete = this.onClickDelete.bind(this);
  }
  onClickDelete = round => {
    this.setState({ roundToDelete: round, deleteModal: true });
  };

  // handleDeleteRound = (id) => {
  //   const { onDeleteRound, ongetCycleList } = this.props;
  //   this.props.onDeleteRound(id);
  //   const { roundToDelete } = this.state;

  //   if (roundToDelete?.id) {
  //     onDeleteRound(roundToDelete.id);
  //     this.setState({ deleteModal: false });

  //     setTimeout(() => {
  //       ongetCycleList();
  //     }, 500);
  //   }
  // };
  handleDeleteRound = () => {
    const { onDeleteRound, ongetCycleList } = this.props;
    const { roundToDelete } = this.state;

    if (roundToDelete?.id) {
      console.log("Deleting round with ID:", roundToDelete.id); // 👈 log the ID here
      onDeleteRound(roundToDelete); // ✅ send full object, not just id
      this.setState({ deleteModal: false });

      setTimeout(() => {
        ongetCycleList();
      }, 500);
    } else {
      console.warn("No valid roundToDelete found:", roundToDelete); // 👈 log in case it's missing
    }
  };

  componentDidMount() {
    console.log("componentDidMount CycleList:", this.props.CycleList);
    const { organization_name } = this.props.match.params;
    this.setState({ organization_name });
    this.fetchData();
  }
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };
  componentDidUpdate(prevProps) {
    if (prevProps.CycleList !== this.props.CycleList) {
      console.log("CycleList changed:", this.props.CycleList);

      // Flatten rounds from all cycles
      const flattenedRounds = this.props.CycleList.flatMap(cycle =>
        (cycle.rounds || []).map(round => ({
          ...round,
          cycle_no: cycle.cycle_no, // optional: add cycle info if needed
          scheme_name: cycle.scheme_name, // optional
        }))
      );

      console.log("Flattened rounds:", flattenedRounds);
      this.setState({ flattenedRounds });
    }

    if (this.props.CycleName !== prevProps.CycleName) {
      console.log("CycleName changed:", this.props.CycleName);
      this.setState({ CycleName: this.props.CycleName });
    }
  }

  fetchData() {
    const { ongetCycleList } = this.props;
    const unitanalyteId = this.props.match.params.id;
    if (unitanalyteId) {
      ongetCycleList(unitanalyteId);
    } else {
      console.error("Analyte ID not found in URL parameters");
    }
  }

  setFeedbackMessage = message => {
    this.setState({ feedbackMessage: message }, () => {
      setTimeout(() => {
        this.setState({ feedbackMessage: "" });
      }, 3000);
    });
  };

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };
  filterData = () => {
    const {
      idFilter,
      nameFilter,
      issue_dateFilter,
      closing_dateFilter,
      participantFilter,
      noofresultsFilter,
      statusFilter,
    } = this.state;

    const rounds = this.state.flattenedRounds || [];

    return rounds.filter(round => {
      const match = (value, filter) =>
        !filter ||
        (value &&
          value.toString().toLowerCase().includes(filter.toLowerCase()));

      return (
        match(round.id, idFilter) &&
        match(round.round_number || round.rounds, nameFilter) &&
        match(round.issue_date, issue_dateFilter) &&
        match(round.closing_date, closing_dateFilter) &&
        match(round.participant_count, participantFilter) &&
        match(round.noofresults, noofresultsFilter) &&
        match(round.status, statusFilter)
      );
    });
  };

  render() {
    const defaultSorted = [{ dataField: "id", order: "desc" }];
    const { deleteModal } = this.state;
    const filteredData = this.filterData();
    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteRound}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | cycles List</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs
              title="List"
              breadcrumbItem={`cycles for ${this.state.CycleName || "Unknown"}`}
            />
            <Row className="justify-content-center">
              <Col lg="10">
                <Card>
                  <CardBody>
                    <Row>
                      <Col className="pagination pagination-rounded justify-content-center mb-2">
                        {this.state.feedbackMessage && (
                          <div className="alert alert-danger" role="alert">
                            {this.state.feedbackMessage}
                          </div>
                        )}
                      </Col>
                    </Row>

                    <PaginationProvider
                      pagination={paginationFactory({
                        sizePerPage: 10,
                        totalSize: filteredData.length,
                        custom: true,
                      })}
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
                            <>
                              <div className="table-responsive">
                                <BootstrapTable
                                  keyField="id"
                                  data={filteredData}
                                  columns={this.state.feedbackListColumns}
                                  {...paginationTableProps}
                                />
                              </div>

                              <Row className="align-items-md-center mt-3">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row>

                              <Row>
                                <Col className="text-end">
                                  <button
                                    onClick={this.handleSave}
                                    className="btn btn-primary btn-block mb-4"
                                    style={{ background: "#0000CD" }}
                                  >
                                    Save
                                  </button>
                                </Col>
                              </Row>
                            </>
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

CycleRoundList.propTypes = {
  match: PropTypes.object,
  ListUnit: PropTypes.array,
  CycleList: PropTypes.array,
  CycleName: PropTypes.string,
  ongetCycleList: PropTypes.func,
  history: PropTypes.object.isRequired,
  onDeleteCycleRound: PropTypes.func,
  onDeleteRound: PropTypes.func,
  ongetCycleList: PropTypes.func,
};

const mapStateToProps = state => ({
  CycleList: state.CycleList.CycleList, // if your reducer is named CycleList
});

const mapDispatchToProps = dispatch => ({
  ongetCycleList: id => dispatch(getCycleRoundlist(id)),
  onDeleteRound: rounds => dispatch(deleteCycleRound(rounds)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CycleRoundList));
