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
  getInstrumentAnalytelist,
  addNewInstrumentAnalytelist,
  updateInstrumentAnalytelist,
} from "store/databaseofunits/actions";
import "assets/scss/table.scss";

class InstrumentAddAnalyte extends Component {
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
    const savedSelections = JSON.parse(
      localStorage.getItem("selectedCheckboxes")
    );
    if (savedSelections) {
      this.setState({ selectedCheckboxes: savedSelections });
    }
    this.updateSelectedCheckboxes(); // Set selected checkboxes
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.InstrumentAnalyteList !== this.props.InstrumentAnalyteList ||
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
    const { InstrumentAnalyteList, activeSchemes } = this.props;

    if (!InstrumentAnalyteList || InstrumentAnalyteList.length === 0) return;

    const selectedCheckboxes = {};
    const checkedSchemes = {};

    InstrumentAnalyteList.forEach(analyte => {
      selectedCheckboxes[analyte.id] = true;
    });

    console.log("✅ Selected Analytes:", selectedCheckboxes);

    activeSchemes?.forEach(scheme => {
      const schemeAnalytes = scheme.analytes || [];
      console.log(`🔍 Scheme: ${scheme.name}`);
      console.log(
        "→ Scheme analyte IDs:",
        schemeAnalytes.map(a => a.id)
      );

      const hasAnyAnalyteFromInstrument = schemeAnalytes.some(
        analyte => analyte?.id && selectedCheckboxes[analyte.id]
      );

      console.log(`→ ${scheme.name} checked?`, hasAnyAnalyteFromInstrument);

      if (hasAnyAnalyteFromInstrument) {
        checkedSchemes[scheme.id] = true;
      }
    });

    this.setState({
      selectedCheckboxes,
      checkedSchemes,
    });
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
    localStorage.setItem(
      "selectedCheckboxes",
      JSON.stringify(selectedCheckboxes)
    );
    const {
      onUpdateSchemeAnalytes,
      onAddNewInstrumentAnalyte,
      match,
      ListUnit,
      InstrumentAnalyteList = [], // Ensure it's always an array
      history,
    } = this.props;

    const schemeId = match?.params?.id;
    const { organization_name } = match?.params || {};

    if (!schemeId) {
      console.error("Scheme ID not found");
      return;
    }

    // Get selected analytes
    const selectedAnalytes =
      ListUnit?.filter(analyte => selectedCheckboxes[analyte.id]) || [];

    if (selectedAnalytes.length === 0) {
      this.setFeedbackMessage("Please select analytes.");
      return;
    }

    // Extract selected analyte IDs
    const selectedAnalyteIds = selectedAnalytes.map(analyte => analyte.id);

    // Ensure existing analyte list is an array
    const existingAnalyteIds = Array.isArray(InstrumentAnalyteList)
      ? InstrumentAnalyteList.map(analyte => analyte.id)
      : [];

    // Merge new analytes with existing ones, avoiding duplicates
    const uniqueAnalyteIds = [
      ...new Set([...existingAnalyteIds, ...selectedAnalyteIds]),
    ];

    const payload = {
      id: schemeId,
      analytes: uniqueAnalyteIds,
    };

    // Call API to update or add analytes
    if (existingAnalyteIds.length > 0) {
      onUpdateSchemeAnalytes(payload);
      this.setFeedbackMessage("Analytes updated successfully.");
    } else {
      onAddNewInstrumentAnalyte(payload, schemeId);
      this.setFeedbackMessage("Analytes added successfully.");
    }

    // Redirect to equipment list
    history.push(`/${organization_name}/equipment-list`);
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
                    {this.props.instrumentName || "Loading..."}
                  </span>
                </>
              }
            />
            <Row className="mb-3">
              <Col>
                <h5>Select Schemes for Instrument</h5>
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

InstrumentAddAnalyte.propTypes = {
  match: PropTypes.object,
  ListUnit: PropTypes.array,
  InstrumentAnalyteList: PropTypes.array,
  instrumentName: PropTypes.object,
  onGetSchemeAnalytes: PropTypes.func,
  ongetAnalytelist: PropTypes.func,
  onAddNewInstrumentAnalyte: PropTypes.func,
  onUpdateSchemeAnalytes: PropTypes.func,
  history: PropTypes.object.isRequired,
  activeSchemes: PropTypes.array,
};
const mapStateToProps = state => ({
  ListUnit: state.ListUnit?.ListUnit || [],
  InstrumentAnalyteList: state.ListUnit?.InstrumentAnalyteList || [],
  instrumentName: state.ListUnit?.instrumentName || "Unknown Instrument",
  activeSchemes: state.ListUnit?.activeSchemes || [],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetSchemeAnalytes: id => dispatch(getInstrumentAnalytelist(id)),
  ongetAnalytelist: id => dispatch(getAnalytelist(id)),
  onAddNewInstrumentAnalyte: (addInstrumentAnalyte, id) => {
    console.log(
      "Adding new scheme analyte:",
      addInstrumentAnalyte,
      "with ID:",
      id
    );
    return dispatch(addNewInstrumentAnalytelist(addInstrumentAnalyte, id));
  },
  onUpdateSchemeAnalytes: schemeanalyte =>
    dispatch(updateInstrumentAnalytelist(schemeanalyte)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InstrumentAddAnalyte));
