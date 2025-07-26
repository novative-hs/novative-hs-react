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
  getMethodAnalytelist,
  addNewMethodAnalytelist,
  updateMethodAnalytelist,
} from "store/databaseofunits/actions";
import "assets/scss/table.scss";

class MethodAddAnalyte extends Component {
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
      prevProps.MethodAnayteList !== this.props.MethodAnayteList ||
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
    const { MethodAnayteList = [], activeSchemes = [] } = this.props;

    if (!MethodAnayteList.length) {
      this.setState({ selectedCheckboxes: {}, checkedSchemes: {} });
      return;
    }

    const selectedCheckboxes = {};
    const checkedSchemes = {};

    MethodAnayteList.forEach(analyte => {
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
    const {
      onAddNewMethodAnalyte,
      onUpdateMethodAnalytes,
      match,
      ListUnit,
      MethodAnayteList,
      history,
    } = this.props;
    const methodId = match.params.id;
    const organizationName = match.params.organization_name;

    const selectedMethods = ListUnit.filter(
      methodlist => selectedCheckboxes[methodlist.id]
    );

    if (selectedMethods.length === 0) {
      this.setState({ errorMessage: "Please select Method First." });
      setTimeout(() => {
        this.setState({ errorMessage: "" });
      }, 1000);
      return;
    }

    const payload = {
      id: methodId,
      analytes: selectedMethods.map(methodlist => methodlist.id),
    };

    if (MethodAnayteList && MethodAnayteList.length > 0) {
      onUpdateMethodAnalytes(payload);
      this.setFeedbackMessage("Analytes updated successfully.");
    } else {
      onAddNewMethodAnalyte(payload, methodId);
      this.setFeedbackMessage("Analytes added successfully.");
    }

    // Redirect after small delay
    setTimeout(() => {
      history.push(`/${organizationName}/database-of-method`);
    }, 500); // 0.5 second delay to allow for feedback message
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
                    {this.props.methodName || "Loading..."}
                  </span>
                </>
              }
            />
            <Row className="mb-3">
              <Col>
                <h5>Select Schemes for Method</h5>
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
MethodAddAnalyte.propTypes = {
  match: PropTypes.object,
  ListUnit: PropTypes.array,
  MethodAnayteList: PropTypes.array,
  methodName: PropTypes.object,
  onGetSchemeAnalytes: PropTypes.func,
  ongetAnalytelist: PropTypes.func,
  onAddNewInstrumentAnalyte: PropTypes.func,
  onUpdateSchemeAnalytes: PropTypes.func,
  history: PropTypes.object.isRequired,
  activeSchemes: PropTypes.array,
  onAddNewMethodAnalyte: PropTypes.func,
  onUpdateMethodAnalytes: PropTypes.func,

  // ✅ Add these missing ones
  onAddNewAnalyteMethod: PropTypes.func,
  onUpdateAnalyteMethod: PropTypes.func,
};

const mapStateToProps = state => ({
  ListUnit: state.ListUnit?.ListUnit || [],
  MethodAnayteList: state.ListUnit?.MethodAnayteList || [],
  methodName: state.ListUnit?.methodName || "Unknown Instrument",
  activeSchemes: state.ListUnit?.activeSchemes || [],
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetSchemeAnalytes: id => dispatch(getMethodAnalytelist(id)),
  ongetAnalytelist: id => dispatch(getAnalytelist(id)),

  // ✅ Rename this to match the correct domain
  onAddNewMethodAnalyte: (addMethodAnalyte, id) => {
    console.log("Adding new method analyte:", addMethodAnalyte, "with ID:", id);
    return dispatch(addNewMethodAnalytelist(addMethodAnalyte, id));
  },

  // ✅ Also this is about method, not instrument
  onUpdateMethodAnalytes: schemeanalyte =>
    dispatch(updateMethodAnalytelist(schemeanalyte)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MethodAddAnalyte));
