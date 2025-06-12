import React, { Component } from "react";
import { FaDownload } from "react-icons/fa";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import Select from "react-select"; // For Select component
import { getcyclelist } from "store/cycle/actions";
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
import { getParticipantSchemelist } from "store/Payment/actions";
import "assets/scss/table.scss";
import { Formik, Field, Form, ErrorMessage } from "formik";

class ParticipantPayments extends Component {
  constructor(props) {
    // this.handleSchemeChange = this.handleSchemeChange.bind(this)
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
      selectedScheme: null,
      CycleList: [],
      TaxFilter: "",
      hoveredSchemeNames: [],
      paymentmodeFilter: "",
      dateFilter: "",
      paymentreceivedFilter: "",
      selectedCheckboxes: {},
      tableKey: 0,
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
      editModalOpen: false,
      selectedRow: null,
      feedbackListColumns: [
        {
          text: "Payment ID",
          dataField: "id",
          sort: true,
          hidden: false,
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
          style: { textAlign: "left" },
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
              onMouseEnter={() => {
                clearTimeout(this.mouseExitTimeout);
                this.handleSchemeHover(row);
              }}
              onPointerLeave={this.handleMouseExit}
              style={{ cursor: "pointer", textAlign: "center", color: "blue" }}
            >
              {cell}
            </div>
          ),
        },
        {
          dataField: "priceBeforeDiscount",
          text: "Payable",
          sort: true,
          style: { textAlign: "right" },
          formatter: cell => Number(cell).toLocaleString(),
          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
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
          style: { textAlign: "right" },
          formatter: cell => {
            // Format number with comma as thousands separator
            return cell != null ? Number(cell).toLocaleString() : "-";
          },
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
          style: { textAlign: "right" },
          formatter: cell => Number(cell).toLocaleString(),
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
          style: { textAlign: "right" },
          formatter: (cell, row) => {
            const price = parseFloat(row.price) || 0;
            const discount = parseFloat(row.discount) || 0;
            const tax = parseFloat(row.tax) || 0;

            const payable = price - discount - tax;

            // Format with comma and 2 decimal places
            return payable.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            });
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
          style: { textAlign: "right" },
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
          style: { textAlign: "right" },
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
              <Tooltip title="Update">
                <button
                  type="button"
                  className="btn btn-link text-success p-0 m-0"
                  onClick={() => this.toggleEditModal(row)}
                  style={{ textDecoration: "none" }}
                >
                  <i className="mdi mdi-pencil font-size-18"></i>
                </button>
              </Tooltip>
            </div>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    const { onGetParticipantpayment, ongetcyclelist } = this.props;

    console.log("Component Mounted");
    onGetParticipantpayment();

    const authUser = localStorage.getItem("authUser");
    const user_id = authUser ? JSON.parse(authUser).user_id : null;

    if (user_id) {
      console.log("Calling ongetcyclelist with user_id:", user_id);
      ongetcyclelist(user_id);
    } else {
      console.log("No user_id found in localStorage");
    }
    this.setState({ user_id }, () => {
      // Get organization_name from URL params
      const { organization_name } = this.props.match.params || {};
      console.log("organization_name from props:", organization_name);

      if (organization_name) {
        this.setState({ organization_name }, () => {
          console.log("Organization name set:", this.state.organization_name);

          // // Initialize dropdown value
          // this.setInitialDropdownValue();
          this.fetchData(this.state.user_id);
        });
      } else {
        console.error("Organization name is missing in URL parameters.");
      }
    });
  }

