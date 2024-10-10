import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import DeleteModal from "components/Common/DeleteModal";
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
  Button
} from "reactstrap";
import { isEmpty, size } from "lodash";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";


import Breadcrumbs from "components/Common/Breadcrumb";
import { getSamplelist, addNewSampleList, updateSampleList, deleteSampleList } from "store/sample/actions";

import { getcyclelist } from "store/cycle/actions";
import "assets/scss/table.scss";
import ListUnitt from "store/sample/reducer";
// import { List } from "antd/es/form/Form";

class SampleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      ListUnitt: [],
      sample: [],
      CycleList: [],
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",

      successMessage: "",
      idFilter:'',
      nameFilter:'',
      schemeFilter:'',
      cycleFilter:'',
      analyteFilter:'',
      statusFilter:'',
      feedbackListColumns: [
        {
          dataField: "id",
          text: "Sample ID",
          sort: true,
          style: { textAlign: 'left' },
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
        },
        {
          dataField: "samplename",
          text: "Sample Name",
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
          dataField: "scheme",
          text: "Scheme Name",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.schemeFilter}
                    onChange={e => this.handleFilterChange('schemeFilter', e)}
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
          text: "Cycle Name/ Number",
          sort: true,
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
          dataField: "noofanalytes",
          text: "No of Analytes for the Scheme",
          sort: true,
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>
                  <input
                    type="text"
                    value={this.state.analyteFilter}
                    onChange={e => this.handleFilterChange('analyteFilter', e)}
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
          text: "Sample Status",
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
                    <option value="Created">Created</option>
                    <option value="Rounded">Rounded</option>
                  </select>
                </div>
                <div>{column.text}</div>
              </>
            );
          },
        },

        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, sample) => (
            <div className="d-flex gap-3 ml-3">
              {/* <Tooltip title="Add Analytes">
                <Link to={`/add-analytes-sample-page/${sample.id}`} style={{ textDecoration: 'underline', color: '#008000' }}>
                  <i
                    className="mdi mdi-magnify font-size-18"
                    id="analyteIcon"
                  ></i>
                </Link></Tooltip> */}
              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() => this.toggle(sample)}
                  // onClick={e => this.handleCSRClick(e, CSR)}
                  ></i>
                </Link>
              </Tooltip>
              {/* <Tooltip title="Delete">
                <Link className="text-danger" to="#">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(sample)}
                  ></i>
                </Link>
              </Tooltip> */}
            </div>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }


  componentDidMount() {

    const { ListUnitt, onGetSampleList, onGetcyclelist } = this.props;

    // Ensure user_id is available before fetching data
    onGetSampleList(this.state.user_id);
    this.setState({ ListUnitt });

    onGetcyclelist(this.state.user_id);
  }

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };

  onClickDelete = (sample) => {
    if (sample && sample.id) {
      this.setState({ sample });
      this.setState({ deleteModal: true });
    } else {
     
    }
  };
  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  displaySuccessMessage = message => {
    this.setState({ successMessage: message });
    setTimeout(() => {
      this.setState({ successMessage: "", modal: false });
    }, 3000);
  };
  toggle(sample) {
    if (sample && sample.id) {

      this.setState({
        modal: true,
        selectedSample: {
          id: sample.id,
          samplename: sample.samplename,
          sampleno: sample.sampleno,
          scheme: sample.scheme,
          detail: sample.detail,
          notes: sample.notes,
          // status: sample.status,
        },
        isEdit: true,
      });
    } else {

      this.setState({
        modal: true,
        selectedSample: null,
        isEdit: false,
      });
    }
  }
  
  componentDidUpdate(prevProps) {
    const { ListUnitt, CycleList, } = this.props;
    if (!isEmpty(ListUnitt) && size(prevProps.ListUnitt) !== size(ListUnitt)) {
      this.setState({ ListUnitt: {}, isEdit: false });
    }
    if (!isEmpty(CycleList) && size(prevProps.CycleList) !== size(CycleList)) {
      this.setState({ CycleList: {}, isEdit: false });
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
  };
  handleDeleteSampleList = (id) => {
    const { onDeleteSampleList, onGetSampleList } = this.props;
    const { sample } = this.state;
    if (sample && sample.id !== undefined) { // Ensure sample.id is defined
      console.log("Deleting sample:", sample.id);
      onDeleteSampleList(sample); // Pass sample directly without nesting
      setTimeout(() => {
        onGetSampleList(id);
      }, 1000);
      this.setState({ deleteModal: false });
    } else {
      console.error("Sample ID is undefined or null");
      // Optionally handle or log this error condition
    }
  };


  render() {
    const { deleteModal } = this.state;
    const { SearchBar } = Search;
    const { onAddSampleList, onUpdateSampleList, onGetSampleList, onDeleteSampleList, onGetcyclelist } = this.props;
    const { idFilter, nameFilter, schemeFilter, cycleFilter, analyteFilter,statusFilter} = this.state;
    
    const { ListUnitt, CycleList } = this.props;

    const filteredData = ListUnitt.filter(entry => {
      // Modify accordingly for each filter condition
      const id = entry.id ? entry.id.toString().toLowerCase() : "";
      const samplename = entry.samplename ? entry.samplename.toString().toLowerCase() : "";
      const scheme = entry.scheme ? entry.scheme.toString() : "";
      // const id = entry.id ? entry.id.toString() : "";
      const cycle_no = entry.cycle_no ? entry.cycle_no.toString() : "";
      const noofanalytes = entry.noofanalytes ? entry.noofanalytes.toString() : "";
      const status= entry.status ? entry.status.toString() : "";
      return (
        id.includes(idFilter.toLowerCase()) &&
        samplename.includes(nameFilter.toLowerCase()) &&
        id.includes(idFilter) &&
        scheme.includes(schemeFilter) &&
        cycle_no.includes(cycleFilter) &&
        noofanalytes.includes(analyteFilter) &&
        status.includes(statusFilter)
        
      );

    });


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
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteSampleList}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Database Admin | Sample List</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="List" breadcrumbItem="Sample List" />


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

                                    <button className="btn btn-primary btn-block mb-4" onClick={() => this.toggle()} style={{ background: "#0000CD" }}>Add New Sample</button>

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader toggle={this.closeModal} tag="h4">
                                        {"Sample"}
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
                                            samplename: this.state.selectedSample ? this.state.selectedSample.samplename : "",
                                            sampleno: this.state.selectedSample ? this.state.selectedSample.sampleno : "",
                                            scheme: this.state.selectedSample ? this.state.selectedSample.scheme : "",
                                            detail: this.state.selectedSample ? this.state.selectedSample.detail : "",
                                            notes: this.state.selectedSample ? this.state.selectedSample.notes : "",
                                            // status: this.state.selectedSample ? this.state.selectedSample.status : "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            samplename: Yup.string().required("Sample Name is required"),
                                            sampleno: Yup.string().required("Sample No is required"),
                                            scheme: Yup.string().required("Scheme is required"),
                                            detail: Yup.string().required("Details is required"),
                                            notes: Yup.string().required("Notes are required"),
                                            // status: Yup.string().required("Please select the Status from dropdown"),
                                          })}

                                          onSubmit={async (values, { setSubmitting }) => {
                                            const userId = localStorage.getItem("authUser")
                                              ? JSON.parse(localStorage.getItem("authUser")).user_id
                                              : "";

                                            const newSample = {
                                              samplename: values.samplename,
                                              sampleno: values.sampleno,
                                              scheme: values.scheme,
                                              detail: values.detail,
                                              notes: values.notes,
                                              added_by: userId, // Ensure you have userId defined properly
                                            };
                                            try {
                                              if (this.state.isEdit) {
                                                await this.props.onUpdateSampleList(console.log("sample id 2", this.state.selectedSample.id), newSample);
                                                this.displaySuccessMessage("Sample updated successfully!");
                                                console.log("In case of update", this.state.selectedSample.id)
                                              } else {
                                                await this.props.onAddSampleList(newSample);
                                                this.displaySuccessMessage("Sample added successfully!");
                                              }

                                              await this.props.onGetSampleList(this.state.user_id);
                                            } catch (error) {
                                              console.error("Error updating/adding :", error);
                                            }

                                            setSubmitting(false);
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Sample Name</Label>
                                                    <Field
                                                      name="samplename"
                                                      type="text"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage name="samplename" component="div" className="text-danger" />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Sample No</Label>
                                                    <Field
                                                      name="sampleno"
                                                      type="text"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage name="sampleno" component="div" className="text-danger" />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label for="scheme">Select Cycle No</Label>
                                                    <Field
                                                      as="select"
                                                      name="scheme"
                                                      className={"form-control" + (errors.scheme && touched.scheme ? " is-invalid" : "")}
                                                    >
                                                      <option value="">Select Cycle</option>
                                                      {CycleList && CycleList.map(scheme => (
                                                        <option key={scheme.id} value={scheme.id}>
                                                          {scheme.cycle_no} 
                                                        </option>
                                                      ))}
                                                    </Field>
                                                    <ErrorMessage name="scheme" component="div" className="invalid-feedback" />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Details</Label>
                                                    <Field
                                                      name="detail"
                                                      type="text"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage name="detail" component="div" className="text-danger" />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Notes</Label>
                                                    <Field
                                                      name="notes"
                                                      type="text"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage name="notes" component="div" className="text-danger" />
                                                  </div>
                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Status
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field as="select" name="status" className={`form-control ${errors.status && touched.status ? "is-invalid" : ""
                                                      }`}>
                                                      <option value="">----- Please select -----</option>
                                                      <option value="Created">Created</option>
                                                      <option value="Rounded">Rounded</option>
                                                    </Field>
                                                    <ErrorMessage name="status" component="div" className="invalid-feedback" />
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
                                      filter={filterFactory()} // Ensure filterFactory is applied correctly
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

SampleList.propTypes = {
  match: PropTypes.object,
  sample: PropTypes.array,
  ListUnitt: PropTypes.array,
  CycleList: PropTypes.array,
  className: PropTypes.any,
  error: PropTypes.any,
  success: PropTypes.any,
  onGetSampleList: PropTypes.func,
  onAddSampleList: PropTypes.func,
  onUpdateSampleList: PropTypes.func,
  onDeleteSampleList: PropTypes.func,
  onGetcyclelist: PropTypes.func,
  id: PropTypes.string,
};

const mapStateToProps = ({ ListUnitt, CycleList}) => ({
  CycleList: CycleList.CycleList,
  ListUnitt: ListUnitt.ListUnitt,

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetSampleList: (id) => { dispatch(getSamplelist(id)); },
  onAddSampleList: (sample) => { dispatch(addNewSampleList(sample)); },
  onUpdateSampleList: (id, sample) => dispatch(updateSampleList(id, sample)),
  onGetcyclelist: id => dispatch(getcyclelist(id)),
  onDeleteSampleList: (sample) => {dispatch(deleteSampleList(sample));
    
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SampleList));