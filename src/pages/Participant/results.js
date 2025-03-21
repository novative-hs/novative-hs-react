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
          formatter: (cellContent, list) => (
            <div className="text-start">
              {list.result_status === "Submitted" ? (
                <span>
                  {this.state.ListUnits.find((unit) => unit.id === list.units)
                    ?.name || "N/A"}
                </span>
              ) : (
                <select
                  className="form-select me-2"
                  value={list.units || ""}
                  onChange={(e) => this.handleUnitChange(e, list)}
                >
                  <option value="" disabled hidden>
                    Select Unit
                  </option>
                  {this.state.ListUnits.map((unit, index) => (
                    <option key={index} value={unit.id}>
                      {unit.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ),
        },
        {
          text: "Instrument",
          dataField: "instrument_name",
          sort: true,
          formatter: (cellContent, list) => {
            const selectedInstrument = this.state.Instrument.find(
              (instr) => String(instr.id) === String(list.instrument_name)
            );

            return (
              <div className="text-start">
                {list.result_status === "Submitted" ? (
                  <span>
                    {selectedInstrument?.name || `${list.instrument_name}`}
                  </span>
                ) : (
                  <select
                    className="form-select me-2"
                    value={list.instrument_name || ""}
                    onChange={(e) => this.handleInstrumentChange(e, list)}
                  >
                    <option value="" disabled hidden>
                      Select Instrument
                    </option>
                    {this.state.Instrument.map((instr, index) => (
                      <option key={index} value={instr.id}>
                        {instr.name}
                      </option>
                    ))}
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
                    (method) => method.id === list.method_name
                  )?.name || "N/A"}
                </span>
              ) : (
                <select
                  className="form-select me-2"
                  value={list.method_name || ""}
                  onChange={(e) => this.handleMethodChange(e, list)}
                >
                  <option value="" disabled hidden>
                    Select Method
                  </option>
                  {this.state.ListMethods && this.state.SchemeAnalytesList
                    ? this.state.ListMethods.filter((method) =>
                        this.state.SchemeAnalytesList.some(
                          (analyte) =>
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
                    (reagent) => reagent.id === list.reagent_name
                  )?.name ||
                    list.reagent_name ||
                    "N/A"}
                </span>
              ) : (
                <select
                  className="form-select me-2"
                  value={list.reagent_name || ""}
                  onChange={(e) => this.handleReagentChange(e, list)}
                >
                  <option value="" disabled hidden>
                    Select Reagent
                  </option>
                  {this.state.ReagentList && this.state.SchemeAnalytesList
                    ? this.state.ReagentList.filter((reagent) =>
                        this.state.SchemeAnalytesList.some(
                          (analyte) =>
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
                ref={(el) => (this[`resultRef_${list.id}`] = el)}
                defaultValue={list.result || ""}
                placeholder="Enter result"
                onChange={(e) => {
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
            const selectedInstrument = this.state.Instrument.find(
              (instr) => String(instr.id) === String(list.instrument_name)
            );

            return (
              <div className="text-start">
                {list.result_status === "Submitted" ? (
                  <span>
                    {selectedInstrument?.name || `${list.instrument_name}`}
                  </span>
                ) : (
                  <select
                    className="form-select me-2"
                    value={list.instrument_name || ""}
                    onChange={(e) => this.handleInstrumentChange(e, list)}
                  >
                    <option value="" disabled hidden>
                      Select Instrument
                    </option>
                    {this.state.Instrument.map((instr, index) => (
                      <option key={index} value={instr.id}>
                        {instr.name}
                      </option>
                    ))}
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
                    (method) => method.id === list.method_name
                  )?.name || "N/A"}
                </span>
              ) : (
                <select
                  className="form-select me-2"
                  value={list.method_name || ""}
                  onChange={(e) => this.handleMethodChange(e, list)}
                >
                  <option value="" disabled hidden>
                    Select Method
                  </option>
                  {this.state.ListMethods && this.state.SchemeAnalytesList
                    ? this.state.ListMethods.filter((method) =>
                        this.state.SchemeAnalytesList.some(
                          (analyte) =>
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
                    (reagent) => reagent.id === list.reagent_name
                  )?.name ||
                    list.reagent_name ||
                    "N/A"}
                </span>
              ) : (
                <select
                  className="form-select me-2"
                  value={list.reagent_name || ""}
                  onChange={(e) => this.handleReagentChange(e, list)}
                >
                  <option value="" disabled hidden>
                    Select Reagent
                  </option>
                  {this.state.ReagentList && this.state.SchemeAnalytesList
                    ? this.state.ReagentList.filter((reagent) =>
                        this.state.SchemeAnalytesList.some(
                          (analyte) =>
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
                  onChange={(e) => this.handleResultTypeChange(e, list)} // Handle the change event
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
                ref={(el) => (this[`resultRef_${list.id}`] = el)}
                defaultValue={list.result || ""}
                placeholder="Enter result"
                onChange={(e) => {
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

    onGetSchemeAnalyte(id);
    onGetUnitsList(userId);
    onGetMethodsList(userId);
    onGetReagents(userId);
    onGetInstrumentList(userId);
    onGetResultsList(id); // No `.then()` since it's not a Promise
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
      result_type,
    } = this.props;

    // Log previous and current props
    console.log("Prev Props:", prevProps);
    console.log("Current Props:", this.props);

    if (prevProps.Instrument !== this.props.Instrument) {
      console.log("Instrument list changed");
    }

    if (
      prevProps.Instrument !== this.props.Instrument &&
      this.props.Instrument.length > 0
    ) {
      this.setState({ Instrument: this.props.Instrument });
    }

    // Log if data gets removed
    if (prevProps.Instrument.length > 0 && this.props.Instrument.length === 0) {
      console.log("All Instruments removed");
    }

    // Detect any data changes
    const dataChanged = [
      prevProps.SchemeAnalytesList !== SchemeAnalytesList,
      prevProps.ListUnits !== ListUnits,
      prevProps.ListMethods !== ListMethods,
      prevProps.Instrument !== Instrument,
      prevProps.ReagentList !== ReagentList,
      prevProps.ResultList !== ResultList,
      prevProps.round_status !== round_status,
    ].some(Boolean);

    if (
      dataChanged &&
      SchemeAnalytesList !== undefined &&
      ListUnits !== undefined &&
      ListMethods !== undefined &&
      Instrument !== undefined
    ) {
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
          isDataLoaded: true, // Data is now loaded
        },
        this.combineData
      );
    }

    // Update combinedData when ResultList changes
    if (prevProps.ResultList !== this.props.ResultList) {
      if (this.props.ResultList && this.props.ResultList.length > 0) {
        this.setState({ combinedData: this.props.ResultList });
      }
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

    const { rounds } = this.props;
    const { user_id, ParticipantNo } = this.state;
    const combinedData = SchemeAnalytesList.map((analyte, index) => {
      const participantResults = ResultList.filter((result) => {
        return result.analyte === analyte.id;
      });

      const userResult = participantResults.find((result) => {
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
          : Array.isArray(ListMethods) && ListMethods.length > 0
          ? ListMethods[0].id
          : "",
        reagent_name: userResult
          ? this.state.ReagentList.find(
              (reagent) => reagent.id === userResult.reagents
            )?.name || "N/A"
          : "N/A",
        instrument_name: userResult
          ? this.state.Instrument.find(
              (instr) => instr.id === userResult.instrument
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

  handleUpdate = async (list) => {
    const id = this.props.match.params.id;
    const { rounds, scheme_id, round_status } = this.props;

    // Find the corresponding analyte data in combinedData
    const analyteData = this.state.combinedData.find(
      (item) => item.id === list.id
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

    const confirmation = window.confirm(
      "Are you sure you want to save all results?"
    );
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
          rounds: rounds,
          scheme_id: scheme_id,
          round_status: round_status,
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

    const confirmation = window.confirm(
      "Are you sure you want to submit all results? This action cannot be undone."
    );
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
          rounds: rounds,
          scheme_id: scheme_id,
          round_status: round_status,
          result_status: "Submitted",
        };
        await this.props.onPostResult(resultData, this.state.user_id);
      }

      alert("All results have been submitted successfully.");
      window.location.reload();
    } catch (error) {
      alert("Failed to submit all results. Please try again.");
    }
  };
  handleResubmit = async () => {
    const { combinedData } = this.state;
    const { rounds, scheme_id, round_status } = this.props;
    const id = this.props.match.params.id;

    if (!combinedData.length) {
      alert("No results to resubmit.");
      return;
    }

    const confirmation = window.confirm(
      "Are you sure you want to re-submit? This will allow modifications."
    );
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
          rounds: rounds,
          scheme_id: scheme_id,
          round_status: round_status,
          result_status: "Submitted", // Reset to allow changes
        };
        await this.props.onPostResult(resultData, this.state.user_id);
      }

      alert("Results are now editable again.");
      this.setState({ isResubmitted: true }); // Hide all buttons after resubmission
    } catch (error) {
      alert("Failed to re-submit. Please try again.");
    }
  };

  handleUnitChange = (event, list) => {
    const { value } = event.target;
    const { combinedData } = this.state;

    const updatedData = combinedData.map((item) => {
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

    const updatedData = combinedData.map((item) => {
      if (item.id === list.id) {
        return { ...item, method_name: value };
      }
      return item;
    });

    this.setState({ combinedData: updatedData });
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
            instrument_id: value, // Update instrument_id
            instrument_name: selectedInstrument ? selectedInstrument.name : "", // Ensure correct name
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
    const updatedData = combinedData.map((item) => {
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
    const dataToExport = ResultList.map((unit) => ({
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
      round_status,
    } = this.props;

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
    const participant_id = this.props.match.params.id1;
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
                      <span>{participant_id}</span>
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
              <Row className="justify-content-start">
                <Col sm="12" md="12" lg="12" xl="12">
                  <div className="d-flex flex-wrap align-items-center gap-3 ms-5">
                    <Button
                      onClick={this.exportToExcel}
                      className="mb-3 btn btn-secondary"
                      style={{ minWidth: "140px" }}
                    >
                      Download Results
                    </Button>
                    <Button
                      onClick={this.handlePrint}
                      className="mb-3 btn btn-secondary"
                      style={{ minWidth: "140px" }}
                    >
                      Print
                    </Button>
                    <Link
                      to={`/${organization_name}/result-history/${id}?participantId=${this.state.user_id}&scheme_id=${scheme_id}`}
                    >
                      <Button
                        className="mb-3 btn btn-secondary"
                        style={{ minWidth: "140px" }}
                      >
                        History
                      </Button>
                    </Link>

                    {/* Condition to hide Save & Submit if ALL results are submitted */}
                    {!this.state.isResubmitted && (
                      <>
                        {/* Show Save & Submit if not all results are submitted and round is not Closed */}
                        {this.props.round_status !== "Closed" &&
                          !(
                            this.state.combinedData.length > 0 &&
                            this.state.combinedData.every(
                              (data) => data.result_status === "Submitted"
                            )
                          ) && (
                            <>
                              <Button
                                className="mb-3 btn btn-success"
                                style={{ minWidth: "140px" }}
                                onClick={this.handleSaveAll}
                              >
                                Save
                              </Button>
                              <Button
                                className="mb-3 btn btn-success"
                                style={{ minWidth: "140px" }}
                                onClick={this.handleSubmitAll}
                              >
                                Submit
                              </Button>
                            </>
                          )}

                        {/* Show Re-Submit if all results are submitted, round is Open, and round is not Closed */}
                        {this.props.round_status !== "Closed" && // Round status closed na ho
                          this.state.combinedData.length > 0 &&
                          this.state.combinedData.some(
                            (data) => data.result_status === "Submitted" // At least ek submitted ho
                          ) && (
                            <Button
                              className="mb-3 btn btn-success"
                              style={{ minWidth: "140px" }}
                              onClick={this.handleResubmit}
                            >
                              Re-Submit
                            </Button>
                          )}
                      </>
                    )}
                  </div>
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
  ListUnits: ListUnits.ListUnits,
  ListMethods: ListMethods.ListMethods,
  Instrument: Instrument.Instrument,
  ReagentList: ReagentList.ReagentList,
  ResultList: SchemeAnalytesList.ResultList,
});

// const mapStateToProps = state => ({
//   SchemeAnalytesList: state.schemeAnalytesReducer.SchemeAnalytesList,
// });

const mapDispatchToProps = (dispatch) => ({
  onGetSchemeAnalyte: (id) => dispatch(getSchemeAnalytesList(id)),
  onGetUnitsList: (id) => dispatch(getunitlist(id)),
  onGetMethodsList: (id) => dispatch(getmethodlist(id)),
  onGetInstrumentList: (id) => dispatch(getInstrumentlist(id)),
  onGetReagents: (id) => dispatch(getReagentlist(id)),

  onPostResult: (result, id) => dispatch(postResult(result, id)),
  onGetResultsList: (id) => dispatch(getResultsList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Results));
