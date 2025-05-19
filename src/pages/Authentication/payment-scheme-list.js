import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Card, CardBody, Col, Container, Row, Alert } from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

// Import actions
import { getParticipantSchemelist } from "store/Payment/actions";
import "assets/scss/table.scss";

class PaymentSchemeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: "",
      idFilter: "",
      selectedCheckboxes: {}, // Track checked checkboxes
      tableKey: 0,
      PaymentSchemeList: [],
      feedbackMessage: "",
      errorMessage: "", // State for error message
      cycleNumberFilter: "",
      priceFilter: "",
      discountFilter: "",
      paidAmountFilter: "",
      payDateFilter: "",
      paymentModeFilter: "",
      receivedByFilter: "",
      feedbackListColumns: [
        {
          dataField: "name",
          text: "Scheme",
          sort: true,
          formatter: (cell, row) =>
            typeof cell === "string" ? cell : "Unknown", // Fallback for invalid data
          headerFormatter: (column, colIndex) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.nameFilter}
                  onChange={(e) => this.handleFilterChange("nameFilter", e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          headerAlign: "center",
          align: "left",
        },
        {
          text: "Cycle",
          dataField: "cycle_number",
          sort: true,
          headerFormatter: (column) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.cycleNumberFilter}
                  onChange={(e) =>
                    this.handleFilterChange("cycleNumberFilter", e)
                  }
                  className="form-control"
                  placeholder=""
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          headerStyle: { width: "120px" },
          style: { width: "120px" },
        },
        {
          text: "Price",
          dataField: "price",
          sort: true,
          headerFormatter: (column) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.priceFilter}
                  onChange={(e) => this.handleFilterChange("priceFilter", e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          align: "right",
          formatter: (cell) => {
            if (cell === null || cell === undefined || cell === "") return "-";
            // Format number with commas and 2 decimals
            return new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(Number(cell));
          },
        },
        {
          text: "Discount",
          dataField: "discount",
          sort: true,
          headerFormatter: (column) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.discountFilter}
                  onChange={(e) => this.handleFilterChange("discountFilter", e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
        },
        {
          text: "Paid Amount",
          dataField: "paid_amount",
          sort: true,
          headerFormatter: (column) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.paidAmountFilter}
                  onChange={(e) =>
                    this.handleFilterChange("paidAmountFilter", e)
                  }
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
          align: "right",
          formatter: (cell) => {
            if (cell === null || cell === undefined || cell === "") return "-";
            return new Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(Number(cell));
          },
        },
        {
          text: "Pay Date",
          dataField: "pay_date",
          sort: true,
          formatter: (cell) => {
            const date = new Date(cell);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
          },
          headerFormatter: (column) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.payDateFilter}
                  onChange={(e) => this.handleFilterChange("payDateFilter", e)}
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
        },
        {
          text: "Payment Mode",
          dataField: "payment_mode",
          sort: true,
          headerFormatter: (column) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.paymentModeFilter}
                  onChange={(e) =>
                    this.handleFilterChange("paymentModeFilter", e)
                  }
                  className="form-control"
                />
              </div>
              <div>{column.text}</div>
            </>
          ),
        },
        {
          text: "Received By",
          dataField: "received_by",
          sort: true,
          headerFormatter: (column) => (
            <>
              <div>
                <input
                  type="text"
                  value={this.state.receivedByFilter}
                  onChange={(e) =>
                    this.handleFilterChange("receivedByFilter", e)
                  }
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
    // Fetch data when the component mounts
    this.fetchData();
  }
  componentDidUpdate(prevProps) {
    if (this.props.PaymentSchemeList !== prevProps.PaymentSchemeList) {
      if (
        Array.isArray(this.props.PaymentSchemeList) &&
        this.props.PaymentSchemeList.length > 0
      ) {
        const transformedData = this.props.PaymentSchemeList.map(
          (scheme, index) => ({
            id: scheme.scheme_id || index + 1,
            name: scheme.scheme_name || "Unnamed Scheme",
            cycle_number: scheme.cycle_no || "-",
            price: this.props.price || "-",
            discount: this.props.discount || "-",
            paid_amount: this.props.paid_amount || "-",
            pay_date: this.props.pay_date || "-",
            payment_mode: this.props.payment_mode || "-",
            received_by: this.props.received_by || "-",
          })
        );

        this.setState({
          PaymentSchemeList: transformedData,
          tableKey: this.state.tableKey + 1,
        });
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
    const {
      PaymentSchemeList,
      nameFilter,
      idFilter,
      cycleNumberFilter,
      priceFilter,
      discountFilter,
      paidAmountFilter,
      payDateFilter,
      paymentModeFilter,
      receivedByFilter,
    } = this.state;

    if (!Array.isArray(PaymentSchemeList)) {
      return [];
    }

    return PaymentSchemeList.filter((entry) => {
      return (
        entry.name?.toLowerCase().includes(nameFilter.toLowerCase()) &&
        entry.id?.toString().includes(idFilter) &&
        entry.cycle_number?.toString().includes(cycleNumberFilter) &&
        entry.price?.toString().includes(priceFilter) &&
        entry.discount?.toString().includes(discountFilter) &&
        entry.paid_amount?.toString().includes(paidAmountFilter) &&
        entry.pay_date?.toString().includes(payDateFilter) &&
        entry.payment_mode
          ?.toLowerCase()
          .includes(paymentModeFilter.toLowerCase()) &&
        entry.received_by
          ?.toLowerCase()
          .includes(receivedByFilter.toLowerCase())
      );
    });
  };

  // Add this inside the PaymentSchemeList class
  calculateTotalPaidAmount = () => {
    const filteredData = this.filterData(); // use filtered list if you want total of filtered rows
    return filteredData.reduce((sum, entry) => {
      const amount = parseFloat(entry.paid_amount);
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  render() {
    const { PaymentSchemeList } = this.state;
    console.log("Participant Scheme List", PaymentSchemeList);
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
              breadcrumbItem={`${this.props.participantName || "Unknown"} (${
                this.props.membershipStatus || "Inactive"
              })`}
            />

            <Row className="justify-content-center">
              <Col lg="12">
                <Card>
                  <CardBody>
                    <ToolkitProvider
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={PaymentSchemeList}
                      search
                    >
                      {(toolkitprops) => (
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
                              {/* Total Paid Amount */}
                              <div className="mt-3 text-end">
                                <strong>Total Paid Amount: </strong>
                                {new Intl.NumberFormat("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                }).format(this.calculateTotalPaidAmount())}
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
  membershipStatus: PropTypes.string, // ✅ add this line
  history: PropTypes.object,
  // onGetSchemeAnalyte: PropTypes.func,
  onGetParticipantPayment: PropTypes.func,
  price: PropTypes.string,
  discount: PropTypes.string,
  paid_amount: PropTypes.string,
  pay_date: PropTypes.string,
  payment_mode: PropTypes.string,
  received_by: PropTypes.string,
};
const mapStateToProps = (state) => {
  console.log("Redux State in mapStateToProps:", state);
  console.log("ParticipantSchemeList Slice:", state.AddPayment);
  console.log(
    "Mapped PaymentSchemeList:",
    state.AddPayment?.PaymentSchemeList || []
  );

  const participantName = state.AddPayment?.participant_name || "Unknownnnnnnn";
  const membershipStatus = state.AddPayment?.membership_status || "Inactive";
  console.log("Mapped participantName:", participantName);

  return {
    PaymentSchemeList: state.AddPayment?.PaymentSchemeList || [],
    participantName,
    membershipStatus,
    price: state.AddPayment?.price || "",
    discount: state.AddPayment?.discount || "",
    paid_amount: state.AddPayment?.paid_amount || "",
    pay_date: state.AddPayment?.pay_date || "",
    payment_mode: state.AddPayment?.payment_mode || "",
    received_by: state.AddPayment?.received_by || "",
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetParticipantPayment: (id) => dispatch(getParticipantSchemelist(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaymentSchemeList));
