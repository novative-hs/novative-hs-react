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
import CycleList from "store/cycle/reducer";

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
      units: "",
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
      cycle_no: "",
      isResubmitted: false,
      PostResult: [],
      ResultList: [],
      isDataLoaded: false, // Flag to track if all data is loaded
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      // approvedLabListColumns: this.getApprovedLabListColumns(), // Initialize columns in state
    };
  }
  fetchResults = async () => {
    try {
        const id = this.props.match.params.id;
        console.log("🔄 Fetching latest results...");

        // Call the Redux action to fetch latest results
        await this.props.onGetResultsList(id);

        console.log("✅ Latest results fetched");
    } catch (error) {
        console.error("❌ Error fetching results", error);
    }
};
  getApprovedLabListColumns = () => {
    const { schemeType, round_status, SchemeAnalytesList } = this.props;

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
          dataField: "units",
          sort: true,
          formatter: (cellContent, list) => {
            // Find the analyte that matches the current row's analyte_id
            const filteredUnits = this.state.ListUnits.filter(unit =>
              this.state.SchemeAnalytesList.some(
                analyte =>
                  analyte?.id === list?.analyte_id &&
                  analyte?.units?.includes(unit.id) // Ensure unit ID exists in the analyte's units
              )
            );
            console.log("Filtered Units for Dropdown:", filteredUnits);
        
            // Find the selected unit for display
            const selectedUnit = filteredUnits.find(
              unit => String(unit.id) === String(list.units)
            );
        
            return (
              <div className="text-start">
                {list.result_status === "Submitted" ? (
                  <span>
                    {selectedUnit?.name || `${list.units}`}
                  </span>
                ) : (
                  <select
                    className="form-select me-2"
                    value={list.units || ""}
                    onChange={e => this.handleUnitChange(e, list)}
                  >
                    <option value="">
                      Select Unit
                    </option>
                    {filteredUnits.map((unit, index) => (
                      <option key={index} value={unit.id}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          },
        },
        {
          text: "Instrument",
          dataField: "instrument_name",
          sort: true,
          formatter: (cellContent, list) => {
            // Filter instruments based on analyte_name
            const filteredInstruments = this.state.Instrument.filter((instr) => {
              return instr.analytes.includes(list.analyte_name); // Compare names
            });
        
            // Find the selected instrument
            const selectedInstrument = filteredInstruments.find(
              (instr) => String(instr.id) === String(list.instrument_name)
            );
        
            return (
              <div className="text-start">
                {list.result_status === "Submitted" ? (
                  <span>
                    {selectedInstrument?.name || ` ${list.instrument_name}`}
                  </span>
                ) : (
                  <select
                    className="form-select me-2"
                    value={list.instrument_name || ""}
                    onChange={(e) => this.handleInstrumentChange(e, list)}
                  >
                    <option value="" >
                      Select Instrument
                    </option>
                    {filteredInstruments.length > 0
                      ? filteredInstruments.map((instr, index) => (
                          <option key={index} value={instr.id}>
                            {instr.name}
                          </option>
                        ))
                      : <option value="">No Instruments available</option>}
                  </select>
                )}
              </div>
            );
          },
        },

        {
          text: "Method",
          dataField: "method_name",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">
              {list.result_status === "Submitted" ? (
                <span>
                  {this.state.ListMethods.find(
                    method => method.id === list.method_name
                  )?.name || "N/A"}
                </span>
              ) : (
                <select
                className="form-select me-2"
                value={list.method_name || ""}
                onChange={e => this.handleMethodChange(e, list)}
              >
                <option value="">Select Method</option>
                {this.state.ListMethods && this.state.SchemeAnalytesList
                  ? this.state.ListMethods.filter(method =>
                      this.state.SchemeAnalytesList.some(
                        analyte =>
                          analyte?.id === list?.analyte_id &&
                          analyte?.methods?.includes(method.id)
                      )
                    ).map((method, index) => (
                      <option key={index} value={method.id}>
                        {method.name}
                      </option>
                    ))
                  : null}
              </select>
              
              )}
            </div>
          ),
        },
        {
          text: "Reagent",
          dataField: "reagent_name",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">
              {list.result_status === "Submitted" ? (
                <span>
                  {this.state.ReagentList.find(
                    reagent => reagent.id === list.reagent_name
                  )?.name ||
                    list.reagent_name ||
                    "N/A"}
                </span>
              ) : (
                <select
                  className="form-select me-2"
                  value={list.reagent_name || ""}
                  onChange={e => this.handleReagentChange(e, list)}
                >
                  <option value="">
                    Select Reagent
                  </option>
                  {this.state.ReagentList && this.state.SchemeAnalytesList
                    ? this.state.ReagentList.filter(reagent =>
                        this.state.SchemeAnalytesList.some(
                          analyte =>
                            analyte?.id === list?.analyte_id &&
                            analyte?.reagents?.includes(reagent.id)
                        )
                      ).map((reagent, index) => (
                        <option key={index} value={reagent.id}>
                          {reagent.name}
                        </option>
                      ))
                    : null}
                </select>
              )}
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
                defaultValue={list.result || ""}
                placeholder="Enter result"
                onChange={e => {
                  let value = e.target.value;
                  // Allow only numbers and a single decimal point
                  if (/^\d*\.?\d*$/.test(value)) {
                    e.target.value = value;
                  } else {
                    e.target.value = value.slice(0, -1); // Remove last invalid character
                  }
                }}
              />
            </div>
          ),
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
          formatter: (cellContent, list) => {
            // Filter instruments based on analyte_name
            const filteredInstruments = this.state.Instrument.filter((instr) => {
              return instr.analytes.includes(list.analyte_name); // Compare names
            });
        
            // Find the selected instrument
            const selectedInstrument = filteredInstruments.find(
              (instr) => String(instr.id) === String(list.instrument_name)
            );
        
            return (
              <div className="text-start">
                {list.result_status === "Submitted" ? (
                  <span>
                    {selectedInstrument?.name || ` ${list.instrument_name}`}
                  </span>
                ) : (
                  <select
                    className="form-select me-2"
                    value={list.instrument_name || ""}
                    onChange={(e) => this.handleInstrumentChange(e, list)}
                  >
                    <option value="">
                      Select Instrument
                    </option>
                    {filteredInstruments.length > 0
                      ? filteredInstruments.map((instr, index) => (
                          <option key={index} value={instr.id}>
                            {instr.name}
                          </option>
                        ))
                      : <option value="">No Instruments available</option>}
                  </select>
                )}
              </div>
            );
          },
        }
        
        ,

        {
          text: "Method",
          dataField: "method_name",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">
              {list.result_status === "Submitted" ? (
                <span>
                  {this.state.ListMethods.find(
                    method => method.id === list.method_name
                  )?.name || "N/A"}
                </span>
              ) : (
                <select
                  className="form-select me-2"
                  value={list.method_name || ""}
                  onChange={e => this.handleMethodChange(e, list)}
                >
                  <option value="">
                    Select Method
                  </option>
                  {this.state.ListMethods && this.state.SchemeAnalytesList
                    ? this.state.ListMethods.filter(method =>
                        this.state.SchemeAnalytesList.some(
                          analyte =>
                            analyte?.id === list?.analyte_id &&
                            analyte?.methods?.includes(method.id)
                        )
                      ).map((method, index) => (
                        <option key={index} value={method.id}>
                          {method.name}
                        </option>
                      ))
                    : null}
                </select>
              )}
            </div>
          ),
        },
        {
          text: "Reagent",
          dataField: "reagent_name",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">
              {list.result_status === "Submitted" ? (
                <span>
                  {this.state.ReagentList.find(
                    reagent => reagent.id === list.reagent_name
                  )?.name ||
                    list.reagent_name ||
                    "N/A"}
                </span>
              ) : (
                <select
                  className="form-select me-2"
                  value={list.reagent_name || ""}
                  onChange={e => this.handleReagentChange(e, list)}
                >
                  <option value="">
                    Select Reagent
                  </option>
                  {this.state.ReagentList && this.state.SchemeAnalytesList
                    ? this.state.ReagentList.filter(reagent =>
                        this.state.SchemeAnalytesList.some(
                          analyte =>
                            analyte?.id === list?.analyte_id &&
                            analyte?.reagents?.includes(reagent.id)
                        )
                      ).map((reagent, index) => (
                        <option key={index} value={reagent.id}>
                          {reagent.name}
                        </option>
                      ))
                    : null}
                </select>
              )}
            </div>
          ),
        },

        {
          text: "Result Type",
          dataField: "result_type",
          sort: true,
          formatter: (cellContent, list) => (
            <div className="text-start">
              {list.result_status === "Submitted" ? (
                <span>{list.result_type || "N/A"}</span> // Show plain text after submission
              ) : (
                <select
                  className="form-select me-2"
                  value={list.result_type || ""} // Ensure this is set properly
                  onChange={e => this.handleResultTypeChange(e, list)} // Handle the change event
                >
                  <option value="" disabled hidden>
                    Select Result Type
                  </option>
                  <option value="Positive">Positive</option>
                  <option value="Negative">Negative</option>
                  <option value="Equivocal">Equivocal</option>
                </select>
              )}
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
                defaultValue={list.result || ""}
                placeholder="Enter result"
                onChange={e => {
                  let value = e.target.value;
                  // Allow only numbers and a single decimal point
                  if (/^\d*\.?\d*$/.test(value)) {
                    e.target.value = value;
                  } else {
                    e.target.value = value.slice(0, -1); // Remove last invalid character
                  }
                }}
              />
            </div>
          ),
        },
      ];
    }
  };
  // }
  componentDidMount() {
    const {
        onGetSchemeAnalyte,
        onGetUnitsList,
        onGetMethodsList,
        onGetInstrumentList,
        onGetReagents,
        onGetResultsList,
    } = this.props;

    const id = this.props.match.params.id;
    const userId = this.state.user_id;
    const submittedOn = localStorage.getItem("submittedOn");

    console.log("User ID:", userId); // Ensure this is not undefined or null
    console.log("Scheme ID:", id);   // Ensure this is valid

    // Log the start of fetching each list
    console.log("Fetching SchemeAnalyte...");
    onGetSchemeAnalyte(id);
    
    console.log("Fetching UnitsList for User ID:", userId);
    onGetUnitsList(userId);

    console.log("Fetching MethodsList for User ID:", userId);
    onGetMethodsList(userId);

    console.log("Fetching Reagents for User ID:", userId);
    onGetReagents(userId);

    console.log("Fetching InstrumentList for User ID:", userId);
    onGetInstrumentList(userId);

    console.log("Fetching ResultsList for Scheme ID:", id);
    onGetResultsList(id);

    if (submittedOn) {
      this.setState({ submittedOn });
      console.log("Submitted On:", submittedOn); // Log the timestamp if it's found
    }

    // You can also add logs to confirm that these fetch actions were successful:
    this.trackFetchedData();  // You can use this method to track the state of the fetched data.
}

