import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Card, CardBody, Col, Table, Container, Row, Label } from "reactstrap";
import { isEmpty, map } from "lodash";
import Select from "react-select";
import { Formik, Field, Form, ErrorMessage } from "formik";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getBankaccounts,
} from "store/bankaccounts/actions";
import { getBankStatements } from "store/account-statements/actions";

import "assets/scss/table.scss";
// Define the custom footer component

class AccountStatements extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      bankStatements: [],
      bankStatement: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { bankaccounts, onGetBankaccounts } = this.props;
    onGetBankaccounts(this.state.user_id);
    this.setState({ bankaccounts });
    // Call the asynchronous functions initially
    this.getData();

    // Set an interval to call the asynchronous functions every 2 seconds
    this.interval = setInterval(this.getData, 1000);
  }

  componentWillUnmount() {
    // Clear the interval when the component is unmounted to prevent memory leaks
    clearInterval(this.interval);
  }

  getData = async () => {
    const { onGetBankStatements } = this.props;
    // const { user_id } = this.state;

    // Fetch bank statements
    await onGetBankStatements(this.props.match.params.id);
    this.setState({ bankStatements: this.props.bankStatements });
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  render() {    
    const { SearchBar } = Search;
    const { bankStatements } = this.props;
    const bankStatement = this.state.bankStatement;
    // const footer = {
    //   totalDebit: bankStatements[0].total_Debit, // Replace with the actual data from your backend
    // };console.log("totaldebit is ", this.props.bankStatements.total_Debit)

    const {
      onGetBankaccounts,
    } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: bankStatements.length, // Use the actual data length
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];

    // Define the structure of your table headers
    const tableHeaders = [
      {
        dataField: 'clearence_datetime',
        text: 'Clearence DateTime',
        sort: true,
        footer: '', // Empty footer for this column
        formatter: (cellContent, bankStatement) => (
          <>
            <strong>{bankStatement.clearence_datetime}</strong>
          </>
        ), filter: textFilter(), // Add a text filter for this column
      },
      {
        dataField: 'account_name',
        text: 'Description',
        footer: '', // Empty footer for this column
        formatter: (cellContent, bankStatement) => (
          <>
            <strong>{bankStatement.account_name}{", "}
              {bankStatement.account_no}{", "}
              {bankStatement.mif_id
                ? <span><span style={{ color: 'red' }}>MIF ID: </span> {bankStatement.mif_id}</span>
                : bankStatement.mof_id
                  ? <span><span style={{ color: 'red' }}>MOF ID: </span> {bankStatement.mof_id}</span>
                  : <span><span style={{ color: 'red' }}>BTD ID: </span> {bankStatement.btd_id}</span>}</strong>
          </>
        ), filter: textFilter(), // Add a text filter for this column // Add a text filter for this column
      },
      {
        dataField: 'Status',
        text: 'Payment Status',
        footer: '', // Empty footer for this column
        formatter: (cellContent, bankStatement) => (
          <>
            <strong>{bankStatement.Status}</strong>
          </>
        ), filter: textFilter(), // Add a text filter for this column
      },
      {
        dataField: 'credit',
        text: 'Credit',
        footer: 'Total Credit', // Footer label for this column
        footerdataField: 'total_Credit',
        formatter: (cellContent, bankStatement) => (
          <>
            <strong>{bankStatement.credit}</strong>
          </>
        ), filter: textFilter(), // Add a text filter for this column
      },
      {
        dataField: 'Debit',
        text: 'Debit',
        footer: 'Total Debit', // Footer label for this column
        footerdataField: 'totalDebit',
        formatter: (cellContent, bankStatement) => (
          <>
            <strong>{bankStatement.Debit}</strong>
          </>
        ), filter: textFilter(), // Add a text filter for this column
      },
      {
        dataField: 'account_balance',
        text: 'Balance',
        footer: 'Total Balance', // Footer label for this column
        footerdataField: 'account_balance',
        formatter: (cellContent, bankStatement) => (
          <>
            <strong>{bankStatement.account_balance}</strong>
          </>
        ), filter: textFilter(), // Add a text filter for this column
      },
    ];

    // Check if bankStatements is empty
    const isDataEmpty = isEmpty(bankStatements);

    const { bankaccounts } = this.props;
    const bankaccountList = [];
    for (let i = 0; i < bankaccounts.length; i++) {
      let flag = 0;
      // for (let j = 0; j < bankaccounts.length; j++) {
      //   if (banks[i].id == bankaccounts[j].bank_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        bankaccountList.push(
          {
            label: `${bankaccounts[i].bank_name} - ${bankaccounts[i].account_no}`,
            value: `${bankaccounts[i].id}`,
          }
        );
      }
    }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Bank Account Statements | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Bank" breadcrumbItem="Bank Account Statements" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <Row className="mb-2">
                      <Col sm="4">
                      <Row className="mb-2">
                      <Col sm="8">

                        {bankStatement.bankaccount_id ? (
                          <div className="mb-3">
                            <Label className="col-form-label">Bank Account Name and Number</Label>

                            <Field
                              name="bankaccount_id"
                              as="select"
                              defaultValue={bankStatement.bankaccount_id}
                              className="form-control"
                              readOnly={true}
                              multiple={false}
                              onChange={(e) => {
                                const selectedAccountId = e.target.value;
                                this.props.history.push(`/bank-account-statements/${selectedAccountId}`);
                              }}
                            >
                              <option key={bankStatement.bankaccount_id} value={bankStatement.bankaccount_id}>
                                {bankStatement.account_no}
                              </option>
                            </Field>
                          </div>
                        ) : (
                          <div className="mb-3 select2-container">
                            <Label className="col-form-label">Bank Account Name and Number</Label>

                            <Select
                              name="bankaccount_id"
                              component="Select"
                              onChange={(selectedOption) => {
                                const selectedAccountId = selectedOption.value;
                                this.props.history.push(`/bank-account-statements/${selectedAccountId}`);
                              }}
                              options={bankaccountList}
                              placeholder="Select Bank Account..."
                            />
                          </div>
                        )}</Col></Row>
                      </Col>
                    </Row>

                    <div className="table-responsive">
                      {/* Add filter and footer to BootstrapTable */}
                      <ToolkitProvider
                        keyField="id"
                        data={bankStatements}
                        columns={tableHeaders}
                        search
                      >
                        {props => (
                          <div>
                            {/* <SearchBar {...props.searchProps} /> */}
                            <BootstrapTable
                              {...props.baseProps}
                              defaultSorted={defaultSorted}
                              pagination={paginationFactory(pageOptions)}
                              filter={filterFactory()} // Enable filtering for the entire table
                            />
                          </div>
                        )}
                      </ToolkitProvider>
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
  bankStatements: PropTypes.array,
  className: PropTypes.any,
  onGetBankStatements: PropTypes.func,
  onGetBankaccounts: PropTypes.func,
  bankaccounts: PropTypes.array,
  history: PropTypes.any,

};

const mapStateToProps = ({ accountStatements, bankaccounts }) => ({
  bankStatements: accountStatements.bankStatements,
  bankaccounts: bankaccounts.bankaccounts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetBankStatements: id => dispatch(getBankStatements(id)),
  onGetBankaccounts: id => dispatch(getBankaccounts(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AccountStatements));