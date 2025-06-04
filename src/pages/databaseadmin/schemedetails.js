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
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
// import DeleteModal from "components/Common/DeleteModal";

import { getSchemelist } from "store/scheme/actions";

import { isEmpty, size } from "lodash";
import DeleteModal from "components/Common/DeleteModal";
import "assets/scss/table.scss";
import moment from "moment";
class SchemeDetailsReport extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      idFilter: "",
      nameFilter: "",
      priceFilter: "",
      dateofadditionFilter: "",
      noofanalytesFilter: "",
      addedbyFilter: "",
      statusFilter: "",
      analytetypeFilter: "",
      SchemeList: [],
      analyte: "",
      modal: false,
      // Add these for your modal
      selectedParticipants: [],
      LabModal: false,
      modalSchemeName: "",
      AllLabs: [],
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      ReagentsListColumns: [
        {
          dataField: "name",
          text: "Scheme Name",
          sort: true,
          // filter: textFilter(),
          style: { textAlign: "left" },
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "left",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.nameFilter}
                    onChange={e => this.handleFilterChange("nameFilter", e)}
                    className="form-control"
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
        },
        {
          dataField: "lab_count",
          text: "Labs Count",
          sort: true,
          style: { textAlign: "center", cursor: "pointer" },
          headerFormatter: (column, colIndex) => {
            return (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.labCountFilter}
                    onChange={e => this.handleFilterChange("labCountFilter", e)}
                    className="form-control"
                    style={{ width: "80px", textAlign: "center" }}
                    // We want the click on the input to be for filtering, no modal here
                  />
                </div>
                <div style={{ textAlign: "center", marginTop: "5px" }}>
                  {column.text}
                </div>
              </>
            );
          },
          formatter: (cell, row) => {
            return (
              <span
                onClick={() => this.openParticipantList(row.name)} // ✅ pass scheme name only
                style={{
                  color: "blue",
                  cursor: "pointer",
                }}
                title="Click to view labs"
              >
                {cell}
              </span>
            );
          },
        },
        {
          dataField: "province",
          text: "Province",
          sort: true,
          style: { textAlign: "center" },
          formatter: (cell, row) => {
            // Return first location_summary province or empty string if none
            return row.location_summary && row.location_summary.length > 0
              ? row.location_summary[0].province
              : "";
          },
          headerFormatter: (column, colIndex) => (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  value={this.state.provinceFilter}
                  onChange={e => this.handleFilterChange("provinceFilter", e)}
                  className="form-control"
                  style={{ width: "100px", textAlign: "center" }}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "5px" }}>
                {column.text}
              </div>
            </>
          ),
        },
        {
          dataField: "city",
          text: "City",
          sort: true,
          style: { textAlign: "center" },
          formatter: (cell, row) => {
            return row.location_summary && row.location_summary.length > 0
              ? row.location_summary[0].city
              : "";
          },
          headerFormatter: (column, colIndex) => (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  value={this.state.cityFilter}
                  onChange={e => this.handleFilterChange("cityFilter", e)}
                  className="form-control"
                  style={{ width: "100px", textAlign: "center" }}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "5px" }}>
                {column.text}
              </div>
            </>
          ),
        },
        {
          dataField: "district",
          text: "District",
          sort: true,
          style: { textAlign: "center" },
          formatter: (cell, row) => {
            return row.location_summary && row.location_summary.length > 0
              ? row.location_summary[0].district
              : "";
          },
          headerFormatter: (column, colIndex) => (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  value={this.state.districtFilter}
                  onChange={e => this.handleFilterChange("districtFilter", e)}
                  className="form-control"
                  style={{ width: "100px", textAlign: "center" }}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "5px" }}>
                {column.text}
              </div>
            </>
          ),
        },
      ],
    };
  }
  openParticipantList = schemeName => {
    console.log("Looking for scheme:", schemeName);

    const scheme = this.state.SchemeList.find(
      s => s.name.trim().toLowerCase() === schemeName.trim().toLowerCase()
    );

    console.log("Scheme found:", scheme);

    const selectedParticipants = scheme?.labs || [];

    console.log("Selected participants:", selectedParticipants);

    this.setState({
      selectedParticipants,
      LabModal: true,
      modalSchemeName: schemeName,
    });
  };

  toggleLabModal = () => {
    this.setState(prevState => ({
      LabModal: !prevState.LabModal,
    }));
  };

  componentDidMount() {
    const { user_id } = this.state;
    if (!user_id) {
      console.error("User ID is missing. Cannot proceed with API calls.");
      return;
    }
    const { organization_name } = this.props.match.params || {};
    if (organization_name) {
      this.setState({ organization_name });
    }
    const { SchemeList, onGetScheme } = this.props;
    onGetScheme(this.state.user_id);
    this.setState({ SchemeList });
  }

  handleFilterChange = (filterName, e) => {
    this.setState({ [filterName]: e.target.value });
  };
  componentDidUpdate(prevProps) {
    const { AllLabs, SchemeList } = this.props;

    // Debug AllLabs
    if (
      (!isEmpty(AllLabs) && size(prevProps.AllLabs) !== size(AllLabs)) ||
      prevProps.AllLabs !== AllLabs
    ) {
      console.log("✅ Loaded AllLabs:", AllLabs); // You'll see this now
      this.setState({ AllLabs: AllLabs || [], isEdit: false });
    }

    // Debug SchemeList
    if (
      (!isEmpty(SchemeList) &&
        size(prevProps.SchemeList) !== size(SchemeList)) ||
      prevProps.SchemeList !== SchemeList
    ) {
      console.log("📦 Loaded SchemeList:", SchemeList); // 👈 Log scheme list
      this.setState({ SchemeList: SchemeList || [], isEdit: false });
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

  render() {
    const { SearchBar } = Search;
    const { SchemeList } = this.props;

    const {
      nameFilter = "",
      labCountFilter = "",
      provinceFilter = "",
      cityFilter = "",
      districtFilter = "",
    } = this.state;

    const filteredData = SchemeList.filter(entry => {
      // Modify accordingly for each filter condition
      const name = entry.name ? entry.name.toString().toLowerCase() : "";
      const lab_count = entry.lab_count
        ? entry.lab_count.toString().toLowerCase()
        : "";
      const province = entry.province
        ? entry.province.toString().toLowerCase()
        : "";
      const district = entry.district
        ? entry.district.toString().toLowerCase()
        : "";
      const city = entry.city ? entry.city.toString().toLowerCase() : "";

      return (
        name.includes(nameFilter.toLowerCase()) &&
        lab_count.includes(labCountFilter.toLowerCase()) &&
        province.includes(provinceFilter.toLowerCase()) &&
        district.includes(districtFilter.toLowerCase()) &&
        city.includes(cityFilter.toLowerCase())
      );
    });

    const { isEdit, deleteModal } = this.state;
    const { onGetScheme } = this.props;

    const pageOptions = {
      sizePerPage: 50,
      totalSize: filteredData.length,
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "province",
        order: "asc",
      },
    ];

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Scheme List | NEQAS</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Scheme Details"
              breadcrumbItem="Scheme Details"
            />
            <Row className="justify-content-center">
              <Col lg="10">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.ReagentsListColumns}
                      data={filteredData}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.ReagentsListColumns}
                          data={filteredData}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
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
                                      filter={filterFactory()}
                                    />
                                    <Modal
                                      isOpen={this.state.LabModal}
                                      toggle={this.toggleLabModal}
                                    >
                                      <ModalHeader toggle={this.toggleLabModal}>
                                        Participants for Scheme:{" "}
                                        {this.state.modalSchemeName}
                                      </ModalHeader>

                                      <ModalBody>
                                        {this.state.selectedParticipants
                                          .length === 0 ? (
                                          <p>No participants found.</p>
                                        ) : (
                                          <ul>
                                            {this.state.selectedParticipants.map(
                                              (lab, idx) => (
                                                <li key={idx}>
                                                  {lab.name || "Unnamed Lab"}
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        )}
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

SchemeDetailsReport.propTypes = {
  match: PropTypes.object,
  AllLabs: PropTypes.array,
  SchemeList: PropTypes.array,
  className: PropTypes.any,
  createInstrumentType: PropTypes.array,
  onGetScheme: PropTypes.func,
};

const mapStateToProps = ({ SchemeList }) => ({
  SchemeList: SchemeList.SchemeList,
  AllLabs: SchemeList.AllLabs, // ✅ this line is required
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetScheme: id => dispatch(getSchemelist(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SchemeDetailsReport));