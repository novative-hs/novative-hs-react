import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Modal,
  ModalBody,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getPatientsList } from "store/patients-list/actions";
import "assets/scss/table.scss";

class PatientsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      patients: [],
      // id: "",
      patient: "",
      guest_id:"",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      b2bAllClientListColumns: [
        {
          dataField: "account_id",
          text: "Patient ID",
          sort: true,
          formatter: (cellContent, patient) => (
            <>
              <strong>{patient.account_id}</strong>
            </>
          ),
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
          formatter: (cellContent, patient) => (
            <>
              {/* {patientTestAppointment.payment_status == "Not Paid" ? ( */}
              <Link to={`/nearby-labs/${patient.account_id}`}>
                {patient.name}
              </Link>
            </>
          ),
        },
        {
          dataField: "phone",
          text: "Phone",
          sort: true,
        },
        {
          dataField: "city",
          text: "City",
          sort: true,
        },
        // {
        //   dataField: "website_url",
        //   text: "Website",
        //   sort: true,
        //   formatter: (cellContent, patient) => (
        //     <>
        //       <Link
        //         to={{
        //           pathname: patient.website_url,
        //         }}
        //         target="_blank"
        //       >
        //         {patient.website_url}
        //       </Link>
        //     </>
        //   ),
        // },
      
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { patients, onGetPatientsList } = this.props;
    onGetPatientsList(this.state.user_id);
    this.setState({ patients });
    console.log("guest", this.props.match.params.guest_id)
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

    const { patients } = this.props;
    const { onGetPatientsList } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: patients.length, // replace later with size(patients),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>B2B Clients List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="B2B Client" breadcrumbItem=" List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.b2bAllClientListColumns}
                      data={patients}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.b2bAllClientListColumns}
                          data={patients}
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
                                    />
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    ></Modal>
                                  </div>
                                </Col>
                              </Row>
                              {/* <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row> */}
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

PatientsList.propTypes = {
  match: PropTypes.object,
  patients: PropTypes.array,
  className: PropTypes.any,
  onGetPatientsList: PropTypes.func,
};
const mapStateToProps = ({ patients }) => ({
  patients: patients.patientsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetPatientsList: id => dispatch(getPatientsList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PatientsList));
