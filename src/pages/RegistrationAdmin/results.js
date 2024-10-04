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
  postResult,
  getResultsList,
} from "store/results/actions";
import { getunitlist } from "store/units/actions";
import { getmethodlist } from "store/methods/actions";
import { getInstrumentlist } from "store/instrument/actions";
import { getReagentlist } from "store/reagents/actions";
import * as XLSX from "xlsx";

import "assets/scss/table.scss";
import { round } from "lodash";

class Results extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      ReagentList: [],
      Instrument: [],
      ListMethods: [],
      ListUnits: [],
      SchemeAnalytesList: [],
      combinedData: [],
      list: "",
      unit_name: "",
      instrument_name: "",
      method_name: "",
      reagent_name: "",
      result_type: "",
      result: "",
      schemeName: "",
      schemeType: "",
      round_status: "",
      result_status: "Created",
      rounds: "",
      issue_date: "",
      closing_date: "",
      participant_ids: [],
      PostResult: [],
      ResultList: [],
      isDataLoaded: false, // Flag to track if all data is loaded
      participantID: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).participantID
        : "",
      // approvedLabListColumns: this.getApprovedLabListColumns(), // Initialize columns in state

    
    };
  }
  getApprovedLabListColumns = () => {
    const { schemeType, round_status } = this.props;

    if (schemeType === "Quantitative") {
      return [
        {
          text: "Analyte",
          dataField: "analyte_name",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">{list.analyte_name}</div>
          ),
        },
        {
          text: "Unit",
          dataField: "unit_name",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">
              <select
                value={list.unit_name || ""} // Default to an empty string if unit_name is not provided
                onChange={e => this.handleUnitChange(e, list)}
              >
                <option value="" disabled hidden>
                  Select Unit
                </option>{" "}
                {/* This will be the default option when no unit is selected */}
                {Array.isArray(this.state.ListUnits) &&
                this.state.ListUnits.length > 0 ? (
                  this.state.ListUnits.map((unit, index) => (
                    <option key={index} value={unit.id}>
                      {unit.name}
                    </option>
                  ))
                ) : (
                  <option value="">No units available</option>
                )}
              </select>
            </div>
          ),
        },
        {
          text: "Instrument",
          dataField: "instrument_name",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">
              <select
                value={list.instrument_name || ""}
                onChange={e => this.handleInstrumentChange(e, list)}
              >
                <option value="" disabled hidden>
                  Select Instrument
                </option>
                {Array.isArray(this.state.Instrument) &&
                this.state.Instrument.length > 0 ? (
                  this.state.Instrument.map((instru, index) => (
                    <option key={index} value={instru.id}>
                      {instru.name}
                    </option>
                  ))
                ) : (
                  <option value="">No Instruments available</option>
                )}
              </select>
            </div>
          ),
        },
        {
          text: "Method",
          dataField: "method_name",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">
              {" "}
              <select
                value={list.method_name || ""}
                onChange={e => this.handleMethodChange(e, list)}
              >
                <option value="" disabled hidden>
                  Select Method
                </option>
                {Array.isArray(this.state.ListMethods) &&
                this.state.ListMethods.length > 0 ? (
                  this.state.ListMethods.map((method, index) => (
                    <option key={index} value={method.id}>
                      {method.name}
                    </option>
                  ))
                ) : (
                  <option value="">No methods available</option>
                )}
              </select>
            </div>
          ),
        },
        {
          text: "Reagent",
          dataField: "reagent_name",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">
              <select
                value={list.reagent_name || ""}
                onChange={e => this.handleReagentChange(e, list)}
              >
                {/* Default option */}
                <option value="" disabled hidden>
                  Select Reagent
                </option>
                {Array.isArray(this.state.ReagentList) && this.state.ReagentList.length > 0 ? (
                  <>
                    {/* Add an empty option for the default selection */}
                    <option value="" disabled>
                      Select Reagent
                    </option>
                    {this.state.ReagentList.map((reagent, index) => (
                      <option key={index} value={reagent.id}>
                        {reagent.name}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="">No reagents available</option>
                )}
              </select>
            </div>
          ),          
        },        
        {
          text: "Result Value",
          dataField: "result",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">
              <input
                type="text"
                ref={el => (this[`resultRef_${list.id}`] = el)}
                defaultValue={list.result || ""} // Ensure defaultValue is set properly
                placeholder="Enter result"
              />
            </div>
          ),
        },
        {
          // text: "Actions",
          formatter: (cellContent, list) => {
            const { round_status } = this.props;

            return (
              <div className="d-flex flex-row align-items-start">
                {/* Check if round_status is "Open" and list.result_status is "Created" */}
                {round_status && 
                round_status === "Open" ? (
                  <>
                    <button
                      onClick={() => this.handleSubmit(list)}
                      className="btn btn-success"
                    >
                      Submit
                    </button>
                  </>
                ) : null}{" "}
                {/* If the status is "Closed", hide the buttons */}
              </div>
            );
          },
        },
      ];
    } else if (schemeType === "Qualitative") {
      return [
        {
          text: "Analyte",
          dataField: "analyte_name",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">{list.analyte_name}</div>
          ),
        },
        {
          text: "Instrument",
          dataField: "instrument_name",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">
              <select
                value={list.instrument_name || ""}
                onChange={e => this.handleInstrumentChange(e, list)}
              >
                <option value="" disabled hidden>
                  Select Instrument
                </option>
                {Array.isArray(this.state.Instrument) &&
                this.state.Instrument.length > 0 ? (
                  this.state.Instrument.map((instru, index) => (
                    <option key={index} value={instru.id}>
                      {instru.name}
                    </option>
                  ))
                ) : (
                  <option value="">No Instruments available</option>
                )}
              </select>
            </div>
          ),
        },
        {
          text: "Method",
          dataField: "method_name",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">
              {" "}
              <select
                value={list.method_name || ""}
                onChange={e => this.handleMethodChange(e, list)}
              >
                <option value="" disabled hidden>
                  Select Method
                </option>
                {Array.isArray(this.state.ListMethods) &&
                this.state.ListMethods.length > 0 ? (
                  this.state.ListMethods.map((method, index) => (
                    <option key={index} value={method.id}>
                      {method.name}
                    </option>
                  ))
                ) : (
                  <option value="">No methods available</option>
                )}
              </select>
            </div>
          ),
        },
        {
          text: "Reagent",
          dataField: "reagent_name",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">
              <select
                value={list.reagent_name || ""}
                onChange={e => this.handleReagentChange(e, list)}
              >
                <option value="" disabled hidden>
                  Select Reagent
                </option>
                {Array.isArray(this.state.ReagentList) && this.state.ReagentList.length > 0 ? (
                  this.state.ReagentList.map((reagent, index) => (
                    <option key={index} value={reagent.id}>
                      {reagent.name}
                    </option>
                  ))
                ) : (
                  <option value="">No reagents available</option>
                )}
              </select>
            </div>
          ),
        },
        
        
        {
          text: "Result Type",
          dataField: "result_type",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">
              <select
                value={list.result_type || ""} // Ensure this is set properly
                onChange={(e) => this.handleResultTypeChange(e, list)} // Handle the change event
              >
                <option value="" disabled hidden>
                  Select Result Type
                </option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
                <option value="Equivocal">Equivocal</option>
              </select>
            </div>
          ),
        },
        
        {
          text: "Result Value",
          dataField: "result",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">
              <input
                type="text"
                ref={el => (this[`resultRef_${list.id}`] = el)}
                defaultValue={list.result || ""} // Ensure defaultValue is set properly
                placeholder="Enter result"
              />
            </div>
          ),
        },
        {
          // text: "Actions",
          text: "Actions",
          dataField: "Actions",
          sort: true,
          formatter: (cellContent, list) => {
            const { round_status } = this.props;

            return (
              <div className="d-flex flex-row align-items-start">
                {/* Check if round_status is "Open" and list.result_status is "Created" */}
                {round_status &&
                round_status === "Open" ? (
                  <>
                    <button
                      onClick={() => this.handleSubmit(list)}
                      className="btn btn-success"
                    >
                      Submit
                    </button>
                  </>
                ) : null}{" "}
                {/* If the status is "Closed", hide the buttons */}
              </div>
            );
          },
        },
      ];
    }
  };

  // componentDidMount() {
  //   const { SchemeAnalytesList, ListUnits } = this.props;

  //   const { onGetSchemeAnalyte, onGetUnitsList } = this.props;
  //   const id = this.props.match.params.id;
  //   const participantID = this.state.participantID;
  //   onGetSchemeAnalyte(id);
  //   onGetUnitsList(participantID);

  //   setTimeout(() => {
  //     this.setState(
  //       {
  //         SchemeAnalytesList: this.props.SchemeAnalytesList,
  //         ListUnits: this.props.ListUnits,
  //       },
  //       this.combineData
  //     );
  //   }, 1000); // Adjust the timeout as needed
  // }
  componentDidMount() {
    const {
      onGetSchemeAnalyte,
      onGetUnitsList,
      onGetMethodsList,
      onGetInstrumentList,
      onGetReagents,
      onGetResultsList,
      ResultList,
      // Access scheme_name from props
    } = this.props;

    const id = this.props.match.params.id;
    console.log("props main id ", id, this.props.match.params.id)
    // Extract participantID from the query string
    const searchParams = new URLSearchParams(this.props.location.search);
    const participantID = searchParams.get('participantID');    

    onGetSchemeAnalyte(id);
    onGetUnitsList(participantID);
    onGetMethodsList(participantID);
    onGetReagents(participantID);
    onGetInstrumentList(participantID);

    onGetResultsList(id);
  }
  componentDidUpdate(prevProps) {
    const {
      SchemeAnalytesList,
      ListUnits,
      ListMethods,
      Instrument,
      ReagentList,
      ResultList,
      round_status,
      result_status,
      result_type,
    } = this.props;
    console.log("STATUSS", this.props.round_status, this.props.result_status, this.props.result_type)
    const dataChanged = [
      prevProps.SchemeAnalytesList !== SchemeAnalytesList,
      prevProps.ListUnits !== ListUnits,
      prevProps.ListMethods !== ListMethods,
      prevProps.Instrument !== Instrument,
      prevProps.ReagentList !== ReagentList,
      prevProps.ResultList !== ResultList,
      prevProps.round_status !== round_status,
    ].some(Boolean);

    if (dataChanged) {
      this.setState(
        {
          SchemeAnalytesList,
          ListUnits,
          ListMethods,
          Instrument,
          ReagentList,
          ResultList,
          round_status,
          result_status,
          result_type,
          isDataLoaded: true, // Data is now loaded
        },
        this.combineData
      );
    }
  }

  combineData = () => {
    const {
      SchemeAnalytesList,
      ListUnits,
      ListMethods,
      Instrument,
      ReagentList,
      ResultList, // This array contains the previously submitted values
    } = this.state;

    const { participant_ids, rounds } = this.props;
    const { participantID } = this.state;
    const combinedData = SchemeAnalytesList.map((analyte, index) => {
      // console.log("SchemeAnalytesList", SchemeAnalytesList)
      // Filter ResultList where the analyte matches
      const participantResults = ResultList.filter(result => {
        return result.analyte === analyte.id;
      });
      // console.log("participantResults", participantResults)
      // Check which of these results were submitted by the logged-in user
      const userResult = participantResults.find(result => {
        return console.log("lab account id",result.lab.account_id) === console.log("url account id", participantID) && result.rounds === rounds ;
      });
      console.log("userResultuserResult", userResult);

      return {
        id: analyte.id || index,
        analyte_id: analyte.id,
        analyte_name: analyte.name,

        // Use stored values if available, otherwise default to the first item in the list
        unit_name: userResult
          ? userResult.units
          : Array.isArray(ListUnits) && ListUnits.length > 0
          ? ListUnits[0].id
          : "",
        method_name: userResult
          ? userResult.method
          : Array.isArray(ListMethods) && ListMethods.length > 0
          ? ListMethods[0].id
          : "",
        reagent_name: userResult
          ? userResult.reagents
          : Array.isArray(ReagentList) && ReagentList.length > 0
          ? ReagentList[0].id
          : "",
        instrument_name: userResult
          ? userResult.instrument
          : Array.isArray(Instrument) && Instrument.length > 0
          ? Instrument[0].id
          : "",
        result: userResult ? userResult.result : "",
        result_status: userResult ? userResult.result_status : null,
        result_type: userResult ? userResult.result_type : null,
      };
    });

    // Update the state with combined data
    this.setState({ combinedData });
  };

  handleUpdate = async list => {
    const id = this.props.match.params.id;
    const { rounds, scheme_id, round_status } = this.props;

    // Find the corresponding analyte data in combinedData
    const analyteData = this.state.combinedData.find(
      item => item.id === list.id
    );

    // Extract values
    const unit_name = list.unit_name;
    const instrument_name = list.instrument_name;
    const method_name = list.method_name;
    const reagent_name = list.reagent_name;
    const result = this[`resultRef_${list.id}`]?.value || "";

    // Validate required fields
    if (
      !unit_name ||
      !instrument_name ||
      !method_name ||
      !reagent_name ||
      !result
    ) {
      alert("Please fill out all required fields.");
      return; // Prevent form submission
    }
    const resultData = {
      round_id: id,
      analyte_id: analyteData ? analyteData.analyte_id : "", // Ensure analyte_id is included
      // analyte_name: analyteData ? analyteData.analyte_name : "", // Ensure analyte_name is included
      unit_name: list.unit_name,
      rounds: rounds,
      instrument_name: list.instrument_name,
      method_name: list.method_name,
      reagent_name: list.reagent_name,
      result_type: list.result_type,
      result: this[`resultRef_${list.id}`]?.value || "", // Get the value from the ref
      rounds: rounds,
      scheme_id: scheme_id,
      round_status: round_status,
      result_status: "Created",
    };

    try {
      const response = await this.props.onPostResult(
        resultData,
        this.state.participantID
      );
      console.log("Response:", response); // Check the response structure

      // Handle success
      if (response.type === "POST_RESULT") {
        alert("Result submitted successfully.");
        // Optionally, you might want to refresh data or redirect
        // this.props.onRefreshData(); // Example method to refresh data
        // this.props.history.push('/success-page'); // Example redirection
      }
    } catch (error) {
      // Handle error
      alert("Failed to submit result. Please try again.");
    } finally {
      // Code to run after try/catch
      // Example: Reset form, close modal, etc.
    }
  };
  handleSubmit = async list => {
    const id = this.props.match.params.id;
    const { rounds, scheme_id, round_status } = this.props;

    // Find the corresponding analyte data in combinedData
    const analyteData = this.state.combinedData.find(
      item => item.id === list.id
    );

    // Extract values
    const unit_name = list.unit_name;
    const instrument_name = list.instrument_name;
    const method_name = list.method_name;
    const reagent_name = list.reagent_name;
    const result = this[`resultRef_${list.id}`]?.value || "";

    // Validate required fields
    if (
      !unit_name ||
      !instrument_name ||
      !method_name ||
      !reagent_name ||
      !result
    ) {
      alert("Please fill out all required fields.");
      return; // Prevent form submission
    }
    const resultData = {
      round_id: id,
      analyte_id: analyteData ? analyteData.analyte_id : "", // Ensure analyte_id is included
      // analyte_name: analyteData ? analyteData.analyte_name : "", // Ensure analyte_name is included
      unit_name: list.unit_name,
      result_type: list.result_type,
      instrument_name: list.instrument_name,
      method_name: list.method_name,
      reagent_name: list.reagent_name,
      result: this[`resultRef_${list.id}`]?.value || "", // Get the value from the ref
      rounds: rounds,
      scheme_id: scheme_id,
      round_status: round_status,
      result_status: "Submitted",
    };

    try {
      const response = await this.props.onPostResult(
        resultData,
        this.state.participantID
      );
      console.log("Response:", response); // Check the response structure

      // Handle success
      if (response.type === "POST_RESULT") {
        alert("Result submitted successfully.");
        // Optionally, you might want to refresh data or redirect
        // this.props.onRefreshData(); // Example method to refresh data
        // this.props.history.push('/success-page'); // Example redirection
      }
    } catch (error) {
      // Handle error
      alert("Failed to submit result. Please try again.");
    } finally {
      // Code to run after try/catch
      // Example: Reset form, close modal, etc.
    }
  };

  // handleSave = list => {
  //   const updatedData = this.state.combinedData.map(item => {
  //     if (item.id === list.id) {
  //       const result = this[`resultRef_${list.id}`]?.value || ""; // Ensure fallback if undefined
  //       return { ...item, result }; // Update result field
  //     }
  //     return item;
  //   });

  //   this.setState({ combinedData: updatedData });
  // };

  handleUnitChange = (event, list) => {
    const { value } = event.target;
    const { combinedData } = this.state;

    const updatedData = combinedData.map(item => {
      if (item.id === list.id) {
        return { ...item, unit_name: value };
      }
      return item;
    });

    this.setState({ combinedData: updatedData });
  };

  handleMethodChange = (event, list) => {
    const { value } = event.target;
    const { combinedData } = this.state;

    const updatedData = combinedData.map(item => {
      if (item.id === list.id) {
        return { ...item, method_name: value };
      }
      return item;
    });

    this.setState({ combinedData: updatedData });
  };

  handleInstrumentChange = (event, list) => {
    const { value } = event.target;
    this.setState(prevState => {
      const updatedData = prevState.combinedData.map(item => {
        if (item.id === list.id) {
          return { ...item, instrument_name: value };
        }
        return item;
      });
      return { combinedData: updatedData };
    });
  };

  handleResultTypeChange = (e, list) => {
    const newResultType = e.target.value;
    const { combinedData } = this.state;

    // Update the specific item in the lab data
    const updatedData = combinedData.map(item => {
      if (item.id === list.id) {
        return { ...item, result_type: newResultType };
      }
      return item;
    });
    this.setState({ combinedData: updatedData });

  };

  handleReagentChange = (event, list) => {
    const { value } = event.target;
    const { combinedData } = this.state;

    const updatedData = combinedData.map(item => {
      if (item.id === list.id) {
        return { ...item, reagent_name: value };
      }
      return item;
    });

    this.setState({ combinedData: updatedData });
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
    const { ResultList } = this.props;
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    // Define fields to export
    const fieldsToExport = [
      "id",
      "analyte",
      "units",
      "instrument",
      "method",
      "reagents",
      "result",
      "result_status",
      "result_type",
    ];

    // Map each row to an object with only the desired fields
    const dataToExport = ResultList.map(unit => ({
      id: unit.id,
      Analyte: unit.analyte,
      Unit: unit.units,
      Instrument: unit.instrument,
      Method: unit.method,
      Reagent: unit.reagents,
      Result_Type: unit.result_type,
      Result: unit.result,
      Result_Status: unit.result_status,
    }));

    // Convert data to Excel format and save as file
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const fileName = "Method_list" + fileExtension;
    saveAs(data, fileName);
  };
  // Print function to only print the table
  handlePrint = () => {
    const table = document.getElementById("printable-table"); // Ensure this ID matches your table's ID
    if (table) {
      const printWindow = window.open("", "", "height=800,width=1200");
      printWindow.document.write("<html><head><title>Print</title>");
      printWindow.document.write(
        "<style>table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #f4f4f4; }</style>"
      );
      printWindow.document.write("</head><body>");
      printWindow.document.write(table.outerHTML);
      printWindow.document.write("</body></html>");
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } else {
      alert("Table not found!");
    }
  };


  render() {
    const approvedLabListColumns = this.getApprovedLabListColumns(); // Get the columns in render
    const id = this.props.match.params.id;
    const { SearchBar } = Search;
    const { combinedData, isDataLoaded } = this.state;
    const { schemeName, schemeType, rounds, issue_date, closing_date, round_status } =
      this.props;
    console.log("scheme type", schemeType, schemeName)
    // Get the first round's details if available
    // const firstRound = rounds && rounds.length > 0 ? rounds[0] : null;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: combinedData.length > 0 ? combinedData.length : " ",
      custom: true,
    };

    if (!isDataLoaded) {
      // return <div>Loading...</div>;
    }
    const defaultSorted = [
      {
        dataField: "id",
        order: "desc",
      },
    ];
    const { organization_name } = this.props.match.params;
    return (
      <React.Fragment>
        {schemeType ? (

        <div className="page-content">
          <MetaTags>
            <title>Unapproved Participant | NEQAS</title>
          </MetaTags>
          <Container fluid>
            {/* <Breadcrumbs title="Participant" breadcrumbItem="Unapproved" /> */}
            <Row className="mb-3 text-danger">
              <strong>
              <Col className="d-flex flex-wrap justify-content-md-around justify-content-sm-start  p-3">
                <div className="d-flex flex-column flex-md-row align-items-start  mb-2 mb-md-0 p-2">
                  <span className="me-2">Participant No:</span>
                  <span>{this.state.participantID}</span>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-start mb-2 mb-md-0 p-2">
                  <span className="me-2">Scheme: </span>
                  <span>{schemeName}</span>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-start mb-2 mb-md-0 p-2">
                  <span className="me-2">Round No: </span>
                  <span>{rounds}</span>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-start mb-2 mb-md-0 p-2">
                  <span className="me-2">Issue Date:</span>
                  <span>
                    {moment(issue_date).format("DD MMM YYYY, h:mm A")}
                  </span>
                </div>
                <div className="d-flex flex-column flex-md-row align-items-start p-2">
                  <span className="me-2">Closing Date: </span>
                  <span>
                    {moment(closing_date).format("DD MMM YYYY, h:mm A")}
                  </span>
                </div>
              </Col>
              </strong>
            </Row>
            <Row className="justify-content-start" style={{marginLeft: "120px"}}>
              <Col
                sm="12"
                md="7"
                lg="4"
                xl="4"
                className="d-flex justify-content-between "
              >
                <Button
                  onClick={this.exportToExcel}
                  className="mb-3 w-100 btn  me-2"
                >
                  Download Results
                </Button>
                <Button
                  onClick={this.handlePrint}
                  className="mb-3 w-100 btn me-2"
                >
                  Print
                </Button>
                {round_status === "Report Available" && (
                  <Link to={`/${organization_name}/${id}/report`} className="w-100">
                    <Button className="mb-3 w-100 btn">Report</Button>
                  </Link>
                )}
              </Col>
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
                          {toolkitprops => (
                            <React.Fragment>
                              {/* <Row className="mb-4">
                                <Col xl="4" lg="4" md="4" sm="4">
                                  <div className="search-box me-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="mdi mdi-magnify search-icon" />
                                    </div>
                                  </div>
                                </Col>
                              </Row> */}
                              <div className="table-responsive">
                                <BootstrapTable
                                  id="printable-table" // Added ID here
                                  keyField="id"
                                  ref={this.node}
                                  responsive
                                  bordered={false}
                                  striped={false}
                                  defaultSorted={defaultSorted}
                                  classes={"table table-bordered table-hover"}
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
Results.propTypes = {
  match: PropTypes.object,
  schemeName: PropTypes.string, // Add this line
  schemeType: PropTypes.string,
  participant_ids: PropTypes.array,
  SchemeAnalytesList: PropTypes.array,

  rounds: PropTypes.number,
  round_status: PropTypes.string,
  result_status: PropTypes.string,
  result_type: PropTypes.string,
  scheme_id: PropTypes.number,
  issue_date: PropTypes.string,
  closing_date: PropTypes.string,
  ListUnits: PropTypes.array,
  ListMethods: PropTypes.array,
  Instrument: PropTypes.array,
  ReagentList: PropTypes.array,

  PostResult: PropTypes.array,
  ResultList: PropTypes.array,

  className: PropTypes.any,

  onGetSchemeAnalyte: PropTypes.func,
  onGetUnitsList: PropTypes.func,
  onGetMethodsList: PropTypes.func,
  onGetInstrumentList: PropTypes.func,
  onGetReagents: PropTypes.func,

  onPostResult: PropTypes.func,
  onGetResultsList: PropTypes.func,
  location: PropTypes.object,

};

const mapStateToProps = ({
  SchemeAnalytesList,
  ListUnits,
  ListMethods,
  Instrument,
  ReagentList,
  // ResultList,
}) => ({
  schemeName: SchemeAnalytesList.schemeName, // Correctly reference schemeName
  schemeType: SchemeAnalytesList.schemeType,
  SchemeAnalytesList: SchemeAnalytesList.SchemeAnalytesList,
  rounds: SchemeAnalytesList.rounds,
  scheme_id: SchemeAnalytesList.scheme_id,
  round_status: SchemeAnalytesList.round_status,
  result_status: SchemeAnalytesList.result_status,
  result_type: SchemeAnalytesList.result_type,
  issue_date: SchemeAnalytesList.issue_date,
  closing_date: SchemeAnalytesList.closing_date,
  participant_ids: SchemeAnalytesList.participant_ids,
  ListUnits: ListUnits.ListUnits,
  ListMethods: ListMethods.ListMethods,
  Instrument: Instrument.Instrument,
  ReagentList: ReagentList.ReagentList,
  ResultList: SchemeAnalytesList.ResultList,
});

// const mapStateToProps = state => ({
//   SchemeAnalytesList: state.schemeAnalytesReducer.SchemeAnalytesList,
// });

const mapDispatchToProps = dispatch => ({
  onGetSchemeAnalyte: id => dispatch(getSchemeAnalytesList(id)),
  onGetUnitsList: id => dispatch(getunitlist(id)),
  onGetMethodsList: id => dispatch(getmethodlist(id)),
  onGetInstrumentList: id => dispatch(getInstrumentlist(id)),
  onGetReagents: id => dispatch(getReagentlist(id)),

  onPostResult: (result, id) => dispatch(postResult(result, id)),
  onGetResultsList: id => dispatch(getResultsList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Results));
