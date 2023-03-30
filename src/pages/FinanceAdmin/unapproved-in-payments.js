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
  getUnapprovedInPayments,
} from "store/finance-admin/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class PaymentStatussList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      unapprovedInPayments: [],
      unapprovedInPayment: "",
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
          text: "MIF ID",
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
          dataField: "payment_for",
          text: "Payment From",
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
          dataField: "payment_method",
          text: "Payment Method",
          sort: true,
        },
        {
          dataField: "cheque_no",
          text: "Cheque/Ref#",
          sort: true,
          formatter: (cellContent, paymentStatus) => (
              <>
                  {paymentStatus.cheque_no && (
                      <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                          {paymentStatus.cheque_no}
                      </span>
                  )}

                  {paymentStatus.cheque_no && (
                      <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-info">
                          {paymentStatus.refered_no}
                      </span>
                  )}
              </>
          ),
      },
      
        {
          dataField: "amount",
          text: "Amount",
          sort: true,
        },
        
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
          text: "Deposit Slip",
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
        {
          dataField: "verified_by",
          text: "Deposited By",
          sort: true,
        },
        {
          dataField: "cleared_at",
          text: "Cleared Date",
          sort: true,
          formatter: (cellContent, paymentStatus) => (
            <p className="text-muted mb-0">
            {new Date(paymentStatus.cleared_at).toLocaleDateString("en-US", {
                dateStyle: "short",
                timeZone: "UTC",
                }).replace(/\//g, " - ")}</p>),
        },
        {
          dataField: "payment_status",
          text: "Status",
          sort: true,
        },
        // {
        //   dataField: "menu",
        //   isDummyField: true,
        //   editable: false,
        //   text: "Action",
        //   formatter: (cellContent, paymentStatus) => (
        //     <div className="d-flex gap-3">
        //       <Link className="text-success" to="#">
        //         <i
        //           className="mdi mdi-pencil font-size-18"
        //           id="edittooltip"
        //           onClick={e =>
        //             this.handlePaymentStatusClick(e, paymentStatus)
        //           }
        //         ></i>
        //       </Link>
              
        //     </div>
        //   ),
        // },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { unapprovedInPayments, onGetUnapprovedInPayments } = this.props;
    onGetUnapprovedInPayments(this.state.user_id);
    this.setState({ unapprovedInPayments });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { unapprovedInPayments } = this.props;
    if (
      !isEmpty(unapprovedInPayments) &&
      size(prevProps.unapprovedInPayments) !== size(unapprovedInPayments)
    ) {
      this.setState({ unapprovedInPayments: {}, isEdit: false });
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

    const { unapprovedInPayments } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onGetUnapprovedInPayments,
    } = this.props;
    const unapprovedInPayment = this.state.unapprovedInPayment;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: unapprovedInPayments.length, // replace later with size(unapprovedInPayments),
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
            <title>Payments In with Approvel Status | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Payments In"
              breadcrumbItem=" Approvel Status List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.paymentStatusListColumns}
                      data={unapprovedInPayments}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.paymentStatusListColumns}
                          data={unapprovedInPayments}
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
  unapprovedInPayments: PropTypes.array,
  className: PropTypes.any,
  onGetUnapprovedInPayments: PropTypes.func,
};

const mapStateToProps = ({ financeAdmin }) => ({
  unapprovedInPayments: financeAdmin.unapprovedInPayments,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetUnapprovedInPayments: id => dispatch(getUnapprovedInPayments(id)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaymentStatussList));
