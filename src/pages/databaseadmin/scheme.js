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
import { getschemelist, addNewSchemeList, updateSchemeList } from "store/scheme/actions";
import { getAnalytelist } from "store/databaseofunits/actions";
import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";
import moment from 'moment';
import ListUnit from "store/databaseofunits/reducer";
class InstrumentType extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      selectedUnit: null,
      isEdit: false,
      SchemeList: [],
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
          hidden: true,
          formatter: (cellContent, methodlist) => <>{methodlist.id}</>,
          filter: textFilter(),
        },
        // {
        //   dataField: "id",
        //   text: "ID",
        //   sort: true,
        //   filter: textFilter(),
        // },
        {
          dataField: "scheme_name",
          text: "Scheme name",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "cycle_no",
          text: "Cycle no.",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "cycle",
          text: "Cycle",
          sort: true,
          formatter: (cellContent, methodlist) => (
            <>
              {methodlist.cycle === "Months" ? (
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
          dataField: "rounds",
          text: "Rounds",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "start_date",
          text: "Start Date",
          sort: true,
          formatter: (cellContent, methodlist) => (
            <>
              <span>
                {moment(methodlist.start_date).format("DD MMM YYYY, h:mm A")}

              </span>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "end_date",
          text: "End Date",
          sort: true,
          formatter: (cellContent, methodlist) => (
            <>
              <span>
                {moment(methodlist.end_date).format("DD MMM YYYY, h:mm A")}

              </span>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "analytes",
          text: "Analytes",
          sort: true,
          formatter: (cellContent, methodlist) => (
            <>{methodlist.analytes.join(", ")}</>
          ),
          filter: textFilter(),
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
          formatter: (cellContent, methodlist) => (
            <>
              {methodlist.status === "Active" ? (
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
      ],
    };
    this.toggle = this.toggle.bind(this);
  }



  // componentDidMount() {
  //   const { ListUnit, onGetAnalyte } = this.props;
  //   onGetAnalyte(this.state.user_id);
  //   this.setState({ ListUnit });
  //   const { SchemeList, onGetInstrumentTypeList } = this.props;
  //   onGetInstrumentTypeList(this.state.user_id);
  //   this.setState({ SchemeList });
  // }
  componentDidMount() {
    const { ListUnit, onGetAnalyte, onGetInstrumentTypeList } = this.props;
    onGetAnalyte(this.state.user_id);
    this.setState({ ListUnit, SchemeList: this.props.SchemeList });
    onGetInstrumentTypeList(this.state.user_id);
  }

  displaySuccessMessage = message => {
    this.setState({ successMessage: message });

    setTimeout(() => {
      this.setState({ successMessage: "", modal: false });
    }, 3000);
  }
  toggle(unit) {
    if (unit && unit.id) {

      this.setState({
        modal: true,
        selectedUnit: {
          id: unit.id,
          name: unit.name,
          added_by: unit.added_by,
          code: unit.code,
          analytes: unit.analytes,
          status: unit.status,
          cycle: unit.cycle,
          scheme_name: unit.scheme_name,
          cycle_no: unit.cycle_no,
          rounds: unit.rounds,
          start_date: unit.start_date
            ? moment(unit.start_date).format("YYYY-MM-DDTHH:mm")
            : "",
          end_date: unit.end_date
            ? moment(unit.end_date).format("YYYY-MM-DDTHH:mm")
            : "",
        },
        isEdit: true,
        selectedAnalytes: unit.analytes.map(analyte => ({ label: analyte.name, value: analyte.id })),
      });
    } else {

      this.setState({
        modal: true,
        selectedUnit: null,
        selectedAnalytes: [],
        isEdit: false,
      });
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { SchemeList } = this.props;
    if (!isEmpty(SchemeList) && size(prevProps.SchemeList) !== size(SchemeList)) {
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
  closeModal = () => {
    this.setState({ modal: false });
  }
  render() {
    const { SearchBar } = Search;
    const ListUnit = this.props.ListUnit.map(unit => ({
      label: unit.name,
      value: unit.id,
    }));
    const { SchemeList } = this.props;

    const { onGetInstrumentTypeList, onUpdateType, onGetAnalyte } = this.props;
    const methodlist = this.state.SchemeList;


    const pageOptions = {
      sizePerPage: 10,
      totalSize: SchemeList.length,
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
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Scheme List</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="List" breadcrumbItem="Scheme List" />
            <Row className="justify-content-center">
              <Col lg="10">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={SchemeList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={SchemeList}
                          search
                        >

                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-4">

                                <Col xl="12">
                                  <Col className="text-end">

                                    <button className="btn btn-primary btn-block mb-4" onClick={() => this.toggle()} style={{ background: "#0000CD" }}>Add New Scheme</button>
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader toggle={this.closeModal} tag="h4">
                                        {"Scheme Form"}
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
    scheme_name: this.state.selectedUnit ? this.state.selectedUnit.scheme_name : "",
    cycle_no: this.state.selectedUnit ? this.state.selectedUnit.cycle_no : "",
    rounds: this.state.selectedUnit ? this.state.selectedUnit.rounds : "",
    analytes: this.state.selectedAnalytes,
    status: this.state.selectedUnit ? this.state.selectedUnit.status : "Active",
    cycle: this.state.selectedUnit ? this.state.selectedUnit.cycle : "Months",
    start_date: this.state.selectedUnit ? this.state.selectedUnit.start_date : "",
    end_date: this.state.selectedUnit ? this.state.selectedUnit.end_date : "",
    organization_id: this.state.selectedUnit ? this.state.selectedUnit.organization_id : "",
  }}
  validationSchema={Yup.object().shape({
    scheme_name: Yup.string().required("Name is required"),
    rounds: Yup.string().required("Select the number of rounds"),
    cycle_no: Yup.string()
      .required("Cycle number is required")
      .matches(/^[0-9]+$/, "It must be a number"),
    start_date: Yup.string().required("Start Date is required"),
    end_date: Yup.string().required("End Date is required"),
  })}
  onSubmit={async (values, { setSubmitting }) => {
    const userId = localStorage.getItem("authUser")
      ? JSON.parse(localStorage.getItem("authUser")).user_id
      : "";
    console.log("Submitted values:", values);

    const newUnit = {
      scheme_name: values.scheme_name,
      rounds: values.rounds,
      cycle_no: values.cycle_no,
      start_date: values.start_date,
      end_date: values.end_date,
      analytes: values.analytes.map(analyte => analyte.value),
      status: values.status,
      cycle: values.cycle,
      added_by: userId,
    };

    try {
      if (this.state.isEdit) {
        await this.props.onUpdateType(this.state.selectedUnit.id, newUnit);
        this.displaySuccessMessage("Scheme updated successfully!");
      } else {
        await this.props.onAddNewType(newUnit);
        this.displaySuccessMessage("Scheme added successfully!");
      }

      await this.props.onGetInstrumentTypeList(this.state.user_id);
    } catch (error) {
      console.error("Error updating/adding schemes:", error);
    }

    setSubmitting(false);
  }}
>
  {({ errors, touched, values, setFieldValue }) => (
    <Form>
      <Row>
        <Col className="col-12">
          <div className="mb-3">
            <Label className="col-form-label">Scheme name</Label>
            <Field
              name="scheme_name"
              type="text"
              className="form-control"
            />
            <ErrorMessage name="scheme_name" component="div" className="text-danger" />
          </div>
          <div className="mb-3">
            <Label className="col-form-label">Cycle no.</Label>
            <Field
              name="cycle_no"
              type="number"
              min={0}
              max={36}
              className="form-control"
            />
            <ErrorMessage name="cycle_no" component="div" className="text-danger" />
          </div>
          <div className="mb-3">
            <Label className="col-form-label">Cycle</Label>
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
            <Label className="col-form-label">Rounds</Label>
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
            <Label className="col-form-label">Start Date</Label>
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
            <Label className="col-form-label">End Date</Label>
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
            <Label for="analytes" className="form-label">Analytes</Label>
            <Select
              isMulti
              name="analytes"
              options={this.props.ListUnit.map(unit => ({
                label: unit.name,
                value: unit.id,
              }))}
              classNamePrefix="select2-selection"
              value={values.analytes}
              onChange={selectedOptions => setFieldValue("analytes", selectedOptions)}
            />
            <ErrorMessage name="analytes" component="div" className="invalid-feedback" />
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

InstrumentType.propTypes = {
  ListUnit: PropTypes.array,
  match: PropTypes.object,
  SchemeList: PropTypes.array,
  className: PropTypes.any,
  onGetInstrumentTypeList: PropTypes.func,
  createInstrumentType: PropTypes.array,
  error: PropTypes.any,
  onGetAnalyte: PropTypes.func,
  success: PropTypes.any,
  onAddNewType: PropTypes.func,
  onUpdateType: PropTypes.func,
};

const mapStateToProps = ({ SchemeList, ListUnit }) => ({
  SchemeList: SchemeList.SchemeList,
  ListUnit: ListUnit.ListUnit,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetAnalyte: id => dispatch(getAnalytelist(id)),
  onGetInstrumentTypeList: (id) =>
    dispatch(getschemelist(id)),
  onAddNewType: (id, createUnit) =>
    dispatch(addNewSchemeList(id, createUnit)),
  onUpdateType: (id, methodlist) => dispatch(updateSchemeList({ id, ...methodlist })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InstrumentType));