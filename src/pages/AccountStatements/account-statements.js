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
      // accountStatementColumn: [
      //   {
      //     text: "id",
      //     dataField: "id",
      //     sort: true,
      //     hidden: true,
      //     formatter: (cellContent, accountStatement) => (
      //       <>{accountStatement.id}</>
      //     ),
      //   },
      //   {
      //     dataField: "order_id",
      //     text: "Order ID",
      //     sort: true,
      //     formatter: (cellContent, patientTestAppointment) => (
      //       <>
      //         <strong>{patientTestAppointment.order_id}</strong>
      //       </>
      //     ),
      //   },
      //   {
      //     dataField: "ordered_at",
      //     text: "Ordered at",
      //     sort: true,
      //     formatter: (cellContent, accountStatement) => (
      //       <>
      //         <span>
      //           {new Date(accountStatement.ordered_at).toLocaleString("en-US")}
      //         </span>
      //       </>
      //     ),
      //   },
      //   // {
      //   //   dataField: "payment_method",
      //   //   text: "Payment Method",
      //   //   sort: true,
      //   // },
      //   // {
      //   //   dataField: "status",
      //   //   text: "Payment Status",
      //   //   sort: true,
      //   // },
      //   {
      //     dataField: "status",
      //     text: "Payment Status",
      //     sort: true,
      //     formatter: (cellContent, accountStatement) => (
      //       <>
      //         {accountStatement.payment_status == "Not Paid" ? (
      //           <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
      //             {accountStatement.payment_method},{" "}
      //             {accountStatement.status}
      //           </span>
      //         ) : (
      //           <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
      //             {accountStatement.payment_method},{" "}
      //             {accountStatement.status}
      //           </span>
      //         )}
      //       </>
      //     ),
      //   },
      //   {
      //     dataField: "dues_before_discount",
      //     text: "Dues Before Discount",
      //     sort: true,
      //   },
      //   {
      //     dataField: "sample_collector_amount",
      //     text: "Sample Collector Amount",
      //     sort: true,
      //   },

      //   // {
      //   //   dataField: "paid_at",
      //   //   text: "",
      //   //   sort: true,
      //   //   formatter: (cellContent, accountStatement) => (
      //   //     <>
      //   //       {accountStatement.paid_at ? (
      //   //         <span>
      //   //           {new Date(accountStatement.paid_at).toLocaleString("en-US")}
      //   //         </span>
      //   //       ) : (
      //   //         <span>Not paid</span>
      //   //       )}
      //   //     </>
      //   //   ),
      //   // },
      //   {
      //     dataField: "discounted_by_lab",
      //     text: "Discount By abc Lab",
      //     sort: true,
      //   },
      //   {
      //     dataField: "discounted_by_labhazir",
      //     text: "Discount By LabHazir",
      //     sort: true,
      //   },

      //   // {
      //   //   dataField: "received_payment_labHazir",
      //   //   text: "Payment Received By LabHazir",
      //   //   sort: true,
      //   // },

      //   {
      //     dataField: "labhazir_share",
      //     text: "Labhazir Share",
      //     sort: true,
      //   },
      //   {
      //     dataField: "lab_share",
      //     text: "abc Lab Share",
      //     sort: true,
      //   },
      //   {
      //     dataField: "dues",
      //     text: "Dues After Discount",
      //     sort: true,
      //   },
      //   // {
      //   //   dataField: "payable",
      //   //   text: "Debit",
      //   //   sort: true,
      //   // },
      //   // {
      //   //   dataField: "Receivable",
      //   //   text: "Credit",
      //   //   sort: true,
      //   // },
      //   {
      //     dataField: "dues",
      //     text: "Payment Received By Lab",
      //     sort: true,
      //     formatter: (cellContent, accountStatement) => (
      //       <>
      //         {accountStatement.payment_method == "Cash" ? (
      //            <span>
      //            {accountStatement.dues}
      //          </span>
      //        ) : (
      //      null
      //         )}
      //       </>
      //     ),
      //   },
      //   {
      //     dataField: "payment_method",
      //     text: "Debit",
      //     sort: true,
      //     formatter: (cellContent, accountStatement) => (
      //       <>
      //         {accountStatement.payment_method == "Cash" ? (
      //            <span>
      //            {accountStatement.payable}
      //          </span>
      //        ) : (
      //      null
      //         )}
      //       </>
      //     ),
      //   },
      //   {
      //     dataField: "dues",
      //     text: "Payment Received By LabHazir",
      //     sort: true,
      //     formatter: (cellContent, accountStatement) => (
      //       <>
      //         {accountStatement.payment_method == "Card" ? (
      //            <span>
      //            {accountStatement.dues}
      //          </span>
      //        ) : (
      //      null
      //         )}
      //         {accountStatement.payment_method == "Donation" ? (
      //           <span>
      //             {accountStatement.dues}
      //           </span>
      //         ) : (
      //       null
      //         )}
      //       </>
      //     ),
      //   },
      //   {
      //     dataField: "payment_method",
      //     text: "Credit",
      //     sort: true,
      //     formatter: (cellContent, accountStatement) => (
      //       <>
      //         {accountStatement.payment_method == "Card" ? (
      //           <span>
      //             {accountStatement.Receivable}
      //           </span>
      //         ) : (
      //       null
      //         )}
      //         {accountStatement.payment_method == "Donation" ? (
      //           <span>
      //             {accountStatement.Receivable}
      //           </span>
      //         ) : (
      //       null
      //         )}
      //       </>
      //     ),
      //   },
      //   {
      //     dataField: "statement",
      //     text: "Statement",
      //     sort: true,
      //     formatter: (cellContent, accountStatement) => (
      //       <>
      //         {accountStatement.payment_method == "Cash" ? (
      //            <span>
      //            {accountStatement.payable}
      //          </span>
      //        ) : (
      //      null
      //         )}
      //         {accountStatement.payment_method == "Card" ? (
      //            <span>
      //            {accountStatement.Receivable}
      //          </span>
      //        ) : (
      //      null
      //         )}
      //         {accountStatement.payment_method == "Donation" ? (
      //           <span>
      //             {accountStatement.Receivable}
      //           </span>
      //         ) : (
      //       null
      //         )}
      //       </>
      //     ),
      //   },
      //    {
      //     dataField: "is_settled",
      //     text: "Is Settled",
      //     sort: true,
      //     formatter: (cellContent, patientTestAppointment) => (
      //       <>
      //         {patientTestAppointment.is_settled == true ? (
      //           <div className="text-success">
      //             <i className="mdi mdi-check-circle font-size-18"></i>
      //           </div>
      //         ) : (
      //           <div className="text-danger">
      //             <i className="mdi mdi-close-circle font-size-18"></i>
      //           </div>
      //         )}
      //       </>
      //     ),
      //   },
      // ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { onGetAccountStatements } = this.props;
    onGetAccountStatements(this.state.user_id);
    this.setState({ accountStatements: this.props.accountStatements });
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
            {!isEmpty(this.props.accountStatements) && (
            <Row>
                 <div> <span className="text-danger font-size-12">
                                    <strong> 
                                    Note: Discount By Lab Sum of Counter Discount and Discount offered Lab.
                                    </strong>
                                  </span>
                                  </div>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div className="table-responsive">
                      <Table>
                        <thead className="table-light">
                          <tr>
                            <th scope="col">Ordered Date</th>
                            <th scope="col">Order ID</th>
                            <th scope="col">Patient Name</th>
                            <th scope="col">Payment Status</th>
                            <th scope="col">Total Without Discount</th>
                            <th scope="col">Home Sampling Amount</th>
                            <th scope="col">Discount By Lab</th>
                            <th scope="col">Discount By LabHazir</th>
                            <th scope="col">Payable After Discount</th>
                            <th scope="col">Share of Lab</th>
                            <th scope="col">Referrel Fee of LabHazir</th>
                            {/* <th scope="col">Payment Received By LabHazir</th> */}
                            <th scope="col">Payment Received By Lab</th>
                            <th scope="col">Credit</th>
                            <th scope="col">Payment Received By LabHazir</th>
                            <th scope="col">Debit</th>
                            <th scope="col">Statement</th>
                            <th scope="col">Is Settled</th>
                          </tr>
                        </thead>
                        <tbody>
                          {accountStatements.map((accountStatement, i)  => (
                            <>
                              <tr key={i}>
                              <td>
                                  <p className="text-muted mb-0">
                                    {accountStatement.ordered_at}
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
                                <td>
                                  {/* <p className="float-end"> */}
                                  {accountStatement.payment_status == "Not Paid" ? (
                                    <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
                                      {accountStatement.payment_method},{" "}
                                      {accountStatement.payment_status}
                                    </span>
                                  ) : (
                                    <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                                      {accountStatement.payment_method},{" "}
                                      {accountStatement.payment_status}
                                    </span>
                                  )}
                                  {/* </p> */}
                                </td>
                                <td>
                                  <p>
                                    {accountStatement.dues_before_discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </p>
                                </td>
                                <td>
                                  <p>
                                    {accountStatement.sample_collector_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </p>
                                </td>
                                <td>
                                  <p>
                                    {accountStatement.discounted_by_lab.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </p>
                                </td>
                                <td>
                                  <p>
                                    {accountStatement.discounted_by_labhazir.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </p>
                                </td>
                                <td>
                                  <p>
                                    {accountStatement.dues.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </p>
                                </td>
                                <td>
                                  <p>
                                    {accountStatement.lab_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </p>
                                </td>
                              
                                <td>
                                  <p>
                                    {accountStatement.labhazir_share.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                  </p>
                                </td>
                                <td>
                                  <p>
                                    {accountStatement.payment_method == "Cash" ? (
                                      <span>
                                        {accountStatement.dues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </span>
                                    ) : (
                                      null
                                    )}
                                  </p>
                                </td>
                                <td>
                                  <p className="float-end bg-success bg-soft p-7">
                                    {accountStatement.payment_method == "Cash" ? (
                                      <span>
                                        {accountStatement.payable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </span>
                                    ) : (
                                      null
                                    )}
                                  </p>
                                </td>
                                <td>
                                  <p>
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
                                </td>
                                <td>
                                  <p className="float-end bg-danger bg-soft p-7">
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
                                  </p>
                                </td>
                                <td>
                                  <p>
                                    {accountStatement.payment_method == "Cash" ? (
                                      <span>
                                        {accountStatement.payable.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </span>
                                    ) : (
                                      null
                                    )}
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
                            

                            </>
                          )
                          )}
                            <tr className="bg-success bg-soft">
                              <td colSpan="4" className="border-0 text-end">
                                <strong>Total</strong>
                              </td>
                              <td className="border-10">
                                {
                                  this.props.accountStatements.slice(-1).pop().total_testby_labhazir.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                                <td className="border-10">
                                {
                                  this.props.accountStatements.slice(-1).pop().total_sample_collector.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                              <td className="border-10">
                                {
                                  this.props.accountStatements.slice(-1).pop().total_discount_lab.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                              <td className="border-10">
                                {
                                  this.props.accountStatements.slice(-1).pop().total_discount_labhazir.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                              <td className="border-10">
                                {
                                  this.props.accountStatements.slice(-1).pop().total_dues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                              <td className="border-10">
                                {
                                  this.props.accountStatements.slice(-1).pop().total_labshare.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                              <td className="border-10">
                                {
                                  this.props.accountStatements.slice(-1).pop().total_labhazirshare.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                              <td className="border-10">
                                {
                                  this.props.accountStatements.slice(-1).pop().total_payment_lab.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                              <td className="border-10">
                                {
                                  this.props.accountStatements.slice(-1).pop().total_payable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                              <td className="border-10">
                                {
                                  this.props.accountStatements.slice(-1).pop().total_payment_labhazir.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                              <td className="border-10">
                                {
                                  this.props.accountStatements.slice(-1).pop().total_Receivable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                              <td className="border-10">
                                {
                                  this.props.accountStatements.slice(-1).pop().total_statement.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                              <td className="border-10">
                                {
                                }
                              </td>
                            </tr> 
                        </tbody>
                        {/* <tfoot>
                                  {accountStatements.map(
                                      (accountStatement, key) => (
                                        <>
                                              <tr className="table-light p-3 rounded">
                                                <td>
                                                  <h5 className="font-size-14 text-truncate float-center">
                                                    Total
                                                  </h5>
                                                </td>
                                                <td><p className="float-end"> 
                                                {accountStatement.total_dues_before_discount}</p>
                                                 </td>
                                                 <td><p className="float-end"> 
                                                {accountStatement.total_dues_before_discount}</p>
                                                 </td>
                                                 <td><p className="float-end"> 
                                                {accountStatement.total_dues_before_discount}</p>
                                                 </td>
                                                 <td><p className="float-end"> 
                                                {accountStatement.total_dues_before_discount}</p>
                                                 </td>
                                              </tr>
                                            

                                          {/* {/* {checkoutItem.lab_home_sampling_charges !=
                                            0 && (
                                            <tr key={"_checkoutItem_" + key}>
                                              <td colSpan="5">
                                                <div className="bg-primary bg-soft p-3 rounded">
                                                  <h5 className="font-size-14 text-primary mb-0">
                                                    <i className="fas fa-shipping-fast me-2" />{" "}
                                                    Home Sampling Charges{" "}
                                                    <span className="float-end">
                                                      Rs.{" "}
                                                      {
                                                        checkoutItem.lab_home_sampling_charges.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                      }
                                                    </span>
                                                  </h5>
                                                </div>
                                              </td>
                                            </tr> 
                                          )}

                                          {checkoutItem.total_test_cost && (
                                            <tr>
                                              <td colSpan="5">
                                                <div className="bg-success bg-soft p-3 rounded">
                                                  <h5 className="font-size-14 text-success mb-0">
                                                    <i className="mdi mdi-cash-multiple me-2 font-size-22" />{" "}
                                                    Sub Total{" "}
                                                    <span className="float-end">
                                                      Rs.{" "}
                                                      {
                                                        checkoutItem.total_test_cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                                      }
                                                    </span>
                                                  </h5>
                                                </div>
                                              </td>
                                            </tr>
                                          )}  
                                        </>
                                      )
                                    )}
                                  </tfoot> */}
                      </Table>
                    </div>
                    {/* <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.accountStatementColumn}
                      data={accountStatements}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.accountStatementColumn}
                          data={accountStatements}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                    />
                                  </div>
                                </Col>
                              </Row>
                              {/* <Row className="align-items-md-center mt-30">
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
                    </PaginationProvider> */}
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
