import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import axios from "axios";
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

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  // getUnits,
  getTests,
  getOfferedTests,
  addNewOfferedTest,
  updateOfferedTest,
  deleteOfferedTest,
} from "store/offered-tests/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class OfferedTestsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      offeredTests: [],
      tests: [],
      // units: [],
      offeredTest: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
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
          dataField: "test_type",
          text: "Type",
          sort: true,
        },
        {
          dataField: "duration_required",
          text: "Turn Around Time",
          sort: true,
        },
        {
          dataField: "duration_type",
          text: "Duration type",
          sort: true,
        },
        {
          dataField: "sample_type",
          text: "Sample Type",
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
          dataField: "is_test_performed",
          text: "Test Performed",
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
    // const { units, onGetUnits } = this.props;
    // if (units && !units.length) {
    //   onGetUnits();
    // }
    // this.setState({ units });

    const { tests, onGetTests } = this.props;
    onGetTests();
    this.setState({ tests });

    const { offeredTests, onGetOfferedTests } = this.props;
    onGetOfferedTests(this.state.user_id);
    this.setState({ offeredTests });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // Select
  handleSelectGroup = selectedGroup => {
    this.setState({ offeredTest: selectedGroup.value });
  };

  handleOfferedTestClicks = () => {
    this.setState({ offeredTest: "", isEdit: false, test_id: "" });
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
    const { onDeleteOfferedTest, onGetOfferedTests } = this.props;
    const { offeredTests } = this.state;
    if (offeredTests.id !== undefined) {
      onDeleteOfferedTest(offeredTests);
      setTimeout(() => {
        onGetOfferedTests(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleOfferedTestClick = arg => {
    const offeredTest = arg;

    this.setState({
      test_id: offeredTest.test_id,
      offeredTest: {
        id: offeredTest.id,
        test_name: offeredTest.test_name,
        // unit_name: offeredTest.unit_name,
        test_id: offeredTest.test_id,
        // unit_id: offeredTest.unit_id,
        duration_required: offeredTest.duration_required,
        duration_type: offeredTest.duration_type,
        sample_type: offeredTest.sample_type,
        price: offeredTest.price,
        is_eqa_participation: offeredTest.is_eqa_participation,
        is_home_sampling_available: offeredTest.is_home_sampling_available,
        is_test_performed: offeredTest.is_test_performed,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { offeredTests } = this.props;
    const { tests } = this.props;
    // const { units } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onAddNewOfferedTest, onUpdateOfferedTest, onGetOfferedTests } =
      this.props;
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

    const testList = [];
    for (let i = 0; i < tests.length; i++) {
      let flag = 0;

      // Check if test available in our database is already being offered by lab
      // If yes then don't push it in testList
      for (let j = 0; j < offeredTests.length; j++) {
        if (tests[i].id == offeredTests[j].test_id) {
          flag = 1;
        }
      }

      if (!flag) {
        testList.push({
          label: tests[i].name,
          value: tests[i].id,
        });
      }
    }

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteOfferedTest}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Offered Tests List | Lab Hazir</title>
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
                                <Col sm="8" lg="8">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col>
                                <Col sm="2" lg="2">
                                  <div>
                                    <Link
                                      to={"/medical-test-sheet"}
                                      className="w-100 font-16 btn btn-secondary"
                                    >
                                      {" "}
                                      <i className="mdi mdi-microsoft-excel me-1" />
                                      Tests Sheet{" "}
                                    </Link>
                                  </div>
                                </Col>

                                <Col sm="2" lg="2">
                                  <div className="text-sm-end">
                                    <Button
                                      color="primary"
                                      className="w-100 font-16 btn-block btn btn-primary"
                                      onClick={this.handleOfferedTestClicks}
                                      disabled={testList.length == 0}
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Test
                                    </Button>
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
                                            test_id:
                                              (offeredTest &&
                                                offeredTest.test_id) ||
                                              "",
                                            // unit_id:
                                            //   (offeredTest &&
                                            //     offeredTest.unit_id) ||
                                            //   "",
                                            duration_required:
                                              (offeredTest &&
                                                offeredTest.duration_required) ||
                                              "",
                                            duration_type:
                                              (offeredTest &&
                                                offeredTest.duration_type) ||
                                              "",
                                            sample_type:
                                              (offeredTest &&
                                                offeredTest.sample_type) ||
                                              "",
                                            price:
                                              (offeredTest &&
                                                offeredTest.price) ||
                                              "",
                                            is_eqa_participation:
                                              (offeredTest &&
                                                offeredTest.is_eqa_participation) ||
                                              "",
                                            is_home_sampling_available:
                                              (offeredTest &&
                                                offeredTest.is_home_sampling_available) ||
                                              "",
                                            is_test_performed:
                                              (offeredTest &&
                                                offeredTest.is_test_performed) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            duration_required: Yup.number(
                                              "Please enter number only"
                                            )
                                              .required(
                                                "Please enter turn around time required"
                                              )
                                              .positive()
                                              .integer()
                                              .min(
                                                0,
                                                "Please enter a number greater than or equal to 0"
                                              )
                                              .max(
                                                100,
                                                "Please enter a number less than or equal to 150"
                                              ),
                                            price: Yup.number(
                                              "Please enter number only"
                                            )
                                              .required(
                                                "Please enter your price"
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
                                            duration_type: Yup.string()
                                              .trim()
                                              .required(
                                                "Please select duration type"
                                              ),
                                            is_eqa_participation: Yup.string()
                                              .trim()
                                              .required(
                                                "Please select one option from dropdown"
                                              ),
                                            is_home_sampling_available:
                                              Yup.string()
                                                .trim()
                                                .required(
                                                  "Please select one option from dropdown"
                                                ),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              const updateOfferedTest = {
                                                id: offeredTest.id,
                                                test_id: parseInt(
                                                  values.test_id
                                                ),
                                                // unit_id: parseInt(
                                                //   values.unit_id
                                                // ),
                                                duration_required:
                                                  values.duration_required,
                                                duration_type:
                                                  values.duration_type,
                                                sample_type: values.sample_type,
                                                price: values.price,
                                                is_eqa_participation:
                                                  values.is_eqa_participation,
                                                is_home_sampling_available:
                                                  values.is_home_sampling_available,
                                                is_test_performed:
                                                  values.is_test_performed,
                                              };

                                              // update OfferedTest
                                              onUpdateOfferedTest(
                                                updateOfferedTest,
                                                this.state.user_id
                                              );

                                              setTimeout(() => {
                                                onGetOfferedTests(
                                                  this.state.user_id
                                                );
                                              }, 1000);
                                            } else {
                                              // if (!values.unit_id) {
                                              //   values.unit_id = units[0].id;
                                              // }

                                              const newOfferedTest = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,
                                                test_id: this.state.test_id,
                                                // unit_id: values.unit_id,
                                                test_type: this.state.test_type,
                                                duration_required:
                                                  values.duration_required,
                                                duration_type:
                                                  values.duration_type,
                                                sample_type: values.sample_type,
                                                price: values.price,
                                                is_eqa_participation:
                                                  values.is_eqa_participation,
                                                is_home_sampling_available:
                                                  values.is_home_sampling_available,
                                                is_test_performed:
                                                  values.is_test_performed,
                                              };

                                              // save new OfferedTest
                                              onAddNewOfferedTest(
                                                newOfferedTest,
                                                this.state.user_id
                                              );

                                              setTimeout(() => {
                                                onGetOfferedTests(
                                                  this.state.user_id
                                                );
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
                                                <Col className="col-12">
                                                  {/* Make field readonly in case of edit form */}
                                                  {offeredTest.test_id &&
                                                  offeredTest.test_id ? (
                                                    <div className="mb-3">
                                                      <Label className="form-label">
                                                        Test name
                                                      </Label>
                                                      <Field
                                                        name="test_id"
                                                        as="select"
                                                        defaultValue={
                                                          offeredTest.test_id
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                        multiple={false}
                                                      >
                                                        <option
                                                          key={
                                                            offeredTest.test_id
                                                          }
                                                          value={
                                                            offeredTest.test_id
                                                          }
                                                        >
                                                          {
                                                            offeredTest.test_name
                                                          }
                                                        </option>
                                                      </Field>
                                                    </div>
                                                  ) : (
                                                    <div className="mb-3 select2-container">
                                                      <Label>
                                                        Test Name
                                                        <span className="text-danger font-size-12">
                                                          *
                                                        </span>
                                                      </Label>
                                                      {/* <Select
                                                        component="select"
                                                        onChange={
                                                          this.handleSelectGroup
                                                        }
                                                        options={optionGroup}
                                                        classNamePrefix="select2-selection"
                                                      /> */}
                                                      <Select
                                                        name="test_id"
                                                        component="Select"
                                                        onChange={selectedGroup =>
                                                          this.setState({
                                                            test_id:
                                                              selectedGroup.value,
                                                          })
                                                        }
                                                        className={
                                                          "defautSelectParent" +
                                                          (!this.state.test_id
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
                                                              .state.test_id
                                                              ? "#f46a6a"
                                                              : "#ced4da",
                                                          }),
                                                        }}
                                                        options={testList}
                                                        placeholder="Select Test..."
                                                      />

                                                      <div className="invalid-feedback">
                                                        Please select your test
                                                      </div>
                                                    </div>
                                                  )}

                                                  <div className="mb-3">
                                                    <Row>
                                                      <Col lg={7}>
                                                        <Label className="form-label">
                                                          Turn Around Time
                                                          (Reporting Time)
                                                          <span className="text-danger font-size-12">
                                                            *
                                                          </span>
                                                        </Label>
                                                        <Field
                                                          name="duration_required"
                                                          type="number"
                                                          className={
                                                            "form-control" +
                                                            (errors.duration_required &&
                                                            touched.duration_required
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                        />
                                                        <ErrorMessage
                                                          name="duration_required"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </Col>
                                                      <Col lg={5}>
                                                        <Label className="form-label">
                                                          Duration type
                                                          <span className="text-danger font-size-12">
                                                            *
                                                          </span>
                                                        </Label>
                                                        <Field
                                                          name="duration_type"
                                                          as="select"
                                                          // className="form-control"
                                                          className={
                                                            "form-control" +
                                                            (errors.duration_type &&
                                                            touched.duration_type
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          multiple={false}
                                                        >
                                                          <option value="">
                                                            ---- Days/Hours ----
                                                          </option>
                                                          <option value="days">
                                                            days
                                                          </option>
                                                          <option value="hours">
                                                            hours
                                                          </option>
                                                        </Field>
                                                        <ErrorMessage
                                                          name="duration_type"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </Col>
                                                    </Row>
                                                  </div>
                                                 

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Sample type
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="sample_type"
                                                      as="select"
                                                      // className="form-control"
                                                      className={
                                                        "form-control" +
                                                        (errors.sample_type &&
                                                        touched.sample_type
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      multiple={false}
                                                    >
                                                      <option value="">
                                                        ----Select Sample Type
                                                        ----
                                                      </option>
                                                      <option value="Whole blood">
                                                        Whole Blood
                                                      </option>
                                                      <option value="Serum">
                                                        Serum
                                                      </option>
                                                      <option value="Plasma">
                                                        Plasma
                                                      </option>
                                                      <option value="Biopsy">
                                                        Biopsy
                                                      </option>
                                                      <option value="Swap">
                                                        Swap
                                                      </option>
                                                      <option value="Urine">
                                                        Urine
                                                      </option>
                                                      <option value="Stool">
                                                        Stool
                                                      </option>
                                                      <option value="Semen">
                                                        Semen
                                                      </option>
                                                      <option value="CSF">
                                                        CSF
                                                      </option>
                                                      <option value="Sputum">
                                                        Sputum
                                                      </option>
                                                      <option value="Saliva">
                                                        Saliva
                                                      </option>
                                                      <option value="Body Fluids">
                                                        Body Fluids
                                                      </option>
                                                    </Field>
                                                    <ErrorMessage
                                                      name="sample_type"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Price
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
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
                                                      Is EQA participating
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="is_eqa_participation"
                                                      as="select"
                                                      // className="form-control"
                                                      className={
                                                        "form-control" +
                                                        (errors.is_eqa_participation &&
                                                        touched.is_eqa_participation
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      multiple={false}
                                                    >
                                                      <option value="">
                                                        --- Is EQA participating
                                                        for the test? ---
                                                      </option>
                                                      <option value="Yes">
                                                        Yes
                                                      </option>
                                                      <option value="No">
                                                        No
                                                      </option>
                                                    </Field>
                                                    <ErrorMessage
                                                      name="is_eqa_participation"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Is home sampling
                                                      available?
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="is_home_sampling_available"
                                                      as="select"
                                                      // className="form-control"
                                                      className={
                                                        "form-control" +
                                                        (errors.is_home_sampling_available &&
                                                        touched.is_home_sampling_available
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      multiple={false}
                                                    >
                                                      <option value="">
                                                        --- Are you providing
                                                        home sampling for the
                                                        test? ---
                                                      </option>
                                                      <option value="Yes">
                                                        Yes
                                                      </option>
                                                      <option value="No">
                                                        No
                                                      </option>
                                                    </Field>
                                                    <ErrorMessage
                                                      name="is_home_sampling_available"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      How test is performed?
                                                      (optional)
                                                    </Label>
                                                    <Field
                                                      name="is_test_performed"
                                                      as="select"
                                                      className="form-control"
                                                      multiple={false}
                                                    >
                                                      <option value="--"></option>
                                                      <option value="In House">
                                                        In House
                                                      </option>
                                                      <option value="Outsource">
                                                        Outsource
                                                      </option>
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
                                                      disabled={
                                                        !this.state.test_id
                                                      }
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
  // units: PropTypes.array,
  offeredTests: PropTypes.array,
  className: PropTypes.any,
  onGetOfferedTests: PropTypes.func,
  onGetTests: PropTypes.func,
  // onGetUnits: PropTypes.func,
  onAddNewOfferedTest: PropTypes.func,
  onDeleteOfferedTest: PropTypes.func,
  onUpdateOfferedTest: PropTypes.func,
};

const mapStateToProps = ({ offeredTests }) => ({
  offeredTests: offeredTests.offeredTests,
  tests: offeredTests.tests,
  // units: offeredTests.units,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetTests: () => dispatch(getTests()),
  // onGetUnits: () => dispatch(getUnits()),
  onGetOfferedTests: id => dispatch(getOfferedTests(id)),
  onAddNewOfferedTest: (offeredTest, id) =>
    dispatch(addNewOfferedTest(offeredTest, id)),
  onUpdateOfferedTest: offeredTest => dispatch(updateOfferedTest(offeredTest)),
  onDeleteOfferedTest: offeredTest => dispatch(deleteOfferedTest(offeredTest)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OfferedTestsList));