  fetchData(user_id) {
    const { onGetParticipantPayment, ongetcyclelist } = this.props;

    // Call participant payment API
    onGetParticipantPayment(user_id);
    console.log("onGetParticipantPayment called with user_id:", user_id);

    // Call cycle list API
    ongetcyclelist(user_id);
    console.log("ongetcyclelist called with user_id:", user_id);
  }
  handleSchemeChange = event => {
    const selectedScheme = event.target.value;
    console.log("Scheme selected:", selectedScheme);

    this.setState({ selectedScheme }, () => {
      this.applyFilters(); // Call filters after updating state
    });
  };

componentDidUpdate(prevProps) {
  // ✅ Update CycleList whenever it changes
  if (this.props.CycleList !== prevProps.CycleList) {
    console.log("Updated CycleList:", this.props.CycleList);
    this.setState({ CycleList: this.props.CycleList });
  }

  // ✅ Only then update GetPayment
  if (this.props.GetPayment !== prevProps.GetPayment) {
    const transformedData = (this.props.GetPayment || []).map(payment => ({
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
    }));

    this.setState({ GetPayment: transformedData });
  }
}

  handleSchemeHover = row => {
    if (this.mouseExitTimeout) {
      clearTimeout(this.mouseExitTimeout);
    }
    this.setState({
      hoveredSchemeNames: row.scheme_names || [],
      schemeModalOpen: true,
      hoveredParticipantName: row.participant_name || "", // add this line
    });
  };
   toggleEditModal = (row, participant = null) => {
  const scheme_ids =
    row?.scheme_names?.map(scheme => `${scheme.scheme_id}-${scheme.cycle_id}`) || [];

  this.setState(
    prevState => ({
      editModalOpen: !prevState.editModalOpen,
      selectedRow: row || null,
      selectedScheme: scheme_ids,
      selectedParticipant: participant,
      isPaymentModalOpen: participant ? true : prevState.isPaymentModalOpen,
    }),
    () => {
      console.log("Selected Scheme IDs for Edit Modal:", this.state.selectedScheme);
    }
  );
};


  handleSchemeModalClose = () => {
    this.setState({
      schemeModalOpen: false,
    });
  };

  handleMouseExit = () => {
    this.setState({
      PatientModal: false,
      MarketerModal: false,
      LabModal: false,
      isHovered: false,
    });
  };

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  filterData = () => {
    const {
      GetPayment,
      nameFilter = "",
      idFilter = "",
      districtFilter = "",
      schemeFilter = "",
      schemepriceFilter = "",
      amountFilter = "",
      discountFilter = "",
      TaxFilter = "",
      paymentsettlementFilter = "",
      paymentMethodFilter = "",
      paymentStatusFilter = "",
      paidamountFilter = "",
      remainingAmountFilter = "",
      finalpayableFilter = "",
      dateFilter = "",
      paymentreceivedFilter = "",
      membershipStatusFilter = "", // ← Add this
    } = this.state;

    return GetPayment.filter(
      entry =>
        (entry.id ? entry.id.toString() : "").includes(idFilter) &&
        (entry.participant_name || "")
          .toLowerCase()
          .includes(nameFilter.toLowerCase()) &&
        (entry.district || "")
          .toLowerCase()
          .includes(districtFilter.toLowerCase()) &&
        (entry.scheme_name || "")
          .toLowerCase()
          .includes(schemeFilter.toLowerCase()) &&
        (entry.price || "")
          .toLowerCase()
          .includes(amountFilter.toLowerCase()) &&
        (entry.priceBeforeDiscount || "")
          .toLowerCase()
          .includes(schemepriceFilter.toLowerCase()) &&
        (entry.discount || "")
          .toLowerCase()
          .includes(discountFilter.toLowerCase()) &&
        (entry.taxDeduction || "")
          .toLowerCase()
          .includes(TaxFilter.toLowerCase()) &&
        (entry.payment_settlement || "")
          .toLowerCase()
          .includes(paymentsettlementFilter.toLowerCase()) &&
        (entry.price || "")
          .toLowerCase()
          .includes(finalpayableFilter.toLowerCase()) &&
        (entry.part_payment_amount
          ? entry.part_payment_amount.toString()
          : ""
        ).includes(paidamountFilter) &&
        (entry.remaining_amount
          ? entry.remaining_amount.toString()
          : ""
        ).includes(remainingAmountFilter) &&
        (entry.payment_status || "")
          .toLowerCase()
          .includes(paymentStatusFilter.toLowerCase()) &&
        (entry.paymentmethod || "")
          .toLowerCase()
          .includes(paymentMethodFilter.toLowerCase()) &&
        (entry.paydate || "")
          .toLowerCase()
          .includes(dateFilter.toLowerCase()) &&
        (entry.receivedby || "")
          .toLowerCase()
          .includes(paymentreceivedFilter.toLowerCase()) &&
        (entry.membership_status || "")
          .toLowerCase()
          .includes(membershipStatusFilter.toLowerCase())
    );
  };

