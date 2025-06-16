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
import { updatePayment } from "store/Payment/actions";
import { getdistrictlist } from "store/participantdistrict/actions";
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
  Input,
} from "reactstrap";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import filterFactory from "react-bootstrap-table2-filter";
import Breadcrumbs from "components/Common/Breadcrumb";
import { getParticipantPayment } from "store/Payment/actions";
// import { getParticipantSchemelist } from "store/Payment/actions";
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
      ListDistrict: [],
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
                  onChange={(e) => this.handleFilterChange("idFilter", e)}
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
                  onChange={(e) => this.handleFilterChange("nameFilter", e)}
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
                  onChange={(e) =>
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
                  onChange={(e) => this.handleFilterChange("districtFilter", e)}
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
                  onChange={(e) => this.handleFilterChange("schemeFilter", e)}
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
          formatter: (cell) => Number(cell).toLocaleString(),
          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.schemepriceFilter}
                  onChange={(e) =>
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
          formatter: (cell) => {
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
                  onChange={(e) => this.handleFilterChange("discountFilter", e)}
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
          formatter: (cell) => Number(cell).toLocaleString(),
          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.TaxFilter}
                  onChange={(e) => this.handleFilterChange("TaxFilter", e)}
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
                  onChange={(e) =>
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
                  onChange={(e) =>
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
                  onChange={(e) =>
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
                  onChange={(e) =>
                    this.handleFilterChange("paidamountFilter", e)
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
                  onChange={(e) =>
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
                    onChange={(e) =>
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
          formatter: (cell) => {
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
                  onChange={(e) => this.handleFilterChange("dateFilter", e)}
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
                  onChange={(e) =>
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
                  onClick={() => this.toggleEditModal(row, row)}
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
    const { onGetParticipantpayment, ongetcyclelist, onGetDistrictList } =
      this.props;

    console.log("Component Mounted");
    onGetParticipantpayment();

    const authUser = localStorage.getItem("authUser");
    const user_id = authUser ? JSON.parse(authUser).user_id : null;

    if (user_id) {
      console.log("Calling ongetcyclelist with user_id:", user_id);
      ongetcyclelist(user_id);

      // ✅ Corrected: Set user_id first
      this.setState({ user_id }, () => {
        // ✅ Now call onGetDistrictList with the correct user_id
        onGetDistrictList(this.state.user_id);

        const { organization_name } = this.props.match.params || {};
        console.log("organization_name from props:", organization_name);

        if (organization_name) {
          this.setState({ organization_name }, () => {
            console.log("Organization name set:", this.state.organization_name);
            this.fetchData(this.state.user_id);
          });
        } else {
          console.error("Organization name is missing in URL parameters.");
        }
      });
    } else {
      console.log("No user_id found in localStorage");
    }
  }

  fetchData(user_id) {
    const { onGetParticipantpayment, ongetcyclelist } = this.props;

    // Call participant payment API
    onGetParticipantpayment();
    console.log("onGetParticipantPayment called with user_id:", user_id);

    // Call cycle list API
    ongetcyclelist(user_id);
    console.log("ongetcyclelist called with user_id:", user_id);
  }
  handleSchemeChange = (event) => {
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
    if (prevProps.ListDistrict !== this.props.ListDistrict) {
      console.log("Updated ListDistrict:", this.props.ListDistrict);
      this.setState({ ListDistrict: this.props.ListDistrict });
    }
    // ✅ Only then update GetPayment
    if (this.props.GetPayment !== prevProps.GetPayment) {
      const transformedData = (this.props.GetPayment || []).map((payment) => ({
        id: payment.id,
        participant_name: payment.participant_name,
        district: payment.district,
        // district: values.district,
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

  handleSchemeHover = (row) => {
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
    // 🧼 Normalize scheme names for matching
    const matchedSchemes =
      row?.scheme_names
        ?.map((name) => {
          const cleanedName = name.replace(/,/g, "").trim().toLowerCase();
          const found = this.state.CycleList?.find((option) => {
            const optionName = option.scheme_name
              .replace(/,/g, "")
              .trim()
              .toLowerCase();
            return optionName === cleanedName;
          });
          return found;
        })
        .filter(Boolean) || [];

    // 🧠 Log actual price data for debug
    matchedSchemes.forEach((scheme, index) => {
      const raw = scheme?.priceBeforeDiscount || scheme?.price;
      const cleaned = parseFloat(raw?.toString().replace(/,/g, ""));
      console.log(`🔎 Scheme ${index + 1}`, {
        schemeName: scheme.scheme_name,
        rawPrice: raw,
        cleanedPrice: cleaned,
      });
    });

    // 💰 Corrected total price calculation
    const priceBeforeDiscount = matchedSchemes.reduce((sum, scheme) => {
      const raw = scheme?.priceBeforeDiscount || scheme?.price || 0;
      const cleaned = parseFloat(raw.toString().replace(/,/g, ""));
      return sum + (isNaN(cleaned) ? 0 : cleaned);
    }, 0);

    // 🪪 Format scheme IDs
    const scheme_ids = matchedSchemes.map(
      (opt) => `${opt.scheme_id}-${opt.id}`
    );

    // 🧾 Debug final total
    console.log("✅ matchedSchemes:", matchedSchemes);
    console.log("💰 Total Payable (pre-filled):", priceBeforeDiscount);

    this.setState({
      editModalOpen: true,
      selectedRow: row,
      selectedScheme: scheme_ids,
      selectedParticipant: participant || {
        name: row?.participant_name || "",
        district: row?.district || "",
        id: row?.participant || "",
      },
      selectedPrice: priceBeforeDiscount,
    });
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

  handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("photo", file);
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
      (entry) =>
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
    const { ListDistrict } = this.state;
    const defaultSorted = [{ dataField: "id", order: "desc" }];
    const { editModalOpen, selectedRow } = this.state;
    const schemeOptions = CycleList.map((scheme) => ({
      value: `${scheme.scheme_id}-${scheme.id}`,
      label: `(Scheme Name: ${scheme.scheme_name}) - (Cycle Number: ${scheme.cycle_no})`,
      scheme_id: scheme.scheme_id,
      cycle_id: scheme.id,
      price: parseFloat(
        (scheme.priceBeforeDiscount || scheme.price || "0")
          .toString()
          .replace(/,/g, "")
      ),
    }));

    console.log("CycleList:", CycleList);
    console.log("Generated schemeOptions:", schemeOptions);

    const pageOptions = {
      sizePerPage: 50,
      totalSize: GetPayment.length,
      custom: true,
    };
    const districtOptions = ListDistrict.map((district) => ({
      value: district.name,
      label: district.name,
    }));

    console.log("District Options:", districtOptions); // ✅ Console log added here

    const customStyles = {
      // <-- This is invalid here
      control: (provided) => ({
        ...provided,
        minHeight: "38px",
      }),
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
                          {(toolkitprops) => (
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
                                  toggle={() =>
                                    this.setState({ editModalOpen: false })
                                  }
                                >
                                  Update Payment for{" "}
                                  {this.state.modalParticipantName || "Unknown"}
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
                              >
                                <ModalHeader
                                  toggle={() =>
                                    this.setState({ editModalOpen: false })
                                  }
                                >
                                  Update Payment for{" "}
                                  {this.state.selectedRow?.participant_name ||
                                    "Unknown"}
                                </ModalHeader>

                                <ModalBody>
                                  {this.state.selectedRow && (
                                    <Formik
                                      initialValues={{
                                        participant_name:
                                          this.state.selectedRow
                                            .participant_name,
                                        // scheme: [],
                                        scheme: this.state.selectedScheme,
                                        participant:
                                          this.state.selectedParticipant?.id ||
                                          "",
                                        // scheme: [],
                                        district:
                                          this.state.selectedParticipant
                                            ?.district || "",
                                        membership_status:
                                          this.state.selectedRow
                                            .membership_status,
                                        priceBeforeDiscount:
                                          this.state.selectedPrice,
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
                                        paydate:
                                          this.state.selectedRow?.paydate &&
                                          this.state.selectedRow.paydate !==
                                            "null"
                                            ? this.state.selectedRow.paydate
                                            : "",
                                        receivedby:
                                          this.state.selectedRow.receivedby,
                                      }}
                                      onSubmit={(values, { setSubmitting }) => {
                                        const selectedSchemeDetails = (
                                          values.scheme || []
                                        ).map((id) => {
                                          const [scheme_id, cycle_id] =
                                            id.split("-");
                                          return this.state.CycleList.find(
                                            (scheme) =>
                                              String(scheme.scheme_id) ===
                                                scheme_id &&
                                              String(scheme.id) === cycle_id
                                          );
                                        });

                                        const totalPriceBeforeDiscount =
                                          selectedSchemeDetails.reduce(
                                            (sum, scheme) =>
                                              sum +
                                              (parseFloat(scheme?.price) || 0),
                                            0
                                          );

                                        const payload = {
                                          ...values,
                                          scheme: values.scheme.join(","),
                                          id: this.state.selectedRow?.id,
                                          added_by: this.state.user_id,
                                          participant:
                                            this.state.selectedRow
                                              ?.participant ||
                                            values.participant,
                                          priceBeforeDiscount:
                                            totalPriceBeforeDiscount.toFixed(2), // ✅ actual scheme price
                                        };

                                        this.props.onupdatePayment(payload);

                                        setTimeout(() => {
                                          if (this.state.user_id) {
                                            this.props.onGetParticipantpayment(
                                              this.state.user_id
                                            );
                                          }
                                        }, 500);

                                        this.setState({ editModalOpen: false });
                                      }}
                                    >
                                      {({
                                        values,
                                        setFieldValue,
                                        isSubmitting,
                                        errors,
                                        touched,
                                      }) => (
                                        <Form>
                                          {/* {(() => {
                                            if (
                                              values.scheme &&
                                              values.scheme.length > 0
                                            ) {
                                              const selectedSchemeDetails =
                                                values.scheme.map(id => {
                                                  const [scheme_id, cycle_id] =
                                                    id.split("-");
                                                  return this.state.CycleList.find(
                                                    scheme =>
                                                      String(
                                                        scheme.scheme_id
                                                      ) === scheme_id &&
                                                      String(scheme.id) ===
                                                        cycle_id
                                                  );
                                                });

                                              const total =
                                                selectedSchemeDetails.reduce(
                                                  (sum, scheme) => {
                                                    return (
                                                      sum +
                                                      (scheme?.price
                                                        ? parseFloat(
                                                            scheme.price
                                                          )
                                                        : 0)
                                                    );
                                                  },
                                                  0
                                                );

                                              if (
                                                values.priceBeforeDiscount !==
                                                total.toFixed(2)
                                              ) {
                                                setFieldValue(
                                                  "priceBeforeDiscount",
                                                  total.toFixed(2)
                                                );
                                                setFieldValue(
                                                  "price",
                                                  total.toFixed(2)
                                                ); // Optional: update final payable
                                              }
                                            }
                                          })()} */}
                                          <Row>
                                            {/* <Col md="6">
                                              <Label>Participant Name</Label>
                                              <Field
                                                name="participant_name"
                                                className="form-control"
                                              />
                                            </Col> */}
                                            <Row>
                                              <Col>
                                                <Label>Scheme</Label>
                                                <Select
                                                  name="scheme"
                                                  isMulti
                                                  options={schemeOptions}
                                                  placeholder={
                                                    this.state.selectedRow?.scheme_names?.join(
                                                      ", "
                                                    ) || "Select schemes"
                                                  }
                                                  value={schemeOptions.filter(
                                                    (option) =>
                                                      (
                                                        values.scheme || []
                                                      ).includes(option.value)
                                                  )}
                                                  onChange={(
                                                    selectedOptions
                                                  ) => {
                                                    const selectedValues =
                                                      selectedOptions
                                                        ? selectedOptions.map(
                                                            (option) =>
                                                              option.value
                                                          )
                                                        : [];
                                                    setFieldValue(
                                                      "scheme",
                                                      selectedValues
                                                    );

                                                    // ✅ Calculate total price from all selected schemes
                                                    const total =
                                                      selectedOptions.reduce(
                                                        (sum, option) => {
                                                          const raw =
                                                            option.price || 0;
                                                          const num =
                                                            parseFloat(
                                                              raw
                                                                .toString()
                                                                .replace(
                                                                  /,/g,
                                                                  ""
                                                                )
                                                            );
                                                          return (
                                                            sum +
                                                            (isNaN(num)
                                                              ? 0
                                                              : num)
                                                          );
                                                        },
                                                        0
                                                      );

                                                    // ✅ Update total in the form
                                                    setFieldValue(
                                                      "price",
                                                      total.toFixed(2)
                                                    );
                                                    setFieldValue(
                                                      "price",
                                                      total.toFixed(2)
                                                    ); // optional
                                                  }}
                                                />
                                              </Col>
                                            </Row>
                                            <Col>
                                              <div className="mb-3">
                                                <Label
                                                  htmlFor="price"
                                                  className="form-label"
                                                >
                                                  Payable
                                                </Label>
                                                <Field name="price">
                                                  {({ field }) => {
                                                    const value = Number(
                                                      values.price || 0
                                                    );
                                                    console.log(
                                                      "💰 price raw:",
                                                      value
                                                    );
                                                    return (
                                                      <input
                                                        {...field}
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                          typeof value ===
                                                          "number"
                                                            ? value.toLocaleString(
                                                                "en-PK"
                                                              )
                                                            : value
                                                        }
                                                        readOnly
                                                        style={{
                                                          backgroundColor:
                                                            "#e9ecef",
                                                        }}
                                                      />
                                                    );
                                                  }}
                                                </Field>

                                                <ErrorMessage
                                                  name="priceBeforeDiscount"
                                                  component="div"
                                                  className="invalid-feedback"
                                                />
                                              </div>
                                            </Col>
                                          </Row>

                                          <Row className="mt-3">
                                            {/* <Col md="6">
                                              <Label>Membership Status</Label>
                                              <Field
                                                name="membership_status"
                                                className="form-control"
                                              />
                                            </Col> */}
                                            <Col md={6}>
                                              <Label>Discount in (%)</Label>
                                              <Field name="discount">
                                                {({ field }) => (
                                                  <input
                                                    {...field}
                                                    type="text"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                      const discountPercent =
                                                        parseFloat(
                                                          e.target.value
                                                        );
                                                      setFieldValue(
                                                        "discount",
                                                        e.target.value
                                                      );

                                                      const payable =
                                                        parseFloat(
                                                          values.priceBeforeDiscount
                                                        ) || 0;
                                                      if (
                                                        !isNaN(discountPercent)
                                                      ) {
                                                        const discountAmount =
                                                          (payable *
                                                            discountPercent) /
                                                          100;
                                                        setFieldValue(
                                                          "discountAmount",
                                                          discountAmount.toFixed(
                                                            2
                                                          )
                                                        );
                                                        const tax =
                                                          parseFloat(
                                                            values.taxDeduction
                                                          ) || 0;
                                                        const finalPrice =
                                                          payable -
                                                          discountAmount -
                                                          tax;
                                                        setFieldValue(
                                                          "price",
                                                          finalPrice.toFixed(2)
                                                        );
                                                      }
                                                    }}
                                                  />
                                                )}
                                              </Field>
                                              <ErrorMessage
                                                name="discount"
                                                component="div"
                                                className="invalid-feedback"
                                              />
                                            </Col>
                                            <Col md={6}>
                                              <Label>
                                                Discount Amount (Rs)
                                              </Label>
                                              <Field name="discountAmount">
                                                {({ field }) => (
                                                  <input
                                                    {...field}
                                                    type="text"
                                                    className="form-control"
                                                    value={field.value || ""} // Ensures controlled input
                                                    onChange={(e) => {
                                                      const discountAmount =
                                                        parseFloat(
                                                          e.target.value
                                                        );
                                                      setFieldValue(
                                                        "discountAmount",
                                                        e.target.value
                                                      );

                                                      const payable =
                                                        parseFloat(
                                                          values.priceBeforeDiscount
                                                        ) || 0;
                                                      if (
                                                        !isNaN(
                                                          discountAmount
                                                        ) &&
                                                        payable > 0
                                                      ) {
                                                        const percent =
                                                          (discountAmount /
                                                            payable) *
                                                          100;
                                                        setFieldValue(
                                                          "discount",
                                                          percent.toFixed(2)
                                                        );
                                                        const tax =
                                                          parseFloat(
                                                            values.taxDeduction
                                                          ) || 0;
                                                        const finalPrice =
                                                          payable -
                                                          discountAmount -
                                                          tax;
                                                        setFieldValue(
                                                          "price",
                                                          finalPrice.toFixed(2)
                                                        );
                                                      }
                                                    }}
                                                  />
                                                )}
                                              </Field>

                                              <ErrorMessage
                                                name="discountAmount"
                                                component="div"
                                                className="invalid-feedback"
                                              />
                                            </Col>
                                            <Row>
                                              <Col>
                                                <Label>
                                                  Tax Deduction Amount
                                                </Label>
                                                <Field name="taxDeduction">
                                                  {({ field }) => (
                                                    <input
                                                      {...field}
                                                      type="text"
                                                      className="form-control"
                                                      placeholder="Enter tax deduction amount"
                                                      onChange={(e) => {
                                                        const tax = parseFloat(
                                                          e.target.value
                                                        );
                                                        setFieldValue(
                                                          "taxDeduction",
                                                          e.target.value
                                                        );

                                                        const payable =
                                                          parseFloat(
                                                            values.priceBeforeDiscount
                                                          ) || 0;
                                                        const discount =
                                                          parseFloat(
                                                            values.discountAmount
                                                          ) || 0;
                                                        if (!isNaN(tax)) {
                                                          const finalPrice =
                                                            payable -
                                                            discount -
                                                            tax;
                                                          setFieldValue(
                                                            "price",
                                                            finalPrice.toFixed(
                                                              2
                                                            )
                                                          );
                                                        }
                                                      }}
                                                    />
                                                  )}
                                                </Field>
                                                <ErrorMessage
                                                  name="taxDeduction"
                                                  component="div"
                                                  className="invalid-feedback"
                                                />
                                              </Col>
                                              <Row>
                                                <Col>
                                                  <Label>Payment Status</Label>
                                                  <Select
                                                    name="payment_status"
                                                    options={[
                                                      {
                                                        value: "Paid",
                                                        label: "Paid",
                                                      },
                                                      {
                                                        value:
                                                          "Payment In process",
                                                        label:
                                                          "Payment In process",
                                                      },
                                                    ]}
                                                    onChange={(
                                                      selectedOption
                                                    ) => {
                                                      const status =
                                                        selectedOption?.value ||
                                                        "";
                                                      setFieldValue(
                                                        "payment_status",
                                                        status
                                                      );

                                                      if (
                                                        status === "Paid" ||
                                                        status ===
                                                          "Payment In process"
                                                      ) {
                                                        setFieldValue(
                                                          "is_active",
                                                          true
                                                        );
                                                      }
                                                    }}
                                                    value={
                                                      values.payment_status
                                                        ? {
                                                            value:
                                                              values.payment_status,
                                                            label:
                                                              values.payment_status,
                                                          }
                                                        : null
                                                    }
                                                    placeholder="Select"
                                                    className={
                                                      errors.payment_status &&
                                                      touched.payment_status
                                                        ? "is-invalid"
                                                        : ""
                                                    }
                                                  />
                                                  <ErrorMessage
                                                    name="payment_status"
                                                    component="div"
                                                    className="invalid-feedback"
                                                  />
                                                </Col>
                                                {values.payment_status ===
                                                  "Payment In process" && (
                                                  <div className="form-group">
                                                    <label>
                                                      Upload Copy of Purchase
                                                      Order
                                                    </label>
                                                    <input
                                                      type="file"
                                                      name="purchase_order_copy"
                                                      onChange={(event) =>
                                                        setFieldValue(
                                                          "purchase_order_copy",
                                                          event.currentTarget
                                                            .files[0]
                                                        )
                                                      }
                                                      className="form-control"
                                                    />
                                                    {errors.purchase_order_copy &&
                                                      touched.purchase_order_copy && (
                                                        <div className="text-danger">
                                                          {
                                                            errors.purchase_order_copy
                                                          }
                                                        </div>
                                                      )}
                                                  </div>
                                                )}
                                              </Row>
                                              {values.payment_status ===
                                                "Paid" && (
                                                <>
                                                  <Row>
                                                    <Col>
                                                      <div className="mb-3">
                                                        <Label
                                                          htmlFor="price"
                                                          className="form-label"
                                                        >
                                                          Payable after Discount
                                                          & Tax Deduction
                                                        </Label>
                                                        <Field name="price">
                                                          {({ field }) => (
                                                            <input
                                                              {...field}
                                                              type="text"
                                                              className="form-control"
                                                              value={new Intl.NumberFormat(
                                                                "en-PK",
                                                                {
                                                                  style:
                                                                    "currency",
                                                                  currency:
                                                                    "PKR",
                                                                }
                                                              ).format(
                                                                values.price ||
                                                                  0
                                                              )}
                                                              readOnly
                                                              style={{
                                                                backgroundColor:
                                                                  "#e9ecef",
                                                              }}
                                                            />
                                                          )}
                                                        </Field>
                                                        <ErrorMessage
                                                          name="price"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </div>
                                                    </Col>
                                                  </Row>

                                                  <Col>
                                                    <Label>
                                                      Payment Settlement
                                                    </Label>
                                                    <Select
                                                      name="payment_settlement"
                                                      options={[
                                                        {
                                                          value: "Full",
                                                          label: "Full",
                                                        },
                                                        {
                                                          value: "Part",
                                                          label: "Part",
                                                        },
                                                      ]}
                                                      onChange={(
                                                        selectedOption
                                                      ) => {
                                                        const settlement =
                                                          selectedOption?.value ||
                                                          "";
                                                        setFieldValue(
                                                          "payment_settlement",
                                                          settlement
                                                        );
                                                        if (
                                                          settlement ===
                                                            "Full" ||
                                                          settlement === "Part"
                                                        ) {
                                                          setFieldValue(
                                                            "is_active",
                                                            true
                                                          );
                                                        }
                                                      }}
                                                      value={
                                                        values.payment_settlement
                                                          ? {
                                                              value:
                                                                values.payment_settlement,
                                                              label:
                                                                values.payment_settlement,
                                                            }
                                                          : null
                                                      }
                                                      placeholder="Select"
                                                      className={
                                                        errors.payment_settlement &&
                                                        touched.payment_settlement
                                                          ? "is-invalid"
                                                          : ""
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="payment_settlement"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>

                                                  {values.payment_settlement ===
                                                    "Part" && (
                                                    <>
                                                      <Col className="mt-3">
                                                        <Label>
                                                          Part Payment Amount
                                                        </Label>
                                                        <Field name="part_payment_amount">
                                                          {({ field }) => (
                                                            <input
                                                              {...field}
                                                              type="number"
                                                              className={
                                                                errors.part_payment_amount &&
                                                                touched.part_payment_amount
                                                                  ? "form-control is-invalid"
                                                                  : "form-control"
                                                              }
                                                              value={
                                                                field.value ===
                                                                  undefined ||
                                                                field.value ===
                                                                  null
                                                                  ? ""
                                                                  : field.value
                                                              }
                                                              onChange={(e) => {
                                                                const partAmount =
                                                                  parseFloat(
                                                                    e.target
                                                                      .value
                                                                  ) || 0;
                                                                const totalAmount =
                                                                  parseFloat(
                                                                    values.price
                                                                  ) || 0;
                                                                const remaining =
                                                                  totalAmount -
                                                                  partAmount;
                                                                setFieldValue(
                                                                  "part_payment_amount",
                                                                  e.target.value
                                                                );
                                                                setFieldValue(
                                                                  "remaining_amount",
                                                                  remaining >= 0
                                                                    ? remaining
                                                                    : 0
                                                                );
                                                              }}
                                                            />
                                                          )}
                                                        </Field>
                                                        <ErrorMessage
                                                          name="part_payment_amount"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </Col>

                                                      <Col className="mt-3">
                                                        <Label>
                                                          Remaining Amount
                                                        </Label>
                                                        <Field
                                                          name="remaining_amount"
                                                          type="number"
                                                          disabled
                                                          className="form-control"
                                                        />
                                                      </Col>
                                                    </>
                                                  )}
                                                  <Row>
                                                    <Col>
                                                      <Label>Pay Date</Label>
                                                      <Field
                                                        name="paydate"
                                                        type="date"
                                                        className="form-control"
                                                      />
                                                      <ErrorMessage
                                                        name="paydate"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </Col>
                                                  </Row>

                                                  <Row>
                                                    <Col>
                                                      <Label>Pay Copy</Label>
                                                      <Input
                                                        id="formFile"
                                                        name="photo"
                                                        type="file"
                                                        multiple={false}
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                        onChange={(event) =>
                                                          this.handleFileChange(
                                                            event,
                                                            setFieldValue
                                                          )
                                                        }
                                                        className={
                                                          "form-control" +
                                                          (errors.photo &&
                                                          touched.photo
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                      />
                                                      <small
                                                        style={{
                                                          color: "#007bff",
                                                        }}
                                                      >
                                                        Only JPEG, PNG, or PDF
                                                        files up to 2MB in size
                                                        are allowed.
                                                      </small>
                                                      <ErrorMessage
                                                        name="photo"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </Col>
                                                  </Row>

                                                  <Row>
                                                    <Col>
                                                      <Label>
                                                        Payment Method
                                                      </Label>
                                                      <Select
                                                        name="paymentmethod"
                                                        options={[
                                                          {
                                                            value: "Online",
                                                            label: "Online",
                                                          },
                                                          {
                                                            value: "Cheque",
                                                            label: "Cheque",
                                                          },
                                                          {
                                                            value: "Cash",
                                                            label: "Cash",
                                                          },
                                                        ]}
                                                        onChange={(
                                                          selectedOption
                                                        ) =>
                                                          setFieldValue(
                                                            "paymentmethod",
                                                            selectedOption?.value ||
                                                              ""
                                                          )
                                                        }
                                                        value={
                                                          values.paymentmethod
                                                            ? {
                                                                value:
                                                                  values.paymentmethod,
                                                                label:
                                                                  values.paymentmethod,
                                                              }
                                                            : null
                                                        }
                                                        className={
                                                          errors.paymentmethod &&
                                                          touched.paymentmethod
                                                            ? "is-invalid"
                                                            : ""
                                                        }
                                                      />
                                                      <ErrorMessage
                                                        name="paymentmethod"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </Col>
                                                  </Row>

                                                  <Row>
                                                    <Col>
                                                      <Label>Received By</Label>
                                                      <Field
                                                        name="receivedby"
                                                        type="text"
                                                        className="form-control"
                                                      />
                                                      <ErrorMessage
                                                        name="receivedby"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </Col>
                                                  </Row>
                                                </>
                                              )}
                                            </Row>
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
  onGetParticipantpayment: PropTypes.func,
  ongetcyclelist: PropTypes.func,
  match: PropTypes.object,
  onupdatePayment: PropTypes.func,
  ListDistrict: PropTypes.array,
  onGetDistrictList: PropTypes.func,
};

const mapStateToProps = (state) => {
  const cycleList = state.CycleList?.CycleList || [];
  const ListDistrict = state.ListDistrict?.ListDistrict || [];

  console.log("CycleList:", cycleList);
  console.log("ListDistrict:", ListDistrict);

  return {
    userID: state.Account?.userID || null,
    CycleList: cycleList,
    PaymentSchemeList: state.PaymentScheme?.PaymentSchemeList || [],
    GetPayment: state.AddPayment?.GetPayment ?? [],
    ListDistrict, // ✅ Now correctly passing the declared ListDistrict
  };
};

const mapDispatchToProps = (dispatch) => ({
  //  onGetParticipantpayment: () => dispatch(getParticipantPayment()),
  onGetParticipantpayment: (id) => dispatch(getParticipantPayment(id)),
  ongetcyclelist: (id) => dispatch(getcyclelist(id)),
  onupdatePayment: (payload) => dispatch(updatePayment(payload)),
  onGetDistrictList: (id) => dispatch(getdistrictlist(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParticipantPayments);
