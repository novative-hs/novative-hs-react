import React, { Component } from "react";
import { FaDownload } from "react-icons/fa";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
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
} from "reactstrap";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import filterFactory from "react-bootstrap-table2-filter";
import Breadcrumbs from "components/Common/Breadcrumb";
import { getParticipantPayment } from "store/Payment/actions";
import "assets/scss/table.scss";
import { Formik, Field, Form, ErrorMessage } from "formik";

class ParticipantPayments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameFilter: "",
      idFilter: "",
      districtFilter: "",
      schemeFilter: "",
      schemeModalOpen: false,
      amountFilter: "",
      discountFilter: "",
      schemepriceFilter: "",
      hoveredSchemeNames: [],
      TaxFilter: "",
      dateFilter: "", // Add this if `dateFilter` is intended
      filtersApplied: false,
      hoveredSchemeNames: [],
      paymentmodeFilter: "",
      dateFilter: "",
      paymentreceivedFilter: "",
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
      finalpayableFilter: "",
      paidamountFilter: "",
      remainingAmountFilter: "",
      membershipStatusFilter: "",
      dateFrom: "",
      dateTo: "",
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
            backgroundColor: "#87ceeb", // 🌤 sky blue for header
            textAlign: "center",
          },
          style: {
            textAlign: "right",
          },
          formatter: (cell, row) => (
            <div
              className="d-flex gap-3 ml-3"
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              <Tooltip title="Payment Details">
                <Link
                  to={`/payment-scheme-list/${row.id}`}
                  style={{ textDecoration: "underline", color: "#0000CD" }}
                  onClick={() =>
                    console.log(
                      `Navigating to payment-scheme-list with ID: ${row.id}`
                    )
                  }
                >
                  <i className="mdi mdi-credit-card-outline font-size-18" />
                </Link>
              </Tooltip>
            </div>
          ),
        },
      ],
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
  componentDidMount() {
    const { onGetParticipantpayment } = this.props;
    console.log("Component Mounted");
    this.setState({
      dateTo: new Date().toISOString().split("T")[0], // Set today's date
    });

    // Dispatch action to fetch all participant payments (without specific ID)
    onGetParticipantpayment();
  }

  componentDidUpdate(prevProps) {
    if (this.props.GetPayment !== prevProps.GetPayment) {
      const transformedData = (this.props.GetPayment || []).map(payment => ({
        id: payment.id,
        participant_name: payment.participant_name,
        district: payment.district,
        scheme_count: payment.scheme_count, // Display count of schemes
        scheme_names: payment.scheme_names || [], // <-- add this line
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
        membership_status: payment.membership_status, // ✅ include this
      }));
      this.setState({
        GetPayment: transformedData,
      });
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

  // handleMouseExit = () => {
  //   this.setState({
  //     PatientModal: false,
  //     MarketerModal: false,
  //     LabModal: false,
  //     isHovered: false,
  //   });
  // };

  handleFilterChange = (filterName, e) => {
    const value = e.target.value;

    this.setState(
      prevState => ({
        [filterName]: value,
        // Mark dateToActive only when dateTo changes
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

                              <Row className="mb-2 mt-3"></Row>
                              <Row className="mb-3">
                                <Col md={4}>
                                  <Label for="nameFilter">
                                    Participant Name
                                  </Label>
                                  <select
                                    id="nameFilter"
                                    className="form-control"
                                    value={this.state.nameFilter}
                                    onChange={e =>
                                      this.handleFilterChange("nameFilter", e)
                                    }
                                  >
                                    <option value="Select">Select</option>
                                    <option value="All">
                                      All Participants
                                    </option>
                                    {this.getUniqueOptions(
                                      "participant_name"
                                    ).map((option, idx) => (
                                      <option key={idx} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                </Col>
                                <Col md={4}>
                                  <Label for="schemeFilter">Scheme</Label>
                                  <select
                                    id="schemeFilter"
                                    className="form-control"
                                    value={this.state.schemeFilter}
                                    onChange={e =>
                                      this.handleFilterChange("schemeFilter", e)
                                    }
                                  >
                                    <option value="Select">Select</option>
                                    <option value="All">All Schemes</option>
                                    {this.getUniqueOptions("scheme_names").map(
                                      (option, idx) => (
                                        <option key={idx} value={option}>
                                          {option}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </Col>

                                <Col md={4}>
                                  <Label for="districtFilter">District</Label>
                                  <select
                                    id="districtFilter"
                                    className="form-control"
                                    value={this.state.districtFilter}
                                    onChange={e =>
                                      this.handleFilterChange(
                                        "districtFilter",
                                        e
                                      )
                                    }
                                  >
                                    <option value="Select">Select</option>
                                    <option value="All">All District</option>
                                    {this.getUniqueOptions("district").map(
                                      (option, idx) => (
                                        <option key={idx} value={option}>
                                          {option}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </Col>

                                <Col md={4}>
                                  <Label for="paymentsettlementFilter">
                                    Payment Settlement
                                  </Label>
                                  <select
                                    id="paymentsettlementFilter"
                                    className="form-control"
                                    value={this.state.paymentsettlementFilter}
                                    onChange={e =>
                                      this.handleFilterChange(
                                        "paymentsettlementFilter",
                                        e
                                      )
                                    }
                                  >
                                    <option value="Select">Select</option>
                                    <option value="All">
                                      All Payment Settlement
                                    </option>
                                    {this.getUniqueOptions(
                                      "payment_settlement"
                                    ).map((option, idx) => (
                                      <option key={idx} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                </Col>
                                <Col md={4}>
                                  <Label for="paymentStatusFilter">
                                    Payment Status
                                  </Label>
                                  <select
                                    id="paymentStatusFilter"
                                    className="form-control"
                                    value={this.state.paymentStatusFilter}
                                    onChange={e =>
                                      this.handleFilterChange(
                                        "paymentStatusFilter",
                                        e
                                      )
                                    }
                                  >
                                    <option value="Select">Select</option>
                                    <option value="All">
                                      All Payment Statuses
                                    </option>
                                    {this.getUniqueOptions(
                                      "payment_status"
                                    ).map((option, idx) => (
                                      <option key={idx} value={option}>
                                        {option}
                                      </option>
                                    ))}
                                  </select>
                                </Col>
                                <Row>
                                  <Col md={3}>
                                    <Label for="dateFrom">Date From </Label>
                                    <input
                                      type="date"
                                      id="dateFrom"
                                      className="form-control"
                                      value={this.state.dateFrom}
                                      onChange={e =>
                                        this.setState({
                                          dateFrom: e.target.value,
                                        })
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
                                        this.setState({
                                          dateTo: e.target.value,
                                        })
                                      }
                                    />
                                  </Col>
                                </Row>
                              </Row>

                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-condensed"
                                      }
                                      bordered={false}
                                      striped={false} // or remove entirely
                                      headerWrapperClasses="custom-header"
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
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

ParticipantPayments.propTypes = {
  GetPayment: PropTypes.array,
  onGetParticipantpayment: PropTypes.func,
};

const mapStateToProps = state => ({
  GetPayment: state.AddPayment?.GetPayment ?? [],
});

const mapDispatchToProps = dispatch => ({
  onGetParticipantpayment: () => dispatch(getParticipantPayment()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantPayments);
