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
  getApprovedInPayments,
} from "store/finance-admin/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class PaymentStatussList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      approvedInPayments: [],
      approvedInPayment: "",
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
          formatter: (cellContent, approvedInPayment) => (
            <>{approvedInPayment.id}</>
          ),
        },
        {
          dataField: "invoice_id",
          text: "invoice ID",
          sort: true,
          formatter: (cellContent, approvedInPayment) => (
            <>
              <strong>{approvedInPayment.invoice_id}</strong>
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
          text: "Payment For",
          sort: true,
        },
        {
          dataField: "amount",
          text: "Amount",
          sort: true,
        },
        {
          dataField: "deposited_at",
          text: "Deposit at",
          sort: true,
          // formatter: (cellContent, approvedInPayment) => (
          //   <>
          //     <span>
          //       {new Date(approvedInPayment.deposit_at).toLocaleString("en-US")}
          //     </span>
          //   </>
          // ),
        },
        {
          dataField: "deposit_bank",
          text: "Deposit Bank",
          sort: true,
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
        {
          dataField: "verified_by",
          text: "Verified By",
          sort: true,
        },
        {
          dataField: "cleared_at",
          text: "Clear at",
          sort: true,
          // formatter: (cellContent, approvedInPayment) => (
          //   <>
          //     <span>
          //       {new Date(approvedInPayment.deposit_at).toLocaleString("en-US")}
          //     </span>
          //   </>
          // ),
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { approvedInPayments, onGetApprovedInPayments } = this.props;
    onGetApprovedInPayments(this.state.user_id);
    this.setState({ approvedInPayments });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { approvedInPayments } = this.props;
    if (
      !isEmpty(approvedInPayments) &&
      size(prevProps.approvedInPayments) !== size(approvedInPayments)
    ) {
      this.setState({ approvedInPayments: {}, isEdit: false });
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

    const { approvedInPayments } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onGetApprovedInPayments,
    } = this.props;
    const approvedInPayment = this.state.approvedInPayment;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: approvedInPayments.length, // replace later with size(approvedInPayments),
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
              breadcrumbItem="Approvel Status List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.paymentStatusListColumns}
                      data={approvedInPayments}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.paymentStatusListColumns}
                          data={approvedInPayments}
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
  approvedInPayments: PropTypes.array,
  className: PropTypes.any,
  onGetApprovedInPayments: PropTypes.func,
};

const mapStateToProps = ({ financeAdmin }) => ({
  approvedInPayments: financeAdmin.approvedInPayments,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetApprovedInPayments: id => dispatch(getApprovedInPayments(id)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaymentStatussList));
