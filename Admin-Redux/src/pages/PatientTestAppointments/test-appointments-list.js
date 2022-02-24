import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Button } from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getPatientTestAppointmentsList } from "store/patient-test-appointments/actions";

class TestAppointmentsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      patientTestAppointments: [],
      patientTestAppointment: "",
      patientTestAppointmentListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>{patientTestAppointment.id}</>
          ),
        },
        {
          dataField: "patient_name",
          text: "Patient",
          sort: true,
        },
        {
          dataField: "test_name",
          text: "Test name",
          sort: true,
        },
        {
          dataField: "booking_date_time",
          text: "Appointment booked on",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              <span>
                {new Date(
                  patientTestAppointment.booking_date_time
                ).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        {
          dataField: "sample_collection_date_time",
          text: "Estimated sample collection",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.status == "Pending" ? (
                <span>Not available yet</span>
              ) : null}

              {patientTestAppointment.status != "Pending" ? (
                <span>
                  {new Date(
                    patientTestAppointment.sample_collection_date_time
                  ).toLocaleString("en-US")}
                </span>
              ) : null}
            </>
          ),
        },
        {
          dataField: "result_upload_date_time",
          text: "Estimated result upload",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.status == "Pending" ? (
                <span>Not available yet</span>
              ) : null}

              {patientTestAppointment.status != "Pending" ? (
                <span>
                  {new Date(
                    patientTestAppointment.result_upload_date_time
                  ).toLocaleString("en-US")}
                </span>
              ) : null}
            </>
          ),
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.status == "Pending" ? (
                <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
                  {patientTestAppointment.status}
                </span>
              ) : null}

              {patientTestAppointment.status == "Confirmed" ? (
                <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-info">
                  {patientTestAppointment.status}
                </span>
              ) : null}

              {patientTestAppointment.status == "Sample Collected" ? (
                <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-warning">
                  {patientTestAppointment.status}
                </span>
              ) : null}

              {patientTestAppointment.status == "Result Uploaded" ? (
                <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-success">
                  {patientTestAppointment.status}
                </span>
              ) : null}
            </>
          ),
        },
        {
          dataField: "http://127.0.0.1:8000" + "result",
          text: "Result",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.status == "Result Uploaded" ? (
                <Link
                  to={{
                    pathname:
                      "http://127.0.0.1:8000" + patientTestAppointment.result,
                  }}
                  target="_blank"
                >
                  Test Result
                </Link>
              ) : (
                <span>Not uploaded</span>
              )}
            </>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { patientTestAppointments, onGetPatientTestAppointmentsList } =
      this.props;
    if (patientTestAppointments && !patientTestAppointments.length) {
      setTimeout(() => {
        onGetPatientTestAppointmentsList();
      }, 3000);
    }
    this.setState({ patientTestAppointments });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
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

  render() {
    const { SearchBar } = Search;

    const { patientTestAppointments } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: patientTestAppointments.length, // replace later with size(patientTestAppointments),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const selectRow = {
      mode: "checkbox",
    };

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Test Appointments List | Ilaaj4u</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Test Appointments" breadcrumbItem=" List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.patientTestAppointmentListColumns}
                      data={patientTestAppointments}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.patientTestAppointmentListColumns}
                          data={patientTestAppointments}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      selectRow={selectRow}
                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-nowrap table-hover"
                                      }
                                      bordered={false}
                                      striped={false}
                                      responsive
                                      ref={this.node}
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

TestAppointmentsList.propTypes = {
  match: PropTypes.object,
  patientTestAppointments: PropTypes.array,
  className: PropTypes.any,
  onGetPatientTestAppointmentsList: PropTypes.func,
};

const mapStateToProps = ({ patientTestAppointments }) => ({
  patientTestAppointments: patientTestAppointments.patientTestAppointmentsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetPatientTestAppointmentsList: () =>
    dispatch(getPatientTestAppointmentsList(ownProps.match.params.id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestAppointmentsList));
