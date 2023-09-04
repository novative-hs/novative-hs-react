import React, { Component, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  ModalHeader,
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
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";

//Import Breadcrumb
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getDonors,
} from "store/inpayments/actions";



class donors extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      donors: [],
      id: "",
      donors: "",
      btnText: "Copy",
      donors: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      labsListListColumns: [

        {
          dataField: "id",
          text: "Donor ID",
          sort: true,
          formatter: (cellContent, donors) => (
            <>
              <strong>{donors.id}</strong>
            </>
          ),
        },
        {
          dataField: "name",
          text: "Donor Name",
          sort: true,
          formatter: (cellContent, donors) => (
            <>
              <strong>{donors.name}</strong>
            </>
          ),filter: textFilter(), // Add a text filter for this column
          // formatter: (cellContent, donors) => (
          //   <>
          //     <span>
          //         <Link
          //           to="#"
          //           onClick={e => this.openPatientModal(e, donors)}
          //         >
          //          {donors.name}
          //         </Link>
          //     </span>
          //   </>
          // ),
        },
        {
          dataField: "phone",
          text: "Phone",
          sort: true,
          formatter: (cellContent, donors) => (
            <>
              <strong>{donors.phone}</strong>
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
          formatter: (cellContent, donors) => (
            <>
              <strong>{donors.email}</strong>
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "city",
          text: "City",
          sort: true,
          formatter: (cellContent, donors) => (
            <>
              <strong>{donors.city}</strong>
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "type",
          text: "Type",
          sort: true,
          formatter: (cellContent, donors) => (
            <>
              <strong>{donors.type}</strong>
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "current_amount",
          text: "Current Amount",
          sort: true,
          formatter: (cellContent, donors) => (
            <p className="text-end">
            {donors.current_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "account_no",
          text: "Account Statement",
          sort: true,
          formatter: (cellContent, donors) => (
            <Link to={`/account-statement-donor/${donors.account_id}`}>
                                    Account statement
                                  </Link>
          ),filter: textFilter(), // Add a text filter for this column
        },
      ],
    };
  }

  // componentDidMount() {
  //   const { donors, onGetdonors } = this.props;
  //   console.log(onGetdonors());
  //   this.setState({ donors });
  // }
  componentDidMount() {
    const { donors, onGetdonors } = this.props;
    onGetdonors(this.state.user_id);
    console.log(onGetdonors());
    this.setState({ donors });
  }
  // componentDidMount() {
  //   const { b2bAllClients, onGetB2bAllClientsList } = this.props;
  //   onGetB2bAllClientsList(this.state.user_id);
  //   this.setState({ b2bAllClients });
  // }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      lab_address: arg.type,
      lab_city: arg.city,
      lab_phone: arg.phone,
      lab_email: arg.email,
    });
  };
  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
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

    const { donors } = this.props;
    const data = this.state.data;
    const { onGetdonors } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: donors.length, // replace later with size(donors),
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
            <title>Labs List | Lab Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Marketer Admin" breadcrumbItem="Labs List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.labsListListColumns}
                      data={donors}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.labsListListColumns}
                          data={donors}
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
                                      filter={filterFactory()} // Enable filtering for the entire table
                                    />
                                      <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.togglePatientModal}
                                        tag="h4"
                                      >
                                        <span></span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Type
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_address
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      City
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_city
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      email
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_email
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Contact No.
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_phone
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>

                                                  <div className="col-md-3">
                                                    <button
                                                      type="button"
                                                      className="btn btn-secondary"
                                                      onClick={() => {
                                                        navigator.clipboard.writeText(
                                                          this.state
                                                            .lab_phone
                                                        );
                                                        this.setState({
                                                          btnText: "Copied",
                                                        });
                                                      }}
                                                    >
                                                      {this.state.btnText}
                                                    </button>
                                                  </div>
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
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

donors.propTypes = {
  match: PropTypes.object,
  donors: PropTypes.array,
  className: PropTypes.any,
  onGetdonors: PropTypes.func,
};
const mapStateToProps = ({ labsList}) => ({
  donors: labsList.donors,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetdonors: () => dispatch(getDonors()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(donors));
