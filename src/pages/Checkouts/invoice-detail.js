import React, { Component } from "react";
import MetaTags from "react-meta-tags";
import { Link, withRouter } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { isEmpty, map } from "lodash";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import logo from "../../assets/images/logo-dark.png";

import PropTypes from "prop-types";
import { getInvoiceDetail } from "store/invoices/actions";
import { connect } from "react-redux";

class InvoiceDetail extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
  }

  componentDidMount() {
    const { onGetInvoiceDetail } = this.props;
    onGetInvoiceDetail(this.props.match.params.id);
  }

  //Print the Invoice
  printInvoice = () => {
    window.print();
  };

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Invoice Detail | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Invoices" breadcrumbItem="Invoice Detail" />
            {!isEmpty(this.props.invoiceDetail) && (
              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody>
                      <div className="invoice-title">
                        <h4 className="float-end font-size-16">
                          Order ID: {this.props.invoiceDetail[0].order_id}
                        </h4>
                        <div className="mb-4">
                          <img src={logo} alt="logo" height="20" />
                        </div>
                      </div>
                      <hr />
                      <Row>
                        <Col sm="6" className="mt-3">
                          <address>
                            <strong>Patient Detail:</strong>
                            <br />
                            {this.props.invoiceDetail[0].patient_name}
                            <br />
                            {this.props.invoiceDetail[0].patient_phone}
                            <br />
                            {this.props.invoiceDetail[0].patient_email}
                          </address>
                        </Col>
                        <Col sm="6" className="mt-3 text-sm-end">
                          <address>
                            <strong>Lab Detail:</strong>
                            <br />
                            NTN # {this.props.invoiceDetail[0].lab_ntn}
                            <br />
                            {this.props.invoiceDetail[0].lab_name}
                            <br />
                            {this.props.invoiceDetail[0].lab_email}
                            <br />
                            {this.props.invoiceDetail[0].lab_address}
                          </address>
                        </Col>
                      </Row>

                      <Row>
                        <Col sm="6" className="mt-3">
                          <address>
                            <strong>Payment Detail:</strong>
                            <br />
                            {this.props.invoiceDetail[0].payment_method}
                            <br />
                            {this.props.invoiceDetail[0].payment_status}
                            <br />
                            {this.props.invoiceDetail[0].payment_method ==
                            "Card" ? (
                              <>
                                {new Date(
                                  this.props.invoiceDetail[0].paid_at
                                ).toLocaleString("en-US")}
                              </>
                            ) : null}
                          </address>
                        </Col>

                        <Col sm="6" className="mt-3 text-sm-end">
                          <address>
                            <strong>Order Detail:</strong>
                            <br />
                            {new Date(
                              this.props.invoiceDetail[0].invoice_generated_at
                            ).toLocaleString("en-US")}
                            <br />
                            <br />
                          </address>
                        </Col>
                      </Row>

                      <div className="py-2 mt-3">
                        <h3 className="font-size-15 font-weight-bold">
                          Order summary
                        </h3>
                      </div>
                      <div className="table-responsive">
                        <Table className="table-nowrap">
                          <thead>
                            <tr>
                              <th style={{ width: "70px" }}>No.</th>
                              <th className="text-start">Test Name</th>
                              <th className="text-start">Test Type</th>
                              <th className="text-end">Price</th>
                              <th className="text-end">Discount By Lab</th>
                              <th className="text-end">Discount By LabHazir</th>
                              {/* <th className="text-end">Discount</th> */}
                              <th className="text-end">
                                Sub Total
                              </th>

                            </tr>
                          </thead>
                          <tbody>
                            {map(
                              this.props.invoiceDetail[0].items,
                              (item, key) => (
                                <tr key={key}>
                                  <td>{key + 1}</td>
                                  <td className="text-start">{item.test_name}</td>
                                  <td className="text-start">{item.test_categories}</td>
                                  <td className="text-end">{item.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                  <td className="text-end">{item.discount}{"%"}</td>
                                  <td className="text-end">{item.discount_by_labhazir+item.discount_by_labhazird_by_test}{"%"}</td>
                                   {/* <td className="text-end">{item.discount_by_labhazird_by_test}</td> */}
                                   <td className="text-end">
                                  {item.total_test_cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  //  -
                                  //   this.props.invoiceDetail[0]
                                  //     .home_sampling_charges
                                      }
                              </td>
                                </tr>
                              )
                            )}
                            <tr>
                              <td colSpan="6" className="border-0 text-end">
                                <strong>Sampling Fee</strong>
                              </td>
                              <td className="border-10 text-end">
                                {
                                  this.props.invoiceDetail[0]
                                    .home_sampling_charges.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="6" className="border-10 text-end">
                                <strong>Total</strong>
                              </td>
                              <td className="border-10 text-end">
                                <h4 className="m-0">
                                  {this.props.invoiceDetail[0].total_dues +
                                    this.props.invoiceDetail[0]
                                      .home_sampling_charges}
                                </h4>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                      <div> <span className="text-danger font-size-12">
                                    <strong> 
                                    Note: Numbers may not add up due to rounding, it is inconsequential enough to be ignored.
                                    </strong>
                                  </span>
                                  </div>
                      <div className="d-print-none">
                        <div className="float-end">
                          <Link
                            to="#"
                            onClick={this.printInvoice}
                            className="btn btn-success me-1"
                          >
                            <i className="fa fa-print" />
                          </Link>{" "}
                          <Link to="#" className="btn btn-primary w-md">
                            Send
                          </Link>
                        </div>
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

InvoiceDetail.propTypes = {
  match: PropTypes.object,
  invoiceDetail: PropTypes.object,
  onGetInvoiceDetail: PropTypes.func,
};

const mapStateToProps = ({ invoices }) => ({
  invoiceDetail: invoices.invoiceDetail,
});

const mapDispatchToProps = dispatch => ({
  onGetInvoiceDetail: id => dispatch(getInvoiceDetail(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InvoiceDetail));