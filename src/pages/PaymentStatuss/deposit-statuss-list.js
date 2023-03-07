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
  getDepositStatuss,
  updatePaymentInStatus,
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
      status:"Deposited",
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
          dataField: "invoice_id",
          text: "invoice ID",
          sort: true,
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
                {paymentStatus.lab_id}{" "}
                {paymentStatus.donor_id}
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
          dataField: "deposited_at",
          text: "Deposited Date",
          sort: true,
        },
        // {
        //   dataField: "deposit_bank",
        //   text: "Deposit Bank",
        //   sort: true,
        // },
        {
          dataField: "cheque_image",
          text: "Deposite Copy",
          sort: true,
          formatter: (cellContent, paymentStatus) => (
            <>
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + paymentStatus.cheque_image,
                }}
                target="_blank"
              >
                View
              </Link>
            </>
          ),
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, paymentStatus) => (
            <div className="d-flex gap-3">
            
              <button
                type="submit"
                className="btn btn-primary save-user"
                onClick={e => this.handlePaymentStatusClick(e, paymentStatus)}

              >
                Update
              </button>
              
            </div>
          ),
        },
      ],
    };
    this.handlePaymentStatusClick =
      this.handlePaymentStatusClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handlePaymentStatusClicks =
      this.handlePaymentStatusClicks.bind(this);
  }

  componentDidMount() {
    const { paymentStatuss, onGetDepositStatuss } = this.props;
    onGetDepositStatuss(this.state.user_id);
    this.setState({ paymentStatuss });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handlePaymentStatusClicks = () => {
    this.setState({
      paymentStatus: "",
      deposit_slip: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
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


  handlePaymentStatusClick = (e, arg) => {
    this.setState({
      paymentStatus: {
        id: arg.id,
        cleared_at: arg.cleared_at,
        is_cleared: arg.is_cleared,
        status: arg.status,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { paymentStatuss } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onUpdatePaymentInStatus,
      onGetDepositStatuss,
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
              breadcrumbItem="MIF Deposited"
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

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? "Edit MIF Deposited"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            is_cleared:
                                              (this.state.paymentStatus &&
                                                this.state.paymentStatus
                                                  .is_cleared) ||
                                              "",
                                            cleared_at:
                                              (this.state.paymentStatus &&
                                                this.state.paymentStatus
                                                  .cleared_at) ||
                                              "",
                                            status:
                                              (this.state.paymentStatus &&
                                                this.state.paymentStatus
                                                  .status) ||
                                              "",

                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            

                                           
                                          })}
                                          onSubmit={values => {
                                            const updatePaymentInStatus =
                                            {
                                              id: paymentStatus.id,
                                             
                                              is_cleared: values.is_cleared,
                                             
                                            };

                                          // update PaymentStatus
                                          onUpdatePaymentInStatus(
                                            updatePaymentInStatus
                                          );
                                          setTimeout(() => {
                                            onGetDepositStatuss(
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
                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Varified By
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Input
                                                      name="is_cleared"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .paymentStatus
                                                          .is_cleared
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentStatus: {
                                                            id: paymentStatus.id,
                                                            status:
                                                              paymentStatus.status,
                                                            cleared_at: paymentStatus.cleared_at,
                                                            is_cleared:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.is_cleared &&
                                                        touched.is_cleared
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="is_cleared"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div> */}

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Is Cleared
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="is_cleared"
                                                      as="select"
                                                      // className="form-control"
                                                      className={
                                                        "form-control" +
                                                        (errors.is_cleared &&
                                                        touched.is_cleared
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentStatus: {
                                                            id: paymentStatus.id,
                                                            // deposit_bank:
                                                            //   paymentStatus.deposit_bank,
                                                            // // deposited_at: paymentStatus.deposit_bank,
                                                            // deposit_slip: paymentStatus.deposit_slip,
                                                            is_cleared :
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      multiple={false}
                                                      value={
                                                        this.state
                                                          .paymentStatus
                                                          .is_cleared
                                                      }
                                                    >
                                                      <option value="">
                                                        --- Please select type ---
                                                      </option>
                                                      <option value="Yes">
                                                      Yes
                                                      </option>
                                                      <option value="No">
                                                      No
                                                      </option>
                                                     
                                                      
                                                    </Field>
                                                    <ErrorMessage
                                                      name="is_cleared"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                 
                                                  {/* Certificate Type field */}
                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Status Type
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="status"
                                                      as="select"
                                                      // className="form-control"
                                                      className={
                                                        "form-control" +
                                                        (errors.status &&
                                                        touched.status
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentStatus: {
                                                            id: paymentStatus.id,
                                                            cleared_at: paymentStatus.cleared_at,
                                                            is_cleared: paymentStatus.is_cleared,
                                                            status :
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      multiple={false}
                                                      value={
                                                        this.state
                                                          .paymentStatus
                                                          .status
                                                      }
                                                    >
                                                      <option value="">
                                                        --- Please select
                                                        status type ---
                                                      </option>
                                                      <option value="Created">
                                                      Created
                                                      </option>
                                                      <option value="Deposited">
                                                      Deposited
                                                      </option>
                                                      <option value="Cleared">
                                                      Cleared
                                                      </option>
                                                      
                                                    </Field>
                                                    <ErrorMessage
                                                      name="status"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div> */}

                                                 
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
  onGetDepositStatuss: PropTypes.func,
  onUpdatePaymentInStatus: PropTypes.func,
};

const mapStateToProps = ({ paymentStatuss }) => ({
  paymentStatuss: paymentStatuss.paymentStatuss,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetDepositStatuss: id => dispatch(getDepositStatuss(id)),
  onUpdatePaymentInStatus: paymentStatus =>
    dispatch(updatePaymentInStatus(paymentStatus)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaymentStatussList));
