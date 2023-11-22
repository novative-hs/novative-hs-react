import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import Select from "react-select";
import { Tooltip } from "@material-ui/core";
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
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getBankaccounts,
  updateBankaccount,
} from "store/bankaccounts/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class BanksList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      bankaccounts: [],
      bankaccount: "",
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
          formatter: (cellContent, bankaccount) => (
            <>{bankaccount.id}</>
          ), filter: textFilter(),
        },
        {
          dataField: "account_no",
          text: "Account No",
          sort: true,
          formatter: (cellContent, bankaccount) => (
            // <Link to={`/bank-account-statements/${bankaccount.id}`}>
            <> {bankaccount.account_no}</>
            // </Link>
          ), filter: textFilter(),

        },
        {
        dataField: "account_type",
        text: "Account Type",
        sort: true,
        formatter: (cellContent, bankaccount) => (
          // <Link to={`/bank-account-statements/${bankaccount.id}`}>
          <> {bankaccount.account_type}</>
          // </Link>
        ), filter: textFilter(),
      },
        {
          dataField: "categorey",
          text: "Catagorey",
          sort: true,
          formatter: (cellContent, bankaccount) => (
            // <Link to={`/bank-account-statements/${bankaccount.id}`}>
            <> {bankaccount.categorey}</>
            // </Link>
          ), filter: textFilter(),
        },
        {
          dataField: "currency",
          text: "Currency",
          sort: true,
          formatter: (cellContent, bankaccount) => (
            // <Link to={`/bank-account-statements/${bankaccount.id}`}>
            <> {bankaccount.currency}</>
            // </Link>
          ), filter: textFilter(),
        },
        {
          dataField: "city",
          text: "City",
          sort: true,
          formatter: (cellContent, bankaccount) => (
            // <Link to={`/bank-account-statements/${bankaccount.id}`}>
            <> {bankaccount.city}</>
            // </Link>
          ), filter: textFilter(),
        },
        {
          dataField: "address",
          text: "Address",
          sort: true,
          formatter: (cellContent, bankaccount) => (
            // <Link to={`/bank-account-statements/${bankaccount.id}`}>
            <> {bankaccount.address}</>
            // </Link>
          ), filter: textFilter(),
        },
        {
          dataField: "opening_balance",
          text: "Opening Balance",
          sort: true,
          formatter: (cellContent, bankaccount) => (
            <div className="text-end">
              <> {bankaccount.opening_balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</>
            </div>), filter: textFilter(),
        },
        {
          dataField: "creating_at",
          text: "Created At",
          sort: true,
          formatter: (cellContent, bankaccount) => {
            const date = new Date(bankaccount.creating_at);
            const day = date.getDate();
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear().toString().slice(-2); // Get the last 2 digits of the year
        
            return (
                <p className="text-muted mb-0">
                    {`${day}-${month}-${year}`}
                </p>
            );
        },
        filter: textFilter(),
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
          formatter: (cellContent, bankaccount) => (
            // <Link to={`/bank-account-statements/${bankaccount.id}`}>
            <> {bankaccount.status}</>
            // </Link>
          ), filter: textFilter(),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, bankaccount) => (
            <div>
              <Tooltip title="Update">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e =>
                    this.handlePaymentStatusClick(e, bankaccount)
                  }
                ></i>
              </Link>
              </Tooltip>

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

  // The code for converting "Base64" to javascript "File Object"
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
    const { bankaccounts, onGetBankaccounts } = this.props;
    onGetBankaccounts(this.state.user_id);
    this.setState({ bankaccounts });

    // const { bankaccounts, onGetbankAccounts } = this.props;
    // if (bankaccounts && !bankaccounts.length) {
    //   onGetbankAccounts();
    // }
    // this.setState({ bankaccounts });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handlePaymentStatusClicks = () => {
    this.setState({
      bankaccount: "",
      deposit_slip: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { bankaccounts } = this.props;
    if (
      !isEmpty(bankaccounts) &&
      size(prevProps.bankaccounts) !== size(bankaccounts)
    ) {
      this.setState({ bankaccounts: {}, isEdit: false });
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
      bankaccount: {
        id: arg.id,
        // deposited_at: arg.deposited_at,
        status: arg.status,
        account_no: arg.account_no,
        // phone: arg.phone,
        // registered_by: arg.registered_by,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;


    const { isEdit, deleteModal } = this.state;

    const {
      onUpdateBankaccount,
      onGetBankaccounts,
    } = this.props;
    const bankaccount = this.state.bankaccount;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: 100, // replace later with size(bankaccounts),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const { bankaccounts } = this.props;
    const bankaccountList = [];
    for (let i = 0; i < bankaccounts.length; i++) {
      let flag = 0;
      // for (let j = 0; j < bankaccounts.length; j++) {
      //   if (banks[i].id == bankaccounts[j].bank_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        bankaccountList.push(
          {
            label: `${bankaccounts[i].bank_name} - ${bankaccounts[i].account_no}`,
            value: `${bankaccounts[i].id}`,
          }
        );
      }
    }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Bank Accounts List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Bank Accounts List"
              breadcrumbItem="Bank Accounts List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.paymentStatusListColumns}
                      data={bankaccounts}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.paymentStatusListColumns}
                          data={bankaccounts}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  {/* {bankaccount.bankaccount_id ? (
                                    <div className="mb-3">
                                      <Label className="col-form-label">Bank Account Name</Label>

                                      <Field
                                        name="bankaccount_id"
                                        as="select"
                                        defaultValue={bankaccount.bankaccount_id}
                                        className="form-control"
                                        readOnly={true}
                                        multiple={false}
                                        onChange={(e) => {
                                          const selectedAccountId = e.target.value;
                                          this.props.history.push(`/bank-account-statements/${selectedAccountId}`);
                                        }}
                                      >
                                        <option key={bankaccount.bankaccount_id} value={bankaccount.bankaccount_id}>
                                          {bankaccount.account_no}
                                        </option>
                                      </Field>
                                    </div>
                                  ) : (
                                    <div className="mb-3 select2-container">
                                      <Label className="col-form-label">Bank Account Name</Label>

                                      <Select
                                        name="bankaccount_id"
                                        component="Select"
                                        onChange={(selectedOption) => {
                                          const selectedAccountId = selectedOption.value;
                                          this.props.history.push(`/bank-account-statements/${selectedAccountId}`);
                                        }}
                                        options={bankaccountList}
                                        placeholder="Select Bank Account..."
                                      />
                                    </div>
                                  )} */}

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
                                      filter={filterFactory()}

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
                                          ? "Edit Bank Account"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            account_no:
                                              (this.state.bankaccount &&
                                                this.state.bankaccount
                                                  .account_no) ||
                                              "",
                                            // deposit_bank: (this.state && this.state.deposit_bank) || "",
                                            // deposit_slip: (this.state && this.state.deposit_slip) || "",
                                            // status: (this.state && this.state.status) || "",


                                            status:
                                              (this.state.bankaccount &&
                                                this.state.bankaccount
                                                  .status) ||
                                              "",
                                            // phone:
                                            //   (this.state.bankaccount &&
                                            //     this.state.bankaccount
                                            //       .phone) ||
                                            //   "",
                                            // email:
                                            //   (this.state.bankaccount &&
                                            //     this.state.bankaccount
                                            //       .email) ||
                                            //   "",
                                            // registered_by:
                                            //   (this.state.bankaccount &&
                                            //     this.state.bankaccount
                                            //       .registered_by) ||
                                            //   "",
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
                                            const updateBankaccount =
                                            {
                                              id: bankaccount.id,
                                              // deposited_by:
                                              //   values.deposited_by,
                                              // name: values.name,
                                              account_no: values.account_no,
                                              status:
                                                values.status,

                                            };

                                            // update PaymentStatus
                                            onUpdateBankaccount(
                                              updateBankaccount
                                            );
                                            setTimeout(() => {
                                              onGetBankaccounts(
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

                                                  {/*<div className="mb-3">
                                                    <Label
                                                      className="col-form-label"
                                                    >
                                                      Phone
                                                      <span
                                                        style={{ color: "#f46a6a" }}
                                                        className="font-size-18"
                                                      >
                                                        *
                                                      </span>
                                                    </Label>
                                                      <Input
                                                        id="phone"
                                                        name="phone"
                                                        type="text"
                                                        value={
                                                          this.state
                                                            .bankaccount
                                                            .phone}  
                                                            onChange={e => {
                                                              this.setState({
                                                                bankaccount: {
                                                                  id: bankaccount.id,
                                                                  name:
                                                                    bankaccount.name,
                                                                  email: bankaccount.email,
                                                                  registered_by: bankaccount.registered_by,
                                                                  phone:
                                                                    e.target.value,
                                                                },
                                                              });
                                                            }}
                                                            className={
                                                              "form-control" +
                                                              (errors.phone &&
                                                              touched.phone
                                                                ? " is-invalid"
                                                                : "")
                                                            } 
                                                      />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label
                                                      className="col-form-label"
                                                    >
                                                      Email
                                                      <span
                                                        style={{ color: "#f46a6a" }}
                                                        className="font-size-18"
                                                      >
                                                        *
                                                      </span>
                                                    </Label>
                                                      <Input
                                                        name="email"
                                                        type="text"
                                                        // value={
                                                        //   this.state
                                                        //     .bankaccount
                                                        //     .email} 

                                                            onChange={e => {
                                                              this.setState({
                                                                bankaccount: {
                                                                  id: bankaccount.id,
                                                                  name:
                                                                    bankaccount.name,
                                                                  phone: bankaccount.phone,
                                                                  registered_by: bankaccount.registered_by,
                                                                  email:
                                                                    e.target.value,
                                                                },
                                                              });
                                                            }}
                                                            className={
                                                              "form-control" +
                                                              (errors.email &&
                                                              touched.email
                                                                ? " is-invalid"
                                                                : "")
                                                            } 
                                                      />
                                                  </div>
                                                  
                                                  <div className="mb-3">
                                                    <Label
                                                      className="col-form-label"
                                                    >
                                                      Registered By
                                                      <span
                                                        style={{ color: "#f46a6a" }}
                                                        className="font-size-18"
                                                      >
                                                        *
                                                      </span>
                                                    </Label>
                                                      <Input
                                                        name="registered_by"
                                                        type="text"
                                                        value={
                                                          this.state
                                                            .bankaccount
                                                            .registered_by}
                                                              
                                                            onChange={e => {
                                                              this.setState({
                                                                bankaccount: {
                                                                  id: bankaccount.id,
                                                                  name:
                                                                    bankaccount.name,
                                                                  phone: bankaccount.phone,
                                                                  email: bankaccount.email,
                                                                  registered_by:
                                                                    e.target.value,
                                                                },
                                                              });
                                                            }}
                                                            className={
                                                              "form-control" +
                                                              (errors.registered_by &&
                                                              touched.registered_by
                                                                ? " is-invalid"
                                                                : "")
                                                            }                                                             
                                                      />
                                                  </div>
                                                   {/* Certificate Expiry date field 

                                                   <div className="mb-3">
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
                                                          bankaccount: {
                                                            id: bankaccount.id,
                                                            deposit_bank: bankaccount.deposit_bank,
                                                            deposit_slip: bankaccount.deposit_slip,
                                                            deposited_at:
                                                              e.target.value +
                                                              ":00Z",
                                                            // estimated_result_uploading_at:
                                                            //   bankaccount.estimated_result_uploading_at,
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
                                                  </div> 

                                                   <div className="mb-3">
                                                    <Label className="form-label">
                                                      Deposit Bank
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <select
                                                        name="deposit_bank"
                                                        component="select"
                                                        onChange={e =>
                                                          this.setState({
                                                            deposit_bank: e.target.value,
                                                          })
                                                        }
                                                        value={
                                                          this.state
                                                            .bankaccount
                                                            .deposit_bank}                                                        className="form-select"
                                                      >
                                                        <option
                                                          value=""
                                                        >
                                                          --- Please select the Type
                                                          ---
                                                        </option> 
                                                        <option value="Hbl">Hbl</option>
                                                        <option value="Meezan">Meezan</option>
                                                      </select>

                                                    <ErrorMessage
                                                      name="deposit_bank"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div> 

                                                   {/* Certificate field 
                                                   <div className="mb-3">
                                                      <Label for="name" className="form-label">
                                                        Deposit Slip
                                                      </Label>
                                                       <Input
                                                          id="formFile"
                                                          name="deposit_slip"
                                                          placeholder="Choose file"
                                                          type="file"
                                                          value={
                                                            this.state
                                                              .bankaccount
                                                              .deposit_slip}   
                                                          multiple={false}
                                                          accept=".jpg,.jpeg,.png,.word,.pdf"
                                                          onChange={e => {
                                                            this.setState({
                                                              resultFile:
                                                                e.target
                                                                  .files[0],
                                                            });
                                                          }}
                                                          className={
                                                            "form-control" +
                                                            (errors.deposit_slip &&
                                                            touched.deposit_slip
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                        />

                                                      <ErrorMessage
                                                        name="deposit_slip"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>  */}

                                                  {/* Certificate Type field */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Account No
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Input
                                                      name="account_no"
                                                      type="text"
                                                      // className="form-control"
                                                      className={
                                                        "form-control" +
                                                        (errors.account_no &&
                                                          touched.account_no
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          bankaccount: {
                                                            id: bankaccount.id,
                                                            // deposit_bank:
                                                            //   bankaccount.deposit_bank,
                                                            // // deposited_at: bankaccount.deposit_bank,
                                                            // deposit_slip: bankaccount.deposit_slip,
                                                            account_no:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      // multiple={false}
                                                      value={
                                                        this.state
                                                          .bankaccount
                                                          .account_no
                                                      }
                                                    >
                                                    </Input>
                                                    <ErrorMessage
                                                      name="account_no"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
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
                                                      // onChange={e => {
                                                      //   this.setState({
                                                      //     bankaccount: {
                                                      //       id: bankaccount.id,
                                                      //       deposit_bank:
                                                      //         bankaccount.deposit_bank,
                                                      //       // deposited_at: bankaccount.deposit_bank,
                                                      //       deposit_slip: bankaccount.deposit_slip,
                                                      //       status :
                                                      //         e.target.value,
                                                      //     },
                                                      //   });
                                                      // }}
                                                      multiple={false}
                                                      value={
                                                        this.state
                                                          .bankaccount
                                                          .status
                                                      }
                                                    >
                                                      <option value="ACTIVE">Active</option>
                                                      <option value="IN_ACTIVE">In_Active</option>

                                                    </Field>
                                                    <ErrorMessage
                                                      name="status"
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

BanksList.propTypes = {
  match: PropTypes.object,
  bankaccounts: PropTypes.array,
  className: PropTypes.any,
  onGetBankaccounts: PropTypes.func,
  onUpdateBankaccount: PropTypes.func,
  history: PropTypes.any,

};

const mapStateToProps = ({ bankaccounts }) => ({
  bankaccounts: bankaccounts.bankaccounts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetBankaccounts: id => dispatch(getBankaccounts(id)),
  onUpdateBankaccount: bankaccount =>
    dispatch(updateBankaccount(bankaccount)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BanksList));
