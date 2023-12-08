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
import filterFactory, { textFilter ,selectFilter} from 'react-bootstrap-table2-filter';
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getCemployees,
  updateCemployee,
} from "store/corporatedata/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class BanksList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      cemployees: [],
      cemployee: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      employeesListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          formatter: (cellContent, cemployee) => (
            <>{cemployee.id}</>
          ),filter: textFilter(),
        },
        {
          dataField: "name",
          text: "Employee Name",
          sort: true,
          formatter: (cellContent, cemployee) => (
            <>
                {cemployee.name}
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "employee_code",
          text: "Employee Code",
          sort: true,
          formatter: (cellContent, cemployee) => (
            <>
                {cemployee.employee_code}
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, cemployee) => (
            <div className="d-flex gap-3">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e =>
                    this.handlePaymentStatusClick(e, cemployee)
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
    const { cemployees, ongetCemployees } = this.props;
    ongetCemployees(this.state.user_id);
    this.setState({ cemployees });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handlePaymentStatusClicks = () => {
    this.setState({
      cemployee: "",
      deposit_slip: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { cemployees } = this.props;
    if (
      !isEmpty(cemployees) &&
      size(prevProps.cemployees) !== size(cemployees)
    ) {
      this.setState({ cemployees: {}, isEdit: false });
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
      cemployee: {
        id: arg.id,
        // deposited_at: arg.deposited_at,
        name: arg.name,
        employee_code: arg.employee_code,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { cemployees } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onupdateCemployee,
      ongetCemployees,
    } = this.props;
    const cemployee = this.state.cemployee;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: cemployees.length, // replace later with size(cemployees),
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
            <title>Corporate Employee List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Corporate Employee List"
              breadcrumbItem="Corporate Employee List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.employeesListColumns}
                      data={cemployees}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.employeesListColumns}
                          data={cemployees}
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
                                      filter={ filterFactory()}
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
                                          ? "Edit Employee Details"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            name:
                                              (this.state.cemployee &&
                                                this.state.cemployee
                                                  .name) ||
                                              "",
                                            employee_code:
                                              (this.state.cemployee &&
                                                this.state.cemployee
                                                  .employee_code) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                          })}
                                          onSubmit={values => {
                                            const updateCemployee =
                                            {
                                              id: cemployee.id,
                                              name: values.name,
                                              employee_code: values.employee_code,
                                                
                                            };

                                          // update PaymentStatus
                                          onupdateCemployee(
                                            updateCemployee
                                          );
                                          setTimeout(() => {
                                            ongetCemployees(
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

<div className="mb-3">
                                                    <Label
                                                      className="col-form-label"
                                                    >
                                                      Employee Name
                                                      <span
                                                        style={{ color: "#f46a6a" }}
                                                        className="font-size-18"
                                                      >
                                                        *
                                                      </span>
                                                    </Label>
                                                      <Input
                                                        type="text"
                                                      value={
                                                        this.state
                                                          .cemployee
                                                          .name}
                                                          onChange={e => {
                                                              this.setState({
                                                                cemployee: {
                                                                  id: cemployee.id,
                                                                  employee_code:
                                                                    cemployee.employee_code,
                                                                  name:
                                                                    e.target.value,
                                                                },
                                                              });
                                                            }}
                                                            className={
                                                              "form-control" +
                                                              (errors.name &&
                                                              touched.name
                                                                ? " is-invalid"
                                                                : "")
                                                            } 
                                                          
                                                      />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label
                                                      className="col-form-label"
                                                    >
                                                      Employee Code
                                                      <span
                                                        style={{ color: "#f46a6a" }}
                                                        className="font-size-18"
                                                      >
                                                        *
                                                      </span>
                                                    </Label>
                                                      <Input
                                                        id="employee_code"
                                                        name="employee_code"
                                                        type="text"
                                                        value={
                                                          this.state
                                                            .cemployee
                                                            .employee_code}  
                                                            onChange={e => {
                                                              this.setState({
                                                                cemployee: {
                                                                  id: cemployee.id,
                                                                  name:
                                                                    cemployee.name,
                                                                  employee_code:
                                                                    e.target.value,
                                                                },
                                                              });
                                                            }}
                                                            className={
                                                              "form-control" +
                                                              (errors.employee_code &&
                                                              touched.employee_code
                                                                ? " is-invalid"
                                                                : "")
                                                            } 
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
  cemployees: PropTypes.array,
  className: PropTypes.any,
  ongetCemployees: PropTypes.func,
  onupdateCemployee: PropTypes.func,
};

const mapStateToProps = ({ cemployeeData }) => ({
  cemployees: cemployeeData.cemployees,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ongetCemployees: id => dispatch(getCemployees(id)),
  onupdateCemployee: cemployee =>
    dispatch(updateCemployee(cemployee)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BanksList));
