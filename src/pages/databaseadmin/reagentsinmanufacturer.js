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
import { getReagentsInManufacturer } from "store/units/actions";
import "assets/scss/table.scss";

class ReagentsInManufacturer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: '',
      idFilter: '',
      selectedCheckboxes: {}, // Track checked checkboxes
      tableKey: 0,
      ReagentsInManufacturer: [],
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
          text: "Reagent",
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
    const { ReagentsInManufacturer } = this.props;

    const { nameFilter, idFilter} = this.state;

    const filteredData = ReagentsInManufacturer.filter(entry => {
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
    const { ReagentsInManufacturer } = this.props;
    console.log("ReagentsInManufacturer",ReagentsInManufacturer);
    const defaultSorted = [{ dataField: "id", order: "desc" }];
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Reagent List</title>
          </MetaTags>
          <Container fluid>
          <Breadcrumbs
  title="List"
  breadcrumbItem={
    <>
      Reagent List For - {" "}
      <span style={{ color: "black", fontWeight: "bold" }}>
        {this.props.manufacturerName || "Loading..."}
      </span>
    </>
  }
/>

            <Row className="justify-content-center">
              <Col lg="4">
                <Card>
                  <CardBody>
                    <ToolkitProvider
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={ReagentsInManufacturer}
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

ReagentsInManufacturer.propTypes = {
  match: PropTypes.object,
  ReagentsInManufacturer: PropTypes.array,
  manufacturerName: PropTypes.object,
  history: PropTypes.object,
  onGetUnitAnalyteList: PropTypes.func,
};

const mapStateToProps = (state) => {
  console.log("Redux State:", state);
  return {
    ReagentsInManufacturer: state.ListUnits?.ReagentsInManufacturer || [],
    manufacturerName: state.ListUnits?.manufacturerName || "Unknown Manufacturer",
  };
};


const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetUnitAnalyteList: (id) => dispatch(getReagentsInManufacturer(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReagentsInManufacturer));
