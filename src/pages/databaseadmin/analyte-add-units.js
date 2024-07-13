import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Col, Container, Row, Alert } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

// Import actions
import { getunitlist, getAnalyteUnitlist, addNewAnalyteUnitlist, updateAnalyteUnitlist } from "store/units/actions";
import "assets/scss/table.scss";

class AnalyteAddUnits extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: '',
      idFilter: '',
      selectedCheckboxes: {}, // Track checked checkboxes
      tableKey: 0,
      UnitAnalyteList: [],
      feedbackMessage: '',
      errorMessage: '', // State for error message
      feedbackListColumns: [
        {
          text: "ID",
          dataField: "id",
          sort: true,
          headerFormatter: (column, colIndex) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.idFilter}
                  onChange={e => this.handleFilterChange('idFilter', e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          headerStyle: { width: '100px' },
          style: { width: '100px' },
        },
        {
          dataField: "name",
          text: "Units",
          sort: true,
          headerFormatter: (column, colIndex) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.nameFilter}
                  onChange={e => this.handleFilterChange('nameFilter', e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          headerAlign: 'center',
          align: 'left',
        },
        {
          dataField: "checkbox",
          text: "Allowed Units",
          formatter: (cellContent, row) => {
            return (
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`allowedUnitCheckbox${row.id}`}
                  onChange={() => this.handleCheckboxChange(row.id, "allowedUnit")}
                  style={{ cursor: "pointer" }}
                  checked={this.state.selectedCheckboxes[row.id]?.allowedUnit || false}
                />
              </div>
            );
          },
        },
        {
          dataField: "masterCheckbox",
          text: "Master Unit",
          formatter: (cellContent, row) => {
            return (
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`masterUnitCheckbox${row.id}`}
                  onChange={() => this.handleCheckboxChange(row.id, "masterUnit")}
                  style={{ cursor: "pointer" }}
                  checked={this.state.selectedCheckboxes[row.id]?.masterUnit || false}
                />
              </div>
            );
          },
        },
      ],
    };
  }

  componentDidMount() {
    // Fetch data when the component mounts
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    // Add console.log to check when componentDidUpdate is triggered
    console.log('Component did update');
    
    // Update selectedCheckboxes when UnitAnalyteList changes
    if (prevProps.UnitAnalyteList !== this.props.UnitAnalyteList) {
      console.log('UnitAnalyteList prop changed');
      console.log('Previous UnitAnalyteList:', prevProps.UnitAnalyteList);
      console.log('Current UnitAnalyteList:', this.props.UnitAnalyteList);
      
      if (this.props.UnitAnalyteList) {
        this.updateSelectedCheckboxes();
      }
    }
  }

  fetchData() {
    const { onGetReagentList, onGetAnalyteUnits } = this.props;
    const analyteId = this.props.match.params.id;

    if (analyteId) {
      onGetAnalyteUnits(analyteId);
    } else {
      console.error("Analyte ID not found in URL parameters");
    }

    const authUser = localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser"))
      : null;
    const user_id = authUser ? authUser.user_id : null;

    if (user_id) {
      console.log("User ID found:", user_id);
      onGetReagentList(user_id);
    } else {
      console.error("User ID not found in localStorage");
    }
  }

  updateSelectedCheckboxes() {
    const { units, master_unit } = this.props.UnitAnalyteList;
    const selectedCheckboxes = {};
  
    // Ensure units is initialized and an array
    if (Array.isArray(units)) {
      units.forEach(id => {
        selectedCheckboxes[id] = {
          allowedUnit: true,
          masterUnit: false,
        };
      });
    } else {
      console.warn('UnitAnalyteList.units is not an array or is undefined/null.');
      // Handle this case based on your application logic
    }
  
    // Handle master_unit separately
    if (master_unit) {
      selectedCheckboxes[master_unit] = {
        ...selectedCheckboxes[master_unit],
        masterUnit: true,
      };
    } else {
      console.warn('master_unit is not defined or is falsy.');
      // Handle this case based on your application logic
    }
  
    this.setState({ selectedCheckboxes });
  }

  handleSave = () => {
    const { selectedCheckboxes } = this.state;
    const { onUpdateAnalyteUnits, match, ListUnits } = this.props;
    const analyteId = match.params.id;

    // Check if at least one Allowed Unit is selected
    const selectedUnits = ListUnits.filter(unit => selectedCheckboxes[unit.id]?.allowedUnit);
    if (selectedUnits.length === 0) {
      this.setState({ errorMessage: "Please select at least one Allowed Unit." });
      setTimeout(() => {
        this.setState({ errorMessage: '' });
      }, 1000);
      return;
    }

    // Check if Master Unit is selected
    const masterUnit = Object.keys(selectedCheckboxes).find(key => selectedCheckboxes[key]?.masterUnit);
    if (!masterUnit) {
      this.setState({ errorMessage: "Please select a Master Unit." });
      setTimeout(() => {
        this.setState({ errorMessage: '' });
      }, 1000);
      return;
    }

    const payload = {
      id: analyteId,
      units: selectedUnits.map(unit => unit.id), // Map to only unit IDs
      masterUnit: masterUnit ? parseInt(masterUnit) : null
    };

    // Determine if we are adding or updating based on analyteId presence
    if (analyteId) {
      // If analyteId exists, we are updating
      onUpdateAnalyteUnits(payload);
      this.setFeedbackMessage("Units updated successfully.");
    } else {
      // Otherwise, we are adding new
      // Call your add new method here if needed
      // this.props.onAddNewAnalyteUnits(payload, someOtherId); 
      this.setFeedbackMessage("Units added successfully.");
    }

    // Clear error message after successful save
    this.setState({ errorMessage: '' });
  };

  setFeedbackMessage = (message) => {
    this.setState({ feedbackMessage: message }, () => {
      // Optionally, clear the message after a few seconds
      setTimeout(() => {
        this.props.history.push("/database-of-analyte");
      }, 500); // 3 seconds
    });
  };

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  handleCheckboxChange = (id, column) => {
    this.setState(prevState => {
      let selectedCheckboxes = { ...prevState.selectedCheckboxes };

      if (column === "masterUnit") {
        // Uncheck all other checkboxes in the "Master Unit" column
        Object.keys(selectedCheckboxes).forEach(key => {
          if (selectedCheckboxes[key]?.masterUnit && key !== id.toString()) {
            selectedCheckboxes[key].masterUnit = false;
          }
        });

        // Toggle the selected checkbox in the "Master Unit" column
        selectedCheckboxes[id] = {
          ...selectedCheckboxes[id],
          masterUnit: !selectedCheckboxes[id]?.masterUnit
        };
      } else if (column === "allowedUnit") {
        // Count currently selected allowed units
        let countAllowedUnits = Object.values(selectedCheckboxes).reduce((count, checkbox) => {
          return count + (checkbox.allowedUnit ? 1 : 0);
        }, 0);

        // Check if the limit (2) has been reached
        if (selectedCheckboxes[id]?.allowedUnit || countAllowedUnits < 2) {
          // Toggle the selected checkbox in the "Allowed Unit" column
          selectedCheckboxes[id] = {
            ...selectedCheckboxes[id],
            allowedUnit: !selectedCheckboxes[id]?.allowedUnit
          };
        }
      }

      return { selectedCheckboxes };
    }, () => {
      // Force table re-render by updating the key
      this.setState(prevState => ({ tableKey: prevState.tableKey + 1 }));
    });
  };

  filterData = () => {
    const { ListUnits } = this.props;
    const { nameFilter, idFilter, selectedCheckboxes } = this.state;

    const filteredData = ListUnits.filter(entry => {
      const name = entry.name ? entry.name.toString().toLowerCase() : "";
      const id = entry.id ? entry.id.toString() : "";

      return (
        name.includes(nameFilter.toLowerCase()) &&
        id.includes(idFilter)
      );
    }).map(entry => ({
      ...entry,
      checkbox: (
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id={`checkbox${entry.id}`}
            onChange={() => this.handleCheckboxChange(entry.id, "allowedUnit")}
            style={{ cursor: "pointer" }}
            checked={selectedCheckboxes[entry.id]?.allowedUnit || false}
          />
        </div>
      ),
      masterCheckbox: (
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id={`masterCheckbox${entry.id}`}
            onChange={() => this.handleCheckboxChange(entry.id, "masterUnit")}
            style={{ cursor: "pointer" }}
            checked={selectedCheckboxes[entry.id]?.masterUnit || false}
          />
        </div>
      )
    }));

    return filteredData;
  };

  render() {
    const { ListUnits } = this.props;
    const { SearchBar } = Search;
    const defaultSorted = [{ dataField: "id", order: "desc" }];
    const { errorMessage, feedbackMessage } = this.state;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Unit List</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="List" breadcrumbItem="Unit List" />
            <Row className="justify-content-center">
              <Col lg="5">
                <Card>
                  <CardBody>
                    <Row>
                      <Col className="pagination pagination-rounded justify-content-center mb-2">
                        {feedbackMessage && (
                          <div className="alert alert-success" role="alert">
                            {feedbackMessage}
                          </div>
                        )}
                        {errorMessage && (
                          <Alert color="danger">
                            {errorMessage}
                          </Alert>
                        )}
                      </Col>
                    </Row>
                    <ToolkitProvider
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={ListUnits}
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

AnalyteAddUnits.propTypes = {
  match: PropTypes.object,
  ListUnits: PropTypes.array,
  UnitAnalyteList: PropTypes.array,
  onGetAnalyteUnits: PropTypes.func,
  history: PropTypes.object,
  onGetReagentList: PropTypes.func,
  onAddNewAnalyteUnits: PropTypes.func,
  onUpdateAnalyteUnits: PropTypes.func,
};

const mapStateToProps = (state) => ({
  ListUnits: state.ListUnits?.ListUnits || [], // Ensure ListUnits is handled properly too
  UnitAnalyteList: state.ListUnits?.UnitAnalyteList || [], // Handle case where UnitAnalyteList might be undefined
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetAnalyteUnits: id => dispatch(getAnalyteUnitlist(id)),
  onGetReagentList: (id) => dispatch(getunitlist(id)),
  onAddNewAnalyteUnits: (createAnalyteUnit, id) => dispatch(addNewAnalyteUnitlist(createAnalyteUnit, id)),
  onUpdateAnalyteUnits: (analytesunit) => dispatch(updateAnalyteUnitlist(analytesunit)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AnalyteAddUnits));