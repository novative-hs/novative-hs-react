import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Tooltip from "@material-ui/core/Tooltip";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  FormGroup,
  Label,
} from "reactstrap";

import { saveAs } from 'file-saver';
import * as XLSX from "xlsx";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getcountrylist, addNewCountry, updateCountry } from "store/participantcountry/actions";
import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";
import moment from 'moment';

class ParticipantCountry extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      nameFilter: '',
      dateFilter: '',
      organization_name: "",
      idFilter: '',
      selectedCountry: null,
      isEdit: false,
      ListCountry: [],
      countrylist: "",
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
          text: "Country",
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
          formatter: (cellContent, countrylist) => (
            <>
              <span>
                {moment(countrylist.date_of_addition).format("DD MMM YYYY")}
              </span>
            </>
          ),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, countrylist) => (
            <div>
              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() => this.toggle(countrylist)}
                  ></i>
                </Link>
              </Tooltip>
              <Tooltip title="History">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/${this.state.organization_name}/databaseadmin-history/${countrylist.id}?type=ParticipantCountry`}
                  onClick={e => {
                    e.preventDefault();
                    // Check if organization_name is valid
                    if (!this.state.organization_name) {
                      // console.error("Invalid organization name");
                      return; // Prevent navigation if invalid
                    }
                    const url = `/${this.state.organization_name}/databaseadmin-history/${countrylist.id}?type=ParticipantCountry`;
                    // console.log("Navigating to:", url);
                    this.props.history.push(url); // Navigate to the new URL
                  }}
                ></Link>
              </Tooltip>
            </div>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { organization_name } = this.props.match.params;
    // Only set state if organization_name is empty
    if (!this.state.organization_name) {
      this.setState({ organization_name });
    }
    const { ListCountry, onGetCountryList } = this.props;
    onGetCountryList(this.state.user_id);
    this.setState({ ListCountry });
  }

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  displaySuccessMessage = message => {
    this.setState({ successMessage: message });

    setTimeout(() => {
      this.setState({ successMessage: "", modal: false });
    }, 3000);
  }

  toggle(country) {
    if (country && country.id) {
      this.setState({
        modal: true,
        selectedCountry: { id: country.id, name: country.name,  added_by: country.added_by },
        isEdit: true,
      });
    } else {
      this.setState({
        modal: true,
        selectedCountry: null,
        isEdit: false,
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { ListCountry } = this.props;
    if (!isEmpty(ListCountry) && size(prevProps.ListCountry) !== size(ListCountry)) {
      this.setState({ ListCountry: {}, isEdit: false });
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
    const { ListCountry } = this.props;
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    // Define fields to export
    const fieldsToExport = ['id', 'name', 'date_of_addition'];

    // Map each row to an object with only the desired fields
    const dataToExport = ListCountry.map(unit => ({
      id: unit.id,
      name: unit.name,
      date_of_addition: moment(unit.date_of_addition).format('DD MMM YYYY, h:mm A'),
    }));

    // Convert data to Excel format and save as file
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    const fileName = 'Unit_list' + fileExtension;
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
          await this.props.onAddNewCountry({
            name: item.name,
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
        setTimeout(() => {
          this.props.onGetCountryList(this.state.user_id);
        }, 1000);
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
    const { ListCountry } = this.props;
    const { onGetCountryList, onUpdateCountry } = this.props;
    const { nameFilter, dateFilter, idFilter } = this.state;

    // Apply the filters to the country list
    const filteredCountry = ListCountry.filter(entry => {
      const name = entry.name ? entry.name.toString().toLowerCase() : "";
      const id = entry.id ? entry.id.toString() : "";
      const date = entry.date_of_addition ? entry.date_of_addition.toString() : "";

      return (
        name.includes(nameFilter.toLowerCase()) &&
        id.includes(idFilter) &&
        date.includes(dateFilter)
      );
    });

    const pageOptions = {
      sizePerPage: 10,
      totalSize: filteredCountry.length,
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];
    const iconStyle = { color: 'red' };

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Country</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Country" breadcrumbItem="Country List" />

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
                      const downloadUrl = process.env.REACT_APP_BACKENDURL + "/media/public/Country.xlsx";
                      saveAs(downloadUrl, "Unit.xlsx"); // Use the file-saver library to trigger the download
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
                        There should be a file of 1 column, name
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
              <Col lg="5">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={filteredCountry}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={filteredCountry}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-4">

                                <Col xl="12">
                                  <Col className="text-end">

                                    <button className="btn btn-primary btn-block mb-4" onClick={() => this.toggle()} style={{ background: "#0000CD" }}>Add New Country</button>

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader toggle={this.closeModal} tag="h4">
                                        {"Add Country"}
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
                                            name: this.state.selectedCountry ? this.state.selectedCountry.name : "",
                                            added_by: this.state.selectedCountry ? this.state.selectedCountry.added_by : "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            name: Yup.string().required("Name is required"),
                                            added_by: Yup.string(),
                                          })}

                                          onSubmit={async (values, { setSubmitting, resetForm }) => {

                                            const userId = localStorage.getItem("authUser")
                                              ? JSON.parse(localStorage.getItem("authUser")).user_id
                                              : "";


                                            const newCountry = {
                                              name: values.name,
                                              added_by: userId,
                                            };

                                            if (this.state.isEdit) {

                                              try {

                                                await this.props.onUpdateCountry(this.state.selectedCountry.id, newCountry);

                                                this.displaySuccessMessage("Country updated successfully!");
                                                setTimeout(() => {
                                                  this.props.onGetCountryList(this.state.user_id);
                                                }, 1000);


                                                // resetForm();
                                              } catch (error) {
                                                // Handle error if any
                                                console.error("Error updating country:", error);
                                              }
                                            } else {

                                              try {

                                                await this.props.onAddNewCountry(newCountry);

                                                this.displaySuccessMessage("Country added successfully!");

                                                setTimeout(() => {
                                                  this.props.onGetCountryList(this.state.user_id);
                                                }, 1000);

                                              } catch (error) {

                                                console.error("Error adding country:", error);
                                              }
                                            }

                                            setSubmitting(false);
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Country Name</Label>
                                                    <Field
                                                      name="name"
                                                      type="text"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage name="name" component="div" className="text-danger" />
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
                                      sort={{ sortCaret: (order, column) => order === 'desc' ? <i className="fa fa-arrow-up" style={iconStyle}></i> : <i className="fa fa-arrow-down" style={iconStyle}></i> }}
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

ParticipantCountry.propTypes = {
  match: PropTypes.object,
  ListCountry: PropTypes.array,
  className: PropTypes.any,
  onGetCountryList: PropTypes.func,
  createCountry: PropTypes.array,
  error: PropTypes.any,
  success: PropTypes.any,
  onAddNewCountry: PropTypes.func,
  onUpdateCountry: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = ({ ListCountry }) => ({
  ListCountry: ListCountry.ListCountry,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetCountryList: (id) => dispatch(getcountrylist(id)),
  onAddNewCountry: (createCountry, id) =>
    dispatch(addNewCountry(createCountry, id)),
  onUpdateCountry: (id, countrylist) => dispatch(updateCountry({ id, ...countrylist })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ParticipantCountry));
