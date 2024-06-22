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
  getReagentlist,
  addNewReagents,
  updateReagents,
} from "store/reagents/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";
import moment from 'moment';
class ReagentsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      nameFilter: '',
      addedbyFilter:'',
      idFilter: '',
      dateFilter:'',
      codeFilter: '',
      statusFilter:'',
      ReagentList: [],
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
          formatter: (cellContent, reagent) => (
            <div className="d-flex gap-3 ml-3">
              <Tooltip title="Update">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e => this.handleReagentsClick(e, reagent)}
                ></i>
              </Link></Tooltip>
              <Tooltip title="History">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/databaseadmin-history/${reagent.id}`}
                ></Link>
              </Tooltip>
              {/* <Tooltip title="Delete">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(reagent)}
                ></i>
              </Link></Tooltip> */}
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
    const { ReagentList, onGetReagents } = this.props;
    onGetReagents(this.state.user_id);
    this.setState({ ReagentList });
  }

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };
    // Filter data based on filter values
    filterData = () => {
      const { ReagentList } = this.props;
      const { nameFilter, addedbyFilter, dateFilter, idFilter,statusFilter, codeFilter } = this.state;
    
      const filteredData = ReagentList.filter(entry => {
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

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleReagentsClicks = () => {
    this.setState({ reagent: "",  isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { ReagentList } = this.props;
    if (
      !isEmpty(ReagentList) &&
      size(prevProps.ReagentList) !== size(ReagentList)
    ) {
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

  /* Insert,Update Delete data */

//   toggleDeleteModal = () => {
//     this.setState(prevState => ({
//       deleteModal: !prevState.deleteModal,
//     }));
//   };

//   onClickDelete = ReagentList => {
//     this.setState({ ReagentList: ReagentList });
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
//     const { onDeletePathologist, onGetReagents } = this.props;
//     const { ReagentList } = this.state;
//     if (ReagentList.id !== undefined) {
//       onDeletePathologist(ReagentList);
//       setTimeout(() => {
//         onGetReagents(this.state.user_id);
//       }, 1000);
//       this.setState({ deleteModal: false });
//     }
//   };

  handleReagentsClick = (e, arg) => {
    const reagent = arg;

    this.setState({
      reagent: {
        id: reagent.id,
        name: reagent.name,
        status: reagent.status,
        code: reagent.code,
        added_by: reagent.added_by,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { ReagentList } = this.props;

    const { isEdit, 
        // deleteModal 
    } = this.state;

    const { onAddNewReagent, onUpdateReagent, onGetReagents } =
      this.props;
    const reagent = this.state.reagent;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: ReagentList.length,
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
            <title>Reagents List | NEQAS</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Reagents"
              breadcrumbItem="Reagents List"
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
                      data={ReagentList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.ReagentsListColumns}
                          data={ReagentList}
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
                                      onClick={this.handleReagentsClicks}
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Reagents
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
                                          ? "Edit Reagents"
                                          : "Add New Reagents"}
                                      </ModalHeader>
                                      <ModalBody>
<Formik
                                          enableReinitialize={true}
                                          
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            name: (reagent && reagent.name) || "",
                                            code: (reagent && reagent.code) || "",
                                            status: (reagent && reagent.status) || "",
                                            added_by: localStorage.getItem("authUser")
                                              ? JSON.parse(localStorage.getItem("authUser")).user_id
                                              : "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddenEditFlag: Yup.boolean(),
                                            name: Yup.string().trim().required("Please enter name"),
                                            code: Yup.string().trim().required("Please enter Valid Code") .matches(/^[0-9]+$/, 'Please enter valid code (only integers are allowed)'),
                                            status: Yup.string()
                                              .trim()
                                              .required("Please select the Status from dropdown"),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              {
                                                const updateReagents = {
                                                  id: reagent.id,
                                                  name: values.name,
                                                  code: values.code,
                                                  status: values.status,
                                                  added_by: values.added_by,
                                                };

                                                // update Pathologist
                                                onUpdateReagent(
                                                  updateReagents
                                                );
                                                setTimeout(() => {
                                                  onGetReagents(
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
                                              onAddNewReagent(
                                                newReagent,
                                                this.state.user_id
                                              );
                                              setTimeout(() => {
                                                onGetReagents(
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
                                                        this.state.reagent
                                                          .name
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          reagent: {
                                                         
                                                            id: reagent.id,
                                                            name: e.target
                                                              .value,
                                                            status:
                                                              reagent.status,
                                                            code:
                                                             reagent.code,
                                                      
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
                                                        this.state.reagent.code
                                                          
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          reagent: {
                                                            id: reagent.id,
                                                            name: reagent.name,
                                                            status:
                                                              reagent.status,
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
                                                    <Field as="select" name="status" className={`form-control ${
        errors.status && touched.status ? "is-invalid" : ""
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
  ReagentList: PropTypes.array,
  className: PropTypes.any,
  onGetReagents: PropTypes.func,
  onAddNewReagent: PropTypes.func,
//   onDeletePathologist: PropTypes.func,
  onUpdateReagent: PropTypes.func,
};

const mapStateToProps = ({ ReagentList }) => ({
  ReagentList: ReagentList.ReagentList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetReagents: id => dispatch(getReagentlist(id)),
  onAddNewReagent: (reagent, id) =>
    dispatch(addNewReagents(reagent, id)),
  onUpdateReagent: reagent => dispatch(updateReagents(reagent)),
//   onDeletePathologist: reagent => dispatch(deletePathologist(reagent)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReagentsList));