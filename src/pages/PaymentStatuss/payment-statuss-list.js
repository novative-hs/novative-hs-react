import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import Select from "react-select";
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
  getPaymentStatuss,
  updatePaymentInBouncedStatus,
  getBankAccounts,
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
      status: "Created",
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      paymentStatusListColumns: [
        {
          text: "id",
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
                {paymentStatus.donor_id}
              </span>
            </span>
          </>
        ),
        },
        {
          dataField: "payment_method",
          text: "Payment Type",
          sort: true,
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
          dataField: "paid_at",
          text: "Payment Recieved Date",
          sort: true,
        },
        // {
        //   dataField: "bankaccount_id",
        //   text: "Deposit Bank",
        //   sort: true,
        // },
        // {
        //   dataField: "deposit_slip",
        //   text: "Certificate",
        //   sort: true,
        //   formatter: (cellContent, paymentStatus) => (
        //     <>
        //       <Link
        //         to={{
        //           pathname:
        //             process.env.REACT_APP_BACKENDURL +
        //             paymentStatus.deposit_slip,
        //         }}
        //         target="_blank"
        //       >
        //         View Slip
        //       </Link>
        //     </>
        //   ),
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
                Submit
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
  toDataURL = url =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  // The code for converting "Base64" to javascript "File Object"
  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  
  componentDidMount() {

    const { bankAccounts, onGetbankAccounts } = this.props;
    if (bankAccounts && !bankAccounts.length) {
      onGetbankAccounts();
    }
    this.setState({ bankAccounts });


    const { paymentStatuss, onGetPaymentStatuss } = this.props;
    onGetPaymentStatuss(this.state.user_id);
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
        // deposited_at: arg.deposited_at,
        bankaccount_id: arg.bankaccount_id,
        deposit_slip: arg.deposit_slip,
        status: "Deposited",
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
      onUpdatePaymentInBouncedStatus,
      onGetPaymentStatuss,
    } = this.props;
    const paymentStatus = this.state.paymentStatus;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: 100, // replace later with size(paymentStatuss),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const { bankAccounts } = this.props;
    const bankaccountList = [];
    for (let i = 0; i < bankAccounts.length; i++) {
      let flag = 0;
      // for (let j = 0; j < bankAccounts.length; j++) {
      //   if (banks[i].id == bankAccounts[j].bank_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        bankaccountList.push({
          label: bankAccounts[i].account_no,
          value: bankAccounts[i].id,
        });
      }
    }

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
              breadcrumbItem="MIF Created"
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
                                          ? "Edit MIF Created"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            // deposited_at:
                                            //   (this.state.paymentStatus &&
                                            //     this.state.paymentStatus
                                            //       .deposited_at) ||
                                            //   "",
                                            // bankaccount_id: (this.state && this.state.bankaccount_id) || "",
                                            // deposit_slip: (this.state && this.state.deposit_slip) || "",
                                            // status: (this.state && this.state.status) || "",


                                            bankaccount_id:
                                              (this.state.paymentStatus &&
                                                this.state.paymentStatus
                                                  .bankaccount_id) ||
                                              "",
                                            deposit_slip:
                                              (this.state.paymentStatus &&
                                                this.state.paymentStatus
                                                  .deposit_slip) ||
                                              "",
                                            status:
                                              (this.state.paymentStatus &&
                                                this.state.paymentStatus
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
                                            const updatePaymentInBouncedStatus =
                                            {
                                              id: paymentStatus.id,
                                              // deposited_at:
                                              //   values.deposited_at,
                                              bankaccount_id: values.bankaccount_id,
                                              deposit_slip: values.deposit_slip,
                                             
                                              status:
                                                values.status,
                                                
                                            };

                                          // update PaymentStatus
                                          onUpdatePaymentInBouncedStatus(
                                            updatePaymentInBouncedStatus
                                          );
                                          setTimeout(() => {
                                            onGetPaymentStatuss(
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
                                                   {/* Certificate Expiry date field */}

                                                   {/* <div className="mb-3">
                                                    <Label
                                                      for="Deposit at"
                                                    >
                                                      Deposit at
                                                    </Label>
                                                    <input
                                                      type="datetime-local"
                                                      id="Deposit at"
                                                      name="Deposit at"
                                                      min={new Date(
                                                        new Date()
                                                          .toString()
                                                          .split("GMT")[0] +
                                                          " UTC"
                                                      )
                                                        .toISOString()
                                                        .slice(0, -8)}
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentStatus: {
                                                            id: paymentStatus.id,
                                                            bankaccount_id: paymentStatus.bankaccount_id,
                                                            deposit_slip: paymentStatus.deposit_slip,
                                                            deposited_at:
                                                              e.target.value +
                                                              ":00Z",
                                                            // estimated_result_uploading_at:
                                                            //   paymentStatus.estimated_result_uploading_at,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.deposited_at &&
                                                        touched.deposited_at
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="deposited_at"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div> */}

{paymentStatus.bankaccount_id &&
                            paymentStatus.bankaccount_id ? (
                            <div className="mb-3">
                              <Label
                                className="col-form-label"
                              >
                                Bank Account Name</Label>

                              <Field
                                name="bankaccount_id"
                                as="select"
                                defaultValue={
                                  paymentStatus.bankaccount_id
                                }
                                className="form-control"
                                readOnly={true}
                                multiple={false}
                              >
                                <option
                                  key={
                                    paymentStatus.bankaccount_id
                                  }
                                  value={
                                    paymentStatus.bankaccount_id
                                  }
                                >
                                  {
                                    paymentStatus.account_no

                                  }
                                </option>
                              </Field>
                            </div>
                          ) : (
                            <div className="mb-3 select2-container">
                              <Label
                                className="col-form-label"
                              >
                                Bank Account Name</Label>

                              <Select
                                name="bankaccount_id"
                                component="Select"
                                onChange={selectedGroup =>
                                  this.setState({
                                    bankaccount_id:
                                      selectedGroup.value,
                                  })
                                }
                                className={
                                  "defautSelectParent" +
                                  (!this.state.bankaccount_id
                                    ? " is-invalid"
                                    : "")
                                }
                                styles={{
                                  control: (
                                    base,
                                    state
                                  ) => ({
                                    ...base,
                                    borderColor: !this
                                      .state.bankaccount_id
                                      ? "#f46a6a"
                                      : "#ced4da",
                                  }),
                                }}
                                options={bankaccountList}
                                placeholder="Select Bank Account..."
                              />
                              <div className="invalid-feedback">
                                Please select your Bank Account
                              </div>
                            </div>
                          )}

                                                   {/* Certificate field */}
                                                   <div className="mb-3">
                                                      <Label for="name" className="form-label">
                                                        Deposit Slip
                                                      </Label>
                                                      <Input
                                                        id="formFile"
                                                        name="deposit_slip"
                                                        type="file"
                                                        multiple={false}
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                        onChange={e => {
                                                          this.setState({
                                                            deposit_slip:
                                                              e.target.files[0],
                                                          });
                                                        }}
                                                        // className="form-control is-invalid"
                                                        // className={
                                                        //   "form-control" +
                                                        //   (this.state.deposit_slip.length >
                                                        //     0 && !this.state.deposit_slip
                                                        //     ? " is-invalid"
                                                        //     : "")
                                                        // }
                                                      />

                                                      <ErrorMessage
                                                        name="deposit_slip"
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
                                                            bankaccount_id:
                                                              paymentStatus.bankaccount_id,
                                                            // deposited_at: paymentStatus.bankaccount_id,
                                                            deposit_slip: paymentStatus.deposit_slip,
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
  bankAccounts: PropTypes.array,
  className: PropTypes.any,
  onGetPaymentStatuss: PropTypes.func,
  onUpdatePaymentInBouncedStatus: PropTypes.func,
  onGetbankAccounts: PropTypes.func,

};

const mapStateToProps = ({ paymentStatuss }) => ({
  paymentStatuss: paymentStatuss.paymentStatuss,
  bankAccounts: paymentStatuss.bankAccounts,

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetbankAccounts: () => dispatch(getBankAccounts()),

  onGetPaymentStatuss: id => dispatch(getPaymentStatuss(id)),
  onUpdatePaymentInBouncedStatus: paymentStatus =>
    dispatch(updatePaymentInBouncedStatus(paymentStatus)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaymentStatussList));