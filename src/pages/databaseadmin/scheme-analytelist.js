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
// import { getSchemeAnalyte } from "store/scheme/actions";
import { 
  getSchemeAnalytelist
} from "store/databaseofunits/actions";
import "assets/scss/table.scss";

class SchemeListAnalyte extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: '',
      idFilter: '',
      // SchemeList: [],
      selectedCheckboxes: {}, // Track checked checkboxes
      tableKey: 0,
      SchemeAnalyteList: [],
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
          formatter: (cell, row) => (typeof cell === "string" ? cell : "Unknown"), // Fallback for invalid data
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
          headerAlign: "center",
          align: "left",
        }
        ,
      ],
    };
  }

  componentDidMount() {
    // Fetch data when the component mounts
    this.fetchData();
  }
  componentDidUpdate(prevProps) {
    if (this.props.SchemeName !== prevProps.SchemeName) {
      console.log("Updated SchemeName from Props:", this.props.SchemeName);
      this.setState({ SchemeName: this.props.SchemeName });
    }
    if (this.props.SchemeAnalyteList !== prevProps.SchemeAnalyteList) {
      console.log("New Props SchemeAnalyte:", this.props.SchemeAnalyteList);
      
      if (Array.isArray(this.props.SchemeAnalyteList) && this.props.SchemeAnalyteList.length > 0) {
        const transformedData = this.props.SchemeAnalyteList.map((analyte, index) => ({
          id: index + 1,
          name: typeof analyte === "object" ? analyte.name : analyte, // Handle objects or strings
          
        }));

        console.log("SchemeAnalyteList in Props:", this.props.SchemeAnalyteList);

  
        console.log("Transformed Data:", transformedData); // Debugging log
        this.setState({ SchemeAnalyteList: transformedData,  SchemeName: this.props.SchemeName || "Unknown", tableKey: this.state.tableKey + 1 });
      }
    }
  }

  fetchData() {
    const { onGetUnitAnalyteList } = this.props;
    const unitanalyteId = this.props.match.params.id;
    console.log("Fetching data for ID:", unitanalyteId);
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
    const { SchemeAnalyteList } = this.state;  // Now using the state instead of props
    const { nameFilter, idFilter } = this.state;

    if (!Array.isArray(SchemeAnalyteList)) {
      return []; // Return empty array if not an array
    }

    const filteredData = SchemeAnalyteList.filter(entry => {
      const name = typeof entry.name === "string" ? entry.name.toLowerCase() : "";
      const id = entry.id ? entry.id.toString() : "";

      return (
        name.includes(nameFilter.toLowerCase()) &&
        id.includes(idFilter)
      );
    });

    return filteredData;
  };

  render() {
    const { SchemeAnalyteList } = this.state;
    console.log("SchemeAnalyteeeeeeeeeeeeeeeeeee",SchemeAnalyteList);
    const defaultSorted = [{ dataField: "id", order: "desc" }];
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Scheme Analytes List</title>
          </MetaTags>
          <Container fluid>
          <Breadcrumbs
  title="List"
  breadcrumbItem={`Analytes for ${this.state.SchemeName || "Unknown"}`}
/>
            <Row className="justify-content-center">
              <Col lg="4">
                <Card>
                  <CardBody>
                    <ToolkitProvider
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={SchemeAnalyteList}
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

SchemeListAnalyte.propTypes = {
  match: PropTypes.object,
  SchemeAnalyteList: PropTypes.array,
  // SchemeList: PropTypes.array,
  SchemeName: PropTypes.array,
  history: PropTypes.object,
  // onGetSchemeAnalyte: PropTypes.func,
  onGetUnitAnalyteList: PropTypes.func,
};
const mapStateToProps = (state) => {
  const SchemeAnalyteList = state.ListUnit?.SchemeAnalyteList || [];
  const SchemeName = state.ListUnit?.SchemeName  || "Unknown"; // Fetch SchemeName from Redux state
  console.log('SchemeAnalyteList from Redux State:', SchemeAnalyteList);
  console.log('SchemeName from Redux State:', SchemeName); // Log SchemeName // Log only SchemeAnalyte
  return {
    SchemeAnalyteList,
    SchemeName, // Add SchemeName to props
  };
};


const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetUnitAnalyteList: (id) => dispatch(getSchemeAnalytelist(id)),
  // onGetSchemeAnalytelist: (id) => dispatch(getSchemeAnalytelist(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SchemeListAnalyte));