// Method to track fetched data after state is updated
trackFetchedData() {
    console.log("Methods List:", this.state.ListMethods);
    console.log("Instrument List:", this.state.Instrument);
    console.log("Reagents List:", this.state.ReagentList);
    console.log("Units List:", this.state.UnitsList);
    console.log("Scheme Analyte List:", this.state.SchemeAnalytesList);
    console.log("Results List:", this.state.ResultsList);
}

  

componentDidUpdate(prevProps, prevState) {
  const {
    SchemeAnalytesList,
    ListUnits,
    ListMethods,
    Instrument,
    ReagentList,
    ResultList,
    round_status,
    result_type,
  } = this.props;

  // ✅ When user_id becomes available (typically after refresh)
  if (!prevState.user_id && this.state.user_id) {
    const userId = this.state.user_id;
    const id = this.props.match.params.id;

    console.log("user_id became available. Fetching all lists...");
    this.props.onGetSchemeAnalyte(id);
    this.props.onGetUnitsList(userId);
    this.props.onGetMethodsList(userId);
    this.props.onGetInstrumentList(userId);
    this.props.onGetReagents(userId);
    this.props.onGetResultsList(id);
  }

  // ✅ Check if all required lists are present, then run combineData only once
  const allListsAvailable =
    SchemeAnalytesList?.length > 0 &&
    ListUnits?.length > 0 &&
    ListMethods?.length > 0 &&
    Instrument?.length > 0 &&
    ReagentList?.length > 0 &&
    ResultList?.length >= 0;

  if (allListsAvailable && !this.state.isDataLoaded) {
    this.setState(
      {
        SchemeAnalytesList,
        ListUnits,
        ListMethods,
        Instrument,
        ReagentList,
        ResultList,
        round_status,
        result_type,
        isDataLoaded: true,
      },
      this.combineData
    );
  }

  // ✅ If any prop data changed AND data is already loaded, update state (don't re-run combineData)
  const dataChanged = [
    prevProps.SchemeAnalytesList !== SchemeAnalytesList,
    prevProps.ListUnits !== ListUnits,
    prevProps.ListMethods !== ListMethods,
    prevProps.Instrument !== Instrument,
    prevProps.ReagentList !== ReagentList,
    prevProps.ResultList !== ResultList,
    prevProps.round_status !== round_status,
  ].some(Boolean);

  if (dataChanged && this.state.isDataLoaded) {
    this.setState({
      SchemeAnalytesList,
      ListUnits,
      ListMethods,
      Instrument,
      ReagentList,
      ResultList,
      round_status,
      result_type,
    });
  }

  // ✅ Update 'submittedOn' from backend if ResultList has changed
  if (prevProps.ResultList !== ResultList && ResultList.length > 0) {
    fetch(`/api/registration-admin/getResultsData`)
      .then(response => response.json())
      .then(responseData => {
        if (responseData?.updated_at) {
          this.setState({ submittedOn: responseData.updated_at });
        }
      })
      .catch(error => console.error("Error fetching updated data:", error));
  }
}






