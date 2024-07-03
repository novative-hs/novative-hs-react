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
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
// import DeleteModal from "components/Common/DeleteModal";
import * as XLSX from "xlsx";
import {
  getManufacturalList,
  addNewManufactural,
  updateManufactural,
//   deletePathologist,
} from "store/manufactural/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";
import moment from 'moment';
class Manufactural extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      importModal: false,
      importFile: null,
      importError: null,
      nameFilter: '',
      addedbyFilter:'',
      dateFilter:'',
      cityFilter: '',
      idFilter: '',
      addressFilter:'',
      telephoneFilter:'',
      countryFilter:'',
      ManufacturalList: [],
      manufacturtal: "",
      modal: false,
    //   deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      ReagentsListColumns: [
        {
          text: "id",
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
          text: "Name",
          sort: true,
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
          style: { textAlign: 'left' }
        },
        {
          dataField: "city",
          text: "Website",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>              
                  <input
                    type="text"
                    value={this.state.cityFilter}
                    onChange={e => this.handleFilterChange('cityFilter', e)}
                    className="form-control"
                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
          formatter: (cell, row) => {
            // Check if the URL starts with http:// or https://
            const isAbsoluteUrl = /^https?:\/\//i.test(cell);
        
            if (isAbsoluteUrl) {
              // Directly render the absolute URL
              return <a href={cell} target="_blank" rel="noopener noreferrer">{cell}</a>;
            } else {
              // Assume it's a relative URL and construct the absolute URL
              const protocol = 'https://'; // Use https:// or http:// based on your requirement
              const absoluteUrl = `${protocol}${cell}`;
              return <a href={absoluteUrl} target="_blank" rel="noopener noreferrer">{cell}</a>;
            }
          },
          style: { textAlign: 'left' }
        },
        
        
        {
          dataField: "country",
          text: "country",
          sort: true,
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
          style: { textAlign: 'left' }
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
          formatter: (cellContent, manufacturtal) => (
            <div className="d-flex gap-3 ml-3">
              <Tooltip title="Update">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e => this.handleManufacturalClick(e, manufacturtal)}
                ></i>
              </Link></Tooltip>
              <Tooltip title="History">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/databaseadmin-history/${manufacturtal.id}`}
                ></Link>
              </Tooltip>
            </div>
          ),
       
        },
      ],
    };
    this.handleManufacturalClick = this.handleManufacturalClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleManufacturalClicks = this.handleManufacturalClicks.bind(this);
    // this.onClickDelete = this.onClickDelete.bind(this);
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
    const { ManufacturalList, onGetManufactural } = this.props;
    onGetManufactural(this.state.user_id);
    this.setState({ ManufacturalList });
  }

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };
    // Filter data based on filter values
    filterData = () => {
      const { ManufacturalList } = this.props;
      const { nameFilter, addedbyFilter, dateFilter, cityFilter,idFilter, addressFilter,telephoneFilter, countryFilter} = this.state;
    
      const filteredData = ManufacturalList.filter(entry => {
        const name = entry.name ? entry.name.toString().toLowerCase() : "";
        const city = entry.city ? entry.city.toString().toLowerCase() : "";
        const id = entry.id ? entry.id.toString() : "";
        const country = entry.country ? entry.country.toString().toLowerCase() : "";
        const address = entry.address ? entry.address.toString().toLowerCase() : "";
        const addedBy = entry.added_by ? entry.added_by.toString().toLowerCase() : "";
        const telephone = entry.telephone ? entry.telephone.toString() : "";
        const date = entry.date_of_addition ? entry.date_of_addition.toString() : "";
    
        return (
          name.includes(nameFilter.toLowerCase()) &&
          id.includes(idFilter) &&
          city.includes(cityFilter.toLowerCase()) &&
          country.includes(countryFilter.toLowerCase()) &&
          address.includes(addressFilter.toLowerCase()) &&
          addedBy.includes(addedbyFilter.toLowerCase()) &&
          telephone.includes(telephoneFilter) &&
          date.includes(dateFilter)
        );
      });
    
      return filteredData;
    };
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleManufacturalClicks = () => {
    this.setState({ manufacturtal: "",  isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { ManufacturalList } = this.props;
    if (
      !isEmpty(ManufacturalList) &&
      size(prevProps.ManufacturalList) !== size(ManufacturalList)
    ) {
      this.setState({ ManufacturalList: {}, isEdit: false });
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

//   toggleDeleteModal = () => {
//     this.setState(prevState => ({
//       deleteModal: !prevState.deleteModal,
//     }));
//   };

//   onClickDelete = ManufacturalList => {
//     this.setState({ ManufacturalList: ManufacturalList });
//     this.setState({ deleteModal: true });
//   };

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

//   handleDeletePathologist = () => {
//     const { onDeletePathologist, onGetManufactural } = this.props;
//     const { ManufacturalList } = this.state;
//     if (ManufacturalList.id !== undefined) {
//       onDeletePathologist(ManufacturalList);
//       setTimeout(() => {
//         onGetManufactural(this.state.user_id);
//       }, 1000);
//       this.setState({ deleteModal: false });
//     }
//   };

  handleManufacturalClick = (e, arg) => {
    const manufacturtal = arg;

    this.setState({
      manufacturtal: {
        id: manufacturtal.id,
        name: manufacturtal.name,
        // status: manufacturtal.status,
        country: manufacturtal.country,
        address: manufacturtal.address,
        telephone: manufacturtal.telephone,
        city: manufacturtal.city,
        added_by: manufacturtal.added_by,
      },
      isEdit: true,
    });

    this.toggle();
  };
  exportToExcel = () => {
    const { ManufacturalList } = this.props;
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
  
    // Define fields to export
    const fieldsToExport = ['id', 'name', 'city', 'country','date_of_addition'];
  
    // Map each row to an object with only the desired fields
    const dataToExport = ManufacturalList.map(unit => ({
      id: unit.id,
      name: unit.name,
      website: unit.city,
      country: unit.country,
      date_of_addition: moment(unit.date_of_addition).format('DD MMM YYYY, h:mm A'),
    }));
  
    // Convert data to Excel format and save as file
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    const fileName = 'Manufactural_list' + fileExtension;
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
          await this.props.onAddNewManufactural({

            name: item.name,
            city: item.website,
            country: item.country,
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
        await this.props.onGetManufactural(this.state.user_id);
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
    const { SearchBar } = Search;

    const { ManufacturalList } = this.props;

    const { isEdit, 
        // deleteModal 
    } = this.state;

    const { onAddNewManufactural, onUpdateManufactural, onGetManufactural } =
      this.props;
    const manufacturtal = this.state.manufacturtal;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: ManufacturalList.length,
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
        {/* <DeleteModal
        //   show={deleteModal}
          onDeleteClick={this.handleDeletePathologist}
          onCloseClick={() => this.setState({ deleteModal: false })}
        /> */}
        <div className="page-content">
          <MetaTags>
            <title>Manufacturer List | NEQAS</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Manufacturer"
              breadcrumbItem="Manufacturer List"
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
            {this.state.importError && (
              <div className="alert alert-danger" role="alert">
                {this.state.importError}
              </div>
            )}
            <div className="mb-3">
              <input type="file" className= "form-control" onChange={this.handleFileChange} accept=".xlsx, .xls" />
            </div>
            <Button color="primary" onClick={this.handleImport}>Import</Button>
            {' '}
            <Button color="secondary" onClick={this.toggleImportModal}>Cancel</Button>
          </ModalBody>
        </Modal>
            <Row className="justify-content-center">
            {/* <p className="text-danger">Note: Pathologist Information will scale the rating of your lab.</p> */}

              <Col lg="10">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.ReagentsListColumns}
                      data={ManufacturalList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.ReagentsListColumns}
                          data={ManufacturalList}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-4">
                                {/* <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col> */}
                                <Col xl="12">
                                  <div className="text-sm-end">
                                    <Button
                                     style={{ background: "#0000CD" }}
                                      className="font-16 btn-block btn btn-primary"
                                      onClick={this.handleManufacturalClicks}
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Manufacturer
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
                                      data={this.filterData()}
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
                                          ? "Edit Manufacturer"
                                          : "Add New Manufacturer"}
                                      </ModalHeader>
                                      <ModalBody>
<Formik
                                          enableReinitialize={true}
                                          
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            city: (manufacturtal && manufacturtal.city) || "",
                                            country: (manufacturtal && manufacturtal.country) || "",
                                      
                                            name: (manufacturtal && manufacturtal.name) || "",
                                            // code: (manufacturtal && manufacturtal.code) || "",
                                            // status: (manufacturtal && manufacturtal.status) || "",
                                            added_by: localStorage.getItem("authUser")
                                              ? JSON.parse(localStorage.getItem("authUser")).user_id
                                              : "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddenEditFlag: Yup.boolean(),
                                            name: Yup.string().trim().required("Please enter name"),
                                            // code: Yup.string().trim().required("Please enter Valid Code"),
                                            // status: Yup.string()
                                            //   .trim()
                                            //   .required("Please select the Status from dropdown"),
                                            city: Yup.string().trim().required("Please enter website"),
                                            country: Yup.string().trim().required("Please enter country"),
                                    
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              {
                                                const updateManufactural = {
                                                  id: manufacturtal.id,
                                                  city:values.city,
                                                  country: values.country,
                                                
                                                
                                                  name: values.name,
                                                //   code: values.code,
                                                //   status: values.status,
                                                  added_by: values.added_by,
                                                };

                                                // update Pathologist
                                                onUpdateManufactural(
                                                  updateManufactural
                                                );
                                                console.log("data in the pul api", updateManufactural)
                                                setTimeout(() => {
                                                  onGetManufactural(
                                                    this.state.user_id
                                                  );
                                                }, 1000);
                                              }
                                            } else {
                                              const newReagent = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,
                                                  city:values.city,
                                                  country: values.country,
                                                  name: values.name,
                                                //   code: values.code,
                                                //   status: values.status,
                                                  added_by: values.added_by,
                                              };

                                              // save new Pathologist
                                              onAddNewManufactural(
                                                newReagent,
                                                this.state.user_id
                                              );
                                              setTimeout(() => {
                                                onGetManufactural(
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
                                                        this.state.manufacturtal
                                                          .name
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          manufacturtal: {
                                                         
                                                            id: manufacturtal.id,
                                                            name: e.target
                                                              .value,
                                                        
                                                              city:
                                                              manufacturtal.city,
                                                              country:
                                                              manufacturtal.country,
                                                            
                                                       
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

                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Telephone
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="telephone"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.telephone &&
                                                        touched.telephone
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.manufacturtal
                                                          .telephone
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          manufacturtal: {
                                                         
                                                            id: manufacturtal.id, 
                                                            name: manufacturtal.name,
                                                          
                                                            telephone: e.target
                                                              .value,

                                                         
                                                              city:
                                                              manufacturtal.city,
                                                              country:
                                                              manufacturtal.country,
                                                            
                                                                address: manufacturtal.address,
                                                      
                                                          },
                                                        })
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="telephone"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div> */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Website
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="city"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.city &&
                                                        touched.city
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.manufacturtal
                                                          .city
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          manufacturtal: {
                                                         
                                                            id: manufacturtal.id,
                                                            name: manufacturtal.name,
                                                            city: e.target
                                                              .value,
                                                      
                                                           
                                                              country:
                                                              manufacturtal.country,
                                                            
                                                       
                                                          
                                                          },
                                                        })
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="city"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Country
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="name"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.country &&
                                                        touched.country
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.manufacturtal
                                                          .country
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          manufacturtal: {
                                                         
                                                            id: manufacturtal.id,
                                                            name: manufacturtal.name,
                                                            city:
                                                            manufacturtal.city,
                                                   
                                                            country: e.target
                                                              .value,
                                                      
                                                          },
                                                        })
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="country"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Address
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="address"
                                                      type="text"
                                                      className={
                                                        "form-control" + 
                                                        (errors.address &&
                                                        touched.address
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.manufacturtal.address
                                                          
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          manufacturtal: {
                                                            id: manufacturtal.id,
                                                            name: manufacturtal.name,
                                                            city:
                                                            manufacturtal.city,
                                                            country:
                                                            manufacturtal.country,
                                                          
                                                            telephone:
                                                              manufacturtal.telephone,
                                                              address: e.target.value,
                                                          },
                                                        })
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="address"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div> */}
                                             
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

Manufactural.propTypes = {
  match: PropTypes.object,
  ManufacturalList: PropTypes.array,
  className: PropTypes.any,
  onGetManufactural: PropTypes.func,
  onAddNewManufactural: PropTypes.func,
//   onDeletePathologist: PropTypes.func,
  onUpdateManufactural: PropTypes.func,
};

const mapStateToProps = ({ ManufacturalList }) => ({
  ManufacturalList: ManufacturalList.ManufacturalList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetManufactural: id => dispatch(getManufacturalList(id)),
  onAddNewManufactural: (manufacturtal, id) =>
    dispatch(addNewManufactural(manufacturtal, id)),
  onUpdateManufactural: manufacturtal => dispatch(updateManufactural(manufacturtal)),
//   onDeletePathologist: manufacturtal => dispatch(deletePathologist(manufacturtal)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Manufactural));