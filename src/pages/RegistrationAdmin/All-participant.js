import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import { Tooltip } from "@material-ui/core";
import { Alert } from "reactstrap"; // For Alert component
import Select from "react-select"; // For Select component
// import PaymentModal from "../Authentication/participant-payment"; // Adjust the path based on where PaymentModal is located
import { addNewPayment } from "store/Payment/actions";
import { getcitylist } from "store/participantcity/actions";
import { getdistrictlist } from "store/participantdistrict/actions";

import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "reactstrap";
import {
  getApprovedLabs,
  updateMembershipStatus,
} from "store/registration-admin/actions";
import { getParticipantSchemelist } from "store/Payment/actions";
import { getcyclelist } from "store/cycle/actions";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

//Import Breadcrumb
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getAllLabs,
  updateAllLabs,
  approveUnapproveLab,
} from "store/registration-admin/actions";

import ApproveUnapproveModal from "components/Common/ApproveUnapproveModal";
import "assets/scss/table.scss";

class PendingLabs extends Component {
  constructor(props) {
    super(props);
    //this.displaySuccessMessage = this.displaySuccessMessage.bind(this);
    this.node = React.createRef();
    this.handleSchemeChange = this.handleSchemeChange.bind(this);
    this.state = {
      AllLabs: [],
      approvedLabs: [],
      ListCity: [],
      ListDistrict: [],
      CycleList: [],
      selectedScheme: null,
      id: "",
      btnText: "Copy",
      isPaymentModalOpen: false,
      isMembershipModalOpen: false,
      organization_name: "",
      isApproved: false,
      unapprovedModal: false,
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      filteredLabs: [],
      cityOptions: [],
      districtOptions: [],
      pendingLabListColumns: [], // Columns for the table            // Filtered list to display
      selectedParticipantType: "All Participant", // Default participant type
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",

      pendingLabListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, AllLabs) => <>{AllLabs.id}</>,
        },
        {
          dataField: "district",
          text: "Participant District",
          sort: true,
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          formatter: (cellContent, AllLabs) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {AllLabs.district}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "city",
          text: "Participant City",
          sort: true,
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          formatter: (cellContent, AllLabs) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {AllLabs.city}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "name",
          text: "Participant name",
          sort: true,
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          formatter: (cellContent, AllLabs) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Link
                  to="#"
                  // onClick={e => this.openLabModal(e, AllLabs)}
                  onMouseEnter={(e) => this.openLabModal(e, AllLabs)}
                  onPointerLeave={this.handleMouseExit} // Pass the function reference instead of calling it immediately
                >
                  {AllLabs.name}
                </Link>
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "lab_staff_name",
          text: "Name",
          sort: true,
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          formatter: (cellContent, AllLabs) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {AllLabs.lab_staff_name}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "user_name",
          text: "Email",
          sort: true,
          headerStyle: { textAlign: "center", width: "200px" },
          style: { textAlign: "center" },
          filter: textFilter(),
          formatter: (cellContent, AllLabs) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "200px",
                  gap: "30px",
                  wordBreak: "break-word", // Breaks long words if necessary
                  overflowWrap: "break-word", // Ensures text wraps properly
                }}
              >
                {AllLabs.user_name}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "landline_registered_by",
          text: "Contact No.",
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          sort: true,
          formatter: (cellContent, AllLabs) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {AllLabs.landline_registered_by}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "schemes",
          text: "Scheme",
          sort: false,
          filter: textFilter({
            onFilter: (filterValue, data) => {
              // Custom filtering logic
              return data.filter(
                (row) =>
                  Array.isArray(row.schemes) &&
                  row.schemes.some((scheme) =>
                    scheme.scheme_name
                      .toLowerCase()
                      .includes(filterValue.toLowerCase())
                  )
              );
            },
          }),
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          formatter: (cellContent, row) => {
            if (Array.isArray(row.schemes) && row.schemes.length > 0) {
              // Create a unique set of scheme names
              const uniqueSchemes = [
                ...new Map(
                  row.schemes.map((scheme) => [scheme.scheme_name, scheme])
                ).values(),
              ];

              // Render the unique scheme names
              return (
                <ul style={{ padding: "0", margin: "0", listStyle: "none" }}>
                  {uniqueSchemes.map((scheme, index) => (
                    <li key={index}>{scheme.scheme_name}</li>
                  ))}
                </ul>
              );
            }
            return "No schemes available";
          },
        },
        {
          dataField: "payment_settlement",
          text: "Payment Settlement",
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          sort: true,
          formatter: (cellContent, AllLabs) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {AllLabs.payment_settlement}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "payment_status",
          text: "Payment Status",
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          sort: true,
          formatter: (cellContent, AllLabs) => (
            <>
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {AllLabs.payment_status}
              </span>
            </>
          ),
          filter: textFilter(),
        },

        {
          dataField: "membership_status",
          text: "Membership Status",
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          sort: true,
          formatter: (cellContent, AllLabs) => {
            // Assuming the cycle status is stored in AllLabs.cycle_status or similar
            const cycleStatus = AllLabs.cycle_status || ""; // adjust if your key is different

            const displayStatus =
              cycleStatus.toLowerCase() === "active"
                ? "Active"
                : AllLabs.membership_status
                ? AllLabs.membership_status
                : "Inactive";

            return (
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {displayStatus}
              </span>
            );
          },
          filter: textFilter(),
        },
        {
          dataField: "data",
          text: "id",
          isDummyField: true,
          editable: false,
          text: "Action",
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(),
          formatter: (cellContent, AllLabs) => (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                {/* {/ Update Button /} */}
                <Tooltip title="Update">
                  <Link
                    className="text-success"
                    to="#"
                    onClick={() => this.toggleEditModal(AllLabs)} // Pass the AllLabs object
                  >
                    <i className="mdi mdi-pencil font-size-18"></i>
                  </Link>
                </Tooltip>

                {/* {/ Revert Status Button /} */}
                <Tooltip title="Membership Status">
                  <Link
                    className=""
                    to="#"
                    onClick={() => this.isMembershipModalOpen(AllLabs)} // Opens the Approved/Unapproved modal
                  >
                    <i className="mdi mdi-refresh font-size-14"></i>
                  </Link>
                </Tooltip>
                <Tooltip title="Payment">
                  <Link
                    className=""
                    to="#"
                    onClick={() => this.isPaymentModalOpen(AllLabs)} // Pass the ID of the lab for later use
                  >
                    <i className="fas fa-money-bill-wave"></i>{" "}
                    {/* Payment Icon */}
                  </Link>
                </Tooltip>
              </div>
            </>
          ),
        },
      ],
    };
    console.log(
      "Initialized user_id:",
      localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "No authUser found in localStorage"
    );
    this.toggle = this.toggle.bind(this);
    this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    this.toggleMarketerModal = this.toggleMarketerModal.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleEditSubmit = this.handleEditSubmit.bind(this);
    this.handleParticipantTypeChange =
      this.handleParticipantTypeChange.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
  }

  // displaySuccessMessage(message) {
  //  alert(message); // Replace this with your desired success message logic
  // }

  isPaymentModalOpen = (participant) => {
    this.setState(
      {
        isPaymentModalOpen: true,
        selectedParticipant: participant, // Store full participant object
      },
      () => console.log("Modal State Updated:", this.state.selectedParticipant)
    );
  };

  isMembershipModalOpen = (participant) => {
    console.log("Opening Membership Modal for Participant:", participant); // Debug log
    this.setState(
      {
        isMembershipModalOpen: true,
        selectedParticipant: participant, // Store the correct participant
      },
      () =>
        console.log(
          "Membership Modal Opened for:",
          this.state.selectedParticipant
        )
    );
  };

  // handleStatusChange = (event) => {
  //   this.setState({ selectedValue: event.target.value }, this.applyFilters);
  // };

  handleParticipantTypeChange(event) {
    const selectedParticipantType = event.target.value;
    console.log("Selected Participant Type:", selectedParticipantType);

    this.setState({ selectedParticipantType }, () => {
      console.log(
        "Updated selectedParticipantType in state:",
        this.state.selectedParticipantType
      );
      this.applyFilters();
    });
  }

  handleSchemeChange = (event) => {
    const selectedScheme = event.target.value;
    console.log("Scheme selected:", selectedScheme);

    this.setState({ selectedScheme }, () => {
      this.applyFilters(); // Call filters after updating state
    });
    const { organization_name } = this.state; // Extract from state
  };

  applyFilters = () => {
    const {
      AllLabs,
      selectedParticipantType,
      selectedScheme,
      organization_name,
    } = this.state;

    console.log("Filtering with:", {
      selectedParticipantType,
      selectedScheme,
      AllLabs,
    });

    const filteredData = AllLabs.filter((lab) => {
      const membershipStatus = lab.membership_status?.trim().toLowerCase();
      const membershipDetail = lab.membership_status_detail
        ? lab.membership_status_detail.trim().toLowerCase()
        : ""; // Default to empty string if undefined

      console.log("Lab Data:", {
        id: lab.id,
        membershipStatus,
        membershipDetail,
      });

      // Define the condition for each participant type
      let matchesParticipantType = false;

      if (selectedParticipantType === "All Participant") {
        matchesParticipantType = true; // Show all participants
      } else if (selectedParticipantType === "Approved Participant") {
        matchesParticipantType =
          membershipStatus === "active" || membershipDetail === "active"; // Approved or Active participants
      } else if (selectedParticipantType === "Pending Participant") {
        matchesParticipantType = membershipStatus === "pending"; // Pending participants
      } else if (selectedParticipantType === "Unapproved Participant") {
        matchesParticipantType = membershipStatus === "inactive"; // Only participants with "inactive" membership status
      } else if (selectedParticipantType === "Suspended Participant") {
        matchesParticipantType = membershipStatus === "suspended"; // Suspended participants
      } else if (selectedParticipantType === "New Register") {
        matchesParticipantType = membershipStatus === "new register";
      }

      console.log(
        `Lab ${lab.id} matchesParticipantType:`,
        matchesParticipantType
      );

      // Check if participant matches the selected scheme
      const matchesScheme =
        !selectedScheme ||
        (Array.isArray(lab.schemes) &&
          lab.schemes.some(
            (scheme) => scheme.scheme_id?.toString() === selectedScheme
          ));

      console.log(`Lab ${lab.id} matchesScheme:`, matchesScheme);

      // Return true only if both participant type and scheme match
      return matchesParticipantType && matchesScheme;
    });

    console.log("Filtered Data:", filteredData);

    // Special handling for "Pending Participant"
    if (selectedParticipantType === "Pending Participant") {
      this.props.history.push(`/${organization_name}/pending-participant`);
      return; // Stop here; no need to update filteredLabs for Pending Participants
    }

    // Update the filtered list in the state for other participant types
    this.setState({ filteredLabs: filteredData }, () => {
      console.log("Updated filteredLabs:", this.state.filteredLabs);
    });
  };

  applyFiltersFromQueryParams = () => {
    const queryParams = new URLSearchParams(this.props.location.search);
    const filterType = queryParams.get("filterType");
    const filterValue = queryParams.get("filterValue");

    console.log("Applying filters from query params:", {
      filterType,
      filterValue,
    });

    if (filterType && filterValue) {
      // Update the state based on query parameters
      this.setState(
        {
          selectedParticipantType: filterValue, // Set selected type in state
        },
        () => {
          this.applyFilters(); // Apply filters after updating the state
        }
      );
    }
  };

  // componentDidMount() {
  //   // Fetch data and apply filters from query parameters
  //   this.fetchData(this.state.user_id);
  //   this.applyFiltersFromQueryParams();
  // }

  handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("photo", file);
  };
  toggleMembershipModal = () => {
    this.setState(
      (prevState) => ({
        isMembershipModalOpen: !prevState.isMembershipModalOpen,
      }),
      () => {
        console.log(
          "Modal Toggled, New State:",
          this.state.isMembershipModalOpen
        );
      }
    );
  };
  togglePaymentModal = () => {
    this.setState(
      (prevState) => ({
        isPaymentModalOpen: !prevState.isPaymentModalOpen,
      }),
      () => {
        console.log("Modal Toggled, New State:", this.state.isPaymentModalOpen);
      }
    );
  };

  handleEditSubmit(values) {
    console.log("Form values:", values);

    const updatedData = {
      id: values.id,
      name: values.name,
      email: values.email,
      address: values.address,
      shipping_address: values.shipping_address,
      billing_address: values.billing_address,
      marketer_name: values.marketer_name,
      city: values.city,
      district: values.district,
      lab_staff_name: values.lab_staff_name,
      email_participant: values.email_participant,
      landline_registered_by: values.landline_registered_by,
      payment_status: values.payment_status,
      payment_settlement: values.payment_settlement,
    };

    this.props.onupdateAllLabs(updatedData); // Dispatch update action

    // Show success message
    this.setState({ successMessage: "Participant updated successfully" });

    // Delay modal close by 2 seconds
    setTimeout(() => {
      this.setState({ editModal: false, successMessage: "" });
    }, 2000);
  }

  componentDidMount() {
    console.log("Fetching data...");

    const { onGetCityList } = this.props;
    onGetCityList(this.state.user_id);

    const { onGetDistrictList } = this.props;
    onGetDistrictList(this.state.user_id);
    // Retrieve user_id from localStorage
    const authUser = localStorage.getItem("authUser");
    const user_id = authUser ? JSON.parse(authUser).user_id : null;

    if (!user_id) {
      console.error("User ID is missing. Cannot proceed with API calls.");
      return;
    }

    console.log("Retrieved user_id:", user_id);

    // Set user_id in state
    this.setState({ user_id }, () => {
      // Get organization_name from URL params
      const { organization_name } = this.props.match.params || {};
      console.log("organization_name from props:", organization_name);

      if (organization_name) {
        this.setState({ organization_name }, () => {
          console.log("Organization name set:", this.state.organization_name);

          // // Initialize dropdown value
          // this.setInitialDropdownValue();
          this.fetchData(this.state.user_id);
          this.applyFiltersFromQueryParams();
          // Fetch city options

          this.fetchData(user_id);
        });
      } else {
        console.error("Organization name is missing in URL parameters.");
      }
    });
  }

  // New method to fetch cities

  // Fetch all required data
  fetchData(user_id) {
    const {
      onGetParticipantPayment,
      ongetApprovedLabs,
      ongetcyclelist,
      onGetPendingLabs,
    } = this.props;

    // Call participant payment API
    onGetParticipantPayment(user_id);
    console.log("onGetParticipantPayment called with user_id:", user_id);

    // Call approved labs API
    ongetApprovedLabs(user_id);
    console.log("ongetApprovedLabs called with user_id:", user_id);

    // Call cycle list API
    ongetcyclelist(user_id);
    console.log("ongetcyclelist called with user_id:", user_id);

    // Call pending labs API
    onGetPendingLabs(user_id);
    console.log("onGetPendingLabs called with user_id:", user_id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.ListCity !== this.props.ListCity) {
      this.setState({ ListCity: this.props.ListCity });
    }
    if (prevProps.ListDistrict !== this.props.ListDistrict) {
      this.setState({ ListDistrict: this.props.ListDistrict });
    }
    if (prevState.filteredLabs !== this.state.filteredLabs) {
      console.log("FilteredLabs updated:", this.state.filteredLabs);
    }
    if (prevProps.approvedLabs !== this.props.approvedLabs) {
      // Logic for approvedLabs if needed
    }
    if (prevProps.CycleList !== this.props.CycleList) {
      console.log("Updating CycleList in state:", this.props.CycleList);
      this.setState({ CycleList: this.props.CycleList });
    }
    if (prevProps.PaymentSchemeList !== this.props.PaymentSchemeList) {
      this.setState({ PaymentSchemeList: this.props.PaymentSchemeList });
    }
    if (prevProps.AllLabs !== this.props.AllLabs) {
      console.log("Updated AllLabs:", this.props.AllLabs);
      this.setState({ AllLabs: this.props.AllLabs }, () => {
        console.log("State AllLabs updated:", this.state.AllLabs);
        this.applyFilters(); // Reapply filters after AllLabs is updated
      });
    }

    // Ensure filteredCycleList is updated without modifying CycleList
    if (
      prevProps.AllLabs !== this.props.AllLabs ||
      prevProps.CycleList !== this.props.CycleList
    ) {
      console.log("Filtering CycleList for participants");

      // Extract unique scheme names from AllLabs
      const participantSchemes = new Set(
        this.props.AllLabs.flatMap(
          (lab) => lab.schemes?.map((scheme) => scheme.scheme_name) || []
        )
      );

      // Generate the filtered list for participant dropdown
      const filteredCycleList = this.props.CycleList.filter((cycle) =>
        participantSchemes.has(cycle.scheme_name)
      );

      // Update state with both lists
      this.setState({
        CycleList: this.props.CycleList, // Original list for payment modal
        filteredCycleList, // Filtered list for participant filters
      });
    }
  }

  // setInitialDropdownValue = () => {
  //   const { pathname } = this.props.history.location;
  //   const { organization_name } = this.state; // Now it's properly updated

  //   let selectedValue = "Pending Participant"; // Default

  //   if (pathname.includes(`/${organization_name}/pending-participant`)) {
  //     selectedValue = "Pending Participant";
  //   } else if (pathname.includes(`/${organization_name}/approved-participant`)) {
  //     selectedValue = "Approved Participant";
  //   } else if (pathname.includes(`/${organization_name}/unapproved-participant`)) {
  //     selectedValue = "Unapproved Participant";
  //   } else if (pathname.includes(`/${organization_name}/suspended-participant`)) {
  //     selectedValue = "Suspended Participant"; // New case added
  //   } else if (pathname.includes(`/${organization_name}/all-participant`)) {
  //     selectedValue = "All Participant";
  //   }

  //   this.setState({ selectedValue });
  // };

  // setInitialDropdownValue = () => {
  //   const { pathname } = this.props.history.location;
  //   let selectedValue = "";

  //   if (
  //     pathname.includes(`/${this.state.organization_name}/pending-participant`)
  //   ) {
  //     selectedValue = "Pending Participant";
  //   } else if (
  //     pathname.includes(`/${this.state.organization_name}/approved-participant`)
  //   ) {
  //     selectedValue = "Approved Participant";
  //   } else if (
  //     pathname.includes(`/${this.state.organization_name}/unapproved-participant`)
  //   ) {
  //     selectedValue = "Unapproved Participant";
  //   } else if (
  //     pathname.includes(`/${this.state.organization_name}/suspended-labs`)
  //   ) {
  //     selectedValue = "Suspended Participant";
  //   } else if (
  //     pathname.includes(`/${this.state.organization_name}/all-participant`)
  //   ) {
  //     selectedValue = "All Participant";
  //   }

  //   this.setState({ selectedValue });
  // };

  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      email: arg.email,
      landline_registered_by: arg.landline_registered_by,
    });
  };

  toggleEditModal = (data) => {
    this.setState({
      editModal: !this.state.editModal,
      id: data.id,
      name: data.name,
      email: data.email,
      address: data.address,
      district: data.district,
      city: data.city,
      shipping_address: data.shipping_address,
      billing_address: data.billing_address,
      lab_staff_name: data.lab_staff_name,
      marketer_name: data.marketer_name,
      email_participant: data.email_participant,
      landline_registered_by: data.landline_registered_by,
      payment_status: data.payment_status,
      payment_settlement: data.payment_settlement,
    });
  };
  toggleLabModal = () => {
    this.setState((prevState) => ({
      LabModal: !prevState.LabModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  toggleModal = () => {
    this.setState((prevState) => ({
      isModalOpen: !prevState.isModalOpen,
    }));
  };
  openLabModal = (e, arg) => {
    this.setState({
      LabModal: true,
      email: arg.email,
      shipping_address: arg.shipping_address,
      billing_address: arg.billing_address,
    });
  };
  handleMouseExit = () => {
    this.setState({
      PatientModal: false,
      MarketerModal: false,
      LabModal: false,
      isHovered: false,
    });
  };
  togglePatientModal = () => {
    this.setState((prevState) => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  openMarketerModal = (e, arg) => {
    this.setState({
      MarketerModal: true,
      marketer_name: arg.marketer_name,
      marketer_phone: arg.marketer_phone,
    });
  };
  toggleMarketerModal = () => {
    this.setState((prevState) => ({
      MarketerModal: !prevState.MarketerModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  toggle() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  handleApprovedEvent = (id) => {
    this.setState({ id: id, isApproved: true, unapprovedModal: true });
  };

  handleUnapprovedEvent = (id) => {
    this.setState({ id: id, isApproved: false, unapprovedModal: true });
  };

  callOnApproveUnapproveLab = () => {
    const { onApproveUnapproveLab, onGetPendingLabs } = this.props;

    const data = {
      id: this.state.user_id,
      labId: this.state.id,
      isApproved: this.state.isApproved,
    };

    // calling to unapprove lab
    onApproveUnapproveLab(data);

    // Calling to update list record
    setTimeout(() => {
      onGetPendingLabs(this.state.user_id);
    }, 1000);

    this.setState({ unapprovedModal: false });
  };

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

  exportToExcel = () => {
    const { AllLabs } = this.state;
    if (!AllLabs || AllLabs.length === 0) {
      console.error("No data available to export.");
      alert("No data available to export.");
      return;
    }

    // Use actual keys from payload and provide friendly Excel headers
    const selectedFields = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "address", label: "Address" },
      { key: "shipping_address", label: "Shipping Address" },
      { key: "billing_address", label: "Billing Address" },
      { key: "email_participant", label: "Email of Notification Person" },
      { key: "district", label: "District" },
      { key: "city", label: "City" },
      { key: "lab_staff_name", label: "Name of Notification Person" },
      { key: "phone", label: "Contact No of Notification Person" },
      { key: "payment_status", label: "Payment Status" },
      { key: "payment_settlement", label: "Payment Settlement" },
    ];

    const dataToExport = AllLabs.map((item) => {
      const row = {};
      selectedFields.forEach(({ key, label }) => {
        row[label] = item[key] || "N/A";
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { Participants: ws }, SheetNames: ["Participants"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(data, "Filtered_Participants.xlsx");
  };

  // handleSelectChange = (event) => {
  //   const selectedValue = event.target.value;
  //   console.log("handleSelectChange triggered with:", selectedValue);
  //   const { organization_name } = this.state;

  //   // Update the state and apply filters
  //   this.setState({ selectedValue }, () => {
  //     console.log("State updated. Now calling applyFilters.");
  //     // Apply filters after state is updated
  //     this.applyFilters();

  //     // Navigate based on the selected value
  //     if (selectedValue === "Pending Participant") {
  //       this.props.history.push(`/${organization_name}/pending-participant`);
  //     } else if (selectedValue === "Approved Participant") {
  //       this.props.history.push(`/${organization_name}/approved-participant`);
  //     } else if (selectedValue === "Suspended Participant") { // New condition added
  //       this.props.history.push(`/${organization_name}/suspended-participant`);
  //     } else if (selectedValue === "Unapproved Participant") {
  //       this.props.history.push(`/${organization_name}/unapproved-participant`);
  //     } else if (selectedValue === "All Participant") {
  //       this.props.history.push(`/${organization_name}/all-participant`);
  //     }
  //   });
  // };

  render() {
    console.log("Rendering table with data:", this.state.filteredLabs);
    const { SearchBar } = Search;
    const { ListCity } = this.state;
    const { ListDistrict } = this.state;
    const cityOptions = ListCity.map((city) => ({
      value: city.name,
      label: city.name,
    }));
    const districtOptions = ListDistrict.map((district) => ({
      value: district.name,
      label: district.name,
    }));

    const { AllLabs } = this.props;
    const data = this.state.data;
    const { onApproveUnapproveLab, onGetPendingLabs } = this.props;
    const { isPaymentModalOpen, togglePaymentModal } = this.props;
    const { isMembershipModalOpen, toggleMembershipModal } = this.props;
    const { filteredLabs, selectedParticipantType, selectedScheme } =
      this.state;

    const pageOptions = {
      sizePerPage: 50,
      totalSize: AllLabs.length, // replace later with size(AllLabs),
      custom: true,
    };

    // const { isPaymentModalOpen } = this.state;
    const { approvedLabs, CycleList } = this.state;

    const participantOptions = (this.props.approvedLabs || []).map(
      (participant) => ({
        value: participant.id, // ensure this is the correct unique identifier
        label: participant.name, // or any other field you'd like to display
      })
    );
    const schemeOptions = CycleList.map((scheme) => ({
      value: scheme.id, // Use scheme ID instead of scheme name
      label: `(Scheme Name: ${scheme.scheme_name}) - (Cycle Number: ${scheme.cycle_no})`,
    }));

    console.log("Mapped scheme option:", schemeOptions);
    const { isModalOpen, toggleModal, isOpen, toggle, onSubmit } = this.state;
    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];
    const customStyles = {
      // <-- This is invalid here
      control: (provided) => ({
        ...provided,
        minHeight: "38px",
      }),
    };

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Pending Labs | External QC</title>
          </MetaTags>

          <ApproveUnapproveModal
            show={this.state.unapprovedModal}
            onYesClick={this.callOnApproveUnapproveLab}
            onCloseClick={() => this.setState({ unapprovedModal: false })}
          />

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Labs" breadcrumbItem="Lists of Participants" />
            <Row className="justify-content-center align-item-center">
              <Col lg="10">
                <Card>
                  <CardBody>
                    <Row className="justify-content-end">
                      <Col lg="auto" className="text-end">
                        <Button
                          onClick={this.exportToExcel}
                          className="mb-3"
                          disabled={
                            !this.state.AllLabs ||
                            this.state.AllLabs.length === 0
                          }
                        >
                          Export to Excel
                        </Button>
                      </Col>
                    </Row>

                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.pendingLabListColumns}
                      data={this.state.filteredLabs}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.pendingLabListColumns}
                          data={this.state.filteredLabs}
                          search
                        >
                          {(toolkitprops) => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="8">
                                  <div className="ms-2 mb-4">
                                    <div className="container">
                                      <div className="row align-items-center">
                                        {/* Filter 1 */}
                                        <div className="col">
                                          <select
                                            className="form-select"
                                            onChange={
                                              this.handleParticipantTypeChange
                                            }
                                            value={
                                              this.state.selectedParticipantType
                                            }
                                            style={{ width: "200px" }} // Ensures it takes up full width of the column
                                          >
                                            <option value="All Participant">
                                              All Participant
                                            </option>
                                            <option value="Approved Participant">
                                              Approved Participant
                                            </option>
                                            <option value="Unapproved Participant">
                                              Unapproved Participant
                                            </option>
                                            <option value="Pending Participant">
                                              Pending Participant
                                            </option>
                                            <option value="Suspended Participant">
                                              Suspended Participant
                                            </option>
                                            <option value="New Register">
                                              New Register
                                            </option>
                                          </select>
                                        </div>

                                        {/* Filter 2 */}
                                        <div className="col">
                                          <select
                                            className="form-select"
                                            onChange={this.handleSchemeChange}
                                            value={this.state.selectedScheme}
                                            style={{ width: "300px" }} // Increased width for longer text
                                          >
                                            <option value="">
                                              Select Scheme
                                            </option>
                                            {Array.isArray(
                                              this.state.filteredCycleList
                                            ) &&
                                              this.state.filteredCycleList.map(
                                                (filteredCycle) => (
                                                  <option
                                                    key={filteredCycle.id}
                                                    value={filteredCycle.id}
                                                  >
                                                    {`${
                                                      filteredCycle.scheme_name
                                                    } - Cycle ${
                                                      filteredCycle.cycle_no
                                                    } (${
                                                      filteredCycle.status ||
                                                      "No Status"
                                                    })`}
                                                  </option>
                                                )
                                              )}
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Col>
                              </Row>
                              <Row className="mb-2 mt-3">
                                {/* <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col> */}
                              </Row>
                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      key={`table-${this.state.filteredLabs.length}`} // Unique key for each data update
                                      keyField="id"
                                      data={this.state.filteredLabs}
                                      columns={this.state.pendingLabListColumns}
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={
                                        "table align-middle table-condensed table-hover"
                                      }
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={
                                        "table-header-sky-blue"
                                      }
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
                                    />
                                    <Modal
                                      isOpen={this.state.LabModal}
                                      className={this.props.className}
                                      onPointerLeave={this.handleMouseExit}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleLabModal}
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
                                                      email
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={this.state.email}
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Shipping Address
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .shipping_address
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Billing Address
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .billing_address
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
                                    <Modal
                                      isOpen={this.state.MarketerModal}
                                      className={this.props.className}
                                      onPointerLeave={this.handleMouseExit}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleMarketerModal}
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
                                                      Name
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.marketer_name
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
                                                      value={this.state.city}
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      District
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.district
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
                                    <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                      onPointerLeave={this.handleMouseExit}
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
                                                      Email
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={this.state.email}
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Mobile No.
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .landline_registered_by
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                  {/* /////////////////// */}
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .payment_status
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
                                                            .payment_status
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
                                    <Modal
                                      isOpen={this.state.editModal}
                                      toggle={this.toggleEditModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleEditModal}
                                      >
                                        Edit Lab Details
                                      </ModalHeader>
                                      <ModalBody>
                                        {this.state.successMessage && (
                                          <div className="alert alert-success text-center">
                                            {this.state.successMessage}
                                          </div>
                                        )}
                                        <Formik
                                          initialValues={{
                                            id: this.state.id,
                                            name: this.state.name,
                                            email: this.state.email,
                                            address: this.state.address,
                                            district: this.state.district,
                                            city: this.state.city,
                                            shipping_address:
                                              this.state.shipping_address,
                                            billing_address:
                                              this.state.billing_address,
                                            lab_staff_name:
                                              this.state.lab_staff_name,
                                            email_participant:
                                              this.state.email_participant,
                                            landline_registered_by:
                                              this.state.landline_registered_by,
                                            payment_status:
                                              this.state.payment_status,
                                            payment_settlement:
                                              this.state.payment_settlement,
                                          }}
                                          onSubmit={this.handleEditSubmit}
                                        >
                                          {({
                                            values,
                                            errors,
                                            setFieldValue,
                                            handleChange,
                                            handleSubmit,
                                          }) => (
                                            <Form onSubmit={handleSubmit}>
                                              <Row>
                                                <Col className="col-12">
                                                  {/* {/ Name Field /} */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Name
                                                    </Label>
                                                    <input
                                                      type="text"
                                                      value={values.name}
                                                      name="name"
                                                      className="form-control"
                                                      placeholder="Enter Name"
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  {/* {/ Email Field /} */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Login Email
                                                    </Label>
                                                    <input
                                                      type="email"
                                                      value={values.email}
                                                      name="email"
                                                      className="form-control"
                                                      placeholder="Enter Email"
                                                      onChange={handleChange}
                                                      readOnly={true}
                                                      style={{
                                                        backgroundColor:
                                                          "#f0f0f0",
                                                      }} // light grey
                                                    />
                                                  </div>

                                                  {/* {/ Address Field /} */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Address
                                                    </Label>
                                                    <input
                                                      type="text"
                                                      value={values.address}
                                                      name="address"
                                                      className="form-control"
                                                      placeholder="Enter Address"
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  {/* {/ District and City in one row /} */}

                                                  {/* {/ Shipping Address Field /} */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Shipping Address
                                                    </Label>
                                                    <input
                                                      type="text"
                                                      value={
                                                        values.shipping_address
                                                      }
                                                      name="shipping_address"
                                                      className="form-control"
                                                      placeholder="Enter Shipping Address"
                                                      onChange={handleChange}
                                                    />
                                                  </div>

                                                  {/* / Billing Address Field / */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Billing Address
                                                    </Label>
                                                    <input
                                                      type="text"
                                                      value={
                                                        values.billing_address
                                                      }
                                                      name="billing_address"
                                                      className="form-control"
                                                      placeholder="Enter Billing Address"
                                                      onChange={handleChange}
                                                    />
                                                  </div>
                                                  {/* {/ Email of Notification Person /} */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Email of Notification
                                                      Person
                                                    </Label>
                                                    <input
                                                      type="email"
                                                      value={
                                                        values.email_participant
                                                      }
                                                      name="email_participant"
                                                      className="form-control"
                                                      placeholder="Enter Email"
                                                      onChange={handleChange}
                                                    />
                                                  </div>
                                                  <Row>
                                                    <Col sm={6} md={6} xl={6}>
                                                      <div className="mb-3">
                                                        <Label
                                                          for="district"
                                                          className="form-label"
                                                        >
                                                          District
                                                        </Label>
                                                        <Select
                                                          name="district" // The field name in Formik
                                                          options={
                                                            districtOptions
                                                          } // Options for the select
                                                          styles={customStyles}
                                                          className={
                                                            errors.district &&
                                                            touched.district
                                                              ? " is-invalid"
                                                              : ""
                                                          }
                                                          onChange={(
                                                            selectedOption
                                                          ) => {
                                                            setFieldValue(
                                                              "district",
                                                              selectedOption
                                                                ? selectedOption.value
                                                                : ""
                                                            );
                                                          }}
                                                          value={
                                                            districtOptions.find(
                                                              (option) =>
                                                                option.value ===
                                                                values.district
                                                            ) || null
                                                          } // Set the current selected value
                                                        />
                                                        <ErrorMessage
                                                          name="district" // Error for the city field
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </div>
                                                    </Col>

                                                    <Col sm={6} md={6} xl={6}>
                                                      <div className="mb-3">
                                                        <Label
                                                          for="city"
                                                          className="form-label"
                                                        >
                                                          City
                                                        </Label>
                                                        <Select
                                                          name="city" // The field name in Formik
                                                          // isMulti // Enable multi-select
                                                          options={cityOptions} // Options for the select
                                                          styles={customStyles}
                                                          className={
                                                            // "form-control" +
                                                            errors.city &&
                                                            touched.city
                                                              ? " is-invalid"
                                                              : "" // Conditional class based on validation
                                                          }
                                                          //   onChange={
                                                          //     selectedOptions =>
                                                          //       setFieldValue("city", selectedOptions) // Update Formik state
                                                          //   }
                                                          //   value={values.city} // Set the current selected values
                                                          // />
                                                          onChange={(
                                                            selectedOption
                                                          ) => {
                                                            setFieldValue(
                                                              "city",
                                                              selectedOption
                                                                ? selectedOption.value
                                                                : ""
                                                            ); // Update Formik state with string value
                                                          }}
                                                          value={
                                                            cityOptions.find(
                                                              (option) =>
                                                                option.value ===
                                                                values.city
                                                            ) || null
                                                          } // Set the current selected value
                                                          // menuPlacement="auto"
                                                          // menuShouldScrollIntoView={false}
                                                        />
                                                        <ErrorMessage
                                                          name="city" // Error for the city field
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </div>
                                                    </Col>
                                                  </Row>

                                                  {/* {/ Name and Contact No of Notification Person in one row /} */}
                                                  <Row>
                                                    <Col md={6}>
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          Name of Notification
                                                          Person
                                                        </Label>
                                                        <input
                                                          type="text"
                                                          value={
                                                            values.lab_staff_name
                                                          }
                                                          name="lab_staff_name"
                                                          className="form-control"
                                                          placeholder="Enter Name"
                                                          onChange={
                                                            handleChange
                                                          }
                                                        />
                                                      </div>
                                                    </Col>
                                                    <Col md={6}>
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          Contact No of
                                                          Notification Person
                                                        </Label>
                                                        <input
                                                          type="text"
                                                          value={
                                                            values.landline_registered_by
                                                          }
                                                          name="landline_registered_by"
                                                          className="form-control"
                                                          placeholder="Enter Contact No"
                                                          onChange={
                                                            handleChange
                                                          }
                                                        />
                                                      </div>
                                                    </Col>
                                                    <Col md={6}>
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          Payment Status
                                                        </Label>
                                                        <input
                                                          type="text"
                                                          value={
                                                            values.payment_status
                                                          }
                                                          name="payment_status"
                                                          className="form-control"
                                                          placeholder="Enter Contact No"
                                                          onChange={
                                                            handleChange
                                                          }
                                                        />
                                                      </div>
                                                    </Col>
                                                  </Row>

                                                  {/* {/ Submit Button /} */}
                                                  <div className="mb-3 text-end">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-primary"
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
                                     <Modal
                                      isOpen={this.state.isPaymentModalOpen}
                                      toggle={this.togglePaymentModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.togglePaymentModal}
                                      >
                                        Payment for{" "}
                                        {this.state.selectedParticipant?.name ||
                                          "Unknown"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            photo: "",
                                            participant:
                                              this.state.selectedParticipant
                                                ?.id || "",
                                            paydate: "",
                                            payment_status: "", // No default
                                            payment_settlement: "",
                                            // is_active: false,      // default inactive
                                            paymentmethod: "",
                                            discountAmount: "",
                                            taxDeduction: "",
                                            scheme: [],
                                            part_payment_amount: "",
                                            remaining_amount: "",
                                            price: "",
                                            discount: 0,
                                            receivedby: "",
                                            added_by: localStorage.getItem(
                                              "authUser"
                                            )
                                              ? JSON.parse(
                                                  localStorage.getItem(
                                                    "authUser"
                                                  )
                                                ).user_id
                                              : "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            participant: Yup.string().required(
                                              "Participant is required"
                                            ),
                                            taxDeduction: Yup.number()
                                              .nullable()
                                              .notRequired()
                                              .transform(
                                                (value, originalValue) =>
                                                  originalValue === ""
                                                    ? null
                                                    : value
                                              ),
                                            discountAmount: Yup.number()
                                              .nullable()
                                              .notRequired()
                                              .transform(
                                                (value, originalValue) =>
                                                  originalValue === ""
                                                    ? null
                                                    : value
                                              ),

                                            price: Yup.string().when(
                                              "discount",
                                              {
                                                is: discount =>
                                                  discount === 100,
                                                then: Yup.string()
                                                  .test(
                                                    "price-zero-if-100-discount",
                                                    "Price must be 0 if discount is 100%",
                                                    value =>
                                                      parseFloat(value) === 0
                                                  )
                                                  .required(),
                                                otherwise:
                                                  Yup.string().required(
                                                    "Price is required"
                                                  ),
                                              }
                                            ),

                                            payment_status: Yup.string().when(
                                              ["discount", "price"],
                                              {
                                                is: (discount, price) =>
                                                  !(
                                                    discount === 100 &&
                                                    parseFloat(price) === 0
                                                  ),
                                                then: Yup.string().required(
                                                  "Payment status is required"
                                                ),
                                                otherwise:
                                                  Yup.string().notRequired(),
                                              }
                                            ),

                                            paydate: Yup.string().when(
                                              ["discount", "price"],
                                              {
                                                is: (discount, price) =>
                                                  !(
                                                    discount === 100 &&
                                                    parseFloat(price) === 0
                                                  ),
                                                then: Yup.string().required(
                                                  "Date is required"
                                                ),
                                                otherwise:
                                                  Yup.string().notRequired(),
                                              }
                                            ),

                                            photo: Yup.mixed().when(
                                              ["discount", "price"],
                                              {
                                                is: (discount, price) =>
                                                  !(
                                                    discount === 100 &&
                                                    parseFloat(price) === 0
                                                  ),
                                                then: Yup.mixed()
                                                  .required(
                                                    "Deposit Slip is required"
                                                  )
                                                  .test(
                                                    "fileSize",
                                                    "File too large",
                                                    value =>
                                                      value &&
                                                      value.size <=
                                                        2 * 1024 * 1024
                                                  )
                                                  .test(
                                                    "fileType",
                                                    "Unsupported file format",
                                                    value =>
                                                      value &&
                                                      [
                                                        "image/jpeg",
                                                        "image/png",
                                                        "image/jpg",
                                                        "application/pdf",
                                                      ].includes(value.type)
                                                  ),
                                                otherwise:
                                                  Yup.mixed().notRequired(),
                                              }
                                            ),

                                            receivedby: Yup.string().when(
                                              ["discount", "price"],
                                              {
                                                is: (discount, price) =>
                                                  !(
                                                    discount === 100 &&
                                                    parseFloat(price) === 0
                                                  ),
                                                then: Yup.string().required(
                                                  "Received By is required"
                                                ),
                                                otherwise:
                                                  Yup.string().notRequired(),
                                              }
                                            ),

                                            paymentmethod: Yup.string().when(
                                              ["discount", "price"],
                                              {
                                                is: (discount, price) =>
                                                  !(
                                                    discount === 100 &&
                                                    parseFloat(price) === 0
                                                  ),
                                                then: Yup.string().required(
                                                  "Payment Method is required"
                                                ),
                                                otherwise:
                                                  Yup.string().notRequired(),
                                              }
                                            ),
                                            discount: Yup.number()
                                              .nullable()
                                              .notRequired()
                                              .transform(
                                                (value, originalValue) =>
                                                  originalValue === ""
                                                    ? null
                                                    : value
                                              )
                                              .min(
                                                -100,
                                                "Discount cannot be less than -100%"
                                              )
                                              .max(
                                                100,
                                                "Discount cannot be more than 100%"
                                              ),
                                          })}
                                          onSubmit={async (
                                            values,
                                            { setSubmitting, resetForm }
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
                                            const roundedPrice = Math.round(
                                              parseFloat(values.price)
                                            );
                                            const safePaydate =
                                              values.paydate &&
                                              values.paydate.trim() !== ""
                                                ? values.paydate
                                                : null;
                                            const AddPayment = {
                                              participant: values.participant,
                                              scheme: values.scheme,
                                              price: roundedPrice,
                                              payment_status:
                                                values.payment_status,

                                              payment_settlement:
                                                values.payment_settlement,
                                              // is_active: values.is_active, // Pass this to backend
                                              discount: values.discount,
                                              discountAmount:
                                                values.discountAmount,
                                              paydate: safePaydate,
                                              taxDeduction: values.taxDeduction,
                                              part_payment_amount:
                                                values.part_payment_amount,
                                              photo: values.photo,
                                              receivedby: values.receivedby,
                                              paymentmethod:
                                                values.paymentmethod,
                                              added_by: userId,
                                            };
                                            // 👉 Place this block immediately after the object above:
                                            if (values.discount === 100) {
                                              // Remove all unnecessary fields if discount is 100%
                                              delete AddPayment.remaining_amount;
                                              delete AddPayment.paydate;
                                              delete AddPayment.photo;
                                              delete AddPayment.payment_status;
                                              delete AddPayment.receivedby;
                                              delete AddPayment.paymentmethod;
                                              delete AddPayment.discountAmount;
                                              delete AddPayment.payment_settlement;
                                            } else {
                                              // Provide fallbacks if values are missing
                                              if (
                                                values.payment_settlement ===
                                                "Part"
                                              ) {
                                                AddPayment.remaining_amount =
                                                  values.remaining_amount ?? 0;
                                              }
                                              AddPayment.paydate =
                                                values.paydate ?? null;
                                              AddPayment.photo =
                                                values.photo ?? null;
                                              AddPayment.payment_status =
                                                values.payment_status ?? null;
                                              AddPayment.receivedby =
                                                values.receivedby ?? null;
                                              AddPayment.paymentmethod =
                                                values.paymentmethod ?? null;
                                            }

                                            // Conditionally add remaining_amount only if payment_settlement === 'part'
                                            if (
                                              values.payment_settlement ===
                                              "Part"
                                            ) {
                                              AddPayment.remaining_amount =
                                                values.remaining_amount || 0; // Or whatever logic you want for default
                                            }

                                            try {
                                              await this.props.onAddNewPayment(
                                                userId,
                                                AddPayment
                                              );
                                              await this.props.onGetPendingLabs(
                                                this.state.user_id
                                              ); //payment modal
                                              this.setState({
                                                isPaymentModalOpen: false,
                                              }); // Close modal here
                                              resetForm();
                                              this.displaySuccessMessage(
                                                "Payment added successfully!"
                                              );
                                            } catch (error) {
                                              console.error(
                                                "Error adding payment:",
                                                error
                                              );
                                            }
                                            setTimeout(() => {
                                              this.props.onGetPendingLabs(
                                                this.state.user_id
                                              );
                                            }, 1000);
                                            setTimeout(() => {
                                              this.props.ongetcyclelist(
                                                this.state.user_id
                                              );
                                            }, 1000);
                                            this.setState({
                                              isPaymentModalOpen: false,
                                            });
                                            setSubmitting(false);
                                          }}
                                        >
                                          {({
                                            values,
                                            errors,
                                            touched,
                                            setFieldValue,
                                            submitForm, // <-- add this
                                          }) => {
                                            const handleSchemeChange =
                                              selectedOptions => {
                                                const selectedValues =
                                                  selectedOptions
                                                    ? selectedOptions.map(
                                                        option => option.value
                                                      )
                                                    : [];
                                                setFieldValue(
                                                  "scheme",
                                                  selectedValues
                                                );

                                                const totalPrice =
                                                  selectedValues.reduce(
                                                    (sum, schemeId) => {
                                                      const scheme =
                                                        CycleList.find(
                                                          s => s.id === schemeId
                                                        );
                                                      return (
                                                        sum +
                                                        (scheme
                                                          ? parseFloat(
                                                              scheme.price
                                                            )
                                                          : 0)
                                                      );
                                                    },
                                                    0
                                                  );

                                                // Set priceBeforeDiscount only once when schemes are selected
                                                if (
                                                  !values.priceBeforeDiscount ||
                                                  values.scheme.length === 0
                                                ) {
                                                  setFieldValue(
                                                    "priceBeforeDiscount",
                                                    totalPrice.toFixed(2)
                                                  );
                                                }

                                                // Update the price to reflect the total (will be modified later by discount)
                                                setFieldValue(
                                                  "price",
                                                  totalPrice.toFixed(2)
                                                );
                                              };

                                            const handleDiscountChange = e => {
                                              let discountValue = parseFloat(
                                                e.target.value
                                              );
                                              if (
                                                isNaN(discountValue) ||
                                                discountValue < 0
                                              )
                                                discountValue = 0;

                                              setFieldValue(
                                                "discount",
                                                discountValue
                                              );

                                              const priceBeforeDiscount =
                                                parseFloat(
                                                  values.priceBeforeDiscount
                                                ) || 0;

                                              // Apply discount
                                              const discountedPrice =
                                                priceBeforeDiscount *
                                                (1 - discountValue / 100);
                                              const discountAmount =
                                                priceBeforeDiscount -
                                                discountedPrice;

                                              // Apply tax deduction if exists
                                              const taxDeduction =
                                                parseFloat(
                                                  values.taxDeduction
                                                ) || 0;
                                              const finalPrice =
                                                discountedPrice *
                                                (1 - taxDeduction / 100);

                                              setFieldValue(
                                                "discountAmount",
                                                discountAmount.toFixed(2)
                                              );
                                              setFieldValue(
                                                "price",
                                                finalPrice.toFixed(2)
                                              );

                                              if (discountValue === 100) {
                                                submitForm();
                                              }
                                            };

                                            const handleTaxChange = e => {
                                              let taxDeduction = parseFloat(
                                                e.target.value
                                              );
                                              if (
                                                isNaN(taxDeduction) ||
                                                taxDeduction < 0
                                              )
                                                taxDeduction = 0;
                                              if (taxDeduction > 100)
                                                taxDeduction = 100;

                                              setFieldValue(
                                                "taxDeduction",
                                                taxDeduction
                                              );

                                              const priceBeforeDiscount =
                                                parseFloat(
                                                  values.priceBeforeDiscount
                                                ) || 0;
                                              const discount =
                                                parseFloat(values.discount) ||
                                                0;

                                              // Apply discount
                                              const discountedPrice =
                                                priceBeforeDiscount *
                                                (1 - discount / 100);

                                              // Apply tax deduction
                                              const finalPrice =
                                                discountedPrice *
                                                (1 - taxDeduction / 100);

                                              setFieldValue(
                                                "price",
                                                finalPrice.toFixed(2)
                                              );
                                            };

                                            return (
                                              <Form>
                                                {errors.successMessage && (
                                                  <Alert color="success">
                                                    {errors.successMessage}
                                                  </Alert>
                                                )}
                                                <Row>
                                                  <Col>
                                                    <Label>Scheme</Label>
                                                    <Select
                                                      name="scheme"
                                                      isMulti
                                                      options={schemeOptions}
                                                      className={
                                                        errors.scheme &&
                                                        touched.scheme
                                                          ? "is-invalid"
                                                          : ""
                                                      }
                                                      onChange={selectedOptions => {
                                                        const selectedValues =
                                                          selectedOptions
                                                            ? selectedOptions.map(
                                                                option =>
                                                                  option.value
                                                              )
                                                            : [];
                                                        setFieldValue(
                                                          "scheme",
                                                          selectedValues
                                                        );

                                                        console.log(
                                                          "Selected Scheme IDs:",
                                                          selectedValues
                                                        ); // Debugging

                                                        const totalPrice =
                                                          selectedValues.reduce(
                                                            (sum, schemeId) => {
                                                              const scheme =
                                                                this.props.CycleList.find(
                                                                  s =>
                                                                    s.id ===
                                                                    schemeId
                                                                );
                                                              return (
                                                                sum +
                                                                (scheme
                                                                  ? parseFloat(
                                                                      scheme.price.replace(
                                                                        /,/g,
                                                                        ""
                                                                      )
                                                                    )
                                                                  : 0)
                                                              );
                                                            },
                                                            0
                                                          );

                                                        console.log(
                                                          "Total Price:",
                                                          totalPrice
                                                        ); // Debugging

                                                        // Update the priceBeforeDiscount field
                                                        setFieldValue(
                                                          "priceBeforeDiscount",
                                                          totalPrice.toFixed(2)
                                                        );

                                                        setFieldValue(
                                                          "price",
                                                          totalPrice.toFixed(2)
                                                        );
                                                      }}
                                                      value={schemeOptions.filter(
                                                        option =>
                                                          values.scheme.includes(
                                                            option.value
                                                          )
                                                      )}
                                                    />
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col>
                                                    <div className="mb-3">
                                                      <Label
                                                        htmlFor="priceBeforeDiscount"
                                                        className="form-label"
                                                      >
                                                        Payable
                                                      </Label>
                                                      <Field name="priceBeforeDiscount">
                                                        {({ field }) => (
                                                          <input
                                                            {...field}
                                                            type="text"
                                                            className="form-control"
                                                            value={new Intl.NumberFormat(
                                                              "en-PK"
                                                            ).format(
                                                              values.priceBeforeDiscount ||
                                                                0
                                                            )}
                                                            readOnly
                                                            style={{
                                                              backgroundColor:
                                                                "#e9ecef",
                                                            }}
                                                          />
                                                        )}
                                                      </Field>
                                                      <ErrorMessage
                                                        name="priceBeforeDiscount"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  </Col>
                                                </Row>

                                                <Row>
                                                  <Col md={6}>
                                                    <Label>
                                                      Discount in (%)
                                                    </Label>
                                                    <Field name="discount">
                                                      {({ field }) => (
                                                        <input
                                                          {...field}
                                                          type="text"
                                                          className="form-control"
                                                          onChange={e => {
                                                            const discountPercent =
                                                              parseFloat(
                                                                e.target.value
                                                              );
                                                            setFieldValue(
                                                              "discount",
                                                              e.target.value
                                                            );

                                                            const payable =
                                                              parseFloat(
                                                                values.priceBeforeDiscount
                                                              ) || 0;
                                                            if (
                                                              !isNaN(
                                                                discountPercent
                                                              )
                                                            ) {
                                                              const discountAmount =
                                                                (payable *
                                                                  discountPercent) /
                                                                100;
                                                              setFieldValue(
                                                                "discountAmount",
                                                                discountAmount.toFixed(
                                                                  2
                                                                )
                                                              );
                                                              const tax =
                                                                parseFloat(
                                                                  values.taxDeduction
                                                                ) || 0;
                                                              const finalPrice =
                                                                payable -
                                                                discountAmount -
                                                                tax;
                                                              setFieldValue(
                                                                "price",
                                                                finalPrice.toFixed(
                                                                  2
                                                                )
                                                              );
                                                            }
                                                          }}
                                                        />
                                                      )}
                                                    </Field>
                                                    <ErrorMessage
                                                      name="discount"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>

                                                  <Col md={6}>
                                                    <Label>
                                                      Discount Amount (Rs)
                                                    </Label>
                                                    <Field name="discountAmount">
                                                      {({ field }) => (
                                                        <input
                                                          {...field}
                                                          type="text"
                                                          className="form-control"
                                                          value={
                                                            field.value || ""
                                                          } // Ensures controlled input
                                                          onChange={e => {
                                                            const discountAmount =
                                                              parseFloat(
                                                                e.target.value
                                                              );
                                                            setFieldValue(
                                                              "discountAmount",
                                                              e.target.value
                                                            );

                                                            const payable =
                                                              parseFloat(
                                                                values.priceBeforeDiscount
                                                              ) || 0;
                                                            if (
                                                              !isNaN(
                                                                discountAmount
                                                              ) &&
                                                              payable > 0
                                                            ) {
                                                              const percent =
                                                                (discountAmount /
                                                                  payable) *
                                                                100;
                                                              setFieldValue(
                                                                "discount",
                                                                percent.toFixed(
                                                                  2
                                                                )
                                                              );
                                                              const tax =
                                                                parseFloat(
                                                                  values.taxDeduction
                                                                ) || 0;
                                                              const finalPrice =
                                                                payable -
                                                                discountAmount -
                                                                tax;
                                                              setFieldValue(
                                                                "price",
                                                                finalPrice.toFixed(
                                                                  2
                                                                )
                                                              );
                                                            }
                                                          }}
                                                        />
                                                      )}
                                                    </Field>

                                                    <ErrorMessage
                                                      name="discountAmount"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>

                                                <Row>
                                                  <Col>
                                                    <Label>
                                                      Tax Deduction Amount
                                                    </Label>
                                                    <Field name="taxDeduction">
                                                      {({ field }) => (
                                                        <input
                                                          {...field}
                                                          type="text"
                                                          className="form-control"
                                                          placeholder="Enter tax deduction amount"
                                                          onChange={e => {
                                                            const tax =
                                                              parseFloat(
                                                                e.target.value
                                                              );
                                                            setFieldValue(
                                                              "taxDeduction",
                                                              e.target.value
                                                            );

                                                            const payable =
                                                              parseFloat(
                                                                values.priceBeforeDiscount
                                                              ) || 0;
                                                            const discount =
                                                              parseFloat(
                                                                values.discountAmount
                                                              ) || 0;
                                                            if (!isNaN(tax)) {
                                                              const finalPrice =
                                                                payable -
                                                                discount -
                                                                tax;
                                                              setFieldValue(
                                                                "price",
                                                                finalPrice.toFixed(
                                                                  2
                                                                )
                                                              );
                                                            }
                                                          }}
                                                        />
                                                      )}
                                                    </Field>
                                                    <ErrorMessage
                                                      name="taxDeduction"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>

                                                <Row>
                                                  <Col>
                                                    <div className="mb-3">
                                                      <Label
                                                        htmlFor="price"
                                                        className="form-label"
                                                      >
                                                        Payable after Discount &
                                                        Tax Deduction
                                                      </Label>
                                                      <Field name="price">
                                                        {({ field }) => (
                                                          <input
                                                            {...field}
                                                            type="text"
                                                            className="form-control"
                                                            value={new Intl.NumberFormat(
                                                              "en-PK",
                                                              {
                                                                style:
                                                                  "currency",
                                                                currency: "PKR",
                                                              }
                                                            ).format(
                                                              values.price || 0
                                                            )}
                                                            readOnly
                                                            style={{
                                                              backgroundColor:
                                                                "#e9ecef",
                                                            }}
                                                          />
                                                        )}
                                                      </Field>
                                                      <ErrorMessage
                                                        name="price"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  </Col>
                                                </Row>

                                                <Col>
                                                  <Label>
                                                    Payment Settlement
                                                  </Label>
                                                  <Select
                                                    name="payment_settlement"
                                                    options={[
                                                      {
                                                        value: "Full",
                                                        label: "Full",
                                                      },
                                                      {
                                                        value: "Part",
                                                        label: "Part",
                                                      },
                                                    ]}
                                                    onChange={selectedOption => {
                                                      const settlement =
                                                        selectedOption?.value ||
                                                        "";
                                                      setFieldValue(
                                                        "payment_settlement",
                                                        settlement
                                                      );

                                                      if (
                                                        settlement === "Full" ||
                                                        settlement === "Part"
                                                      ) {
                                                        setFieldValue(
                                                          "is_active",
                                                          true
                                                        );
                                                      }
                                                    }}
                                                    value={
                                                      values.payment_settlement
                                                        ? {
                                                            value:
                                                              values.payment_settlement,
                                                            label:
                                                              values.payment_settlement,
                                                          }
                                                        : null
                                                    }
                                                    placeholder="Select"
                                                    className={
                                                      errors.payment_settlement &&
                                                      touched.payment_settlement
                                                        ? "is-invalid"
                                                        : ""
                                                    }
                                                  />
                                                  <ErrorMessage
                                                    name="payment_settlement"
                                                    component="div"
                                                    className="invalid-feedback"
                                                  />
                                                </Col>
                                                {values.payment_settlement ===
                                                  "Part" && (
                                                  <>
                                                    <Col className="mt-3">
                                                      <Label>
                                                        Part Payment Amount
                                                      </Label>
                                                      <Field name="part_payment_amount">
                                                        {({ field }) => (
                                                          <input
                                                            {...field}
                                                            type="number"
                                                            className={
                                                              errors.part_payment_amount &&
                                                              touched.part_payment_amount
                                                                ? "form-control is-invalid"
                                                                : "form-control"
                                                            }
                                                            value={
                                                              field.value ===
                                                                undefined ||
                                                              field.value ===
                                                                null
                                                                ? ""
                                                                : field.value
                                                            } // safest check
                                                            onChange={e => {
                                                              const partAmount =
                                                                parseFloat(
                                                                  e.target.value
                                                                ) || 0;
                                                              const totalAmount =
                                                                parseFloat(
                                                                  values.price
                                                                ) || 0;
                                                              const remaining =
                                                                totalAmount -
                                                                partAmount;

                                                              setFieldValue(
                                                                "part_payment_amount",
                                                                e.target.value
                                                              );
                                                              setFieldValue(
                                                                "remaining_amount",
                                                                remaining >= 0
                                                                  ? remaining
                                                                  : 0
                                                              );
                                                            }}
                                                          />
                                                        )}
                                                      </Field>

                                                      <ErrorMessage
                                                        name="part_payment_amount"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </Col>

                                                    <Col className="mt-3">
                                                      <Label>
                                                        Remaining Amount
                                                      </Label>
                                                      <Field
                                                        name="remaining_amount"
                                                        type="number"
                                                        disabled
                                                        className="form-control"
                                                      />
                                                    </Col>
                                                  </>
                                                )}

                                                <Row>
                                                  <Col>
                                                    <Label>Pay Date</Label>
                                                    <Field
                                                      name="paydate"
                                                      type="date"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage
                                                      name="paydate"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>

                                                <Row>
                                                  <Col>
                                                    <Label>Pay Copy</Label>
                                                    <Input
                                                      id="formFile"
                                                      name="photo"
                                                      type="file"
                                                      multiple={false}
                                                      accept=".jpg,.jpeg,.png,.pdf"
                                                      onChange={event =>
                                                        this.handleFileChange(
                                                          event,
                                                          setFieldValue
                                                        )
                                                      }
                                                      className={
                                                        "form-control" +
                                                        (errors.photo &&
                                                        touched.photo
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    {/* Note below the input */}
                                                    <small
                                                      style={{
                                                        color: "#007bff",
                                                      }}
                                                    >
                                                      Only JPEG, PNG, or PDF
                                                      files up to 2MB in size
                                                      are allowed.
                                                    </small>

                                                    <ErrorMessage
                                                      name="photo"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>

                                                <Row>
                                                  <Col>
                                                    <Label>
                                                      Payment Method
                                                    </Label>
                                                    <Select
                                                      name="paymentmethod"
                                                      options={[
                                                        {
                                                          value: "Online",
                                                          label: "Online",
                                                        },
                                                        {
                                                          value: "Cheque",
                                                          label: "Cheque",
                                                        },
                                                        {
                                                          value: "Cash",
                                                          label: "Cash",
                                                        },
                                                      ]}
                                                      onChange={selectedOption =>
                                                        setFieldValue(
                                                          "paymentmethod",
                                                          selectedOption?.value ||
                                                            ""
                                                        )
                                                      }
                                                      value={
                                                        values.paymentmethod
                                                          ? {
                                                              value:
                                                                values.paymentmethod,
                                                              label:
                                                                values.paymentmethod,
                                                            }
                                                          : null
                                                      }
                                                      className={
                                                        errors.paymentmethod &&
                                                        touched.paymentmethod
                                                          ? "is-invalid"
                                                          : ""
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="paymentmethod"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col>
                                                    <Label>
                                                      Payment Status
                                                    </Label>
                                                    <Select
                                                      name="payment_status"
                                                      options={[
                                                        {
                                                          value: "Paid",
                                                          label: "Paid",
                                                        },
                                                        {
                                                          value: "In process",
                                                          label: "In process",
                                                        },
                                                      ]}
                                                      onChange={selectedOption => {
                                                        const status =
                                                          selectedOption?.value ||
                                                          "";
                                                        setFieldValue(
                                                          "payment_status",
                                                          status
                                                        );

                                                        if (
                                                          status === "Paid" ||
                                                          status ===
                                                            "In process"
                                                        ) {
                                                          setFieldValue(
                                                            "is_active",
                                                            true
                                                          );
                                                        }
                                                      }}
                                                      value={
                                                        values.payment_status
                                                          ? {
                                                              value:
                                                                values.payment_status,
                                                              label:
                                                                values.payment_status,
                                                            }
                                                          : null
                                                      }
                                                      placeholder="Select"
                                                      className={
                                                        errors.payment_status &&
                                                        touched.payment_status
                                                          ? "is-invalid"
                                                          : ""
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="payment_status"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col>
                                                    <Label>Received By</Label>
                                                    <Field
                                                      name="receivedby"
                                                      type="text"
                                                      className="form-control"
                                                    />
                                                    <ErrorMessage
                                                      name="receivedby"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>

                                                <ModalFooter>
                                                  <Button
                                                    color="primary"
                                                    type="submit"
                                                  >
                                                    Save
                                                  </Button>
                                                </ModalFooter>
                                              </Form>
                                            );
                                          }}
                                        </Formik>
                                      </ModalBody>
                                    </Modal>

                                    <Modal
                                      isOpen={this.state.isMembershipModalOpen}
                                      toggle={this.toggleMembershipModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleMembershipModal}
                                      >
                                        Updating Membership for{" "}
                                        {this.state.selectedParticipant?.name ||
                                          "Unknown"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            membership: "", // Default empty value
                                            participant:
                                              this.state.selectedParticipant
                                                ?.id || "",
                                            // Participant ID passed as prop
                                            added_by: localStorage.getItem(
                                              "authUser"
                                            )
                                              ? JSON.parse(
                                                  localStorage.getItem(
                                                    "authUser"
                                                  )
                                                ).user_id
                                              : "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            membership:
                                              Yup.string().required(
                                                "Status required"
                                              ),
                                          })}
                                          onSubmit={async (
                                            values,
                                            { setSubmitting, resetForm }
                                          ) => {
                                            console.log(
                                              "Form Values Submitted:",
                                              values
                                            );
                                            console.log(
                                              "Form Values Submitted:",
                                              values
                                            );
                                            console.log(
                                              "Participant ID:",
                                              values.participant
                                            );

                                            if (!values.participant) {
                                              console.error(
                                                "Error: Lab ID (participant) is missing!"
                                              );
                                              return;
                                            }

                                            const userId = localStorage.getItem(
                                              "authUser"
                                            )
                                              ? JSON.parse(
                                                  localStorage.getItem(
                                                    "authUser"
                                                  )
                                                ).user_id
                                              : "";

                                            const UpdateMembership = {
                                              membership_status:
                                                values.membership, // Correct key
                                              added_by: userId, // This should match the logged-in user's ID
                                              participant: values.participant, // Participant ID should come here
                                            };
                                            console.log(
                                              "Selected Participant ID:",
                                              this.state.selectedParticipant?.id
                                            );

                                            console.log(
                                              "Payload being sent to API:",
                                              UpdateMembership
                                            );

                                            try {
                                              await this.props.onupdateMembershipStatus(
                                                this.state.user_id,
                                                UpdateMembership
                                              );
                                              this.props.ongetApprovedLabs(
                                                this.state.user_id
                                              );
                                              this.props.onupdateMembershipStatus(
                                                this.state.user_id
                                              );
                                              await this.props.onGetPendingLabs(
                                                this.state.user_id
                                              ); //membership modal
                                              this.setState({
                                                isMembershipModalOpen: false,
                                              }); // Close modal here
                                              resetForm();
                                              this.displaySuccessMessage(
                                                "Membership status updated successfully!"
                                              );
                                            } catch (error) {
                                              console.error(
                                                "Error updating membership status:",
                                                error
                                              );
                                            }
                                            this.setState({
                                              isMembershipModalOpen: false,
                                            });
                                            setSubmitting(false);
                                          }}
                                        >
                                          {({
                                            values,
                                            errors,
                                            touched,
                                            setFieldValue,
                                          }) => {
                                            const membershipOptions = [
                                              {
                                                value: "Active",
                                                label: "Active",
                                              },
                                              {
                                                value: "Inactive",
                                                label: "Inactive",
                                              },
                                              {
                                                value: "Suspended",
                                                label: "Suspended",
                                              },
                                            ];

                                            return (
                                              <Form>
                                                <Row>
                                                  <Col>
                                                    <Label>
                                                      Membership Status
                                                    </Label>
                                                    <Select
                                                      name="membership"
                                                      options={
                                                        membershipOptions
                                                      }
                                                      placeholder="Select Status"
                                                      className={
                                                        errors.participant &&
                                                        touched.participant
                                                          ? "is-invalid"
                                                          : ""
                                                      }
                                                      onChange={(
                                                        selectedOption
                                                      ) => {
                                                        setFieldValue(
                                                          "membership",
                                                          selectedOption?.value ||
                                                            ""
                                                        );
                                                      }}
                                                      value={
                                                        membershipOptions.find(
                                                          (option) =>
                                                            option.value ===
                                                            values.membership
                                                        ) || null
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="membership"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>

                                                <ModalFooter>
                                                  <Button
                                                    color="primary"
                                                    type="submit"
                                                  >
                                                    Save
                                                  </Button>
                                                </ModalFooter>
                                              </Form>
                                            );
                                          }}
                                        </Formik>
                                      </ModalBody>
                                    </Modal>

                                    <Modal
                                      isOpen={this.state.isMembershipModalOpen}
                                      toggle={this.toggleMembershipModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleMembershipModal}
                                      >
                                        Updating Membership for{" "}
                                        {this.state.selectedParticipant?.name ||
                                          "Unknown"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            membership: "", // Default empty value
                                            participant:
                                              this.state.selectedParticipant
                                                ?.id || "",
                                            // Participant ID passed as prop
                                            added_by: localStorage.getItem(
                                              "authUser"
                                            )
                                              ? JSON.parse(
                                                  localStorage.getItem(
                                                    "authUser"
                                                  )
                                                ).user_id
                                              : "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            membership:
                                              Yup.string().required(
                                                "Status required"
                                              ),
                                          })}
                                          onSubmit={async (
                                            values,
                                            { setSubmitting, resetForm }
                                          ) => {
                                            console.log(
                                              "Form Values Submitted:",
                                              values
                                            );
                                            console.log(
                                              "Form Values Submitted:",
                                              values
                                            );
                                            console.log(
                                              "Participant ID:",
                                              values.participant
                                            );

                                            if (!values.participant) {
                                              console.error(
                                                "Error: Lab ID (participant) is missing!"
                                              );
                                              return;
                                            }

                                            const userId = localStorage.getItem(
                                              "authUser"
                                            )
                                              ? JSON.parse(
                                                  localStorage.getItem(
                                                    "authUser"
                                                  )
                                                ).user_id
                                              : "";

                                            const UpdateMembership = {
                                              membership_status:
                                                values.membership, // Correct key
                                              added_by: userId, // This should match the logged-in user's ID
                                              participant: values.participant, // Participant ID should come here
                                            };
                                            console.log(
                                              "Selected Participant ID:",
                                              this.state.selectedParticipant?.id
                                            );

                                            console.log(
                                              "Payload being sent to API:",
                                              UpdateMembership
                                            );

                                            try {
                                              await this.props.onupdateMembershipStatus(
                                                this.state.user_id,
                                                UpdateMembership
                                              );
                                              this.props.ongetApprovedLabs(
                                                this.state.user_id
                                              );
                                              this.props.onupdateMembershipStatus(
                                                this.state.user_id
                                              );
                                              await this.props.onGetPendingLabs(
                                                this.state.user_id
                                              ); //membership modal
                                              this.setState({
                                                isMembershipModalOpen: false,
                                              }); // Close modal here
                                              resetForm();
                                              this.displaySuccessMessage(
                                                "Membership status updated successfully!"
                                              );
                                            } catch (error) {
                                              console.error(
                                                "Error updating membership status:",
                                                error
                                              );
                                            }
                                            this.setState({
                                              isMembershipModalOpen: false,
                                            });
                                            setSubmitting(false);
                                          }}
                                        >
                                          {({
                                            values,
                                            errors,
                                            touched,
                                            setFieldValue,
                                          }) => {
                                            const membershipOptions = [
                                              {
                                                value: "Active",
                                                label: "Active",
                                              },
                                              {
                                                value: "Inactive",
                                                label: "Inactive",
                                              },
                                              {
                                                value: "Suspended",
                                                label: "Suspended",
                                              },
                                            ];

                                            return (
                                              <Form>
                                                <Row>
                                                  <Col>
                                                    <Label>
                                                      Membership Status
                                                    </Label>
                                                    <Select
                                                      name="membership"
                                                      options={
                                                        membershipOptions
                                                      }
                                                      placeholder="Select Status"
                                                      className={
                                                        errors.participant &&
                                                        touched.participant
                                                          ? "is-invalid"
                                                          : ""
                                                      }
                                                      onChange={(
                                                        selectedOption
                                                      ) => {
                                                        setFieldValue(
                                                          "membership",
                                                          selectedOption?.value ||
                                                            ""
                                                        );
                                                      }}
                                                      value={
                                                        membershipOptions.find(
                                                          (option) =>
                                                            option.value ===
                                                            values.membership
                                                        ) || null
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="membership"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>

                                                <ModalFooter>
                                                  <Button
                                                    color="primary"
                                                    type="submit"
                                                  >
                                                    Save
                                                  </Button>
                                                </ModalFooter>
                                              </Form>
                                            );
                                          }}
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

PendingLabs.propTypes = {
  match: PropTypes.object,
  AllLabs: PropTypes.array,
  className: PropTypes.any,
  onGetPendingLabs: PropTypes.func,
  onApproveUnapproveLab: PropTypes.func,
  history: PropTypes.any,
  onupdateAllLabs: PropTypes.any,
  onAddNewPayment: PropTypes.func,
  onupdateMembershipStatus: PropTypes.func,
  participantId: PropTypes.func,
  ongetApprovedLabs: PropTypes.func,
  ongetcyclelist: PropTypes.func,
  approvedLabs: PropTypes.array,
  onGetParticipantPayment: PropTypes.func,
  location: PropTypes.shape({
    search: PropTypes.string, // Ensure 'search' is a string
  }).isRequired, // Make it required if always expected

  CycleList: PropTypes.array,
  onGetCityList: PropTypes.func,
  onGetDistrictList: PropTypes.func,
  PaymentSchemeList: PropTypes.array,
  isPaymentModalOpen: PropTypes.array,
  togglePaymentModal: PropTypes.array,
  isMembershipModalOpen: PropTypes.array,
  toggleMembershipModal: PropTypes.array,
  ListCity: PropTypes.array,
  ListDistrict: PropTypes.array,
};
const mapStateToProps = ({
  Account,
  ListCity,
  ListDistrict,
  registrationAdmin,
  CycleList,
  PaymentScheme,
}) => {
  console.log("registrationAdmin:", registrationAdmin);
  console.log("CycleList from props:", CycleList);
  console.log("ListCity from props:", ListCity);
  console.log("ListDistrict from props:", ListDistrict);

  return {
    userID: Account?.userID || null,

    ListCity: ListCity?.ListCity || [],
    ListDistrict: ListDistrict?.ListDistrict || [],

    AllLabs: registrationAdmin?.AllLabs || [],
    approvedLabs: registrationAdmin?.approvedLabs || [],

    CycleList: CycleList?.CycleList || [],
    PaymentSchemeList: PaymentScheme?.PaymentSchemeList || [],
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onApproveUnapproveLab: (data) => dispatch(approveUnapproveLab(data)),
  onGetPendingLabs: (id) => dispatch(getAllLabs(id)),
  onGetInstrumentTypeList: (id) => dispatch(getSchemelist(id)),
  onAddNewType: (id, createUnit) => dispatch(addNewSchemeList(id, createUnit)),
  onUpdateType: (id, methodlist) =>
    dispatch(updateSchemeList({ id, ...methodlist })),
  onupdateAllLabs: (updatedData) => {
    console.log("Dispatching updatedData:", updatedData); // Check if updated data is being passed
    dispatch(updateAllLabs(updatedData));
  },
  onGetCityList: (id) => dispatch(getcitylist(id)),
  onGetDistrictList: (id) => dispatch(getdistrictlist(id)),
  onGetParticipantPayment: (id) => dispatch(getParticipantSchemelist(id)),
  ongetApprovedLabs: (id) => dispatch(getApprovedLabs(id)),
  ongetcyclelist: (id) => dispatch(getcyclelist(id)),
  onAddNewPayment: (id, payment) => dispatch(addNewPayment(id, payment)),
  onupdateMembershipStatus: (id, status) => {
    console.log("Updating Membership Status - ID:", id, "Status:", status);
    dispatch(updateMembershipStatus({ id, ...status }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PendingLabs));
