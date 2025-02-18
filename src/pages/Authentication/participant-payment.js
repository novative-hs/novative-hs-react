import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
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
          text: "ID",
          dataField: "id",
          sort: true,
          headerFormatter: column => (
            <div>
              <Label className="form-label">{column.text}</Label>
              <input
                type="text"
                value={this.state.idFilter}
                onChange={e => this.handleFilterChange("idFilter", e)}
                className="form-control"
              />
            </div>
          ),
          headerStyle: { width: "100px" },
        },
        {
          dataField: "participant_name",
          text: "Participant Name",
          sort: true,
          headerFormatter: column => (
            <div>
              <Label className="form-label">{column.text}</Label>
              <input
                type="text"
                value={this.state.nameFilter}
                onChange={e => this.handleFilterChange("nameFilter", e)}
                className="form-control"
              />
            </div>
          ),
        },
        {
          dataField: "district",
          text: "District",
          sort: true,
          headerFormatter: column => (
            <div>
              <Label className="form-label">{column.text}</Label>
              <input
                type="text"
                value={this.state.districtFilter}
                onChange={e => this.handleFilterChange("districtFilter", e)}
                className="form-control"
              />
            </div>
          ),
        },
        {
          dataField: "scheme_name",
          text: "Number of Schemes",
          sort: true,
          headerFormatter: column => (
            <div>
              <Label className="form-label">{column.text}</Label>
              <input
                type="text"
                value={this.state.schemeFilter}
                onChange={e => this.handleFilterChange("schemeFilter", e)}
                className="form-control"
              />
            </div>
          ),
        },
        {
          dataField: "price",
          text: "Amount Payment",
          sort: true,
          headerFormatter: column => (
            <div>
              <Label className="form-label">{column.text}</Label>
              <input
                type="text"
                value={this.state.amountFilter}
                onChange={e => this.handleFilterChange("amountFilter", e)}
                className="form-control"
              />
            </div>
          ),
        },
        {
          dataField: "discount",
          text: "Amount of Discount",
          sort: true,
          headerFormatter: column => (
            <div>
              <Label className="form-label">{column.text}</Label>
              <input
                type="text"
                value={this.state.discountFilter}
                onChange={e => this.handleFilterChange("discountFilter", e)}
                className="form-control"
              />
            </div>
          ),
        },
        {
          dataField: "paymentmethod",
          text: "Mode of Payment",
          sort: true,
          headerFormatter: column => (
            <div>
              <Label className="form-label">{column.text}</Label>
              <input
                type="text"
                value={this.state.paymentmodeFilter}
                onChange={e =>
                  this.handleFilterChange("paymentmodeFilter", e)
                }
                className="form-control"
              />
            </div>
          ),
        },
        {
          dataField: "paydate",
          text: "Date of Payment",
          sort: true,
          headerFormatter: column => (
            <div>
              <Label className="form-label">{column.text}</Label>
              <input
                type="text"
                value={this.state.dateFilter}
                onChange={e => this.handleFilterChange("dateFilter", e)}
                className="form-control"
              />
            </div>
          ),
        },
        {
          dataField: "receivedby",
          text: "Payment Received by",
          sort: true,
          headerFormatter: column => (
            <div>
              <Label className="form-label">{column.text}</Label>
              <input
                type="text"
                value={this.state.paymentreceivedFilter}
                onChange={e =>
                  this.handleFilterChange("paymentreceivedFilter", e)
                }
                className="form-control"
              />
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
      console.log("Updated GetPayment:", this.props.GetPayment); // Check API response
      const transformedData = (this.props.GetPayment || []).map((payment, index) => ({
        id: payment.id,
        participant_name: payment.participant_name, // Ensure this is the correct field from API
        district: payment.district, // Ensure this is the correct field from API
        scheme_name: payment.scheme_name, // Ensure this is the correct field from API
        price: payment.price,
        discount: payment.discount,
        paymentmethod: payment.paymentmethod,
        paydate: payment.paydate,
        photo: payment.photo, // Ensure the photo field is mapped
        receivedby: payment.receivedby,
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
        entry.receivedby.toLowerCase().includes(paymentreceivedFilter.toLowerCase())
    );
  };

  render() {
    const { GetPayment } = this.state;
    const defaultSorted = [{ dataField: "id", order: "desc" }];

    const pageOptions = {
      sizePerPage: 10,
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
            <Breadcrumbs title="Labs" breadcrumbItem="Participant" />
            <Row className="justify-content-center align-item-center">
              <Col lg="10">
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
