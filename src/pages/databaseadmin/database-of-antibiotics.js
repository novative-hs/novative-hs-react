import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteModal from "components/Common/DeleteModal";

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
  FormGroup,
  Input,
  Alert,
} from "reactstrap";
import { saveAs } from "file-saver";
// import {
//   getSchemelist,
// } from "store/scheme/actions";

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
import * as XLSX from "xlsx";
import {
  getAntibioticlist,
  addAntibioticlist,
  updateantibiotic,
  deleteantibiotic,
} from "store/organism-antibiotics/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";
import moment from "moment";
class Antibioticlist extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      nameFilter: "",
      organization_name: "",
      activeSchemesFilter: "", // No filter applied
      statusFilter: "",        // No filter applied
      schemes: [], // To store the list of schemes
      methodsFilter: "",
      equipmentFilter: "",
      reagentsFilter: "",
      masterunitFilter: "",
      dateFilter: "",
      codeFilter: "",
      idFilter: "",
      typeFilter: "",
      statusFilter: "",
      ListAntibiotic: [],
      antibiotic: "",
      errorMessage: "",
      modal: false,
      //   deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      ReagentsListColumns: [
        {
          text: "ID",
          dataField: "id",
          sort: true,
          formatter: (cellContent, row) => <>A-{row.id}</>,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <input
                    type="text"
                    value={this.state.idFilter}
                    onChange={e => this.handleFilterChange("idFilter", e)}
                    className="form-control"
                    style={{
                      textAlign: 'center',
                      width: '100px',
                    }}
                  />
                </div>
                <div style={{ textAlign: 'center', marginTop: '5px' }} >{column.text}</div>
              </>
            );
          },
        },
        {
          dataField: "code",
          text: "Code",
          sort: true,

          style: { textAlign: "center" },
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <input
                    type="text"
                    value={this.state.codeFilter}
                    onChange={e => this.handleFilterChange("codeFilter", e)}
                    className="form-control"
                    style={{
                      textAlign: 'center',
                      width: '100px',
                    }}
                  />
                </div>
                <div style={{ textAlign: 'center', marginTop: '5px' }}>{column.text}</div>
              </>
            );
          },
        },

        {
          dataField: "name",
          text: "Organism",
          sort: true,

          style: { textAlign: "center" },
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <input
                    type="text"
                    value={this.state.nameFilter}
                    onChange={e => this.handleFilterChange("nameFilter", e)}
                    className="form-control"
                    style={{
                      textAlign: 'center',
                      width: '100px',
                    }}
                  />
                </div>
                <div style={{ textAlign: 'center', marginTop: '5px' }}>{column.text}</div>
              </>
            );
          },
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <select
                    value={this.state.statusFilter}
                    onChange={e => this.handleFilterChange("statusFilter", e)}
                    className="form-control"
                  >
                    <option value="">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div style={{ textAlign: 'center', marginTop: '5px' }}>{column.text}</div>
              </>
            );
          },
        },

        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, antibiotic) => (
            <div className="d-flex gap-3 ml-3" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={e => this.handleReagentsClick(e, antibiotic)}
                  ></i>
                </Link>
              </Tooltip>

              {/* <Tooltip title="History">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/${this.state.organization_name}/databaseadmin-history/${antibiotic.id}?type=antibiotic`}
                  onClick={e => {
                    e.preventDefault();
                    // Check if organization_name is valid
                    if (!this.state.organization_name) {
                      console.error("Invalid organization name");
                      return; // Prevent navigation if invalid
                    }
                    const url = `/${this.state.organization_name}/databaseadmin-history/${antibiotic.id}?type=antibiotic`;
                    console.log("Navigating to:", url);
                    this.props.history.push(url); // Navigate to the new URL
                  }}
                ></Link>
              </Tooltip> */}

              <Tooltip title="Delete">
                <Link className="text-danger" to="#">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(antibiotic)}
                  ></i>
                </Link>
              </Tooltip>
            </div>
          ),
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
    const { organization_name } = this.props.match.params;
    const { ListAntibiotic, onGetAntibiotics } = this.props;

    // Retrieve user_id from localStorage
    const userId = localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : null;

    if (userId) {
      // console.log("Fetching schemes for userId:", userId);
      // getSchemelist(userId); // Fetch scheme list
      onGetAntibiotics(userId); // Fetch antibiotic list
    } else {
      // console.error("User ID is undefined or null.");
    }

    // Set ListAntibiotic in state with a fallback
    this.setState({
      ListAntibiotic: ListAntibiotic || [],
      organization_name: this.state.organization_name || organization_name,
    });
  }

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

onClickDelete = antibiotic => {
  this.setState({ ListAntibiotic: antibiotic, deleteModal: true });
};


handleDeleteInstrumentType = () => {
  const { ondeleteantibiotic } = this.props;
  const { ListAntibiotic } = this.state;
  
  if (ListAntibiotic.id !== undefined) {
    ondeleteantibiotic(ListAntibiotic);
    setTimeout(() => {
      this.props.onGetAntibiotics(this.state.user_id);
    }, 1000);
    this.setState({ deleteModal: false });
  }
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
    this.setState({ antibiotic: "", isEdit: false });
    this.toggle();
  };

  componentDidUpdate(prevProps) {
    const { ListAntibiotic} = this.props;

    // Check if `ListAntibiotic` or `SchemeList` has changed
    if (prevProps.ListAntibiotic !== ListAntibiotic ) {
      console.log("Updating filtered schemes based on ListAntibiotic ");

      // Extract unique scheme names from `ListAntibiotic`
      // const organismSchemes = new Set(
      //   ListAntibiotic.flatMap(entry => entry.schemes || []) // `schemes` is assumed to be an array of scheme names
      // );

      // // Filter `SchemeList` to include only schemes present in `ListAntibiotic`
      // const filteredSchemes = SchemeList.filter(scheme =>
      //   organismSchemes.has(scheme.name)
      // );

      // Update state with the filtered schemes
      // this.setState({ filteredSchemes });
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

  handleReagentsClick = (e, arg) => {
    const antibiotic = arg;

    this.setState({
      antibiotic: {
        id: antibiotic.id,
        name: antibiotic.name,
        status: antibiotic.status,
        code: antibiotic.code,
        added_by: antibiotic.added_by,
      },
      isEdit: true,
    });

    this.toggle();
  };

  // IMPORT AND EXPORT THE DATA IN EXCEL FILE
  exportToExcel = () => {
    const { ListAntibiotic } = this.props;
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    // Define fields to export
    const fieldsToExport = ["id", "name", "code", "status", "date_of_addition"];

    // Map each row to an object with only the desired fields
    const dataToExport = ListAntibiotic.map(unit => ({
      id: unit.id,
      name: unit.name,
      code: unit.code,
      status: unit.status,
      date_of_addition: moment(unit.date_of_addition).format(
        "DD MMM YYYY, h:mm A"
      ),
    }));

    // Convert data to Excel format and save as file
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const fileName = "organism_list" + fileExtension;
    saveAs(data, fileName);
  };

  toggleImportModal = () => {
    this.setState(prevState => ({
      importModal: !prevState.importModal,
      importFile: null,
      importError: null,
    }));
  };

  handleFileChange = e => {
    const file = e.target.files[0];
    this.setState({
      importFile: file,
    });
  };

  handleImport = async () => {
    const { importFile } = this.state;
    if (!importFile) {
      this.setState({
        importError: "Please select a file.",
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async e => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        // Assuming your data is in the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Convert to JSON format
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Process jsonData and save to the database
        // Example of processing:
        for (let i = 0; i < jsonData.length; i++) {
          const item = jsonData[i];
          // Dispatch an action to save item to the database
          await this.props.onAddNewAntiobiotic({
            name: item.name,
            code: item.code,
            status: item.status,
            added_by: localStorage.getItem("authUser")
              ? JSON.parse(localStorage.getItem("authUser")).user_id
              : "",
            // Add other fields as required based on your schema
          });
        }

        // Close the modal and show success message
        this.toggleImportModal();
        this.displaySuccessMessage("Data imported successfully!");
        // Optionally, reload data from backend after import
        await this.props.onGetAntibiotics(this.state.user_id);
      };

      reader.readAsArrayBuffer(importFile);
    } catch (error) {
      console.error("Error importing data:", error);
      this.setState({
        importError: "Error importing data. Please try again.",
      });
    }
  };
  render() {
    const { SearchBar } = Search;
    const { errorMessage } = this.state;
    const { ListAntibiotic } = this.props;

    const {
      nameFilter,
      dateFilter,
      statusFilter,
      codeFilter,
      idFilter,
      masterunitFilter,
      typeFilter,
      methodsFilter,
      equipmentFilter,
      reagentsFilter,
    } = this.state;

    const filteredData = ListAntibiotic.filter(entry => {
      const name = entry.name ? entry.name.toLowerCase() : "";
      const master_unit_name = entry.master_unit_name
        ? entry.master_unit_name.toLowerCase()
        : "";
      const status = entry.status || "";
      const id = entry.id ? entry.id.toString() : "";
      const noofmethods = entry.noofmethods ? entry.noofmethods.toString() : "";
      const noofreagents = entry.noofreagents ? entry.noofreagents.toString() : "";
      const noofinstruments = entry.noofinstruments
        ? entry.noofinstruments.toString()
        : "";
      const code = entry.code ? entry.code.toString() : "";
      const date = entry.date_of_addition || "";

      const activeSchemesMatch =
        !this.state.activeSchemesFilter ||
        (entry.schemes && entry.schemes.includes(this.state.activeSchemesFilter));

      const statusMatch = !this.state.statusFilter || entry.status === this.state.statusFilter;

      return (
        activeSchemesMatch &&
        statusMatch &&
        name.includes(this.state.nameFilter.toLowerCase() || "") &&
        master_unit_name.includes(this.state.masterunitFilter.toLowerCase() || "") &&
        id.includes(this.state.idFilter || "") &&
        noofmethods.includes(this.state.methodsFilter || "") &&
        noofreagents.includes(this.state.reagentsFilter || "") &&
        noofinstruments.includes(this.state.equipmentFilter || "") &&
        code.includes(this.state.codeFilter || "") &&
        date.includes(this.state.dateFilter || "")
      );
    });



    const { isEdit } = this.state;
    const { deleteModal } = this.state;

    const { onAddNewAntiobiotic, onupdateantibiotic, onGetAntibiotics } = this.props;
    const antibiotic = this.state.antibiotic;

    const pageOptions = {
      sizePerPage: 50,
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
          onDeleteClick={this.handleDeleteInstrumentType}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Antibiotic List | NEQAS</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Antibiotic" breadcrumbItem="Antibiotic List" />
            <Row className="justify-content-end">
              <Col lg="auto" className="text-end">
                <Button onClick={this.exportToExcel} className="mb-3">
                  Export to Excel
                </Button>
              </Col>
              <Col lg="auto" className="text-end">
                <Button onClick={this.toggleImportModal} className="mb-3">
                  Import from Excel
                </Button>
              </Col>
            </Row>
            <Modal
              isOpen={this.state.importModal}
              toggle={this.toggleImportModal}
              className={this.props.className}
            >
              <ModalHeader toggle={this.toggleImportModal}>
                Import from Excel
              </ModalHeader>
              <ModalBody>
                <div className="mb-3 d-flex justify-content-center">
                  <button
                    className="btn btn-primary"
                    onClick={e => {
                      e.preventDefault(); // Prevent the default action
                      const downloadUrl =
                        process.env.REACT_APP_BACKENDURL +
                        "/media/public/antibiotic.xlsx";
                      saveAs(downloadUrl, "antibiotic.xlsx"); // Use the file-saver library to trigger the download
                    }}
                  >
                    <i className="mdi mdi-download me-1" />
                    Download File Format
                  </button>
                </div>

                <div className="w-100">
                  <h4>
                    <b>Instructions to fill the excel sheet:</b>
                  </h4>
                  <div>
                    <ol>
                      <li>
                        Create a file whose format is, .xlsx, .xls, .csv, .ods,
                        .xml, .html, .txt, .dbf
                      </li>
                      <li>
                        There should be a file of 3 column name, code, status
                        (Active, Inactive)
                      </li>
                      <li>
                        If you want to get more information, contact us at{" "}
                        <strong>eternalqc@gmail.com</strong>
                      </li>
                    </ol>
                  </div>
                </div>
                <div>
                  {this.state.importError && (
                    <div className="alert alert-danger" role="alert">
                      {this.state.importError}
                    </div>
                  )}
                  <Col lg="10">
                    <FormGroup className=" mt-4 mb-0">
                      <Label htmlFor="expirydateInput" className="fw-bolder">
                        Upload File
                        <span
                          style={{ color: "#f46a6a" }}
                          className="font-size-18"
                        >
                          *
                        </span>
                      </Label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={this.handleFileChange}
                        accept=".xlsx, .xls .xlsx, .xls, .csv, .ods, .xml, .html, .txt, .dbf"
                      />
                    </FormGroup>
                  </Col>
                </div>

                <Row className="mt-4">
                  <Col sm="12" className="d-flex justify-content-end">
                    <Button
                      color="primary"
                      onClick={this.handleImport}
                      className="me-2"
                    >
                      Upload
                    </Button>
                    <Button color="secondary" onClick={this.toggleImportModal}>
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </ModalBody>
            </Modal>
            <Row className="justify-content-center">
            
              <Col lg="10">
                <Card>
                  <CardBody>
                    <Row>
                      <Col className="pagination pagination-rounded justify-content-center mb-2">
                        {errorMessage && (
                          <Alert color="danger">{errorMessage}</Alert>
                        )}
                      </Col>
                    </Row>
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
                              <Row className="mb-2">
                                <Col xl="4">
                                  <div className="form-group">
                                    <label htmlFor="activeSchemesFilter">Filter by Scheme</label>
                                    <select
                                      id="activeSchemesFilter"
                                      value={this.state.activeSchemesFilter}
                                      onChange={e => this.handleFilterChange("activeSchemesFilter", e)}
                                      className="form-control"
                                    >
                                      <option value="">All Schemes</option>
                                      {this.state.filteredSchemes &&
                                        this.state.filteredSchemes.map(scheme => (
                                          <option key={scheme.id} value={scheme.name}>
                                            {scheme.name}
                                          </option>
                                        ))}
                                    </select>
                                  </div>

                                </Col>
                                <Col xl="4">
                                  <div className="form-group">
                                    <label htmlFor="statusFilter">Filter by antibiotic Status</label>
                                    <select
                                      id="statusFilter"
                                      value={this.state.statusFilter}
                                      onChange={e => this.handleFilterChange("statusFilter", e)}
                                      className="form-control"
                                    >
                                      <option value="">All</option>
                                      <option value="Active">Active</option>
                                      <option value="Inactive">Inactive</option>
                                    </select>
                                  </div>
                                </Col>
                              </Row>
                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="text-sm-end">
                                    <Button
                                      style={{ background: "#0000CD" }}
                                      className="font-16 btn-block btn btn-primary"
                                      onClick={this.handleReagentsClicks}
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Antibiotic
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
                                          ? "Edit Organism"
                                          : "Add New Organism"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            name:
                                              (antibiotic && antibiotic.name) || "",
                                            code:
                                              (antibiotic && antibiotic.code) || "",
                                            status:
                                              (antibiotic && antibiotic.status) || "",
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
                                            code: Yup.string()
                                              .trim()
                                              .required(
                                                "Please enter Valid Code"
                                              )
                                              .matches(
                                                /^[0-9]+$/,
                                                "Please enter valid code (only integers are allowed)"
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
                                                const updateantibiotic = {
                                                  id: antibiotic.id,
                                                  name: values.name,
                                                  code: values.code,
                                                  status: values.status,
                                                  added_by: values.added_by,
                                                };

                                                // update Pathologist
                                                onupdateantibiotic(
                                                  updateantibiotic
                                                );
                                                setTimeout(() => {
                                                  onGetAntibiotics(
                                                    this.state.user_id
                                                  );
                                                }, 1000);
                                              }
                                            } else {
                                              const newOrganism = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,
                                                name: values.name,
                                                code: values.code,
                                                status: values.status,
                                                added_by: values.added_by,
                                              };

                                              // save new Pathologist
                                              onAddNewAntiobiotic(
                                                newOrganism,
                                                this.state.user_id
                                              );
                                              setTimeout(() => {
                                                onGetAntibiotics(
                                                  this.state.user_id
                                                );
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
                                                        this.state.antibiotic.name
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          antibiotic: {
                                                            id: antibiotic.id,
                                                            name: e.target
                                                              .value,
                                                            status:
                                                              antibiotic.status,
                                                            code: antibiotic.code,
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
                                                      Code
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="code"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.code &&
                                                          touched.code
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.antibiotic.code
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          antibiotic: {
                                                            id: antibiotic.id,
                                                            name: antibiotic.name,
                                                            status:
                                                              antibiotic.status,
                                                            code: e.target
                                                              .value,
                                                          },
                                                        })
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="code"
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
                                                      className={`form-control ${errors.status &&
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

Antibioticlist.propTypes = {
  match: PropTypes.object,
  ListAntibiotic: PropTypes.array,
  ondeleteantibiotic: PropTypes.func,
  className: PropTypes.any,
  createInstrumentType: PropTypes.array,
  onGetAntibiotics: PropTypes.func,
  onAddNewAntiobiotic: PropTypes.func,
  onupdateantibiotic: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
 
};


const mapStateToProps = (state) => {
  const ListAntibiotic = state.ListOrganism?.ListAntibiotic || [];
  console.log("Extracted ListAntibiotic:", ListAntibiotic);
  return {
    ListAntibiotic,
  };
};


const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetAntibiotics: id => dispatch(getAntibioticlist(id)),
 onAddNewAntiobiotic: (createantibiotic, id) =>
  dispatch(addAntibioticlist(createantibiotic)),
 onupdateantibiotic: antibiotic => dispatch(updateantibiotic(antibiotic)),
 ondeleteantibiotic: antibiotic => dispatch(deleteantibiotic(antibiotic)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Antibioticlist));