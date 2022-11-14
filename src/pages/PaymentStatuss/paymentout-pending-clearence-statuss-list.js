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
  getPaymentOutStatuss,
  updatePaymentOutStatus,
} from "store/payment-statuss/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class PaymentStatussList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      paymentOutStatuss: [],
      paymentOutStatus: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      paymentOutStatusListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: false,
          formatter: (cellContent, paymentOutStatus) => (
            <>{paymentOutStatus.id}</>
          ),
        },
        {
          dataField: "invoice_id",
          text: "invoice ID",
          sort: true,
          hidden: true,
          formatter: (cellContent, paymentOutStatus) => (
            <>
              <strong>{paymentOutStatus.invoice_id}</strong>
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
        formatter: (cellContent, paymentCreatedStatus) => (
          <>
            <span>
              <span>
                {paymentCreatedStatus.lab_name}{" "}
                {paymentCreatedStatus.b2b_id}
              </span>
            </span>
          </>
        ),
        },
        {
          dataField: "payment_at",
          text: "Payment Date",
          sort: true,
        },
        {
          dataField: "cheque_no",
          text: "Cheque/Online Ref#",
          sort: true,
        },
        {
          dataField: "amount",
          text: "Payment",
          sort: true,
        },
        {
          dataField: "bank",
          text: "Bank/Account#",
          sort: true,
          formatter: (cellContent, paymentOutStatus) => (
            <>
              <span>
                <span>
                  {paymentOutStatus.bank_name},{" "}
                  {paymentOutStatus.account_no}
                </span>
              </span>
            </>
          ),
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
        },
        {
          dataField: "deposit_copy",
          text: "Deposite Copy",
          sort: true,
          formatter: (cellContent, paymentOutStatus) => (
            <>
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + paymentOutStatus.deposit_copy,
                }}
                target="_blank"
              >
                View
              </Link>
            </>
          ),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, paymentOutStatus) => (
            <div className="d-flex gap-3">
             
              <button
                type="submit"
                className="btn btn-primary save-user"
                onClick={e => this.handlePaymentStatusClick(e, paymentOutStatus)}

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
  // The code for converting "image source" (url) to "Base64"
  // toDataURL = url =>
  //   fetch(url)
  //     .then(response => response.blob())
  //     .then(
  //       blob =>
  //         new Promise((resolve, reject) => {
  //           const reader = new FileReader();
  //           reader.onloadend = () => resolve(reader.deposit_slip);
  //           reader.onerror = reject;
  //           reader.readAsDataURL(blob);
  //         })
  //     );

  // // The code for converting "Base64" to javascript "File Object"
  // dataURLtoFile = (dataurl, filename) => {
  //   var arr = dataurl.split(","),
  //     mime = arr[0].match(/:(.*?);/)[1],
  //     bstr = atob(arr[1]),
  //     n = bstr.length,
  //     u8arr = new Uint8Array(n);
  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   return new File([u8arr], filename, { type: mime });
  // };
  componentDidMount() {
    const { paymentOutStatuss, onGetPaymentOutStatuss } = this.props;
    onGetPaymentOutStatuss(this.state.user_id);
    this.setState({ paymentOutStatuss });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handlePaymentStatusClicks = () => {
    this.setState({
      paymentOutStatus: "",
      deposit_slip: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { paymentOutStatuss } = this.props;
    if (
      !isEmpty(paymentOutStatuss) &&
      size(prevProps.paymentOutStatuss) !== size(paymentOutStatuss)
    ) {
      this.setState({ paymentOutStatuss: {}, isEdit: false });
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
      paymentOutStatus: {
        id: arg.id,
        // cleared_at: arg.cleared_at,
        is_cleared: arg.is_cleared,
        cleared_at: arg.cleared_at,
        status: arg.status,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { paymentOutStatuss } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onUpdatePaymentOutStatus,
      onGetPaymentOutStatuss,
    } = this.props;
    const paymentOutStatus = this.state.paymentOutStatus;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: 100, // replace later with size(paymentOutStatuss),
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
            <title>MOF List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="List"
              breadcrumbItem="MOF Pending Clearence"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.paymentOutStatusListColumns}
                      data={paymentOutStatuss}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.paymentOutStatusListColumns}
                          data={paymentOutStatuss}
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
                                          ? "Edit MOF"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            // cleared_at:
                                            //   (this.state.paymentOutStatus &&
                                            //     this.state.paymentOutStatus
                                            //       .cleared_at) ||
                                            //   "",
                                            // deposit_bank: (this.state && this.state.deposit_bank) || "",
                                            // deposit_slip: (this.state && this.state.deposit_slip) || "",
                                            // status: (this.state && this.state.status) || "",


                                            is_cleared:
                                              (this.state.paymentOutStatus &&
                                                this.state.paymentOutStatus
                                                  .is_cleared) ||
                                              "",
                                            cleared_at:
                                              (this.state.paymentOutStatus &&
                                                this.state.paymentOutStatus
                                                  .cleared_at) ||
                                              "",
                                            status:
                                              (this.state.paymentOutStatus &&
                                                this.state.paymentOutStatus
                                                  .status) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                           
                                                //   deposit_slip: Yup.string().required(
                                                //   "Please upload the file of payment slip"
                                                // ),
                                             

                                              deposit_slip: Yup.string().when(
                                              "hiddenEditFlag",
                                              {
                                                is: hiddenEditFlag =>
                                                  hiddenEditFlag == false, //just an e.g. you can return a function
                                                then: Yup.string().required(
                                                  "Please upload Payment Slip"
                                                ),
                                              }
                                            ),
                                             // Validation for logo based on type value
                                            // type: Yup.string(),
                                            // logo: Yup.mixed().test(
                                            //   "required",
                                            //   "Please upload logo",
                                            // ),

                                           
                                          })}
                                          onSubmit={values => {
                                            const updatePaymentOutStatus =
                                            {
                                              id: paymentOutStatus.id,
                                              // cleared_at:
                                              //   values.cleared_at,
                                              is_cleared: values.is_cleared,
                                              // cleared_at: values.cleared_at,
                                             
                                              // comments:
                                              //   values.comments,
                                                
                                            };

                                          // update PaymentStatus
                                          onUpdatePaymentOutStatus(
                                            updatePaymentOutStatus
                                          );
                                          setTimeout(() => {
                                            onGetPaymentOutStatuss(
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
                                                   {/* payments out pending clearence field */}

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
                                                          paymentOutStatus: {
                                                            id: paymentOutStatus.id,
                                                            // deposit_bank:
                                                            //   paymentOutStatus.deposit_bank,
                                                            // // deposited_at: paymentOutStatus.deposit_bank,
                                                            // deposit_slip: paymentOutStatus.deposit_slip,
                                                            is_cleared :
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      multiple={false}
                                                      value={
                                                        this.state
                                                          .paymentOutStatus
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
  paymentOutStatuss: PropTypes.array,
  className: PropTypes.any,
  onGetPaymentOutStatuss: PropTypes.func,
  onUpdatePaymentOutStatus: PropTypes.func,
};

const mapStateToProps = ({ paymentStatuss }) => ({
  paymentOutStatuss: paymentStatuss.paymentOutStatuss,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetPaymentOutStatuss: id => dispatch(getPaymentOutStatuss(id)),
  onUpdatePaymentOutStatus: paymentOutStatus =>
    dispatch(updatePaymentOutStatus(paymentOutStatus)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaymentStatussList));
