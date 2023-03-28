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
  getAdvertisements,
  getLabs,
  getDonors,
  addNewInPayment,
  getInPayment
} from "store/inpayments/actions";

import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";
import "assets/scss/table.scss";

class InPaymentsForm extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      inPayments: [],
      inPayment: "",
      modal: false,
      addmodal: false,
      confirmModal: false,
      id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      payment_for: "",
      lab_id: "",
      donor_id: "",
      advertisement_id: "",
      recieved_by: "",
      handover_to: "",
      amount: "",
      paid_at: "",
      cheque_payment_date: "",
      // deposit_bank: "",
      payment_method: "Cash",
      // card_number: "",
      cheque_no: "",
      refered_no: "",
      cheque_image: "",
      // invoice_id: "",
      // cleared_at: "",
      // verified_by: "",
      payment_status: "",
      // isDisabled: true,
      // isRequiredFilled: true,
      checkedoutData: "",
    };
    // this.toggleTab = this.toggleTab.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleSelectGroup = this.handleSelectGroup.bind(this);
  }

  // handleProceedClicks = () => {
  //   this.setState({
  //     inPayment: {
  //       payment_for: this.state.payment_for,
  //       lab_id: this.state.lab_id,
  //       donor_id: this.state.donor_id,
  //       amount: this.state.amount,
  //       payment_method: this.state.payment_method,
  //       recieved_by: this.state.recieved_by,
  //       handover_to: this.state.handover_to,
  //       paid_at: this.state.paid_at,
  //       // deposited_at: this.state.deposited_at,
  //       // deposit_bank: this.state.deposit_bank,
  //       cheque_no: this.state.cheque_no,
  //       cheque_image: this.state.cheque_image,
  //       refered_no: this.state.refered_no,
  //       payment_status: "Deposited",
  //     },
  //   });

  //   // API call to get the checkout items
  //   const { onAddInPaymentData } = this.props;
  //   setTimeout(() => {
  //     console.log(
  //       onAddInPaymentData(this.state.inPayment, this.state.user_id)
  //     );
  //   }, 2000);

  //   // setTimeout(() => {
  //   // this.setState({ inPayment: this.props.inPayment });

  //   // // If checkout operation is successful.
  //   // if (this.props.inPayment) {
  //   // this.props.history.push("/donor-appointment");
  //   // }
  //   // }, 2000);
  //   // }
  // };

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

  handleProceedClick = () => {
    this.setState({
      inPayment: {
        payment_for: this.state.payment_for,
        lab_id: this.state.lab_id,
        donor_id: this.state.donor_id,
        advertisement_id: this.state.advertisement_id,
        amount: this.state.amount,
        payment_method: this.state.payment_method,
        recieved_by: this.state.recieved_by,
        handover_to: this.state.handover_to,
        paid_at: this.state.paid_at,
        // invoice_id: this.state.invoice_id,
        cheque_payment_date: this.state.cheque_payment_date,
        cheque_no: this.state.cheque_no,
        cheque_image: this.state.cheque_image,
        refered_no: this.state.refered_no,
        payment_status: "Created",
      },
    });

    // API call to get the checkout items
    const { onAddInPaymentData } = this.props;
    setTimeout(() => {
      console.log(
        onAddInPaymentData(this.state.inPayment, this.state.user_id)
      );
      // window.location.reload()
    }, 2000);
    setTimeout(() => {
      this.props.history.push("/payment-status");
      window.location.reload()
  }, 2000)

    // setTimeout(() => {
    // this.setState({ inPayment: this.props.inPayment });

    // // If checkout operation is successful.
    // if (this.props.inPayment) {
    // this.props.history.push("/donor-appointment");
    // }
    // }, 2000);
    // }
  };

  componentDidMount() {
    const { labs, onGetlabs } = this.props;
    if (labs && !labs.length) {
      onGetlabs();
    }
    this.setState({ labs });

    const { advertisements, onGetAdvertisements } = this.props;
    if (advertisements && !advertisements.length) {
      onGetAdvertisements(this.props.match.params.id);
    }
    this.setState({ advertisements });

    const { donors, onGetdonors } = this.props;
    if (donors && !donors.length) {
      onGetdonors();
    }
    this.setState({ donors });

    const { inPayments, onGetInPayment } = this.props;
    if (inPayments && !inPayments.length) {
      onGetInPayment(this.props.match.params.id);
    }
    this.setState({ inPayments });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // Select
  handleSelectGroup = selectedGroup => {
    this.setState({ inPayment: selectedGroup.value });
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { inPayments } = this.props;
    if (
      !isEmpty(inPayments) &&
      size(prevProps.inPayments) !== size(inPayments)
    ) {
      this.setState({ inPayments: {}, isEdit: false });
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
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      patient_age: arg.patient_age,
      patient_gender: arg.patient_gender,
      patient_address: arg.patient_address,
      patient_city: arg.patient_city,
      patient_phone: arg.patient_phone,
    });
  };

  render() {
    const { SearchBar } = Search;

    const { inPayments } = this.props;
    const { labs } = this.props;
    const { advertisements } = this.props;
    const { donors } = this.props;

    // const { units } = this.props;

    const { onAddInPaymentData, onGetInPayment } =
      this.props;
    const inPayment = this.state.inPayment;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: inPayments.length, // replace later with size(inPayments),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    // const labList = [];
    // for (let i = 0; i < labs.length; i++) {
    //   let flag = 0;
    //   // for (let j = 0; j < inPayments.length; j++) {
    //   //   if (labs[i].id == inPayments[j].lab_id) {
    //   //     flag = 1;
    //   //   }
    //   // }
    //   if (!flag) {
    //     labList.push({
    //       label: labs[i].name,
    //       value: labs[i].id,
    //     });
    //   }
    // }
    const labList = [];
    for (let i = 0; i < labs.length; i++) {
      let flag = 0;
      // for (let j = 0; j < inPayments.length; j++) {
      //   if (labs[i].id == inPayments[j].lab_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        labList.push(
          {
            label: `${labs[i].name}`,
            value: `${labs[i].id}`,
          },
        );
      }
    }

    const advertisementList = [];
    for (let i = 0; i < advertisements.length; i++) {
      let flag = 0;
      // for (let j = 0; j < inPayments.length; j++) {
      //   if (advertisements[i].id == inPayments[j].advertisement_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        // const optionValue = `${advertisements[i].id}-${advertisements[i].lab_id}`;
        advertisementList.push({
          label: `${advertisements[i].title} - (Lab: ${advertisements[i].lab_name})`,
          value: `${advertisements[i].id}`,
        });
      }
    }
    

    const donorList = [];
    for (let i = 0; i < donors.length; i++) {
      let flag = 0;

      // Check if test available in our database is already being offered by lab
      // If yes then don't push it in labList
      // for (let j = 0; j < inPayments.length; j++) {
      //   if (donors[i].id == inPayments[j].donor_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        donorList.push({
          label: donors[i].name,
          value: donors[i].id,
        });
      }
    }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>InPayment | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Form" breadcrumbItem="InPayment" />
            <Formik>
              <div className="checkout-tabs">
                <Row>
                  <Col lg="1" sm="1">
                  </Col>
                  <Col lg="10" sm="9">
                    <Card>
                      <CardBody>
                        <div>
                          {/* <CardTitle className="h4">
                            Payment information
                          </CardTitle>
                          <p className="card-title-desc">
                            Fill the Cheque payment only if your payment method
                            is Cheque
                          </p> */}
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
                              <option value="Donor">Donor</option>
                              <option value="Advertisement">Advertisement</option>
                            </select>

                          </FormGroup>

                          {this.state.payment_for == "Lab" ? (
                            inPayment.lab_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Lab name
                                </Label>
                                <Field
                                  name="lab_id"
                                  as="select"
                                  defaultValue={
                                    inPayment.lab_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      inPayment.lab_id
                                    }
                                    value={
                                      inPayment.lab_id
                                    }
                                  >
                                    {
                                      inPayment.lab_name
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
                          {this.state.payment_for == "Donor" ? (
                            inPayment.donor_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Donor name
                                </Label>
                                <Field
                                  name="donor_id"
                                  as="select"
                                  defaultValue={
                                    inPayment.donor_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      inPayment.donor_id
                                    }
                                    value={
                                      inPayment.donor_id
                                    }
                                  >
                                    {
                                      inPayment.donor_name
                                    }
                                  </option>
                                </Field>
                              </div>
                            ) : (
                              <div className="mb-3 select2-container">
                                <Label>Donor Name</Label>
                                <Select
                                  name="donor_id"
                                  component="Select"
                                  onChange={selectedGroup =>
                                    this.setState({
                                      donor_id:
                                        selectedGroup.value,
                                    })
                                  }
                                  className={
                                    "defautSelectParent" +
                                    (!this.state.donor_id
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
                                        .state.donor_id
                                        ? "#f46a6a"
                                        : "#ced4da",
                                    }),
                                  }}
                                  options={donorList}
                                  placeholder="Select Donor..."
                                />

                                <div className="invalid-feedback">
                                  Please select Donor
                                </div>
                              </div>
                            )

                          ) : null}
                          
                           {this.state.payment_for == "Advertisement" ? (
                            inPayment.advertisement_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Advertisement Title
                                </Label>
                                <Field
                                  name="advertisement_id"
                                  as="select"
                                  defaultValue={
                                    inPayment.advertisement_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      inPayment.advertisement_id
                                    }
                                    value={
                                      inPayment.advertisement_id
                                    }
                                  >
                                    {
                                      inPayment.advertisement_title
                                    }
                                  </option>
                                </Field>
                              </div>
                              
                            ) : (
                              <div className="mb-3 select2-container">
                                <Label>Advertisement Title</Label>
                                <Select
                                  name="advertisement_id"
                                  component="Select"
                                  onChange={selectedGroup =>
                                    this.setState({
                                      advertisement_id:
                                        selectedGroup.value,
                                    })
                                  }
                                  className={
                                    "defautSelectParent" +
                                    (!this.state.advertisement_id
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
                                        .state.advertisement_id
                                        ? "#f46a6a"
                                        : "#ced4da",
                                    }),
                                  }}
                                  options={advertisementList}
                                  placeholder="Select Advertisements..."
                                />

                                <div className="invalid-feedback">
                                  Please select Advertisement
                                </div>
                              </div>
                            )

                            
                          ) : null}

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
                              type="text"
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
                          <div>
                            <Label htmlFor="cardnumberInput">
                              Payment Method
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <div>
                              <div className="form-check form-check-inline font-size-16">
                                <Input
                                  type="radio"
                                  value="Cash"
                                  defaultChecked
                                  name="payment_method"
                                  id="customRadioInline1"
                                  className="form-check-input"
                                  onChange={e =>
                                    this.setState({
                                      payment_method: e.target.value,
                                    })
                                  }
                                />
                                <Label
                                  className="form-check-label font-size-13"
                                  htmlFor="customRadioInline1"
                                >
                                  <i className="far fa-money-bill-alt me-1 font-size-20 align-top" />{" "}
                                  Cash
                                </Label>
                              </div>
                              <div className="form-check form-check-inline font-size-16">
                                <Input
                                  type="radio"
                                  value="Cheque"
                                  name="payment_method"
                                  id="customRadioInline2"
                                  className="form-check-input"
                                  onChange={e =>
                                    this.setState({
                                      payment_method: e.target.value,
                                    })
                                  }
                                />
                                <Label
                                  className="form-check-label font-size-13"
                                  htmlFor="customRadioInline2"
                                >
                                  <i className="far fa-money-bill-alt me-1 font-size-20 align-top" />{" "}
                                  Cheque
                                </Label>
                              </div>
                              <div className="form-check form-check-inline font-size-16">
                                <Input
                                  type="radio"
                                  value="Card"
                                  id="customRadioInline3"
                                  name="payment_method"
                                  className="form-check-input"
                                  onChange={e =>
                                    this.setState({
                                      payment_method: e.target.value,
                                    })
                                  }
                                />
                                <Label
                                  className="form-check-label font-size-13"
                                  htmlFor="customRadioInline3"
                                >
                                  <i className="fab fa-cc-mastercard me-1 font-size-20 align-top" />{" "}
                                  Online
                                </Label>
                              </div>
                            </div>

                            {this.state.payment_method == "Cash" ? (
                              <div>
                                <h5 className="mt-5 mb-3 font-size-15">
                                  For Cash Payment
                                </h5>
                                <div className="p-4 border">
                                  <Form>
                                    <FormGroup className="mb-0">
                                      <Label htmlFor="cardnumberInput">
                                        Payment Recieved Date
                                        <span
                                          style={{ color: "#f46a6a" }}
                                          className="font-size-18"
                                        >
                                          *
                                        </span>
                                      </Label>
                                      <input
                                        name="paid_at"
                                        type="datetime-local"
                                        max={new Date(
                                          new Date().toString().split("GMT")[0] +
                                          " UTC"
                                        )
                                          .toISOString()
                                          .slice(0, -8)}
                                        className="form-control"
                                        onChange={e =>
                                          this.setState({
                                            paid_at:
                                              e.target.value,
                                          })
                                        }
                                      />
                                    </FormGroup>
                                     <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput">
                              Recieved By
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
                              placeholder="Enter Your Name"
                              name="recieved_by"
                              onChange={e =>
                                this.setState({
                                  recieved_by: e.target.value,
                                })
                              }
                            />
                                     </FormGroup>

                                     <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput">
                              Handover To
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
                              placeholder="Enter Your Name"
                              name="handover_to"
                              onChange={e =>
                                this.setState({
                                  handover_to: e.target.value,
                                })
                              }
                            />
                                     </FormGroup>

                                  </Form>
                                </div>
                              </div>
                            ) : null}

                            {this.state.payment_method == "Cheque" ? (
                              <div>
                                <h5 className="mt-5 mb-3 font-size-15">
                                  For Cheque Payment
                                </h5>
                                <div className="p-4 border">
                                  <Form>
                                    <FormGroup className="mb-0">
                                      <Label htmlFor="cardnumberInput">
                                      Payment Recieved Date
                                        <span
                                          style={{ color: "#f46a6a" }}
                                          className="font-size-18"
                                        >
                                          *
                                        </span>
                                      </Label>
                                      <input
                                        name="paid_at"
                                        type="datetime-local"
                                        max={new Date(
                                          new Date().toString().split("GMT")[0] +
                                          " UTC"
                                        )
                                          .toISOString()
                                          .slice(0, -8)}
                                        className="form-control"
                                        onChange={e =>
                                          this.setState({
                                            paid_at:
                                              e.target.value,
                                          })
                                        }
                                      />
                                    </FormGroup>
                                    
                                    <FormGroup className="mb-0">
                                      <Label htmlFor="cardnumberInput">
                                       Cheque Date
                                        <span
                                          style={{ color: "#f46a6a" }}
                                          className="font-size-18"
                                        >
                                          *
                                        </span>
                                      </Label>
                                      <input
                                        name="cheque_payment_date"
                                        type="datetime-local"
                                        // min={new Date(
                                        //   new Date().toString().split("GMT")[0] +
                                        //   " UTC"
                                        // )
                                        //   .toISOString()
                                        //   .slice(0, -8)}
                                         className="form-control"
                                         onChange={e =>
                                          this.setState({
                                            cheque_payment_date:
                                              e.target.value,
                                          })
                                        }
                                      />
                                    </FormGroup>

                                    <Row>
                                      <Col lg="6">
                                        <FormGroup className="mt-4 mb-0">
                                          <Label htmlFor="cardnameInput">
                                            Cheque #
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
                                      </Col>
                                      <Col lg="3">
                                        <FormGroup className=" mt-4 mb-0">
                                          <Label htmlFor="expirydateInput">
                                            Cheque Image
                                            <span
                                              style={{ color: "#f46a6a" }}
                                              className="font-size-18"
                                            >
                                              *
                                            </span>
                                          </Label>
                                          <Input
                                            id="formFile"
                                            name="cheque_image"
                                            type="file"
                                            multiple={false}
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            onChange={e => {
                                              this.setState({
                                                cheque_image:
                                                  e.target.files[0],
                                              });
                                            }}
                                            // className="form-control is-invalid"
                                            className={
                                              "form-control" +
                                              (this.state.cheque_image.length >
                                                0 && !this.state.cheque_image
                                                ? " is-invalid"
                                                : "")
                                            }
                                          />
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </Form>
                                </div>
                              </div>
                            ) : null}

                            {this.state.payment_method == "Card" ? (
                              <div>
                                <h5 className="mt-5 mb-3 font-size-15">
                                  For Online Payment
                                </h5>
                                <div className="p-4 border">
                                  <Form>
                                    <FormGroup className="mb-0">
                                      <Label htmlFor="cardnumberInput">
                                      Payment Recieved Date
                                        <span
                                          style={{ color: "#f46a6a" }}
                                          className="font-size-18"
                                        >
                                          *
                                        </span>
                                      </Label>
                                      <input
                                        name="paid_at"
                                        type="datetime-local"
                                        max={new Date(
                                          new Date().toString().split("GMT")[0] +
                                          " UTC"
                                        )
                                          .toISOString()
                                          .slice(0, -8)}
                                        className="form-control"
                                        onChange={e =>
                                          this.setState({
                                            paid_at:
                                              e.target.value,
                                          })
                                        }
                                      />
                                    </FormGroup>
                                    <Row>
                                      <Col lg="6">
                                        <FormGroup className="mt-4 mb-0">
                                          <Label htmlFor="cardnameInput">
                                            Online Ref #
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
                                            placeholder="00000000000000"
                                            name="refered_no"
                                            onChange={e =>
                                              this.setState({
                                                refered_no: e.target.value,
                                              })
                                            }
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg="3">
                                        <FormGroup className=" mt-4 mb-0">
                                          <Label htmlFor="expirydateInput">
                                            Ref Copy
                                            <span
                                              style={{ color: "#f46a6a" }}
                                              className="font-size-18"
                                            >
                                              *
                                            </span>
                                          </Label>
                                          <Input
                                            id="formFile"
                                            name="cheque_image"
                                            type="file"
                                            multiple={false}
                                            accept=".jpg,.jpeg,.png,.pdf"
                                            onChange={e => {
                                              this.setState({
                                                cheque_image:
                                                  e.target.files[0],
                                              });
                                            }}
                                            // className="form-control is-invalid"
                                            className={
                                              "form-control" +
                                              (this.state.cheque_image.length >
                                                0 && !this.state.cheque_image
                                                ? " is-invalid"
                                                : "")
                                            }
                                          />
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </Form>
                                </div>
                              </div>
                            ) : null}

                          </div>
                          {/* <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput">
                              payment_status
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <select
                              name="payment_status"
                              component="select"
                              onChange={e =>
                                this.setState({
                                  payment_status: e.target.value,
                                })
                              }
                              defaultValue={this.state.payment_status}
                              className="form-select"
                            >
                              <option
                                value=""
                              >
                                --- Please select the Type
                                ---
                              </option>
                              <option value="Created">Created</option>
                              <option value="Deposited">Deposited</option>
                              <option value="Cleared">Cleared</option>

                            </select>
                          </FormGroup> */}

                        </div>
                        <Row className="mt-4">
                            <Col sm="6">
                              
                            </Col>
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
                          </Row>

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

InPaymentsForm.propTypes = {
  match: PropTypes.object,
  labs: PropTypes.array,
  donors: PropTypes.array,
  advertisements: PropTypes.array,
  // units: PropTypes.array,
  inPayments: PropTypes.array,
  className: PropTypes.any,
  onGetlabs: PropTypes.func,
  onGetdonors: PropTypes.func,
  history: PropTypes.object,
  onGetInPayment: PropTypes.func,
  // onGetUnits: PropTypes.func,
  onAddInPaymentData: PropTypes.func,
  onGetAdvertisements: PropTypes.func,

};

const mapStateToProps = ({ inPayments }) => ({
  inPayments: inPayments.inPayments,
  labs: inPayments.labs,
  donors: inPayments.donors,
  advertisements: inPayments.advertisements,
  // units: inPayments.units,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  
  onGetlabs: () => dispatch(getLabs()),
  onGetAdvertisements: () => dispatch(getAdvertisements()),
  onGetdonors: () => dispatch(getDonors()),
  onGetInPayment: id => dispatch(getInPayment(id)),
  onAddInPaymentData: (inPayment, id) =>
    dispatch(addNewInPayment(inPayment, id)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InPaymentsForm)); 
