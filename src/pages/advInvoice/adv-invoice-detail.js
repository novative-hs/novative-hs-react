import React, { Component } from "react";
import MetaTags from "react-meta-tags";
import { Link, withRouter } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { isEmpty, map } from "lodash";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import logo from "../../assets/images/logo-dark.png";

import PropTypes from "prop-types";
import { getAdvInvoiceDetail } from "store/adv-invoice/actions";
import { connect } from "react-redux";

class AdvInvoiceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      advInvoiceDetail: [],
      
    }
    this.node = React.createRef();
  }

  componentDidMount() {
    const { onGetAdvInvoiceDetail } = this.props;
    console.log(onGetAdvInvoiceDetail(this.props.match.params.id));
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
            {!isEmpty(this.props.advInvoiceDetail) && (
              console.log("advinvoice",this.props.advInvoiceDetail),
              <Row>
                <Col lg="6">
                  <Card>
                    <CardBody>
                      <div className="invoice-title">
                        <h4 className="float-end font-size-16">
                          Order ID: {this.props.advInvoiceDetail.advertisement_id}
                        </h4>
                        <div className="mb-4">
                          <img src={logo} alt="logo" height="20" />
                        </div>
                      </div>
                      <hr/>
                      <Row>
                        <Col sm="6" className="mt-3">
                          <address>
                            <strong>Advertisement Detail:</strong>
                            <br />
                            {this.props.advInvoiceDetail.invoice_type}
                            <br />
                            {this.props.advInvoiceDetail.lab_id}
                            <br />
                            {this.props.advInvoiceDetail.total_dues}
                          </address>
                        </Col>
                        {/* <Col sm="6" className="mt-3 text-sm-end">
                          <address>
                            <strong>Lab Detail:</strong>
                            <br />
                            NTN # {this.props.advInvoiceDetail.lab_ntn}
                            <br />
                            {this.props.advInvoiceDetail.lab_name}
                            <br />
                            {this.props.advInvoiceDetail.lab_email}
                            <br />
                            {this.props.advInvoiceDetail.lab_address}
                          </address>
                        </Col> */}
                      </Row>
                      <Row>
                        <Col sm="6" className="mt-3 text-sm-end">
                          <address>
                            <strong>Order Date:</strong>
                            <br />
                              {this.props.advInvoiceDetail.invoice_generated_at}
                            <br />
                          </address>
                        </Col>
                      </Row>               
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

AdvInvoiceDetail.propTypes = {
  match: PropTypes.object,
  advInvoiceDetail: PropTypes.object,
  onGetAdvInvoiceDetail: PropTypes.func,
};

const mapStateToProps = ({ advInvoiceDetail }) => ({
  advInvoiceDetail: advInvoiceDetail.advInvoiceDetail,
});

const mapDispatchToProps = dispatch => ({
  onGetAdvInvoiceDetail: id => dispatch(getAdvInvoiceDetail(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AdvInvoiceDetail));
