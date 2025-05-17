import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";

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
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
// import DeleteModal from "components/Common/DeleteModal";

import {
  getSchemelist,
  addNewSchemeList,
  updateSchemeList,
  deleteScheme,
} from "store/scheme/actions";

import { isEmpty, size } from "lodash";
import DeleteModal from "components/Common/DeleteModal";
import "assets/scss/table.scss";
import moment from "moment";
class ReagentsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      idFilter: "",
      nameFilter: "",
      priceFilter: "",
      dateofadditionFilter: "",
      noofanalytesFilter: "",
      addedbyFilter: "",
      statusFilter: "",
      analytetypeFilter: "",
      SchemeList: [],
      analyte: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      ReagentsListColumns: [
        {
          text: "ID",
          dataField: "id",
          sort: true,
          hidden: false,
          formatter: (cellContent, analyte) => <>{analyte.id}</>,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.idFilter}
                    onChange={e => this.handleFilterChange("idFilter", e)}
                    className="form-control"
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
        },

        {
          dataField: "name",
          text: "Scheme Name",
          sort: true,
          // filter: textFilter(),
          style: { textAlign: "left" },
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.nameFilter}
                    onChange={e => this.handleFilterChange("nameFilter", e)}
                    className="form-control"
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
        },
        {
          dataField: "price",
          text: "Price",
          sort: true,
          // filter: textFilter(),
          style: { textAlign: "right" },
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.priceFilter}
                    onChange={e => this.handleFilterChange("priceFilter", e)}
                    className="form-control"
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
        },
        {
          dataField: "noofanalytes",
          text: "No of Analytes",
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          sort: true,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.noofanalytesFilter}
                    onChange={e =>
                      this.handleFilterChange("noofanalytesFilter", e)
                    }
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                    }}
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },

          formatter: (cellContent, unitlist) => {
            const { organization_name } = this.state; // Ensure `organization_name` is defined in your component's state
            return (
              <div>
                <Link
                  to={`/scheme-analytelist/${unitlist.id}`} // Use `unitlist.cycle_id` directly
                  style={{
                    textDecoration: "underline",
                    color: "#0000CD",
                    display: "block",
                    marginTop: "5px",
                  }}
                >
                  {unitlist.noofanalytes}
                </Link>
              </div>
            );
          },
        },
        {
          dataField: "analytetype",
          text: "Type",
          sort: true,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <select
                    value={this.state.analytetypeFilter}
                    onChange={e =>
                      this.handleFilterChange("analytetypeFilter", e)
                    }
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                    }}
                  >
                    <option value="">All</option>
                    <option value="Qualitative">Qualitative</option>
                    <option value="Quantitative">Quantitative</option>
                  </select>
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <select
                    value={this.state.statusFilter}
                    onChange={e => this.handleFilterChange("statusFilter", e)}
                    className="form-control"
                    style={{
                      textAlign: "center",
                      width: "100px",
                    }}
                  >
                    <option value="">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, scheme, analyte) => {
            return (
              <div className="d-flex gap-3">
                <Tooltip title="Add Analytes">
                  <Link
                    to={`/add-analytes-scheme-page/${scheme.id}`}
                    style={{ textDecoration: "underline", color: "#008000" }}
                  >
                    <i className="mdi mdi-test-tube font-size-18"></i>
                  </Link>
                </Tooltip>

                <Tooltip title="Update">
                  <Link className="text-success" to="#">
                    <i
                      className="mdi mdi-pencil font-size-18"
                      onClick={(e) => this.handleReagentsClick(e, scheme)}

                    ></i>
                  </Link>
                </Tooltip>
                <Tooltip title="History">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/${this.state.organization_name}/databaseadmin-history/${scheme.id}?type=Scheme`}
                ></Link>
              </Tooltip>
              
                {!scheme.is_part_of_active_cycle ? ( // Show delete button if not part of an active cycle
                  <Tooltip title="Delete">
                    <Link className="text-danger" to="#">
                      <i
                        className="mdi mdi-delete font-size-18"
                        onClick={() => this.onClickDelete(scheme)}
                      ></i>
                    </Link>
                  </Tooltip>
                ) : (
                  <span className="text-muted" style={{ fontSize: "12px" }}>
                    {/* Deletion Disabled */}
                  </span>
                )}
              </div>
            );
          },
        },
      ],
    };
    this.handleReagentsClick = this.handleReagentsClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleReagentsClicks = this.handleReagentsClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

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
    const { SchemeList, onGetScheme } = this.props;
    onGetScheme(this.state.user_id);
    this.setState({ SchemeList });
  }

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  // handleDeleteScheme = () => {
  //   const { onDeleteScheme, onGetScheme } = this.props;
  //   const { SchemeList } = this.state;
  //   if (SchemeList.id !== undefined) {
  //     onDeleteScheme(SchemeList);
  //     setTimeout(() => {
  //       onGetScheme(this.state.user_id);
  //     }, 1000);
  //     this.setState({ deleteModal: false });
  //   }
  // };

  handleDeleteScheme = () => {
    const { onDeleteScheme, onGetScheme } = this.props;
    const { SchemeList } = this.state;

    // Check if the scheme has an active cycle
    if (SchemeList.is_part_of_active_cycle) {
      this.setState({
        errorMessage: "This scheme has an active cycle and cannot be deleted.",
      });
      return;
    }

    // Proceed with deletion if no active cycle
    if (SchemeList.id !== undefined) {
      onDeleteScheme(SchemeList);
      setTimeout(() => {
        onGetScheme(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false, errorMessage: "" }); // Clear error message
    }
  };

  onClickDelete = SchemeList => {
    this.setState({ SchemeList: SchemeList });
    this.setState({ deleteModal: true });
  };

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleReagentsClicks = () => {
    this.setState({ analyte: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps) {
    const { SchemeList } = this.props;
    if (
      !isEmpty(SchemeList) &&
      size(prevProps.SchemeList) !== size(SchemeList)
    ) {
      this.setState({ SchemeList: {}, isEdit: false });
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

  // handleDeletePathologist = () => {
  //   const { onDeletePathologist, onGetScheme } = this.props;
  //   const { ListUnit } = this.state;
  //   if (ListUnit.id !== undefined) {
  //     onDeletePathologist(ListUnit);
  //     setTimeout(() => {
  //       onGetScheme(this.state.user_id);
  //     }, 1000);
  //     this.setState({ deleteModal: false });
  //   }
  // };

  handleReagentsClick = (e, arg) => {
    const analyte = arg;

    this.setState({
      analyte: {
        id: analyte.id,
        name: analyte.name,
        price: analyte.price,
        analytetype: analyte.analytetype,
        status: analyte.status,
        added_by: analyte.added_by,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;
    const { SchemeList } = this.props;

    const {
      idFilter,
      nameFilter,
      priceFilter,
      dateofadditionFilter,
      noofanalytesFilter,
      addedbyFilter,
      statusFilter,
      analytetypeFilter,
      feedbackMessage,
    } = this.state;

    const filteredData = SchemeList.filter(entry => {
      // Modify accordingly for each filter condition
      const id = entry.id ? entry.id.toString() : "";
      const name = entry.name ? entry.name.toString().toLowerCase() : "";
      const price = entry.price ? entry.price.toString().toLowerCase() : "";
      const analytetype = entry.analytetype ? entry.analytetype.toString() : "";
      const date_of_addition = entry.date_of_addition
        ? entry.date_of_addition.toString()
        : "";
      const noofanalytes = entry.noofanalytes
        ? entry.noofanalytes.toString()
        : "";
      const added_by = entry.added_by ? entry.added_by.toString() : "";
      const status = entry.status ? entry.status.toString() : "";

      return (
        id.includes(idFilter) &&
        name.includes(nameFilter.toLowerCase()) &&
        price.includes(priceFilter) &&
        date_of_addition.includes(dateofadditionFilter) &&
        noofanalytes.includes(noofanalytesFilter.toLowerCase()) &&
        added_by.includes(addedbyFilter) &&
        status.includes(statusFilter) &&
        analytetype.includes(analytetypeFilter)
      );
    });

    const { isEdit, deleteModal } = this.state;
    const { onAddNewScheme, onUpdateScheme, onGetScheme } = this.props;
    const analyte = this.state.analyte;

    const pageOptions = {
      sizePerPage: 10,
      // totalSize: SchemeList.length,
      totalSize: filteredData.length,
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteScheme}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Scheme List | NEQAS</title>
          </MetaTags>
          <Container fluid>
            {this.state.feedbackMessage && (
              <div
                className={`alert ${
                  this.state.feedbackMessage.includes("successfully")
                    ? "alert-success"
                    : "alert-danger"
                } text-center`}
              >
                {this.state.feedbackMessage}
              </div>
            )}
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Scheme" breadcrumbItem="Scheme List" />
            <Row className="justify-content-center">
              <Col lg="10">
                <p>
                  <strong>Note:</strong> If Scheme Type{" "}
                  <b className="text-danger">Qualitative</b> then there will be
                  only that Analyte shown here, whose units will be{" "}
                  <b className="text-danger">Pos/Ng/Aqi</b>.
                </p>
                <p>
                  <strong>Note:</strong> Schemes with active Cycles cannot be
                  deleted.
                </p>

                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.ReagentsListColumns}
                      data={filteredData}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.ReagentsListColumns}
                          data={filteredData}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="text-sm-end">
                                    <Button
                                      style={{ background: "#0000CD" }}
                                      className="font-16 btn-block btn btn-primary"
                                      onClick={this.handleReagentsClicks}
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Scheme
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
                                      filter={filterFactory()}
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
                                          ? "Edit Scheme"
                                          : "Add New Scheme"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            name:
                                              (analyte && analyte.name) || "",
                                            price:
                                              (analyte && analyte.price) || "",
                                            analytetype:
                                              (analyte &&
                                                analyte.analytetype) ||
                                              "",
                                            status:
                                              (analyte && analyte.status) || "",
                                            added_by: localStorage.getItem(
                                              "authUser"
                                            )
                                              ? JSON.parse(
                                                  localStorage.getItem(
                                                    "authUser"
                                                  )
                                                ).user_id
                                              : "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddenEditFlag: Yup.boolean(),
                                            name: Yup.string()
                                              .trim()
                                              .required("Please enter name"),
                                            price: Yup.string()
                                              .trim()
                                              .required("Please enter Price"),
                                            analytetype: Yup.string()
                                              .trim()
                                              .required(
                                                "Please select the Type from dropdown"
                                              ),
                                            status: Yup.string()
                                              .trim()
                                              .required(
                                                "Please select the Status from dropdown"
                                              ),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              {
                                                const updateSchemeList = {
                                                  id: analyte.id,
                                                  name: values.name,
                                                  price: values.price,
                                                  analytetype:
                                                    values.analytetype,
                                                  status: values.status,
                                                  added_by: values.added_by,
                                                };

                                                onUpdateScheme(
                                                  updateSchemeList
                                                );
                                                setTimeout(() => {
                                                  onGetScheme(
                                                    this.state.user_id
                                                  );
                                                }, 2000);
                                              }
                                            } else {
                                              const newReagent = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,
                                                name: values.name,
                                                price: values.price,
                                                analytetype: values.analytetype,
                                                status: values.status,
                                                added_by: values.added_by,
                                              };

                                              // save new Pathologist
                                              onAddNewScheme(
                                                newReagent,
                                                this.state.user_id
                                              );
                                              setTimeout(() => {
                                                onGetScheme(this.state.user_id);
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
                                                      <span className="text-danger">
                                                        *
                                                      </span>
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
                                                      value={
                                                        this.state.analyte.name
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          analyte: {
                                                            id: analyte.id,
                                                            name: e.target
                                                              .value,
                                                            // status:
                                                            // analyte.status,
                                                          },
                                                        })
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
                                                      Price
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="price"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.price &&
                                                        touched.price
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.analyte.price
                                                      }
                                                      onChange={e => {
                                                        const rawValue =
                                                          e.target.value.replace(
                                                            /,/g,
                                                            ""
                                                          ); // Remove commas to handle raw number
                                                        if (!isNaN(rawValue)) {
                                                          // Check if the input is a valid number
                                                          const formattedValue =
                                                            Number(
                                                              rawValue
                                                            ).toLocaleString(
                                                              "en-US"
                                                            ); // Add commas
                                                          this.setState({
                                                            analyte: {
                                                              ...this.state
                                                                .analyte,
                                                              price:
                                                                formattedValue,
                                                            },
                                                          });
                                                        }
                                                      }}
                                                    />

                                                    <ErrorMessage
                                                      name="price"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Type
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      as="select"
                                                      name="analytetype"
                                                      className={`form-control ${
                                                        errors.analytetype &&
                                                        touched.analytetype
                                                          ? "is-invalid"
                                                          : ""
                                                      }`}
                                                    >
                                                      <option value="">
                                                        ----- Please select
                                                        -----
                                                      </option>
                                                      <option value="Qualitative">
                                                        Qualitative
                                                      </option>
                                                      <option value="Quantitative">
                                                        Quantitative
                                                      </option>
                                                    </Field>
                                                    <ErrorMessage
                                                      name="analytetype"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Status
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      as="select"
                                                      name="status"
                                                      className={`form-control ${
                                                        errors.status &&
                                                        touched.status
                                                          ? "is-invalid"
                                                          : ""
                                                      }`}
                                                    >
                                                      <option value="">
                                                        ----- Please select
                                                        -----
                                                      </option>
                                                      <option value="Active">
                                                        Active
                                                      </option>
                                                      <option value="Inactive">
                                                        Inactive
                                                      </option>
                                                    </Field>
                                                    <ErrorMessage
                                                      name="status"
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
                                                      style={{
                                                        backgroundColor:
                                                          "#0000CD",
                                                        borderColor: "#0000CD",
                                                      }}
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

ReagentsList.propTypes = {
  match: PropTypes.object,
  SchemeList: PropTypes.array,
  className: PropTypes.any,
  createInstrumentType: PropTypes.array,
  onGetScheme: PropTypes.func,
  onAddNewScheme: PropTypes.func,
  onUpdateScheme: PropTypes.func,
  onDeleteScheme: PropTypes.func,
};

const mapStateToProps = ({ SchemeList }) => ({
  SchemeList: SchemeList.SchemeList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetScheme: id => dispatch(getSchemelist(id)),
  onAddNewScheme: (createInstrumentType, id) =>
    dispatch(addNewSchemeList(createInstrumentType, id)),
  onUpdateScheme: analyte => dispatch(updateSchemeList(analyte)),
  onDeleteScheme: id => dispatch(deleteScheme(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReagentsList));
