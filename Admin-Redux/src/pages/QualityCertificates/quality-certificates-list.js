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

class QualityCertificatesList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      selectedFiles: [],
      qualityCertificates: [],
      qualityCertificate: "",
      certificateImg: "",
      apiURL: process.env.REACT_APP_BACKENDURL,
      modal: false,
      deleteModal: false,
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
          dataField: "img",
          text: "#",
          formatter: (cellContent, qualityCertificate) => (
            <>
              {!qualityCertificate.certificate ? (
                <div className="avatar-xs">
                  <span className="avatar-title rounded-circle">
                    {qualityCertificate.name.charAt(0)}
                  </span>
                </div>
              ) : (
                <div>
                  <img
                    className="rounded-circle avatar-xs"
                    src={this.state.apiURL + qualityCertificate.certificate}
                    alt=""
                  />
                </div>
              )}
            </>
          ),
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
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
    if (qualityCertificates && !qualityCertificates.length) {
      onGetQualityCertificates();
    }
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
        onGetQualityCertificates();
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleQualityCertificateClick = (e, arg) => {
    const qualityCertificate = arg;

    this.setState({
      qualityCertificate: {
        id: qualityCertificate.id,
        name: qualityCertificate.name,
        certificate: this.state.apiURL + qualityCertificate.certificate,
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
    const { selectedQualityCertificate } = this.state;
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

    const selectRow = {
      mode: "checkbox",
    };

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteQualityCertificate}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Quality Certificates List | Ilaaj4u</title>
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
                                          ? "Edit Quality Certificate"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            name:
                                              (this.state.qualityCertificate &&
                                                this.state.qualityCertificate
                                                  .name) ||
                                              "",
                                            certificate:
                                              (this.state &&
                                                this.state.certificateImg) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            name: Yup.string().required(
                                              "Please enter name"
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
                                          })}
                                          onSubmit={values => {
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
                                                      name: values.name,
                                                      certificate:
                                                        this.state
                                                          .certificateImg,
                                                    };

                                                  // update QualityCertificate
                                                  onUpdateQualityCertificate(
                                                    updateQualityCertificate
                                                  );
                                                  setTimeout(() => {
                                                    onGetQualityCertificates();
                                                  }, 1000);
                                                });
                                              } else {
                                                const updateQualityCertificate =
                                                  {
                                                    id: qualityCertificate.id,
                                                    name: values.name,
                                                    certificate:
                                                      this.state.certificateImg,
                                                  };

                                                // update QualityCertificate
                                                onUpdateQualityCertificate(
                                                  updateQualityCertificate
                                                );
                                                setTimeout(() => {
                                                  onGetQualityCertificates();
                                                }, 1000);
                                              }
                                            } else {
                                              const newQualityCertificate = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,
                                                name: values.name,
                                                certificate:
                                                  this.state.certificateImg,
                                              };

                                              // save new QualityCertificate
                                              onAddNewQualityCertificate(
                                                newQualityCertificate
                                              );
                                              setTimeout(() => {
                                                onGetQualityCertificates();
                                              }, 1000);
                                            }
                                            this.setState({
                                              selectedQualityCertificate: null,
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
                                                      value={
                                                        this.state
                                                          .qualityCertificate
                                                          .name
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            qualityCertificate:
                                                              {
                                                                id: qualityCertificate.id,
                                                                name: e.target
                                                                  .value,
                                                                certificate:
                                                                  qualityCertificate.certificate,
                                                              },
                                                          });
                                                        } else {
                                                          this.setState({
                                                            qualityCertificate:
                                                              {
                                                                name: e.target
                                                                  .value,
                                                              },
                                                          });
                                                        }
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

                                                  {/* Display current image in edit form only */}
                                                  {qualityCertificate.certificate &&
                                                  qualityCertificate.certificate ? (
                                                    <CardImg
                                                      className="img-fluid"
                                                      src={
                                                        qualityCertificate.certificate
                                                      }
                                                      alt="Responsive image"
                                                    />
                                                  ) : null}

                                                  {/* Certificate field */}
                                                  <div className="mb-3">
                                                    <Label
                                                      for="name"
                                                      className="form-label"
                                                    >
                                                      Certificate
                                                    </Label>
                                                    <Input
                                                      id="formFile"
                                                      name="certificate"
                                                      placeholder="Choose image"
                                                      type="file"
                                                      multiple={false}
                                                      accept=".jpg,.jpeg,.png"
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
  onGetQualityCertificates: () =>
    dispatch(getQualityCertificates(ownProps.match.params.id)),
  onAddNewQualityCertificate: qualityCertificate =>
    dispatch(
      addNewQualityCertificate(qualityCertificate, ownProps.match.params.id)
    ),
  onUpdateQualityCertificate: qualityCertificate =>
    dispatch(updateQualityCertificate(qualityCertificate)),
  onDeleteQualityCertificate: qualityCertificate =>
    dispatch(deleteQualityCertificate(qualityCertificate)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(QualityCertificatesList));
