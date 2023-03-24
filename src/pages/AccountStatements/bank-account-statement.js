import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Card, CardBody, Col, Table, Container, Row } from "reactstrap";
import { isEmpty, map } from "lodash";


import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

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
    const { onGetBankStatements } = this.props;
    onGetBankStatements(this.props.match.params.id);
    this.setState({ bankStatements: this.props.bankStatements });
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

    const { bankStatements } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: AccountStatements.length, // replace later with size(bankStatements),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    // var total_testby_labhazir = this.props.bankStatements.total_testby_labhazir
    // // var authenticated = "{{total_testby_labhazir}}"
    // console.log(total_testby_labhazir)

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Bank Account Statements | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Bank" breadcrumbItem="Bank Account Statements" />
            {!isEmpty(this.props.bankStatements) && (
              <Row>
                {/* <div> <span className="text-danger font-size-12">
                  <strong>
                    Note: Discount By Lab Sum of Counter Discount and Discount offered Lab.
                  </strong>
                </span>
                </div> */}
                <Col lg="12">
                  <Card>
                    <CardBody>
                      <div className="table-responsive">
                        <Table>
                          <thead className="table-light">
                            <tr>
                              {/* <th scope="col">Date</th>
                              <th scope="col">ID</th>
                              <th scope="col">Patient Name</th>
                              <th scope="col">Status</th>
                              <th scope="col">Total Without Discount</th>
                              <th scope="col">Home Sampling Amount</th>
                              <th scope="col">Discount By Lab</th>
                              <th scope="col">Discount By LabHazir</th>
                              <th scope="col">Payable After Discount</th>
                              <th scope="col">Margin of Lab</th>
                              <th scope="col">Referrel Fee of LabHazir</th> */}
                              {/* <th scope="col">Payment Received By LabHazir</th> */}
                              {/* {/* <th scope="col">Payment Received By Lab</th> */}
                              <th scope="col">Date</th>
                              <th scope="col">Description</th>
                              <th scope="col">Payment Status</th>
                              <th scope="col">Credit</th>
                              <th scope="col">Debit</th>
                              <th scope="col">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bankStatements.map((bankStatement, i) => (
                              <>
                                {bankStatement.transaction_type == "In" ? (

                                  <tr key={i} className="badge-soft-primary">
                                    <td>
                                    <p className="text-muted mb-0">
                                        {new Date(bankStatement.Date).toLocaleString("en-US")}
                                      </p>
                                    </td>
                                    <td>
                                      {bankStatement.Lab_id == null &&
                                       bankStatement.mif_id == null ? (
                                        <p className="d-none">
                                          {bankStatement.mif_id}
                                          {bankStatement.Lab_id}
                                        </p>

                                      ) : (
                                        <p>
                                          {"MIF ID: "}{bankStatement.mif_id}{" For "}{"Lab ID: "}{bankStatement.Lab_id}
                                        </p>
                                      )}
                                    </td>                                   
                                    <td>
                                      <p>
                                        {bankStatement.Status}
                                      </p>
                                    </td>
                                    <td>
                                      {bankStatement.Credit == 0 ? (
                                        <p className="d-none">
                                          {bankStatement.Credit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {bankStatement.Credit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                    </td>
                                    <td>
                                      {bankStatement.Debit == 0 ? (
                                        <p className="d-none">
                                          {bankStatement.Debit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {bankStatement.Debit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                    </td>
                                    <td>
                                      <p className="float-end">
                                        {bankStatement.total_test_cost.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </p>
                                    </td>
                                  </tr>
                                ) : bankStatement.transaction_type == "Out" ? (
                                  <tr key={i} className="badge-soft-danger">
                                  <td>
                                  <p className="text-muted mb-0">
                                        {new Date(bankStatement.Date).toLocaleString("en-US")}
                                      </p>
                                    </td>
                                    <td>
                                      {bankStatement.Lab_id == null ||
                                       bankStatement.mof_id == null ? (
                                        <p className="d-none">
                                          {bankStatement.mof_id}
                                          {bankStatement.Lab_id}
                                        </p>

                                      ) : (
                                        <p>
                                          {"MOF ID: "}{bankStatement.mof_id}{" For "}{"Lab ID: "}{bankStatement.Lab_id}
                                        </p>
                                      )}
                                       {bankStatement.B2b_id == null ||
                                       bankStatement.mof_id == null ? (
                                        <p className="d-none">
                                          {bankStatement.mof_id}
                                          {bankStatement.B2b_id}
                                        </p>

                                      ) : (
                                        <p>
                                          {"MOF ID: "}{bankStatement.mof_id}{" For "}{"B2b Client ID: "}{bankStatement.B2b_id}
                                        </p>
                                      )}
                                    </td>
                                    <td>
                                      <p>
                                        {bankStatement.Status}
                                      </p>
                                    </td>
                                    <td>
                                      {bankStatement.Credit == 0 ? (
                                        <p className="d-none">
                                          {bankStatement.Credit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {bankStatement.Credit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                    </td>
                                    <td>
                                      {bankStatement.Debit == 0 ? (
                                        <p className="d-none">
                                          {bankStatement.Debit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {bankStatement.Debit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                    </td>
                                    <td>
                                      <p className="float-end">
                                        {bankStatement.total_test_cost.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </p>
                                    </td>
                                  </tr>
                                ) : null}

                              </>
                            )
                            )}
                            <tr className="bg-success bg-soft">
                              <td colSpan="3" className="border-0 text-end">
                                <strong>Total</strong>
                              </td>
                              <td className="border-10">
                              <p className="float-end">
                                {
                                  this.props.bankStatements.slice(-1).pop().total_Credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </p>
                              </td>
                              <td className="border-10">
                              <p className="float-end">
                                {
                                  this.props.bankStatements.slice(-1).pop().total_Debit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                </p>
                              </td>
                              <td className="border-10">
                              <p className="float-end">
                                {
                                  this.props.bankStatements.slice(-1).pop().total_test_cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                </p>
                              </td>
                              
                            </tr>
                          </tbody>
                         
                        </Table>
                      </div>
                     
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )}

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
};

const mapStateToProps = ({ accountStatements }) => ({
  bankStatements: accountStatements.bankStatements,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetBankStatements: id => dispatch(getBankStatements(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AccountStatements));