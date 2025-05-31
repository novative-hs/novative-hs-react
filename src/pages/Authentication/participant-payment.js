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
      settlementFilter: "",
      paymentamountFilter: "",
      schemeModalOpen: false,
      amountFilter: "",
      discountFilter: "",
      priceFilter: "",
      schemepriceFilter: "",
      hoveredSchemeNames: [],
      TaxFilter: "",
      statusFilter: "",
      remainingamountFilter: "",
      hoveredSchemeNames: [],
      paymentmodeFilter: "",
      dateFilter: "",
      paymentreceivedFilter: "",
      selectedCheckboxes: {},
      tableKey: 0,
      GetPayment: [],
      feedbackMessage: "",
      errorMessage: "",
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
            const num = parseFloat(cell);
            if (isNaN(num)) return cell;

            // Show decimals only if necessary
            return num % 1 === 0
              ? num.toLocaleString()
              : num.toLocaleString(undefined, {
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
          formatter: cell => {
            const num = parseFloat(cell);
            return cell === null ||
              cell === undefined ||
              isNaN(num) ||
              num === 0
              ? "--"
              : num.toLocaleString();
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
          text: "Final Price",
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
                  value={this.state.priceFilter}
                  onChange={e => this.handleFilterChange("priceFilter", e)}
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
                  value={this.state.settlementFilter}
                  onChange={e => this.handleFilterChange("settlementFilter", e)}
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
                  value={this.state.statusFilter}
                  onChange={e => this.handleFilterChange("statusFilter", e)}
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
          formatter: (cell, row) => {
            const amount =
              row.payment_settlement === "Full"
                ? row.price
                : row.part_payment_amount;

            // Ensure value is treated as a number, fallback to 0 if invalid
            const numericValue = parseFloat(amount) || 0;

            // Format with commas
            return new Intl.NumberFormat().format(numericValue);
          },
          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.paymentamountFilter}
                  onChange={e =>
                    this.handleFilterChange("paymentamountFilter", e)
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
          formatter: cell =>
            cell === null || cell === undefined || parseFloat(cell) === 0
              ? "--"
              : Number(cell).toLocaleString(),
          headerFormatter: (column, colIndex) => (
            <div style={{ textAlign: "center" }}>
              <div>{column.text}</div>
              <div style={{ marginTop: "5px" }}>
                <input
                  type="text"
                  value={this.state.remainingamountFilter}
                  onChange={e =>
                    this.handleFilterChange("remainingamountFilter", e)
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
                    value={this.state.paymentmodeFilter}
                    onChange={e =>
                      this.handleFilterChange("paymentmodeFilter", e)
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
            </div>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    const { onGetParticipantpayment } = this.props;
    console.log("Component Mounted");

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
      nameFilter,
      idFilter,
      districtFilter,
      schemeFilter,
      schemepriceFilter,
      amountFilter,
      discountFilter,
      TaxFilter,
      paymentamountFilter,
      paymentmodeFilter,
      remainingamountFilter,
      statusFilter,
      priceFilter,
      settlementFilter,
      dateFilter,
      paymentreceivedFilter,
      membershipStatusFilter,
    } = this.state;

    const safeString = val =>
      val !== undefined && val !== null ? String(val).toLowerCase() : "";

    return GetPayment.filter(
      entry =>
        safeString(entry.id).includes(idFilter.toLowerCase()) &&
        safeString(entry.participant_name).includes(nameFilter.toLowerCase()) &&
        safeString(entry.district).includes(districtFilter.toLowerCase()) &&
        safeString(entry.scheme_count).includes(schemeFilter.toLowerCase()) &&
        safeString(entry.price).includes(priceFilter.toLowerCase()) &&
        safeString(entry.priceBeforeDiscount).includes(
          schemepriceFilter.toLowerCase()
        ) &&
        safeString(entry.price).includes(amountFilter.toLowerCase()) &&
        safeString(entry.discountAmount).includes(
          discountFilter.toLowerCase()
        ) &&
        safeString(entry.taxDeduction).includes(TaxFilter.toLowerCase()) &&
        safeString(entry.payment_settlement).includes(
          settlementFilter.toLowerCase()
        ) &&
        safeString(entry.paymentmethod).includes(
          paymentmodeFilter.toLowerCase()
        ) &&
        safeString(entry.payment_status).includes(statusFilter.toLowerCase()) &&
        safeString(entry.part_payment_amount).includes(
          paymentamountFilter.toLowerCase()
        ) &&
        safeString(entry.remaining_amount).includes(
          remainingamountFilter.toLowerCase()
        ) &&
        safeString(entry.paydate).includes(dateFilter.toLowerCase()) &&
        safeString(entry.receivedby).includes(
          paymentreceivedFilter.toLowerCase()
        ) &&
        safeString(entry.membership_status).includes(
          (membershipStatusFilter || "").toLowerCase()
        )
    );
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
