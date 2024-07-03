import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
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
} from "reactstrap";


import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getInstrumentlist, addNewInstrument, updateInstrument } from "store/instrument/actions";
import {getManufacturalList} from "store/manufactural/actions";
import {getinstrumenttypelist} from "store/databaseofunits/actions"
import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";
import moment from 'moment';
class Instrument extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      selectedUnit: null,
      nameFilter: '',
      dateFilter: '',
      instypeFilter: '',
      manufacturerFilter:'',
      codeFilter: '',
      statusFilter:'',
      idFilter: '',
      isEdit: false,
      Instrument: [],
      ListUnit:[],
      ManufacturalList: [],
      methodlist: "",
      modal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      successMessage: "",
      feedbackListColumns: [
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
          headerStyle: { width: '100px' },  // Adjust the width as needed
  style: { width: '100px' },  // Adjust the width as needed
        },
        {
          dataField: "name",
          text: "Equipment",
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
          dataField: "instrument_type",
          text: "Equipment Type",
          sort: true,
          //style: { textAlign: 'right' },
          headerFormatter: (column, colIndex) => {
            return (
              <>
              <div>
              
                <input
                  type="text"
                  value={this.state.instypeFilter}
                  onChange={e => this.handleFilterChange('instypeFilter', e)}
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
          formatter: (cellContent, methodlist) => (
            <div>
              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() => this.toggle(methodlist)}
                  // onClick={e => this.handleCSRClick(e, CSR)}
                  ></i>
                </Link>
              </Tooltip>
              <Tooltip title="History">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/units-history/${methodlist.id}`}
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
    const { Instrument, onGetInstrumentList } = this.props;
    onGetInstrumentList(this.state.user_id);
    this.setState({ Instrument });

    
    const { ManufacturalList, onGetManufacturalist } = this.props;
    onGetManufacturalist(this.state.user_id);
    this.setState({ ManufacturalList });
    
    
    const { ListUnit, onGetInstrumentTypeList } = this.props;
    onGetInstrumentTypeList(this.state.user_id);
    this.setState({ ListUnit });
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
  toggle(unit) {
    if (unit && unit.id) {
      console.log("Toggle - Unit:", unit.instrument_type,unit.manufactural);
      this.setState({
        modal: true,
        selectedUnit: { 
          id: unit.id, 
          name: unit.name, 
          added_by: unit.added_by ,
          code: unit.code, 
          status: unit.status,
          instrument_type: unit.instrument_type, // Access the value property
          manufactural: unit.manufactural // Access the value property
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
    const { Instrument } = this.props;
    if (!isEmpty(Instrument) && size(prevProps.Instrument) !== size(Instrument)) {
      this.setState({ Instrument: {}, isEdit: false });
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
  render() {
    const { SearchBar } = Search;

    const { Instrument } = this.props;

    const { onGetInstrumentList, onUpdateType } = this.props;
    const methodlist = this.state.Instrument;


    const { nameFilter, dateFilter, idFilter,codeFilter,instypeFilter,manufacturerFilter,statusFilter } = this.state;

    // Apply the filters to the unit list
    const filteredUnits = Instrument.filter(entry => {
      const name = entry.name ? entry.name.toString().toLowerCase() : "";
      const status = entry.status ? entry.status.toString(): "";
      const code = entry.code ? entry.code.toString() : "";
      const instrument_type = entry.instrument_type ? entry.instrument_type.toString().toLowerCase() : "";
      const manufactural = entry.manufactural ? entry.manufactural.toString().toLowerCase() : "";
      const id = entry.id ? entry.id.toString() : "";
      const date = entry.date_of_addition ? entry.date_of_addition.toString() : "";

      return (
        name.includes(nameFilter.toLowerCase()) &&
        instrument_type.includes(instypeFilter.toLowerCase()) &&
        code.includes(codeFilter) &&
        status.includes(statusFilter) &&
        manufactural.includes(manufacturerFilter.toLowerCase()) &&
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
    
    const ListUnit = [];
    for (let i = 0; i < this.props.ListUnit.length; i++) {
      ListUnit.push({
        label: this.props.ListUnit[i].name,
        value: this.props.ListUnit[i].id,
      });
    }
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Equipment List</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="List" breadcrumbItem="Equipment List" />
            <Row className="justify-content-center">
              <Col lg="10">
                <Card>
                  <CardBody>
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

                                    <button className="btn btn-primary btn-block mb-4" onClick={() => this.toggle()} style={{ background: "#0000CD" }}>Add New Equipment</button>

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader toggle={this.closeModal} tag="h4">
                                        {"Equipment"}
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
    instrument_type: this.state.selectedUnit ? this.state.selectedUnit.instrument_type : "", // Assign selected instrument_type
    manufactural: this.state.selectedUnit ? this.state.selectedUnit.manufactural : "", // Assign selected manufactural
  }}
  validationSchema={Yup.object().shape({
    name: Yup.string().required("Name is required"),
    code: Yup.string()
      .required("Code is required")
      .matches(/^[0-9]+$/, "Code must be a number"),
    instrument_type: Yup.mixed().required("Equipment Type is required").nullable(),
    manufactural: Yup.mixed().required("Manufactural is required").nullable(),
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
        instrument_type: values.instrument_type,
        manufactural: values.manufactural,     
      };
      

    try {
      if (this.state.isEdit) {
        await this.props.onUpdateType(this.state.selectedUnit.id, newUnit);
        this.displaySuccessMessage("Equipment updated successfully!");
      } else {
        await this.props.onAddNewType(newUnit);
        this.displaySuccessMessage("Equipment added successfully!");
      }

      await this.props.onGetInstrumentList(this.state.user_id);
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
            <Label className="col-form-label">Equipment Name</Label>
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
  <Label className="col-form-label">Equipment Type</Label>
  <Field
    name="instrument_type" // Ensure the name matches the field name
    as="select"
    className="form-control"
    multiple={false}
  >
    <option value="">Select Equipment Type</option> 
    {ListUnit.map(instrument_type => (
      <option key={instrument_type.value} value={instrument_type.value}>
        {instrument_type.label}
      </option>
    ))}
  </Field>
  <ErrorMessage name="instrument_type" component="div" className="text-danger" />
</div>
<div className="mb-3">
  <Label className="col-form-label">Manufacturals</Label>
  <Field
    name="manufactural" // Ensure the name matches the field name
    as="select"
    className="form-control"
    multiple={false}
    // value={console.log("fhvueffefu",value.manufactural)}
  >
    <option value="">Select Manufactural</option> 
    {ManufacturalList.map(manufactural => (
      <option key={manufactural.value} value={manufactural.value}>
        {manufactural.label}
      </option>
    ))}
  </Field>
  <ErrorMessage name="manufactural" component="div" className="text-danger" />
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

Instrument.propTypes = {
  match: PropTypes.object,
  Instrument: PropTypes.array,
  ManufacturalList: PropTypes.array,
  ListUnit: PropTypes.array,
  className: PropTypes.any,
  onGetInstrumentList: PropTypes.func,
  onGetManufacturalist: PropTypes.func,
  onGetInstrumentTypeList: PropTypes.func,
  createInstrumentType: PropTypes.array,
  error: PropTypes.any,
  success: PropTypes.any,
  onAddNewType: PropTypes.func,
  onUpdateType: PropTypes.func,
};

const mapStateToProps = ({ Instrument,ManufacturalList,ListUnit }) => ({
  ListUnit:ListUnit.ListUnit,
  Instrument: Instrument.Instrument,
  ManufacturalList: ManufacturalList.ManufacturalList,

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetInstrumentList: (id) => dispatch(getInstrumentlist(id)),
  onGetManufacturalist: (id) => dispatch(getManufacturalList(id)),
  
  onGetInstrumentTypeList: (id) => dispatch(getinstrumenttypelist(id)),

  onAddNewType: (createInstrumentType, id) =>
    dispatch(addNewInstrument(createInstrumentType, id)),
  onUpdateType: (id, methodlist) => dispatch(updateInstrument({ id, ...methodlist })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Instrument));