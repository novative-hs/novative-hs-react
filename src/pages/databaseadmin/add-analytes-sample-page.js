import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

// Import actions
import { 
  getAnalytelist, 
  getSampleAnalytelist, 
  addNewSampleAnalytelist, 
  updateSampleAnalytelist 
} from "store/databaseofunits/actions";
import "assets/scss/table.scss";

class SchemeAddAnalyte extends Component {
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
          text: "Analytes",
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
    // Update selectedCheckboxes when SampleAnalyteList changes
    if (prevProps.SampleAnalyteList !== this.props.SampleAnalyteList) {
      this.updateSelectedCheckboxes();
    }
  }

  fetchData()  {
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
    const selectedCheckboxes = {};
    this.props.SampleAnalyteList.forEach(id => {
      selectedCheckboxes[id] = true; // Assuming SampleAnalyteList is an array of IDs
    });
    this.setState({ selectedCheckboxes });
  }

  handleSave = () => {
    const { selectedCheckboxes } = this.state;
    const { onUpdateSchemeAnalytes, match, ListUnit, history } = this.props;
    const schemeId = match.params.id;
    const { organization_name } = this.props.match.params;

    const selectedAnalytes = ListUnit.filter(analyte => selectedCheckboxes[analyte.id]);
    
    if (selectedAnalytes.length === 0) {
      // Display validation message if no analytes are selected
      this.setFeedbackMessage("Please select analytes.");
      return;
    }

    if (schemeId) {
      const payload = {
        id: schemeId,
        analytes: selectedAnalytes.map(analyte => analyte.id)  // Map to only analyte IDs
      };

      // Determine if we are adding or updating based on schemeId presence
      if (schemeId) {
        // If schemeId exists, we are updating
        onUpdateSchemeAnalytes(payload);
        this.setFeedbackMessage("Analytes updated successfully.");
      } else {
        // Otherwise, we are adding new
        // Call your add new method here if needed
        // this.props.onAddNewSchemeAnalytes(payload, someOtherId); 
        this.setFeedbackMessage("Analytes added successfully.");
      }
      history.push(`/${organization_name}/sample`);
    } else {
      console.error("Analyte ID not found");
    }
  };

  setFeedbackMessage = (message) => {
    this.setState({ feedbackMessage: message }, () => {
      // Optionally, clear the message after a few seconds
      setTimeout(() => {
        this.setState({ feedbackMessage: '' });
      }, 3000); // 3 seconds
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
    const { ListUnit } = this.props;
    console.log("data on page is ", ListUnit)
    const { nameFilter, idFilter, selectedCheckboxes } = this.state;
    console.log("data on page is ", selectedCheckboxes)
    const filteredData = ListUnit.filter(entry => {
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
  breadcrumbItem={`Analytes for ${this.props.SampleName || "Unknown Sample"}`}
/>
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

SchemeAddAnalyte.propTypes = {
  match: PropTypes.object,
  ListUnit: PropTypes.array,
  SampleAnalyteList: PropTypes.array,
  onGetSchemeAnalytes: PropTypes.func,
  ongetAnalytelist: PropTypes.func,
  SampleName: PropTypes.object,
  onAddNewSchemeAnalytes: PropTypes.func,
  onUpdateSchemeAnalytes: PropTypes.func, 
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  ListUnit: state.ListUnit?.ListUnit || [],
  SampleAnalyteList: state.ListUnit?.SampleAnalyteList || [],
  SampleName: state.ListUnit?.SampleName || "Unknown Sample", // Map SampleName
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetSchemeAnalytes: id => dispatch(getSampleAnalytelist(id)),
  ongetAnalytelist: (id) => dispatch(getAnalytelist(id)),
  onAddNewSchemeAnalytes: (createSchemeAnalyte, id) => dispatch(addNewSampleAnalytelist(createSchemeAnalyte, id)),
  onUpdateSchemeAnalytes: (schemeanalyte) => dispatch(updateSampleAnalytelist(schemeanalyte)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SchemeAddAnalyte));

