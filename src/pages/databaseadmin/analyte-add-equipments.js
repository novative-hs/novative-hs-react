
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Col, Container, Row, Alert } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

// Import actions

import { getAnalyteEquipmentlist, addNewAnalyteEquipmentlist, updateAnalyteEquipmentlist, getInstrumentlist } from "store/instrument/actions";
import "assets/scss/table.scss";

class AnalyteAddEquipments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: '',
      organization_name: '',
      idFilter: '',
      selectedCheckboxes: {}, // Track checked checkboxes
      tableKey: 0,
      feedbackMessage: '',
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
          text: "Equipments",
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
          text: "Select",
          formatter: (cellContent, row) => (
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={`checkbox${row.id}`}
                onChange={() => this.handleCheckboxChange(row.id)}
                style={{ cursor: "pointer" }}
                checked={this.state.selectedCheckboxes[row.id] || false} // Check based on selectedCheckboxes state
              />
            </div>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    const { organization_name } = this.props.match.params;
    // Only set state if organization_name is empty
    if (!this.state.organization_name) {
      this.setState({ organization_name });
    }
    // Fetch data when the component mounts
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    // Update selectedCheckboxes when EquipmentAnalyteList changes
    if (prevProps.EquipmentAnalyteList !== this.props.EquipmentAnalyteList) {
      this.updateSelectedCheckboxes();
    }
  }

  fetchData() {
    const { onGetEquipmentList, onGetAnalyteEquipments } = this.props;
    const analyteId = this.props.match.params.id;

    if (analyteId) {
      onGetAnalyteEquipments(analyteId);
    } else {
      console.error("Analyte ID not found in URL parameters");
    }

    const authUser = localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser"))
      : null;
    const user_id = authUser ? authUser.user_id : null;

    if (user_id) {
      console.log("User ID found:", user_id);
      onGetEquipmentList(user_id);
    } else {
      console.error("User ID not found in localStorage");
    }
  }

  updateSelectedCheckboxes() {
    const selectedCheckboxes = {};
    this.props.EquipmentAnalyteList.forEach(id => {
      selectedCheckboxes[id] = true; // Assuming EquipmentAnalyteList is an array of IDs
    });
    this.setState({ selectedCheckboxes });
  }

  handleSave = () => {
    const { selectedCheckboxes } = this.state;
    const { onUpdateAnalyteEquipments, match, Instrument } = this.props;
    const analyteId = match.params.id;

    const selectedEquipments = Instrument.filter(unit => selectedCheckboxes[unit.id]);

    if (selectedEquipments.length === 0) {
      this.setState({ errorMessage: "Please select Equipment First." });
      // Clear error message after 5 seconds
      setTimeout(() => {
        this.setState({ errorMessage: '' });
      }, 1000);
      return;
    }


    if (analyteId) {
      const payload = {
        id: analyteId,
        equipments: selectedEquipments.map(unit => unit.id)  // Map to only unit IDs
      };

      // Determine if we are adding or updating based on analyteId presence
      if (analyteId) {
        // If analyteId exists, we are updating
        onUpdateAnalyteEquipments(payload);
        this.setFeedbackMessage("Equipments updated successfully.");
      } else {
        // Otherwise, we are adding new
        // Call your add new method here if needed
        // this.props.onAddNewAnalyteEquipments(payload, someOtherId); 
        this.setFeedbackMessage("Equipments added successfully.");
      }
    } else {
      console.error("Analyte ID not found");
    }
  };

  setFeedbackMessage = (message) => {
    this.setState({ feedbackMessage: message }, () => {
      // Optionally, clear the message after a few seconds
      setTimeout(() => {
        this.props.history.push(`/${this.state.organization_name}/database-of-analyte`);
      }, 500); // 3 seconds
    });
  };

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  handleCheckboxChange = (id) => {
    this.setState(prevState => ({
      selectedCheckboxes: {
        ...prevState.selectedCheckboxes,
        [id]: !prevState.selectedCheckboxes[id]
      }
    }));
  };

  filterData = () => {
    const { Instrument } = this.props;
    const { nameFilter, idFilter, selectedCheckboxes } = this.state;

    const filteredData = Instrument.filter(entry => {
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
            onChange={() => this.handleCheckboxChange(entry.id)}
            style={{ cursor: "pointer" }}
            checked={selectedCheckboxes[entry.id] || false}
          />
        </div>
      )
    }));

    return filteredData;
  };

  render() {
    const { Instrument } = this.props;
    const defaultSorted = [{ dataField: "id", order: "desc" }];
    const { errorMessage } = this.state;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Equipments List</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs
              title="List"
              breadcrumbItem={
                <>
                  Equipment List - {" "}
                  <span style={{ color: "black", fontWeight: "bold" }}>
                    {this.props.analyte_name || "Loading..."}
                  </span>
                </>
              }
            />

            <Row className="justify-content-center">
              <Col lg="5">
                <Card>
                  <CardBody>
                    <Row>
                      <Col className="pagination pagination-rounded justify-content-center mb-2">
                        {this.state.feedbackMessage && (
                          <div className="alert alert-success" role="alert">
                            {this.state.feedbackMessage}
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
                      data={Instrument}
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

AnalyteAddEquipments.propTypes = {
  match: PropTypes.object,
  Instrument: PropTypes.array,
  EquipmentAnalyteList: PropTypes.array,
  history: PropTypes.object,
  analyte_name: PropTypes.object,
  onGetAnalyteEquipments: PropTypes.func,
  onGetEquipmentList: PropTypes.func,
  onAddNewAnalyteEquipments: PropTypes.func,
  onUpdateAnalyteEquipments: PropTypes.func,
};

const mapStateToProps = (state) => {
  // Log the entire Redux state
  console.log("Redux State in mapStateToProps:", state);

  // Extract and log the mapped values
  const Instrument = state.Instrument?.Instrument || [];
  const EquipmentAnalyteList = state.Instrument?.EquipmentAnalyteList || [];
  const analyte_name = state.Instrument?.analyte_name || '';

  console.log("Mapped Instrument:", Instrument);
  console.log("Mapped EquipmentAnalyteList:", EquipmentAnalyteList);
  console.log("Mapped analyte_name:", analyte_name);

  return {
    Instrument,
    EquipmentAnalyteList,
    analyte_name,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetAnalyteEquipments: id => dispatch(getAnalyteEquipmentlist(id)),
  onGetEquipmentList: (id) => dispatch(getInstrumentlist(id)),
  onAddNewAnalyteEquipments: (createAnalyteEquipment, id) => dispatch(addNewAnalyteEquipmentlist(createAnalyteEquipment, id)),
  onUpdateAnalyteEquipments: (analytesequipment) => dispatch(updateAnalyteEquipmentlist(analytesequipment)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AnalyteAddEquipments));