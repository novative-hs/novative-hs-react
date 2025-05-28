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
// import { addNewPayment } from "store/Payment/actions";

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
  getDeleteParticipant,
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

class ParticipantListN extends Component {
  constructor(props) {
    super(props);
    //this.displaySuccessMessage = this.displaySuccessMessage.bind(this);
    this.node = React.createRef();
    this.handleSchemeChange = this.handleSchemeChange.bind(this);
    this.state = {
      AllLabs: [], // Full participant list from the API
      approvedLabs: [], // Approved labs list
      CycleList: [], // Scheme cycle lists
      // selectedStatus: "All",         // Default participant status
      selectedScheme: null, // Currently selected scheme ID
      // selectedCorporate: "",         // Filter for corporate/lab name
      // isSettledFilter: "",           // Filter for settlement status
      id: "", // Selected participant ID
      successMessage: "", // <-- Add this
      btnText: "Copy", // Button text for copy functionality
      isPaymentModalOpen: false, // State for payment modal
      isMembershipModalOpen: false, // State for membership modal
      organization_name: "", // Organization name
      isApproved: false, // Approval status
      unapprovedModal: false, // State for unapproved modal
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"], // Tooltip content
      filteredLabs: [],
      pendingLabListColumns: [], // Columns for the table            // Filtered list to display
      selectedParticipantType: "All Participant", // Default participant type
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",

      pendingLabListColumns: [
        {
          text: "ID",
          dataField: "id",
          sort: true,
          hidden: false,
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          filter: textFilter(), // Enable text filter on the ID field
          formatter: (cellContent, AllLabs) => <>{AllLabs.id}</>,
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
          headerStyle: { textAlign: "center" }, // align header text to left
          style: { textAlign: "left" }, // align cell content to left
          filter: textFilter(),
          formatter: (cellContent, AllLabs) => (
            <span
              style={{
                display: "flex",
                justifyContent: "flex-start", // aligns inner content to the left
                gap: "10px",
              }}
            >
              <Link
                to="#"
                onMouseEnter={e => this.openLabModal(e, AllLabs)}
                onPointerLeave={this.handleMouseExit}
              >
                {AllLabs.name}
              </Link>
            </span>
          ),
        },
        {
          dataField: "district",
          text: "District",
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
          text: "City",
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
          dataField: "email_participant",
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
                {AllLabs.email_participant}
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
          dataField: "password_foradmins",
          text: "Password",
          sort: false,
          filter: textFilter({ placeholder: "" }),
          headerStyle: { textAlign: "center" },
          style: { textAlign: "center" },
          formatter: (cellContent, row) => row.password_foradmins || "N/A",
        },
        {
          dataField: "membership_status",
          text: "Membership Status",
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
                {AllLabs.membership_status}
              </span>
            </>
          ),
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
              <Tooltip title="Delete">
  <button
    className="btn btn-link text-danger p-0"
    onClick={() => this.handleDeleteParticipant(AllLabs)}
    style={{ border: "none", background: "none", cursor: "pointer" }}
  >
    <i className="fas fa-trash-alt"></i>
  </button>
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

  isPaymentModalOpen = participant => {
    this.setState(
      {
        isPaymentModalOpen: true,
        selectedParticipant: participant, // Store full participant object
      },
      () => console.log("Modal State Updated:", this.state.selectedParticipant)
    );
  };
handleDeleteParticipant = (participant) => {
  console.log("Deleting participant:", participant);
  const hasActiveCycle = Array.isArray(participant.schemes) &&
    participant.schemes.some(scheme => scheme.cycle_status === "Active");

  if (hasActiveCycle) {
    alert("This participant has an active cycle and cannot be deleted.");
    // or use toast.warning("This participant has an active cycle and cannot be deleted.");
  } else {
    // Confirm deletion
    if (window.confirm("Are you sure you want to delete this participant?")) {
      this.props.ongetDeleteParticipant(participant.id); // dispatch delete or call API
    }
  }
};

  isMembershipModalOpen = participant => {
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

  handleSchemeChange = event => {
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

    const filteredData = AllLabs.filter(lab => {
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
            scheme => scheme.scheme_id?.toString() === selectedScheme
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
      prevState => ({
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
      prevState => ({
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
          // Fetch data from APIs
          this.fetchData(user_id);
        });
      } else {
        console.error("Organization name is missing in URL parameters.");
      }
    });
  }

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
          lab => lab.schemes?.map(scheme => scheme.scheme_name) || []
        )
      );

      // Generate the filtered list for participant dropdown
      const filteredCycleList = this.props.CycleList.filter(cycle =>
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

  toggleEditModal = data => {
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
    });
  };
  toggleLabModal = () => {
    this.setState(prevState => ({
      LabModal: !prevState.LabModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  toggleModal = () => {
    this.setState(prevState => ({
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
    this.setState(prevState => ({
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
    this.setState(prevState => ({
      MarketerModal: !prevState.MarketerModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleApprovedEvent = id => {
    this.setState({ id: id, isApproved: true, unapprovedModal: true });
  };

  handleUnapprovedEvent = id => {
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
      { key: "payment_status", label: "Payment Status" }, // This will show "N/A" if it doesn’t exist
    ];

    const dataToExport = AllLabs.map(item => {
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
      participant => ({
        value: participant.id, // ensure this is the correct unique identifier
        label: participant.name, // or any other field you'd like to display
      })
    );
    const schemeOptions = CycleList.map(scheme => ({
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
                          {toolkitprops => (
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
                                          </select>
                                        </div>

                                        {/* Filter 2 */}
                                        <div className="col">
                                         <select
  className="form-select"
  onChange={this.handleSchemeChange}
  value={this.state.selectedScheme}
  style={{ width: "200px" }}
>
  <option value="">Select Scheme</option>
  {Array.isArray(this.state.filteredCycleList) &&
    this.state.filteredCycleList.map(filteredCycle => (
      <option key={filteredCycle.id} value={filteredCycle.id}>
        {`${filteredCycle.scheme_name} - Cycle ${filteredCycle.cycle_no}`}
      </option>
    ))}
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
                                      key={`table-${this.state.filteredLabs.length}`}
                                      keyField="id"
                                      data={this.state.filteredLabs}
                                      columns={this.state.pendingLabListColumns}
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes="table align-middle table-condensed table-hover table-body-white" // <- add body class here
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses="table-header-grey" // <- header style class
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
                                          }}
                                          onSubmit={this.handleEditSubmit}
                                        >
                                          {({
                                            values,
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
                                                      Email
                                                    </Label>
                                                    <input
                                                      type="email"
                                                      value={values.email}
                                                      name="email"
                                                      className="form-control"
                                                      placeholder="Enter Email"
                                                      onChange={handleChange}
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
                                                    <Col md={6}>
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          District
                                                        </Label>
                                                        <input
                                                          type="text"
                                                          value={
                                                            values.district
                                                          }
                                                          name="district"
                                                          className="form-control"
                                                          placeholder="Enter District"
                                                          onChange={
                                                            handleChange
                                                          }
                                                        />
                                                      </div>
                                                    </Col>
                                                    <Col md={6}>
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          City
                                                        </Label>
                                                        <input
                                                          type="text"
                                                          value={values.city}
                                                          name="city"
                                                          className="form-control"
                                                          placeholder="Enter City"
                                                          onChange={
                                                            handleChange
                                                          }
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
                                            paymentmethod: "",
                                            scheme: [],
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
                                            scheme: Yup.array().min(
                                              1,
                                              "At least one scheme must be selected"
                                            ),
                                            price:
                                              Yup.string().required(
                                                "Price is required"
                                              ),
                                            paydate:
                                              Yup.string().required(
                                                "Date is required"
                                              ),
                                            photo: Yup.string().required(
                                              "Deposit Slip is required"
                                            ),
                                            receivedby: Yup.string().required(
                                              "Received By is required"
                                            ),
                                            paymentmethod:
                                              Yup.string().required(
                                                "Payment Method is required"
                                              ),
                                            discount: Yup.number()
                                              .min(
                                                0,
                                                "Discount must be at least 0%"
                                              )
                                              .max(
                                                100,
                                                "Discount cannot be more than 100%"
                                              )
                                              .required("Discount is required"),
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
                                            const AddPayment = {
                                              participant: values.participant,
                                              scheme: values.scheme,
                                              price: roundedPrice,
                                              discount: values.discount,
                                              paydate: values.paydate,
                                              photo: values.photo,
                                              receivedby: values.receivedby,
                                              paymentmethod:
                                                values.paymentmethod,
                                              added_by: userId,
                                            };

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

                                              // Ensure discountValue is valid, if not set to 0
                                              if (
                                                isNaN(discountValue) ||
                                                discountValue < 0
                                              ) {
                                                discountValue = 0;
                                              }

                                              // Update the discount field
                                              setFieldValue(
                                                "discount",
                                                discountValue
                                              );

                                              // Use priceBeforeDiscount for calculations
                                              const priceBeforeDiscount =
                                                parseFloat(
                                                  values.priceBeforeDiscount
                                                ) || 0;

                                              // Calculate the discounted price
                                              const discountedPrice =
                                                priceBeforeDiscount -
                                                (priceBeforeDiscount *
                                                  discountValue) /
                                                  100;

                                              // Calculate the discount amount in rupees
                                              const discountAmount =
                                                (priceBeforeDiscount *
                                                  discountValue) /
                                                100;

                                              // Update the price (price after discount) and discount amount
                                              setFieldValue(
                                                "price",
                                                discountedPrice.toFixed(2)
                                              );
                                              setFieldValue(
                                                "discountAmount",
                                                discountAmount.toFixed(2)
                                              );

                                              console.log(
                                                "Discount Value:",
                                                discountValue
                                              ); // Debugging
                                              console.log(
                                                "Price Before Discount:",
                                                priceBeforeDiscount
                                              ); // Debugging
                                              console.log(
                                                "Price After Discount:",
                                                discountedPrice
                                              ); // Debugging
                                              console.log(
                                                "Discount Amount:",
                                                discountAmount
                                              ); // Debugging
                                            };

                                            return (
                                              <Form>
                                                {errors.successMessage && (
                                                  <Alert color="success">
                                                    {errors.successMessage}
                                                  </Alert>
                                                )}

                                                {/* <Row>
                                                  <Col>
                                                    <Label>Participant</Label>
                                                    <Select
                                                      name="participant"
                                                      value={
                                                        this.state
                                                          .selectedParticipant
                                                          ?.name || "Unknown"
                                                      }
                                                      readOnly
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
                                                          "participant",
                                                          selectedOption?.value ||
                                                            ""
                                                        );
                                                      }}
                                                      // value={
                                                      //   participantOptions.find(
                                                      //     (option) =>
                                                      //       option.value ===
                                                      //       values.participant
                                                      //   ) || null
                                                      // }
                                                    />
                                                    <ErrorMessage
                                                      name="participant"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row> */}

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
                                                        for="priceBeforeDiscount"
                                                        className="form-label"
                                                      >
                                                        Price before Discount
                                                      </Label>
                                                      <Field
                                                        name="priceBeforeDiscount"
                                                        type="text"
                                                        placeholder="Enter price"
                                                        className={
                                                          "form-control" +
                                                          (errors.priceBeforeDiscount &&
                                                          touched.priceBeforeDiscount
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                        value={new Intl.NumberFormat(
                                                          "en-US"
                                                        ).format(
                                                          values.priceBeforeDiscount ||
                                                            0
                                                        )} // Format the value
                                                        readOnly
                                                        style={{
                                                          backgroundColor:
                                                            "#e9ecef",
                                                        }} // Slightly darker grey background
                                                      />

                                                      <ErrorMessage
                                                        name="priceBeforeDiscount"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  </Col>
                                                </Row>

                                                <Row>
                                                  <Col>
                                                    <Label>
                                                      Discount in (%)
                                                    </Label>
                                                    <Field
                                                      name="discount"
                                                      type="number"
                                                      className="form-control"
                                                      onChange={
                                                        handleDiscountChange
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="discount"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col>
                                                    <div className="mb-3">
                                                      <Label
                                                        for="discountAmount"
                                                        className="form-label"
                                                      >
                                                        Discount Amount (Rs)
                                                      </Label>
                                                      <Field
                                                        name="discountAmount"
                                                        type="text"
                                                        placeholder="Discount amount"
                                                        className={
                                                          "form-control" +
                                                          (errors.discountAmount &&
                                                          touched.discountAmount
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                        value={new Intl.NumberFormat(
                                                          "en-US",
                                                          {
                                                            style: "currency",
                                                            currency: "PKR",
                                                          }
                                                        ).format(
                                                          values.discountAmount ||
                                                            0
                                                        )} // Format the value as currency
                                                        readOnly
                                                        style={{
                                                          backgroundColor:
                                                            "#e9ecef",
                                                        }} // Slightly darker grey background
                                                      />
                                                      <ErrorMessage
                                                        name="discountAmount"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  </Col>
                                                </Row>

                                                <Row>
                                                  <Col>
                                                    <div className="mb-3">
                                                      <Label
                                                        for="price"
                                                        className="form-label"
                                                      >
                                                        Price after Discount
                                                      </Label>
                                                      <Field
                                                        name="price"
                                                        type="text"
                                                        placeholder="Enter price"
                                                        className={
                                                          "form-control" +
                                                          (errors.price &&
                                                          touched.price
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                        value={new Intl.NumberFormat(
                                                          "en-US"
                                                        ).format(
                                                          values.price || 0
                                                        )} // Format the value
                                                        readOnly
                                                        style={{
                                                          backgroundColor:
                                                            "#e9ecef",
                                                        }} // Slightly darker grey background
                                                      />
                                                      <ErrorMessage
                                                        name="price"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  </Col>
                                                </Row>

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
                                                      accept=".jpg,.jpeg,.png"
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
                                                      onChange={selectedOption => {
                                                        setFieldValue(
                                                          "membership",
                                                          selectedOption?.value ||
                                                            ""
                                                        );
                                                      }}
                                                      value={
                                                        membershipOptions.find(
                                                          option =>
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

ParticipantListN.propTypes = {
  match: PropTypes.object,
  AllLabs: PropTypes.array,
  className: PropTypes.any,
  onGetPendingLabs: PropTypes.func,
  onApproveUnapproveLab: PropTypes.func,
  history: PropTypes.any,
  onupdateAllLabs: PropTypes.any,
  onAddNewPayment: PropTypes.func,
  onupdateMembershipStatus: PropTypes.func,
  ongetDeleteParticipant: PropTypes.func,
  participantId: PropTypes.func,
  ongetApprovedLabs: PropTypes.func,
  ongetcyclelist: PropTypes.func,
  approvedLabs: PropTypes.array,
  onGetParticipantPayment: PropTypes.func,
  location: PropTypes.shape({
    search: PropTypes.string, // Ensure 'search' is a string
  }).isRequired, // Make it required if always expected

  CycleList: PropTypes.array,
  PaymentSchemeList: PropTypes.array,
  isPaymentModalOpen: PropTypes.array,
  togglePaymentModal: PropTypes.array,
  isMembershipModalOpen: PropTypes.array,
  toggleMembershipModal: PropTypes.array,
};
const mapStateToProps = ({
  Account,
  registrationAdmin,
  CycleList,
  PaymentScheme,
}) => {
  const cycleList = registrationAdmin.CycleList || [];
  const paymentSchemeList = PaymentScheme?.PaymentSchemeList || [];
  console.log("CycleList in mapStateToProps:", registrationAdmin, CycleList);
  // console.log("CycleList in mapStateToProps (registrationAdmin):", registrationAdmin.CycleList);
  console.log("CycleList in mapStateToProps (CycleList):", CycleList.CycleList);

  return {
    userID: Account.userID,
    AllLabs: registrationAdmin.AllLabs,
    approvedLabs: registrationAdmin.approvedLabs || [],
    CycleList: CycleList.CycleList, // Ensure it never returns undefined
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onApproveUnapproveLab: data => dispatch(approveUnapproveLab(data)),
  onGetPendingLabs: id => dispatch(getAllLabs(id)),
  onGetInstrumentTypeList: id => dispatch(getSchemelist(id)),
  onAddNewType: (id, createUnit) => dispatch(addNewSchemeList(id, createUnit)),
  onUpdateType: (id, methodlist) =>
    dispatch(updateSchemeList({ id, ...methodlist })),
  onupdateAllLabs: updatedData => {
    console.log("Dispatching updatedData:", updatedData); // Check if updated data is being passed
    dispatch(updateAllLabs(updatedData));
  },
  onGetParticipantPayment: id => dispatch(getParticipantSchemelist(id)),
  ongetApprovedLabs: id => dispatch(getApprovedLabs(id)),
  ongetDeleteParticipant: id => dispatch(getDeleteParticipant(id)),
  ongetcyclelist: id => dispatch(getcyclelist(id)),
  // onAddNewPayment: (id, payment) => dispatch(addNewPayment(id, payment)),
  onupdateMembershipStatus: (id, status) => {
    console.log("Updating Membership Status - ID:", id, "Status:", status);
    dispatch(updateMembershipStatus({ id, ...status }));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ParticipantListN));