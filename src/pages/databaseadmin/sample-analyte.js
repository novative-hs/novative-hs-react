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
import { getAnalyteSampleList } from "store/databaseofunits/actions";
import "assets/scss/table.scss";

class SampleListAnalytes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: '',
      idFilter: '',
      selectedCheckboxes: {}, // Track checked checkboxes
      tableKey: 0,
      SampleListAnalyte: [], // Initialize as empty array
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
          text: "Analyte",
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
      ],
    };
  }

  componentDidMount() {
    // Fetch data when the component mounts
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.SampleListAnalyte !== prevProps.SampleListAnalyte) {
      console.log("New Props SampleListAnalyte:", this.props.SampleListAnalyte);
      
      if (Array.isArray(this.props.SampleListAnalyte) && this.props.SampleListAnalyte.length > 0) {
        const transformedData = this.props.SampleListAnalyte.map((analyte, index) => ({
          id: index + 1,
          name: analyte,
        }));
  
        console.log("Transformed Data:", transformedData); // Debugging log
        this.setState({ SampleListAnalyte: transformedData, tableKey: this.state.tableKey + 1 });
      }
    }
  }
  
  
fetchData() {
  const { onGetUnitAnalyteList } = this.props;
  const unitanalyteId = this.props.match.params.id;

  console.log("Fetching data for ID:", unitanalyteId); // Debugging log

  if (unitanalyteId) {
      onGetUnitAnalyteList(unitanalyteId);
  } else {
      console.error("Analyte ID not found in URL parameters");
  }
}

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  filterData = () => {
    const { SampleListAnalyte } = this.state;  // Now using the state instead of props
    const { nameFilter, idFilter } = this.state;

    if (!Array.isArray(SampleListAnalyte)) {
      return []; // Return empty array if not an array
    }

    const filteredData = SampleListAnalyte.filter(entry => {
      const name = entry.name ? entry.name.toString().toLowerCase() : "";
      const id = entry.id ? entry.id.toString() : "";

      return (
        name.includes(nameFilter.toLowerCase()) &&
        id.includes(idFilter)
      );
    });

    return filteredData;
  };

  render() {
    const { SampleListAnalyte } = this.state;
    console.log("Transformed SampleListAnalyte", SampleListAnalyte);
    const defaultSorted = [{ dataField: "id", order: "desc" }];
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Sample Analytes List</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="List" breadcrumbItem="Sample Analytes List" />
            <Row className="justify-content-center">
              <Col lg="4">
                <Card>
                  <CardBody>
                    <ToolkitProvider
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={SampleListAnalyte}
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

SampleListAnalytes.propTypes = {
  match: PropTypes.object,
  SampleListAnalyte: PropTypes.array,
  history: PropTypes.object,
  onGetUnitAnalyteList: PropTypes.func,
};
const mapStateToProps = (state) => ({
  SampleListAnalyte: state.ListUnit.SampleListAnalyte, // Ensure correct key
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetUnitAnalyteList: (id) => dispatch(getAnalyteSampleList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SampleListAnalytes));
