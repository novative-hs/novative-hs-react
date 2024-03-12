import React, { Component, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import * as Yup from "yup";

import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";

//Import Breadcrumb
import "assets/scss/table.scss";
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  // getUnits,
  getLabCorporate,
} from "store/corporatedata/actions";import {
  // getUnits,
  addNewCorporate,
} from "store/offered-tests/actions";

class TestsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      cemployeeDatas: [],
      offeredTests: [],
      offeredTest: "",
      corporate_id: "",
      assignedTo: "",
      TestsList: "",
      btnText: "Copy",
      cemployeeDatas: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      testsListListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, offeredTest) => <>{offeredTest.id}</>,
        },
        {
          dataField: "name",
          text: "Corporate Name",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span className="float-start">
                {offeredTest.name}
              </span>
            </>
          ),
        },
        {
          dataField: "offered_tests",
          text: "Test List",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              {/* <span>
              {offeredTest.offered_tests}
              </span> */}
              <Link to={`/corporate-offered-tests/${offeredTest.account_id}`}>{offeredTest.offered_tests}</Link>

            </>
          ),
        },
        {
          dataField: "payment_terms",
          text: "Payment Terms",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span>
                {offeredTest.payment_terms}
              </span>
            </>
          ),
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span>
                {offeredTest.status}
              </span>
            </>
          ),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, offeredTest) => (
            // <div className="d-flex gap-6">
              <div className="float-middle">
                <Button
                  color="primary"
                  className="w-55  btn-block btn btn-primary"
                  // onClick={() => this.handleOfferedTestClicks(offeredTest.id)}
                  onClick={e => this.handleOfferedTestClicks(e, offeredTest.id, offeredTest.name)}

                // disabled={offeredTest.length == 0}
                >
                  <i className="mdi mdi-sticker-check-outline me-1" />
                  Accept
                </Button>
              </div>
            // </div>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.toggleMessageModal.bind(this);
    this.handleOfferedTestClicks = this.handleOfferedTestClicks.bind(this);
    // this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
  }

  componentDidMount() {
    const { cemployeeDatas, onGetLabCorporate } = this.props;
    console.log(onGetLabCorporate(this.state.user_id));
    this.setState({ cemployeeDatas });
  }
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      test_details: arg.test_details,
      description_in_english: arg.description_in_english,
      description_in_urdu: arg.description_in_urdu,
    });
  };
  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  openOtherModal = (e, arg) => {
    this.setState({
      OtherModal: true,
      test_details: arg.test_details,
      description_in_english: arg.description_in_english,
      description_in_urdu: arg.description_in_urdu,
    });
  };
  toggleOtherModal = () => {
    this.setState(prevState => ({
      OtherModal: !prevState.OtherModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleApprovedEvent = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.toggle();
  };

  toggleMessageModal = () => {
    this.setState(prevState => ({
      messageModal: !prevState.messageModal,
    }));
  };

  openMessageModal = (e, arg) => {
    this.setState({ messageModal: true, message: arg.message });
  };

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

  handleApprovedEvent = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.toggle();
  };
  handleOfferedTestClicks = (e, arg1, arg2) => {
    this.setState({
      offeredTest: "",
      isEdit: false,
      initialValues: {
        ...this.state.initialValues,
        corporate_id: arg1, // set the corporate_id value to arg
        name: arg2,
      },
      selectedTest: arg1, // store arg in component state
      selectedname: arg2, 

    });
    this.toggle();
  };
  handleSaveButtonClick = () => {
    // Your other logic...
    const { selectedTest } = this.state; // Use selectedTest from the component state
  
    const newOfferedTest = {
      corporate_id: selectedTest, // Use selectedTest as the corporate_id value
      status: this.state.status,
    };
  
    // Dispatch the action
    this.props.onAddNewCorporate(newOfferedTest,this.state.user_id);
  
    // Optionally, you can handle the asynchronous behavior here
    // For example, use a promise or callback function
    setTimeout(() => {
      this.props.onGetLabCorporate(
        this.state.user_id
      );
    }, 1000);
  
    // Close the modal or perform other actions as needed
    this.toggle();
  };
  render() {
    const { SearchBar } = Search;
    const { isEdit, deleteModal } = this.state;
    const { offeredTests } = this.props;
    const offeredTest = this.state.offeredTest;
    const { cemployeeDatas } = this.props;
    const data = this.state.data;
    const { onAddNewCorporate, onGetLabCorporate } = this.props;

    const pageOptions = {
      sizePerPage: cemployeeDatas.length,
      totalSize: cemployeeDatas.length, // replace later with size(cemployeeDatas),
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
            <title>Corporate Medical Tests | Lab Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Tests" breadcrumbItem="Corporations List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.testsListListColumns}
                      data={cemployeeDatas}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.testsListListColumns}
                          data={cemployeeDatas}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                              <div> 
                                  <span className="text-danger font-size-12">
                  <strong>
                    Note: Here only the list of Corporations that match your Territorie will be shown.
                  </strong>
                  </span>
                  </div>
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 mt-2 d-inline-block">
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
                                          ? "Edit Offered Test"
                                          : "Add Offered Test"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            status:
                                              (offeredTest &&
                                                offeredTest.status) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            status: Yup.number(
                                              "Please enter number only"
                                            )
                                              .required(
                                                "Please enter your status"
                                              )
                                              .positive()
                                              .integer()
                                              .min(
                                                0,
                                                "Please enter a number greater than or equal to 0"
                                              )
                                              .max(
                                                50000,
                                                "Please enter a number less than or equal to 50000"
                                              ),
                                          })}
                                          // in onSubmit function
                                          onSubmit={values => {
                                            {
                                              const newOfferedTest = {
                                                corporate_id: offeredTest.id,
                                                status: values.status,
                                              };
                                              onAddNewCorporate(newOfferedTest, this.state.user_id);
                                              setTimeout(() => {
                                                onGetLabCorporate(this.state.user_id);
                                              }, 1000);
                                            }
                                            this.setState({
                                              selectedOfferedTest: null,
                                            });
                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                              <div className="mb-3">
                                                    <Label className="form-label">
                                                      Corporate id
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="corporate_id"
                                                      type="text"
                                                      readOnly={true}
                                                      value= {this.state.selectedname}
                                                      className={
                                                        "form-control" +
                                                        (errors.corporate_id &&
                                                        touched.corporate_id
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="corporate_id"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                  <Label
                                                    htmlFor="name"
                                                    md="2"
                                                    className="col-form-label"
                                                  >
                                                    Status
                                                    <span
                                                      style={{ color: "#f46a6a" }}
                                                      className="font-size-18"
                                                    >
                                                      *
                                                    </span>
                                                  </Label>
                                                  <Col md="10">
                                                    <select
                                                      name="status"
                                                      component="select"
                                                      onChange={e => this.setState({ status: e.target.value })}
                                                      defaultValue={this.state.status}
                                                      className="form-select"
                                                    >
                                                      {/* options */}
                                                      <option value=" ">Choose a Option</option>
                                                      <option value="Pending">Pending</option>
                                                      <option value="Accept">Accept</option>
                                                    </select>
                                                  </Col>
                                                  </div>

                                                </Col>
                                              </Row>

                                              <Row>
                                                <Col>
                                                  <div className="text-end">
                                                  <button
  type="button"
  className="btn btn-success save-user"
  onClick={() => this.handleSaveButtonClick()}
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

TestsList.propTypes = {
  match: PropTypes.object,
  cemployeeDatas: PropTypes.array,
  className: PropTypes.any,
  onGetLabCorporate: PropTypes.func,
  onAddNewCorporate: PropTypes.func,
  offeredTests: PropTypes.array,
  onAssignAudit: PropTypes.func,
};
const mapStateToProps = ({ cemployeeData }) => ({
  cemployeeDatas: cemployeeData.cemployeeDatas,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetLabCorporate: id => dispatch(getLabCorporate(id)),
  onAddNewCorporate: (offeredTest, id) =>
    dispatch(addNewCorporate(offeredTest, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestsList));
