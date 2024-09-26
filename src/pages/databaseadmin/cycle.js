import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
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
import {
  getcyclelist,
  addNewCycleList,
  updateCycleList,
  deleteCycle
} from "store/cycle/actions";
import { getSchemelist } from "store/scheme/actions";
import { getAnalytelist } from "store/databaseofunits/actions";
import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";
import moment from 'moment';
import DeleteModal from "components/Common/DeleteModal";
import ListUnit from "store/databaseofunits/reducer";
class InstrumentType extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      selectedCycle: null,
      isEdit: false,
      organization_name: '',
      idFilter: '',
      schemenameFilter: '',
      cyclenoFilter: '',
      cycleFilter: '',
      startdateFilter: '',
      enddateFilter: '',
      roundsFilter: '',
      noofanalytesFilter: '',
      statusFilter: '',

      CycleList: [],
      SchemeList: [],
      cycle: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      successMessage: "",
      feedbackListColumns: [
        {
          text: "ID",
          dataField: "id",
          sort: true,
          hidden: false,
          formatter: (cellContent, cycle) => <>{cycle.id}</>,
          // filter: textFilter(),
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
          dataField: "scheme_name",
          text: "Scheme Name",
          sort: true,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>

                  <input
                    type="text"
                    value={this.state.schemenameFilter}
                    onChange={e => this.handleFilterChange('schemenameFilter', e)}
                    className="form-control"

                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
        },
        {
          dataField: "cycle_no",
          text: "Cycle Name / Number",
          sort: true,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.cyclenoFilter}
                    onChange={e => this.handleFilterChange('cyclenoFilter', e)}
                    className="form-control"

                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
        },
        {
          dataField: "cycle",
          text: "Cycle Duration",
          sort: true,
          formatter: (cellContent, cycle) => (
            <>
              {cycle.cycle}
            </>
          ),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.cycleFilter}
                    onChange={e => this.handleFilterChange('cycleFilter', e)}
                    className="form-control"

                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
        },
        {
          dataField: "start_date",
          text: "Cycle Start Date",
          sort: true,
          formatter: (cellContent, cycle) => (
            <>
              <span>
                {moment(cycle.start_date).format("DD MMM YYYY")}

              </span>
            </>),
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>

                  <input
                    type="text"
                    value={this.state.startdateFilter}
                    onChange={e => this.handleFilterChange('startdateFilter', e)}
                    className="form-control"

                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
        },
        {
          dataField: "end_date",
          text: "Cycle End Date",
          sort: true,
          formatter: (cellContent, cycle) => (
            <>
              <span>
                {moment(cycle.end_date).format("DD MMM YYYY")}

              </span>
            </>),
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>

                  <input
                    type="text"
                    value={this.state.enddateFilter}
                    onChange={e => this.handleFilterChange('enddateFilter', e)}
                    className="form-control"

                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
        },
        {
          dataField: "rounds",
          text: "Number of Rounds in Cycle",
          sort: true,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>

                  <input
                    type="text"
                    value={this.state.roundsFilter}
                    onChange={e => this.handleFilterChange('roundsFilter', e)}
                    className="form-control"

                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
        },
        {
          dataField: "noofanalytes",
          text: "No of Analytes for this Cycle",
          sort: true,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>

                  <input
                    type="text"
                    value={this.state.noofanalytesFilter}
                    onChange={e => this.handleFilterChange('noofanalytesFilter', e)}
                    className="form-control"

                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
          formatter: (cellContent, unitlist) => {
            const { organization_name } = this.state;
            return (
              <div>
                <Link
                  to={`/${organization_name}/cycle-analyte/${unitlist.scheme_id}`}
                  style={{ textDecoration: 'underline', color: '#0000CD', display: 'block', marginTop: '5px' }}
                >
                  {unitlist.noofanalytes}
                </Link>
              </div>
            );
          }
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
          formatter: (cellContent, cycle) => (
            <>
              {cycle.status === "Active" ? (
                <span>Active</span>
              ) : (
                <span>Inactive</span>
              )}
            </>
          ),
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
        // {
        //   dataField: 'link',
        //   text: '',
        //   formatter: (cellContent, cycle) => {
        //     return (
        //       <Link to={`/add-analytes-cycle-page/${cycle.id}`} style={{ textDecoration: 'underline', color: '#0000CD' }}>

        //         <span>Add Analytes</span>
        //       </Link>

        //     );
        //   }
        // },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, cycle) => (
            <div className="d-flex gap-3 ml-3">
              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() => this.toggle(cycle)}
                  // onClick={e => this.handleCycleClick(e, cycle)}
                  ></i>
                </Link></Tooltip>

              <Tooltip title="Delete">
                <Link className="text-danger" to="#">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(cycle)}
                  ></i>
                </Link></Tooltip>
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
    this.setState({ organization_name });

    const { ListUnit, onGetgetschemelist, onGetInstrumentTypeList } = this.props;
    const userId = this.state.user_id;

    this.setState({ ListUnit, CycleList: this.props.CycleList });
    onGetgetschemelist(userId);
    onGetInstrumentTypeList(this.state.user_id);
  }

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  handleDeleteCycle = () => {
    const { onDeleteCycle, onGetInstrumentTypeList } = this.props;
    const { CycleList } = this.state;
    if (CycleList.id !== undefined) {
      onDeleteCycle(CycleList);
      setTimeout(() => {
        onGetInstrumentTypeList(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  onClickDelete = CycleList => {
    this.setState({ CycleList: CycleList });
    this.setState({ deleteModal: true });
  };

  displaySuccessMessage = message => {
    this.setState({ successMessage: message });

    setTimeout(() => {
      this.setState({ successMessage: "", modal: false });
    }, 3000);
  }


  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  toggle(cycle) {
    if (cycle && cycle.id) {
      console.log("data inn toggle", cycle.id, cycle)
      console.log("data inn toggle", cycle.id, cycle)
      this.setState({
        modal: true,
        selectedCycle: {
          id: cycle.id,
          scheme_name: cycle.scheme_id,
          scheme_name: cycle.scheme_id,
          cycle_no: cycle.cycle_no,
          // cycle: cycle.cycle,
          start_date: cycle.start_date
            ? moment(cycle.start_date).format("YYYY-MM-DD")
            : "",
            end_date: cycle.end_date
            ? moment(cycle.end_date).format("YYYY-MM-DD")
            : "",
          rounds: cycle.rounds,
          analytes: cycle.analytes,
          status: cycle.status,
          added_by: cycle.added_by,
        },
        isEdit: true,
      });
    } else {
      this.setState({
        modal: true,
        selectedCycle: null,
        isEdit: false,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEmpty(this.props.SchemeList) && size(prevProps.SchemeList) !== size(this.props.SchemeList)) {
      this.setState({ SchemeList: this.props.SchemeList });
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
  const ListUnit = this.props.ListUnit.map(cycle => ({
    label: cycle.name,
    value: cycle.id,
  }));
  const { CycleList, SchemeList } = this.props;
  const { isEdit, deleteModal } = this.state;
  const { onGetInstrumentTypeList, onUpdateType, onGetgetschemelist, onAddNewType } = this.props;
  const cycle = this.state.CycleList;
  
  const { idFilter, schemenameFilter, cyclenoFilter, cycleFilter, startdateFilter, enddateFilter, roundsFilter, noofanalytesFilter, statusFilter } = this.state;

  const filteredData = CycleList.filter(entry => {   
    // Modify accordingly for each filter condition
    const id = entry.id ? entry.id.toString() : "";
    const scheme_name = entry.scheme_name ? entry.scheme_name.toString().toLowerCase() : "";
    const cycle_no = entry.cycle_no ? entry.cycle_no.toString().toLowerCase() : "";
    const cycle = entry.cycle ? entry.cycle.toString() : "";
    const start_date = entry.start_date ? entry.start_date.toString() : "";
    const end_date = entry.end_date ? entry.end_date.toString() : "";
    const rounds = entry.rounds ? entry.rounds.toString() : "";
    const analytes = entry.analytes ? entry.analytes.toString() : "";
    const status = entry.status ? entry.status.toString() : "";
    
    return (
      id.includes(idFilter) &&
      scheme_name.includes(schemenameFilter.toLowerCase()) &&
      cycle_no.includes(cyclenoFilter.toLowerCase()) &&
      cycle.includes(cycleFilter) &&
      start_date.includes(startdateFilter) &&
      end_date.includes(enddateFilter) &&
      rounds.includes(roundsFilter) &&
      analytes.includes(noofanalytesFilter) &&
      status.includes(statusFilter)
    );
  });


  const pageOptions = {
    sizePerPage: 10,
    // totalSize: CycleList.length,
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
        onDeleteClick={this.handleDeleteCycle}
        onCloseClick={() => this.setState({ deleteModal: false })}
      />
      <div className="page-content">
        <MetaTags>
          <title>Database Admin | Cycle List</title>
        </MetaTags>
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="List" breadcrumbItem="Cycle List" />
          <Row className="justify-content-center">
            <Col lg="10">
              <Card>
                <CardBody>
                  <PaginationProvider
                    pagination={paginationFactory(pageOptions)}
                    keyField="id"
                    columns={this.state.feedbackListColumns}
                    data={filteredData}
                  >
                    {({ paginationProps, paginationTableProps }) => (
                      <ToolkitProvider
                        keyField="id"
                        columns={this.state.feedbackListColumns}
                        data={filteredData}
                        search
                      >

                        {toolkitprops => (
                          <React.Fragment>
                            <Row className="mb-4">

                              <Col xl="12">
                                <Col className="text-end">

                                    <button className="btn btn-primary btn-block mb-4" onClick={() => this.toggle()} style={{ background: "#0000CD" }}>Add New Cycle</button>
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader toggle={this.closeModal} tag="h4">
                                        {"Create New Cycle"}
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
                                            scheme_name: this.state.selectedCycle ? this.state.selectedCycle.scheme_name : "",
                                            cycle_no: this.state.selectedCycle ? this.state.selectedCycle.cycle_no : "",
                                            rounds: this.state.selectedCycle ? this.state.selectedCycle.rounds : "",
                                            analytes: this.state.selectedAnalytes,
                                            status: this.state.selectedCycle ? this.state.selectedCycle.status : "Active",
                                            // cycle: this.state.selectedCycle ? this.state.selectedCycle.cycle : "Months",
                                            start_date: this.state.selectedCycle ? this.state.selectedCycle.start_date : "",
                                            end_date: this.state.selectedCycle ? this.state.selectedCycle.end_date : "",
                                      
                                          }}
                                          // validationSchema={Yup.object().shape({
                                          //   scheme_name: Yup.string().required("Name is required"),
                                          //   rounds: Yup.string().required("Select the number of rounds"),
                                          //   cycle_no: Yup.string()
                                          //     .required("Cycle number is required")
                                          //     .matches(/^[0-9]+$/, "It must be a number"),
                                          //   start_date: Yup.string().required("Start Date is required"),
                                          //   end_date: Yup.string().required("End Date is required"),
                                          // })}
                                          onSubmit={async (values, { setSubmitting }) => {
                                            const userId = localStorage.getItem("authUser")
                                                ? JSON.parse(localStorage.getItem("authUser")).user_id
                                                : "";
                                        
                                            const newround = {
                                              scheme_name: values.scheme_name,
                                              cycle_no: values.cycle_no,
                                              // cycle: values.cycle,
                                              start_date: values.start_date,
                                              end_date: values.end_date,
                                              rounds: values.rounds,
                                              status: values.status,
                                              added_by: userId,
                                            };
                                        
                                            try {
                                                if (this.state.isEdit) {
                                                    await this.props.onUpdateType(this.state.selectedCycle.id, newround);
                                                    this.displaySuccessMessage("Cycle updated successfully!");
                                                } else {
                                                    await this.props.onAddNewType(newround);
                                                    this.displaySuccessMessage("Cycle added successfully!");
                                                }
                                        
                                                // Refetch data and update local state
                                                const updatedData = await this.props.onGetInstrumentTypeList(this.state.user_id);
                                                this.setState({ CycleList: updatedData });
                                        
                                            } catch (error) {
                                                console.error("Error updating/adding rounds:", error);
                                            }
                                        
                                            setSubmitting(false);
                                        }}
                                          
                                        >
                                          {({ errors, touched, values, setFieldValue }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">

                                                <div className="mb-3">
                                                    <Label for="scheme_name">Scheme</Label>
                                                    <Field
                                                      as="select"
                                                      name="scheme_name"
                                                      className={"form-control" + (errors.scheme && touched.scheme ? " is-invalid" : "")}
                                                    >
                                                      <option value="">Select Scheme</option>
                                                      {SchemeList && SchemeList.filter(scheme => scheme.status === 'Active').map((scheme) =>  (
                                                        <option key={scheme.id} value={scheme.id}>
                                                          {scheme.name} {/* Display scheme_name */}
                                                        </option>
                                                      ))}
                                                    </Field>
                                                    <ErrorMessage name="scheme_name" component="div" className="invalid-feedback" />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Cycle Name / Number</Label>
                                                    <Field
                                                      name="cycle_no"
                                                      type="text"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage name="cycle_no" component="div" className="text-danger" />
                                                  </div>
                                                  {/* <div className="mb-3">
                                                    <Label className="col-form-label">Cycle Duration</Label>
                                                    <Field
                                                      name="cycle"
                                                      as="select"
                                                      defaultValue="Months"
                                                      className="form-control"
                                                      multiple={false}
                                                    >
                                                      <option value="Months">Months</option>
                                                      <option value="Year">Year</option>
                                                    </Field>
                                                    <ErrorMessage name="cycle" component="div" className="text-danger" />
                                                  </div> */}
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Cycle Start Date</Label>
                                                    <Field
                                                      name="start_date"
                                                      type="date"
                                                      id="start_date"
                                                      className={
                                                        "form-control" +
                                                        (errors.start_date && touched.start_date
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="start_date"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Cycle End Date</Label>
                                                    <Field
                                                      name="end_date"
                                                      type="date"
                                                      id="end_date"
                                                      className={
                                                        "form-control" +
                                                        (errors.end_date && touched.end_date
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="end_date"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Number of Rounds in cycle</Label>
                                                    <Field
                                                      name="rounds"
                                                      type="number"
                                                      min={0}
                                                      max={36}
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage name="rounds" component="div" className="text-danger" />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Status
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field as="select" name="status" className={`form-control ${errors.status && touched.status ? "is-invalid" : ""
                                                      }`}>
                                                      <option value="">----- Please select -----</option>
                                                      <option value="Active">Active</option>
                                                      <option value="Inactive">Inactive</option>
                                                    </Field>
                                                    <ErrorMessage name="status" component="div" className="invalid-feedback" />
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

InstrumentType.propTypes = {
  ListUnit: PropTypes.array,
  match: PropTypes.object,
  CycleList: PropTypes.array,
  SchemeList: PropTypes.array,
  className: PropTypes.any,
  onGetInstrumentTypeList: PropTypes.func,
  createInstrumentType: PropTypes.array,
  error: PropTypes.any,
  onGetgetschemelist: PropTypes.func,
  success: PropTypes.any,
  onAddNewType: PropTypes.func,
  onUpdateType: PropTypes.func,
  onDeleteCycle: PropTypes.func,
};

const mapStateToProps = ({ CycleList, ListUnit, SchemeList }) => ({
CycleList: CycleList.CycleList,
SchemeList: SchemeList.SchemeList,
ListUnit: ListUnit.ListUnit,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetgetschemelist: id => dispatch(getSchemelist(id)),
  onGetInstrumentTypeList: (id) => dispatch(getcyclelist(id)),
  onAddNewType: (id, createUnit) => dispatch(addNewCycleList(id, createUnit)),
  onUpdateType: (id, cycle) => dispatch(updateCycleList({ id, ...cycle })),
  onDeleteCycle: cycle => dispatch(deleteCycle(cycle)),
});

export default connect(
mapStateToProps,
mapDispatchToProps
)(withRouter(InstrumentType));