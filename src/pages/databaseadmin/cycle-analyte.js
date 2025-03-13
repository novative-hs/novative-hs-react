import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

import Breadcrumbs from "components/Common/Breadcrumb";
import { getAnalyteCycle } from "store/databaseofunits/actions";
import "assets/scss/table.scss";

class CycleAnalyte extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: '',
      idFilter: '',
      selectedCheckboxes: {},
      tableKey: 0,
      CycleAnalyte: [],
      feedbackMessage: '',
      errorMessage: '',
      feedbackListColumns: [
        {
          text: "ID",
          dataField: "id",
          sort: true,
          headerFormatter: (column) => (
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
        },
        {
          dataField: "name",
          text: "Analyte",
          sort: true,
          headerFormatter: (column) => (
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
        },
      ],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {

    if (this.props.CycleName !== prevProps.CycleName) {
      console.log("Updated CycleName in Component:", this.props.CycleName);
      this.setState({ CycleName: this.props.CycleName });
    }

    // Handle updates for CycleAnalyte
    if (this.props.CycleAnalyte !== prevProps.CycleAnalyte) {
      const transformedData = this.props.CycleAnalyte.map((analyte, index) => ({
        id: index + 1,
        name: analyte,
      }));
      // const checkboxState = {};
      // transformedData.forEach((item) => {
      //   checkboxState[item.id] = false;
      // });
      this.setState({
        CycleAnalyte: transformedData,
        // selectedCheckboxes: checkboxState,
      });
    }
  
    // Handle updates for CycleName
    if (this.props.CycleName !== prevProps.CycleName) {
      console.log("Updated CycleName in Component:", this.props.CycleName);
      this.setState({ CycleName: this.props.CycleName });
    }
  }
  

  fetchData() {
    const { onGetUnitAnalyteList } = this.props;
    const unitanalyteId = this.props.match.params.id;
    if (unitanalyteId) {
      onGetUnitAnalyteList(unitanalyteId);
    }
  }

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  handleCheckboxChange = (id) => {
    this.setState((prevState) => ({
      selectedCheckboxes: {
        ...prevState.selectedCheckboxes,
        [id]: !prevState.selectedCheckboxes[id],
      },
    }));
  };

  filterData = () => {
    const { CycleAnalyte, nameFilter, idFilter } = this.state;
    return CycleAnalyte.filter(entry => (
      entry.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      entry.id.toString().includes(idFilter)
    ));
  };

  render() {
    const { CycleAnalyte } = this.state;
    const defaultSorted = [{ dataField: "id", order: "desc" }];
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Cycle Analytes List</title>
          </MetaTags>
          <Container fluid>
          <Breadcrumbs
  title="List"
  breadcrumbItem={`Cycle No: ${this.state.CycleName || "Unknown"}`}
/>


            <Row className="justify-content-center">
              <Col lg="8">
                <Card>
                  <CardBody>
                    <ToolkitProvider
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={this.filterData()}
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
                                  classes="table align-middle table-hover"
                                  bordered={false}
                                  striped
                                  headerWrapperClasses="table-light"
                                  responsive
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

CycleAnalyte.propTypes = {
  match: PropTypes.object,
  CycleAnalyte: PropTypes.array,
  CycleName: PropTypes.object,
  history: PropTypes.object,
  onGetUnitAnalyteList: PropTypes.func,
};

const mapStateToProps = (state) => {
  const CycleAnalyte = state.CycleAnalyte?.CycleAnalyte || [];
  const CycleName = state.CycleAnalyte?.CycleName || "Unknown";

  console.log("Redux State - CycleAnalyte:", CycleAnalyte);
  console.log("Redux State - CycleName:", CycleName); // Add log to check the value

  return {
    CycleAnalyte,
    CycleName,
  };
};


const mapDispatchToProps = (dispatch) => ({
  onGetUnitAnalyteList: (id) => dispatch(getAnalyteCycle(id)),
}); 

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CycleAnalyte));