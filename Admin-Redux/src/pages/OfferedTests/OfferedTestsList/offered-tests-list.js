import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
} from "reactstrap";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import images from "assets/images";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getUnits,
  getTests,
  getOfferedTests,
  addNewOfferedTest,
  updateOfferedTest,
  deleteOfferedTest,
} from "store/offered-tests/actions";

import { isEmpty, size, map } from "lodash";

class OfferedTestsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      offeredTests: [],
      tests: [],
      units: [],
      offeredTest: "",
      modal: false,
      deleteModal: false,
      offeredTestListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, offeredTest) => <>{offeredTest.id}</>,
        },
        {
          dataField: "test_name",
          text: "Test",
          sort: true,
        },
        {
          dataField: "unit_name",
          text: "Unit",
          sort: true,
        },
        {
          dataField: "reporting_range",
          text: "Reporting range",
          sort: true,
        },
        {
          dataField: "time_required_in_days",
          text: "Time required",
          sort: true,
        },
        {
          dataField: "price",
          text: "Price",
          sort: true,
        },
        {
          dataField: "is_eqa_participation",
          text: "EQA participation",
          sort: true,
        },
        {
          dataField: "is_home_sampling_available",
          text: "Home sampling",
          sort: true,
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, offeredTest) => (
            <div className="d-flex gap-3">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleOfferedTestClick(offeredTest)}
                ></i>
              </Link>
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(offeredTest)}
                ></i>
              </Link>
            </div>
          ),
        },
      ],
    };
    this.handleOfferedTestClick = this.handleOfferedTestClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleOfferedTestClicks = this.handleOfferedTestClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const { units, onGetUnits } = this.props;
    if (units && !units.length) {
      onGetUnits();
    }
    this.setState({ units });

    const { tests, onGetTests } = this.props;
    if (tests && !tests.length) {
      onGetTests();
    }
    this.setState({ tests });

    const { offeredTests, onGetOfferedTests } = this.props;
    if (offeredTests && !offeredTests.length) {
      onGetOfferedTests();
    }
    this.setState({ offeredTests });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleOfferedTestClicks = () => {
    this.setState({ offeredTest: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { offeredTests } = this.props;
    if (
      !isEmpty(offeredTests) &&
      size(prevProps.offeredTests) !== size(offeredTests)
    ) {
      this.setState({ offeredTests: {}, isEdit: false });
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

  onClickDelete = offeredTests => {
    this.setState({ offeredTests: offeredTests });
    this.setState({ deleteModal: true });
  };

  handleDeleteOfferedTest = () => {
    const { onDeleteOfferedTest } = this.props;
    const { offeredTests } = this.state;
    if (offeredTests.id !== undefined) {
      onDeleteOfferedTest(offeredTests);
      this.setState({ deleteModal: false });
    }
  };

  handleOfferedTestClick = arg => {
    const offeredTest = arg;

    this.setState({
      offeredTest: {
        id: offeredTest.id,
        test_name: offeredTest.test_name,
        unit_name: offeredTest.unit_name,
        reporting_range: offeredTest.reporting_range,
        time_required_in_days: offeredTest.time_required_in_days,
        price: offeredTest.price,
        is_eqa_participation: offeredTest.is_eqa_participation,
        is_home_sampling_available: offeredTest.is_home_sampling_available,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { offeredTests } = this.props;
    const { tests } = this.props;
    const { units } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onAddNewOfferedTest, onUpdateOfferedTest } = this.props;
    const { selectedOfferedTest } = this.state;
    const offeredTest = this.state.offeredTest;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: offeredTests.length, // replace later with size(offeredTests),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const selectRow = {
      mode: "checkbox",
    };

    console.log("Test: ", tests);
    console.log("Unit: ", units);
    console.log("Offered Test: ", offeredTests);

    const testList = [];
    for (let i = 0; i < tests.length; i++) testList.push(tests[i]);

    const unitList = [];
    for (let i = 0; i < units.length; i++) unitList.push(units[i]);

    console.log("tests: ", testList);
    console.log("units: ", unitList);

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteOfferedTest}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Offered Tests List | Ilaaj4u</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Offered Tests" breadcrumbItem="Tests List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.offeredTestListColumns}
                      data={offeredTests}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.offeredTestListColumns}
                          data={offeredTests}
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
                                <Col sm="8">
                                  <div className="text-sm-end">
                                    <Button
                                      color="primary"
                                      className="font-16 btn-block btn btn-primary"
                                      onClick={this.handleOfferedTestClicks}
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Test
                                    </Button>
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      selectRow={selectRow}
                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-nowrap table-hover"
                                      }
                                      bordered={false}
                                      striped={false}
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
                                            test_name:
                                              (offeredTest &&
                                                offeredTest.test_name) ||
                                              "",
                                            unit_name:
                                              (offeredTest &&
                                                offeredTest.unit_name) ||
                                              "",
                                            reporting_range:
                                              (offeredTest &&
                                                offeredTest.reporting_range) ||
                                              "",
                                            time_required_in_days:
                                              (offeredTest &&
                                                offeredTest.time_required_in_days) ||
                                              "",
                                            price:
                                              (offeredTest &&
                                                offeredTest.price) ||
                                              "",
                                            is_eqa_participation:
                                              (offeredTest &&
                                                offeredTest.price) ||
                                              "",
                                            is_home_sampling_available:
                                              (offeredTest &&
                                                offeredTest.price) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            test_name: Yup.string().required(
                                              "Please enter test name"
                                            ),
                                            unit_name: Yup.string().required(
                                              "Please enter unit name"
                                            ),
                                            reporting_range:
                                              Yup.string().required(
                                                "Please enter reporting range"
                                              ),
                                            time_required_in_days:
                                              Yup.array().required(
                                                "Please enter time required in days"
                                              ),
                                            price:
                                              Yup.string().required(
                                                "Please enter price"
                                              ),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              const updateOfferedTest = {
                                                id: offeredTest.id,
                                                test_id: values.test_id,
                                                unit_name: values.unit_name,
                                                reporting_range:
                                                  values.reporting_range,
                                                time_required_in_days:
                                                  values.time_required_in_days,
                                                price: values.price,
                                                is_eqa_participation:
                                                  values.is_eqa_participation,
                                                is_home_sampling_available:
                                                  values.is_home_sampling_available,
                                              };

                                              // update OfferedTest
                                              onUpdateOfferedTest(
                                                updateOfferedTest
                                              );
                                            } else {
                                              const newOfferedTest = {
                                                test_id:
                                                  values["testest_idt_name"],
                                                unit_name: values["unit_name"],
                                                reporting_range:
                                                  values["reporting_range"],
                                                time_required_in_days:
                                                  values[
                                                    "time_required_in_days"
                                                  ],
                                                price: values["price"],
                                                is_eqa_participation:
                                                  values[
                                                    "is_eqa_participation"
                                                  ],
                                                is_home_sampling_available:
                                                  values[
                                                    "is_eqa_partiis_home_sampling_availablecipation"
                                                  ],
                                              };
                                              // save new OfferedTest
                                              onAddNewOfferedTest(
                                                newOfferedTest
                                              );
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
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Test name
                                                    </Label>
                                                    <Field
                                                      name="test_id"
                                                      as="select"
                                                      className={
                                                        "form-control" +
                                                        (errors.test_id &&
                                                        touched.test_id
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      multiple={false}
                                                    >
                                                      {tests.map(test => (
                                                        <option
                                                          key={test["id"]}
                                                          value={test["id"]}
                                                        >
                                                          {test["name"]}
                                                        </option>
                                                      ))}
                                                    </Field>
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Unit name
                                                    </Label>
                                                    <Field
                                                      name="unit_id"
                                                      as="select"
                                                      className={
                                                        "form-control" +
                                                        (errors.unit_id &&
                                                        touched.unit_id
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      multiple={false}
                                                    >
                                                      {units.map(unit => (
                                                        <option
                                                          key={unit["id"]}
                                                          value={unit["id"]}
                                                        >
                                                          {unit["name"]}
                                                        </option>
                                                      ))}
                                                    </Field>
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Reporting range
                                                    </Label>
                                                    <Field
                                                      name="reporting_range"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.reporting_range &&
                                                        touched.reporting_range
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="reporting_range"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Time required in days
                                                    </Label>
                                                    <Field
                                                      name="time_required_in_days"
                                                      type="number"
                                                      className={
                                                        "form-control" +
                                                        (errors.time_required_in_days &&
                                                        touched.time_required_in_days
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="time_required_in_days"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Price
                                                    </Label>
                                                    <Field
                                                      name="price"
                                                      type="number"
                                                      className={
                                                        "form-control" +
                                                        (errors.price &&
                                                        touched.price
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="price"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Is EQA participating?
                                                    </Label>
                                                    <Field
                                                      name="is_eqa_participation"
                                                      as="select"
                                                      className={
                                                        "form-control" +
                                                        (errors.is_eqa_participation &&
                                                        touched.is_eqa_participation
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      multiple={false}
                                                    >
                                                      <option>Yes</option>
                                                      <option>No</option>
                                                    </Field>
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Is home sampling
                                                      available?
                                                    </Label>
                                                    <Field
                                                      name="is_home_sampling_available"
                                                      as="select"
                                                      className={
                                                        "form-control" +
                                                        (errors.is_home_sampling_available &&
                                                        touched.is_home_sampling_available
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      multiple={false}
                                                    >
                                                      <option>Yes</option>
                                                      <option>No</option>
                                                    </Field>
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

OfferedTestsList.propTypes = {
  match: PropTypes.object,
  tests: PropTypes.array,
  units: PropTypes.array,
  offeredTests: PropTypes.array,
  className: PropTypes.any,
  onGetOfferedTests: PropTypes.func,
  onGetTests: PropTypes.func,
  onGetUnits: PropTypes.func,
  onAddNewOfferedTest: PropTypes.func,
  onDeleteOfferedTest: PropTypes.func,
  onUpdateOfferedTest: PropTypes.func,
};

const mapStateToProps = ({ offeredTests }) => ({
  offeredTests: offeredTests.offeredTests,
  tests: offeredTests.tests,
  units: offeredTests.units,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetTests: () => dispatch(getTests()),
  onGetUnits: () => dispatch(getUnits()),
  onGetOfferedTests: () => dispatch(getOfferedTests(ownProps.match.params.id)),
  onAddNewOfferedTest: offeredTest => dispatch(addNewOfferedTest(offeredTest)),
  onUpdateOfferedTest: offeredTest => dispatch(updateOfferedTest(offeredTest)),
  onDeleteOfferedTest: offeredTest => dispatch(deleteOfferedTest(offeredTest)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OfferedTestsList));
