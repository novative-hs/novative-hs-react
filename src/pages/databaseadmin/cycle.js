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
      CycleList: [],
      SchemeList: [],
      cycle: "",
      cycle: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      successMessage: "",
      feedbackListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, cycle) => <>{cycle.id}</>,
          filter: textFilter(),
        },
        {
          dataField: "scheme_name",
          text: "Scheme Name",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "cycle_no",
          text: "Cycle Name / Number",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "cycle",
          text: "Cycle Duration",
          sort: true,
          formatter: (cellContent, cycle) => (
            <>
              {cycle.cycle === "Months" ? (
                <span>Months</span>
              ) : (
                <span>Year</span>
              )}
            </>
          ),
          filter: selectFilter({
            options: {

              'Months': 'Months',
              'Year': 'Year',
            },

          }),
        },
        {
          dataField: "start_date",
          text: "Cycle Start Date",
          sort: true,
          formatter: (cellContent, cycle) => (
            <>
              <span>
                {moment(cycle.start_date).format("DD MMM YYYY, h:mm A")}

              </span>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "end_date",
          text: "Cycle End Date",
          sort: true,
          formatter: (cellContent, cycle) => (
            <>
              <span>
                {moment(cycle.end_date).format("DD MMM YYYY, h:mm A")}

              </span>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "rounds",
          text: "Number of Rounds in Cycle",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "analytes",
          text: "No of Analytes for this Cycle",
          sort: true,
          filter: textFilter(),
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
          filter: selectFilter({
            options: {
              '': 'All',
              'Active': 'Active',
              'Inactive': 'Inactive',
            },
            defaultValue: 'All',
          }),
        },
        {
          dataField: 'link',
          text: '',
          formatter: (cellContent, cycle) => {
            return (
              <Link to={`/add-analytes-cycle-page/${cycle.id}`} style={{ textDecoration: 'underline', color: '#0000CD' }}>

                <span>Add Analytes</span>
              </Link>

            );
          }
        },
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
  toggle(cycle) {
    if (cycle && cycle.id) {
      console.log("data inn toggle", cycle.id, cycle)
      this.setState({
        modal: true,
        selectedCycle: {
          id: cycle.id,
          scheme_name: cycle.scheme_id,
          cycle_no: cycle.cycle_no,
          cycle: cycle.cycle,
          start_date: cycle.start_date
            ? moment(cycle.start_date).format("YYYY-MM-DDTHH:mm")
            : "",
            end_date: cycle.end_date
            ? moment(cycle.end_date).format("YYYY-MM-DDTHH:mm")
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

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   const { CycleList } = this.props;
  //   if (!isEmpty(CycleList) && size(prevProps.CycleList) !== size(CycleList)) {
  //     this.setState({ CycleList: {}, isEdit: false });
  //   }
  // }


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


    const pageOptions = {
      sizePerPage: 10,
      totalSize: CycleList.length,
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
                      data={CycleList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={CycleList}
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
                                            cycle: this.state.selectedCycle ? this.state.selectedCycle.cycle : "Months",
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
                                              cycle: values.cycle,
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
                                                  <div className="mb-3">
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
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Cycle Start Date</Label>
                                                    <Field
                                                      name="start_date"
                                                      type="datetime-local"
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
                                                      type="datetime-local"
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
                                                  {/* <div className="mb-3">
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
  // onGetAnalyte: PropTypes.func,
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
  // onGetAnalyte: id => dispatch(getAnalytelist(id)),
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