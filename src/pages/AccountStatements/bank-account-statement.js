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
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getBankaccounts,
} from "store/bankaccounts/actions";
import { getBankStatements } from "store/account-statements/actions";

import "assets/scss/table.scss";

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
    const { bankStatements } = this.props;
    const bankStatement = this.state.bankStatement;

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
      "Clearenec DateTime",
      "Description",
      "Payment Status",
      "Credit",
      "Debit",
      "Balance",
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
                            <Label className="col-form-label">Bank Account Name</Label>

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

                    <div className="table-responsive">
                      <Table>
                        <thead className="table-light">
                          <tr>
                            {tableHeaders.map((header, index) => (
                              <th key={index} scope="col">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {isDataEmpty ? (
                            <tr>
                              <td colSpan={tableHeaders.length}>
                                No data available
                              </td>
                            </tr>
                          ) : (
                            bankStatements.map((bankStatement, i) => (
                              <tr key={i} className="badge-soft-primary">
                                <td>
                                  <p className="text-muted mb-0">
                                    {new Date(bankStatement.clearence_datetime).toLocaleString("en-US")}
                                  </p>
                                </td>
                                <td>
                                  <p>
                                    {bankStatement.account_name}{", "}
                                    {bankStatement.account_no}
                                  </p>
                                </td>
                                {/* <td>
                              {bankStatement.Lab_id == null &&
                                bankStatement.mif_id == null ? (
                                <p className="d-none">
                                  {bankStatement.mif_id}
                                  {bankStatement.Lab_id}
                                </p>

                              ) : bankStatement.Advertisement_id == null &&
                              (
                                <p>
                                  {"MIF ID: "}{bankStatement.mif_id}{" For "}{"Lab ID: "}{bankStatement.Lab_id}
                                </p>
                              )}
                              {bankStatement.Advertisement_id == null ||
                                bankStatement.mif_id == null ? (
                                <p className="d-none">
                                  {bankStatement.mif_id}
                                  {bankStatement.Advertisement_id}
                                </p>

                              ) : bankStatement.Lab_id == null && (
                                <p>
                                  {"MIF ID: "}{bankStatement.mif_id}{" For "}{"Lab Advertisement ID: "}{bankStatement.Advertisement_id}
                                </p>
                              )}
                            </td> */}
                                <td>
                                  <p>
                                    {bankStatement.Status}
                                  </p>
                                </td>
                                <td>
                                  {bankStatement.credit == 0 ? (
                                    <p className="d-none">
                                      {bankStatement.credit}
                                    </p>

                                  ) : (
                                    <p className="float-end">
                                      {bankStatement.credit}
                                    </p>
                                  )}
                                </td>
                                <td>
                                  {bankStatement.Debit == 0 ? (
                                    <p className="d-none">
                                      {bankStatement.Debit}
                                    </p>

                                  ) : (
                                    <p className="float-end">
                                      {bankStatement.Debit}
                                    </p>
                                  )}
                                </td>
                                <td>
                                  <p className="float-end">
                                    {bankStatement.account_balance}
                                  </p>
                                </td>
                              </tr>
                            ))
                          )}
                          {!isDataEmpty && (
                            <tr className="bg-success bg-soft">
                              <td colSpan="3" className="border-0 text-end">
                                <strong>Total</strong>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {bankStatements.slice(-1).pop().total_Credit}
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {bankStatements.slice(-1).pop().total_Debit}
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {bankStatements.slice(-1).pop().account_balance}
                                </p>
                              </td>
                            </tr>
                          )}
                        </tbody>
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
