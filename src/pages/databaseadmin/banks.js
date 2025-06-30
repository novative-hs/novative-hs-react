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
import { getbanklist, addNewBank, updateBank } from "store/banks/actions";
import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";
import moment from 'moment';

class Banks extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      nameFilter: '',
      dateFilter: '',
      idFilter: '',
      organization_name: "",
      selectedBank: null,
      isEdit: false,
      // ListBank: [],
      accountNumberFilter: '', // ❌ missing
      banklist: "",
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
          text: "Bank",
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
  dataField: "account_number",
  text: "Account Number",
  sort: true,
  style: { textAlign: 'right' },
  headerFormatter: (column, colIndex) => {
    return (
      <>
        <div>
          <input
            type="text"
            value={this.state.accountNumberFilter}
            onChange={e => this.handleFilterChange('accountNumberFilter', e)}
            className="form-control"
          />
        </div>
        <div>{column.text}</div>
      </>
    );
  },
}
,
        // {
        //   text: "Date of Addition",
        //   dataField: "date_of_addition",
        //   sort: true,
        //   hidden: false,
        //   headerFormatter: (column, colIndex) => {
        //     return (
        //       <>
        //         <div>
        //           <input
        //             type="text"
        //             value={this.state.dateFilter}
        //             onChange={e => this.handleFilterChange('dateFilter', e)}
        //             className="form-control"
        //           />
        //         </div>
        //         <div>{column.text}</div>
        //       </>
        //     );
        //   },
        //   formatter: (cellContent, banklist) => (
        //     <>
        //       <span>
        //         {moment(banklist.date_of_addition).format("DD MMM YYYY")}
        //       </span>
        //     </>
        //   ),
        // },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, banklist) => (
            <div>
              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() => this.toggle(banklist)}
                  ></i>
                </Link>
              </Tooltip>
              {/* <Tooltip title="History">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/${this.state.organization_name}/databaseadmin-history/${banklist.id}?type=Bank`}
                  onClick={e => {
                    e.preventDefault();
                    // Check if organization_name is valid
                    if (!this.state.organization_name) {
                      // console.error("Invalid organization name");
                      return; // Prevent navigation if invalid
                    }
                    const url = `/${this.state.organization_name}/databaseadmin-history/${banklist.id}?type=Bank`;
                    // console.log("Navigating to:", url);
                    this.props.history.push(url); // Navigate to the new URL
                  }}
                ></Link>
              </Tooltip> */}
            </div>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

