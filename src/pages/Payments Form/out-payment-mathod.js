import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";

import {
  Container,
  Row,
  Col,
  Table,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  FormGroup,
  Label,
  CardBody,
  CardTitle,
  Alert,
} from "reactstrap";

import classnames from "classnames";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import {
  getBanks,
  getLabsMof,
  getBankAccounts,
  getB2bClients,
  addNewOutPayment,
  getOutPayment
} from "store/outpayments/actions";

import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";
import "assets/scss/table.scss";

class OutPaymentsForm extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      outPayments: [],
      outPayment: "",
      modal: false,
      addmodal: false,
      confirmModal: false,
      id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      payment_for: "",
      lab_id: "",
      b2b_id: "",
      current_amount: "",
      invoice_id: "",
      bankaccount_id: "",
      bank_id: "",
      amount: "",
      payment_at: "",
      payment_method: "Cheque",
      cheque_no: "",
      deposit_copy: "",
      cleared_at: "",
      is_cleared: "",
      status: "",
      comments: "",
      checkedoutData: "",
      successMessage: "",
    };
    // this.toggleTab = this.toggleTab.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleSelectGroup = this.handleSelectGroup.bind(this);
  }

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

  handleSubmitClicks = () => {
    this.setState({
      outPayment: {
        payment_for: this.state.payment_for,
        lab_id: this.state.lab_id,
        b2b_id: this.state.b2b_id,
        // bank_id: this.state.bank_id,
        bankaccount_id: this.state.bankaccount_id,
        amount: this.state.amount,
        payment_method: this.state.payment_method,
        payment_at: this.state.payment_at,
        cheque_no: this.state.cheque_no,
        deposit_copy: this.state.deposit_copy,
        is_cleared: this.state.is_cleared,
        status: "Pending Clearance",
        comments: this.state.comments,
      },
    });
  
    // API call to create a new outPayment record
    const { onAddNewOutPayment } = this.props;
    setTimeout(() => {
      console.log(
        onAddNewOutPayment(this.state.outPayment, this.state.user_id)
      );
    }, 2000);
    setTimeout(() => {
        this.props.history.push("/payment-out-pending-clearence-status");
    }, 2000)
  };

  
  
  handleProceedClick = () => {
    this.setState({
      outPayment: {
        payment_for: this.state.payment_for,
        lab_id: this.state.lab_id,
        b2b_id: this.state.b2b_id,
        bank_id: this.state.bank_id,
        bankaccount_id: this.state.bankaccount_id,
        amount: this.state.amount,
        payment_method: this.state.payment_method,
        payment_at: this.state.payment_at,
        cheque_no: this.state.cheque_no,
        deposit_copy: this.state.deposit_copy,
        is_cleared: this.state.is_cleared,
        status: "Created",
        comments: this.state.comments,
      },
    });

    // API call to get the checkout items
    const { onAddNewOutPayment } = this.props;
    setTimeout(() => {
      console.log(
        onAddNewOutPayment(this.state.outPayment, this.state.user_id)
        
      );
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 2000);

    setTimeout(() => {
      this.props.history.push("/payment-out-created-status");
      window.location.reload()

  }, 2000)
  };

  componentDidMount() {
    const { labsMof, onGetlabsMof } = this.props;
    if (labsMof && !labsMof.length) {
      onGetlabsMof();
    }
    this.setState({ labsMof });

    const { banks, onGetbanks } = this.props;
    if (banks && !banks.length) {
      onGetbanks();
    }
    this.setState({ banks });

    const { bankAccounts, onGetbankAccounts } = this.props;
    if (bankAccounts && !bankAccounts.length) {
      onGetbankAccounts();
    }
    this.setState({ bankAccounts });

    const { b2bClients, onGetB2bClients } = this.props;
    if (b2bClients && !b2bClients.length) {
      onGetB2bClients();
    }
    this.setState({ b2bClients });

    const { outPayments, onGetOutPayment } = this.props;
    if (outPayments && !outPayments.length) {
      onGetOutPayment(this.props.match.params.id);
    }
    this.setState({ outPayments });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // Select
  handleSelectGroup = selectedGroup => {
    this.setState({ outPayment: selectedGroup.value });
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { outPayments } = this.props;
    if (
      !isEmpty(outPayments) &&
      size(prevProps.outPayments) !== size(outPayments)
    ) {
      this.setState({ outPayments: {}, isEdit: false });
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

    const { outPayments } = this.props;
    const { labsMof } = this.props;
    const { b2bClients } = this.props;


    // const { units } = this.props;

    const { onAddNewOutPayment, onGetOutPayment } =
      this.props;
    const outPayment = this.state.outPayment;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: outPayments.length, // replace later with size(outPayments),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const labList = [];
    for (let i = 0; i < labsMof.length; i++) {
      let flag = 0;
      // for (let j = 0; j < outPayments.length; j++) {
      //   if (labsMof[i].id == outPayments[j].lab_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        labList.push({
          label: labsMof[i].name,
          value: labsMof[i].id,
        });
      }
    }

    const b2bList = [];
    for (let i = 0; i < b2bClients.length; i++) {
      let flag = 0;

      // Check if test available in our database is already being offered by lab
      // If yes then don't push it in labList
      // for (let j = 0; j < outPayments.length; j++) {
      //   if (b2bClients[i].id == outPayments[j].b2b_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        b2bList.push({
          label: `${b2bClients[i].business_name} - ${b2bClients[i].current_amount}`,
          value: `${b2bClients[i].id}`,

        });

      }
    }


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
        bankaccountList.push(
          {
            label: `${bankAccounts[i].bank_name} - ${bankAccounts[i].account_no}`,
            value: `${bankAccounts[i].id}`,
          }
        );
      }
    }

    const { banks } = this.props;
    const bankList = [];
    for (let i = 0; i < banks.length; i++) {
      let flag = 0;
      // for (let j = 0; j < bankAccounts.length; j++) {
      //   if (banks[i].id == bankAccounts[j].bank_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        bankList.push({
          label: banks[i].name,
          value: banks[i].id,
        });
      }
    }


    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>OutPayment | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Form" breadcrumbItem="OutPayment" />
            <Formik>
              <div className="checkout-tabs">
              {this.state.successMessage && <div>{this.state.successMessage}</div>}
                <Row>
                  <Col lg="1" sm="1">
                  </Col>
                  <Col lg="10" sm="9">
                    <Card>
                      <CardBody>
                        <div>
                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput">
                              Payment To
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <select
                              name="payment_for"
                              component="select"
                              onChange={e =>
                                this.setState({
                                  payment_for: e.target.value,
                                })
                              }
                              defaultValue={this.state.payment_for}
                              className="form-select"
                            >
                              <option
                                value=""
                              >
                                --- Please select the Type
                                ---
                              </option>
                              <option value="Lab">Lab</option>
                              <option value="B2BClient">B2b</option>
                            </select>

                          </FormGroup>

                          {this.state.payment_for == "Lab" ? (
                            outPayment.lab_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Lab name
                                </Label>
                                <Field
                                  name="lab_id"
                                  as="select"
                                  defaultValue={
                                    outPayment.lab_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      outPayment.lab_id
                                    }
                                    value={
                                      outPayment.lab_id
                                    }
                                  >
                                    {
                                      outPayment.lab_name
                                    }
                                  </option>
                                </Field>
                              </div>
                            ) : (
                              <div className="mb-3 select2-container">
                                <Label>Lab Name</Label>
                                <Select
                                  name="lab_id"
                                  component="Select"
                                  onChange={selectedGroup =>
                                    this.setState({
                                      lab_id:
                                        selectedGroup.value,
                                    })
                                  }
                                  className={
                                    "defautSelectParent" +
                                    (!this.state.lab_id
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
                                        .state.lab_id
                                        ? "#f46a6a"
                                        : "#ced4da",
                                    }),
                                  }}
                                  options={labList}
                                  placeholder="Select Lab..."
                                />

                                <div className="invalid-feedback">
                                  Please select your Lab
                                </div>
                              </div>)
                          ) : null}

                          {this.state.payment_for == "B2BClient" ? (
                            outPayment.b2b_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  B2BClient name
                                </Label>
                                <Field
                                  name="b2b_id"
                                  as="select"
                                  defaultValue={
                                    outPayment.b2b_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      outPayment.b2b_id
                                    }
                                    value={
                                      outPayment.b2b_id
                                    }
                                  >
                                    {
                                      outPayment.business_name
                                    }
                                  </option>
                                </Field>
                              </div>
                            ) : (
                              <div className="mb-3 select2-container">
                                <Label>B2BClient Name</Label>
                                <Select
                                  name="b2b_id"
                                  component="Select"
                                  onChange={selectedGroup =>
                                    this.setState({
                                      b2b_id:
                                        selectedGroup.value,
                                    })
                                  }
                                  className={
                                    "defautSelectParent" +
                                    (!this.state.b2b_id
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
                                        .state.b2b_id
                                        ? "#f46a6a"
                                        : "#ced4da",
                                    }),
                                  }}
                                  options={b2bList}
                                  placeholder="Select B2b..."
                                />

                                <div className="invalid-feedback">
                                  Please select B2BClient
                                </div>
                              </div>
                            )

                          ) : null}

                          {/* {this.state.b2b_id ? (
                            <div className="mb-3">
                              <Label className="form-label">B2BClient name</Label>
                              <Field
                                name="b2b_id"
                                as="select"
                                onChange={selectedGroup => {
                                  const selectedB2B = b2bList.find(b2b_id => b2b_id.value === selectedGroup.value);
                                  this.setState({
                                    b2b_id: selectedGroup.value,
                                    current_amount: selectedB2B.current_amount,
                                  });
                                }}
                                className="form-control"
                                readOnly={true}
                                multiple={false}
                              >
                                <option key={this.state.b2b_id} value={this.state.b2b_id}>
                                  {this.state.b2b_id}
                                </option>
                              </Field>
                            </div>
                          ) : null} */}


                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput">
                              Amount
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Input
                              type="number"
                              className="form-control"
                              id="cardnumberInput"
                              placeholder="Enter Amount"
                              name="amount"
                              onChange={e =>
                                this.setState({
                                  amount: e.target.value,
                                })
                              }
                            />
                          </FormGroup>

                          <FormGroup className="mt-4 mb-0">
                            <Label htmlFor="cardnameInput">
                              Cheque/TT #
                              <span
                                style={{ color: "#f46a6a" }}
                              // className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="cardnumberInput"
                              placeholder="0000 0000 0000 0000"
                              name="cheque_no"
                              onChange={e =>
                                this.setState({
                                  cheque_no: e.target.value,
                                })
                              }
                            />
                          </FormGroup>

                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput">
                              Payment at
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <input
                              name="payment_at"
                              type="datetime-local"
                              min={new Date(
                                new Date().toString().split("GMT")[0] +
                                " UTC"
                              )
                                .toISOString()
                                .slice(0, -8)}
                              className="form-control"
                              onChange={e =>
                                this.setState({
                                  payment_at:
                                    e.target.value,
                                })
                              }
                            />
                          </FormGroup>

                          {/* {outPayment.bank_id &&
                            outPayment.bank_id ? (
                            <div className="mb-3">
                              <Label
                                className="col-form-label"
                              >
                                Bank Name</Label>

                              <Field
                                name="bank_id"
                                as="select"
                                defaultValue={
                                  outPayment.bank_id
                                }
                                className="form-control"
                                readOnly={true}
                                multiple={false}
                              >
                                <option
                                  key={
                                    outPayment.bank_id
                                  }
                                  value={
                                    outPayment.bank_id
                                  }
                                >
                                  {
                                    outPayment.bank_name
                                  }
                                </option>
                              </Field>
                            </div>
                          ) : (
                            <div className="mb-3 select2-container">
                              <Label
                                className="col-form-label"
                              >
                                Bank Name</Label>

                              <Select
                                name="bank_id"
                                component="Select"
                                onChange={selectedGroup =>
                                  this.setState({
                                    bank_id:
                                      selectedGroup.value,
                                  })
                                }
                                className={
                                  "defautSelectParent" +
                                  (!this.state.bank_id
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
                                      .state.bank_id
                                      ? "#f46a6a"
                                      : "#ced4da",
                                  }),
                                }}
                                options={bankList}
                                placeholder="Select Bank..."
                              />
                              <div className="invalid-feedback">
                                Please select your Bank
                              </div>
                            </div>
                          )} */}

                          {outPayment.bankaccount_id &&
                            outPayment.bankaccount_id ? (
                            <div className="mb-3">
                              <Label
                                className="col-form-label"
                              >
                                Bank Account Name</Label>

                              <Field
                                name="bankaccount_id"
                                as="select"
                                defaultValue={
                                  outPayment.bankaccount_id
                                }
                                className="form-control"
                                readOnly={true}
                                multiple={false}
                              >
                                <option
                                  key={
                                    outPayment.bankaccount_id
                                  }
                                  value={
                                    outPayment.bankaccount_id
                                  }
                                >
                                  {
                                    outPayment.account_no

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

                          <FormGroup className=" mt-4 mb-0">
                            <Label htmlFor="expirydateInput">
                              Payment Copy
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Input
                              id="formFile"
                              name="deposit_copy"
                              type="file"
                              multiple={false}
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={e => {
                                this.setState({
                                  deposit_copy:
                                    e.target.files[0],
                                });
                              }}
                              // className="form-control is-invalid"
                              className={
                                "form-control" +
                                (this.state.deposit_copy.length >
                                  0 && !this.state.deposit_copy
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                          </FormGroup>

                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput">
                              Payment Method
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <select
                              name="payment_method"
                              component="select"
                              onChange={e =>
                                this.setState({
                                  payment_method: e.target.value,
                                })
                              }
                              defaultValue={this.state.payment_method}
                              className="form-select"
                            >
                              <option
                                value=""
                              >
                                --- Please select the Payment Type
                                ---
                              </option>
                              <option value="Cheque">Cheque</option>
                              <option value="Card">Online</option>

                            </select>
                          </FormGroup>

                          {/* <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput">
                              Is Cleared
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <select
                              name="is_cleared"
                              component="select"
                              onChange={e =>
                                this.setState({
                                  is_cleared: e.target.value,
                                })
                              }
                              defaultValue={this.state.is_cleared}
                              className="form-select"
                            >
                              <option
                                value=""
                              >
                                --- Please select the Type
                                ---
                              </option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>

                            </select>
                          </FormGroup> */}

                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput">
                              Comments
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="cardnumberInput"
                              placeholder="Enter Comments"
                              name="comments"
                              onChange={e =>
                                this.setState({
                                  comments: e.target.value,
                                })
                              }
                            />
                          </FormGroup>

                          <Row className="mt-4">
                            <Col sm="6">
                              <div className="text-end">
                                <button
                                  component={Link}
                                  onClick={this.handleProceedClick}
                                  to="/dashboard-financeofficer"
                                  className="btn btn-success mb-4"
                                >
                                  <i className="mdi mdi-truck-fast me-1" /> Save{" "}
                                </button>
                              </div>
                            </Col>
                            <Col sm="6">
                              <button
                                to="/dashboard-financeofficer"
                                className="btn btn-danger"
                                onClick={this.handleSubmitClicks}
                              // disabled={this.state.carts.length == 0}
                              >
                                <i className="mdi mdi-truck-fast me-1" />
                                submit
                              </button>
                            </Col>
                          </Row>

                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Formik>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

OutPaymentsForm.propTypes = {
  match: PropTypes.object,
  labsMof: PropTypes.array,
  banks: PropTypes.array,
  bankAccounts: PropTypes.array,
  history: PropTypes.object,
  b2bClients: PropTypes.array,
  // units: PropTypes.array,
  outPayments: PropTypes.array,
  className: PropTypes.any,
  onGetlabsMof: PropTypes.func,
  onGetB2bClients: PropTypes.func,
  onGetOutPayment: PropTypes.func,
  // onGetUnits: PropTypes.func,
  onAddNewOutPayment: PropTypes.func,
  onGetbanks: PropTypes.func,
  onGetbankAccounts: PropTypes.func,
};

const mapStateToProps = ({ outPayments }) => ({
  outPayments: outPayments.outPayments,
  labsMof: outPayments.labsMof,
  b2bClients: outPayments.b2bClients,
  banks: outPayments.banks,
  bankAccounts: outPayments.bankAccounts,


  // units: outPayments.units,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetbanks: () => dispatch(getBanks()),
  onGetbankAccounts: () => dispatch(getBankAccounts()),
  onGetlabsMof: () => dispatch(getLabsMof()),
  onGetB2bClients: () => dispatch(getB2bClients()),
  onGetOutPayment: id => dispatch(getOutPayment(id)),
  onAddNewOutPayment: (outPayment, id) =>
    dispatch(addNewOutPayment(outPayment, id)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OutPaymentsForm)); 
