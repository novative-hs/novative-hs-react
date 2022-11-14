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
  getQualityCertificates,
  addNewQualityCertificate,
  updateQualityCertificate,
  deleteQualityCertificate,
} from "store/quality-certificates/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class QualityCertificatesList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      qualityCertificates: [],
      qualityCertificate: "",
      certificateImg: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      qualityCertificateListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, qualityCertificate) => (
            <>{qualityCertificate.id}</>
          ),
        },
        {
          dataField: "name",
          text: "Title",
          sort: true,
        },
        {
          dataField: "type",
          text: "Type",
          sort: true,
        },
        {
          dataField: "certificate",
          text: "Certificate",
          sort: true,
          formatter: (cellContent, qualityCertificate) => (
            <>
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL +
                    qualityCertificate.certificate,
                }}
                target="_blank"
              >
                View Certificate
              </Link>
            </>
          ),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, qualityCertificate) => (
            <div className="d-flex gap-3">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e =>
                    this.handleQualityCertificateClick(e, qualityCertificate)
                  }
                ></i>
              </Link>
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(qualityCertificate)}
                ></i>
              </Link>
            </div>
          ),
        },
      ],
    };
    this.handleQualityCertificateClick =
      this.handleQualityCertificateClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleQualityCertificateClicks =
      this.handleQualityCertificateClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  // The code for converting "image source" (url) to "Base64"
  toDataURL = url =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  // The code for converting "Base64" to javascript "File Object"
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

  componentDidMount() {
    const { qualityCertificates, onGetQualityCertificates } = this.props;
    onGetQualityCertificates(this.state.user_id);
    this.setState({ qualityCertificates });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleQualityCertificateClicks = () => {
    this.setState({
      qualityCertificate: "",
      certificateImg: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { qualityCertificates } = this.props;
    if (
      !isEmpty(qualityCertificates) &&
      size(prevProps.qualityCertificates) !== size(qualityCertificates)
    ) {
      this.setState({ qualityCertificates: {}, isEdit: false });
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

  onClickDelete = qualityCertificates => {
    this.setState({ qualityCertificates: qualityCertificates });
    this.setState({ deleteModal: true });
  };

  handleDeleteQualityCertificate = () => {
    const { onDeleteQualityCertificate, onGetQualityCertificates } = this.props;
    const { qualityCertificates } = this.state;
    if (qualityCertificates.id !== undefined) {
      onDeleteQualityCertificate(qualityCertificates);
      setTimeout(() => {
        onGetQualityCertificates(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleQualityCertificateClick = (e, arg) => {
    this.setState({
      qualityCertificate: {
        id: arg.id,
        certificate_type: arg.certificate_type,
        name: arg.name,
        type: arg.type,
        certificate: process.env.REACT_APP_BACKENDURL + arg.certificate,
        expiry_date: arg.expiry_date,
      },
      certificateImg: "",
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { qualityCertificates } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onAddNewQualityCertificate,
      onUpdateQualityCertificate,
      onGetQualityCertificates,
    } = this.props;
    const qualityCertificate = this.state.qualityCertificate;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: qualityCertificates.length, // replace later with size(qualityCertificates),
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
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteQualityCertificate}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Quality Certificates List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Quality Certificates"
              breadcrumbItem="Certificates List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.qualityCertificateListColumns}
                      data={qualityCertificates}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.qualityCertificateListColumns}
                          data={qualityCertificates}
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
                                      onClick={
                                        this.handleQualityCertificateClicks
                                      }
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Certificate
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
                                          ? "Edit Quality Certificate"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            certificate_type:
                                              (this.state.qualityCertificate &&
                                                this.state.qualityCertificate
                                                  .certificate_type) ||
                                              "",
                                            name:
                                              (this.state.qualityCertificate &&
                                                this.state.qualityCertificate
                                                  .name) ||
                                              "",
                                            type:
                                              (this.state.qualityCertificate &&
                                                this.state.qualityCertificate
                                                  .type) ||
                                              "",
                                            certificate:
                                              (this.state &&
                                                this.state.certificateImg) ||
                                              "",
                                            expiry_date:
                                              (this.state &&
                                                this.state.qualityCertificate
                                                  .expiry_date) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            name: Yup.string().when(
                                              "certificate_type",
                                              {
                                                is: val => val === "Others",
                                                then: Yup.string()
                                                  .trim()
                                                  .required(
                                                    "Please enter test name"
                                                  )
                                                  .min(
                                                    3,
                                                    "Please enter at least 3 characters"
                                                  )
                                                  .max(
                                                    255,
                                                    "Please enter maximum 255 characters"
                                                  )
                                                  .matches(
                                                    /^[a-zA-Z][a-zA-Z ]+$/,
                                                    "Please enter only alphabets and spaces"
                                                  ),
                                              }
                                            ),

                                            certificate: Yup.string().when(
                                              "hiddenEditFlag",
                                              {
                                                is: hiddenEditFlag =>
                                                  hiddenEditFlag == false, //just an e.g. you can return a function
                                                then: Yup.string().required(
                                                  "Please upload certificate"
                                                ),
                                              }
                                            ),

                                            certificate_type:
                                              Yup.string().required(
                                                "Please select certificate type"
                                              ),

                                            type: Yup.string().required(
                                              "Please select certificate is for lab or test"
                                            ),

                                            expiry_date: Yup.string().required(
                                              "Please select expiry date"
                                            ),
                                          })}
                                          onSubmit={values => {
                                            if (
                                              values.certificate_type !=
                                              "Others"
                                            ) {
                                              values.name =
                                                values.certificate_type;
                                            }

                                            if (isEdit) {
                                              if (!this.state.certificateImg) {
                                                this.toDataURL(
                                                  qualityCertificate.certificate
                                                ).then(dataUrl => {
                                                  var fileData =
                                                    this.dataURLtoFile(
                                                      dataUrl,
                                                      qualityCertificate.certificate
                                                        .split("/")
                                                        .at(-1)
                                                    );
                                                  this.setState({
                                                    certificateImg: fileData,
                                                  });

                                                  const updateQualityCertificate =
                                                    {
                                                      id: qualityCertificate.id,
                                                      certificate_type:
                                                        values.certificate_type,
                                                      name: values.name,
                                                      type: values.type,
                                                      certificate:
                                                        this.state
                                                          .certificateImg,
                                                      expiry_date:
                                                        values.expiry_date,
                                                    };

                                                  // update QualityCertificate
                                                  onUpdateQualityCertificate(
                                                    updateQualityCertificate
                                                  );
                                                  setTimeout(() => {
                                                    onGetQualityCertificates(
                                                      this.state.user_id
                                                    );
                                                  }, 1000);
                                                });
                                              } else {
                                                const updateQualityCertificate =
                                                  {
                                                    id: qualityCertificate.id,
                                                    certificate_type:
                                                      values.certificate_type,
                                                    name: values.name,
                                                    type: values.type,
                                                    certificate:
                                                      this.state.certificateImg,
                                                    expiry_date:
                                                      values.expiry_date,
                                                  };

                                                // update QualityCertificate
                                                onUpdateQualityCertificate(
                                                  updateQualityCertificate
                                                );
                                                setTimeout(() => {
                                                  onGetQualityCertificates(
                                                    this.state.user_id
                                                  );
                                                }, 1000);
                                              }
                                            } else {
                                              // if (
                                              //   values.certificate_type !=
                                              //   "Others"
                                              // ) {
                                              //   values.name =
                                              //     values.certificate_type;
                                              // }

                                              const newQualityCertificate = {
                                                certificate_type:
                                                  values.certificate_type,
                                                name: values.name,
                                                type: values.type,
                                                certificate:
                                                  this.state.certificateImg,
                                                expiry_date: values.expiry_date,
                                              };

                                              // save new QualityCertificate
                                              onAddNewQualityCertificate(
                                                newQualityCertificate,
                                                this.state.user_id
                                              );
                                              setTimeout(() => {
                                                onGetQualityCertificates(
                                                  this.state.user_id
                                                );
                                              }, 1000);
                                            }
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
                                                  {/* Certificate Type field */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Certificate Type
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="certificate_type"
                                                      as="select"
                                                      // className="form-control"
                                                      className={
                                                        "form-control" +
                                                        (errors.certificate_type &&
                                                        touched.certificate_type
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          qualityCertificate: {
                                                            id: qualityCertificate.id,
                                                            certificate_type:
                                                              e.target.value,
                                                            name: qualityCertificate.name,
                                                            type: qualityCertificate.type,
                                                            certificate:
                                                              qualityCertificate.certificate,
                                                            expiry_date:
                                                              qualityCertificate.expiry_date,
                                                          },
                                                        });
                                                      }}
                                                      multiple={false}
                                                      value={
                                                        this.state
                                                          .qualityCertificate
                                                          .certificate_type
                                                      }
                                                    >
                                                      <option value="">
                                                        --- Please select
                                                        certificate type ---
                                                      </option>
                                                      <option value="ISO 15189 Certificate">
                                                        ISO 15189 Certificate
                                                      </option>
                                                      <option value="ISO 9001 Certificate">
                                                        ISO 9001 Certificate
                                                      </option>
                                                      <option value="EQA Certificate">
                                                        EQA Certificate
                                                      </option>
                                                      <option value="Others">
                                                        Others
                                                      </option>
                                                    </Field>
                                                    <ErrorMessage
                                                      name="certificate_type"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  {/* Certificate Title field */}
                                                  {this.state.qualityCertificate
                                                    .certificate_type ===
                                                    "Others" && (
                                                    <div className="mb-3">
                                                      <Label className="form-label">
                                                        Certificate title
                                                        <span className="text-danger font-size-12">
                                                          *
                                                        </span>
                                                      </Label>
                                                      <Field
                                                        name="name"
                                                        type="text"
                                                        value={
                                                          this.state
                                                            .qualityCertificate
                                                            .name
                                                        }
                                                        onChange={e => {
                                                          this.setState({
                                                            qualityCertificate:
                                                              {
                                                                id: qualityCertificate.id,
                                                                certificate_type:
                                                                  qualityCertificate.certificate_type,
                                                                name: e.target
                                                                  .value,
                                                                type: qualityCertificate.type,
                                                                certificate:
                                                                  qualityCertificate.certificate,
                                                                expiry_date:
                                                                  qualityCertificate.expiry_date,
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
                                                      <ErrorMessage
                                                        name="name"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  )}

                                                  {/* Type field */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Certificate is for
                                                      (Lab/Test)
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="type"
                                                      as="select"
                                                      // className="form-control"
                                                      className={
                                                        "form-control" +
                                                        (errors.type &&
                                                        touched.type
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          qualityCertificate: {
                                                            id: qualityCertificate.id,
                                                            certificate_type:
                                                              qualityCertificate.certificate_type,
                                                            name: qualityCertificate.name,
                                                            type: e.target
                                                              .value,
                                                            certificate:
                                                              qualityCertificate.certificate,
                                                            expiry_date:
                                                              qualityCertificate.expiry_date,
                                                          },
                                                        });
                                                      }}
                                                      multiple={false}
                                                    >
                                                      <option value="">
                                                        --- Please select
                                                        certificate is for
                                                        (Lab/Test) ---
                                                      </option>
                                                      <option value="Lab">
                                                        Lab
                                                      </option>
                                                      <option value="Test">
                                                        Test
                                                      </option>
                                                    </Field>
                                                    <ErrorMessage
                                                      name="type"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  {/* Certificate field */}
                                                  <div className="mb-3">
                                                    <Label
                                                      for="certificate"
                                                      className="form-label"
                                                    >
                                                      Certificate
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Input
                                                      id="formFile"
                                                      name="certificate"
                                                      placeholder="Choose image"
                                                      type="file"
                                                      multiple={false}
                                                      accept=".jpg,.jpeg,.png,.pdf"
                                                      onChange={e =>
                                                        this.setState({
                                                          certificateImg:
                                                            e.target.files[0],
                                                        })
                                                      }
                                                      className={
                                                        "form-control" +
                                                        (errors.certificate &&
                                                        touched.certificate
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />

                                                    <ErrorMessage
                                                      name="certificate"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  {/* Certificate Expiry date field */}

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Expiry Date
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="expiry_date"
                                                      type="date"
                                                      min={new Date(
                                                        new Date()
                                                          .toString()
                                                          .split("GMT")[0] +
                                                          " UTC"
                                                      )
                                                        .toISOString()
                                                        .slice(0, -14)}
                                                      value={
                                                        this.state
                                                          .qualityCertificate
                                                          .expiry_date
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          qualityCertificate: {
                                                            id: qualityCertificate.id,
                                                            certificate_type:
                                                              qualityCertificate.certificate_type,
                                                            name: qualityCertificate.name,
                                                            type: qualityCertificate.type,
                                                            certificate:
                                                              qualityCertificate.certificate,
                                                            expiry_date:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.expiry_date &&
                                                        touched.expiry_date
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="expiry_date"
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

QualityCertificatesList.propTypes = {
  match: PropTypes.object,
  qualityCertificates: PropTypes.array,
  className: PropTypes.any,
  onGetQualityCertificates: PropTypes.func,
  onAddNewQualityCertificate: PropTypes.func,
  onDeleteQualityCertificate: PropTypes.func,
  onUpdateQualityCertificate: PropTypes.func,
};

const mapStateToProps = ({ qualityCertificates }) => ({
  qualityCertificates: qualityCertificates.qualityCertificates,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetQualityCertificates: id => dispatch(getQualityCertificates(id)),
  onAddNewQualityCertificate: (qualityCertificate, id) =>
    dispatch(addNewQualityCertificate(qualityCertificate, id)),
  onUpdateQualityCertificate: qualityCertificate =>
    dispatch(updateQualityCertificate(qualityCertificate)),
  onDeleteQualityCertificate: qualityCertificate =>
    dispatch(deleteQualityCertificate(qualityCertificate)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(QualityCertificatesList));
