import React, { Component } from "react";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import Select from "react-select";
import { getbanklist } from "store/banks/actions";
// import { Button } from "react-bootstrap";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button, // ✅ Add this here
} from "reactstrap";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import filterFactory from "react-bootstrap-table2-filter";
import Breadcrumbs from "components/Common/Breadcrumb";
import { getParticipantPayment, confirmpayment } from "store/Payment/actions";
import "assets/scss/table.scss";
import { Formik, Field, Form, ErrorMessage } from "formik";

class ParticipantCSRPayments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: "",
      idFilter: "",
      districtFilter: "",
      schemeFilter: "",
      schemeModalOpen: false,
      showReconcileModal: false,
      amountFilter: "",
      discountFilter: "",
      schemepriceFilter: "",
      hoveredSchemeNames: [],
      showReconcileDetailsModal: false,
      reconcileDate: "", // Date of reconcile
      activeRowId: null,
      paymentConfirmState: {},
      TaxFilter: "",
      dateFilter: "",
      filtersApplied: false,
      hoveredSchemeNames: [],
      paymentmodeFilter: "",
      dateFilter: "",
      paymentreceivedFilter: "",
      ListBank: [], // From Redux
      selectedBankAccount: null,
      selectedBankName: "",
      selectedCheckboxes: {},
      tableKey: 0,
      dateTo: new Date().toISOString().split("T")[0], // Show current date
      dateToActive: false, // Tracks whether the user activated the filter
      filtersApplied: false, // Prevent data from loading by default
      GetPayment: [],
      feedbackMessage: "",
      errorMessage: "",
      paymentsettlementFilter: "",
      paymentMethodFilter: "",
      paymentStatusFilter: "",
      reconcileStatusFilter: "",
      finalpayableFilter: "",
      paidamountFilter: "",
      remainingAmountFilter: "",
      membershipStatusFilter: "",
      dateFrom: "",
      // dateTo: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      feedbackListColumns: [
        {
          text: "Payment ID",
          dataField: "id",
          sort: true,
          hidden: false,
          headerStyle: {
            backgroundColor: "#87ceeb", // 🌤 sky blue for header
            textAlign: "center",
          },
          style: {
            // backgroundColor: "#87ceeb", // 🌤 sky blue for cells
            textAlign: "right",
          },
          formatter: (cellContent, methodlist) => <>P-{methodlist.id}</>,
          headerFormatter: (column, colIndex) => (
            <>
              <div style={{ textAlign: "center", marginBottom: "5px" }}>
                {column.text}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  value={this.state.idFilter}
                  onChange={e => this.handleFilterChange("idFilter", e)}
                  className="form-control"
                />
              </div>
            </>
          ),
        },
        {
          dataField: "participant_name",
          text: "Participant Name",
          sort: true,
          headerStyle: {
            backgroundColor: "#87ceeb", // 🌤 sky blue for header
            textAlign: "center",
          },
          style: {
            textAlign: "left",
          },
          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.nameFilter}
                  onChange={e => this.handleFilterChange("nameFilter", e)}
                  className="form-control"
                  style={{
                    textAlign: "center",
                    width: "100px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          dataField: "membership_status",
          text: "Participant Status",
          sort: true,
          headerStyle: {
            backgroundColor: "#87ceeb", // 🌤 sky blue for header
            textAlign: "center",
          },
          style: {
            textAlign: "right",
          },
          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.membershipStatusFilter || ""}
                  onChange={e =>
                    this.handleFilterChange("membershipStatusFilter", e)
                  }
                  className="form-control"
                  style={{
                    textAlign: "center",
                    width: "100px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          dataField: "district",
          text: "District",
          sort: true,
          headerStyle: {
            backgroundColor: "#87ceeb", // 🌤 sky blue for header
            textAlign: "center",
          },
          style: {
            textAlign: "right",
          },
          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.districtFilter}
                  onChange={e => this.handleFilterChange("districtFilter", e)}
                  className="form-control"
                  style={{
                    textAlign: "center",
                    width: "100px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          dataField: "scheme_count",
          text: "Scheme",
          sort: true,
          headerStyle: {
            backgroundColor: "#87ceeb", // 🌤 sky blue for header
            textAlign: "center",
          },
          style: {
            textAlign: "right",
          },
          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.schemeFilter}
                  onChange={e => this.handleFilterChange("schemeFilter", e)}
                  className="form-control"
                  style={{
                    textAlign: "center",
                    width: "100px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          ),
          formatter: (cell, row) => (
            <div
              onClick={() => this.handleSchemeClick(row)} // <-- Changed to onClick
              style={{
                cursor: "pointer",
                textAlign: "center",
                color: "blue",
              }}
            >
              {cell}
            </div>
          ),
        },
        {
          dataField: "priceBeforeDiscount",
          text: "Payable",
          sort: true,
          headerStyle: {
            backgroundColor: "#fff9c4",
            textAlign: "center",
          },
          style: {
            backgroundColor: "#fff9c4",
            textAlign: "right",
          },
          formatter: cell => this.formatNumber(cell),
          headerFormatter: (column, colIndex) => (
            <div>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.schemepriceFilter}
                  onChange={e =>
                    this.handleFilterChange("schemepriceFilter", e)
                  }
                  className="form-control"
                  style={{
                    textAlign: "center",
                    width: "100px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          dataField: "discountAmount",
          text: "Discount Amount",
          sort: true,
          headerStyle: {
            backgroundColor: "#fff9c4",
            textAlign: "center",
          },
          style: {
            backgroundColor: "#fff9c4",
            textAlign: "right",
          },
          formatter: cell => this.formatNumber(cell),

          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.discountFilter}
                  onChange={e => this.handleFilterChange("discountFilter", e)}
                  className="form-control"
                  style={{
                    textAlign: "center",
                    width: "100px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          dataField: "taxDeduction",
          text: "Tax",
          sort: true,
          headerStyle: {
            backgroundColor: "#fff9c4",
            textAlign: "center",
          },
          style: {
            backgroundColor: "#fff9c4",
            textAlign: "right",
          },
          formatter: cell => {
            const value = Number(cell);
            return value === 0 || isNaN(value) ? "--" : value.toLocaleString();
          },
          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.TaxFilter}
                  onChange={e => this.handleFilterChange("TaxFilter", e)}
                  className="form-control"
                  style={{
                    textAlign: "center",
                    width: "100px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          dataField: "price",
          text: "Final Payable",
          sort: true,
          headerStyle: {
            backgroundColor: "#fff9c4",
            textAlign: "center",
          },
          style: {
            backgroundColor: "#fff9c4",
            textAlign: "right",
          },
          formatter: (cell, row) => {
            const price = parseFloat(row.price) || 0;
            const discount = parseFloat(row.discount) || 0;
            const tax = parseFloat(row.tax) || 0;

            const payable = price - discount - tax;
            return this.formatNumber(payable);
          },

          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.finalpayableFilter}
                  onChange={e =>
                    this.handleFilterChange("finalpayableFilter", e)
                  }
                  className="form-control"
                  style={{
                    textAlign: "center",
                    width: "100px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          dataField: "payment_settlement",
          text: "Payment Settlement",
          sort: true,
          headerStyle: {
            backgroundColor: "#d0e2ff", // 🔵 light blue for header
            textAlign: "center",
          },
          style: {
            backgroundColor: "#d0e2ff", // 🔵 light blue for cells
            textAlign: "right",
          },
          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.paymentsettlementFilter}
                  onChange={e =>
                    this.handleFilterChange("paymentsettlementFilter", e)
                  }
                  className="form-control"
                  style={{
                    textAlign: "center",
                    width: "100px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          ),
        },

        {
          dataField: "payment_status",
          text: "Payment Status",
          sort: true,
          headerStyle: {
            backgroundColor: "#d0e2ff", // 🔵 light blue for header
            textAlign: "center",
          },
          style: {
            backgroundColor: "#d0e2ff", // 🔵 light blue for cells
            textAlign: "right",
          },
          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.paymentStatusFilter}
                  onChange={e =>
                    this.handleFilterChange("paymentStatusFilter", e)
                  }
                  className="form-control"
                  style={{
                    textAlign: "center",
                    width: "100px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          dataField: "payment_reconcile_status",
          text: "Reconciliation Status",
          sort: true,
          headerStyle: {
            backgroundColor: "#d0e2ff", // 🔵 light blue for header
            textAlign: "center",
          },
          style: {
            backgroundColor: "#d0e2ff", // 🔵 light blue for cells
            textAlign: "center",
          },
          formatter: (cell, row) => {
            const status = row.payment_reconcile_status;

            if (status === "Reconcile") {
              return (
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    this.handleViewReconcileDetails(row);
                  }}
                >
                  {status}
                </a>
              );
            }

            return (
              <span style={{ color: "gray", cursor: "not-allowed" }}>
                {status || "--"}
              </span>
            );
          },

          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.reconcileStatusFilter || ""}
                  onChange={e =>
                    this.handleFilterChange("reconcileStatusFilter", e)
                  }
                  className="form-control"
                  style={{
                    textAlign: "center",
                    width: "120px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          dataField: "part_payment_amount",
          text: "Paid Amount",
          sort: true,
          headerStyle: {
            backgroundColor: "#d0e2ff", // 🔵 light blue for header
            textAlign: "center",
          },
          style: {
            backgroundColor: "#d0e2ff", // 🔵 light blue for cells
            textAlign: "right",
          },
          formatter: cell => this.formatNumber(cell),

          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.paidamountFilter}
                  onChange={e => this.handleFilterChange("paidamountFilter", e)}
                  className="form-control"
                  style={{
                    textAlign: "center",
                    width: "100px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          dataField: "remaining_amount",
          text: "Remaining Amount",
          sort: true,
          headerStyle: {
            backgroundColor: "#87ceeb", // 🌤 sky blue for header
            textAlign: "center",
          },
          style: {
            textAlign: "right",
          },
          formatter: cell => this.formatNumber(cell),
          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.remainingAmountFilter}
                  onChange={e =>
                    this.handleFilterChange("remainingAmountFilter", e)
                  }
                  className="form-control"
                  style={{
                    textAlign: "center",
                    width: "100px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          dataField: "paymentmethod",
          text: "Payment Mode",
          sort: true,
          headerStyle: {
            backgroundColor: "#87ceeb", // 🌤 sky blue for header
            textAlign: "center",
          },
          style: {
            textAlign: "right",
          },
          formatter: (cell, row) => {
            const receiptUrl = row.photo_url || null;
            const paymentMethod = row.paymentmethod || "-";

            return (
              <div className="d-flex justify-content-center align-items-center">
                {receiptUrl ? (
                  <a
                    href={receiptUrl}
                    download
                    className="d-flex align-items-center text-decoration-none"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Download Receipt"
                  >
                    <span className="me-2 text-primary">{paymentMethod}</span>
                    <FaDownload />
                  </a>
                ) : (
                  <span className="text-center">
                    {paymentMethod}{" "}
                    <span className="text-muted">(No Receipt)</span>
                  </span>
                )}
              </div>
            );
          },

          // ✅ Moved filter input BELOW the column text
          headerFormatter: (column, colIndex) => {
            return (
              <div style={{ textAlign: "center" }}>
                <div>{column.text}</div> {/* Header text shown first */}
                <div style={{ marginTop: "5px" }}>
                  <input
                    type="text"
                    value={this.state.paymentMethodFilter}
                    onChange={e =>
                      this.handleFilterChange("paymentMethodFilter", e)
                    }
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                      margin: "auto",
                    }}
                  />
                </div>
              </div>
            );
          },
        },

        {
          dataField: "paydate",
          text: "Payment Date",
          sort: true,
          headerStyle: {
            backgroundColor: "#87ceeb", // 🌤 sky blue for header
            textAlign: "center",
          },
          style: {
            textAlign: "right",
          },
          formatter: cell => {
            if (!cell) return "-";
            const dateObj = new Date(cell);
            if (isNaN(dateObj.getTime())) return "-";

            const day = String(dateObj.getDate()).padStart(2, "0");
            const month = dateObj.toLocaleString("en-US", { month: "short" }); // Capitalized month
            const year = String(dateObj.getFullYear()).slice(-2); // Last two digits of the year

            return `${day}-${month}-${year}`;
          },
          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.dateFilter}
                  onChange={e => this.handleFilterChange("dateFilter", e)}
                  className="form-control"
                  style={{
                    textAlign: "center",
                    width: "100px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          dataField: "receivedby",
          text: "Payment Received by",
          sort: true,
          headerStyle: {
            backgroundColor: "#87ceeb", // 🌤 sky blue for header
            textAlign: "center",
          },
          style: {
            textAlign: "right",
          },
          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.paymentreceivedFilter}
                  onChange={e =>
                    this.handleFilterChange("paymentreceivedFilter", e)
                  }
                  className="form-control"
                  style={{
                    textAlign: "center",
                    width: "100px",
                    margin: "auto",
                  }}
                />
              </div>
            </div>
          ),
        },
        {
          dataField: "action_item",
          text: "Action",
          headerStyle: {
            textAlign: "center",
            verticalAlign: "middle",
          },
          formatter: (cell, row) => {
            const { paymentConfirmState } = this.state;
            const rowState = paymentConfirmState?.[row.id] || {};
            const status =
              row.payment_reconcile_status || rowState.reconcileStatus || "";

            return (
              <div
                className="d-flex flex-row align-items-center gap-2"
                onClick={e => e.stopPropagation()} // ⛔ prevent parent row click
              >
                {/* Payment details link */}
                <Tooltip title="Payment Details">
                  <Link
                    to={`/PaymentCSR-scheme-list/${row.id}`}
                    style={{ textDecoration: "underline", color: "#0000CD" }}
                    onClick={e => e.stopPropagation()}
                  >
                    <i className="mdi mdi-credit-card-outline font-size-18" />
                  </Link>
                </Tooltip>

                <Tooltip title="Set Reconciliation Status">
                  <i
                    className="mdi mdi-checkbox-marked-circle-outline"
                    style={{
                      cursor: "pointer",
                      fontSize: "20px",
                      color: "#0000CD", // Dark blue
                    }}
                    onClick={() => this.handleOpenModal(row.id)}
                  />
                </Tooltip>
              </div>
            );
          },
        },
      ],
      tableKey: Date.now(), // ✅ so you can force re-render
    };
  }
  formatNumber = (value, options = {}) => {
    const num = Number(value);
    return !num || num === 0
      ? "--"
      : num.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
          ...options,
        });
  };

  handleCheckboxToggle = rowId => {
    this.setState(prevState => ({
      paymentConfirmState: {
        ...prevState.paymentConfirmState,
        [rowId]: {
          ...prevState.paymentConfirmState[rowId],
          checked: !prevState.paymentConfirmState[rowId]?.checked,
        },
      },
      tableKey: Date.now(), // trigger full re-render of table
    }));
  };

  handleSaveConfirmation = rowId => {
    if (!rowId) {
      console.error("❌ rowId is undefined");
      return;
    }

    this.props.confirmpayment(rowId);

    this.setState(prevState => ({
      paymentConfirmState: {
        ...prevState.paymentConfirmState,
        [rowId]: {
          checked: false,
          confirmed: true,
        },
      },
      tableKey: Date.now(), // 🔁 this will trigger <BootstrapTable> to fully re-render
    }));
  };
  handleOpenModal = rowId => {
    const row = this.state.GetPayment.find(row => row.id === rowId);
    this.setState({
      showReconcileModal: true,
      activeRowId: rowId,
      activeParticipantName: row?.participant_name || "Unknown",
      selectedReconcileStatus: "", // Clear previous selection
    });
  };

  handleCloseModal = () => {
    this.setState({
      showReconcileModal: false,
      activeRowId: null,
      activeParticipantName: "",
      selectedReconcileStatus: "",
    });
  };
  handleReconcileSubmit = () => {
    const {
      selectedReconcileStatus,
      selectedAccountNumber,
      selectedBankName,
      activeRowId, // Using activeRowId for consistency
    } = this.state;

    if (!activeRowId) {
      console.error("Payment ID is missing. Cannot submit reconciliation.");
      alert("Payment ID is missing.");
      return;
    }

    const payload = {
      id: activeRowId, // Use activeRowId as the payment ID
      status: selectedReconcileStatus,
      account_number: selectedAccountNumber || null,
      bank_name: selectedBankName || null,
    };

    console.log("Dispatching payload to saga:", payload);

    // Dispatch the action to call the saga
    this.props.confirmpayment(payload);

    // Close the modal
    this.handleCloseModal();
  };

  setReconcileStatus = status => {
    const rowId = this.state.activeRowId;

    // Dispatch saga
    this.props.confirmpayment({
      id: this.state.activeRowId, // Pass the active payment ID
      status: status, // Selected status
    });

    // Update UI locally
    this.setState(prevState => {
      const updatedData = prevState.GetPayment.map(item =>
        item.id === rowId ? { ...item, payment_reconcile_status: status } : item
      );

      return {
        GetPayment: updatedData, // ✅ update row status
        paymentConfirmState: {
          ...prevState.paymentConfirmState,
          [rowId]: {
            ...prevState.paymentConfirmState[rowId],
            reconcileStatus: status,
          },
        },
        showReconcileModal: false,
        activeRowId: null,
      };
    });
  };
  handleOpenReconcileModal = payment => {
    this.setState({
      showReconcileModal: true,
      selectedPayment: payment,
      paymentReceived: payment.payment_received || "", // Prefill if data exists
      bankAccountNumber: payment.account_number || "", // Prefill if data exists
      reconcileDate:
        payment.reconcile_date || new Date().toISOString().split("T")[0], // Default to today
    });
  };
  handleCloseReconcileModal = () => {
    this.setState({
      showReconcileModal: false,
      selectedPayment: null,
      paymentReceived: "",
      bankAccountNumber: "",
      reconcileDate: "",
    });
  };

  handleSaveReconcile = () => {
    const {
      selectedPayment,
      paymentReceived,
      bankAccountNumber,
      reconcileDate,
    } = this.state;

    if (!paymentReceived || !bankAccountNumber || !reconcileDate) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = {
      id: selectedPayment.id,
      payment_received: paymentReceived,
      account_number: bankAccountNumber,
      reconcile_date: reconcileDate,
      status: "Reconcile",
    };

    console.log("Reconcile Payload:", payload);

    this.props.confirmpayment(payload); // Dispatch the saga

    // Close the modal
    this.handleCloseReconcileModal();
  };

  componentDidMount() {
    const { onGetParticipantpayment, onGetBankList, confirmpayment } =
      this.props;

    // Fetch user_id from localStorage
    const user_id = localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : "";

    if (!user_id) {
      console.error("User ID is missing. Cannot fetch bank list.");
      return;
    }

    console.log("Component Mounted with User ID:", user_id);

    // Dispatch actions with the required user_id
    onGetParticipantpayment();
    onGetBankList(user_id); // Pass the user_id here
    confirmpayment();

    // Add logging after API responses
    setTimeout(() => {
      console.log("Payments Fetched:", this.props.GetPayment); // Ensure account_number is included
      console.log("Banks Fetched:", this.props.ListBank); // Check bank list data
    }, 1000); // Allow sagas to fetch and update the state
  }

  handleViewReconcileDetails = payment => {
    if (payment.payment_reconcile_status !== "Reconcile") {
      console.log("Modal not shown for Non-Reconcile status.");
      return; // Do nothing if the status is not "Reconcile"
    }

    console.log("Opening Reconcile Details for Payment:", payment);
    this.setState({
      showReconcileDetailsModal: true,
      selectedPayment: payment,
    });
  };

  handleCloseReconcileDetailsModal = () => {
    this.setState({
      showReconcileDetailsModal: false,
      selectedPayment: null,
    });
  };

  componentDidUpdate(prevProps) {
    const { GetPayment, ListBank } = this.props;

    // ✅ Handle payment updates
    if (
      GetPayment !== prevProps.GetPayment ||
      ListBank !== prevProps.ListBank
    ) {
      // Create a map of banks by account_number for quick lookup
      const bankMap = {};
      (ListBank || []).forEach(bank => {
        bankMap[bank.account_number] = bank.name; // Map account_number to bank_name
      });

      const transformedData = (GetPayment || []).map(payment => ({
        id: payment.id,
        participant_name: payment.participant_name,
        district: payment.district,
        scheme_count: payment.scheme_count,
        scheme_names: payment.scheme_names || [],
        price: payment.price,
        priceBeforeDiscount: payment.priceBeforeDiscount,
        discountAmount: payment.discountAmount,
        taxDeduction: payment.taxDeduction,
        payment_settlement: payment.payment_settlement,
        paymentmethod: payment.paymentmethod,
        payment_status: payment.payment_status,
        part_payment_amount: payment.part_payment_amount,
        remaining_amount: payment.remaining_amount,
        paydate: payment.paydate,
        photo_url: payment.photo_url,
        receivedby: payment.receivedby,
        membership_status: payment.membership_status,
        payment_reconcile_status: payment.payment_reconcile_status || "",
        reconcileStatus: payment.payment_reconcile_status || "",
        account_number: payment.account_number || null, // Include account_number
        bank_name: bankMap[payment.account_number] || "Unknown", // Lookup bank_name
      }));

      const paymentConfirmState = {};
      transformedData.forEach(row => {
        paymentConfirmState[row.id] = {
          reconcileStatus: row.reconcileStatus,
        };
      });

      this.setState({
        GetPayment: transformedData,
        paymentConfirmState,
      });
    }

    // ✅ Handle bank list updates
    if (ListBank !== prevProps.ListBank) {
      console.log("🏦 Banks received in props:", ListBank);
      this.setState({ ListBank });
    }
  }

  handleSchemeClick = row => {
    // If there's any timeout still running from previous hover, clear it
    if (this.mouseExitTimeout) {
      clearTimeout(this.mouseExitTimeout);
    }

    // Open the modal with row data
    this.setState({
      hoveredSchemeNames: row.scheme_names || [],
      schemeModalOpen: true,
      hoveredParticipantName: row.participant_name || "",
    });
  };

  handleSchemeModalClose = () => {
    this.setState({
      schemeModalOpen: false,
    });
  };

  handleFilterChange = (filterName, e) => {
    const value = e.target.value;

    this.setState(
      prevState => ({
        [filterName]: value,

        dateToActive: filterName === "dateTo" ? true : prevState.dateToActive,
      }),
      this.checkFiltersApplied
    );
  };
  checkFiltersApplied = () => {
    const {
      nameFilter,
      idFilter,
      districtFilter,
      schemeFilter,
      schemepriceFilter,
      amountFilter,
      discountFilter,
      TaxFilter,
      paymentsettlementFilter,
      paymentMethodFilter,
      paymentStatusFilter,
      reconcileStatusFilter,
      paidamountFilter,
      remainingAmountFilter,
      finalpayableFilter,
      dateFilter,
      paymentreceivedFilter,
      membershipStatusFilter,
      dateFrom,
      dateToActive, // Include activation flag
    } = this.state;

    // Check if ANY filter is applied AND has a NON-EMPTY value
    const filters = [
      nameFilter,
      idFilter,
      districtFilter,
      schemeFilter,
      schemepriceFilter,
      amountFilter,
      discountFilter,
      TaxFilter,
      paymentsettlementFilter,
      paymentMethodFilter,
      paymentStatusFilter,
      reconcileStatusFilter,
      paidamountFilter,
      remainingAmountFilter,
      finalpayableFilter,
      dateFilter,
      paymentreceivedFilter,
      membershipStatusFilter,
      dateFrom,
      dateToActive ? "active" : "", // Only consider dateTo if active
    ];

    const anyFilterSelected = filters.some(f => f && f.trim() !== "");

    this.setState({ filtersApplied: anyFilterSelected });
  };

  filterData = () => {
    const {
      GetPayment,
      nameFilter = "Select",
      idFilter = "Select",
      districtFilter = "Select",
      schemeFilter = "Select",
      schemepriceFilter = "Select",
      amountFilter = "Select",
      discountFilter = "Select",
      TaxFilter = "Select",
      paymentsettlementFilter = "Select",
      paymentreceivedFilter = "Select",
      membershipStatusFilter = "Select",
      paymentMethodFilter = "Select",
      paymentStatusFilter = "Select",
      reconcileStatusFilter = "Select",
      paidamountFilter = "Select",
      remainingAmountFilter = "Select",
      finalpayableFilter = "Select",
      dateFilter = "",
      dateFrom,
      dateTo,
      dateToActive, // Include activation flag
    } = this.state;

    // Return empty array if no filters are applied
    const filters = [
      nameFilter,
      idFilter,
      districtFilter,
      schemeFilter,
      schemepriceFilter,
      amountFilter,
      discountFilter,
      TaxFilter,
      paymentsettlementFilter,
      paymentMethodFilter,
      paymentStatusFilter,
      reconcileStatusFilter,
      paidamountFilter,
      remainingAmountFilter,
      finalpayableFilter,
      dateFilter,
      paymentreceivedFilter,
      membershipStatusFilter,
      dateFrom,
      dateToActive ? dateTo : "", // Only use dateTo if active
    ];

    const isAnyFilterApplied = filters.some(
      filter => filter !== "Select" && filter !== ""
    );
    if (!isAnyFilterApplied) return [];

    return GetPayment.filter(entry => {
      return (
        (idFilter === "All" ||
          (entry.id && entry.id.toString().includes(idFilter))) &&
        (nameFilter === "All" ||
          (entry.participant_name || "")
            .toLowerCase()
            .includes(nameFilter.toLowerCase())) &&
        (districtFilter === "All" ||
          (entry.district || "")
            .toLowerCase()
            .includes(districtFilter.toLowerCase())) &&
        (schemeFilter === "All" ||
          (entry.scheme_names || []).some(scheme =>
            scheme.toLowerCase().includes(schemeFilter.toLowerCase())
          )) &&
        (schemepriceFilter === "All" ||
          (entry.priceBeforeDiscount || "").includes(schemepriceFilter)) &&
        (amountFilter === "All" ||
          (entry.price || "").includes(amountFilter)) &&
        (discountFilter === "All" ||
          (entry.discountAmount || "").includes(discountFilter)) &&
        (TaxFilter === "All" ||
          (entry.taxDeduction || "").includes(TaxFilter)) &&
        (dateFilter === "All" || (entry.paydate || "").includes(dateFilter)) &&
        (paymentsettlementFilter === "All" ||
          (entry.payment_settlement || "")
            .toLowerCase()
            .includes(paymentsettlementFilter.toLowerCase())) &&
        (paymentreceivedFilter === "All" ||
          (entry.receivedby || "")
            .toLowerCase()
            .includes(paymentreceivedFilter.toLowerCase())) &&
        (membershipStatusFilter === "All" ||
          (entry.membership_status || "")
            .toLowerCase()
            .includes(membershipStatusFilter.toLowerCase())) &&
        (paymentMethodFilter === "All" ||
          (entry.paymentmethod || "")
            .toLowerCase()
            .includes(paymentMethodFilter.toLowerCase())) &&
        (paymentStatusFilter === "All" ||
          (entry.payment_status || "")
            .toLowerCase()
            .includes(paymentStatusFilter.toLowerCase())) &&
        (reconcileStatusFilter === "All" ||
          (entry.payment_reconcile_status || "")
            .toLowerCase()
            .includes(reconcileStatusFilter.toLowerCase())) &&
        (paidamountFilter === "All" ||
          (entry.part_payment_amount || "")
            .toString()
            .includes(paidamountFilter)) &&
        (remainingAmountFilter === "All" ||
          (entry.remaining_amount || "")
            .toString()
            .includes(remainingAmountFilter)) &&
        (finalpayableFilter === "All" ||
          (entry.price || "").toString().includes(finalpayableFilter)) &&
        (!dateFrom || new Date(entry.paydate) >= new Date(dateFrom)) &&
        (!dateToActive || new Date(entry.paydate) <= new Date(dateTo)) // Check if dateTo is active
      );
    });
  };

  getUniqueOptions = fieldName => {
    const { GetPayment } = this.state;
    const options = new Set();

    GetPayment.forEach(item => {
      const value = item[fieldName];
      if (Array.isArray(value)) {
        value.forEach(v => options.add(v));
      } else if (value) {
        options.add(value);
      }
    });

    return Array.from(options);
  };

  render() {
    const { GetPayment } = this.state;
    const defaultSorted = [{ dataField: "id", order: "desc" }];

    const pageOptions = {
      sizePerPage: 50,
      totalSize: GetPayment.length,
      custom: true,
    };

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Participant Payment | NHS NEQAS</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Labs"
              breadcrumbItem="Participant-Payment Record"
            />
            <Row className="justify-content-center align-item-center">
              <Col lg="10">
                {" "}
                {/* <p>
                  <strong>Note:</strong> Click on Scheme Number to get detail of
                  each participants payments
                </p> */}
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={this.filterData()}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={this.filterData()}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Modal
                                isOpen={this.state.schemeModalOpen}
                                toggle={this.handleSchemeModalClose}
                                onMouseEnter={() =>
                                  clearTimeout(this.mouseExitTimeout)
                                }
                                onMouseLeave={this.handleMouseExit}
                                // className="modal-sm"
                                // size="sm"  // Change this to 'lg' or 'xl' for bigger width
                              >
                                <ModalHeader
                                  toggle={this.handleSchemeModalClose}
                                  tag="h4"
                                >
                                  Available Schemes for{" "}
                                  {this.state.hoveredParticipantName}
                                </ModalHeader>
                                <ModalBody>
                                  <ul>
                                    {this.state.hoveredSchemeNames.map(
                                      (name, index) => (
                                        <li key={index}>{name}</li>
                                      )
                                    )}
                                  </ul>
                                </ModalBody>
                              </Modal>

                              <Row className="mb-3">
                                <Col md={4}>
                                  <Label for="nameFilter">
                                    Participant Name
                                  </Label>
                                  <Select
                                    id="nameFilter"
                                    options={[
                                      {
                                        value: "All",
                                        label: "All Participants",
                                      },
                                      ...this.getUniqueOptions(
                                        "participant_name"
                                      ).map(option => ({
                                        value: option,
                                        label: option,
                                      })),
                                    ]}
                                    value={
                                      this.state.nameFilter
                                        ? {
                                            value: this.state.nameFilter,
                                            label: this.state.nameFilter,
                                          }
                                        : null
                                    }
                                    onChange={selected =>
                                      this.handleFilterChange("nameFilter", {
                                        target: {
                                          value: selected?.value || "",
                                        },
                                      })
                                    }
                                    isClearable
                                  />
                                </Col>

                                <Col md={4}>
                                  <Label for="schemeFilter">Scheme</Label>
                                  <Select
                                    id="schemeFilter"
                                    options={[
                                      { value: "All", label: "All Schemes" },
                                      ...this.getUniqueOptions(
                                        "scheme_names"
                                      ).map(option => ({
                                        value: option,
                                        label: option,
                                      })),
                                    ]}
                                    value={
                                      this.state.schemeFilter
                                        ? {
                                            value: this.state.schemeFilter,
                                            label: this.state.schemeFilter,
                                          }
                                        : null
                                    }
                                    onChange={selected =>
                                      this.handleFilterChange("schemeFilter", {
                                        target: {
                                          value: selected?.value || "",
                                        },
                                      })
                                    }
                                    isClearable
                                  />
                                </Col>

                                <Col md={4}>
                                  <Label for="districtFilter">District</Label>
                                  <Select
                                    id="districtFilter"
                                    options={[
                                      { value: "All", label: "All Districts" },
                                      ...this.getUniqueOptions("district").map(
                                        option => ({
                                          value: option,
                                          label: option,
                                        })
                                      ),
                                    ]}
                                    value={
                                      this.state.districtFilter
                                        ? {
                                            value: this.state.districtFilter,
                                            label: this.state.districtFilter,
                                          }
                                        : null
                                    }
                                    onChange={selected =>
                                      this.handleFilterChange(
                                        "districtFilter",
                                        {
                                          target: {
                                            value: selected?.value || "",
                                          },
                                        }
                                      )
                                    }
                                    isClearable
                                  />
                                </Col>

                                <Col md={4}>
                                  <Label for="paymentsettlementFilter">
                                    Payment Settlement
                                  </Label>
                                  <Select
                                    id="paymentsettlementFilter"
                                    options={[
                                      {
                                        value: "All",
                                        label: "All Payment Settlement",
                                      },
                                      ...this.getUniqueOptions(
                                        "payment_settlement"
                                      ).map(option => ({
                                        value: option,
                                        label: option,
                                      })),
                                    ]}
                                    value={
                                      this.state.paymentsettlementFilter
                                        ? {
                                            value:
                                              this.state
                                                .paymentsettlementFilter,
                                            label:
                                              this.state
                                                .paymentsettlementFilter,
                                          }
                                        : null
                                    }
                                    onChange={selected =>
                                      this.handleFilterChange(
                                        "paymentsettlementFilter",
                                        {
                                          target: {
                                            value: selected?.value || "",
                                          },
                                        }
                                      )
                                    }
                                    isClearable
                                  />
                                </Col>

                                <Col md={4}>
                                  <Label for="paymentStatusFilter">
                                    Payment Status
                                  </Label>
                                  <Select
                                    id="paymentStatusFilter"
                                    options={[
                                      {
                                        value: "All",
                                        label: "All Payment Statuses",
                                      },
                                      ...this.getUniqueOptions(
                                        "payment_status"
                                      ).map(option => ({
                                        value: option,
                                        label: option,
                                      })),
                                    ]}
                                    value={
                                      this.state.paymentStatusFilter
                                        ? {
                                            value:
                                              this.state.paymentStatusFilter,
                                            label:
                                              this.state.paymentStatusFilter,
                                          }
                                        : null
                                    }
                                    onChange={selected =>
                                      this.handleFilterChange(
                                        "paymentStatusFilter",
                                        {
                                          target: {
                                            value: selected?.value || "",
                                          },
                                        }
                                      )
                                    }
                                    isClearable
                                  />
                                </Col>
                                <Col md={4}>
                                  <Label for="reconcileStatusFilter">
                                    Reconsile Status
                                  </Label>
                                  <Select
                                    id="reconcileStatusFilter"
                                    options={[
                                      {
                                        value: "All",
                                        label: "All Payment Statuses",
                                      },
                                      ...this.getUniqueOptions(
                                        "payment_reconcile_status"
                                      ).map(option => ({
                                        value: option,
                                        label: option,
                                      })),
                                    ]}
                                    value={
                                      this.state.reconcileStatusFilter
                                        ? {
                                            value:
                                              this.state.reconcileStatusFilter,
                                            label:
                                              this.state.reconcileStatusFilter,
                                          }
                                        : null
                                    }
                                    onChange={selected =>
                                      this.handleFilterChange(
                                        "reconcileStatusFilter",
                                        {
                                          target: {
                                            value: selected?.value || "",
                                          },
                                        }
                                      )
                                    }
                                    isClearable
                                  />
                                </Col>

                                <Row>
                                  <Col md={3}>
                                    <Label for="dateFrom">Date From</Label>
                                    <input
                                      type="date"
                                      id="dateFrom"
                                      className="form-control"
                                      value={this.state.dateFrom}
                                      onChange={e =>
                                        this.setState(
                                          { dateFrom: e.target.value },
                                          this.checkFiltersApplied
                                        )
                                      }
                                    />
                                  </Col>

                                  <Col md={3}>
                                    <Label for="dateTo">Date To</Label>
                                    <input
                                      type="date"
                                      id="dateTo"
                                      className="form-control"
                                      value={this.state.dateTo}
                                      onChange={e =>
                                        this.setState(
                                          {
                                            dateTo: e.target.value,
                                            dateToActive: true,
                                          },
                                          this.checkFiltersApplied
                                        )
                                      }
                                    />
                                  </Col>
                                </Row>
                              </Row>
                              <Modal
                                isOpen={this.state.showReconcileModal}
                                toggle={this.handleCloseModal}
                                centered
                              >
                                <ModalHeader toggle={this.handleCloseModal}>
                                  Reconciliation Status –{" "}
                                  {this.state.activeParticipantName}
                                </ModalHeader>
                                <ModalBody>
                                  <div className="mb-3">
                                    <Select
                                      options={[
                                        {
                                          value: "Reconcile",
                                          label: "Reconcile",
                                        },
                                        {
                                          value: "Non-Reconcile",
                                          label: "Non-Reconcile",
                                        },
                                      ]}
                                      value={
                                        this.state.selectedReconcileStatus
                                          ? {
                                              value:
                                                this.state
                                                  .selectedReconcileStatus,
                                              label:
                                                this.state
                                                  .selectedReconcileStatus,
                                            }
                                          : null
                                      }
                                      onChange={selected =>
                                        this.setState({
                                          selectedReconcileStatus:
                                            selected?.value,
                                          selectedBankAccount: null,
                                          selectedBankName: "",
                                        })
                                      }
                                      placeholder="Select status"
                                      isClearable
                                      className="w-100"
                                    />
                                  </div>

                                  {this.state.selectedReconcileStatus ===
                                    "Reconcile" && (
                                    <div className="mb-3">
                                      <label>Select Account Number</label>
                                      <Select
                                        options={(
                                          this.props.ListBank || []
                                        ).map(bank => ({
                                          value: bank.account_number,
                                          label: `${bank.account_number} (${bank.name})`,
                                        }))}
                                        onChange={selected => {
                                          console.log(
                                            "Selected Account:",
                                            selected?.value
                                          );
                                          this.setState({
                                            selectedAccountNumber:
                                              selected?.value || "",
                                            selectedBankName:
                                              selected?.label
                                                ?.split(" (")[1]
                                                ?.replace(")", "") || "",
                                          });
                                        }}
                                        placeholder="Select Account Number"
                                        isClearable
                                      />
                                    </div>
                                  )}

                                  <div className="d-flex justify-content-end">
                                    <Button
                                      color="primary"
                                      disabled={
                                        this.state.selectedReconcileStatus ===
                                          "Reconcile" &&
                                        !this.state.selectedAccountNumber // Ensure this matches the state being updated
                                      }
                                      onClick={this.handleReconcileSubmit}
                                    >
                                      Save
                                    </Button>
                                  </div>
                                </ModalBody>
                              </Modal>
                              <Modal
                                isOpen={this.state.showReconcileDetailsModal}
                                toggle={this.handleCloseReconcileDetailsModal}
                                centered
                              >
                                <ModalHeader
                                  toggle={this.handleCloseReconcileDetailsModal}
                                >
                                  Reconciliation Details
                                </ModalHeader>
                                <ModalBody>
                                  {this.state.selectedPayment ? (
                                    <div>
                                      <p>
                                        <strong>Status:</strong>{" "}
                                        {this.state.selectedPayment
                                          .payment_reconcile_status || "--"}
                                      </p>
                                      <p>
                                        <strong>Account Number:</strong>{" "}
                                        {this.state.selectedPayment
                                          .account_number || "--"}
                                      </p>
                                      <p>
                                        <strong>Bank Name:</strong>{" "}
                                        {this.state.selectedPayment.bank_name ||
                                          "--"}
                                      </p>
                                    </div>
                                  ) : (
                                    <p>No details available.</p>
                                  )}
                                </ModalBody>
                              </Modal>

                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      key={this.state.tableKey} // ✅ This is critical!
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={"table align-middle"}
                                      bordered={false}
                                      striped={false}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()} // Ensure filterFactory is applied correctly
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row>
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
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

ParticipantCSRPayments.propTypes = {
  GetPayment: PropTypes.array,
  onGetParticipantpayment: PropTypes.func,
  onconfirmpayment: PropTypes.func,
  dispatch: PropTypes.func.isRequired,
  confirmpayment: PropTypes.array,
  ListBank: PropTypes.array,
  onGetBankList: PropTypes.func,
};

const mapStateToProps = state => ({
  GetPayment: state.AddPayment?.GetPayment ?? [],
  ListBank: state.banks.ListBank, // ✅ must match reducer
});

const mapDispatchToProps = dispatch => ({
  onGetParticipantpayment: () => dispatch(getParticipantPayment()),
  onGetBankList: id => dispatch(getbanklist(id)), // ✅ dispatch this
  confirmpayment: id => dispatch(confirmpayment(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantCSRPayments);

