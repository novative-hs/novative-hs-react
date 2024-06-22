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
import { getschemelist } from "store/scheme/actions";
import { getSample } from "store/sample/actions";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getroundlist,
  addNewRoundList,
  updateRoundList,
} from "store/rounds/actions";

import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";
import moment from "moment";
class InstrumentType extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      selectedUnit: null,
      isEdit: false,
      RoundList: [],
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
        {
          dataField: "rounds",
          text: "Rounds",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "scheme",
          text: "Scheme",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "sample",
          text: "Sample",
          sort: true,
          filter: textFilter(),
        },
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
          ),
          filter: textFilter(),
        },
        {
          dataField: "notes",
          text: "Notes",
          sort: true,
          filter: textFilter(),
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
              ) : methodlist.status === "Issued" ? (
                <span>Issued</span>
              ) : methodlist.status === "Open" ? (
                <span>Open</span>
              ) : methodlist.status === "Saved" ? (
                <span>Saved</span>
              ) : methodlist.status === "Submitted" ? (
                <span>Submitted</span>
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
              Issued: "Issued",
              Open: "Open",
              Saved: "Saved",
              Submitted: "Submitted",
              Closed: "Closed",
              "Report Available": "Report Available",
            },
          }),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { onGetInstrumentTypeList, onGetgetschemelist } = this.props;
    const userId = this.state.user_id;

    onGetInstrumentTypeList(userId);
    onGetgetschemelist(userId);
  }

  // componentDidMount() {
  //   const { RoundList, onGetInstrumentTypeList, onGetgetschemelist } = this.props;
  //   onGetInstrumentTypeList(this.state.user_id);
  //   onGetgetschemelist(this.state.user_id);
  //   this.setState({ RoundList });
  // }

  displaySuccessMessage = message => {
    this.setState({ successMessage: message });

    setTimeout(() => {
      this.setState({ successMessage: "", modal: false });
    }, 3000);
  };
  toggle(unit) {
    if (unit && unit.id) {
      this.setState({
        modal: true,
        selectedUnit: {
          id: unit.id,
          added_by: unit.added_by,
          rounds: unit.rounds,
          scheme: unit.scheme,
          sample: unit.sample,
          issue_date: unit.issue_date
            ? moment(unit.issue_date).format("YYYY-MM-DDTHH:mm")
            : "",
          closing_date: unit.closing_date
            ? moment(unit.closing_date).format("YYYY-MM-DDTHH:mm")
            : "",
          notes: unit.notes,
          status: unit.status,
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

  render() {
    const { SearchBar } = Search;
    const { RoundList, SchemeList } = this.props;
    console.log("SchemeList in render:", SchemeList);

    const { onGetInstrumentTypeList, onGetgetschemelist, onGetgetsamplelist, onUpdateType } =
      this.props;

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
                                            rounds: this.state.selectedUnit
                                              ? this.state.selectedUnit.rounds
                                              : "",
                                            scheme: this.state.selectedUnit
                                              ? this.state.selectedUnit.scheme
                                              : "",
                                            sample: this.state.selectedUnit
                                              ? this.state.selectedUnit.sample
                                              : "",
                                            issue_date: this.state.selectedUnit
                                              ? this.state.selectedUnit
                                                  .issue_date
                                              : "",
                                            closing_date: this.state
                                              .selectedUnit
                                              ? this.state.selectedUnit
                                                  .closing_date
                                              : "",
                                            notes: this.state.selectedUnit
                                              ? this.state.selectedUnit.notes
                                              : "",

                                            status: this.state.selectedUnit
                                              ? this.state.selectedUnit.status
                                              : "Created",
                                            organization_id: this.state
                                              .selectedUnit
                                              ? this.state.selectedUnit
                                                  .organization_id
                                              : "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            rounds: Yup.string().required(
                                              "Select the number of rounds"
                                            ),
                                            scheme:
                                              Yup.string().required(
                                                "Scheme is required"
                                              ),
                                            sample:
                                              Yup.string().required(
                                                "Sample is required"
                                              ),
                                            issue_date: Yup.string().required(
                                              "Start Date is required"
                                            ),
                                            closing_date: Yup.string().required(
                                              "End Date is required"
                                            ),
                                            notes:
                                              Yup.string().required(
                                                "Notes are required"
                                              ),
                                          })}
                                          onSubmit={async (
                                            values,
                                            { setSubmitting }
                                          ) => {
                                            const userId = localStorage.getItem(
                                              "authUser"
                                            )
                                              ? JSON.parse(
                                                  localStorage.getItem(
                                                    "authUser"
                                                  )
                                                ).user_id
                                              : "";

                                            const newUnit = {
                                              rounds: values.rounds,
                                              scheme: values.scheme,
                                              sample: values.sample,
                                              issue_date: values.issue_date,
                                              closing_date: values.closing_date,
                                              notes: values.notes,
                                              status: values.status,
                                              added_by: userId,
                                            };

                                            try {
                                              if (this.state.isEdit) {
                                                await this.props.onUpdateType(
                                                  this.state.selectedUnit.id,
                                                  newUnit
                                                );
                                                this.displaySuccessMessage(
                                                  "Scheme updated successfully!"
                                                );
                                              } else {
                                                await this.props.onAddNewType(
                                                  newUnit
                                                );
                                                this.displaySuccessMessage(
                                                  "Scheme added successfully!"
                                                );
                                              }

                                              await this.props.onGetInstrumentTypeList(
                                                this.state.user_id
                                              );
                                            } catch (error) {
                                              console.error(
                                                "Error updating/adding schemes:",
                                                error
                                              );
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
                                                    <Label className="col-form-label">
                                                      Rounds
                                                    </Label>
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
                                                    <Label for="scheme">
                                                      Scheme
                                                    </Label>
                                                    <Field
                                                      as="select"
                                                      name="scheme"
                                                      className={
                                                        "form-control" +
                                                        (errors.scheme &&
                                                        touched.scheme
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    >
                                                      <option value="">
                                                        Select Scheme
                                                      </option>
                                                      {SchemeList &&
                                                        SchemeList.map(
                                                          scheme => (
                                                            <option
                                                              key={scheme.id}
                                                              value={scheme.id}
                                                            >
                                                              {
                                                                scheme.scheme_name
                                                              }
                                                            </option>
                                                          )
                                                        )}
                                                    </Field>
                                                    <ErrorMessage
                                                      name="scheme"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>{" "}
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">
                                                      Sample
                                                    </Label>
                                                    <Field
                                                      name="sample"
                                                      type="text"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage
                                                      name="sample"
                                                      component="div"
                                                      className="text-danger"
                                                    />
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
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">
                                                      Notes
                                                    </Label>
                                                    <Field
                                                      name="notes"
                                                      type="text"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage
                                                      name="notes"
                                                      component="div"
                                                      className="text-danger"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">
                                                      Status
                                                    </Label>
                                                    <Field
                                                      name="status"
                                                      as="select"
                                                      defaultValue="Created"
                                                      className="form-control"
                                                      multiple={false}
                                                    >
                                                      <option value="Created">
                                                        Created
                                                      </option>
                                                      <option value="Ready">
                                                        Ready
                                                      </option>
                                                      <option value="Issued">
                                                        Issued
                                                      </option>
                                                      <option value="Open">
                                                        Open
                                                      </option>
                                                      <option value="Saved">
                                                        Saved
                                                      </option>
                                                      <option value="Submitted">
                                                        Submitted
                                                      </option>
                                                      <option value="Closed">
                                                        Closed
                                                      </option>
                                                      <option value="Report Available">
                                                        Report Available
                                                      </option>
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
  className: PropTypes.any,
  onGetInstrumentTypeList: PropTypes.func,
  onGetgetschemelist: PropTypes.func,
  onGetgetsamplelist: PropTypes.func,
  createInstrumentType: PropTypes.array,
  error: PropTypes.any,
  success: PropTypes.any,
  onAddNewType: PropTypes.func,
  onUpdateType: PropTypes.func,
};

const mapStateToProps = ({ RoundList, SchemeList }) => ({
  RoundList: RoundList.RoundList,
  SchemeList: SchemeList.SchemeList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetgetschemelist: id => dispatch(getschemelist(id)),
  onGetgetsamplelist: id => dispatch(getSample(id)),
  onGetInstrumentTypeList: id => dispatch(getroundlist(id)),
  onAddNewType: (id, createUnit) => dispatch(addNewRoundList(id, createUnit)),
  onUpdateType: (id, methodlist) =>
    dispatch(updateRoundList({ id, ...methodlist })),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InstrumentType));
