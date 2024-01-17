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
  getListInvoice,
  addNewInvoiceAdjustment,
  getStaffProfile
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
      staffProfiles: [],
      outPayment: "",
      modal: false,
      addmodal: false,
      confirmModal: false,
      id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      invoice_id: "",
      total_adjustment: "",
      tax: "",
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
        invoice_id: this.state.invoice_id,
        tax: this.state.tax,
        total_adjustment: this.state.total_adjustment,
        status: "Approved",
        comments: this.state.comments,
      },
    });

    // API call to create a new outPayment record
    const { onAddNewInvoiceAdjustment } = this.props;
    setTimeout(() => {
      console.log(
        onAddNewInvoiceAdjustment(this.state.outPayment, this.state.user_id)
      );
    }, 2000);
    // setTimeout(() => {
    //   this.props.history.push("/payment-out-pending-clearence-status");
    // }, 2000)
  };


  componentDidMount() {
    const { staffProfiles, onGetStaffProfile } = this.props;
    onGetStaffProfile(this.state.user_id);
    this.setState({
      staffProfiles
    });
    console.log("state", staffProfiles)

    const { listInvoice, onGetListInvoice } = this.props;
    if (listInvoice && !listInvoice.length) {
      onGetListInvoice();
    }
    this.setState({ listInvoice });
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
    const { staffProfiles } = this.props;
    const { listInvoice } = this.props;

    // const { units } = this.props;

    const { onAddNewInvoiceAdjustment, onGetOutPayment, onGetStaffProfile } =
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

    const listInvoiceList = [];
    for (let i = 0; i < listInvoice.length; i++) {
      if (listInvoice[i].office === this.props.staffProfiles.territory_office) {
        listInvoiceList.push({
          label: listInvoice[i].name,
          value: listInvoice[i].id,
          // type: listInvoice[i].type,
          // city: listInvoice[i].city,
        });
      }
    }


    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Invoice Adjustment Form | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Form" breadcrumbItem="Invoice Adjustment Form" />
            <Formik>
              <div className="checkout-tabs">
                {this.state.successMessage && <div>{this.state.successMessage}</div>}
                <Row>
                  <div> <span className="text-danger font-size-12">
                    {/* <strong>
                      Note: There will be that Labs, Donors and B2b Clients whose terriotory will match this staff.
                    </strong> */}
                  </span>
                    <br></br>
                  </div>
                  <Col lg="1" sm="1">
                  </Col>
                  <Col lg="10" sm="9">
                    <Card>
                      <CardBody>
                        <div>
                          {
                             outPayment.invoice_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Lab name
                                </Label>
                                <Field
                                  name="invoice_id"
                                  as="select"
                                  defaultValue={
                                    outPayment.invoice_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      outPayment.invoice_id
                                    }
                                    value={
                                      outPayment.invoice_id
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
                                <Label className="fw-bolder">Lab Name</Label>
                                <Select
                                  name="invoice_id"
                                  component="Select"
                                  onChange={selectedGroup =>
                                    this.setState({
                                      invoice_id:
                                        selectedGroup.value,
                                    })
                                  }
                                  className={
                                    "defautSelectParent" +
                                    (!this.state.invoice_id
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
                                        .state.invoice_id
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
                          }

                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Invoice Amount
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
                              required={true}
                              readOnly={true}
                              placeholder="Enter Amount"
                              name="total_adjustment"
                              value={this.state.total_adjustment}
                              onChange={e =>
                                this.setState({
                                  total_adjustment: e.target.value,
                                })
                              }
                            />
                          </FormGroup>
                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Tax
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >

                              </span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="cardnumberInput"
                              placeholder="Enter Tax"
                              name="tax"
                              value={this.state.tax}
                              onChange={e =>
                                this.setState({
                                  tax: e.target.value,
                                })
                              }
                            />
                          </FormGroup>
                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
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
                            </Col>
                            <Col sm="6">
                              <div className="text-end">
                                <button
                                  to="/dashboard-financeofficer"
                                  className="btn btn-danger"
                                  onClick={this.handleSubmitClicks}
                                // disabled={this.state.carts.length == 0}
                                >
                                  <i className="mdi mdi-truck-fast me-1" />
                                  Save and Approve
                                </button>
                              </div>

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
  history: PropTypes.object,
  outPayments: PropTypes.array,
  listInvoice: PropTypes.array,
  className: PropTypes.any,
  onGetOutPayment: PropTypes.func,
  onAddNewInvoiceAdjustment: PropTypes.func,
  onGetStaffProfile: PropTypes.func,
  staffProfiles: PropTypes.func,
  onGetListInvoice: PropTypes.func,

};

const mapStateToProps = ({ outPayments }) => ({
  outPayments: outPayments.outPayments,
  staffProfiles: outPayments.staffProfiles,
  listInvoice: outPayments.listInvoice,



  // units: outPayments.units,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetListInvoice: () => dispatch(getListInvoice()),
  onGetOutPayment: id => dispatch(getOutPayment(id)),
  onAddNewInvoiceAdjustment: (outPayment, id) =>
    dispatch(addNewInvoiceAdjustment(outPayment, id)),
  onGetStaffProfile: id => dispatch(getStaffProfile(id)),


});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OutPaymentsForm)); 
