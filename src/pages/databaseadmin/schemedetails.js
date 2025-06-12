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
import {
  getAllLabs,
  // getParticipantCount,
} from "store/registration-admin/actions";

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
      schemes: [], // Initialize schemes as an empty array
      structuredData: [], // Also initialize structuredData
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
      schemeFilters: {}, // ✅ holds filters like { scheme12A: "", newww: "" }
      provinceFilter: "",
      cityFilter: "",
      districtFilter: "",
    };
  }
  openParticipantList = (schemeName) => {
    console.log("Looking for scheme:", schemeName);

    const scheme = this.state.SchemeList.find(
      (s) => s.name.trim().toLowerCase() === schemeName.trim().toLowerCase()
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
    this.setState((prevState) => ({
      LabModal: !prevState.LabModal,
    }));
  };

  componentDidMount() {
    const { user_id } = this.state;
    if (!user_id) {
      console.error("User ID is missing. Cannot proceed with API calls.");
      return;
    }

    // Call fetchData to fetch AllLabs
    this.fetchData(user_id);

    const { onGetScheme } = this.props;
    onGetScheme(user_id); // Fetch schemes
  }
  fetchData(user_id) {
    const { onGetPendingLabs } = this.props;

    if (onGetPendingLabs) {
      console.log("Calling getAllLabs API with user_id:", user_id);
      onGetPendingLabs(user_id); // Call the action
    } else {
      console.error("onGetPendingLabs action is not available.");
    }
  }

  handleFilterChange = (filterName, e, isScheme = false) => {
    const value = e.target.value;

    if (isScheme) {
      this.setState((prevState) => ({
        schemeFilters: {
          ...prevState.schemeFilters,
          [filterName]: value,
        },
      }));
    } else {
      this.setState({ [filterName]: value });
    }
  };

  componentDidUpdate(prevProps) {
    const { SchemeList } = this.props;

    if (prevProps.SchemeList !== SchemeList) {
      console.log("Received SchemeList:", SchemeList);

      const schemes = SchemeList.map((s) => s.name);

      // Create a map to accumulate rows by province/city/district
      const regionMap = {};

      SchemeList.forEach((scheme) => {
        const schemeName = scheme.name;
        const labs = Array.isArray(scheme.labs) ? scheme.labs : [];

        labs.forEach((lab) => {
          const key = `${lab.province}|${lab.city}|${lab.district}`;
          if (!regionMap[key]) {
            regionMap[key] = {
              province: lab.province,
              city: lab.city,
              district: lab.district,
            };
          }

          // Increment count for this scheme in the region
          regionMap[key][schemeName] = (regionMap[key][schemeName] || 0) + 1;
        });
      });

      const structuredData = Object.values(regionMap);

      this.setState({ schemes, structuredData });
    }
  }
  generateColumns() {
    const { schemes } = this.state;

    const fixedColumns = [
      {
        dataField: "province",
        text: "Province",
        sort: true,
        headerFormatter: (column, colIndex) => (
          <div style={{ textAlign: "center" }}>
            <div style={{ marginTop: "5px" }}>
              <input
                type="text"
                value={this.state.provinceFilter}
                onChange={(e) => this.handleFilterChange("provinceFilter", e)}
                className="form-control"
                style={{
                  textAlign: "center",
                  width: "100px",
                  margin: "auto",
                }}
              />
            </div>
            <div>{column.text}</div>
          </div>
        ),
        style: { textAlign: "center" },
      },
      {
        dataField: "city",
        text: "City",
        sort: true,
        headerFormatter: (column, colIndex) => (
          <div style={{ textAlign: "center" }}>
            <div style={{ marginTop: "5px" }}>
              <input
                type="text"
                value={this.state.cityFilter}
                onChange={(e) => this.handleFilterChange("cityFilter", e)}
                className="form-control"
                style={{
                  textAlign: "center",
                  width: "100px",
                  margin: "auto",
                }}
              />
            </div>
            <div>{column.text}</div>
          </div>
        ),
        style: { textAlign: "center" },
      },
      {
        dataField: "district",
        text: "District",
        sort: true,
        headerFormatter: (column, colIndex) => (
          <div style={{ textAlign: "center" }}>
            <div style={{ marginTop: "5px" }}>
              <input
                type="text"
                value={this.state.districtFilter}
                onChange={(e) => this.handleFilterChange("districtFilter", e)}
                className="form-control"
                style={{
                  textAlign: "center",
                  width: "100px",
                  margin: "auto",
                }}
              />
            </div>
            <div>{column.text}</div>
          </div>
        ),
        style: { textAlign: "center" },
      },
    ];

    const dynamicColumns = (schemes || []).map((scheme) => ({
      dataField: scheme,
      text: scheme,
      sort: true,
      style: { textAlign: "center" },
      headerStyle: { textAlign: "center", minWidth: "100px" },
      headerFormatter: (column, colIndex) => {
        const { structuredData = [] } = this.state;

        // Calculate total labs across districts for this scheme
        let totalCount = 0;
        structuredData.forEach((row) => {
          const count = parseInt(row[scheme], 10);
          if (!isNaN(count)) totalCount += count;
        });

        return (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: "bold" }}>{column.text}</div>
            <div style={{ fontSize: "12px", color: "#555" }}>
              Total: {totalCount}
            </div>
          </div>
        );
      },
      formatter: (cell, row) => {
        const count = parseInt(cell, 10);
        if (!count) return <span>--</span>;
        return (
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => this.openCountModal(row, scheme)}
          >
            {count}
          </span>
        );
      },
    }));

    return [...fixedColumns, ...dynamicColumns];
  }
  openCountModal = (row, schemeName) => {
    const { SchemeList } = this.props;

    const scheme = SchemeList.find((s) => s.name === schemeName);
    if (!scheme) return;

    const selectedParticipants = (scheme.labs || []).filter(
      (lab) =>
        lab.province === row.province &&
        lab.city === row.city &&
        lab.district === row.district
    );

    this.setState({
      selectedParticipants,
      modalProvince: row.province,
      modalCity: row.city,
      modalDistrict: row.district,
      modalSchemeName: schemeName,
      LabModal: true,
    });
  };

  generateSchemeColumns() {
    const { schemes } = this.state;

    if (!schemes || !Array.isArray(schemes)) {
      return []; // Return an empty array if schemes is not valid
    }

    return schemes.map((scheme) => ({
      dataField: scheme,
      text: scheme,
      sort: true,
      style: { textAlign: "center" },
    }));
  }
  fetchData(user_id) {
    const { onGetPendingLabs } = this.props;

    if (onGetPendingLabs) onGetPendingLabs(user_id);
  }

  onPaginationPageChange = (page) => {
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
    const { SchemeList } = this.props;
    const {
      provinceFilter = "",
      cityFilter = "",
      districtFilter = "",
      schemeFilters = {},
      structuredData = [],
    } = this.state;

    // Loading state if structuredData is empty
    if (!structuredData || structuredData.length === 0) {
      return <div>Loading...</div>;
    }

    // Generate columns dynamically
    const allColumns = this.generateColumns();

    console.log("Structured Data:", structuredData);
    console.log("Generated Columns:", allColumns);

    // Filter data based on filters
    const filteredData = structuredData.filter((entry) => {
      const province = entry.province?.toLowerCase() || "";
      const city = entry.city?.toLowerCase() || "";
      const district = entry.district?.toLowerCase() || "";

      // Location filters
      const matchesProvince = province.includes(
        this.state.provinceFilter.toLowerCase()
      );
      const matchesCity = city.includes(this.state.cityFilter.toLowerCase());
      const matchesDistrict = district.includes(
        this.state.districtFilter.toLowerCase()
      );

      // Scheme filters
      const matchesSchemes = Object.entries(schemeFilters).every(
        ([scheme, filterVal]) => {
          if (!filterVal) return true; // skip empty filters
          const count = entry[scheme] || 0;
          return count.toString().includes(filterVal); // allow partial match
        }
      );

      return (
        matchesProvince && matchesCity && matchesDistrict && matchesSchemes
      );
    });

    const pageOptions = {
      sizePerPage: 50,
      totalSize: filteredData.length,
      custom: true,
    };
    const defaultSorted = [{ dataField: "province", order: "asc" }];
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Scheme List | NEQAS</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs
              title="Scheme Details"
              breadcrumbItem="Scheme Details"
            />
            <Row className="justify-content-center">
              <Col lg="10">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory({
                        sizePerPage: 50,
                        totalSize: filteredData.length,
                        showTotal: true,
                        custom: true,
                      })}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          data={filteredData}
                          columns={allColumns}
                          search
                        >
                          {(toolkitProps) => (
                            <div>
                              <div className="table-responsive">
                                <BootstrapTable
                                  bootstrap4
                                  bordered
                                  hover
                                  striped
                                  headerWrapperClasses="table-light"
                                  defaultSorted={defaultSorted}
                                  {...toolkitProps.baseProps}
                                  {...paginationTableProps}
                                  filter={filterFactory()}
                                />
                              </div>

                              <Modal
                                isOpen={this.state.LabModal}
                                toggle={this.toggleLabModal}
                              >
                                <ModalHeader
                                  toggle={this.toggleLabModal}
                                  tag="h4"
                                >
                                  Participants in {this.state.modalProvince},{" "}
                                  {this.state.modalDistrict},{" "}
                                  {this.state.modalCity} for{" "}
                                  <strong>{this.state.modalSchemeName}</strong>
                                </ModalHeader>

                                <ModalBody>
                                  {this.state.selectedParticipants.length ===
                                  0 ? (
                                    <p>
                                      No participants found in this location.
                                    </p>
                                  ) : (
                                    <ul>
                                      {this.state.selectedParticipants.map(
                                        (participant, idx) => (
                                          <li key={idx}>
                                            {participant.name || "Unnamed Lab"}
                                            {participant.id
                                              ? ` (ID: ${participant.id})`
                                              : ""}
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  )}
                                </ModalBody>
                              </Modal>

                              <PaginationListStandalone {...paginationProps} />
                            </div>
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
  onGetPendingLabs: PropTypes.func,
};

const mapStateToProps = (state) => {
  console.log("SchemeDetailsReport mapStateToProps state:", state);

  // Check if the required slices exist in the state
  if (!state.SchemeList || !state.registrationAdmin) {
    console.error("Required slices missing from Redux state");
    return {
      SchemeList: [],
      AllLabs: [],
    };
  }

  // Extract required properties with fallback to default values
  const SchemeList = state.SchemeList.SchemeList || [];
  const AllLabs = state.registrationAdmin.AllLabs || [];

  // Logging for debugging purposes
  console.log("SchemeDetailsReport mapStateToProps - SchemeList:", SchemeList);
  console.log("SchemeDetailsReport mapStateToProps - AllLabs:", AllLabs);

  return {
    SchemeList,
    AllLabs,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetScheme: (id) => dispatch(getSchemelist(id)),
  onGetPendingLabs: (user_id) => dispatch(getAllLabs(user_id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SchemeDetailsReport));
