

import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Col, Container, Row,Alert } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

// Import actions
import { getmethodlist ,getAnalyteMethodlist,addNewAnalyteMethodlist,updateAnalyteMethodlist } from "store/methods/actions";
import "assets/scss/table.scss";

class AnalyteAddMethods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: '',
      idFilter: '',
      selectedCheckboxes: {}, // Track checked checkboxes
      tableKey: 0,
      feedbackMessage: '',
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
          text: "Methods",
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
    // Fetch data when the component mounts
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    // Update selectedCheckboxes when MethodAnalyteList changes
    if (prevProps.MethodAnalyteList !== this.props.MethodAnalyteList) {
      this.updateSelectedCheckboxes();
    }
  }

  fetchData() {
    const { onGetMethodList, onGetAnalyteMethods } = this.props;
    const analyteId = this.props.match.params.id;

    if (analyteId) {
      onGetAnalyteMethods(analyteId);
    } else {
      console.error("Analyte ID not found in URL parameters");
    }

    const authUser = localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser"))
      : null;
    const user_id = authUser ? authUser.user_id : null;

    if (user_id) {
      console.log("User ID found:", user_id);
      onGetMethodList(user_id);
    } else {
      console.error("User ID not found in localStorage");
    }
  }

  updateSelectedCheckboxes() {
    const selectedCheckboxes = {};
    this.props.MethodAnalyteList.forEach(id => {
      selectedCheckboxes[id] = true; // Assuming MethodAnalyteList is an array of IDs
    });
    this.setState({ selectedCheckboxes });
  }

  handleSave = () => {
    const { selectedCheckboxes } = this.state;
    const { onUpdateAnalyteMethods, match, ListMethods } = this.props;
    const analyteId = match.params.id;

    const selectedMethods = ListMethods.filter(method => selectedCheckboxes[method.id]);
    if (selectedMethods.length === 0) {
      this.setState({ errorMessage: "Please select Methods First." });
      // Clear error message after 5 seconds
      setTimeout(() => {
        this.setState({ errorMessage: '' });
      }, 1000);
      return;
    }


    if (analyteId) {
      const payload = {
        id: analyteId,
        methods: selectedMethods.map(method => method.id),  // Map to only method IDs
        
      };
      
      console.log('Payload before update:', payload);
      // Determine if we are adding or updating based on analyteId presence
      if (analyteId) {
        // If analyteId exists, we are updating
        onUpdateAnalyteMethods(payload);
        this.setFeedbackMessage("Methods updated successfully.");
      } else {
        // Otherwise, we are adding new
        // Call your add new method here if needed
        // this.props.onAddNewAnalyteMethods(payload, someOtherId); 
        this.setFeedbackMessage("Methods added successfully.");
      }
    } else {
      console.error("Analyte ID not found");
    }
  };

  setFeedbackMessage = (message) => {
    this.setState({ feedbackMessage: message }, () => {
      // Optionally, clear the message after a few seconds
      setTimeout(() => {
        this.props.history.push("/database-of-analyte");
      }, 500);
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
    const { ListMethods } = this.props;
    const { nameFilter, idFilter, selectedCheckboxes } = this.state;

    const filteredData = ListMethods.filter(entry => {
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
    const { ListMethods } = this.props;
    const defaultSorted = [{ dataField: "id", order: "desc" }];
    const { errorMessage } = this.state;


    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Method List</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="List" breadcrumbItem="Method List" />
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
                      data={ListMethods}
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

AnalyteAddMethods.propTypes = {
  match: PropTypes.object,
  ListMethods: PropTypes.array,
  MethodAnalyteList: PropTypes.array,
  history: PropTypes.object,
  onGetAnalyteMethods: PropTypes.func,
  onGetMethodList: PropTypes.func,
  onAddNewAnalyteMethods: PropTypes.func,
  onUpdateAnalyteMethods: PropTypes.func,
};

const mapStateToProps = (state) => ({
  ListMethods: state.ListMethods?.ListMethods,
  MethodAnalyteList: state.ListMethods?.MethodAnalyteList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetAnalyteMethods: id => dispatch(getAnalyteMethodlist(id)),
  onGetMethodList: (id) => dispatch(getmethodlist(id)),
  onAddNewAnalyteMethods: (createAnalyteMethod, id) => dispatch(addNewAnalyteMethodlist(createAnalyteMethod, id)),
  onUpdateAnalyteMethods: (analytesmethod) => dispatch(updateAnalyteMethodlist(analytesmethod)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AnalyteAddMethods));

