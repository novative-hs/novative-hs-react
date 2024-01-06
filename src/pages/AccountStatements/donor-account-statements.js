import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Card, CardBody, Col, Table, Container, Row } from "reactstrap";
import { isEmpty, map } from "lodash";
import moment from 'moment';



import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getDonorAccountStatements } from "store/donor-account-statements/actions";

import "assets/scss/table.scss";

class AccountStatements extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      donoraccountStatements: [],
      donoraccountStatement: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      account_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    if (this.state.user_id && this.state.account_type === "donor") {
      const { onGetDonorAccountStatements } = this.props;
      onGetDonorAccountStatements(this.state.user_id);
      this.setState({ donoraccountStatements: this.props.donoraccountStatements });
    } else if (this.state.user_id && this.state.account_type !== "donor"){
      const { onGetDonorAccountStatements } = this.props;
    onGetDonorAccountStatements(this.props.match.params.id);
    this.setState({ donoraccountStatements: this.props.donoraccountStatements });;
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

    const { donoraccountStatements } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: donoraccountStatements.length, // replace later with size(donoraccountStatements),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    // var total_testby_labhazir = this.props.donoraccountStatements.total_testby_labhazir
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
            <Breadcrumbs title="Donor" breadcrumbItem="Account Statements" />
            {isEmpty(this.props.donoraccountStatements) && (
              <Row>
                <div> <span className="text-danger font-size-12">
                  <strong>
                    Note: Only payments with the Cleared and Approved status will show here.

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
                              <th scope="col">Date Time</th>
                              {/* <th scope="col">ID</th> */}
                              <th scope="col">Description</th>
                              <th scope="col">Credit</th>
                              <th scope="col">Debit</th>
                              <th scope="col">Balance</th>

                              {/* <th scope="col">Is Settled</th> */}
                            </tr>
                          </thead>
                          </Table>
                          </div>
                          </CardBody>
                          </Card>
                          </Col>
                          </Row>)}
            {!isEmpty(this.props.donoraccountStatements) && (
              <Row>
                 <div> <span className="text-danger font-size-12">
                  <strong>
                    Note: Only MIF with the Cleared and Approved status will show here.

                  </strong>
                  </span>
                </div>
                {/* <div>
                    <span className="font-size-12">
                      <strong><span className="text-danger">Note:</span></strong> <strong>MIF Payments Means: (Payment Credited in Account) </strong>
                    </span>
                  </div>
                <div>
                    <span className="font-size-12">
                      <strong><span className="text-danger">Note:</span></strong> <strong>INVOICE Payments Means: (Payment Debited in Account) </strong>
                    </span>
                  </div> */}
                <Col lg="12">
                  <Card>
                    <CardBody>
                      <div className="table-responsive">
                        <Table>
                          <thead className="table-light">
                            <tr>
                              <th scope="col">Date</th>
                              <th scope="col">Payment Date</th>
                              {/* <th scope="col">ID</th> */}
                              <th scope="col">Description</th>
                              <th scope="col">Credit</th>
                              <th scope="col">Debit</th>
                              <th scope="col">Balance</th>

                              {/* <th scope="col">Is Settled</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {donoraccountStatements.map((donoraccountStatement, i) => (
                              <>
                                {donoraccountStatement.transaction_type == "In" ? (
                                  // <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
                                  <tr key={i} className="badge-soft-primary">
                                    <td>
                                      <p className="text-muted mb-0">
                                        {/* {donoraccountStatement.PaidAt} */}
                                        {/* {new Date(donoraccountStatement.PaidAt).toLocaleString("en-US")} */}
                                        {moment(donoraccountStatement.clearedat).format("DD MMM YYYY")}


                                      </p>
                                    </td>
                                    <td>
                                      {donoraccountStatement.PaidMethod === "Cheque" || donoraccountStatement.PaidMethod === "Card" ? (
                                        <p className="text-muted mb-0">
                                        {moment(donoraccountStatement.PaidAt).format("DD MMM YYYY")}
                                        </p>

                                      ):(
                                        <p>
                                         {"--"}
                                        </p>
                                      )}</td>
                                    <td>
                                        <span>
                                          {<span><span style={{ color: 'red' }}>MIF ID: </span> {donoraccountStatement.paymentin} , <span style={{ color: 'red' }}>Payment Method: </span> {donoraccountStatement.PaidMethod}</span>}{" "}
                                          {/* {donoraccountStatement.Status} */}
                                        </span>
                                      {/* </p> */}
                                    </td>
                                     <td>
                                      {donoraccountStatement.Debit == 0 ? (
                                        <p className="d-none">
                                         {donoraccountStatement.Debit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p>
                                         {donoraccountStatement.Debit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    
                                      {donoraccountStatement.Credit == 0 ? (
                                        <p className="d-none">
                                         {donoraccountStatement.Credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p>
                                         {donoraccountStatement.Credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                     <td>
                                      {donoraccountStatement.Debit == 0 ? (
                                        <p className="d-none">
                                         {donoraccountStatement.Debit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p>
                                         {donoraccountStatement.Debit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                     <td>
                                      {donoraccountStatement.Balance == 0 ? (
                                        <p className="d-none">
                                         {donoraccountStatement.Balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p>
                                         {donoraccountStatement.Balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                  </tr>
                                ) : (
                                  <tr key={i}>
                                    <td>
                                      <p className="text-muted mb-0">
                                        {/* {donoraccountStatement.PaidAt} */}
                                        {/* {new Date(donoraccountStatement.PaidAt).toLocaleString("en-US")} */}
                                        {moment(donoraccountStatement.PaidAt).format("DD MMM YYYY")}


                                      </p>
                                    </td>
                                    <td>
                                        <p>
                                         {"--"}
                                        </p>
                                      </td>
                                    {/* <td>
                                      <h5 className="font-size-14 text-truncate">
                                        <strong>{donoraccountStatement.paymentin}</strong>
                                      </h5>
                                    </td> */}
                                    <td>
                                        <span>
                                          {<span><span style={{ color: 'red' }}>Lab Name: </span> {donoraccountStatement.lab_name} ,<span style={{ color: 'red' }}>Lab City: </span> {donoraccountStatement.lab_name} ,<span style={{ color: 'red' }}>Patient Name: </span> {donoraccountStatement.patient_name} ,<span style={{ color: 'red' }}>INVOICE ID: </span> {donoraccountStatement.paymentin}</span>}{" "}
                                          {/* {donoraccountStatement.Status} */}
                                        </span>
                                      {/* </p> */}
                                    </td>
                                     <td>
                                      {donoraccountStatement.Credit == 0 ? (
                                        <p className="d-none">
                                         {donoraccountStatement.Credit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p>
                                         {donoraccountStatement.Credit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                     <td>
                                      {donoraccountStatement.Debit == 0 ? (
                                        <p className="d-none">
                                         {donoraccountStatement.Debit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p>
                                         {donoraccountStatement.Debit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                     <td>
                                      {donoraccountStatement.Balance == 0 ? (
                                        
                                        <p className="d-none">
                                         {donoraccountStatement.Balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      ):(
                                        <p>
                                         {donoraccountStatement.Balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                  </tr>
                                )}
                              </>
                            )
                            )}
                            <tr className="bg-success bg-soft">
                              <td colSpan="3" className="border-0 text-end">
                                <strong>Total</strong>
                              </td>
                              <td className="border-10">
                                {
                                  this.props.donoraccountStatements.slice(-1).pop().total_Credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                              <td className="border-10">
                                {
                                  this.props.donoraccountStatements.slice(-1).pop().total_Debit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td> <td className="border-10">
                                {
                                  this.props.donoraccountStatements.slice(-1).pop().Balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
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
  donoraccountStatements: PropTypes.array,
  className: PropTypes.any,
  onGetDonorAccountStatements: PropTypes.func,
};

const mapStateToProps = ({ donoraccountStatements }) => ({
  donoraccountStatements: donoraccountStatements.donoraccountStatements,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetDonorAccountStatements: id => dispatch(getDonorAccountStatements(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AccountStatements));
