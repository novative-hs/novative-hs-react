import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import {
  getPatientTestAppointmentsCompletedList,
} from "store/patient-test-appointments/actions";

class PatientTestAppointmentsCompletedList extends Component {
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
          dataField: "patient_age",
          text: "Age",
          sort: true,
        },
        {
          dataField: "patient_gender",
          text: "Gender",
          sort: true,
        },
        {
          dataField: "offered_test_name",
          text: "Offered test ",
          sort: true,
        },
        {
          dataField: "booking_date_time",
          text: "Booking date time",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              <span>
                {new Date(patientTestAppointment.booking_date_time).toLocaleString(
                  "en-US"
                )}
              </span>
            </>
          ),
        },
        {
          dataField: "requested_appointment_date_time",
          text: "Requested appointment date time",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              <span>
                {new Date(
                  patientTestAppointment.requested_appointment_date_time
                ).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        {
          dataField: "sample_collection_date_time",
          text: "Sample collection date time",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              <span>
                {new Date(
                  patientTestAppointment.sample_collection_date_time
                ).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        {
          dataField: "result_upload_date_time",
          text: "Result upload date time",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              <span>
                {new Date(
                  patientTestAppointment.result_upload_date_time
                ).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        {
          dataField: "http://127.0.0.1:8000" + "result",
          text: "Result",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              <Link
                to={{
                  pathname: "http://127.0.0.1:8000" + patientTestAppointment.result,
                }}
                target="_blank"
              >
                Test Result
              </Link>
            </>
          ),
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
        },        
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { patientTestAppointments, onGetPatientTestAppointmentsCompletedList } = this.props;
    if (patientTestAppointments && !patientTestAppointments.length) {
      setTimeout(() => {
        onGetPatientTestAppointmentsCompletedList();
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
            <Breadcrumbs
              title="Test Appointments"
              breadcrumbItem="Completed List"
            />
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

PatientTestAppointmentsCompletedList.propTypes = {
  match: PropTypes.object,
  patientTestAppointments: PropTypes.array,
  className: PropTypes.any,
  onGetPatientTestAppointmentsCompletedList: PropTypes.func,
};

const mapStateToProps = ({ patientTestAppointments }) => ({
  patientTestAppointments: patientTestAppointments.patientTestAppointmentsCompletedList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetPatientTestAppointmentsCompletedList: () =>
    dispatch(getPatientTestAppointmentsCompletedList(ownProps.match.params.id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PatientTestAppointmentsCompletedList));
