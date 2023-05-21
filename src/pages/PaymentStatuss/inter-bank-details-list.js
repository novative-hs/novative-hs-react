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
  getBankTransfer,
  updateBankTransfer,
} from "store/banktransferdetails/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class PaymentStatussList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      bankTransfers: [],
      bankTransfer: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      bankTransferListColumns: [
        {
          text: "BTD ID",
          dataField: "id",
          sort: true,
          hidden: false,
          formatter: (cellContent, bankTransfer) => (
            <>{bankTransfer.id}</>
          ),
        },
        {
          dataField: "invoice_id",
          text: "invoice ID",
          sort: true,
          hidden: true,
          formatter: (cellContent, bankTransfer) => (
            <>
              <strong>{bankTransfer.invoice_id}</strong>
            </>
          ),
        },
        {
          dataField: "transfer_type",
          text: "Transfer Type",
          sort: true,
        },
        {
          dataField: "deposit_type",
          text: "Deposit Type",
          sort: true,
          // headerStyle: {
          //   width: "330px",
          //   // textAlign: "left",
          // },
          formatter: (cellContent, bankTransfer) => (
            <>
              {bankTransfer.transfer_type == "Deposit" ? (
                <span>
                <strong>{bankTransfer.deposit_type}</strong>
                </span>
              ) : (
                <span>
                {"---"}
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "bank",
          text: "Payment Mode",
          sort: true,
          formatter: (cellContent, bankTransfer) => (
            <>
              {bankTransfer.transfer_type == "Interbank Transfer" ? (
                 <span>
                  <strong>{bankTransfer.mode}</strong>
                 </span>
              ) : (
                <span>
                {"---"}
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
          dataField: "cheque_no",
          text: "Cheque/Online Ref#",
          sort: true,
          // headerStyle: {
          //   width: "330px",
          //   // textAlign: "left",
          // },
          formatter: (cellContent, bankTransfer) => (
            <>
              {bankTransfer.transfer_type == "Deposit" ? (
                 <span>
                 {"---"}
                 </span>
              ) : (
                <span>
                <strong>{bankTransfer.cheque_no}</strong>
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "bank",
          text: "Bank/Account#",
          sort: true,
          formatter: (cellContent, bankTransfer) => (
            <>
              <span>
                <span>
                  {bankTransfer.bank_name},{" "}
                  {bankTransfer.account_no}
                </span>
              </span>
            </>
          ),
        },
        {
          dataField: "bank",
          text: "Bank/Account# (From)",
          sort: true,
          formatter: (cellContent, bankTransfer) => (
            <>
              {bankTransfer.transfer_type == "Interbank Transfer" ? (
                 <span>
                  {bankTransfer.bank_name},{" "}
                  {bankTransfer.account_no}
                 </span>
              ) : (
                <span>
                  {"---"}
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "bank",
          text: "Deposit Copy",
          sort: true,
          formatter: (cellContent, bankTransfer) => (
            <>
              {bankTransfer.transfer_type == "Withdraw" ? (
                 <span>
                  {"---"}
                 </span>
              ) : (
                <span>
                <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + bankTransfer.deposit_copy,
                }}
                target="_blank"
              >
                View
              </Link>
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "bank",
          text: "Deposit DateTime",
          sort: true,
          formatter: (cellContent, bankTransfer) => (
            <>
              {bankTransfer.transfer_type == "Withdraw" ? (
                 <span>
                  {"---"}
                 </span>
              ) : (
                <span>
                {new Date(bankTransfer.deposit_datetime).toLocaleString("en-US")}

                </span>
              )}
            </>
          ),
        },
        {
          dataField: "bank",
          text: "Payment Copy",
          sort: true,
          formatter: (cellContent, bankTransfer) => (
            <>
                <span>
                <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + bankTransfer.payment_copy,
                }}
                target="_blank"
              >
                View
              </Link>
                </span>
            </>
          ),
        },
        {
          dataField: "bank",
          text: "Payment DateTime",
          sort: true,
          formatter: (cellContent, bankTransfer) => (
            <>
                <span>
                {new Date(bankTransfer.payment_datetime).toLocaleString("en-US")}

                </span>
            </>
          ),
        },
        // {
        //   dataField: "bank",
        //   text: "Clearence DateTime",
        //   sort: true,
        //   formatter: (cellContent, bankTransfer) => (
        //     <>
        //         <span>
        //         {new Date(bankTransfer.clearence_datetime).toLocaleString("en-US")}

        //         </span>
        //     </>
        //   ),
        // },
        {
          dataField: "bank",
          text: "Clearence DateTime",
          sort: true,
          formatter: (cellContent, bankTransfer) => (
            <>
              {bankTransfer.clearence_datetime == null ? (
                 <span>
                  {"---"}
                 </span>
              ) : (
                <span>
                {new Date(bankTransfer.deposit_datetime).toLocaleString("en-US")}

                </span>
              )}
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
          formatter: (cellContent, bankTransfer) => (
            <div className="d-flex gap-3">
             
              <button
                type="submit"
                className="btn btn-primary save-user"
                onClick={e => this.handlePaymentStatusClick(e, bankTransfer)}

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
    const { bankTransfers, onGetBankTransfer } = this.props;
    onGetBankTransfer(this.state.user_id);
    this.setState({ bankTransfers });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handlePaymentStatusClicks = () => {
    this.setState({
      bankTransfer: "",
      deposit_slip: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { bankTransfers } = this.props;
    if (
      !isEmpty(bankTransfers) &&
      size(prevProps.bankTransfers) !== size(bankTransfers)
    ) {
      this.setState({ bankTransfers: {}, isEdit: false });
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
      bankTransfer: {
        id: arg.id,
        clearence_datetime: arg.clearence_datetime,
        status: arg.status,
      },
      isEdit: true,
    });

    this.toggle();
  };
  

  render() {
    const { SearchBar } = Search;

    const { bankTransfers } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onUpdateBankTransfer,
      onGetBankTransfer,
    } = this.props;
    const bankTransfer = this.state.bankTransfer;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: 100, // replace later with size(bankTransfers),
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
                      columns={this.state.bankTransferListColumns}
                      data={bankTransfers}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.bankTransferListColumns}
                          data={bankTransfers}
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
                                           
                                            // deposit_bank: (this.state && this.state.deposit_bank) || "",
                                            // deposit_slip: (this.state && this.state.deposit_slip) || "",
                                            // status: (this.state && this.state.status) || "",


                                            clearence_datetime:
                                              (this.state &&
                                                this.state.clearence_datetime) ||
                                              "",
                                            status:
                                              (this.state.bankTransfer &&
                                                this.state.bankTransfer
                                                  .status) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                           
                                                //   deposit_slip: Yup.string().required(
                                                //   "Please upload the file of payment slip"
                                                // ),
                                             

                                            //   deposit_slip: Yup.string().when(
                                            //   "hiddenEditFlag",
                                            //   {
                                            //     is: hiddenEditFlag =>
                                            //       hiddenEditFlag == false, //just an e.g. you can return a function
                                            //     then: Yup.string().required(
                                            //       "Please upload Payment Slip"
                                            //     ),
                                            //   }
                                            // ),
                                             // Validation for logo based on type value
                                            // type: Yup.string(),
                                            // logo: Yup.mixed().test(
                                            //   "required",
                                            //   "Please upload logo",
                                            // ),

                                           
                                          })}
                                          onSubmit={values => {
                                            const updateBankTransfer =
                                            {
                                              id: bankTransfer.id,
                                              clearence_datetime: values.clearence_datetime,
                                             
                                              // comments:
                                              //   values.comments,
                                                
                                            };

                                          // update PaymentStatus
                                          onUpdateBankTransfer(
                                            updateBankTransfer
                                          );
                                          setTimeout(() => {
                                            onGetBankTransfer(
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

                                                   <Label htmlFor="cardnumberInput">
                              Clearance DateTime
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <input
  name="clearence_datetime"
  type="datetime-local"
  defaultValue={bankTransfer.clearence_datetime}
  className="form-control"
  onChange={e =>
    this.setState({
      clearence_datetime: e.target.value,
    })
  }
/>

                                                </Col>
                                              </Row>
                                              <Row className="m-3"></Row>
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
  bankTransfers: PropTypes.array,
  className: PropTypes.any,
  onGetBankTransfer: PropTypes.func,
  onUpdateBankTransfer: PropTypes.func,
};

const mapStateToProps = ({ bankTransfers }) => ({
  bankTransfers: bankTransfers.bankTransfers,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetBankTransfer: id => dispatch(getBankTransfer(id)),
  onUpdateBankTransfer: bankTransfer =>
    dispatch(updateBankTransfer(bankTransfer)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaymentStatussList));