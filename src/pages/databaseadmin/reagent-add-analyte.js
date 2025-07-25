import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

// Import actions
import {
  getAnalytelist,
  getReagentAnalytelist,
  addNewReagentAnalytelist,
  updateReagentAnalytelist ,
} from "store/databaseofunits/actions";
import "assets/scss/table.scss";

class ReagentAddAnalyte extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: "",
      idFilter: "",
      checkedSchemes: {},
      selectedCheckboxes: {}, // Track checked checkboxes
      tableKey: 0,
      feedbackMessage: "",
      feedbackListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          headerFormatter: (column, colIndex) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.idFilter}
                  onChange={e => this.handleFilterChange("idFilter", e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          headerStyle: { width: "100px" },
          style: { width: "100px" },
        },
        {
          dataField: "name",
          text: "Analytes",
          sort: true,
          headerFormatter: (column, colIndex) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.nameFilter}
                  onChange={e => this.handleFilterChange("nameFilter", e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          headerAlign: "center",
          align: "left",
        },
        {
          dataField: "checkbox",
          text: "Select",
          formatter: (cellContent, row) => (
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`checkbox${row.id}`}
                onChange={() => this.handleCheckboxChange(row.id)}
                checked={this.state.selectedCheckboxes[row.id] || false} // Keeps checked items selected
                style={{ cursor: "pointer" }}
              />
            </div>
          ),
        },
      ],
    };
  }

 componentDidMount() {
  this.fetchData(); // Fetch analytes
}

componentDidUpdate(prevProps) {
  if (
    prevProps.ReagentAnalyteList !== this.props.ReagentAnalyteList ||
    prevProps.activeSchemes !== this.props.activeSchemes
  ) {
    this.updateSelectedCheckboxes();
  }
}


  fetchData() {
    const { ongetAnalytelist, onGetSchemeAnalytes } = this.props;
    const schemeId = this.props.match.params.id;

    if (schemeId) {
      onGetSchemeAnalytes(schemeId);
    } else {
      console.error("Scheme ID not found in URL parameters");
    }

    const authUser = localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser"))
      : null;
    const user_id = authUser ? authUser.user_id : null;

    if (user_id) {
      console.log("User ID found:", user_id);
      ongetAnalytelist(user_id);
    } else {
      console.error("User ID not found in localStorage");
    }
  }
updateSelectedCheckboxes() {
  const { ReagentAnalyteList = [], activeSchemes = [] } = this.props;

  if (!ReagentAnalyteList.length) {
    this.setState({ selectedCheckboxes: {}, checkedSchemes: {} });
    return;
  }

  const selectedCheckboxes = {};
  const checkedSchemes = {};

  ReagentAnalyteList.forEach(analyte => {
    selectedCheckboxes[analyte.id] = true;
  });

  activeSchemes.forEach(scheme => {
    const schemeAnalytes = scheme.analytes || [];
    const hasAnyAnalyte = schemeAnalytes.some(
      analyte => selectedCheckboxes[analyte.id]
    );

    if (hasAnyAnalyte) {
      checkedSchemes[scheme.id] = true;
    }
  });

  this.setState({ selectedCheckboxes, checkedSchemes });
}

  areAllSchemeAnalytesChecked = scheme => {
    return !!this.state.checkedSchemes[scheme.id];
  };
  handleSchemeCheckboxChange = scheme => {
    const { selectedCheckboxes, checkedSchemes } = this.state;
    const updatedCheckboxes = { ...selectedCheckboxes };
    const updatedCheckedSchemes = { ...checkedSchemes };

    const schemeId = scheme.id;
    const schemeAnalytes = scheme.analytes || [];

    const isCurrentlyChecked = checkedSchemes[schemeId];

    if (isCurrentlyChecked) {
      // Unchecking this scheme: remove it from checkedSchemes
      delete updatedCheckedSchemes[schemeId];

      // For each analyte in the scheme
      schemeAnalytes.forEach(analyte => {
        const analyteId = analyte.id;

        // Check if this analyte is used by any other remaining checked schemes
        const stillUsed = Object.keys(updatedCheckedSchemes).some(checkedId => {
          const otherScheme = this.props.activeSchemes.find(
            s => s.id === parseInt(checkedId)
          );
          return otherScheme?.analytes?.some(a => a.id === analyteId);
        });

        // Only uncheck analyte if no other checked scheme uses it
        if (!stillUsed) {
          delete updatedCheckboxes[analyteId];
        }
      });
    } else {
      // Checking this scheme: add all analytes
      updatedCheckedSchemes[schemeId] = true;

      schemeAnalytes.forEach(analyte => {
        updatedCheckboxes[analyte.id] = true;
      });
    }

    this.setState({
      selectedCheckboxes: updatedCheckboxes,
      checkedSchemes: updatedCheckedSchemes,
    });
  };