componentDidMount() {
  const { organization_name } = this.props.match.params;
  console.log("📍 Mounted Bank Page for organization:", organization_name);

  if (!this.state.organization_name) {
    this.setState({ organization_name });
    console.log("🏷️ Set organization_name in state:", organization_name);
  }

  const authUser = localStorage.getItem("authUser");
  const parsedUser = authUser ? JSON.parse(authUser) : null;
  const user_id = parsedUser?.user_id;

  console.log("👤 Parsed user_id from localStorage:", user_id);

  if (user_id) {
    this.setState({ user_id });
    console.log("📨 Dispatching getBankList with user_id:", user_id);
    this.props.onGetBankList(user_id);
  } else {
    console.warn("⚠️ No valid user_id found in localStorage.");
  }
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

toggle(bank) {
  if (bank && bank.id) {
    this.setState({
      modal: true,
      selectedBank: {
        id: bank.id,
        name: bank.name,
        added_by: bank.added_by,
        account_number: bank.account_number, // ✅ Add this
      },
      isEdit: true,
    });
  } else {
    this.setState({
      modal: true,
      selectedBank: null,
      isEdit: false,
    });
  }
}

componentDidUpdate(prevProps) {
  const { ListBank } = this.props;
  if (ListBank !== prevProps.ListBank) {
    console.log("📦 ListBank updated:", ListBank);
    this.setState({ isEdit: false }); // fine to reset edit state
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
    const { ListBank } = this.props;
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    // Define fields to export
    const fieldsToExport = ['id', 'name', 'date_of_addition'];

    // Map each row to an object with only the desired fields
    const dataToExport = ListBank.map(unit => ({
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
          await this.props.onAddNewBank({
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
          this.props.onGetBankList(this.state.user_id);
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
    const { ListBank } = this.props;
    const { onGetBankList, onUpdateBank } = this.props;
    const { nameFilter, dateFilter, idFilter , accountNumberFilter} = this.state;
    // ✅ Add this log block here:
console.log("📥 Raw ListBank:", ListBank);
console.log("🔍 Filters:", {
  nameFilter,
  idFilter,
  dateFilter,
  accountNumberFilter,
});

    const filteredBank = ListBank.filter(entry => {
  const name = entry.name?.toString().toLowerCase() || "";
  const id = entry.id?.toString() || "";
  const date = entry.date_of_addition?.toString() || "";
  const account = entry.account_number?.toString().toLowerCase() || "";

  return (
    name.includes(nameFilter.toLowerCase()) &&
    id.includes(idFilter) &&
    date.includes(dateFilter) &&
    account.includes(accountNumberFilter.toLowerCase())
  );
});


    const pageOptions = {
      sizePerPage: 10,
      totalSize: filteredBank.length,
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];
    const iconStyle = { color: 'red' };
    console.log("✅ ListBank from Redux:", this.props.ListBank);
console.log("🔍 Filtered data for table:", filteredBank);
console.log("📊 Columns:", this.state.feedbackListColumns);


    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Bank</title>
          </MetaTags>
          <Container fluid>
          <Breadcrumbs title="Bank" breadcrumbItem="Bank List" />

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
                      const downloadUrl = process.env.REACT_APP_BACKENDURL + "/media/public/Bank.xlsx";
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
                      data={filteredBank}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={filteredBank}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-8">

                                <Col xl="12">
                                  <Col className="text-end">

                                    <button className="btn btn-primary btn-block mb-4" onClick={() => this.toggle()} style={{ background: "#0000CD" }}>Add New Bank</button>

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader toggle={this.closeModal} tag="h4">
  {this.state.isEdit ? "Update Bank" : "Add Bank"}
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
                                            name: this.state.selectedBank ? this.state.selectedBank.name : "",
                                            added_by: this.state.selectedBank ? this.state.selectedBank.added_by : "",
                                            account_number: this.state.selectedBank ? this.state.selectedBank.account_number : "", // ✅ New field
                                          }}
                                          validationSchema={Yup.object().shape({
                                            name: Yup.string().required("Name is required"),
                                            added_by: Yup.string(),
                                            account_number: Yup.string()
  .matches(/^[A-Z0-9]+$/, "Account number must contain only uppercase letters and digits")
  .required("Account number is required"),
                                          })}

                                          onSubmit={async (values, { setSubmitting, resetForm }) => {

                                            const userId = localStorage.getItem("authUser")
                                              ? JSON.parse(localStorage.getItem("authUser")).user_id
                                              : "";


                                            const newBank = {
                                              name: values.name,
                                              added_by: userId,
                                              account_number: values.account_number, // ✅ Include in submission
                                            };

                                            if (this.state.isEdit) {

                                              try {

                                                await this.props.onUpdateBank(this.state.selectedBank.id, newBank);

                                                this.displaySuccessMessage("Bank updated successfully!");
                                                setTimeout(() => {
                                                  this.props.onGetBankList(this.state.user_id);
                                                }, 1000);


                                                // resetForm();
                                              } catch (error) {
                                                // Handle error if any
                                                console.error("Error updating bank:", error);
                                              }
                                            } else {

                                              try {

                                                await this.props.onAddNewBank(newBank, this.state.user_id); 


                                                this.displaySuccessMessage("Bank added successfully!");

                                                setTimeout(() => {
                                                  this.props.onGetBankList(this.state.user_id);
                                                }, 1000);

                                              } catch (error) {

                                                console.error("Error adding bank:", error);
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
                                                    <Label className="col-form-label">Bank Name</Label>
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
  <Col className="col-12">
    <div className="mb-3">
      <Label className="col-form-label">Account Number</Label>
      <Field
        name="account_number"
        type="text"
        className="form-control"
      />
      <ErrorMessage name="account_number" component="div" className="text-danger" />
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
                                  <div className="table-responsive" style={{ width: "100%" }}>


                                    <BootstrapTable
  keyField="id"
  data={filteredBank}  // ✅ match ToolkitProvider/PaginationProvider
  columns={this.state.feedbackListColumns}
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
  sort={{
    sortCaret: (order, column) =>
      order === 'desc' ? (
        <i className="fa fa-arrow-up" style={iconStyle}></i>
      ) : (
        <i className="fa fa-arrow-down" style={iconStyle}></i>
      ),
  }}
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

Banks.propTypes = {
  match: PropTypes.object,
  ListBank: PropTypes.array,
  className: PropTypes.any,
  onGetBankList: PropTypes.func,
  createBank: PropTypes.array,
  error: PropTypes.any,
  success: PropTypes.any,
  onAddNewBank: PropTypes.func,
  onUpdateBank: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  ListBank: state.banks?.ListBank || [],
});



const mapDispatchToProps = (dispatch) => ({
  onGetBankList: (id) => dispatch(getbanklist(id)),
  onAddNewBank: (payload) => dispatch(addNewBank(payload)), // ✅ accepts full object
  onUpdateBank: (id, banklist) => dispatch(updateBank({ id, ...banklist })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Banks));
