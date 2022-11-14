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

import { getDonorAccountStatements } from "store/donor-account-statements/actions";

class DonorAccountStatements extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      donoraccountStatements: [],
      donoraccountStatement: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      donoraccountStatementColumn: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, donoraccountStatement) => (
            <>{donoraccountStatement.id}</>
          ),
        },
        {
          dataField: "PaidAt",
          text: "Payment Date",
          sort: true,
        },

        {
          dataField: "Particulars",
          text: "Particulars",
          sort: true,
        formatter: (cellContent, donoraccountStatement) => (
          <>
            <span>
              <span>
                {donoraccountStatement.paymentin}{""},
                {donoraccountStatement.testappointment}{""},
                {donoraccountStatement.PaidMethod}{" "}
                {donoraccountStatement.payment_type}{" "}
                {donoraccountStatement.bank_name}{" "}
                {donoraccountStatement.account_no}{" "}
                {donoraccountStatement.cheque_no}{" "}
                {donoraccountStatement.refered_no}


              </span>
            </span>
          </>
        ),
        },
        {
          dataField: "Status",
          text: "Status of Respective Form",
          sort: true,
        },
        {
          dataField: "transaction_type",
          text: "Transaction Type",
          sort: true,
        },
        {
          dataField: "Credit",
          text: "Credit",
          sort: true,
        },
        {
          dataField: "Debit",
          text: "Debit",
          sort: true,
        },
        {
          dataField: "Balance",
          text: "Balance",
          sort: true,
        formatter: (cellContent, donoraccountStatement) => (
          <>
            <span>
              <span>
                {donoraccountStatement.Balance}{""}
              </span>
            </span>
          </>
        ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { onGetDonorAccountStatements } = this.props;
    onGetDonorAccountStatements(this.state.user_id);
    this.setState({ donoraccountStatements: this.props.donoraccountStatements });
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

    const { donoraccountStatements } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: donoraccountStatements.length, // replace later with size(donoraccountStatements),
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
            <title>Donor Account Statements | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Donor" breadcrumbItem="Account Statements" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.donoraccountStatementColumn}
                      data={donoraccountStatements}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.donoraccountStatementColumn}
                          data={donoraccountStatements}
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
                                      classes={
                                        "table align-middle table-nowrap table-hover"
                                      }
                                      bordered={false}
                                      striped={false}
                                      headerWrapperClasses={"table-light"}
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

DonorAccountStatements.propTypes = {
  match: PropTypes.object,
  donoraccountStatements: PropTypes.array,
  className: PropTypes.any,
  onGetDonorAccountStatements: PropTypes.func,
};

const mapStateToProps = ({ donoraccountStatements }) => ({
  donoraccountStatements: donoraccountStatements.donoraccountStatements,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetDonorAccountStatements: id => dispatch(getDonorAccountStatements(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DonorAccountStatements));
