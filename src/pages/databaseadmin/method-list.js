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
import { getmethodlist, addNewMethod, updateMethods } from "store/methods/actions";
import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";
import moment from 'moment';
class InstrumentType extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      selectedUnit: null,
      nameFilter: '',
      addedbyFilter:'',
      idFilter: '',
      dateFilter:'',
      codeFilter: '',
      statusFilter:'',
      isEdit: false,
      ListMethods: [],
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
          headerStyle: { width: '150px' },  // Adjust the width as needed
  style: { width: '150px' },  // Adjust the width as needed
        },
         {
          dataField: "name",
          text: "Method",
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
                  to={`/databaseadmin-history/${methodlist.id}`}
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
    const { ListMethods, onGetInstrumentTypeList } = this.props;
    onGetInstrumentTypeList(this.state.user_id);
    this.setState({ ListMethods });
  }
  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };
    // Filter data based on filter values
    filterData = () => {
      const { ListMethods } = this.props;
      const { nameFilter, addedbyFilter, dateFilter, idFilter,statusFilter, codeFilter } = this.state;
    
      const filteredData = ListMethods.filter(entry => {
        const name = entry.name ? entry.name.toString().toLowerCase() : "";
        const addedBy = entry.added_by ? entry.added_by.toString().toLowerCase() : "";
        const status = entry.status ? entry.status.toString(): "";
        const id = entry.id ? entry.id.toString() : "";
        const code = entry.code ? entry.code.toString() : "";
        const date = entry.date_of_addition ? entry.date_of_addition.toString() : "";
    
        return (
          name.includes(nameFilter.toLowerCase()) &&
          addedBy.includes(addedbyFilter.toLowerCase()) &&
          status.includes(statusFilter) &&
          id.includes(idFilter) &&
          code.includes(codeFilter) &&
          date.includes(dateFilter)
        );
      });
    
      return filteredData;
    };
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
        selectedUnit: { id: unit.id, name: unit.name, added_by: unit.added_by ,code:unit.code, status:unit.status},
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
    const { ListMethods } = this.props;
    if (!isEmpty(ListMethods) && size(prevProps.ListMethods) !== size(ListMethods)) {
      this.setState({ ListMethods: {}, isEdit: false });
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
    const { ListMethods } = this.props;
    const { onGetInstrumentTypeList, onUpdateType } = this.props;
  
    // Use the filterData function to get the filtered data
    const filteredData = this.filterData();
  
    const pageOptions = {
      sizePerPage: 10,
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
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Method List</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="List" breadcrumbItem="Method List" />
            <Row className="justify-content-center">
              <Col lg="10">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={filteredData} // Use filteredData here
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={filteredData} // Use filteredData here
                          search
                        >

                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-4">

                                <Col xl="12">
                                  <Col className="text-end">

                                    <button className="btn btn-primary btn-block mb-4" onClick={() => this.toggle()} style={{ background: "#0000CD" }}>Add New Method</button>

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader toggle={this.closeModal} tag="h4">
                                        {"Method"}
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
  }}
  validationSchema={Yup.object().shape({
    name: Yup.string().required("Name is required"),
    code: Yup.string()
      .required("Code is required")
      .matches(/^[0-9]+$/, "Code must be a number"),
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
    };

    try {
      if (this.state.isEdit) {
        await this.props.onUpdateType(this.state.selectedUnit.id, newUnit);
        this.displaySuccessMessage("Method updated successfully!");
      } else {
        await this.props.onAddNewType(newUnit);
        this.displaySuccessMessage("Method added successfully!");
      }

      await this.props.onGetInstrumentTypeList(this.state.user_id);
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
            <Label className="col-form-label">Method Name</Label>
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
                                    filter={filterFactory()} // Ensure filterFactory is applied
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
  match: PropTypes.object,
  ListMethods: PropTypes.array,
  className: PropTypes.any,
  onGetInstrumentTypeList: PropTypes.func,
  createInstrumentType: PropTypes.array,
  error: PropTypes.any,
  success: PropTypes.any,
  onAddNewType: PropTypes.func,
  onUpdateType: PropTypes.func,
};

const mapStateToProps = ({ ListMethods }) => ({
  ListMethods: ListMethods.ListMethods,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetInstrumentTypeList: (id) => dispatch(getmethodlist(id)),
  onAddNewType: (createInstrumentType, id) =>
    dispatch(addNewMethod(createInstrumentType, id)),
  onUpdateType: (id, methodlist) => dispatch(updateMethods({ id, ...methodlist })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InstrumentType));