import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  ModalHeader,
  Container,
  Row,
  Label,
  Modal,
  ModalBody,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";

//Import Breadcrumb
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getClearedInPayments,
  updateApproveUnapproveInPayment,
} from "store/finance-admin/actions";

import ApproveUnapproveModal from "components/Common/ApproveUnapproveModal";
import "assets/scss/table.scss";

class PendingB2BClients extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      clearedInPayments: [],
      id: "",
      isApproved: false,
      unapprovedModal: false,
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      clearedInPayment: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
        clearedInPaymentListColumns: [
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
          {
            dataField: "menu",
            isDummyField: true,
            editable: false,
            text: "Action",
            formatter: (cellContent, clearedInPayment) => (
              <div className="d-flex gap-3">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={e =>
                      this.handlePaymentStatusClick(e, clearedInPayment)
                    }
                  ></i>
                </Link>
                
              </div>
            ),
          },
        ],
    };
    this.handlePaymentStatusClick =
    this.handlePaymentStatusClick.bind(this);
    this.toggle = this.toggle.bind(this);
    // this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
  }

  componentDidMount() {
    const { clearedInPayments, onGetClearedInPayments } = this.props;
    onGetClearedInPayments(this.state.user_id);
    this.setState({ clearedInPayments });
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
  handlePaymentStatusClick = (e, arg) => {
    this.setState({
      clearedInPayment: {
        id: arg.id,
        is_approved: arg.is_approved,
        payment_status: arg.payment_status,

      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const {
      onUpdateApproveUnapproveInPayment,
      onGetClearedInPayments,
    } = this.props;
    const { isEdit, deleteModal } = this.state;

    const clearedInPayment = this.state.clearedInPayment;


    const { clearedInPayments } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: 100, // replace later with size(clearedInPayments),
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
            <title>Cleared In Payments | Lab Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="In Payments" breadcrumbItem="Cleared" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.clearedInPaymentListColumns}
                      data={clearedInPayments}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.clearedInPaymentListColumns}
                          data={clearedInPayments}
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

<Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? "Edit Quality Certificate"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            deposit_at:
                                              (this.state.clearedInPayment &&
                                                this.state.clearedInPayment
                                                  .deposit_at) ||
                                              "",
                                            deposit_bank:
                                              (this.state.clearedInPayment &&
                                                this.state.clearedInPayment
                                                  .deposit_bank) ||
                                              "",
                                            deposit_slip:
                                              (this.state.clearedInPayment &&
                                                this.state.clearedInPayment
                                                  .deposit_slip) ||
                                              "",
                                            is_approved:
                                              (this.state.clearedInPayment &&
                                                this.state.clearedInPayment
                                                  .is_approved) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            
                                          })}
                                          onSubmit={values => {
                                            const updateApproveUnapproveInPayment =
                                            {
                                              id: clearedInPayment.id,
                                              is_approved:
                                                values.is_approved,
                                              
                                            };

                                          // update PaymentStatus
                                          onUpdateApproveUnapproveInPayment(
                                            updateApproveUnapproveInPayment
                                          );
                                          setTimeout(() => {
                                            onGetClearedInPayments(
                                              this.state.user_id
                                            );
                                          }, 1000);
                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <Field
                                                    type="hidden"
                                                    className="form-control"
                                                    name="hiddenEditFlag"
                                                    value={isEdit}
                                                  />
                                                   {/* Payment Cleared Date and Time */}
                                                 
                                                  {/* Is Approced Type field */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Approved
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="is_approved"
                                                      as="select"
                                                      // className="form-control"
                                                      className={
                                                        "form-control" +
                                                        (errors.is_approved &&
                                                        touched.is_approved
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          clearedInPayment: {
                                                            id: clearedInPayment.id,
                                                            is_approved :
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      multiple={false}
                                                      value={
                                                        this.state
                                                          .clearedInPayment
                                                          .is_approved
                                                      }
                                                    >
                                                      <option value="">
                                                        --- Please select
                                                        type ---
                                                      </option>
                                                      <option value="True">
                                                      Yes
                                                      </option>
                                                      <option value="False">
                                                      No
                                                      </option>
                                                      
                                                    </Field>
                                                    <ErrorMessage
                                                      name="is_approved"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                 
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col>
                                                  <div className="text-end">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-success save-user"
                                                    >
                                                      Save
                                                    </button>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </Form>
                                          )}
                                        </Formik>
                                      </ModalBody>
                                    </Modal>

                                  </div>
                                </Col>
                              </Row>
                              {/* <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row> */}
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

PendingB2BClients.propTypes = {
  match: PropTypes.object,
  clearedInPayments: PropTypes.array,
  className: PropTypes.any,
  onGetClearedInPayments: PropTypes.func,
  onUpdateApproveUnapproveInPayment: PropTypes.func,
};
const mapStateToProps = ({ financeAdmin }) => ({
  clearedInPayments: financeAdmin.clearedInPayments,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onUpdateApproveUnapproveInPayment: data =>
    dispatch(updateApproveUnapproveInPayment(data)),
  onGetClearedInPayments: id => dispatch(getClearedInPayments(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PendingB2BClients));
