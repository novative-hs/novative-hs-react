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
import moment from "moment";

import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  Form,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, ErrorMessage } from "formik";
import debounce from "lodash/debounce";
import "assets/scss/table.scss";

//Import Breadcrumb
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getSchemeAnalytesList,
  postMicroResult,
  // getResultsList,
  getmicroresultdata,
} from "store/results/actions";
import * as XLSX from "xlsx";

import "assets/scss/table.scss";
import { round } from "lodash";
import CycleList from "store/cycle/reducer";

class MicroResults extends Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
    this.node = React.createRef();
    this.state = {
      ReagentList: [],
      Instrument: [],
      SchemeAnalytesList: [],
      combinedData: [],
      list: "",
      instrument_name: "",
      selectedReagentAST: "",
      organism: "",
      antibiotic: "",
      Antibiotic: [],
      reagent_name: "",
      result: "",
      schemeName: "",
      microresults: "",
      selectedFile: null,
      selectedFileName: "",
      schemeType: "",
      comments: "",
      roundLoadedFor: null,
      loading: true,
      roundLoadedFor: null,
      round_status: "",
      result_status: "Created",
      rounds: "",
      issue_date: "",
      closing_date: "",
      cycle_no: "",
      isResubmitted: false,
      PostResult: [],
      currentRoundId: props.match.params.id,
      ResultList: [],
      isDataLoaded: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }
  // fetchResults = async () => {
  //   try {
  //     const id = this.props.match.params.id;
  //     console.log("🔄 Fetching latest results...");
  //     await this.props.onGetResultsList(id);
  //     console.log("✅ Latest results fetched");
  //   } catch (error) {
  //     console.error("❌ Error fetching results", error);
  //   }
  // };
  getApprovedLabListColumns = () => {
    const { schemeType } = this.props;

    if (schemeType === "Identification") {
      return [
        {
          text: "Antibiotic ",
          dataField: "antibiotic_name",
          sort: true,
          headerStyle: {
            color: "#212529",
            backgroundColor: "#a6d4ff",
            textAlign: "center",
          },
          align: "left",
          formatter: (cell, row) => <span>{row.antibiotic_name}</span>,
        },

        {
          text: "Resistant (R) ",
          dataField: "resistance",
          sort: true,
          headerStyle: {
            color: "#212529",
            backgroundColor: "#a6d4ff",
            textAlign: "center",
          },
          align: "center", // center the checkbox in the cell
          formatter: (cellContent, list, rowIndex) => (
            <div className="form-check d-flex justify-content-center">
              <input
                className="form-check-input"
                type="checkbox"
                id={`resistance-${rowIndex}`}
                checked={list.resistance || false}
                onChange={() => this.handleCheckboxToggle(list, "resistance")}
              />
            </div>
          ),
        },

        {
          text: "Intermediate (I)",
          dataField: "intermediate",
          sort: true,
          headerStyle: {
            color: "#212529",
            backgroundColor: "#a6d4ff",
            textAlign: "center",
          },
          align: "center",
          formatter: (cellContent, list, rowIndex) => (
            <div className="form-check d-flex justify-content-center">
              <input
                className="form-check-input"
                type="checkbox"
                id={`intermediate-${rowIndex}`}
                checked={list.intermediate || false}
                onChange={() => this.handleCheckboxToggle(list, "intermediate")}
              />
            </div>
          ),
        },

        {
          text: "Sensitive (S)",
          dataField: "sensitive",
          sort: true,
          headerStyle: {
            color: "#212529",
            backgroundColor: "#a6d4ff",
            textAlign: "center",
          },
          align: "center",
          formatter: (cellContent, list, rowIndex) => (
            <div className="form-check d-flex justify-content-center">
              <input
                className="form-check-input"
                type="checkbox"
                id={`sensitive-checkbox-${rowIndex}`}
                checked={list.sensitive || false}
                onChange={() => this.handleCheckboxToggle(list, "sensitive")}
              />
            </div>
          ),
        },

        {
          text: "Not Tested",
          dataField: "notTested",
          sort: true,
          headerStyle: {
            color: "#212529",
            backgroundColor: "#a6d4ff",
            textAlign: "center",
          },
          align: "center",
          formatter: (cellContent, list, rowIndex) => (
            <div className="form-check d-flex justify-content-center">
              <input
                className="form-check-input"
                type="checkbox"
                id={`notTested-checkbox-${rowIndex}`}
                checked={list.notTested || false}
                onChange={() => this.handleCheckboxToggle(list, "notTested")}
              />
            </div>
          ),
        },
      ];
    }
  };
  handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log("📂 Selected file:", file, file instanceof File); // should log true
      this.setState({
        selectedFile: file,
        selectedFileName: file.name,
      });
    }
  };
  async componentDidMount() {
    const roundId = this.props.match.params.id;
    const userId = this.state.user_id;

    if (!userId) return;

    // First fetch scheme/round info
    this.props.onGetSchemeAnalyte(roundId);

    // Then fetch micro results with all params
    this.props.onGetMicroresult(
      userId,
      this.props.scheme,
      this.props.round_name
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      SchemeAnalytesList,
      ListAntibiotic,
      ListOrganism,
      Instrument,
      ReagentList,
      ResultList,
      round_status,
      result_type,
      scheme,
      round_name, // <-- make sure these are mapped in mapStateToProps
    } = this.props;

    const { user_id, isDataLoaded, roundLoadedFor } = this.state;

    const prevRoundId = prevProps.match.params.id;
    const currentRoundId = this.props.match.params.id;
    const roundChanged = currentRoundId !== roundLoadedFor;

    // 🔄 Round changed
    if (prevRoundId !== currentRoundId) {
      this.props.clearResultsState();
      this.props.clearAnalyteState();

      this.setState({
        isDataLoaded: false,
        combinedData: [],
        roundLoadedFor: null,
        loading: true,
        SchemeAnalytesList: [],
        ListAntibiotic: [],
        ListOrganism: [],
        Instrument: [],
        ReagentList: [],
        ResultList: [],
        round_status: null,
      });

      if (user_id) {
        this.props.onGetSchemeAnalyte(currentRoundId);
        this.props.onGetMicroresult(user_id, scheme, round_name); // ✅ pass them
      }
      return;
    }

    // 👤 First time user_id appears
    if (!prevState.user_id && user_id) {
      const id = this.props.match.params.id;
      this.props.onGetSchemeAnalyte(id);
      this.props.onGetMicroresult(user_id, scheme, round_name); // ✅ pass them
      return;
    }

    // ✅ When scheme/round_name become available later
    if (
      scheme &&
      round_name &&
      (scheme !== prevProps.scheme || round_name !== prevProps.round_name)
    ) {
      this.props.onGetMicroresult(user_id, scheme, round_name); // ✅ fetch again
    }

    const allListsReady =
      ListAntibiotic?.length > 0 &&
      ListOrganism?.length > 0 &&
      Instrument?.length > 0 &&
      ReagentList?.length > 0;

    if (allListsReady && (!isDataLoaded || roundChanged)) {
      this.setState(
        {
          SchemeAnalytesList,
          ListAntibiotic,
          ListOrganism,
          Instrument,
          ReagentList,
          ResultList,
          round_status,
          result_type,
          isDataLoaded: true,
          roundLoadedFor: currentRoundId,
        },
        this.combineData
      );
      return;
    }

    const dataChanged = [
      prevProps.SchemeAnalytesList !== SchemeAnalytesList,
      prevProps.ListAntibiotic !== ListAntibiotic,
      prevProps.ListOrganism !== ListOrganism,
      prevProps.Instrument !== Instrument,
      prevProps.ReagentList !== ReagentList,
      prevProps.round_status !== round_status,
    ].some(Boolean);

    if (dataChanged && isDataLoaded) {
      this.setState({
        SchemeAnalytesList,
        ListAntibiotic,
        ListOrganism,
        Instrument,
        ReagentList,
        ResultList,
        round_status,
        result_type,
      });
    }
  }

  handleAntibioticChange = (e, row) => {
    const value = e.target.value;
    const updatedData = this.state.combinedData.map((item) =>
      item.id === row.id ? { ...item, antibiotic_id: value } : item
    );
    this.setState({ combinedData: updatedData });
  };
  combineData = () => {
    const { ResultList = [] } = this.props;
    if (ResultList.length > 0) {
      const firstResult = ResultList[0];

      // ✅ Find the matching organism object from ListOrganism
      const matchedOrg = this.props.ListOrganism.find(
        (o) => o.name === firstResult.organism
      );

      this.setState({
        selectedOrganism: matchedOrg ? matchedOrg.id : "",
        selectedOrganismName: matchedOrg ? matchedOrg.name : "",
        selectedReagent: firstResult.reagent_name || "",
        selectedReagentAST: firstResult.ast_reagent_name || "",
        selectedInstrument: firstResult.instrument_name || "",
        selectedFileName: firstResult.result_sheet
          ? firstResult.result_sheet.split("/").pop() // extract just file name
          : "",
      });
    }

    const combinedData =
      ResultList.length > 0
        ? ResultList.map((item, index) => ({
            id: index + 1,
            antibiotic_name: item.antibiotic_name || "",
            resistance: item.resistance === true,
            intermediate: item.intermediate === true,
            sensitive: item.sensitive === true,
            notTested: item.not_tested === true,
            reagent_name: item.reagent_name || "",
            instrument_name: item.instrument_name || "",
            comment: item.comment || "",
            result_status: item.result_status || "Saved",
            organism: item.organism || "",
          }))
        : this.props.ListAntibiotic.map((ab, index) => ({
            id: ab.id,
            antibiotic_id: ab.id,
            antibiotic_name: ab.name,
            resistance: false,
            intermediate: false,
            sensitive: false,
            notTested: false,
          }));

    this.setState({ combinedData, loading: false });
  };

  handleInstrumentChange = (event, list) => {
    const { value } = event.target;
    this.setState((prevState) => {
      const updatedData = prevState.combinedData.map((item) => {
        if (item.id === list.id) {
          const selectedInstrument = prevState.Instrument.find(
            (instr) => instr.id.toString() === value
          );
          return {
            ...item,
            instrument_name: value, // Store the selected ID
            instrument_display_name: selectedInstrument
              ? selectedInstrument.name
              : "", // Display name
          };
        }
        return item;
      });
      return { combinedData: updatedData };
    });
  };

  handleCheckboxToggle = (item, field) => {
    const updatedData = this.state.combinedData.map((row) => {
      if (row.id === item.id) {
        return {
          ...row,
          resistance: false,
          intermediate: false,
          sensitive: false,
          notTested: false,
          [field]: true, // Only the selected field is set to true
        };
      }
      return row;
    });

    this.setState({ combinedData: updatedData });
  };

  handleReagentChange = (event, list) => {
    const { value } = event.target;
    const { combinedData } = this.state;

    const updatedData = combinedData.map((item) => {
      if (item.id === list.id) {
        return { ...item, reagent_name: value };
      }
      return item;
    });

    this.setState({ combinedData: updatedData });
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
  handleSaveAll = async () => {
    const { combinedData, comments, selectedOrganism, selectedFile, user_id } =
      this.state;

    if (!combinedData.length) {
      alert("No results to save.");
      return;
    }
    // ✅ Validate organism selection
    const organismName =
      this.props.ListOrganism.find((o) => o.id.toString() === selectedOrganism)
        ?.name || "";

    if (!selectedOrganism || !organismName) {
      alert("Please select an organism before saving results.");
      return;
    }

    const confirmSave = window.confirm(
      "Are you sure you want to save all results?"
    );
    if (!confirmSave) return;

    try {
      for (const row of combinedData) {
        const resultData = new FormData();
        resultData.append("scheme", this.props.schemeName || "");
        resultData.append("round_name", this.props.rounds || "");
        resultData.append("organism", organismName); // ✅ fixed
        resultData.append("organism_id", selectedOrganism);
        resultData.append("antibiotic_name", row.antibiotic_name || "");
        resultData.append("resistance", row.resistance ? "true" : "false");
        resultData.append("intermediate", row.intermediate ? "true" : "false");
        resultData.append("sensitive", row.sensitive ? "true" : "false");
        resultData.append("not_tested", row.notTested ? "true" : "false");
        resultData.append("reagent_name", this.state.selectedReagent || "");
        resultData.append(
          "ast_reagent_name",
          this.state.selectedReagentAST || ""
        );
        resultData.append(
          "instrument_name",
          this.state.selectedInstrument || ""
        );
        resultData.append("result_status", "Saved");
        resultData.append("comment", comments || "");

        if (selectedFile instanceof File) {
          resultData.append("result_sheet", selectedFile, selectedFile.name);
        }

        await this.props.onPostMicroResult(resultData, user_id);
      }

      alert("All microbiology results have been saved successfully.");
    } catch (error) {
      console.error("❌ Save error:", error);
      alert("Failed to save results. Please try again.");
    }
  };

  handleSubmitAll = async () => {
    const { combinedData, user_id, comments, selectedOrganism, selectedFile } =
      this.state;

    if (!combinedData.length) {
      alert("No results to submit.");
      return;
    }

    // ✅ Get organism name from ListOrganism
    const organismName =
      this.props.ListOrganism.find((o) => o.id.toString() === selectedOrganism)
        ?.name || "";

    if (!selectedOrganism || !organismName) {
      alert("Please select an organism before submitting results.");
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to submit all results?"
    );
    if (!confirmation) return;

    try {
      let latestUpdatedAt = new Date().toISOString();

      for (const row of combinedData) {
        const resultData = new FormData();
        resultData.append("scheme", this.props.schemeName || "");
        resultData.append("round_name", this.props.rounds || "");
        resultData.append("participant_id", parseInt(user_id, 10));
        resultData.append("organism", organismName); // ✅ fixed
        resultData.append("organism_id", selectedOrganism);
        resultData.append("antibiotic_name", row.antibiotic_name || "");
        resultData.append("resistance", row.resistance ? "true" : "false");
        resultData.append("intermediate", row.intermediate ? "true" : "false");
        resultData.append("sensitive", row.sensitive ? "true" : "false");
        resultData.append("not_tested", row.notTested ? "true" : "false");
        resultData.append("reagent_name", this.state.selectedReagent || "");
        resultData.append(
          "instrument_name",
          this.state.selectedInstrument || ""
        );
        resultData.append(
          "ast_reagent_name",
          this.state.selectedReagentAST || ""
        );
        resultData.append("result_status", "Submitted");
        resultData.append("comment", comments || "");
        if (selectedFile instanceof File) {
          resultData.append("result_sheet", selectedFile, selectedFile.name);
        }

        const response = await this.props.onPostMicroResult(
          resultData,
          user_id
        );

        if (response.type === "POST_RESULT" && response.payload?.updated_at) {
          latestUpdatedAt = response.payload.updated_at;
        }
      }

      // ✅ Update state after submission
      this.setState((prevState) => ({
        combinedData: prevState.combinedData.map((data) => ({
          ...data,
          result_status: "Submitted",
        })),
        submittedOn: latestUpdatedAt,
      }));

      localStorage.setItem("submittedOn", latestUpdatedAt);

      alert("All microbiology results have been submitted successfully.");
    } catch (error) {
      console.error("❌ Submit error:", error);
      alert("Failed to submit results. Please try again.");
    }
  };

  handleResubmit = async () => {
    const { combinedData, user_id, comments, selectedOrganism, selectedFile } =
      this.state;

    if (!combinedData.length) {
      alert("No results to resubmit.");
      return;
    }

    if (!selectedOrganism) {
      alert("Please select an organism before resubmitting results.");
      return;
    }

    const organismName =
      this.props.ListOrganism.find((o) => o.id.toString() === selectedOrganism)
        ?.name || "";

    const confirmation = window.confirm(
      "Are you sure you want to resubmit all results?"
    );
    if (!confirmation) return;

    try {
      let latestUpdatedAt = new Date().toISOString();

      for (const row of combinedData) {
        const resultData = new FormData();
        resultData.append("scheme", this.props.schemeName || "");
        resultData.append("round_name", this.props.rounds || "");
        resultData.append("participant_id", parseInt(user_id, 10));
        resultData.append("organism", this.state.selectedOrganismName);
        resultData.append("organism_id", this.state.selectedOrganism);
        resultData.append("antibiotic_name", row.antibiotic_name || "");
        resultData.append("resistance", row.resistance ? "true" : "false");
        resultData.append("intermediate", row.intermediate ? "true" : "false");
        resultData.append("sensitive", row.sensitive ? "true" : "false");
        resultData.append("not_tested", row.notTested ? "true" : "false");
        resultData.append("reagent_name", this.state.selectedReagent || "");
        resultData.append(
          "instrument_name",
          this.state.selectedInstrument || ""
        );
        resultData.append(
          "ast_reagent_name",
          this.state.selectedReagentAST || ""
        ); // new field
        resultData.append("result_status", "Submitted");
        resultData.append("comment", comments || "");
        if (selectedFile instanceof File) {
          resultData.append("result_sheet", selectedFile, selectedFile.name);
        }

        const response = await this.props.onPostMicroResult(
          resultData,
          user_id
        ); // still calls the same API

        if (response.type === "POST_RESULT" && response.payload?.updated_at) {
          latestUpdatedAt = response.payload.updated_at;
        }
      }

      this.setState((prevState) => ({
        submittedOn: latestUpdatedAt,
        comments: "",
        combinedData: prevState.combinedData.map((row) => ({
          ...row,
          result_status: "Submitted",
        })),
      }));

      localStorage.setItem("submittedOn", latestUpdatedAt);

      alert("Results resubmitted successfully!");
    } catch (error) {
      console.error("❌ Resubmit error:", error);
      alert("Failed to resubmit results. Please try again.");
    }
  };

  render() {
    const approvedLabListColumns = this.getApprovedLabListColumns();
    const id = this.props.match.params.id;
    const { SearchBar } = Search;
    const { combinedData, isDataLoaded } = this.state;
    const {
      schemeName,
      microresults,
      scheme_id,
      schemeType,
      rounds,
      issue_date,
      closing_date,
      cycle_no,
      round_status,
    } = this.props;
    console.log("Round Status:", this.props.round_status);
    const { loading } = this.state;

    if (loading) {
      return (
        <div className="text-center mt-5">
          <h5>Loading round data...</h5>
        </div>
      );
    }

    const pageOptions = {
      sizePerPage: 50,
      totalSize: combinedData.length > 0 ? combinedData.length : " ",
      custom: true,
    };

    if (!isDataLoaded) {
      // return <div>Loading...</div>;
    }
    if (!this.state.isDataLoaded) {
      return <div className="text-center mt-5">Loading round data...</div>;
    }
    const defaultSorted = [
      {
        dataField: "name", // or scheme_name, name, etc.
        order: "asc", // A to Z
      },
    ];

    const { organization_name } = this.props.match.params;
    const participant_id = this.props.match.params.id1;
    return (
      <React.Fragment>
        {schemeType ? (
          <div className="page-content">
            <MetaTags>
              <title>Participant Result | NEQAS</title>
            </MetaTags>
            <Container fluid>
              <Row className="mb-3 text-dark fs-6">
                <strong>
                  <Col className="d-flex flex-wrap justify-content-md-around justify-content-sm-start  p-3">
                    <div className="d-flex flex-column flex-md-row align-items-start  mb-2 mb-md-0 p-2">
                      <span className="me-2">Participant No:</span>
                      <span>{participant_id}</span>
                    </div>
                    <div className="d-flex flex-column flex-md-row align-items-start mb-2 mb-md-0 p-2">
                      <span className="me-2">Scheme - Cycle: </span>
                      <span>
                        ({schemeName}) - {cycle_no}
                      </span>
                    </div>

                    <div className="d-flex flex-column flex-md-row align-items-start mb-2 mb-md-0 p-2">
                      <span className="me-2">Round No: </span>
                      <span>{rounds}</span>
                    </div>
                    <div className="d-flex flex-column flex-md-row align-items-start mb-2 mb-md-0 p-2">
                      <span className="me-2">Issue Date:</span>
                      <span>{moment(issue_date).format("DD MMM YY")}</span>
                    </div>
                    <div className="d-flex flex-column flex-md-row align-items-start p-2">
                      <span className="me-2">Closing Date: </span>
                      <span>{moment(closing_date).format("DD MMM YY")}</span>
                    </div>
                  </Col>
                </strong>
              </Row>
              <Row
                className="align-items-center mb-3 g-2"
                style={{ marginLeft: "25px", marginRight: "25px" }}
              >
                <Col
                  md={6}
                  className="d-flex justify-content-start align-items-center"
                >
                  <Button
                    color="primary"
                    onClick={() => this.fileInput.click()}
                    className="px-4 py-2 shadow-sm"
                    style={{ minWidth: "200px", fontWeight: "500" }}
                  >
                    <i className="mdi mdi-upload me-2"></i>
                    Upload Result Sheet
                  </Button>

                  <input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    ref={(ref) => (this.fileInput = ref)}
                    style={{ display: "none" }}
                    onChange={this.handleFileUpload}
                  />

                  {/* Show file name if selected */}
                  {this.state.selectedFileName && (
                    <span className="ms-3 text-dark fw-bold">
                      {this.state.selectedFileName}
                    </span>
                  )}
                </Col>

                {/* Save / Submit buttons - right */}
                <Col md={6} className="d-flex justify-content-end gap-2">
                  {(() => {
                    const allSubmitted =
                      this.state.combinedData.length > 0 &&
                      this.state.combinedData.every(
                        (data) => data.result_status === "Submitted"
                      );

                    if (this.props.round_status === "Closed") {
                      // ✅ Round closed → No buttons at all
                      return null;
                    }

                    if (allSubmitted) {
                      // ✅ All submitted → show Re-Submit if round is open
                      return (
                        <Button
                          color="primary"
                          style={{ minWidth: "140px", fontWeight: "500" }}
                          onClick={this.handleResubmit}
                        >
                          Re-Submit
                        </Button>
                      );
                    }

                    // ✅ Not all submitted → show Save + Submit
                    return (
                      <>
                        <Button
                          color="primary"
                          style={{ minWidth: "120px", fontWeight: "500" }}
                          onClick={this.handleSaveAll}
                        >
                          Save
                        </Button>
                        <Button
                          color="primary"
                          style={{ minWidth: "120px", fontWeight: "500" }}
                          onClick={this.handleSubmitAll}
                        >
                          Submit
                        </Button>
                      </>
                    );
                  })()}
                </Col>

                <Row className="mt-3 text-dark">
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <label
                        className="form-label mb-0 me-2"
                        style={{ whiteSpace: "nowrap", width: "320px" }} // keep text in one line
                      >
                        <strong>Select Organism:</strong>
                      </label>
                      <select
                        className="form-control"
                        value={this.state.selectedOrganism}
                        onChange={(e) =>
                          this.setState({ selectedOrganism: e.target.value })
                        }
                        style={{ maxWidth: "250px" }}
                      >
                        <option value="">Select Organism</option>
                        {this.props.ListOrganism?.map((org) => (
                          <option key={org.id} value={org.id}>
                            {org.name} ({org.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>
                </Row>

                <Row className="mt-2 text-dark">
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <label
                        className="form-label mb-0 me-2"
                        style={{ whiteSpace: "nowrap", width: "320px" }} // keeps it inline
                      >
                        <strong>
                          Select Reagent for Organism Identification:
                        </strong>
                      </label>
                      <select
                        className="form-control"
                        value={this.state.selectedReagent}
                        onChange={(e) =>
                          this.setState({ selectedReagent: e.target.value })
                        }
                        style={{ maxWidth: "250px" }}
                      >
                        <option value="">Select Reagent</option>
                        {this.state.ReagentList?.map((reag) => (
                          <option key={reag.id} value={reag.name}>
                            {reag.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>
                </Row>

                <Row className="mt-2 text-dark">
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <label
                        className="form-label mb-0 me-2"
                        style={{ whiteSpace: "nowrap", width: "320px" }}
                      >
                        <strong>Select Reagent for AST:</strong>
                      </label>
                      <select
                        className="form-control"
                        value={this.state.selectedReagentAST}
                        onChange={(e) =>
                          this.setState({ selectedReagentAST: e.target.value })
                        }
                        style={{ maxWidth: "250px" }}
                      >
                        <option value="">Select Reagent</option>
                        {this.state.ReagentList?.map((reag) => (
                          <option key={reag.id} value={reag.name}>
                            {reag.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>
                </Row>

                <Row className="mt-2 text-dark">
                  <Col md={6}>
                    <div className="d-flex align-items-center">
                      <label
                        className="form-label mb-0 me-2"
                        style={{ whiteSpace: "nowrap", width: "320px" }}
                      >
                        <strong>Select Automated AST System (if used):</strong>
                      </label>
                      <select
                        className="form-control"
                        value={this.state.selectedInstrument}
                        onChange={(e) =>
                          this.setState({ selectedInstrument: e.target.value })
                        }
                        style={{ maxWidth: "250px" }}
                      >
                        <option value="">Select Instrument for AST</option>
                        {this.state.Instrument?.map((inst) => (
                          <option key={inst.id} value={inst.name}>
                            {inst.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>
                </Row>

                {/* Reagent dropdown */}
              </Row>

              <Row className="justify-content-center align-item-center">
                <Col lg="10">
                  <Card>
                    <CardBody>
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="id"
                        columns={approvedLabListColumns}
                        data={combinedData}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="id"
                            columns={approvedLabListColumns}
                            data={combinedData}
                            search
                          >
                            {(toolkitprops) => (
                              <React.Fragment>
                                <div className="table-responsive">
                                  <BootstrapTable
                                    id="printable-table" // Added ID here
                                    keyField="id"
                                    ref={this.node}
                                    responsive
                                    bordered={false}
                                    striped={false}
                                    defaultSorted={defaultSorted}
                                    classes={"table table-bordered "}
                                    {...toolkitprops.baseProps}
                                    {...paginationTableProps}
                                  />
                                  <div className="float-end">
                                    <PaginationListStandalone
                                      {...paginationProps}
                                      onPageChange={this.onPaginationPageChange}
                                    />
                                  </div>
                                </div>
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
        ) : (
          <div>No scheme type available</div>
        )}
      </React.Fragment>
    );
  }
}
MicroResults.propTypes = {
  match: PropTypes.object,
  schemeName: PropTypes.string,
  microresults: PropTypes.string,
  schemeType: PropTypes.string,
  SchemeAnalytesList: PropTypes.array,
  rounds: PropTypes.string,
  round_status: PropTypes.string,
  result_type: PropTypes.string,
  scheme_id: PropTypes.number,
  issue_date: PropTypes.string,
  closing_date: PropTypes.string,
  cycle_no: PropTypes.string,
  ListAntibiotic: PropTypes.array,
  ListOrganism: PropTypes.array,
  Instrument: PropTypes.array,
  ReagentList: PropTypes.array,
  PostResult: PropTypes.array,
  ResultList: PropTypes.array,
  className: PropTypes.any,
  onGetSchemeAnalyte: PropTypes.func,
  onGetMicroresult: PropTypes.func,
  onPostMicroResult: PropTypes.func,
  // onGetResultsList: PropTypes.func,
  clearResultsState: PropTypes.func,
  clearAnalyteState: PropTypes.func,
  history: PropTypes.object.isRequired,
  scheme: PropTypes.object, // or more specific if you know the shape
  round_name: PropTypes.string,
};
const mapStateToProps = (state) => {
  const schemeState = state.SchemeAnalytesList || {};
  const antibiotics = schemeState.ListAntibiotic || [];

  console.log("🧪 Antibiotic List in mapStateToProps:", antibiotics);

  return {
    schemeName: schemeState.schemeName,
    schemeType: schemeState.schemeType,
    rounds: schemeState.rounds,
    issue_date: schemeState.issue_date,
    closing_date: schemeState.closing_date,
    round_status: schemeState.round_status,
    cycle_no: schemeState.cycle_no,
    result_type: schemeState.result_type,
    scheme_id: schemeState.scheme_id,
    microresults: schemeState.microresults,
    ResultList: schemeState.ResultList,
    SchemeAnalytesList: schemeState.SchemeAnalytesList || [],
    scheme: state.SchemeAnalytesList.schemeName,
    round_name: state.SchemeAnalytesList.rounds,
    ListOrganism: schemeState.ListOrganism || [],
    ListAntibiotic: schemeState.ListAntibiotic || [],
    ReagentList: schemeState.ReagentList || [],
    Instrument: schemeState.Instrument || [],
  };
};
const mapDispatchToProps = (dispatch) => ({
  onGetSchemeAnalyte: (id) => dispatch(getSchemeAnalytesList(id)),
  onPostMicroResult: (formData, id) => dispatch(postMicroResult(formData, id)),
  onGetMicroresult: (userId, scheme, round_name) =>
    dispatch(getmicroresultdata(userId, scheme, round_name)),
  // any other actions you need...
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MicroResults));
