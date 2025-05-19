import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
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
      amountFilter: "",
      discountFilter: "",
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
  // filter: textFilter(),
  headerFormatter: (column, colIndex) => {
    return (
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
    );
  },
}
,
  {
    dataField: "participant_name",
    text: "Participant Name",
    sort: true,
    style: { textAlign: "left" },
    headerFormatter: (column, colIndex) => {
      return (
        <div style={{ textAlign: "center" }}>
          <div>{column.text}</div>
          <div style={{ marginTop: "5px" }}>
            <input
              type="text"
              value={this.state.roundsFilter}
              onChange={(e) => this.handleFilterChange("roundsFilter", e)}
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
    }
  },
  {
  dataField: "membership_status",
  text: "Membership Status",
  sort: true,
  headerFormatter: (column, colIndex) => (
    <div style={{ textAlign: "center" }}>
      <div>{column.text}</div>
      <div style={{ marginTop: "5px" }}>
        <input
          type="text"
          value={this.state.roundsFilter}
          onChange={(e) => this.handleFilterChange("roundsFilter", e)}
          className="form-control"
          style={{ textAlign: "center", width: "100px", margin: "auto" }}
        />
      </div>
    </div>
  )
}

,
  {
    dataField: "district",
    text: "District",
    sort: true,
    headerFormatter: (column, colIndex) => {
      return (
        <div style={{ textAlign: "center" }}>
          <div>{column.text}</div>
          <div style={{ marginTop: "5px" }}>
            <input
              type="text"
              value={this.state.roundsFilter}
              onChange={(e) => this.handleFilterChange("roundsFilter", e)}
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
    }
  },
  {
    dataField: "scheme_count",
    text: "Scheme",
    sort: true,
    formatter: (cell, row) => (
      <Link
      to={`/payment-scheme-list/${row.id}`}
      style={{ textDecoration: "underline", color: "#0000CD" }}
      onClick={() => console.log(`Navigating to payment-scheme-list with ID: ${row.id}`)}
    >
      {cell}
    </Link>
    ),
    headerFormatter: (column, colIndex) => {
      return (
        <div style={{ textAlign: "center" }}>
          <div>{column.text}</div>
          <div style={{ marginTop: "5px" }}>
            <input
              type="text"
              value={this.state.roundsFilter}
              onChange={(e) => this.handleFilterChange("roundsFilter", e)}
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
    }
  },
  
  {
  dataField: "price",
  text: "Paid Amount",
  sort: true,
   style: { textAlign: "right" }, 
  formatter: (cell) => Number(cell).toLocaleString(),  // ✅ Add this line
  headerFormatter: (column, colIndex) => {
    return (
      <div style={{ textAlign: "center" }}>
        <div>{column.text}</div>
        <div style={{ marginTop: "5px" }}>
          <input
            type="text"
            value={this.state.roundsFilter}
            onChange={(e) => this.handleFilterChange("roundsFilter", e)}
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
  }
}
,
  {
    dataField: "discount",
    text: "% Discount",
    sort: true,
    headerFormatter: (column, colIndex) => {
      return (
        <div style={{ textAlign: "center" }}>
          <div>{column.text}</div>
          <div style={{ marginTop: "5px" }}>
            <input
              type="text"
              value={this.state.roundsFilter}
              onChange={(e) => this.handleFilterChange("roundsFilter", e)}
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
    }
  },
  {
    dataField: "paymentmethod",
    text: "Payment Mode",
    sort: true,
    headerFormatter: (column, colIndex) => {
      return (
        <div style={{ textAlign: "center" }}>
          <div>{column.text}</div>
          <div style={{ marginTop: "5px" }}>
            <input
              type="text"
              value={this.state.roundsFilter}
              onChange={(e) => this.handleFilterChange("roundsFilter", e)}
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
    }
  },
   {
  dataField: "paydate",
  text: "Payment Date",
  sort: true,
  formatter: (cell) => {
    const date = new Date(cell);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // month is 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  },
  headerFormatter: (column, colIndex) => {
    return (
      <div style={{ textAlign: "center" }}>
        <div>{column.text}</div>
        <div style={{ marginTop: "5px" }}>
          <input
            type="text"
            value={this.state.roundsFilter}
            onChange={(e) => this.handleFilterChange("roundsFilter", e)}
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
  }
}
,
  {
    dataField: "receivedby",
    text: "Payment Received by",
    sort: true,
    headerFormatter: (column, colIndex) => {
      return (
        <div style={{ textAlign: "center" }}>
          <div>{column.text}</div>
          <div style={{ marginTop: "5px" }}>
            <input
              type="text"
              value={this.state.roundsFilter}
              onChange={(e) => this.handleFilterChange("roundsFilter", e)}
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
    }
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
    const transformedData = (this.props.GetPayment || []).map((payment) => ({
      id: payment.id,
      participant_name: payment.participant_name,
      district: payment.district,
      scheme_count: payment.scheme_count, // Display count of schemes
      price: payment.price,
      discount: payment.discount,
      paymentmethod: payment.paymentmethod,
      paydate: payment.paydate,
      photo: payment.photo,
      receivedby: payment.receivedby,
      membership_status: payment.membership_status, // ✅ include this
    }));
    this.setState({
      GetPayment: transformedData,
    });
  }
}

  

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
      amountFilter,
      discountFilter,
      paymentmodeFilter,
      dateFilter,
      paymentreceivedFilter,
      membershipFilter, // ← Add this
    } = this.state;

    return GetPayment.filter(
      entry =>
        entry.id.toString().includes(idFilter) &&
        entry.participant_name.toLowerCase().includes(nameFilter.toLowerCase()) &&
        entry.district.toLowerCase().includes(districtFilter.toLowerCase()) &&
        entry.scheme_name.toLowerCase().includes(schemeFilter.toLowerCase()) &&
        entry.price.toLowerCase().includes(amountFilter.toLowerCase()) &&
        entry.discount.toLowerCase().includes(discountFilter.toLowerCase()) &&
        entry.paymentmethod.toLowerCase().includes(paymentmodeFilter.toLowerCase()) &&
        entry.paydate.toLowerCase().includes(dateFilter.toLowerCase()) &&
        entry.receivedby.toLowerCase().includes(paymentreceivedFilter.toLowerCase())&&
        entry.membership_status?.toLowerCase().includes(membershipFilter.toLowerCase()) // new condition
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
            <Breadcrumbs title="Labs" breadcrumbItem="Participant-Payment Record" />
            <Row className="justify-content-center align-item-center">
              <Col lg="10">        <p>
              
                 <strong>Note:</strong> Click on Scheme Number to get detail of each participants payments
                </p>
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={this.state.GetPayment}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={this.state.GetPayment}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
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