handleSave = () => {
  const { selectedCheckboxes } = this.state;
  const { onAddNewReagentAnalyte, onUpdateReagentAnalytes, match, ListUnit, ReagentAnalyteList } = this.props;
  const reagentId = match.params.id;

  const selectedReagents = ListUnit.filter(reagent => selectedCheckboxes[reagent.id]);

  if (selectedReagents.length === 0) {
    this.setState({ errorMessage: "Please select Reagents First." });
    setTimeout(() => {
      this.setState({ errorMessage: '' });
    }, 1000);
    return;
  }

  const payload = {
    id: reagentId,
    analytes: selectedReagents.map(reagent => reagent.id)
  };

  if (ReagentAnalyteList && ReagentAnalyteList.length > 0) {
    onUpdateReagentAnalytes(payload);
    this.setFeedbackMessage("Analytes updated successfully.");
  } else {
    onAddNewReagentAnalyte(payload, reagentId);
    this.setFeedbackMessage("Analytes added successfully.");
  }
};


  setFeedbackMessage = message => {
    this.setState({ feedbackMessage: message }, () => {
      // Optionally, clear the message after a few seconds
      setTimeout(() => {
        this.setState({ feedbackMessage: "" });
      }, 3000); // 3 seconds
    });
  };

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  handleCheckboxChange = id => {
    this.setState(prevState => ({
      selectedCheckboxes: {
        ...prevState.selectedCheckboxes,
        [id]: !prevState.selectedCheckboxes[id],
      },
    }));
  };

  filterData = () => {
    const { ListUnit } = this.props;
    console.log("data on page is ", ListUnit);
    const { nameFilter, idFilter, selectedCheckboxes } = this.state;
    console.log("data on page is ", selectedCheckboxes);
    const filteredData = ListUnit.filter(entry => {
      const name = entry.name ? entry.name.toString().toLowerCase() : "";
      const id = entry.id ? entry.id.toString() : "";

      return name.includes(nameFilter.toLowerCase()) && id.includes(idFilter);
    }).map(entry => ({
      ...entry,
      checkbox: (
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id={`checkbox${entry.id}`}
            onChange={() => this.handleCheckboxChange(entry.id)}
            style={{ cursor: "pointer" }}
            checked={selectedCheckboxes[entry.id] || false}
          />
        </div>
      ),
    }));

    return filteredData;
  };

  render() {
    const { ListUnit } = this.props;
    const defaultSorted = [{ dataField: "id", order: "desc" }];

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Analytes List</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs
              title="List"
              breadcrumbItem={
                <>
                  Analytes For -
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    {this.props.reagentName || "Loading..."}
                  </span>
                </>
              }
            />
            <Row className="mb-3">
              <Col>
                <h5>Select Schemes for Reagent</h5>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                  {this.props.activeSchemes.map(scheme => (
                    <div
                      key={scheme.id}
                      className="form-check"
                      style={{ minWidth: "200px" }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`schemeCheckbox${scheme.id}`}
                        onChange={() => this.handleSchemeCheckboxChange(scheme)}
                        checked={this.areAllSchemeAnalytesChecked(scheme)}
                      />
                      <label
                        htmlFor={`schemeCheckbox${scheme.id}`}
                        className="form-check-label"
                        style={{ marginLeft: "5px" }}
                      >
                        {scheme.name}
                      </label>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col lg="5">
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
                    <ToolkitProvider
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={ListUnit}
                      search
                    >
                      {toolkitprops => (
                        <React.Fragment>
                          <Row className="mb-4">
                            <Col xl="12">
                              <div className="table-responsive">
                                <BootstrapTable
                                  key={this.state.tableKey}
                                  {...toolkitprops.baseProps}
                                  defaultSorted={defaultSorted}
                                  classes={"table align-middle table-hover"}
                                  bordered={false}
                                  striped={true}
                                  headerWrapperClasses={"table-light"}
                                  responsive
                                  data={this.filterData()}
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col className="pagination pagination-rounded justify-content-end mb-2">
                              <button
                                onClick={this.handleSave}
                                className="btn btn-primary btn-block mb-4"
                                style={{ background: "#0000CD" }}
                              >
                                Save
                              </button>
                            </Col>
                          </Row>
                        </React.Fragment>
                      )}
                    </ToolkitProvider>
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
ReagentAddAnalyte.propTypes = {
  match: PropTypes.object,
  ListUnit: PropTypes.array,
  ReagentAnalyteList: PropTypes.array,
  reagentName: PropTypes.object,
  onGetSchemeAnalytes: PropTypes.func,
  ongetAnalytelist: PropTypes.func,
  onAddNewInstrumentAnalyte: PropTypes.func,
  onUpdateSchemeAnalytes: PropTypes.func,
  history: PropTypes.object.isRequired,
  activeSchemes: PropTypes.array,
  onAddNewReagentAnalyte: PropTypes.func,
  onUpdateReagentAnalytes: PropTypes.func,

  // ✅ Add these missing ones
  onAddNewAnalyteReagents: PropTypes.func,
  onUpdateAnalyteReagents: PropTypes.func,
  // ReagentList: PropTypes.array,
};

const mapStateToProps = state => ({
  ListUnit: state.ListUnit?.ListUnit || [],
  ReagentAnalyteList: state.ListUnit?.ReagentAnalyteList || [],
  reagentName: state.ListUnit?.reagentName || "Unknown Instrument",
  activeSchemes: state.ListUnit?.activeSchemes || [],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetSchemeAnalytes: id => dispatch(getReagentAnalytelist(id)),
  ongetAnalytelist: id => dispatch(getAnalytelist(id)),

  // ✅ Rename this to match the correct domain
  onAddNewReagentAnalyte: (addReagentAnalyte, id) => {
    console.log("Adding new reagent analyte:", addReagentAnalyte, "with ID:", id);
    return dispatch(addNewReagentAnalytelist(addReagentAnalyte, id));
  },

  // ✅ Also this is about reagent, not instrument
  onUpdateReagentAnalytes: (schemeanalyte) =>
    dispatch(updateReagentAnalytelist(schemeanalyte)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReagentAddAnalyte));
