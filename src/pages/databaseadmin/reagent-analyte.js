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
import { getAnalyteReagent } from "store/units/actions";
import "assets/scss/table.scss";

class ReagentAnalyte extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: '',
      idFilter: '',
      selectedCheckboxes: {}, // Track checked checkboxes
      tableKey: 0,
      ReagentAnalyte: [],
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
    const { ReagentAnalyte } = this.props;

    const { nameFilter, idFilter} = this.state;

    const filteredData = ReagentAnalyte.filter(entry => {
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
    const { ReagentAnalyte } = this.props;
    console.log("ReagentAnalyte",ReagentAnalyte);
    const defaultSorted = [{ dataField: "id", order: "desc" }];
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Reagent Analytes List</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="List" breadcrumbItem="Reagent Analytes List" />
            <Row className="justify-content-center">
              <Col lg="4">
                <Card>
                  <CardBody>
                    <ToolkitProvider
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={ReagentAnalyte}
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

ReagentAnalyte.propTypes = {
  match: PropTypes.object,
  ReagentAnalyte: PropTypes.array,
  history: PropTypes.object,
  onGetUnitAnalyteList: PropTypes.func,
};

const mapStateToProps = (state) => {
  console.log('Redux State:', state); // Log entire Redux state to see structure and contents
  return {
    ReagentAnalyte: state.ListUnits.ReagentAnalyte || []
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetUnitAnalyteList: (id) => dispatch(getAnalyteReagent(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReagentAnalyte));