import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import DeleteModal from "components/Common/DeleteModal";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter ,selectFilter} from 'react-bootstrap-table2-filter';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Tooltip from "@material-ui/core/Tooltip";
import Select from "react-select";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  FormGroup,
  Alert,
  Button
} from "reactstrap";
import { saveAs } from 'file-saver';


import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getReagentlist,
  addNewReagents,
  updateReagents,
  deleteReagent
} from "store/reagents/actions";
import {getManufacturalList} from "store/manufactural/actions";
import { getcountrylist} from "store/participantcountry/actions";
import * as XLSX from "xlsx";
import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";
import moment from 'moment';
import { getCountryList } from "helpers/django_api_helper";
class ReagentList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      selectedUnit: null,
      organization_name: "",
      nameFilter: '',
      dateFilter: '',
      manufacturerFilter:'',
      codeFilter: '',
      statusFilter:'',
      idFilter: '',
      countFilter:'',
      countryFilter:'',
      deleteModal: false,
      isEdit: false,
      ReagentList: [],
      ManufacturalList: [],
      ListCountry:[],
      errorMessage:"",
      reagent: "",
      modal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      successMessage: "",
      feedbackListColumns: [
        {
          text: "ID",
          dataField: "id",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.idFilter}
                    onChange={e => this.handleFilterChange('idFilter', e)}
                    className="form-control"
                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
          headerStyle: { width: '150px' },  // Adjust the width as needed
  style: { width: '150px' },  // Adjust the width as needed
        },
        {
          dataField: "name",
          text: "Reagent",
          sort: true,
          style: { textAlign: 'left' },
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.nameFilter}
                    onChange={e => this.handleFilterChange('nameFilter', e)}
                    className="form-control"
                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
        },        
        {
          dataField: 'analytes_count',
          text: 'No of Analytes',
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.countFilter}
                    onChange={(e) => this.handleFilterChange('countFilter', e)}
                    className="form-control"
                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
          formatter: (cellContent, unitlist) => {
            return (
              <div>
                <Link
                  to={`/reagents-analyte/${unitlist.id}`}
                  style={{ textDecoration: 'underline', color: '#0000CD', display: 'block', marginTop: '5px' }}
                >
                  {unitlist.analytes_count}
                </Link>
              </div>
            );
          }
        },
        {
          dataField: "code",
          text: "code",
          sort: true,
          //style: { textAlign: 'right' },
          headerFormatter: (column, colIndex) => {
            return (
              <>
              <div>
              
                <input
                  type="text"
                  value={this.state.codeFilter}
                  onChange={e => this.handleFilterChange('codeFilter', e)}
                  className="form-control"
               
                />
              </div>
                <div>{column.text}</div>
                </>
            );
          },
        },
        {
          dataField: "manufactural",
          text: "Manufacturer",
          sort: true,
          //style: { textAlign: 'right' },
          headerFormatter: (column, colIndex) => {
            return (
              <>
              <div>
              
                <input
                  type="text"
                  value={this.state.manufacturerFilter}
                  onChange={e => this.handleFilterChange('manufacturerFilter', e)}
                  className="form-control"
               
                />
              </div>
                <div>{column.text}</div>
                </>
            );
          },
        },
        {
          dataField: "country",
          text: "Country",
          sort: true,
          //style: { textAlign: 'right' },
          headerFormatter: (column, colIndex) => {
            return (
              <>
              <div>
              
                <input
                  type="text"
                  value={this.state.countryFilter}
                  onChange={e => this.handleFilterChange('countryFilter', e)}
                  className="form-control"
               
                />
              </div>
                <div>{column.text}</div>
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
                <div>
                  <select
                    value={this.state.statusFilter}
                    onChange={e => this.handleFilterChange('statusFilter', e)}
                    className="form-control"
                  >
                    <option value="">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>{column.text}</div>
              </>
            );
          },
        },
         
        {
          text: "Date of Addition",
          dataField: "date_of_addition",
          sort: true,
          hidden: false,
          headerFormatter: (column, colIndex) => {
            return (
              <>
              <div>
              
                <input
                  type="text"
                  value={this.state.dateFilter}
                  onChange={e => this.handleFilterChange('dateFilter', e)}
                  className="form-control"
               
                />
              </div>
                <div>{column.text}</div>
                </>
            );
          },
          formatter: (cellContent, unitlist) => (
            <>
              <span>
                {moment(unitlist.date_of_addition).format("DD MMM YYYY")}
              </span>
            </>
          ),
      },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, reagent) => (
            <div className="d-flex gap-3 ml-3">

              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() => this.toggle(reagent)}
                  // onClick={e => this.handleCSRClick(e, CSR)}
                  ></i>
                </Link>
              </Tooltip>
              <Tooltip title="History">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/${this.state.organization_name}/databaseadmin-history/${reagent.id}?type=Reagent`}
                  onClick={e => {
                    e.preventDefault();
                    // Check if organization_name is valid
                    if (!this.state.organization_name) {
                      // console.error("Invalid organization name");
                      return; // Prevent navigation if invalid
                    }
                    const url = `/${this.state.organization_name}/databaseadmin-history/${reagent.id}?type=Reagent`;
                    // console.log("Navigating to:", url);
                    this.props.history.push(url); // Navigate to the new URL
                  }}
                ></Link>
              </Tooltip>
              <Tooltip title="Delete">
                <Link className="text-danger" to="#">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(reagent)}
                  ></i>
                </Link>
              </Tooltip>
            </div>
          ),
       
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const { organization_name } = this.props.match.params;
    // Only set state if organization_name is empty
    if (!this.state.organization_name) {
      this.setState({ organization_name });
    }
    const { ReagentList, onGetReagents } = this.props;
    onGetReagents(this.state.user_id);
    this.setState({ ReagentList });

    
    const { ManufacturalList, onGetManufacturalist } = this.props;
    onGetManufacturalist(this.state.user_id);
    this.setState({ ManufacturalList });

    const { ListCountry, onGetCountrylist } = this.props;
    onGetCountrylist(this.state.user_id);
    this.setState({ ListCountry });
    
  }

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = (reagent) => {
    if (reagent.analytes_count === 0) {
      this.setState({ ListUnit: reagent });
      this.setState({ deleteModal: true });
    } else {
      this.setState({ errorMessage: "Cannot delete. Analytes are assigned." });
      // Clear error message after 5 seconds
      setTimeout(() => {
        this.setState({ errorMessage: '' });
      }, 2000);
    }
  };

  handleDeleteInstrumentType = () => {
    const { onDeleteInstrumentType} = this.props;
    const { ListUnit } = this.state;
    if (ListUnit.id !== undefined) {
      onDeleteInstrumentType(ListUnit);
      setTimeout(() => {
        this.props.onGetReagents(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };


  displaySuccessMessage = message => {
    this.setState({ successMessage: message });

    setTimeout(() => {
      this.setState({ successMessage: "", modal: false });
    }, 3000);
  }
  toggle(reagent) {
    if (reagent && reagent.id) {
      console.log("Toggle - Reagent:", reagent.instrument_type,reagent.manufactural);
      this.setState({
        modal: true,
        selectedUnit: { 
          id: reagent.id, 
          name: reagent.name, 
          added_by: reagent.added_by ,
          code: reagent.code, 
          status: reagent.status,
          manufactural: reagent.manufactural, // Access the value property
          country: reagent.country // Access the value property
        },
        isEdit: true,
      });
    } else {

      this.setState({
        modal: true,
        selectedUnit: null,
        isEdit: false,
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { ReagentList } = this.props;
    if (!isEmpty(ReagentList) && size(prevProps.ReagentList) !== size(ReagentList)) {
      this.setState({ ReagentList: {}, isEdit: false });
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
  closeModal = () => {
    this.setState({ modal: false });
  }
    exportToExcel = () => {
    const { ReagentList } = this.props;
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    // Define fields to export
    const fieldsToExport = ['id', 'name', 'code','date_of_addition'];

    // Map each row to an object with only the desired fields
    const dataToExport = ReagentList.map(unit => ({
      id: unit.id,
      name: unit.name,
      code: unit.code,
      date_of_addition: moment(unit.date_of_addition).format('DD MMM YYYY, h:mm A'),
    }));

    // Convert data to Excel format and save as file
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    const fileName = 'Reagent_list' + fileExtension;
    saveAs(data, fileName);
  };
  toggleImportModal = () => {
    this.setState(prevState => ({
      importModal: !prevState.importModal,
      importFile: null,
      importError: null,
    }));
  };
  handleFileChange = (e) => {
    const file = e.target.files[0];
    this.setState({
      importFile: file,
    });
  };
  handleImport = async () => {
    const { importFile } = this.state;
    if (!importFile) {
      this.setState({
        importError: 'Please select a file.',
      });
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
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
          await this.props.onAddNewReagent({

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
        this.displaySuccessMessage('Data imported successfully!');
        // Optionally, reload data from backend after import
        await this.props.onGetReagents(this.state.user_id);
      };

      reader.readAsArrayBuffer(importFile);
    } catch (error) {
      console.error('Error importing data:', error);
      this.setState({
        importError: 'Error importing data. Please try again.',
      });
    }
  };
  render() {
    const {deleteModal } = this.state;
    const { errorMessage } = this.state;
    const { SearchBar } = Search;

    const { ReagentList } = this.props;

    const reagent = this.state.ReagentList;


    const { nameFilter, dateFilter, idFilter,codeFilter,manufacturerFilter,statusFilter,countFilter,countryFilter } = this.state;

    // Apply the filters to the reagent list
    const filteredUnits = ReagentList.filter(entry => {
      const name = entry.name ? entry.name.toString().toLowerCase() : "";
      const status = entry.status ? entry.status.toString(): "";
      const code = entry.code ? entry.code.toString() : "";
      const count = entry.analytes_count ? entry.analytes_count.toString() : "";
      const manufactural = entry.manufactural ? entry.manufactural.toString().toLowerCase() : "";
      const country = entry.country ? entry.country.toString().toLowerCase() : "";
      const id = entry.id ? entry.id.toString() : "";
      const date = entry.date_of_addition ? entry.date_of_addition.toString() : "";

      return (
        name.includes(nameFilter.toLowerCase()) &&
        code.includes(codeFilter) &&
        status.includes(statusFilter) &&
        manufactural.includes(manufacturerFilter.toLowerCase()) &&
        country.includes(countryFilter.toLowerCase()) &&
        count.includes(countFilter) &&
        id.includes(idFilter) &&
        date.includes(dateFilter)
      );
    });


    const pageOptions = {
      sizePerPage: 10,
      totalSize: filteredUnits.length,
      custom: true,
    };
    

    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];
    const ManufacturalList = [];
    for (let i = 0; i < this.props.ManufacturalList.length; i++) {
      ManufacturalList.push({
        label: this.props.ManufacturalList[i].name,
        value: this.props.ManufacturalList[i].id,
      });
    }
    
    const ListCountry = [];
    for (let i = 0; i < this.props.ListCountry.length; i++) {
      ListCountry.push({
        label: this.props.ListCountry[i].name,
        value: this.props.ListCountry[i].id,
      });
    }
    
    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteInstrumentType}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Reagent List</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Reagents"
              breadcrumbItem="Reagents List"
            />
               <Row className="justify-content-end">
  <Col lg="auto" className="text-end">
    <Button onClick={this.exportToExcel} className="mb-3">Export to Excel</Button>
  </Col>
  <Col lg="auto" className="text-end">
    <Button onClick={this.toggleImportModal} className="mb-3">Import from Excel</Button>
  </Col>
</Row>
              <Modal isOpen={this.state.importModal} toggle={this.toggleImportModal} className={this.props.className}>
          <ModalHeader toggle={this.toggleImportModal}>Import from Excel</ModalHeader>
          <ModalBody>
                <div className="mb-3 d-flex justify-content-center">
                  <button
                    className="btn btn-primary"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default action
                      const downloadUrl = process.env.REACT_APP_BACKENDURL + "/media/public/Reagents.xlsx";
                      saveAs(downloadUrl, "Reagents.xlsx"); // Use the file-saver library to trigger the download
                    }}
                  >
                    <i className="mdi mdi-download me-1" />
                    Download File Format
                  </button>
                </div>


                <div className="w-100">
                  <h4><b>Instructions to fill the excel sheet:</b></h4>
                  <div>
                    <ol>
                      <li>
                        Create a file whose format is, .xlsx, .xls, .csv, .ods, .xml, .html, .txt, .dbf
                      </li>
                      <li>
                        There should be a file of 3 column name, code, status (Active, Inactive)
                      </li>
                      <li>
                        If you want to get more information, contact
                        us at <strong>eternalqc@gmail.com</strong>
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
                      <input type="file" className="form-control" onChange={this.handleFileChange} accept=".xlsx, .xls .xlsx, .xls, .csv, .ods, .xml, .html, .txt, .dbf" />
                    </FormGroup>
                  </Col></div>


                <Row className="mt-4">
                  <Col sm="12" className="d-flex justify-content-end">
                    <Button color="primary" onClick={this.handleImport} className="me-2">Upload</Button>
                    <Button color="secondary" onClick={this.toggleImportModal}>Cancel</Button>
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
                          <Alert color="danger">
                            {errorMessage}
                          </Alert>
                        )}
                      </Col>
                    </Row>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={filteredUnits}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={filteredUnits}
                          search
                        >

                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-4">

                                <Col xl="12">
                                  <Col className="text-end">

                                    <button className="btn btn-primary btn-block mb-4" onClick={() => this.toggle()} style={{ background: "#0000CD" }}>Add New Reagent</button>

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader toggle={this.closeModal} tag="h4">
                                        {"Reagent"}
                                      </ModalHeader>
                                      <ModalBody>
                                        {this.state.successMessage && (
                                          <div className="alert alert-success" role="alert">
                                            {this.state.successMessage}
                                          </div>
                                        )}
                                       <Formik
  enableReinitialize={true}
  initialValues={{
    name: this.state.selectedUnit ? this.state.selectedUnit.name : "",
    code: this.state.selectedUnit ? this.state.selectedUnit.code : "",
    status: this.state.selectedUnit ? this.state.selectedUnit.status : "Active",
    manufactural: this.state.selectedUnit ? this.state.selectedUnit.manufactural : "", // Assign selected manufactural
    country: this.state.selectedUnit ? this.state.selectedUnit.country : "", 
  }}
  validationSchema={Yup.object().shape({
    name: Yup.string().required("Name is required"),
    code: Yup.string()
      .required("Code is required")
      .matches(/^[0-9]+$/, "Code must be a number"),
    manufactural: Yup.mixed().required("Manufacturer is required"),
    country: Yup.mixed().required("Country is required"),
  })}
  onSubmit={async (values, { setSubmitting }) => {
    const userId = localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : "";

      const newUnit = {
        name: values.name,
        code: values.code,
        status: values.status,
        added_by: userId,
        manufactural: values.manufactural,     
        country: values.country,     
      };
      

    try {
      if (this.state.isEdit) {
        await this.props.onUpdateReagent(this.state.selectedUnit.id, newUnit);
        this.displaySuccessMessage("Reagent updated successfully!");
        setTimeout(() => {
          this.props.onGetReagents(this.state.user_id);
        }, 1000);
      } else {
        await this.props.onAddNewReagent(newUnit);
        this.displaySuccessMessage("Reagent added successfully!");
        setTimeout(() => {
          this.props.onGetReagents(this.state.user_id);
        }, 1000);
      }
    } catch (error) {
      console.error("Error updating/adding method:", error);
    }

    setSubmitting(false);
  }}
>

  {({ errors, status, touched }) => (
    <Form>
      <Row>
        <Col className="col-12">
          <div className="mb-3">
            <Label className="col-form-label">Reagent Name</Label>
            <Field
              name="name"
              type="text"
              className="form-control"
            />
            <ErrorMessage name="name" component="div" className="text-danger" />
          </div>
          <div className="mb-3">
            <Label className="col-form-label">Code</Label>
            <Field
              name="code"
              type="text"
              className="form-control"
            />
            <ErrorMessage name="code" component="div" className="text-danger" />
          </div>
          
<div className="mb-3">
  <Label className="col-form-label">Manufacturer</Label>
  <Field
    name="manufactural" // Ensure the name matches the field name
    as="select"
    className="form-control"
    multiple={false}
  >
    <option value="">Select Manufacturer</option> 
    {ManufacturalList.map(manufactural => (
      <option key={manufactural.value} value={this.state.manufactural}>
        {manufactural.label}
      </option>
    ))}
  </Field>
  <ErrorMessage name="manufactural" component="div" className="text-danger" />
</div>
<div className="mb-3">
  <Label className="col-form-label">Country</Label>
  <Field
    name="country" // Ensure the name matches the field name
    as="select"
    className="form-control"
    multiple={false}
  >
    <option value="">Select Country</option> 
    {ListCountry.map(country => (
      <option key={country.value} value={this.state.country}>
        {country.label}
      </option>
    ))}
  </Field>
  <ErrorMessage name="country" component="div" className="text-danger" />
</div>

          <div className="mb-3">
            <Label className="col-form-label">Status</Label>
            <Field
              name="status"
              as="select"
              defaultValue="Active"
              className="form-control"
              multiple={false}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Field>
            <ErrorMessage name="status" component="div" className="text-danger" />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="text-end">
            <button type="submit" className="btn btn-success save-user"
              style={{ backgroundColor: '#0000CD', borderColor: '#0000CD' }}>Save</button>
          </div>
        </Col>
      </Row>
    </Form>
  )}
</Formik>

                                      </ModalBody>
                                    </Modal>

                                  </Col>
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

ReagentList.propTypes = {
  match: PropTypes.object,
  ReagentList: PropTypes.array,
  ManufacturalList: PropTypes.array,
  ListCountry:PropTypes.array,
  className: PropTypes.any,
  onGetReagents: PropTypes.func,
  onGetManufacturalist: PropTypes.func,
  onGetCountrylist: PropTypes.func,
  onGetInstrumentTypeList: PropTypes.func,
  createInstrumentType: PropTypes.array,
  error: PropTypes.any,
  success: PropTypes.any,
  onDeleteInstrumentType: PropTypes.func,
  onAddNewReagent: PropTypes.func,
  onUpdateReagent: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = ({ ReagentList,ManufacturalList,ListCountry }) => ({
  ReagentList: ReagentList.ReagentList,
  ManufacturalList: ManufacturalList.ManufacturalList,
  ListCountry: ListCountry.ListCountry,
});



const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetReagents: id => dispatch(getReagentlist(id)),
  onGetManufacturalist: (id) => dispatch(getManufacturalList(id)),
  onGetCountrylist: (id) => dispatch(getcountrylist(id)),
  onAddNewReagent: (reagent, id) =>
    dispatch(addNewReagents(reagent, id)),
  onUpdateReagent: (id,reagent) => dispatch(updateReagents({id, ...reagent})),

  onUpdateType: (id, methodlist) => dispatch(updateInstrument({ id, ...methodlist })),
  onDeleteInstrumentType: reagent => dispatch(deleteReagent(reagent)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReagentList));