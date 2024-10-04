import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import { Bar } from "react-chartjs-2";  // Import Bar chart from Chart.js
import { Container, Col, Row } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import { getAnalytelist } from "store/databaseofunits/actions";
import { getcyclelist } from "store/cycle/actions";
import axios from "axios";
import "assets/scss/table.scss";

class ReagentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ListUnit: [],
      selectedAnalyte: null,
      selectedCycle: null,
      analyteOptions: [],
      cycleOptions: [],
      CycleList: [],
      chartData: null,  // For storing the chart data
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    const { onGetAnalyte } = this.props;
    onGetAnalyte(this.state.user_id);
    const { onGetgetcyclelist } = this.props;
    onGetgetcyclelist(this.state.user_id);
  }

  componentDidUpdate(prevProps) {
    const { ListUnit, CycleList } = this.props;
  
    if (prevProps.ListUnit !== ListUnit && Array.isArray(ListUnit)) {
      const analyteOptions = ListUnit.map(analyte => ({
        value: analyte.id,
        label: analyte.name,
      }));
      this.setState({ analyteOptions });
    }
  
    if (prevProps.CycleList !== CycleList && Array.isArray(CycleList)) {
      const cycleOptions = CycleList.map(cycle => ({
        value: cycle.id,
        label: cycle.cycle_no,
      }));
      this.setState({ cycleOptions });
    }
  }
  

  handleAnalyteChange = (selectedAnalyte) => {
    this.setState({ selectedAnalyte }, this.fetchChartData);
  };
  
  handleCycleChange = (selectedCycle) => {
    this.setState({ selectedCycle }, this.fetchChartData);
  };
  
  // This function will be called after updating the state for analyte or cycle
  fetchChartData = () => {
    const { selectedAnalyte, selectedCycle, user_id } = this.state;
  
    // Ensure both analyte and cycle are selected before making the API call
    if (selectedAnalyte && selectedCycle) {
      const requestData = {
        analyte_id: selectedAnalyte.value,
        user_id: user_id,
        cycle_id: selectedCycle.value,
      };
  
      axios.post('http://127.0.0.1:8000/api/lab/AnalyteChart', requestData)
        .then(response => {
          const { rounds, z_scores } = response.data;
          const chartData = {
            labels: rounds,
            datasets: [
              {
                label: 'Z-scores',
                data: z_scores,
                backgroundColor: 'green',
              }
            ]
          };
          this.setState({ chartData });
        })
        .catch(error => {
          const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
          console.error("Error fetching chart data:", errorMessage);
          alert(errorMessage);
        });
    }
  };
  

  render() {
    const { CycleList, selectedAnalyte, selectedCycle, analyteOptions, cycleOptions, chartData } = this.state;

    // Chart.js options to set Y-axis limits (-5 to +5)
    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true,  // Ensures the y-axis starts at zero
          min: -5,  // Set minimum value for Y-axis (below zero for negative values)
          max: 5,   // Set maximum value for Y-axis (above zero for positive values)
          ticks: {
            stepSize: 1,  // Steps of 1 unit
            callback: function(value) {
              return value.toFixed(0);  // Display whole numbers
            }
          }
        },
        x: {
          ticks: {
            autoSkip: false,  // Ensure all rounds are displayed
          },
        }
      }
    };
    

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Analyte Performance | NEQAS</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Analyte Performance" breadcrumbItem="Analyte Performance" />
            <Row>
  <Col xs="4" sm="4" md="3" lg="3">
    <Select
      value={selectedAnalyte}
      onChange={this.handleAnalyteChange}
      options={analyteOptions}
      placeholder="Select Analyte"
    />
  </Col>
  <Col xs="4" sm="4" md="3" lg="3">
    <Select
      value={selectedCycle}
      onChange={this.handleCycleChange}  // Use separate handler
      options={cycleOptions}
      placeholder="Select Cycle"  // Correct the placeholder
    />
  </Col>
</Row>


            {/* Render the chart if chartData is available */}
            {chartData && (
              <Row>
                <Col xs="12" sm="12" md="8" lg="8">
                  <Bar
                    data={chartData}
                    options={chartOptions}  // Set options to control Y-axis limits
                  />
                </Col>
                <b></b>
                <h7 className="text-center text-danger">Round [Sample]</h7>

              </Row>
            )}
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

ReagentsList.propTypes = {
  match: PropTypes.object,
  ListUnit: PropTypes.array,
  className: PropTypes.any,
  onGetAnalyte: PropTypes.func,
  onGetgetcyclelist: PropTypes.func,
  CycleList: PropTypes.array,


};

const mapStateToProps = ({ ListUnit, CycleList }) => ({
  ListUnit: ListUnit.ListUnit,
  CycleList: CycleList.CycleList,

});

const mapDispatchToProps = (dispatch) => ({
  onGetAnalyte: (id) => dispatch(getAnalytelist(id)),
  onGetgetcyclelist: id => dispatch(getcyclelist(id)),

});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReagentsList));
