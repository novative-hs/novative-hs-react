import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
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
  Alert
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import { getSchemelist } from "store/scheme/actions";
import { getcyclelist } from "store/cycle/actions";
import { getSamplelist } from "store/sample/actions";
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getroundlist, addNewRoundList, updateRoundList, deleteRound } from "store/rounds/actions";

import { isEmpty, size } from "lodash";
import DeleteModal from "components/Common/DeleteModal";
import "assets/scss/table.scss";
import moment from "moment";
class InstrumentType extends Component {
  constructor(props) {

    super(props);
    this.node = React.createRef();
    this.state = {
      selectedRound: null,
      isEdit: false,

      idFilter: '',
      roundsFilter: '',
      schemenameFilter: '',
      cyclenoFilter: '',
      sampleFilter: '',
      participantsFilter: '',
      issuedateFilter: '',
      closingdateFilter: '',
      statusFilter: '',
      errorMessage:"",
      RoundList: [],
      round: [],
      SchemeList: [],
      CycleList: [],
      // sample: [],
      ListUnitt:[],
      methodlist: "",
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
          formatter: (cellContent, methodlist) => <>{methodlist.id}</>,
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
          dataField: "rounds",
          text: "Number of Rounds",
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
          text: "Cycle Number",
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
          dataField: "sample",
          text: "Sample Name",
          sort: true,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>

                  <input
                    type="text"
                    value={this.state.sampleFilter}
                    onChange={e => this.handleFilterChange('sampleFilter', e)}
                    className="form-control"

                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
        },
        {
          dataField: "nooflabs",
          text: "Number of Participants",
          sort: true,
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>

                  <input
                    type="text"
                    value={this.state.participantsFilter}
                    onChange={e => this.handleFilterChange('participantsFilter', e)}
                    className="form-control"

                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
        },
        {
          dataField: "issue_date",
          text: "Issue Date",
          sort: true,
          formatter: (cellContent, methodlist) => (
            <>
              <span>
                {moment(methodlist.issue_date).format("DD MMM YYYY")}
              </span>
            </>
          ),
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>

                  <input
                    type="text"
                    value={this.state.issuedateFilter}
                    onChange={e => this.handleFilterChange('issuedateFilter', e)}
                    className="form-control"

                  />
                </div>
                <div>{column.text}</div>
              </>
            );
          },
        },
        {
          dataField: "closing_date",
          text: "Closing Date",
          sort: true,
          formatter: (cellContent, methodlist) => (
            <>
              <span>
                {moment(methodlist.closing_date).format("DD MMM YYYY")}
              </span>
            </>),
          // filter: textFilter(),
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div>

                  <input
                    type="text"
                    value={this.state.closingdateFilter}
                    onChange={e => this.handleFilterChange('closingdateFilter', e)}
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
          formatter: (cellContent, methodlist) => (
            <>
              {methodlist.status === "Created" ? (
                <span>Created</span>
              ) : methodlist.status === "Ready" ? (
                <span>Ready</span>
              ) : methodlist.status === "Open" ? (
                <span>Open</span>
              ) : methodlist.status === "Closed" ? (
                <span>Closed</span>
              ) : methodlist.status === "Report Available" ? (
                <span>Report Available</span>
              ) : (
                <span>{methodlist.status}</span> // Fallback in case of unexpected values
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
                    <option value="Created">Created</option>
                    <option value="Ready">Ready</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                    <option value="Report Available">Report Available</option>
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
        //   formatter: (cellContent, round) => {
        //     return (
        //       <Link to={`/add-labs-round-page/${round.id}`} style={{ textDecoration: 'underline', color: '#0000CD' }}>

        //         <span>Add Participants</span>
        //       </Link>

        //     );
        //   }
        // },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, round) => {
            // const scheme = round.scheme ? round.scheme.toString() : ""; // Extract scheme from round object
            return (
              <div className="d-flex gap-3 ml-3">
                <Tooltip title="Add Participants">
                  <Link
                    to={`/add-labs-round-page/${round.id}`}
                    style={{ textDecoration: "underline", color: "#008000" }}
                  >
                    <i
                      className="mdi mdi-account-plus-outline font-size-18"
                      id="participantsIcon"
                    ></i>
                  </Link>
                </Tooltip>

                {/* Show the statistics icon only when the status is "closed" */}
                {round.status === "Closed" && (
                  <Tooltip title="Statistics">
                    <Link
                      to="#"
                      onClick={() => this.onClickStatistics(round)}
                      style={{ textDecoration: "underline", color: "#008000" }}
                    >
                      <i
                        className="mdi mdi-chart-bar font-size-18"
                        id="statisticsIcon"
                      ></i>
                    </Link>
                  </Tooltip>
                )}
                          
                <Tooltip title="Update">
                  <Link className="text-success" to="#">
                    <i
                      className="mdi mdi-pencil font-size-18"
                      id="edittooltip"
                      onClick={() => this.toggle(round)}
                    ></i>
                  </Link>
                </Tooltip>

                <Tooltip title="Delete">
                  <Link className="text-danger" to="#">
                    <i
                      className="mdi mdi-delete font-size-18"
                      id="deletetooltip"
                      onClick={() => this.onClickDelete(round)}
                    ></i>
                  </Link>
                </Tooltip>
              </div>
            );
          },
        },
      ],
    };

    this.toggle = this.toggle.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickStatistics = this.onClickStatistics.bind(this);
  }

  componentDidMount() {
    const { onGetRoundList, onGetgetschemelist, onGetgetcyclelist, onGetgetSamplelistlist } = this.props;
    const userId = this.state.user_id;

    onGetRoundList(userId);
    onGetgetschemelist(userId);
    onGetgetcyclelist(userId);
    onGetgetSamplelistlist(userId); 
  }

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  handleDeleteRound = () => {
    const { onDeleteRound, onGetRoundList } = this.props;
    const { RoundList } = this.state;
    if (RoundList.id !== undefined) {
      onDeleteRound(RoundList);
      setTimeout(() => {
        onGetRoundList(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  // onClickDelete = RoundList => {
  //   this.setState({ RoundList: RoundList });
  //   this.setState({ deleteModal: true });
  // };


  onClickDelete = (RoundList) => {
    if (RoundList.status === 'Open') {
      this.setState({ errorMessage: "Cannot delete. Round is Open" });
      // Clear error message after 5 seconds
      setTimeout(() => {
        this.setState({ errorMessage: '' });
      }, 2000);
    } else {
      this.setState({ RoundList: RoundList });
      this.setState({ deleteModal: true });
    }
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

  onClickStatistics = (round) => {
    if (round && round.id) {
      // Update the round's status to "report available"
      const updatedRound = {
        ...round,
        status: "Report Available",
      };
  
      // Dispatch the update action to save the new status
      this.props.onUpdateRound(round.id, updatedRound);
      
      // Optionally, redirect to the statistics page
      this.props.history.push(`/statistics/${round.id}`);
    }
  };

  toggle(round) {
    console.log("data in case of update asjdhasdf", round)
    if (round && round.id) {
      this.setState({
        modal: true,
        selectedRound: {
          id: round.id,
          rounds: round.rounds,
          sample: round.sample,
          participants: round.participants,
          issue_date: round.issue_date
          ? moment(round.issue_date).format("YYYY-MM-DD")
          : "",
          closing_date: round.closing_date
          ? moment(round.closing_date).format("YYYY-MM-DD")
          : "",
          status: round.status,
          added_by: round.added_by,
        },
        isEdit: true,
      });
    } else {
      this.setState({
        modal: true,
        selectedRound: null,
        isEdit: false,
      });
    }
  }
  componentDidUpdate(prevProps) {
    if (
      !isEmpty(this.props.RoundList) &&
      size(prevProps.RoundList) !== size(this.props.RoundList)
    ) {
      this.setState({ RoundList: this.props.RoundList });
    }
    if (
      !isEmpty(this.props.SchemeList) &&
      size(prevProps.SchemeList) !== size(this.props.SchemeList)
    ) {
      this.setState({ SchemeList: this.props.SchemeList });
    }
    if (
      !isEmpty(this.props.CycleList) &&
      size(prevProps.CycleList) !== size(this.props.CycleList)
    ) {
      this.setState({ CycleList: this.props.CycleList });
    }
    if (!isEmpty(this.props.ListUnitt) && size(prevProps.ListUnitt) !== size(this.props.ListUnitt)) {
      this.setState({ ListUnitt: this.props.ListUnitt });
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
    const { RoundList, SchemeList, CycleList, ListUnitt } = this.props;
    // console.log('SchemeList in render:', SchemeList);

    const { isEdit, deleteModal, errorMessage } = this.state;
    const round = this.state.round;
    const { onGetRoundList, onGetgetschemelist, onGetgetcyclelist, onGetgetSamplelistlist, onAddNewRound, onUpdateRound } = this.props;


    const { idFilter, roundsFilter, schemenameFilter, cyclenoFilter, sampleFilter, participantsFilter, issuedateFilter, closingdateFilter, statusFilter} = this.state;

    const filteredData = RoundList.filter(entry => {   
      // Modify accordingly for each filter condition
      const id = entry.id ? entry.id.toString() : "";
      const rounds = entry.rounds ? entry.rounds.toString() : "";
      const scheme_name = entry.scheme_name ? entry.scheme_name.toString().toLowerCase() : "";
      const cycle_no = entry.cycle_no ? entry.cycle_no.toString().toLowerCase() : "";
      const sample = entry.sample ? entry.sample.toString() : "";
      const participants = entry.participants ? entry.participants.toString() : "";
      const issue_date = entry.issue_date ? entry.issue_date.toString() : "";
      const closing_date = entry.closing_date ? entry.closing_date.toString() : "";
      const status = entry.status ? entry.status.toString() : "";
      
      return (
        id.includes(idFilter) &&
        rounds.includes(roundsFilter) &&
        scheme_name.includes(schemenameFilter.toLowerCase()) &&
        cycle_no.includes(cyclenoFilter.toLowerCase()) &&
        sample.includes(sampleFilter) &&
        participants.includes(participantsFilter) &&
        issue_date.includes(issuedateFilter) &&
        closing_date.includes(closingdateFilter) &&
        status.includes(statusFilter)
    );
  });

    const pageOptions = {
      sizePerPage: 10,
      // totalSize: RoundList.length,
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
          onDeleteClick={this.handleDeleteRound}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Registeration Admin | Round List</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="List" breadcrumbItem="Round List" />
            <Row className="justify-content-center">
              <Col lg="10">
                <Card>
                  <CardBody>
                  <Row>
                      <Col className="pagination pagination-rounded justify-content-center mb-2">
                        {errorMessage && (
                          <Alert color="danger">
                            {errorMessage}
                          </Alert>
                        )}
                      </Col>
                    </Row>
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
                                    <button
                                      className="btn btn-primary btn-block mb-4"
                                      onClick={() => this.toggle()}
                                      style={{ background: "#0000CD" }}
                                    >
                                      Add Rounds
                                    </button>
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.closeModal}
                                        tag="h4"
                                      >
                                        {"Round Form"}
                                      </ModalHeader>
                                      <ModalBody>
                                        {this.state.successMessage && (
                                          <div
                                            className="alert alert-success"
                                            role="alert"
                                          >
                                            {this.state.successMessage}
                                          </div>
                                        )}
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            // hiddenEditFlag: isEdit,
                                            rounds: this.state.selectedRound ? this.state.selectedRound.rounds : "",
                                            sample: this.state.selectedRound ? this.state.selectedRound.sample : "",
                                            participants: this.state.selectedRound ? this.state.selectedRound.participants : "",
                                            issue_date: this.state.selectedRound ? this.state.selectedRound.issue_date : "",
                                            closing_date: this.state.selectedRound ? this.state.selectedRound.closing_date : "",
                                            // notes: this.state.selectedRound ? this.state.selectedRound.notes : "",
                                            status: this.state.selectedRound ? this.state.selectedRound.status : "Created",
                                            // added_by: this.state.selectedRound ? this.state.selectedRound.added_by : "",

                                          }}
                                          // validationSchema={Yup.object().shape({
                                          //   rounds: Yup.string().required("Select the number of rounds"),
                                          //   sample: Yup.string().required("Sample is required"),
                                          //   participants: Yup.string().required("Participants is required"),
                                          //   scheme: Yup.string().required("Scheme is required"),
                                          //   cycle_no: Yup.string()
                                          //     .required("Cycle number is required")
                                          //     .matches(/^[0-9]+$/, "It must be a number"),
                                          //   sample: Yup.string().required("Sample is required"),
                                          //   issue_date: Yup.string().required("Start Date is required"),
                                          //   closing_date: Yup.string().required("End Date is required"),
                                          //   notes: Yup.string().required("Notes are required"),

                                          // })}
                                          onSubmit={async (values, { setSubmitting }) => {
                                            const userId = localStorage.getItem("authUser")
                                              ? JSON.parse(localStorage.getItem("authUser")).user_id
                                              : "";

                                            const newround = {
                                              rounds: values.rounds,
                                              sample: values.sample,
                                              participants: values.participants,
                                              issue_date: values.issue_date,
                                              closing_date: values.closing_date,
                                              status: values.status,
                                              added_by: userId,
                                            };

                                            try {
                                              if (this.state.isEdit) {
                                                await this.props.onUpdateRound(this.state.selectedRound.id, newround);
                                                this.displaySuccessMessage("Round updated successfully!");
                                              } else {
                                                await this.props.onAddNewRound(newround);
                                                this.displaySuccessMessage("Round added successfully!");
                                              }

                                              // Refetch data and update local state
                                              const updatedData = await this.props.onGetRoundList(this.state.user_id);
                                              this.setState({ RoundList: updatedData });

                                            } catch (error) {
                                              console.error("Error updating/adding rounds:", error);
                                            }

                                            setSubmitting(false);
                                          }}
                                        >
                                          {({
                                            errors,
                                            status,
                                            round,
                                            touched,
                                          }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Number of Rounds</Label>
                                                    <Field
                                                      name="rounds"
                                                      type="number"
                                                      min={0}
                                                      max={36}
                                                      className="form-control"
                                                    ></Field>
                                                    <ErrorMessage
                                                      name="rounds"
                                                      component="div"
                                                      className="text-danger"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label for="sample">Sample</Label>
                                                    <Field
                                                      as="select"
                                                      name="sample"
                                                      className={"form-control" + (errors.sample && touched.sample ? " is-invalid" : "")}
                                                    >
                                                      <option value="">Select Sample</option>
                                                      {ListUnitt && ListUnitt.map(sample => (
                                                        <option key={sample.id} value={sample.samplename}>{sample.
                                                          samplename}</option>
                                                      ))}
                                                    </Field>
                                                    <ErrorMessage name="sample" component="div" className="invalid-feedback" />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">
                                                      Issue Date
                                                    </Label>
                                                    <Field
                                                      name="issue_date"
                                                      type="date"
                                                      id="issue_date"
                                                      className={
                                                        "form-control" +
                                                        (errors.issue_date &&
                                                        touched.issue_date
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="issue_date"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">
                                                      Closing Date
                                                    </Label>
                                                    <Field
                                                      name="closing_date"
                                                      type="date"
                                                      id="closing_date"
                                                      className={
                                                        "form-control" +
                                                        (errors.closing_date &&
                                                        touched.closing_date
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="closing_date"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  {/* <div className="mb-3">
                                                    <Label className="col-form-label">Notes</Label>
                                                    <Field
                                                      name="notes"
                                                      type="text"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage name="notes" component="div" className="text-danger" />
                                                  </div> */}
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">
                                                      Status
                                                    </Label>
                                                    <Field
                                                      name="status"
                                                      as="select"

                                                      className="form-control"
                                                      multiple={false}
                                                    >
                                                      <option value="Created">Created</option>
                                                      <option value="Ready">Ready</option>
                                                      <option value="Open">Open</option>
                                                      <option value="Closed">Closed</option>
                                                      <option value="Report Available">Report Available</option>

                                                    </Field>
                                                    <ErrorMessage
                                                      name="status"
                                                      component="div"
                                                      className="text-danger"
                                                    />
                                                  </div>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col>
                                                  <div className="text-end">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-success save-user"
                                                      style={{
                                                        backgroundColor:
                                                          "#0000CD",
                                                        borderColor: "#0000CD",
                                                      }}
                                                    >
                                                      Save
                                                    </button>
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
  match: PropTypes.object,
  RoundList: PropTypes.array,
  SchemeList: PropTypes.array,
  CycleList: PropTypes.array,
  // sample: PropTypes.array,
  ListUnitt: PropTypes.array,
  className: PropTypes.any,
  onGetRoundList: PropTypes.func,
  onGetgetschemelist: PropTypes.func,
  onGetgetcyclelist: PropTypes.func,
  onGetgetSamplelistlist: PropTypes.func,
  createInstrumentType: PropTypes.array,
  error: PropTypes.any,
  success: PropTypes.any,
  onAddNewRound: PropTypes.func,
  onUpdateRound: PropTypes.func,
  onDeleteRound: PropTypes.func,

  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = ({ RoundList, SchemeList, CycleList, sample, ListUnitt }) => ({
  RoundList: RoundList.RoundList,
  SchemeList: SchemeList.SchemeList,
  // sample: sample.sample,
  CycleList: CycleList.CycleList,
  ListUnitt: ListUnitt.ListUnitt,

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetgetschemelist: id => dispatch(getSchemelist(id)),
  onGetgetcyclelist: id => dispatch(getcyclelist(id)),
  onGetgetSamplelistlist: id => dispatch(getSamplelist(id)),
  onGetRoundList: id => dispatch(getroundlist(id)),
  onAddNewRound: (id, createround) => dispatch(addNewRoundList(id, createround)),
  onUpdateRound: (id, round) => dispatch(updateRoundList({ id, ...round })),
  onDeleteRound: round => dispatch(deleteRound(round)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InstrumentType));
