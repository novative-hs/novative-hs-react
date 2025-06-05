import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {
  Alert,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import Breadcrumbs from "components/Common/Breadcrumb";
import ApproveUnapproveModal from "components/Common/ApproveUnapproveModal";

import {
  getAllLabs,
  approveUnapproveLab,
  getApprovedLabs,
  getcyclelist,
  // getParticipantCount,
} from "store/registration-admin/actions";

import "assets/scss/table.scss";

class Membershipstatusreport extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();

    this.state = {
      AllLabs: [],
      approvedLabs: [],
      selectedParticipants: [],
      LabModal: false, // ✅ Make sure it's false initially
      CycleList: [],
      filteredCycleList: [],
      filteredLabs: [],
      selectedParticipantType: "All Participant",
      selectedScheme: null,
      organization_name: "",
      unapprovedModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      pendingLabListColumns: [
        {
          dataField: "province",
          text: "Province",
          sort: true,
          headerStyle: { textAlign: "center" },
          style: { textAlign: "left" },
          filter: textFilter(),
          formatter: (cellContent, lab) => (
            <span
              style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "10px",
                color: "#000", // Force black text
              }}
            >
              {lab.province}
            </span>
          ),
        },
        {
          dataField: "district",
          text: "District",
          sort: true,
          headerStyle: { textAlign: "center" },
          style: { textAlign: "left" },
          filter: textFilter(),
          formatter: (cellContent, lab) => (
            <span
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              {lab.district}
            </span>
          ),
        },
        {
          dataField: "city",
          text: "City",
          sort: true,
          headerStyle: { textAlign: "center" },
          style: { textAlign: "left" },
          filter: textFilter(),
          formatter: (cellContent, lab) => (
            <span
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              {lab.city}
            </span>
          ),
        },
        {
          dataField: "total_labs",
          text: "Total Labs",
          sort: true,
          headerStyle: { textAlign: "center", backgroundColor: "#fff3cd" }, // Light Yellow
          style: { backgroundColor: "#fff3cd", textAlign: "center" },
          filter: textFilter(),
          formatter: (cellContent, lab) => (
            <span
              style={{
                cursor: "pointer",
                color: "blue",
              }}
              onClick={() =>
                this.openParticipantList(lab.province, lab.district, lab.city)
              }
            >
              {lab.total_labs}
            </span>
          ),
        },
        {
          dataField: "new_register_labs",
          text: "New Register",
          sort: true,
          headerStyle: { textAlign: "center", backgroundColor: "#e3f2fd" }, // Light Blue
          style: { backgroundColor: "#e3f2fd", textAlign: "left" },
          filter: textFilter(),
          formatter: (cellContent, lab) => (
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                width: "200px",
                gap: "30px",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {lab.new_register_labs}
            </span>
          ),
        },

        {
          dataField: "active_labs",
          text: "Active",
          sort: true,
          headerStyle: { textAlign: "center", backgroundColor: "#f3e5f5" }, // Light Lavender
          style: { backgroundColor: "#f3e5f5", textAlign: "center" },
          filter: textFilter(),
          formatter: (cellContent, lab) => (
            <span
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              {lab.active_labs}
            </span>
          ),
        },
        {
          dataField: "inactive_labs",
          text: "Inactive",
          sort: true,

          headerStyle: { textAlign: "center", backgroundColor: "#d1e7dd" }, // Light Green
          style: { backgroundColor: "#d1e7dd", textAlign: "left" },
          filter: textFilter(),
          formatter: (cellContent, lab) => (
            <span
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              {lab.inactive_labs}
            </span>
          ),
        },
        {
          dataField: "suspended_labs",
          text: "Suspended",
          sort: true,
          headerStyle: { textAlign: "center", backgroundColor: "#f8d7da" }, // Light Red
          style: { backgroundColor: "#f8d7da", textAlign: "center" },
          filter: textFilter(),
          formatter: (cellContent, lab) => (
            <span
              style={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              {lab.suspended_labs}
            </span>
          ),
        },
        // {
        //   dataField: "membership_status",
        //   text: "Membership Status",
        //   sort: true,
        //   headerStyle: { textAlign: "center" },
        //   style: { textAlign: "center" },
        //   filter: textFilter(),
        //   formatter: (cellContent, lab) => <span style={{ display: "flex", justifyContent: "center", gap: "10px" }}>{lab.membership_status}</span>,
        // },
      ],
    };

    this.toggleUnapprovedModal = this.toggleUnapprovedModal.bind(this);
    this.callOnApproveUnapproveLab = this.callOnApproveUnapproveLab.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
  }

  aggregateLabs(rawLabs) {
    const grouped = {};

    rawLabs.forEach(lab => {
      const key = `${lab.province}|${lab.district}|${lab.city}`;
      if (!grouped[key]) {
        grouped[key] = {
          province: lab.province,
          district: lab.district,
          city: lab.city,
          total_labs: 0,
          active_labs: 0,
          inactive_labs: 0,
          new_register_labs: 0,
          suspended_labs: 0,
        };
      }

      grouped[key].total_labs += 1;

      const statusRaw = lab.membership_status || "";
      const status = statusRaw.trim().toLowerCase();

      // Normalize membership_status with more variations & logging
      let normalizedStatus = null;

      if (status === "active") normalizedStatus = "active";
      else if (status === "inactive") normalizedStatus = "inactive";
      // Added more variants for new registered status
      else if (
        status === "new registered" ||
        status === "new_registered" ||
        status === "new register" ||
        status === "newregistration" ||
        status === "new-registration" ||
        status.startsWith("new reg") // covers any "new reg..." prefix
      ) {
        normalizedStatus = "new_registered";
      } else if (status === "suspended") normalizedStatus = "suspended";
      else normalizedStatus = status;

      // Debug log to catch unexpected statuses
      if (
        !["active", "inactive", "new_registered", "suspended"].includes(
          normalizedStatus
        )
      ) {
        console.warn(
          `[aggregateLabs] Unexpected membership_status: "${statusRaw}" normalized as "${normalizedStatus}"`
        );
      }

      if (normalizedStatus === "active") grouped[key].active_labs += 1;
      else if (normalizedStatus === "inactive") grouped[key].inactive_labs += 1;
      else if (normalizedStatus === "suspended")
        grouped[key].suspended_labs += 1;
      else if (normalizedStatus === "new_registered")
        grouped[key].new_register_labs += 1;
    });

    return Object.values(grouped);
  }

  openParticipantList = (province, district, city) => {
    const selectedParticipants = this.state.AllLabs.filter(
      lab =>
        lab.province === province &&
        lab.district === district &&
        lab.city === city
    );

    this.setState({
      selectedParticipants,
      LabModal: true, // Open the modal
      modalProvince: province, // Update modal header info
      modalDistrict: district,
      modalCity: city,
    });
  };
  toggleLabModal = () => {
    this.setState(prevState => ({
      LabModal: !prevState.LabModal,
    }));
  };

  closeParticipantModal = () => {
    this.setState({ showParticipantModal: false });
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
    this.fetchData(user_id); // Just call fetchData, don't await or .then
  }

  componentDidUpdate(prevProps) {
    if (prevProps.AllLabs !== this.props.AllLabs) {
      const rawLabs = this.props.AllLabs || [];

      // Aggregate labs by province, district, city
      const aggregatedData = this.aggregateLabs(rawLabs);

      this.setState(
        {
          AllLabs: rawLabs,
          filteredLabs: aggregatedData,
        },
        this.applyFilters
      ); // If you have extra filtering logic, else remove this line
    }

    if (
      prevProps.CycleList !== this.props.CycleList ||
      prevProps.AllLabs !== this.props.AllLabs
    ) {
      const { CycleList, AllLabs } = this.props;
      const participantSchemes = new Set(
        (AllLabs || []).flatMap(
          lab => lab.schemes?.map(s => s.scheme_name) || []
        )
      );
      const filteredCycleList = (CycleList || []).filter(cycle =>
        participantSchemes.has(cycle.scheme_name)
      );

      this.setState({ CycleList, filteredCycleList });
    }

    if (prevProps.approvedLabs !== this.props.approvedLabs) {
      this.setState({ approvedLabs: this.props.approvedLabs });
    }
  }

  fetchData(user_id) {
    const {
      onGetParticipantPayment,
      ongetApprovedLabs,
      ongetcyclelist,
      onGetPendingLabs,
    } = this.props;

    if (onGetParticipantPayment) onGetParticipantPayment(user_id);
    if (ongetApprovedLabs) ongetApprovedLabs(user_id);
    if (ongetcyclelist) ongetcyclelist(user_id);
    if (onGetPendingLabs) onGetPendingLabs(user_id);
  }

  applyFilters() {
    const {
      filteredLabs: currentAggregatedLabs,
      selectedParticipantType,
      selectedScheme,
    } = this.state;

    let filteredLabs = currentAggregatedLabs; // use aggregated data here

    // Participant type filter may not apply well to aggregated data grouped by province-district-city,
    // so consider if this filter is needed at that level.

    // Scheme filter example: if your aggregated data doesn't have schemes info,
    // this filter won't work properly.

    this.setState({ filteredLabs });
  }

  toggleUnapprovedModal() {
    this.setState(prevState => ({
      unapprovedModal: !prevState.unapprovedModal,
    }));
  }

  callOnApproveUnapproveLab() {
    const { onApproveUnapproveLab } = this.props;
    if (onApproveUnapproveLab) {
      // You would pass necessary data here, example:
      // onApproveUnapproveLab(this.state.selectedLabId);
    }
    this.toggleUnapprovedModal();
  }

  render() {
    const { SearchBar } = Search;
    const { pendingLabListColumns, filteredLabs, CycleList } = this.state;
    const pageOptions = {
      sizePerPage: 50,
      totalSize: filteredLabs.length,
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
            <title>Pending Labs | External QC</title>
          </MetaTags>

          <ApproveUnapproveModal
            show={this.state.unapprovedModal}
            onYesClick={this.callOnApproveUnapproveLab}
            onCloseClick={this.toggleUnapprovedModal}
          />

          <Container fluid>
            <Breadcrumbs
              maintitle="Membership Status Report"
              title="Admin"
              breadcrumbItem="Membership Status Report"
            />

            <Row>
              <Col sm="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={pendingLabListColumns}
                      data={filteredLabs}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={pendingLabListColumns}
                          data={filteredLabs}
                          search
                        >
                          {toolkitProps => (
                            <React.Fragment>
                              <BootstrapTable
                                keyField="id"
                                {...toolkitProps.baseProps}
                                {...paginationTableProps}
                                bootstrap4
                                bordered={false}
                                defaultSorted={defaultSorted}
                                filter={filterFactory()}
                                wrapperClasses="table-responsive"
                                noDataIndication="No Labs found"
                              />
                              <Modal
                                isOpen={this.state.LabModal}
                                className={this.props.className}
                                toggle={this.toggleLabModal} // ✅ This tells the modal to close when the "x" is clicked
                              >
                                <ModalHeader
                                  toggle={this.toggleLabModal}
                                  tag="h4"
                                >
                                  Participants in {this.state.modalProvince},{" "}
                                  {this.state.modalDistrict},{" "}
                                  {this.state.modalCity}
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
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  )}
                                </ModalBody>
                              </Modal>

                              <Row>
                                <Col>
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

Membershipstatusreport.propTypes = {
  onGetParticipantPayment: PropTypes.func,
  onApproveUnapproveLab: PropTypes.func,
  ongetApprovedLabs: PropTypes.func,
  ongetcyclelist: PropTypes.func,
  onGetPendingLabs: PropTypes.func,
  AllLabs: PropTypes.array,
  approvedLabs: PropTypes.array,
  CycleList: PropTypes.array,
  match: PropTypes.object,
  className: PropTypes.any,
};
const mapStateToProps = state => {
  console.log("ProfileMenu mapStateToProps state:", state);

  if (!state.registrationAdmin) {
    console.error("RegistrationAdmin slice missing from Redux state");
    return {
      AllLabs: [],
      approvedLabs: [],
      CycleList: [],
      participantCounts: {}, // make sure to include this even in fallback
    };
  }

  const AllLabs = state.registrationAdmin.AllLabs || [];
  const approvedLabs = state.registrationAdmin.approvedLabs || [];
  const CycleList = state.registrationAdmin.CycleList || [];
  const participantCounts = state.registrationAdmin.participantCounts || {}; // ✅ Add this line

  // Logging
  console.log("ProfileMenu mapStateToProps - AllLabs:", AllLabs);
  console.log("ProfileMenu mapStateToProps - approvedLabs:", approvedLabs);
  console.log("ProfileMenu mapStateToProps - CycleList:", CycleList);
  console.log(
    "ProfileMenu mapStateToProps - participantCounts:",
    participantCounts
  ); // ✅ log this too

  return {
    AllLabs,
    approvedLabs,
    CycleList,
    participantCounts, // ✅ return it
  };
};

const mapDispatchToProps = dispatch => ({
  onApproveUnapproveLab: labId => dispatch(approveUnapproveLab(labId)),
  ongetApprovedLabs: user_id => dispatch(getApprovedLabs(user_id)),
  onGetPendingLabs: user_id => dispatch(getAllLabs(user_id)),
  onGetParticipantCount: user_id => dispatch(getParticipantCount(user_id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Membershipstatusreport);