// ✅ Add Auto-Refresh After Submit or Resubmit
// handleSubmitAll = async () => {
//     // Your existing submit logic
//     console.log("Submitting results...");
//     setTimeout(() => {
//         window.location.reload();
//     }, 1000); // 🚀 Refresh after 1 second
// };
handleResubmit = async () => {
  const { combinedData } = this.state;
  const { rounds, scheme_id, round_status } = this.props;
  const id = this.props.match.params.id;

  if (!combinedData.length) {
      alert("No results to resubmit.");
      return;
  }

  const confirmation = window.confirm("Are you sure you want to resubmit all results?");
  if (!confirmation) return;

  try {
      let latestUpdatedAt = new Date().toISOString(); // Default timestamp

      for (const list of combinedData) {
          const resultData = {
              round_id: id,
              analyte_id: list.analyte_id,
              units: list.units,
              instrument_name: list.instrument_name,
              method_name: list.method_name,
              reagent_name: list.reagent_name,
              result_type: list.result_type,
              result: this[`resultRef_${list.id}`]?.value || "",
              rounds: rounds,
              scheme_id: scheme_id,
              round_status: round_status,
              result_status: "Submitted", // ✅ FIXED: Now it's marked as "Resubmitted"
          };

          const response = await this.props.onPostResult(resultData, this.state.user_id);

          if (response.type === "POST_RESULT" && response.payload?.updated_at) {
              latestUpdatedAt = response.payload.updated_at; // Use timestamp from backend
          }
      }

      // ✅ Store "Submitted On" timestamp
      this.setState({ submittedOn: latestUpdatedAt });
      localStorage.setItem("submittedOn", latestUpdatedAt);

      alert("Results resubmitted successfully!");
      setTimeout(() => {
          window.location.reload();
      }, 1000);
  } catch (error) {
      alert("Failed to resubmit results. Please try again.");
  }
};

  combineData = () => {
    const {
      SchemeAnalytesList,
      ListUnits,
      ListMethods,
      Instrument,
      ReagentList,
      ResultList, // This array contains the previously submitted values
    } = this.state;

    const { rounds } = this.props;
    const { user_id, ParticipantNo } = this.state;
    const combinedData = SchemeAnalytesList.map((analyte, index) => {
      const participantResults = ResultList.filter(result => {
        return result.analyte === analyte.id;
      });

      const userResult = participantResults.find(result => {
        return (
          result.lab.account_id === user_id && result.round_name === rounds
        );
      });

      return {
        id: analyte.id || index,
        analyte_id: analyte.id,
        analyte_name: analyte.name,

        // Use stored values if available, otherwise default to the first item in the list
        units: userResult
          ? userResult.units
          : Array.isArray(ListUnits) && ListUnits.length > 0
          ? ListUnits[0].id
          : "",
          method_name: userResult
          ? userResult.method
          : "",
        
        reagent_name: userResult
          ? this.state.ReagentList.find(
              reagent => reagent.id === userResult.reagents
            )?.name || "N/A"
          : "N/A",
        instrument_name: userResult
          ? this.state.Instrument.find(
              instr => instr.id === userResult.instrument
            )?.name || "N/A"
          : "N/A",
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
    const units = list.units;
    const instrument_name = list.instrument_name;
    const method_name = list.method_name;
    const reagent_name = list.reagent_name;
    const result = this[`resultRef_${list.id}`]?.value || "";

    // Validate required fields
    if (
      !units ||
      !instrument_name ||
      !method_name ||
      !reagent_name ||
      !result
    ) {
      alert("Please fill out all required fields.");
      return; // Prevent form submission
    }
    // Show confirmation prompt to the user
    const confirmation = window.confirm(
      "Are you sure you want to update the result? "
    );

    if (!confirmation) {
      // If user clicks 'Cancel', exit the function
      return;
    }
    const resultData = {
      round_id: id,
      analyte_id: analyteData ? analyteData.analyte_id : "", // Ensure analyte_id is included
      // analyte_name: analyteData ? analyteData.analyte_name : "", // Ensure analyte_name is included
      units: list.units,
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
        this.state.user_id
      );
      // Handle success
      if (response.type === "POST_RESULT") {
        alert("Result updated successfully.");
      }
    } catch (error) {
      // Handle error
      alert("Failed to submit result. Please try again.");
    } finally {
      // Code to run after try/catch
      // Example: Reset form, close modal, etc.
    }
  };

  handleSaveAll = async () => {
    const { combinedData } = this.state;
    const { rounds, scheme_id, round_status } = this.props;
    const id = this.props.match.params.id;

    if (!combinedData.length) {
        alert("No results to save.");
        return;
    }

    const confirmation = window.confirm("Are you sure you want to save all results?");
    if (!confirmation) return;

    try {
        for (const list of combinedData) {
            const resultData = {
                round_id: id,
                analyte_id: list.analyte_id,
                units: list.units,
                instrument_name: list.instrument_name,
                method_name: list.method_name,
                reagent_name: list.reagent_name,
                result_type: list.result_type,
                result: this[`resultRef_${list.id}`]?.value || "",
                rounds,
                scheme_id,
                round_status,
                result_status: "Saved",
            };
            await this.props.onPostResult(resultData, this.state.user_id);
        }

        alert("All results have been saved successfully.");
    } catch (error) {
        alert("Failed to save all results. Please try again.");
    }
};

handleSubmitAll = async () => {
  const { combinedData } = this.state;
  const { rounds, scheme_id, round_status } = this.props;
  const id = this.props.match.params.id;

  if (!combinedData.length) {
      alert("No results to submit.");
      return;
  }

  const confirmation = window.confirm("Are you sure you want to submit all results?");
  if (!confirmation) return;

  try {
      let latestUpdatedAt = new Date().toISOString(); // Default timestamp

      for (const list of combinedData) {
          const resultData = {
              round_id: id,
              analyte_id: list.analyte_id,
              units: list.units,
              instrument_name: list.instrument_name,
              method_name: list.method_name,
              reagent_name: list.reagent_name,
              result_type: list.result_type,
              result: this[`resultRef_${list.id}`]?.value || "",
              rounds: rounds,
              scheme_id: scheme_id,
              round_status: round_status,
              result_status: "Submitted",
          };

          const response = await this.props.onPostResult(resultData, this.state.user_id);

          if (response.type === "POST_RESULT" && response.payload?.updated_at) {
              latestUpdatedAt = response.payload.updated_at; // Use actual timestamp from backend
          }
      }

      // ✅ Store "Submitted On" in state & localStorage
      this.setState({ submittedOn: latestUpdatedAt });
      localStorage.setItem("submittedOn", latestUpdatedAt);

      alert("Results submitted successfully!");
      // setTimeout(() => {
      //     window.location.reload();
      // }, 1000);
      window.location.reload();
  } catch (error) {
      alert("Failed to submit all results. Please try again.");
  }
};
handleResubmit = async () => {
  const { combinedData, Instrument, ReagentList } = this.state; // ✅ Ensure we have the lists
  const { rounds, scheme_id, round_status } = this.props;
  const id = this.props.match.params.id;

  if (!combinedData.length) {
      alert("No results to resubmit.");
      return;
  }

  const confirmation = window.confirm("Are you sure you want to resubmit all results?");
  if (!confirmation) return;

  try {
      let latestUpdatedAt = new Date().toISOString(); // Default timestamp

      for (const list of combinedData) {
          // ✅ Convert instrument_name & reagent_name to IDs before resubmitting
          const instrument = Instrument.find(instr => instr.name === list.instrument_name);
          const reagent = ReagentList.find(reag => reag.name === list.reagent_name);

          const resultData = {
              round_id: id,
              analyte_id: list.analyte_id,
              units: list.units,
              instrument_name: instrument?.id ?? list.instrument_name, // ✅ Convert to ID
              method_name: list.method_name,
              reagent_name: reagent?.id ?? list.reagent_name, // ✅ Convert to ID
              result_type: list.result_type,
              result: this[`resultRef_${list.id}`]?.value || "",
              rounds: rounds,
              scheme_id: scheme_id,
              round_status: round_status,
              result_status: "Submitted",
          };

          console.log("🚀 Resubmitting Payload:", resultData); // ✅ Debugging

          const response = await this.props.onPostResult(resultData, this.state.user_id);

          if (response.type === "POST_RESULT" && response.payload?.updated_at) {
              latestUpdatedAt = response.payload.updated_at;
          }
      }

      // ✅ Update "Submitted On" in state after resubmission
      this.setState({ submittedOn: latestUpdatedAt });

      alert("Results resubmitted successfully!");
  } catch (error) {
      alert("Failed to resubmit results. Please try again.");
  }
};


  handleUnitChange = (event, list) => {
    const { value } = event.target;
    const { combinedData } = this.state;

    const updatedData = combinedData.map(item => {
      if (item.id === list.id) {
        return { ...item, units: value };
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

  // handleInstrumentChange = (event, list) => {
  //   const { value } = event.target;
  //   this.setState(prevState => {
  //     const updatedData = prevState.combinedData.map(item => {
  //       if (item.id === list.id) {
  //         const selectedInstrument = prevState.Instrument.find(
  //           instr => instr.id.toString() === value
  //         );
  //         return {
  //           ...item,
  //           instrument_id: value, // Update instrument_id
  //           instrument_name: selectedInstrument ? selectedInstrument.name : "", // Ensure correct name
  //         };
  //       }
  //       return item;
  //     });
  //     return { combinedData: updatedData };
  //   });
  // };

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
            instrument_display_name: selectedInstrument ? selectedInstrument.name : "", // Display name
          };
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
    const {
      schemeName,
      scheme_id,
      schemeType,
      rounds,
      issue_date,
      closing_date,
      cycle_no,
      round_status,
    } = this.props;

    const pageOptions = {
      sizePerPage: 50,
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
    const participant_id = this.props.match.params.id1;
    return (
      <React.Fragment>
        {schemeType ? (
          <div className="page-content">
            <MetaTags>
              <title> Participant Result | NEQAS</title>
            </MetaTags>
            <Container fluid>
              {/* <Breadcrumbs title="Participant" breadcrumbItem="Unapproved" /> */}
              <Row className="mb-3 text-danger">
  <strong>
    <Col className="d-flex flex-wrap justify-content-md-around justify-content-sm-start  p-3">
      <div className="d-flex flex-column flex-md-row align-items-start  mb-2 mb-md-0 p-2">
        <span className="me-2">Participant No:</span>
        <span>{participant_id}</span>
      </div>
      <div className="d-flex flex-column flex-md-row align-items-start mb-2 mb-md-0 p-2">
        <span className="me-2">Scheme: </span>
        <span>{schemeName}</span>
      </div>
      <div className="d-flex flex-column flex-md-row align-items-start mb-2 mb-md-0 p-2">
        <span className="me-2">Cycle No: </span>
        <span>{cycle_no}</span>
      </div>
      <div className="d-flex flex-column flex-md-row align-items-start mb-2 mb-md-0 p-2">
        <span className="me-2">Round No: </span>
        <span>{rounds}</span>
      </div>
      <div className="d-flex flex-column flex-md-row align-items-start mb-2 mb-md-0 p-2">
        <span className="me-2">Issue Date:</span>
        <span>{moment(issue_date).format("DD MMM YYYY, h:mm A")}</span>
      </div>
      <div className="d-flex flex-column flex-md-row align-items-start p-2">
        <span className="me-2">Closing Date: </span>
        <span>{moment(closing_date).format("DD MMM YYYY, h:mm A")}</span>
      </div>
    </Col>
  </strong>
</Row>
<div className="d-flex flex-wrap align-items-center gap-3 ms-5">
  <Button onClick={this.exportToExcel} className="mb-3 btn btn-secondary" style={{ minWidth: "140px" }}>
    Download Results
  </Button>
  <Button onClick={this.handlePrint} className="mb-3 btn btn-secondary" style={{ minWidth: "140px" }}>
    Print
  </Button>
  <Link to={`/${organization_name}/result-history/${id}?participantId=${this.state.user_id}&scheme_id=${scheme_id}`}>
    <Button className="mb-3 btn btn-secondary" style={{ minWidth: "140px" }}>
      History
    </Button>
  </Link>

  {!this.state.isResubmitted && (
    <>
      {/* ✅ Show Save & Submit buttons before submission */}
      {!(this.state.combinedData.length > 0 && this.state.combinedData.every(data => data.result_status === "Submitted")) ? (
        <>
          <Button className="mb-3 btn btn-success" style={{ minWidth: "140px" }} onClick={this.handleSaveAll}>
            Save
          </Button>
          <Button className="mb-3 btn btn-success" style={{ minWidth: "140px" }} onClick={this.handleSubmitAll}>
            Submit
          </Button>
        </>
      ) : (
        /* ✅ After submission, hide Submit button & show Re-Submit with "Submitted On" */
        this.props.round_status === "Open" && (
          <>
            <Button className="btn btn-success mb-3" style={{ minWidth: "140px" }} onClick={this.handleResubmit}>
              Re-Submit
            </Button>
            {/* ✅ Show Submitted On date after Submit or Resubmit */}
            {this.state.submittedOn && (
              <div className="mb-3">
                <strong>Submitted On:</strong> {new Date(this.state.submittedOn).toLocaleString()}
              </div>
            )}
          </>
        )
      )}
    </>
  )}
</div>

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
  SchemeAnalytesList: PropTypes.array,
  rounds: PropTypes.string,
  round_status: PropTypes.string,
  result_type: PropTypes.string,
  scheme_id: PropTypes.number,
  issue_date: PropTypes.string,
  closing_date: PropTypes.string,
  cycle_no: PropTypes.string,
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
};
const mapStateToProps = ({
  SchemeAnalytesList,
  CycleList,
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
  result_type: SchemeAnalytesList.result_type,
  issue_date: SchemeAnalytesList.issue_date,
  closing_date: SchemeAnalytesList.closing_date,
  cycle_no: SchemeAnalytesList.cycle_no,
  ListUnits: ListUnits.ListUnits,
  ListMethods: ListMethods.ListMethods,
  Instrument: Instrument.Instrument,
  ReagentList: ReagentList.ReagentList,
  ResultList: SchemeAnalytesList.ResultList,
});
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
