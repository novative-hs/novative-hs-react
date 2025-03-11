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
import { 
  getParticipantSchemelist
} from "store/Payment/actions";
import "assets/scss/table.scss";

class PaymentSchemeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: '',
      idFilter: '',
      selectedCheckboxes: {}, // Track checked checkboxes
      tableKey: 0,
      PaymentSchemeList: [],
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
          text: "Scheme",
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
    console.log("componentDidUpdate triggered");
    if (this.props.PaymentSchemeList !== prevProps.PaymentSchemeList) {
      console.log("New Props participant Scheme:", this.props.PaymentSchemeList);
      
      if (Array.isArray(this.props.PaymentSchemeList) && this.props.PaymentSchemeList.length > 0) {
        const transformedData = this.props.PaymentSchemeList.map((scheme, index) => ({
          id: scheme.scheme_id || index + 1,
          name: scheme.scheme_name || "Unnamed Scheme", // Access scheme_name here
          
        }));
        console.log("Transformed Data (After Transformation):", transformedData); // Log transformed data

        console.log("PaymentSchemeList in Props:", this.props.PaymentSchemeList);

  
        console.log("Transformed Data:", transformedData); // Debugging log
        this.setState({ PaymentSchemeList: transformedData, tableKey: this.state.tableKey + 1 });
      }
    }
  }

  fetchData() {
    const { onGetParticipantPayment } = this.props;
    const PaymentSchemeId = this.props.match.params?.id; // Use optional chaining
    if (!PaymentSchemeId) {
      console.error("PaymentSchemeId not found in URL parameters");
    } else {
      console.log("Fetching data for ID:", PaymentSchemeId);
      onGetParticipantPayment(PaymentSchemeId);
    }
  }
  

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

 

  filterData = () => {
    const { PaymentSchemeList } = this.state;  // Now using the state instead of props
    const { nameFilter, idFilter } = this.state;

    if (!Array.isArray(PaymentSchemeList)) {
      return []; // Return empty array if not an array
    }

    const filteredData = PaymentSchemeList.filter(entry => {
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
    const { PaymentSchemeList } = this.state;
    console.log("Participant Scheme List",PaymentSchemeList);
    const defaultSorted = [{ dataField: "id", order: "desc" }];
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Participants Scheme List</title>
          </MetaTags>
          <Container fluid>
          <Breadcrumbs
  title="List"
  breadcrumbItem={`Scheme List for ${this.props.participantName || "Unknown"}`}
/>

            <Row className="justify-content-center">
              <Col lg="4">
                <Card>
                  <CardBody>
                    <ToolkitProvider
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={PaymentSchemeList}
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

PaymentSchemeList.propTypes = {
  match: PropTypes.object,
  participantName: PropTypes.object,
  PaymentSchemeList: PropTypes.array,
  history: PropTypes.object,
  // onGetSchemeAnalyte: PropTypes.func,
  onGetParticipantPayment: PropTypes.func,
};
const mapStateToProps = (state) => {
  console.log("Redux State in mapStateToProps:", state);
  console.log("PartiscipantSchemeLsit:", state.AddPayment); 
  console.log("Mapped PaymentSchemeList:", state.GetPayment?.PaymentSchemeList || []);

  // Extract participantName and log it
  const participantName = state.AddPayment?.participant_name || "Unknownnnnnnn";
  console.log("Mapped participantName:", participantName);

  return {
    PaymentSchemeList: state.AddPayment?.PaymentSchemeList || [], // Fallback to an empty array
    participantName,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => ({
  
  onGetParticipantPayment: (id) => dispatch(getParticipantSchemelist(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaymentSchemeList));