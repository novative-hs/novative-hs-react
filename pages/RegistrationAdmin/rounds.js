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
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

import { getSchemelist } from "store/scheme/actions";
import { getSample } from "store/sample/actions";
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
      RoundList: [],
      round: [],
      SchemeList: [],
      sample: [],
      methodlist: "",
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
          formatter: (cellContent, methodlist) => <>{methodlist.id}</>,
          filter: textFilter(),
        },
        {
          dataField: "rounds",
          text: "Number of Rounds",
          sort: true,
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
          text: "Cycle Number",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "sample",
          text: "Sample Number",
          sort: true,
          filter: textFilter(),
        },
        // {
        //   dataField: "sample",
        //   text: "Number of Participants",
        //   sort: true,
        //   filter: textFilter(),
        // },
        {
          dataField: "issue_date",
          text: "Issue Date",
          sort: true,
          formatter: (cellContent, methodlist) => (
            <>
              <span>
                {moment(methodlist.issue_date).format("DD MMM YYYY, h:mm A")}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "closing_date",
          text: "Closing Date",
          sort: true,
          formatter: (cellContent, methodlist) => (
            <>
              <span>
                {moment(methodlist.closing_date).format("DD MMM YYYY, h:mm A")}
              </span>
            </>
          ), filter: textFilter(),
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
          filter: selectFilter({
            options: {
              Created: "Created",
              Ready: "Ready",
              Open: "Open",
              Closed: "Closed",
              "Report Available": "Report Available",
            },
            defaultValue: 'All',
          }),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, round) => (
            <div className="d-flex gap-3 ml-3">
              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() => this.toggle(round)}
                  ></i>
                </Link></Tooltip>

              <Tooltip title="Delete">
                <Link className="text-danger" to="#">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(round)}
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
    const { onGetRoundList, onGetgetschemelist, onGetgetsamplelist } = this.props;
    const userId = this.state.user_id;

    onGetRoundList(userId);
    onGetgetschemelist(userId);
    onGetgetsamplelist(userId); // Fetch the sample data here
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

  onClickDelete = RoundList => {
    this.setState({ RoundList: RoundList });
    this.setState({ deleteModal: true });
  };


  displaySuccessMessage = message => {
    this.setState({ successMessage: message });

    setTimeout(() => {
      this.setState({ successMessage: "", modal: false });
    }, 3000);
  }

  toggle(round) {
    console.log("data in case of update asjdhasdf", round)
    if (round && round.id) {
      this.setState({
        modal: true,
        selectedRound: {
          id: round.id,
          rounds: round.rounds,
          scheme: round.scheme,
          cycle_no: round.cycle_no,
          sample: round.sample,
          issue_date: round.issue_date
            ? moment(round.issue_date).format("YYYY-MM-DDTHH:mm")
            : "",
          closing_date: round.closing_date
            ? moment(round.closing_date).format("YYYY-MM-DDTHH:mm")
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
    if (!isEmpty(this.props.sample) && size(prevProps.sample) !== size(this.props.sample)) {
      this.setState({ sample: this.props.sample });
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
    const { RoundList, SchemeList, sample } = this.props;
    console.log('SchemeList in render:', SchemeList);
    console.log('Sample in render:', sample);

    const { isEdit, deleteModal } = this.state;
    const round = this.state.round;
    const { onGetRoundList, onGetgetschemelist, onGetgetsamplelist, onAddNewRound, onUpdateRound } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: RoundList.length,
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
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={RoundList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={RoundList}
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
                                            scheme: this.state.selectedRound ? this.state.selectedRound.scheme : "",
                                            cycle_no: this.state.selectedRound ? this.state.selectedRound.cycle_no : "",
                                            sample: this.state.selectedRound ? this.state.selectedRound.sample : "",
                                            issue_date: this.state.selectedRound ? this.state.selectedRound.issue_date : "",
                                            closing_date: this.state.selectedRound ? this.state.selectedRound.closing_date : "",
                                            // notes: this.state.selectedRound ? this.state.selectedRound.notes : "",
                                            status: this.state.selectedRound ? this.state.selectedRound.status : "Created",
                                            // added_by: this.state.selectedRound ? this.state.selectedRound.added_by : "",

                                          }}
                                          // validationSchema={Yup.object().shape({
                                          //   rounds: Yup.string().required("Select the number of rounds"),
                                          //   sample: Yup.string().required("Sample is required"),
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
                                              scheme: values.scheme,
                                              cycle_no: values.cycle_no,
                                              sample: values.sample,
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
                                            cycle,
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
                                                    <Label for="scheme">Scheme</Label>
                                                    <Field
                                                      as="select"
                                                      name="scheme"
                                                      className={"form-control" + (errors.scheme && touched.scheme ? " is-invalid" : "")}
                                                    >
                                                      <option value="">Select Scheme</option>
                                                      {SchemeList && SchemeList.filter(scheme => scheme.status === 'Active').map((scheme) => (
                                                        <option key={scheme.id} value={scheme.id}>
                                                          {scheme.name} {/* Display scheme_name */}
                                                        </option>
                                                      ))}
                                                    </Field>
                                                    <ErrorMessage name="scheme" component="div" className="invalid-feedback" />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Cycle number</Label>
                                                    <Field
                                                      name="cycle_no"
                                                      type="text"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage name="cycle_no" component="div" className="text-danger" />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label for="sample">Sample</Label>
                                                    <Field
                                                      as="select"
                                                      name="sample"
                                                      className={"form-control" + (errors.sample && touched.sample ? " is-invalid" : "")}
                                                    >
                                                      <option value="">Select Sample</option>
                                                      {sample && sample.map(sample => (
                                                        <option key={sample.id} value={sample.id}>{sample.
                                                          sampleno}</option>
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
                                                      type="datetime-local"
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
                                                      type="datetime-local"
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
  sample: PropTypes.array,
  className: PropTypes.any,
  onGetRoundList: PropTypes.func,
  onGetgetschemelist: PropTypes.func,
  onGetgetsamplelist: PropTypes.func,
  createInstrumentType: PropTypes.array,
  error: PropTypes.any,
  success: PropTypes.any,
  onAddNewRound: PropTypes.func,
  onUpdateRound: PropTypes.func,
  onDeleteRound: PropTypes.func,
};

const mapStateToProps = ({ RoundList, SchemeList, sample }) => ({
  RoundList: RoundList.RoundList,
  SchemeList: SchemeList.SchemeList,
  sample: sample.sample,

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetgetschemelist: id => dispatch(getSchemelist(id)),
  onGetgetsamplelist: id => dispatch(getSample(id)),
  onGetRoundList: id => dispatch(getroundlist(id)),
  onAddNewRound: (id, createround) => dispatch(addNewRoundList(id, createround)),
  onUpdateRound: (id, round) => dispatch(updateRoundList({ id, ...round })),
  onDeleteRound: round => dispatch(deleteRound(round)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InstrumentType));
