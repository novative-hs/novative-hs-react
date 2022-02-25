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

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getPathologists,
  addNewPathologist,
  updatePathologist,
  deletePathologist,
} from "store/pathologists/actions";

import { isEmpty, size } from "lodash";

class PathologistsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      selectedFiles: [],
      pathologists: [],
      pathologist: "",
      modal: false,
      deleteModal: false,
      pathologistListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, pathologist) => <>{pathologist.id}</>,
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
        },
        {
          dataField: "phone",
          text: "Phone No.",
          sort: true,
        },
        {
          dataField: "landline",
          text: "Landline",
          sort: true,
        },
        {
          dataField: "designation",
          text: "Designation",
          sort: true,
        },
        {
          dataField: "is_available_for_consultation",
          text: "Available for consultation",
          sort: true,
        },
        {
          dataField: "is_available_on_whatsapp",
          text: "Available on WhatsApp",
          sort: true,
        },
        {
          dataField: "is_associated_with_pap",
          text: "Associated with PAP",
          sort: true,
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, pathologist) => (
            <div className="d-flex gap-3">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e => this.handlePathologistClick(e, pathologist)}
                ></i>
              </Link>
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(pathologist)}
                ></i>
              </Link>
            </div>
          ),
        },
      ],
    };
    this.handlePathologistClick = this.handlePathologistClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handlePathologistClicks = this.handlePathologistClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const { pathologists, onGetPathologists } = this.props;
    if (pathologists && !pathologists.length) {
      onGetPathologists();
    }
    this.setState({ pathologists });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handlePathologistClicks = () => {
    this.setState({ pathologist: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { pathologists } = this.props;
    if (
      !isEmpty(pathologists) &&
      size(prevProps.pathologists) !== size(pathologists)
    ) {
      this.setState({ pathologists: {}, isEdit: false });
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

  onClickDelete = pathologists => {
    this.setState({ pathologists: pathologists });
    this.setState({ deleteModal: true });
  };

  handleDeletePathologist = () => {
    const { onDeletePathologist, onGetPathologists } = this.props;
    const { pathologists } = this.state;
    if (pathologists.id !== undefined) {
      onDeletePathologist(pathologists);
      setTimeout(() => {
        onGetPathologists();
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handlePathologistClick = (e, arg) => {
    const pathologist = arg;

    this.setState({
      pathologist: {
        id: pathologist.id,
        name: pathologist.name,
        email: pathologist.email,
        phone: pathologist.phone,
        landline: pathologist.landline,
        designation: pathologist.designation,
        is_available_for_consultation:
          pathologist.is_available_for_consultation,
        is_available_on_whatsapp: pathologist.is_available_on_whatsapp,
        is_associated_with_pap: pathologist.is_associated_with_pap,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { pathologists } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onAddNewPathologist, onUpdatePathologist, onGetPathologists } =
      this.props;
    const pathologist = this.state.pathologist;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: pathologists.length, // replace later with size(pathologists),
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

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeletePathologist}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Pathologists List | Ilaaj4u</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Pathologists"
              breadcrumbItem="Pathologists List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.pathologistListColumns}
                      data={pathologists}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.pathologistListColumns}
                          data={pathologists}
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
                                      onClick={this.handlePathologistClicks}
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Pathologist
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
                                          ? "Edit Pathologist"
                                          : "Add Pathologist"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            name:
                                              (pathologist &&
                                                pathologist.name) ||
                                              "",
                                            email:
                                              (pathologist &&
                                                pathologist.email) ||
                                              "",
                                            phone:
                                              (pathologist &&
                                                pathologist.phone) ||
                                              "",
                                            landline:
                                              (pathologist &&
                                                pathologist.landline) ||
                                              "",
                                            designation:
                                              (pathologist &&
                                                pathologist.designation) ||
                                              "",
                                            is_available_for_consultation:
                                              (pathologist &&
                                                pathologist.is_available_for_consultation) ||
                                              "Yes",
                                            is_available_on_whatsapp:
                                              (pathologist &&
                                                pathologist.is_available_on_whatsapp) ||
                                              "Yes",
                                            is_associated_with_pap:
                                              (pathologist &&
                                                pathologist.is_associated_with_pap) ||
                                              "No",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            name: Yup.string().required(
                                              "Please enter name"
                                            ),
                                            email: Yup.string()
                                              .required("Please enter email")
                                              .email(
                                                "Please enter valid email"
                                              ),
                                            phone: Yup.string()
                                              .required("Please enter phone")
                                              .matches(
                                                /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                                "Please enter a valid Pakistani phone number e.g. +923123456789"
                                              ),
                                            landline: Yup.string()
                                              .required("Please enter phone")
                                              .matches(
                                                /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                                "Please enter a valid Pakistani phone number e.g. +923123456789"
                                              ),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              const updatePathologist = {
                                                id: pathologist.id,
                                                name: values.name,
                                                email: values.email,
                                                phone: values.phone,
                                                landline: values.landline,
                                                designation: values.designation,
                                                is_available_for_consultation:
                                                  values.is_available_for_consultation,
                                                is_available_on_whatsapp:
                                                  values.is_available_on_whatsapp,
                                                is_associated_with_pap:
                                                  values.is_associated_with_pap,
                                              };

                                              // update Pathologist
                                              onUpdatePathologist(
                                                updatePathologist
                                              );
                                              setTimeout(() => {
                                                onGetPathologists();
                                              }, 1000);
                                            } else {
                                              const newPathologist = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,
                                                name: values.name,
                                                email: values.email,
                                                phone: values.phone,
                                                landline: values.landline,
                                                designation: values.designation,
                                                is_available_for_consultation:
                                                  values.is_available_for_consultation,
                                                is_available_on_whatsapp:
                                                  values.is_available_on_whatsapp,
                                                is_associated_with_pap:
                                                  values.is_associated_with_pap,
                                              };

                                              // save new Pathologist
                                              onAddNewPathologist(
                                                newPathologist
                                              );
                                              setTimeout(() => {
                                                onGetPathologists();
                                              }, 1000);
                                            }
                                            this.setState({
                                              selectedPathologist: null,
                                            });
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
                                                      Phone
                                                    </Label>
                                                    <Field
                                                      name="phone"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.phone &&
                                                        touched.phone
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="phone"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Landline
                                                    </Label>
                                                    <Field
                                                      name="landline"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.landline &&
                                                        touched.landline
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="landline"
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
                                                      Is available for
                                                      consultation?
                                                    </Label>
                                                    <Field
                                                      name="is_available_for_consultation"
                                                      as="select"
                                                      className={
                                                        "form-control" +
                                                        (errors.is_available_for_consultation &&
                                                        touched.is_available_for_consultation
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      multiple={false}
                                                    >
                                                      <option value="Yes">
                                                        Yes
                                                      </option>
                                                      <option value="No">
                                                        No
                                                      </option>
                                                    </Field>
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Is available on WhatsApp?
                                                    </Label>
                                                    <Field
                                                      name="is_available_on_whatsapp"
                                                      as="select"
                                                      className={
                                                        "form-control" +
                                                        (errors.is_available_on_whatsapp &&
                                                        touched.is_available_on_whatsapp
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      multiple={false}
                                                    >
                                                      <option value="Yes">
                                                        Yes
                                                      </option>
                                                      <option value="No">
                                                        No
                                                      </option>
                                                    </Field>
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Is associated with PAP?
                                                    </Label>
                                                    <Field
                                                      name="is_associated_with_pap"
                                                      as="select"
                                                      className={
                                                        "form-control" +
                                                        (errors.is_associated_with_pap &&
                                                        touched.is_associated_with_pap
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      multiple={false}
                                                    >
                                                      <option value="Yes">
                                                        Yes
                                                      </option>
                                                      <option value="No">
                                                        No
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

PathologistsList.propTypes = {
  match: PropTypes.object,
  pathologists: PropTypes.array,
  className: PropTypes.any,
  onGetPathologists: PropTypes.func,
  onAddNewPathologist: PropTypes.func,
  onDeletePathologist: PropTypes.func,
  onUpdatePathologist: PropTypes.func,
};

const mapStateToProps = ({ pathologists }) => ({
  pathologists: pathologists.pathologists,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetPathologists: () => dispatch(getPathologists(ownProps.match.params.id)),
  onAddNewPathologist: pathologist =>
    dispatch(addNewPathologist(pathologist, ownProps.match.params.id)),
  onUpdatePathologist: pathologist => dispatch(updatePathologist(pathologist)),
  onDeletePathologist: pathologist => dispatch(deletePathologist(pathologist)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PathologistsList));
