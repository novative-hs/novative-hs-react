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
  getOfferedTests,
  getOfferedTestsSuccess,
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
          dataField: "test_id",
          text: "Test",
          sort: true,
        },
        {
          dataField: "unit_id",
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
        test_id: offeredTest.test_id,
        unit_id: offeredTest.unit_id,
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

    console.log("Props: ", this.props);

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
                                        {/* <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            name:
                                              (offeredTest &&
                                                offeredTest.name) ||
                                              "",
                                            designation:
                                              (offeredTest &&
                                                offeredTest.designation) ||
                                              "",
                                            email:
                                              (offeredTest &&
                                                offeredTest.email) ||
                                              "",
                                            tags:
                                              (offeredTest &&
                                                offeredTest.tags) ||
                                              [],
                                            projects:
                                              (offeredTest &&
                                                offeredTest.projects) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            name: Yup.string().required(
                                              "Please Enter Your Name"
                                            ),
                                            designation: Yup.string().required(
                                              "Please Enter Your Designation"
                                            ),
                                            email: Yup.string().required(
                                              "Please Enter Your Email"
                                            ),
                                            tags: Yup.array().required(
                                              "Please Select Tags"
                                            ),
                                            projects: Yup.string().required(
                                              "Please Enter Your Projects"
                                            ),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              const updateOfferedTest = {
                                                id: offeredTest.id,
                                                name: values.name,
                                                designation: values.designation,
                                                tags: values.tags,
                                                email: values.email,
                                                projects: values.projects,
                                              };

                                              // update OfferedTest
                                              onUpdateOfferedTest(
                                                updateOfferedTest
                                              );
                                            } else {
                                              const newOfferedTest = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,
                                                name: values["name"],
                                                designation:
                                                  values["designation"],
                                                email: values["email"],
                                                tags: values["tags"],
                                                projects: values["projects"],
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
                                                      Name
                                                    </Label>
                                                    <Field
                                                      name="name"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.name &&
                                                        touched.name
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="name"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Designation
                                                    </Label>
                                                    <Field
                                                      name="designation"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.designation &&
                                                        touched.designation
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="designation"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Email
                                                    </Label>
                                                    <Field
                                                      name="email"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.email &&
                                                        touched.email
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="email"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Tags
                                                    </Label>
                                                    <Field
                                                      name="tags"
                                                      as="select"
                                                      className={
                                                        "form-control" +
                                                        (errors.tags &&
                                                        touched.tags
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      multiple={true}
                                                    >
                                                      <option>Photoshop</option>
                                                      <option>
                                                        illustrator
                                                      </option>
                                                      <option>Html</option>
                                                      <option>Php</option>
                                                      <option>Java</option>
                                                      <option>Python</option>
                                                      <option>
                                                        UI/UX Designer
                                                      </option>
                                                      <option>Ruby</option>
                                                      <option>Css</option>
                                                    </Field>
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Projects
                                                    </Label>
                                                    <Field
                                                      name="projects"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.projects &&
                                                        touched.projects
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="projects"
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
                                        </Formik> */}
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
  offeredTests: PropTypes.array,
  className: PropTypes.any,
  onGetOfferedTests: PropTypes.func,
  onAddNewOfferedTest: PropTypes.func,
  onDeleteOfferedTest: PropTypes.func,
  onUpdateOfferedTest: PropTypes.func,
};

const mapStateToProps = ({ offeredTests }) => ({
  offeredTests: offeredTests.offeredTests,
});

const mapDispatchToProps = dispatch => ({
  onGetOfferedTests: () => dispatch(getOfferedTests()),
  onAddNewOfferedTest: offeredTest => dispatch(addNewOfferedTest(offeredTest)),
  onUpdateOfferedTest: offeredTest => dispatch(updateOfferedTest(offeredTest)),
  onDeleteOfferedTest: offeredTest => dispatch(deleteOfferedTest(offeredTest)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OfferedTestsList));