  render() {
    const { GetPayment } = this.state;
    const { CycleList } = this.state;
    const defaultSorted = [{ dataField: "id", order: "desc" }];
    const { editModalOpen, selectedRow } = this.state;
  const schemeOptions = CycleList.map(scheme => ({
  value: `${scheme.scheme_id}-${scheme.id}`,
  label: `(Scheme Name: ${scheme.scheme_name}) - (Cycle Number: ${scheme.cycle_no})`,
  scheme_id: scheme.scheme_id,
  cycle_id: scheme.id,
}));

    console.log("CycleList:", CycleList);
    console.log("Generated schemeOptions:", schemeOptions);

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
                              <Modal
                                isOpen={this.state.editModalOpen}
                                toggle={this.toggleEditModal}
                                size="md"
                                // onCloseClick={() => this.setState({ toggleEditModal: false })}
                              >
                                <ModalHeader toggle={this.togglePaymentModal}>
                                  Update Payment for{" "}
                                  {this.state.selectedParticipant?.name ||
                                    "Unknown"}
                                </ModalHeader>
                                <ModalBody>
                                  {this.state.selectedRow && (
                                    <Formik
                                      initialValues={{
                                        participant_name:
                                          this.state.selectedRow
                                            .participant_name,
                                        scheme: [],
                                        scheme: this.state.selectedScheme || [],
                                        participant:
                                          this.state.selectedParticipant?.id ||
                                          "",
                                        scheme: [],
                                        district:
                                          this.state.selectedRow.district,
                                        membership_status:
                                          this.state.selectedRow
                                            .membership_status,
                                        priceBeforeDiscount:
                                          this.state.selectedRow
                                            .priceBeforeDiscount,
                                        discountAmount:
                                          this.state.selectedRow.discountAmount,
                                        taxDeduction:
                                          this.state.selectedRow.taxDeduction,
                                        price: this.state.selectedRow.price,
                                        payment_settlement:
                                          this.state.selectedRow
                                            .payment_settlement,
                                        part_payment_amount:
                                          this.state.selectedRow
                                            .part_payment_amount,
                                        remaining_amount:
                                          this.state.selectedRow
                                            .remaining_amount,
                                        paymentmethod:
                                          this.state.selectedRow.paymentmethod,
                                        payment_status:
                                          this.state.selectedRow.payment_status,
                                        paydate: this.state.selectedRow.paydate,
                                        receivedby:
                                          this.state.selectedRow.receivedby,
                                      }}
                                      onSubmit={(
                                        values,
                                        setFieldValue,
                                        errors,
                                        { setSubmitting }
                                      ) => {
                                        const payload = {
      ...values,
      scheme: values.scheme, // use updated scheme from form
    };

                                        console.log("Updated values:", payload);

                                        // 👉 Dispatch update API call here if needed
                                        // this.props.updatePayment(payload);

                                        this.setState({ editModalOpen: false });
                                        setSubmitting(false);
                                      }}
                                    >
                                      {({ values, setFieldValue, isSubmitting, errors, touched }) => (
                                        <Form>
                                          <Row>
                                            <Col md="6">
                                              <Label>Participant Name</Label>
                                              <Field
                                                name="participant_name"
                                                className="form-control"
                                              />
                                            </Col>
                                             <Row>
                                                  <Col>
                                                    <Label>Scheme</Label>
                                               <Select
  name="scheme"
  isMulti
  options={schemeOptions}
  value={schemeOptions.filter(option =>
    values.scheme.includes(option.value)
  )}
  onChange={selectedOptions => {
    const selectedValues = selectedOptions
      ? selectedOptions.map(option => option.value)
      : [];
    setFieldValue("scheme", selectedValues);
  }}
/>

                                                  </Col>
                                                </Row>

                                            <Col md="6">
                                              <Label>District</Label>
                                              <Field
                                                name="district"
                                                className="form-control"
                                              />
                                            </Col>
                                          </Row>

                                          <Row className="mt-3">
                                            <Col md="6">
                                              <Label>Membership Status</Label>
                                              <Field
                                                name="membership_status"
                                                className="form-control"
                                              />
                                            </Col>
                                            <Col md="6">
                                              <Label>Payment Method</Label>
                                              <Field
                                                name="paymentmethod"
                                                className="form-control"
                                              />
                                            </Col>
                                          </Row>

                                          <Row className="mt-3">
                                            <Col md="6">
                                              <Label>Final Payable</Label>
                                              <Field
                                                name="price"
                                                className="form-control"
                                              />
                                            </Col>
                                            <Col md="6">
                                              <Label>Paid Amount</Label>
                                              <Field
                                                name="part_payment_amount"
                                                className="form-control"
                                              />
                                            </Col>
                                          </Row>

                                          <Row className="mt-3">
                                            <Col md="6">
                                              <Label>Remaining Amount</Label>
                                              <Field
                                                name="remaining_amount"
                                                className="form-control"
                                              />
                                            </Col>
                                            <Col md="6">
                                              <Label>Tax Deduction</Label>
                                              <Field
                                                name="taxDeduction"
                                                className="form-control"
                                              />
                                            </Col>
                                          </Row>

                                          <Row className="mt-3">
                                            <Col md="6">
                                              <Label>Discount</Label>
                                              <Field
                                                name="discountAmount"
                                                className="form-control"
                                              />
                                            </Col>
                                            <Col md="6">
                                              <Label>Received By</Label>
                                              <Field
                                                name="receivedby"
                                                className="form-control"
                                              />
                                            </Col>
                                          </Row>

                                          <Row className="mt-3">
                                            <Col md="6">
                                              <Label>Payment Status</Label>
                                              <Field
                                                name="payment_status"
                                                className="form-control"
                                              />
                                            </Col>
                                            <Col md="6">
                                              <Label>Pay Date</Label>
                                              <Field
                                                name="paydate"
                                                type="date"
                                                className="form-control"
                                              />
                                            </Col>
                                          </Row>

                                          <div className="mt-4 text-end">
                                            <button
                                              type="submit"
                                              className="btn btn-primary"
                                              disabled={isSubmitting}
                                            >
                                              Save Changes
                                            </button>
                                          </div>
                                        </Form>
                                      )}
                                    </Formik>
                                  )}
                                </ModalBody>
                              </Modal>
                              <Row className="mb-2 mt-3"></Row>
                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-condensed table-hover"
                                      }
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={
                                        "table-header-sky-blue"
                                      }
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
  CycleList: PropTypes.array,
  onGetParticipantPayment: PropTypes.func,
  ongetcyclelist: PropTypes.func,
  match: PropTypes.object,
};

const mapStateToProps = state => {
  const cycleList = state.CycleList?.CycleList || [];
  console.log("CycleList:", cycleList);

  return {
    userID: state.Account?.userID || null,
    CycleList: cycleList,
    PaymentSchemeList: state.PaymentScheme?.PaymentSchemeList || [],
    GetPayment: state.AddPayment?.GetPayment ?? [],
  };
};

const mapDispatchToProps = dispatch => ({
  onGetParticipantpayment: () => dispatch(getParticipantPayment()),
  onGetParticipantPayment: id => dispatch(getParticipantSchemelist(id)),
  ongetcyclelist: id => dispatch(getcyclelist(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantPayments);
