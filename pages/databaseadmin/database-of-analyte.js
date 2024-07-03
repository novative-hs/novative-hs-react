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

import {
  getAnalytelist,
  addNewAnalyteList,
  updateAnalyteList,
} from "store/databaseofunits/actions";


import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";
import moment from 'moment';
class ReagentsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      nameFilter: '',
      methodsFilter:'',
      equipmentFilter:'',
      reagentsFilter:'',
      masterunitFilter:'',
      dateFilter:'',
      codeFilter: '',
      idFilter:'',
      statusFilter:'',
      ListUnit: [],
      reagent: "",
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

          hidden: true,
          formatter: (cellContent, analyte) => <>{analyte.id}</>,
        },
        {
          text: "Date of Addition",
          dataField: "date_of_addition",
          sort: true,
          hidden: false,
          formatter: (cellContent, analyte) => (
            <>
              <span>
                {moment(analyte.date_of_addition).format("DD MMM YYYY, h:mm A")}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
          filter: textFilter(),
          style: { textAlign: "left" },
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
          dataField: "code",
          text: "code",
          sort: true,
          
          style: { textAlign: 'right' },
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
          dataField: "name",
          text: "Analyte",
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
          dataField: "master_unit_name",
          text: "Master Unit",
          sort: true,
          
          style: { textAlign: 'left' },
          headerFormatter: (column, colIndex) => {
            return (
              <>
              <div>              
                <input
                  type="text"
                  value={this.state.masterunitFilter}
                  onChange={e => this.handleFilterChange('masterunitFilter', e)}
                  className="form-control"
               
                />
              </div>
                <div>{column.text}</div>
                </>
            );
          },
        },
        {
          dataField: "noofmethods",
          text: "No. of Methods",
          sort: true,
          
          style: { textAlign: 'left' },
          headerFormatter: (column, colIndex) => {
            return (
              <>
              <div>              
                <input
                  type="text"
                  value={this.state.methodsFilter}
                  onChange={e => this.handleFilterChange('methodsFilter', e)}
                  className="form-control"
               
                />
              </div>
                <div>{column.text}</div>
                </>
            );
          },
        },
        {
          dataField: "noofinstruments",
          text: "No. of Equipments",
          sort: true,
          
          style: { textAlign: 'left' },
          headerFormatter: (column, colIndex) => {
            return (
              <>
              <div>              
                <input
                  type="text"
                  value={this.state.equipmentFilter}
                  onChange={e => this.handleFilterChange('equipmentFilter', e)}
                  className="form-control"
               
                />
              </div>
                <div>{column.text}</div>
                </>
            );
          },
        },
        {
          dataField: "noofreagents",
          text: "No. of Reagents",
          sort: true,
          
          style: { textAlign: 'left' },
          headerFormatter: (column, colIndex) => {
            return (
              <>
              <div>              
                <input
                  type="text"
                  value={this.state.reagentsFilter}
                  onChange={e => this.handleFilterChange('reagentsFilter', e)}
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
          dataField: 'link1',
          text: '',
          formatter: (cellContent, analyte) => {
            return (
              <Link to={`/analyte-add-units/${analyte.id}`} style={{ textDecoration: 'underline', color: '#0000CD' }}>
                
                <span>Add Units</span>
              </Link>
            );
          }
        },
        {
          dataField: 'link2',
          text: '',
          formatter: (cellContent, analyte) => {
            return (
              <Link to={`/analyte-add-methods/${analyte.id}`} style={{ textDecoration: 'underline', color: '#0000CD' }}>
                <span>Add Methods</span>
              </Link>
            );
          }
        },
        {
          dataField: 'link3',
          text: '',
          formatter: (cellContent, analyte) => {
            return (
              <Link to={`/analyte-add-equipments/${analyte.id}`}style={{ textDecoration: 'underline', color: '#0000CD' }}>
                <span>Add Equipments</span>
              </Link>
            );
          }
        },
        {
          dataField: 'link4',
          text: '',
          formatter: (cellContent, analyte) => {
            return (
              <Link to={`/analyte-add-reagents/${analyte.id}`} style={{ textDecoration: 'underline', color: '#0000CD' }}>
                <span>Add Reagents</span>
              </Link>
            );
          }
        },
        
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, analyte) => (
            <div className="d-flex gap-3 ml-3">
              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={e => this.handleReagentsClick(e, analyte)}
                  ></i>
                </Link></Tooltip>
              <Tooltip title="History">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/databaseadmin-history/${analyte.id}`}
                ></Link>
              </Tooltip>
            </div>
          ),

        },
      ],
    };
    this.handleReagentsClick = this.handleReagentsClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleReagentsClicks = this.handleReagentsClicks.bind(this);
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
    const { ListUnit, onGetAnalyte} = this.props;
  
    onGetAnalyte(this.state.user_id);
    this.setState({ ListUnit });
  }
  
  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };
  
    
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleReagentsClicks = () => {
    this.setState({ analyte: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { ListUnit } = this.props;
    if (
      !isEmpty(ListUnit) &&
      size(prevProps.ListUnit) !== size(ListUnit)
    ) {
      this.setState({ ListUnit: {}, isEdit: false });
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
    const analyte = arg;

    this.setState({
      analyte: {
        id: analyte.id,
        name: analyte.name,
        status: analyte.status,
        code: analyte.code,
        added_by: analyte.added_by,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { ListUnit } = this.props;
    const { nameFilter, dateFilter, statusFilter, codeFilter, idFilter,masterunitFilter,methodsFilter,equipmentFilter ,reagentsFilter} = this.state;
    
      const filteredData = ListUnit.filter(entry => {
        // Modify accordingly for each filter condition
        const name = entry.name ? entry.name.toString().toLowerCase() : "";
        const master_unit_name = entry.master_unit_name ? entry.master_unit_name.toString().toLowerCase() : "";
        const status = entry.status ? entry.status.toString() : "";
        const id = entry.id ? entry.id.toString() : "";
        const noofmethods = entry.noofmethods ? entry.noofmethods.toString() : "";
        const noofreagents = entry.noofreagents ? entry.noofreagents.toString() : "";
        const noofinstruments = entry.noofinstruments ? entry.noofinstruments.toString() : "";
        const code = entry.code ? entry.code.toString() : "";
        const date = entry.date_of_addition ? entry.date_of_addition.toString() : "";
    
        return (
          name.includes(nameFilter.toLowerCase()) &&
          master_unit_name.includes(masterunitFilter.toLowerCase()) &&
          status.includes(statusFilter) &&
          id.includes(idFilter) &&
          noofmethods.includes(methodsFilter) &&
          noofreagents.includes(reagentsFilter) &&
          noofinstruments.includes(equipmentFilter) &&
          code.includes(codeFilter) &&
          date.includes(dateFilter)
        );
      });
    

    const { isEdit, 
        // deleteModal 
    } = this.state;

    const { onAddNewAnalyte, onUpdateAnalyte, onGetAnalyte } =
      this.props;
    const analyte = this.state.analyte;

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
        {/* <DeleteModal
        //   show={deleteModal}
          onDeleteClick={this.handleDeletePathologist}
          onCloseClick={() => this.setState({ deleteModal: false })}
        /> */}
        <div className="page-content">
          <MetaTags>
            <title>Analyte List | NEQAS</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Analyte"
              breadcrumbItem="Analyte List"
            />
            <Row className="justify-content-center">
              {/* <p className="text-danger">Note: Pathologist Information will scale the rating of your lab.</p> */}

              <Col lg="10">
                <Card>
                  <CardBody>
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
                              <Row className="mb-4">

<Col xl="12">
                                  <div className="text-sm-end">
                                    <Button
                                      style={{ background: "#0000CD" }}
                                      className="font-16 btn-block btn btn-primary"
                                      onClick={this.handleReagentsClicks}
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Analyte
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
                                          ? "Edit Analyte"
                                          : "Add New Analyte"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}

                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            name: (analyte && analyte.name) || "",
                                            code: (analyte && analyte.code) || "",
                                            status: (analyte && analyte.status) || "",
                                            added_by: localStorage.getItem("authUser")
                                              ? JSON.parse(localStorage.getItem("authUser")).user_id
                                              : "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddenEditFlag: Yup.boolean(),
                                            name: Yup.string().trim().required("Please enter name"),
                                            code: Yup.string().trim().required("Please enter Valid Code").matches(/^[0-9]+$/, 'Please enter valid code (only integers are allowed)'),
                                            status: Yup.string()
                                              .trim()
                                              .required("Please select the Status from dropdown"),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              {
                                                const updateAnalyteList = {
                                                  id: analyte.id,
                                                  name: values.name,
                                                  code: values.code,
                                                  status: values.status,
                                                  added_by: values.added_by,
                                                };

                                                // update Pathologist
                                                onUpdateAnalyte(
                                                  updateAnalyteList
                                                );
                                                setTimeout(() => {
                                                  onGetAnalyte(
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
                                                name: values.name,
                                                code: values.code,
                                                status: values.status,
                                                added_by: values.added_by,
                                              };

                                              // save new Pathologist
                                              onAddNewAnalyte(
                                                newReagent,
                                                this.state.user_id
                                              );
                                              setTimeout(() => {
                                                onGetAnalyte(
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
                                                        this.state.analyte
                                                          .name
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          analyte: {

                                                            id: analyte.id,
                                                            name: e.target
                                                              .value,
                                                            status:
                                                              analyte.status,
                                                            code:
                                                              analyte.code,

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
                                                        this.state.analyte.code

                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          analyte: {
                                                            id: analyte.id,
                                                            name: analyte.name,
                                                            status:
                                                              analyte.status,
                                                            code:
                                                              e.target.value,
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

ReagentsList.propTypes = {
  match: PropTypes.object,
  ListUnit: PropTypes.array,
  className: PropTypes.any,
  createInstrumentType: PropTypes.array,
  onGetAnalyte: PropTypes.func,
  onAddNewAnalyte: PropTypes.func,
  onUpdateAnalyte: PropTypes.func,
};

const mapStateToProps = ({ ListUnit}) => ({
  ListUnit: ListUnit?.ListUnit,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetAnalyte: id => dispatch(getAnalytelist(id)),
  onAddNewAnalyte: (createInstrumentType, id) =>
    dispatch(addNewAnalyteList(createInstrumentType, id)),
  onUpdateAnalyte: reagent => dispatch(updateAnalyteList(reagent)),  
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReagentsList));