import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import { Bar } from "react-chartjs-2"; // Import Bar chart from Chart.js
import { Container, Col, Row } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import { getAnalytelist } from "store/databaseofunits/actions";
import { getcyclelist } from "store/cycle/actions";
import { getmethodlist } from "store/methods/actions";
import { getInstrumentlist } from "store/instrument/actions";
import { getReagentlist } from "store/reagents/actions";
import axios from "axios";
import "assets/scss/table.scss";
import { method } from "lodash";

class ReagentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ListUnit: [],
      ReagentList: [],
      Instrument: [],
      ListMethods: [],
      selectedAnalyte: null,
      selectedCycle: null,
      selectedType: null,
      selectedItemId: null,
      analyteOptions: [],
      cycleOptions: [],
      methodOptions: [],
      instrumentOptions: [],
      reagentOptions: [],
      CycleList: [],
      chartData: null, // For storing the chart data
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
    const{onGetMethodsList,onGetInstrumentList, onGetReagents}= this.props;
    onGetMethodsList(this.state.user_id);
    onGetReagents(this.state.user_id);
    onGetInstrumentList(this.state.user_id);
  }

  componentDidUpdate(prevProps) {
    const { ListUnit, CycleList,Instrument, ListMethods,ReagentList } = this.props;

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
    if (prevProps.ListMethods !== ListMethods && Array.isArray(ListMethods)) {
      const methodOptions = ListMethods.map(method => ({
        value: method.id,
        label: method.name,
      }));
      this.setState({ methodOptions });
    }
    if (prevProps.Instrument !== Instrument && Array.isArray(Instrument)) {
      const instrumentOptions = Instrument.map(instrument => ({
        value: instrument.id,
        label: instrument.name,
      }));
      this.setState({ instrumentOptions });
    }
    if (prevProps.ReagentList !== ReagentList && Array.isArray(ReagentList)) {
      const reagentOptions = ReagentList.map(reagent => ({
        value: reagent.id,
        label: reagent.name,
      }));
      this.setState({ reagentOptions });
    }
  }

  handleAnalyteChange = selectedAnalyte => {
    this.setState({ selectedAnalyte }, this.fetchChartData);
  };

  handleCycleChange = selectedCycle => {
    this.setState({ selectedCycle }, this.fetchChartData);
  };
  handleTypeChange = (selectedType) => {
    this.setState({ selectedType }, this.fetchChartData);
  };

  handleItemChange = (selectedItemId) => {
    this.setState({ selectedItemId}, this.fetchChartData);
  };

  // This function will be called after updating the state for analyte or cycle
  fetchChartData = () => {
    const { selectedAnalyte, selectedCycle, user_id, selectedType, selectedItemId } = this.state;

    // Ensure both analyte and cycle are selected before making the API call
    if (selectedAnalyte && selectedCycle) {
      const requestData = {
        analyte_id: selectedAnalyte.value,
        user_id: user_id,
        cycle_id: selectedCycle.value,
      };

    // Scenario 1: If Type is not selected, call the first API
    if (!selectedType) {
      axios.post("https://externalqcapi.com/api/lab/AnalyteChart", requestData)
        .then(response => {
          const { rounds, z_scores } = response.data;
          const chartData = {
            labels: rounds.map(round => `${round.round_id}`),
              datasets: [
                {
                  label: "Total Participants",
                  data: rounds.map(round => round.total_participants),
                  backgroundColor: "green",
                },
              ],
          };
          this.setState({ chartData });
        })
        .catch(error => {
          const errorMessage =
            error.response?.data?.message || "An unexpected error occurred.";
          console.error("Error fetching chart data:", errorMessage);
          alert(errorMessage);
        });
    }

    // Scenario 2: If Type is selected, include it in the request
    else if (selectedType && selectedItemId) {
      const requestDataWithType = {
        analyte_id: selectedAnalyte.value,
        user_id: user_id,
        cycle_id: selectedCycle.value,
        type: selectedType.value, // Include the selected type
        selectedItemId: selectedItemId.value
      };

      axios.post("https://externalqcapi.com/api/lab/AnalytePeerChart", requestDataWithType) // Replace with the correct endpoint
        .then(response => {
          const { rounds, z_scores } = response.data;
          const chartData = {
            labels: rounds.map(round => `Round ${round.round_id}`),
              datasets: [
                {
                  label: "Total Participants",
                  data: rounds.map(round => round.total_participants),
                  backgroundColor: "green",
                },
              ],
          };
          this.setState({ chartData });
        })
        .catch(error => {
          const errorMessage =
            error.response?.data?.message || "An unexpected error occurred.";
          console.error("Error fetching chart data:", errorMessage);
          alert(errorMessage);
        });
    }
  }
};
renderSecondDropdown = () => {
  const { selectedType, methodOptions, instrumentOptions, reagentOptions, selectedItemId } = this.state;

  let options = [];
  if (selectedType?.value === 'method') {
    options = methodOptions;
  } else if (selectedType?.value === 'instrument') {
    options = instrumentOptions;
  } else if (selectedType?.value === 'reagent') {
    options = reagentOptions;
  }

  return (
    <Select
      value = {selectedItemId}
      options={options}
      placeholder={`Select ${selectedType?.label}`}
      onChange={this.handleItemChange}
      isClearable={true}
    />
  );
};
  render() {
    const { selectedAnalyte, selectedCycle, analyteOptions, cycleOptions, chartData, selectedType, roundsData } = this.state;

    const chartOptions = {
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 100,
          ticks: {
            stepSize: 100,
            callback: function(value) {
              return value >= 100 ? "100+" : value;
            },
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (tooltipItems) => `Round ${tooltipItems[0].label.split(" ")[1]}`,
            label: (tooltipItem) => {
              const round = roundsData[tooltipItem.dataIndex];
              
              return `{
                "total_participants": ${round.total_participants},
              }`;
            },
          },
        },
        tooltip: {
          callbacks: {
            title: (tooltipItems) => `Round ${tooltipItems[0].label.split(" ")[1]}`,
            label: (tooltipItem) => {
              const round = roundsData[tooltipItem.dataIndex];
              
              return `{
                "total_participants": ${round.total_participants},
              }`;
            },
          },
        },
      },
    };
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Analyte Performance | NEQAS</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs
              title="Analyte Performance"
              breadcrumbItem="Analyte Performance"
            />
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
                  onChange={this.handleCycleChange} // Use separate handler
                  options={cycleOptions}
                  placeholder="Select Cycle" // Correct the placeholder
                />
              </Col>
              <Col xs="4" sm="4" md="3" lg="3">
                <Select
                  options={[
                    { value: "method", label: "Method" },
                    { value: "reagent", label: "Reagent" },
                    { value: "instrument", label: "Instrument" },
                  ]}
                  placeholder="Select Type"
                  onChange={this.handleTypeChange} // Define this handler to store the selected value
                  isClearable={true} // Allow the user to clear the selection
                />
              </Col>
               {/* Conditionally render second dropdown based on selection */}
                {selectedType && (
                  <Col xs="4" sm="4" md="3" lg="3">
                    {this.renderSecondDropdown()}
                  </Col>
                )}
            </Row>

            {/* Render the chart if chartData is available */}
            {chartData && (
              <Row>
                <Col xs="12" sm="12" md="8" lg="8">
                  <Bar
                    data={chartData}
                    options={chartOptions} // Set options to control Y-axis limits
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
  className: PropTypes.any,

  ListUnit: PropTypes.array,
  CycleList: PropTypes.array,
  ListMethods: PropTypes.array,
  Instrument: PropTypes.array,
  ReagentList: PropTypes.array,

  onGetAnalyte: PropTypes.func,
  onGetgetcyclelist: PropTypes.func,
  onGetMethodsList: PropTypes.func,
  onGetInstrumentList: PropTypes.func,
  onGetReagents: PropTypes.func,
};

const mapStateToProps = ({ ListUnit, CycleList,ListMethods,  Instrument,
  ReagentList, }) => ({
  ListUnit: ListUnit.ListUnit,
  CycleList: CycleList.CycleList,
  ListMethods: ListMethods.ListMethods,
  Instrument: Instrument.Instrument,
  ReagentList: ReagentList.ReagentList,
});

const mapDispatchToProps = dispatch => ({
  onGetAnalyte: id => dispatch(getAnalytelist(id)),
  onGetgetcyclelist: id => dispatch(getcyclelist(id)),
  onGetMethodsList: id => dispatch(getmethodlist(id)),
  onGetInstrumentList: id => dispatch(getInstrumentlist(id)),
  onGetReagents: id => dispatch(getReagentlist(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReagentsList));
