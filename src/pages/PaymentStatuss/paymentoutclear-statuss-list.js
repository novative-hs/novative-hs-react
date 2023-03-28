import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  Input,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getPaymentOutClearStatuss,
} from "store/payment-statuss/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class PaymentStatussList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      paymentStatuss: [],
      paymentStatus: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      paymentStatusListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, paymentStatus) => (
            <>{paymentStatus.id}</>
          ),
        },
        {
          text: "MOF ID",
          dataField: "id",
          sort: true,
          hidden: false,
          formatter: (cellContent, paymentStatus) => (
              <>{paymentStatus.id}</>
          ),
      },
        {
          dataField: "invoice_id",
          text: "invoice ID",
          sort: true,
          hidden: true,
          formatter: (cellContent, paymentStatus) => (
            <>
              <strong>{paymentStatus.invoice_id}</strong>
            </>
          ),
        },
        {
          dataField: "payment_method",
          text: "Payment Method",
          sort: true,
        },
        {
          dataField: "payment_for",
          text: "Payment To",
          sort: true,
        },
        {
          dataField: "lab_name",
          text: "Client Name",
          sort: true,
        formatter: (cellContent, paymentStatus) => (
          <>
            <span>
              <span>
                {paymentStatus.lab_name}{" "}
                {paymentStatus.donor_name}
                {paymentStatus.advertisement_title}

              </span>
            </span>
          </>
        ),
        },
        {
          dataField: "amount",
          text: "Amount",
          sort: true,
        },
        // {
        //   dataField: "deposited_at",
        //   text: "Deposited Date",
        //   sort: true,
        // },
        
        {
          dataField: "bank",
          text: "Bank/Account#",
          sort: true,
          formatter: (cellContent, paymentStatus) => (
            <>
              <span>
                <span>
                  {paymentStatus.bank_name},{" "}
                  {paymentStatus.account_no}
                </span>
              </span>
            </>
          ),
        },
        {
          dataField: "deposit_slip",
          text: "Slip",
          sort: true,
          formatter: (cellContent, approvedInPayment) => (
            <>
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL +
                    approvedInPayment.deposit_slip,
                }}
                target="_blank"
              >
                View Slip
              </Link>
            </>
          ),
        },
        // {
        //   dataField: "is_settled",
        //   text: "Is Settled",
        //   sort: true,
        // },
        // {
        //   dataField: "verified_by",
        //   text: "Verified By",
        //   sort: true,
        // },
        {
          dataField: "cleared_at",
          text: "Cleared Date",
          sort: true,
          formatter: (cellContent, paymentStatuss) => (
            <p className="text-muted mb-0">
            {new Date(paymentStatuss.cleared_at).toLocaleString("en-US")}
          </p>                    ),
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    // this.handlePaymentStatusClicks =
    //   this.handlePaymentStatusClicks.bind(this);
  }

  componentDidMount() {
    const { paymentStatuss, onGetPaymentOutClearStatuss } = this.props;
    onGetPaymentOutClearStatuss(this.state.user_id);
    this.setState({ paymentStatuss });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { paymentStatuss } = this.props;
    if (
      !isEmpty(paymentStatuss) &&
      size(prevProps.paymentStatuss) !== size(paymentStatuss)
    ) {
      this.setState({ paymentStatuss: {}, isEdit: false });
    }
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

  /* Insert,Update Delete data */

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  render() {
    const { SearchBar } = Search;

    const { paymentStatuss } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onGetPaymentOutClearStatuss,
    } = this.props;
    const paymentStatus = this.state.paymentStatus;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: paymentStatuss.length, // replace later with size(paymentStatuss),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    return (
      <React.Fragment>
        <div className="page-content">
        <MetaTags>
            <title>MIF List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="List"
              breadcrumbItem="MIF Cleared"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.paymentStatusListColumns}
                      data={paymentStatuss}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.paymentStatusListColumns}
                          data={paymentStatuss}
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

PaymentStatussList.propTypes = {
  match: PropTypes.object,
  paymentStatuss: PropTypes.array,
  className: PropTypes.any,
  onGetPaymentOutClearStatuss: PropTypes.func,
};

const mapStateToProps = ({ paymentStatuss }) => ({
  paymentStatuss: paymentStatuss.paymentStatuss,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetPaymentOutClearStatuss: id => dispatch(getPaymentOutClearStatuss(id)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaymentStatussList));
