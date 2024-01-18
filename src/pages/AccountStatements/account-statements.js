import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Card, CardBody, Col, Table, Container, Row } from "reactstrap";
import { isEmpty, map } from "lodash";
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getAccountStatements } from "store/account-statements/actions";

import "assets/scss/table.scss";

class AccountStatements extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      accountStatements: [],
      accountStatement: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      account_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
      startDate: null,
      endDate: null,
    };
    this.toggle = this.toggle.bind(this);
  }
  fetchData = () => {
    if (this.state.user_id) {
      const { onGetAccountStatements } = this.props;
      const userId =
        this.state.account_type === "labowner"
          ? this.state.user_id
          : this.props.match.params.id;

      // Only make the API call if both start and end dates are selected
      if (this.state.startDate && this.state.endDate) {
        onGetAccountStatements(userId);
      }
    }
  };

  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps, prevState) {
    // Check if either startDate or endDate has changed
    if (
      prevState.startDate !== this.state.startDate ||
      prevState.endDate !== this.state.endDate
    ) {
      this.fetchData();
    }
  }
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  onPaginationPageChange = page => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.props.pagination.options.onPageChange(page);
    }
  };

  render() {
    const { SearchBar } = Search;
    const { accountStatements } = this.props;
    const { startDate, endDate } = this.state;

    // Filter data based on selected dates
    const filteredStatements = accountStatements.filter((statement) => {
      const orderedAt = moment(statement.ordered_at);
      return (
        (!startDate || orderedAt.isSameOrAfter(startDate)) &&
        (!endDate || orderedAt.isSameOrBefore(endDate))
      );
    });

    const pageOptions = {
      sizePerPage: 10,
      totalSize: accountStatements.length, // replace later with size(accountStatements),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];
    const thStyle = {
      border: '1px solid white',
      textAlign: 'center',
      verticalAlign: 'middle',
    };

    // var total_testby_labhazir = this.props.accountStatements.total_testby_labhazir
    // // var authenticated = "{{total_testby_labhazir}}"
    // console.log(total_testby_labhazir)

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Account Statements | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Lab" breadcrumbItem="Account Statements" />
            <Row>
              <Col lg="3">
                <div className="mb-3">
                  <label className="form-label">Start Date:</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => this.setState({ startDate: date })}
                    className="form-control"
                  />
                </div></Col>
              <Col lg="3">
                <div className="mb-3">
                  <label className="form-label">End Date:</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => this.setState({ endDate: date })}
                    className="form-control"
                  />
                </div>

              </Col>
            </Row>
            <Row>
              <div>
                <div>
                  <strong className="text-primary">Credit:</strong> Amount that Lab has to pay LabHazir. <br></br>
                  <strong className="text-primary">Debit: </strong>  Amount that Lab will receive from LabHazir.
                </div>
                <div> <span className="font-size-12">
                  <strong className="text-danger ">
                    Note:</strong> If Balance is positive value that means Lab will pay the same amount to LabHazir and if Balance is negative that means Lab will receive the same amount from Lab Hazir.

                </span>
                </div>
                <div>
                  <span className="font-size-12">
                    <strong><span className="text-danger">Margin of Lab  </span></strong> <span>= Total without Discount - (LH Referral fee) - (Discount by Lab) - (Counter Discount by Lab) + (Home Sampling Amount)</span>
                  </span>
                </div>
                <div>
                  <span className="font-size-12">
                    <strong><span className="text-danger">Referral Fee of Lab Hazir </span></strong> <span>= Decided Percentage referral free of Total without Discount - (Discount by Lab Hazir)</span>
                  </span>
                </div>

              </div>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div className="table-responsive">
                      <Table>
                        <thead style={{ position: 'flex' }} className="table-dark" >
                          <tr>
                            <th style={thStyle} scope="col">Date</th>
                            <th style={thStyle} scope="col">ID</th>
                            <th style={thStyle} scope="col">Patient Name</th>
                            <th style={thStyle} scope="col">Status</th>
                            <th style={thStyle} scope="col">Total Without Discount</th>
                            <th style={thStyle} scope="col">Home Sampling Amount</th>
                            <th style={thStyle} scope="col">Discount By Lab</th>
                            <th style={thStyle} scope="col">Counter Discount By Lab</th>
                            <th style={thStyle} scope="col">Discount By LabHazir</th>
                            <th style={thStyle} scope="col">Payable After Discount</th>
                            <th style={thStyle} scope="col">Payment Received By</th>
                            <th style={thStyle} scope="col">Margin of Lab</th>
                            <th style={thStyle} scope="col">Referrel Fee of LabHazir</th>
                            {/* <th scope="col">Payment Received By LabHazir</th> */}
                            {/* <th style={thStyle} scope="col">Credit</th>
                              <th style={thStyle} scope="col">Debit</th> */}
                            <th style={thStyle} scope="col">Balance</th>
                            <th scope="col">Is Settled</th>
                          </tr>
                        </thead>
                        {filteredStatements.length > 0 ? (

                          <tbody style={{ textAlign: "center", verticalAlign: "middle" }}>
                            {filteredStatements.map((accountStatement, i) => (
                              <>
                                {accountStatement.transaction_type == "In" ? (
                                  <tr key={i} className="badge-soft-primary">
                                    <td >
                                      <p className="text-muted mb-0">
                                        {moment(accountStatement.ordered_at).format("DD MMM YYYY")}
                                      </p>
                                    </td>
                                    <td >
                                      <h5 className="font-size-14 text-truncate">
                                        MIF ID: <strong>{accountStatement.order_id}</strong>
                                      </h5>
                                    </td>
                                    <td >
                                      <p className="text-muted mb-0">
                                        {accountStatement.patient_name}
                                      </p>
                                    </td>
                                    {accountStatement.payment_status == "Not Paid" ? (
                                      <td style={{ backgroundColor: '#F58D77' }}>

                                        <b>
                                          {accountStatement.payment_method},{" "}
                                          {accountStatement.payment_status}
                                        </b></td>
                                    ) : (
                                      <td>

                                        <b>
                                          {accountStatement.payment_method},{" "}
                                          {accountStatement.payment_status}
                                        </b>                                      </td>

                                    )}
                                    {/* <td>
                                    <p>
                                      {accountStatement.dues_before_discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </p>
                                  </td> */}
                                    <td>
                                      {accountStatement.dues_before_discount == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.dues_before_discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {accountStatement.dues_before_discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}

                                    </td>

                                    {/* <td>
                                    <p>
                                      {accountStatement.sample_collector_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </p>
                                  </td> */}
                                    <td>
                                      {accountStatement.sample_collector_amount == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.sample_collector_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {accountStatement.sample_collector_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}

                                    </td>
                                    {/* <td>
                                    <p>
                                      {accountStatement.discounted_by_lab.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </p>
                                  </td> */}
                                    <td>
                                      {accountStatement.discounted_by_lab == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.discounted_by_lab.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {accountStatement.discounted_by_lab.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}

                                    </td>
                                    <td>
                                      {accountStatement.lab_counter_discount == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.lab_counter_discount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {accountStatement.lab_counter_discount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}

                                    </td>
                                    {/* <td>
                                    <p>
                                      {accountStatement.discounted_by_labhazir.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </p>
                                  </td> */}
                                    <td>
                                      {accountStatement.tax_amount == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.tax_amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        // <p className="float-end">
                                        // <b>Tax =</b>
                                        //  </p>
                                        null
                                      )}

                                    </td>
                                    {/* <td>
                                    <p>
                                      {accountStatement.dues.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </p>
                                  </td> */}
                                    <td >
                                      {accountStatement.tax_amount == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.tax_amount}
                                        </p>

                                      ) : (
                                        // <p className="float-start">
                                        //  {accountStatement.tax_amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        // </p>
                                        null
                                      )}

                                    </td>

                                    <td>
                                      {accountStatement.after_counterdiscount_lab_share == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.after_counterdiscount_lab_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {accountStatement.after_counterdiscount_lab_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}

                                    </td>

                                    {/* <td>
                                    <p>
                                      {accountStatement.labhazir_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </p>
                                  </td> */}
                                    <td>
                                      {accountStatement.labhazir_share == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.payment_method == "Cash" ? (
                                            <span>
                                              {accountStatement.dues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </span>
                                          ) : (
                                            null
                                          )}                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {accountStatement.payment_method == "Cash" ? (
                                            <span>
                                              {accountStatement.dues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </span>
                                          ) : (
                                            null
                                          )}                                        </p>
                                      )}

                                    </td>
                                    <td>
                                      <p>
                                        {accountStatement.payment_method === "Cash" ? (
                                          <span>
                                            {accountStatement.tax_amount != 0 ? (
                                              <p className="float-end">
                                                {accountStatement.payable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {accountStatement.tax_amount.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}tax
                                              </p>
                                            ) : (
                                              <p className="float-end">
                                                {accountStatement.payable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                              </p>
                                            )}
                                          </span>
                                        ) : (
                                          accountStatement.payment_method === "Donation" ? (
                                            <span>
                                              {accountStatement.payable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </span>
                                          ) : null
                                        )}
                                      </p>
                                    </td>

                                    {/* <td>
                                    <p>
                                      {accountStatement.payment_method == "Cash" ? (
                                        <span>
                                          {accountStatement.dues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </span>
                                      ) : (
                                        null
                                      )}
                                    </p>
                                  </td> */}

                                    {/* <td>
                                      <p className="float-end">
                                        {accountStatement.payment_method == "Card" ? (
                                          <span>
                                            {accountStatement.dues.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </span>
                                        ) : (
                                          null
                                        )}
                                        {accountStatement.payment_method == "Donation" ? (
                                          <span>
                                            {accountStatement.dues.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </span>
                                        ) : (
                                          null
                                        )}
                                      </p>
                                    </td> */}
                                    {/* <td style={{ backgroundColor: '#ffc09f' }}>
                                      <p>
                                        {accountStatement.payment_method == "Cash" ? (
                                          <span>
                                            {accountStatement.payable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </span>
                                        ) : (
                                          null
                                        )}
                                        {accountStatement.payment_method == "Donation" ? (
                                          <span>
                                            {accountStatement.payable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </span>
                                        ) : (
                                          null
                                        )}
                                      </p>
                                    </td> */}
                                    {/* <td style={{ backgroundColor: '#ffee93' }}>
                                      <p>
                                        {accountStatement.payment_method == "Card" ? (
                                          <span>
                                            {accountStatement.tax_amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </span>
                                        ) : (
                                          null
                                        )}
                                        {accountStatement.payment_method == "Donation" ? (
                                          <p className="d-none">
                                            {accountStatement.tax_amount == 0 ? (
                                              <span>
                                                {accountStatement.tax_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                              </span>
                                            ) : (
                                              null
                                            )}                                        </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.tax_amount != 0 ? (
                                              <span>
                                                {accountStatement.tax_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                              </span>
                                            ) : (
                                              null
                                            )}                                        </p>
                                        )}
                                      </p>
                                    </td> */}
                                    <td style={{ backgroundColor: '#adf7b6' }}>
                                      <p className="float-end">
                                        {accountStatement.statement.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </p>
                                    </td>
                                    <td>
                                      {accountStatement.is_settled == true ? (
                                        // <div className="text-success">
                                        //   <i className="mdi mdi-check-circle font-size-18"></i>
                                        // </div>
                                        "--"
                                      ) : (
                                        // <div className="text-danger">
                                        //   <i className="mdi mdi-close-circle font-size-18"></i>
                                        // </div>
                                        "--"
                                      )}
                                    </td>
                                  </tr>
                                ) : accountStatement.transaction_type == "Out" ? (

                                  <tr key={i} className="badge-soft-danger">
                                    <td >
                                      <p className="text-muted mb-0">
                                        {moment(accountStatement.ordered_at).format("DD MMM YYYY")}
                                      </p>
                                    </td>
                                    <td >
                                      <h5 className="font-size-14 text-truncate">
                                        MOF ID: <strong>{accountStatement.order_id}</strong>
                                      </h5>
                                    </td>
                                    <td >
                                      <p className="text-muted mb-0">
                                        {accountStatement.patient_name}
                                      </p>
                                    </td>
                                    {accountStatement.payment_status == "Not Paid" ? (
                                      <td style={{ backgroundColor: '#F58D77' }}>

                                        <b>
                                          {accountStatement.payment_method},{" "}
                                          {accountStatement.payment_status}
                                        </b></td>
                                    ) : (
                                      <td>

                                        <b>
                                          {accountStatement.payment_method},{" "}
                                          {accountStatement.payment_status}
                                        </b>                                      </td>

                                    )}
                                    <td >
                                      {accountStatement.dues_before_discount == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.dues_before_discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {accountStatement.dues_before_discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}

                                    </td>
                                    <td >
                                      {accountStatement.sample_collector_amount == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.sample_collector_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {accountStatement.sample_collector_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}

                                    </td>
                                    <td >
                                      {accountStatement.discounted_by_lab == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.discounted_by_lab.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {accountStatement.discounted_by_lab.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}

                                    </td>
                                    <td >
                                      {accountStatement.lab_counter_discount == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.lab_counter_discount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {accountStatement.lab_counter_discount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}

                                    </td>
                                    <td >
                                      {accountStatement.tax_amount == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.tax_amount}
                                        </p>

                                      ) : (
                                        null
                                      )}

                                    </td>
                                    <td >
                                      {accountStatement.tax_amount == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.tax_amount}
                                        </p>

                                      ) : (
                                        <p className="float-start">
                                          {accountStatement.tax_amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}

                                    </td>

                                    <td>
                                      {/* {accountStatement.after_counterdiscount_lab_share == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.after_counterdiscount_lab_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {accountStatement.after_counterdiscount_lab_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )} */}

                                    </td>
                                    <td>
                                      <p>
                                        {accountStatement.payment_method === "Card" ? (
                                          <span>
                                            {accountStatement.tax_amount !== 0 ? (
                                              <p className="float-end">
                                                {accountStatement.Receivable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {accountStatement.tax_amount.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} tax
                                              </p>
                                            ) : (
                                              <p className="float-end">
                                                {accountStatement.Receivable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                              </p>
                                            )}
                                          </span>
                                        ) : (
                                          accountStatement.payment_method === "Donation" ? (
                                            <span>
                                              {accountStatement.Receivable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </span>
                                          ) : (
                                            accountStatement.payment_method === "Cheque" ? (
                                              <span>
                                                {accountStatement.tax_amount !== 0 ? (
                                                  <p className="float-end">
                                                    {accountStatement.Receivable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - {accountStatement.tax_amount.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} tax
                                                  </p>
                                                ) : (
                                                  <p className="float-end">
                                                    {accountStatement.Receivable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                  </p>
                                                )}
                                              </span>
                                            ) : null
                                          )
                                        )}
                                      </p>
                                    </td>


                                    <td>
                                      {accountStatement.labhazir_share == 0 ? (
                                        <p className="d-none">
                                          {accountStatement.labhazir_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {accountStatement.labhazir_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}

                                    </td>



                                    {/* <td style={{ backgroundColor: '#ffc09f' }}>
                                      <p>
                                        {accountStatement.payment_method == "Cash" ? (
                                          <span>
                                            {accountStatement.payable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </span>
                                        ) : (
                                          null
                                        )}
                                      </p>
                                    </td> */}
                                    {/* <td style={{ backgroundColor: '#ffee93' }}>
                                      <p>
                                        {accountStatement.payment_method == "Card" ? (
                                          <span>
                                            {accountStatement.Receivable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </span>
                                        ) : (
                                          null
                                        )}
                                        {accountStatement.payment_method == "Donation" ? (
                                          <span>
                                            {accountStatement.Receivable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </span>
                                        ) : (
                                          null
                                        )}
                                        {accountStatement.payment_method == "Cheque" ? (
                                          <span>
                                            {accountStatement.Receivable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </span>
                                        ) : (
                                          null
                                        )}
                                      </p>
                                    </td> */}
                                    <td style={{ backgroundColor: '#adf7b6' }}>
                                      <p className="float-end">
                                        {accountStatement.statement.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </p>
                                    </td>
                                    <td>
                                      {accountStatement.is_settled == true ? (
                                        // <div className="text-success">
                                        //   <i className="mdi mdi-check-circle font-size-18"></i>
                                        // </div>
                                        "--"
                                      ) : (
                                        // <div className="text-danger">
                                        //   <i className="mdi mdi-close-circle font-size-18"></i>
                                        // </div>
                                        "--"
                                      )}
                                    </td>
                                  </tr>
                                ) :
                                  accountStatement.payment_status == "Paid" ? (

                                    <tr key={i}>
                                      <td>
                                        <p className="text-muted mb-0">
                                          {moment(accountStatement.ordered_at).format("DD MMM YYYY")}
                                        </p>
                                      </td>
                                      <td>
                                        <h5 className="font-size-14 text-truncate">
                                          <strong>{accountStatement.order_id}</strong>
                                        </h5>
                                      </td>
                                      <td>
                                        <p className="text-muted mb-0">
                                          {accountStatement.patient_name}
                                        </p>
                                      </td>
                                      {/* <p className="float-end"> */}
                                      {accountStatement.payment_status == "Not Paid" ? (
                                        <td style={{ backgroundColor: '#F58D77' }}>

                                          <b>
                                            {accountStatement.payment_method},{" "}
                                            {accountStatement.payment_status}
                                          </b></td>
                                      ) : (
                                        <td>

                                          <b>
                                            {accountStatement.payment_method},{" "}
                                            {accountStatement.payment_status}
                                          </b>                                      </td>

                                      )}
                                      {/* </p> */}
                                      {/* <td>
                                      <p>
                                        {accountStatement.dues_before_discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </p>
                                    </td> */}
                                      <td>
                                        {accountStatement.dues_before_discount == 0 ? (
                                          <p className="d-none">
                                            {accountStatement.dues_before_discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.dues_before_discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        )}

                                      </td>

                                      {/* <td>
                                      <p>
                                        {accountStatement.sample_collector_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </p>
                                    </td> */}
                                      <td>
                                        {accountStatement.sample_collector_amount == 0 ? (
                                          <p className="d-none">
                                            {accountStatement.sample_collector_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.sample_collector_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        )}

                                      </td>
                                      {/* <td>
                                      <p>
                                        {accountStatement.discounted_by_lab.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </p>
                                    </td> */}
                                      <td>
                                        {accountStatement.discounted_by_lab == 0 ? (
                                          <p className="d-none">
                                            {accountStatement.discounted_by_lab.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.discounted_by_lab.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        )}

                                      </td>
                                      <td>
                                        {accountStatement.lab_counter_discount == 0 ? (
                                          <p className="d-none">
                                            {accountStatement.lab_counter_discount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.lab_counter_discount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        )}

                                      </td>
                                      {/* <td>
                                      <p>
                                        {accountStatement.discounted_by_labhazir.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </p>
                                    </td> */}
                                      <td>
                                        {accountStatement.discounted_by_labhazir == 0 ? (
                                          <p className="d-none">
                                            {accountStatement.discounted_by_labhazir.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.discounted_by_labhazir.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        )}

                                      </td>
                                      {/* <td>
                                      <p>
                                        {accountStatement.dues.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </p>
                                    </td> */}
                                      <td>
                                        {accountStatement.dues == 0 ? (
                                          <p className="d-none">
                                            {accountStatement.dues.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.dues.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        )}

                                      </td>
                                      <td>
                                        {!isEmpty(accountStatement.Receivable) ? (
                                          <p className="d-none">
                                            {accountStatement.payment_method == "Card" ? (
                                              <span>
                                                {"Labhazir"}
                                              </span>
                                            ) : (
                                              null
                                            )}                                        </p>

                                        ) : (
                                          <p className="float-center text-danger">
                                            {accountStatement.payment_method == "Cash" || accountStatement.payment_method == "Donation" ? (
                                              <span>
                                                {"Lab"}
                                              </span>
                                            ) : (
                                              null
                                            )} </p>
                                        )}
                                        {!isEmpty(accountStatement.payable) ? (
                                          <p className="d-none">
                                            {accountStatement.payment_method == "Cash" || accountStatement.payment_method == "Donation" ? (
                                              <span>
                                                {"Lab"}
                                              </span>
                                            ) : (
                                              null
                                            )} </p>
                                        ) : (
                                          <p className="float-center text-success">
                                            {accountStatement.payment_method == "Card" ? (
                                              <span>
                                                {"Labhazir"}
                                              </span>
                                            ) : (
                                              null
                                            )}                                        </p>

                                        )}

                                      </td>
                                      {accountStatement.after_counterdiscount_lab_share === 0 ? (
                                        <td>
                                          <p className="d-none">
                                            {accountStatement.after_counterdiscount_lab_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        </td>
                                      ) : (
                                        (accountStatement.after_counterdiscount_lab_share !== 0 && (accountStatement.payment_method === "Card" || accountStatement.payment_method === "Donation")) ? (
                                          <td style={{ backgroundColor: '#ffee93' }}>
                                            <p className="float-end">
                                              {accountStatement.after_counterdiscount_lab_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </p>
                                          </td>
                                        ) : (
                                          <td>
                                            <p className="float-end">
                                              {accountStatement.after_counterdiscount_lab_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </p>
                                          </td>

                                        )
                                      )}

                                      {/* <td>
                                      <p>
                                        {accountStatement.labhazir_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </p>
                                    </td> */}
                                      {accountStatement.labhazir_share === 0 ? (
                                        <td>
                                          <p className="d-none">
                                            {accountStatement.labhazir_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        </td>
                                      ) : (
                                        (accountStatement.labhazir_share !== 0 && accountStatement.payment_method === "Cash") ? (
                                          <td style={{ backgroundColor: '#ffee93' }}>
                                            <p className="float-end">
                                              {accountStatement.labhazir_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </p>
                                          </td>
                                        ) : (
                                          <td>
                                            <p className="float-end">
                                              {accountStatement.labhazir_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </p>
                                          </td>

                                        )
                                      )}



                                      {/* <td>
                                        <p className="float-end">
                                          {accountStatement.payment_method == "Card" ? (
                                            <span>
                                              {"Labhazir"}
                                            </span>
                                          ) : (
                                            null
                                          )}
                                          
                                        </p>
                                      </td> */}
                                      {/* <td style={{ backgroundColor: '#ffc09f' }}>
                                        <p>
                                          {accountStatement.payment_method == "Cash" ? (
                                            <span>
                                              {accountStatement.Receivable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </span>
                                          ) : (
                                            null
                                          )}
                                          {accountStatement.payment_method == "Donation" ? (
                                            <span>
                                              {accountStatement.payable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </span>
                                          ) : (
                                            null
                                          )}
                                        </p>
                                      </td> */}
                                      {/* <td style={{ backgroundColor: '#ffee93' }}>
                                        <p>
                                          {accountStatement.payment_method == "Card" ? (
                                            <span>
                                              {accountStatement.Receivable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </span>
                                          ) : (
                                            null
                                          )}
                                        </p>
                                      </td> */}
                                      <td style={{ backgroundColor: '#adf7b6' }}>
                                        <p className="float-end">
                                          {accountStatement.statement.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      </td>
                                      <td>
                                        {accountStatement.is_settled == true ? (
                                          <div className="text-success">
                                            <i className="mdi mdi-check-circle font-size-18"></i>
                                          </div>
                                        ) : (
                                          <div className="text-danger">
                                            <i className="mdi mdi-close-circle font-size-18"></i>
                                          </div>
                                        )}
                                      </td>
                                    </tr>

                                  ) : accountStatement.payment_status == "Allocate" ? (
                                    <tr key={i}>
                                      <td>
                                        <p className="text-muted mb-0">
                                          {moment(accountStatement.ordered_at).format("DD MMM YYYY")}
                                        </p>
                                      </td>
                                      <td>
                                        <h5 className="font-size-14 text-truncate">
                                          <strong>{accountStatement.order_id}</strong>
                                        </h5>
                                      </td>
                                      <td>
                                        <p className="text-muted mb-0">
                                          {accountStatement.patient_name}
                                        </p>
                                      </td>
                                      {accountStatement.payment_status == "Not Paid" ? (
                                        <td style={{ backgroundColor: '#F58D77' }}>

                                          <b>
                                            {accountStatement.payment_method},{" "}
                                            {accountStatement.payment_status}
                                          </b></td>
                                      ) : (
                                        <td>

                                          <b>
                                            {accountStatement.payment_method},{" "}
                                            {accountStatement.payment_status}
                                          </b>                                      </td>

                                      )}
                                      <td>
                                        {accountStatement.dues_before_discount == 0 ? (
                                          <p className="d-none">
                                            {accountStatement.dues_before_discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.dues_before_discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        )}

                                      </td>

                                      {/* <td>
                                    <p>
                                      {accountStatement.sample_collector_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </p>
                                  </td> */}
                                      <td>
                                        {accountStatement.sample_collector_amount == 0 ? (
                                          <p className="d-none">
                                            {accountStatement.sample_collector_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.sample_collector_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        )}

                                      </td>
                                      {/* <td>
                                    <p>
                                      {accountStatement.discounted_by_lab.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </p>
                                  </td> */}
                                      <td>
                                        {accountStatement.discounted_by_lab == 0 ? (
                                          <p className="d-none">
                                            {accountStatement.discounted_by_lab.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.discounted_by_lab.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        )}

                                      </td>
                                      <td>
                                        {accountStatement.lab_counter_discount == 0 ? (
                                          <p className="d-none">
                                            {accountStatement.lab_counter_discount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.lab_counter_discount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        )}

                                      </td>
                                      {/* <td>
                                    <p>
                                      {accountStatement.discounted_by_labhazir.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </p>
                                  </td> */}
                                      <td>
                                        {accountStatement.discounted_by_labhazir == 0 ? (
                                          <p className="d-none">
                                            {accountStatement.discounted_by_labhazir.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.discounted_by_labhazir.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        )}

                                      </td>
                                      {/* <td>
                                    <p>
                                      {accountStatement.dues.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </p>
                                  </td> */}
                                      <td>
                                        {accountStatement.dues == 0 ? (
                                          <p className="d-none">
                                            {accountStatement.dues.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.dues.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        )}

                                      </td>
                                      <td>
                                        {accountStatement.labhazir_share == 0 ? (
                                          <p className="d-none">
                                            {accountStatement.payment_method == "Cash" ? (
                                              <span>
                                                {accountStatement.dues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                              </span>
                                            ) : (
                                              null
                                            )}                                        </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.payment_method == "Cash" ? (
                                              <span>
                                                {accountStatement.dues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                              </span>
                                            ) : (
                                              <span className="text-primary">LabHazir</span>
                                            )}                                        </p>
                                        )}

                                      </td>

                                      <td>
                                        {accountStatement.after_counterdiscount_lab_share == 0 ? (
                                          <p className="d-none">
                                            {accountStatement.after_counterdiscount_lab_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.after_counterdiscount_lab_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        )}

                                      </td>

                                      {/* <td>
                                    <p>
                                      {accountStatement.labhazir_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </p>
                                  </td> */}
                                      <td>
                                        {accountStatement.labhazir_share == 0 ? (
                                          <p className="d-none">
                                            {accountStatement.labhazir_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>

                                        ) : (
                                          <p className="float-end">
                                            {accountStatement.labhazir_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                          </p>
                                        )}

                                      </td>

                                      {/* <td>
                                    <p>
                                      {accountStatement.payment_method == "Cash" ? (
                                        <span>
                                          {accountStatement.dues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </span>
                                      ) : (
                                        null
                                      )}
                                    </p>
                                  </td> */}

                                      {/* <td>
                                        <p className="float-end">
                                          {accountStatement.payment_method == "Card" ? (
                                            <span>
                                              {accountStatement.dues.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </span>
                                          ) : (
                                            null
                                        </p>
                                      </td> */}
                                      {/* <td style={{ backgroundColor: '#ffc09f' }}>
                                        <p>
                                          {accountStatement.payment_method == "Cash" ? (
                                            <span>
                                              {accountStatement.payable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </span>
                                          ) : (
                                            null
                                          )}
                                        </p>
                                      </td> */}
                                      {/* <td style={{ backgroundColor: '#ffee93' }}>
                                        <p>
                                          {accountStatement.payment_method == "Card" ? (
                                            <span>
                                              {accountStatement.Receivable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                            </span>
                                          ) : (
                                            null
                                          )}

                                        </p>
                                      </td> */}
                                      <td style={{ backgroundColor: '#adf7b6' }}>
                                        <p className="float-end">
                                          {accountStatement.statement.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      </td>
                                      <td>
                                        {accountStatement.is_settled == true ? (
                                          <div className="text-success">
                                            <i className="mdi mdi-check-circle font-size-18"></i>
                                          </div>
                                        ) : (
                                          <div className="text-danger">
                                            <i className="mdi mdi-close-circle font-size-18"></i>
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  ) : (null)
                                }
                              </>
                            )
                            )}
                            <tr className="bg-success bg-soft" >
                              <td colSpan="2" className="border-0 text-end">
                                <strong>Total</strong>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {
                                    this.props.accountStatements.slice(-1).pop().total_testby_labhazir.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {
                                    this.props.accountStatements.slice(-1).pop().total_sample_collector.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {
                                    this.props.accountStatements.slice(-1).pop().total_discount_lab.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {
                                    this.props.accountStatements.slice(-1).pop().total_labcounterdiscount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {
                                    this.props.accountStatements.slice(-1).pop().total_discount_labhazir.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {
                                    this.props.accountStatements.slice(-1).pop().total_dues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                </p>
                              </td>

                              <td className="border-10">
                                <p className="float-end">
                                  {
                                    this.props.accountStatements.slice(-1).pop().total_labshare.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {
                                    this.props.accountStatements.slice(-1).pop().total_labhazirshare.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {
                                    "--"}
                                </p>
                              </td>
                              {/* <td className="border-10">
                                <p className="float-end">
                                  {
                                    this.props.accountStatements.slice(-1).pop().total_payment_labhazir.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                </p>
                              </td> */}
                              <td className="border-10">
                                <p className="float-end">
                                  {
                                    this.props.accountStatements.slice(-1).pop().total_payable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {
                                    this.props.accountStatements.slice(-1).pop().total_Receivable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {
                                    this.props.accountStatements.slice(-1).pop().statement.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                </p>
                              </td>
                              <td className="border-10">
                                {
                                }
                              </td>
                            </tr>
                          </tbody>
                        ) : (
                          null)}
                      </Table>
                    </div>
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

AccountStatements.propTypes = {
  match: PropTypes.object,
  accountStatements: PropTypes.array,
  className: PropTypes.any,
  onGetAccountStatements: PropTypes.func,
};

const mapStateToProps = ({ accountStatements }) => ({
  accountStatements: accountStatements.accountStatements,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetAccountStatements: id => dispatch(getAccountStatements(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AccountStatements));
