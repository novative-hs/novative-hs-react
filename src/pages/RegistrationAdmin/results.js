import React, { Component, useState } from "react";
import axios from "axios";
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
  updateResult,
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
      // participantID: "",
      // participant_ids: [],
      PostResult: [],
      ResultList: [],
      isDataLoaded: false, // Flag to track if all data is loaded
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      submittedOn: localStorage.getItem("submittedOn") || null,
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.validateResult = this.validateResult.bind(this);
  }
  getApprovedLabListColumns = () => {
    const { schemeType, SchemeAnalytesList } = this.props;
    const { ListUnits, ListMethods, ReagentList, Instrument, round_status } =
      this.state;

    // Utility function to safely find an analyte by ID
    const getAnalyteById = id =>
      SchemeAnalytesList.find(a => String(a.id) === String(id));

    // Utility function for filtering options
    const filterOptions = (availableIds, list) =>
      list.filter(item => availableIds.includes(String(item.id)));

    if (schemeType === "Quantitative") {
      return [
        {
          text: "Analyte",
          dataField: "analyte_name",
          sort: true,
          formatter: (cell, row) => (
            <div className="text-start">{row.analyte_name}</div>
          ),
        },
        {
          text: "Unit",
          dataField: "units",
          sort: true,
          formatter: (cell, row) => {
            const analyte = getAnalyteById(row.analyte_id);
            console.log("🔍 Looking for analyte ID:", row.analyte_id);
            console.log("📦 Found analyte object:", analyte);
            const analyteUnitIds = (analyte?.units || []).map(id => String(id));
            const unitOptions = ListUnits.filter(u =>
              analyteUnitIds.includes(String(u.id))
            );

            console.log("Analyte Object:", analyte);
            console.log("Analyte Unit IDs:", analyteUnitIds);
            console.log("ListUnits (Available Units):", ListUnits);
            console.log("Filtered Unit Options:", unitOptions);

            return (
              <select
                className="form-select me-2"
                value={row.units || ""}
                onChange={e => this.handleUnitChange(e, row)}
              >
                <option value="">Select Unit</option>
                {unitOptions.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            );
          },
        },
        {
          text: "Instrument",
          dataField: "instrument_name",
          sort: true,
          formatter: (cell, row) => {
            const instruments = this.state?.Instrument || []; // ✅ safely pull from state
            console.log(
              "🎯 Instrument dropdown rendering for row:",
              row.id,
              "Available instruments:",
              instruments.length
            );
            return (
              <select
                className="form-select me-2"
                value={row.instrument_name || ""}
                onChange={e => this.handleInstrumentChange(e, row)}
              >
                <option value="">Select Instrument</option>
                {instruments.map(instr => (
                  <option key={instr.id} value={instr.id}>
                    {instr.name}
                  </option>
                ))}
              </select>
            );
          },
        },
        {
          text: "Method",
          dataField: "method_name",
          sort: true,
          formatter: (cell, row) => {
            const analyte = getAnalyteById(row.analyte_id);
            const analyteMethodIds = (analyte?.methods || []).map(id =>
              String(id)
            );
            const methodOptions = ListMethods.filter(
              m =>
                m.status === "Active" && analyteMethodIds.includes(String(m.id))
            );

            return (
              <select
                className="form-select me-2"
                value={row.method_name || ""}
                onChange={e => this.handleMethodChange(e, row)}
              >
                <option value="">Select Method</option>
                {methodOptions.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            );
          },
        },
        {
          text: "Reagent",
          dataField: "reagent_name",
          sort: true,
          formatter: (cell, row) => {
            const analyte = getAnalyteById(row.analyte_id);
            const analyteReagentIds = (analyte?.reagents || []).map(id =>
              String(id)
            );
            const reagentOptions = ReagentList.filter(
              r =>
                r.status === "Active" &&
                analyteReagentIds.includes(String(r.id))
            );

            return (
              <select
                className="form-select me-2"
                value={row.reagent_name || ""}
                onChange={e => this.handleReagentChange(e, row)}
              >
                <option value="">Select Reagent</option>
                {reagentOptions.map(reagent => (
                  <option key={reagent.id} value={reagent.id}>
                    {reagent.name}
                  </option>
                ))}
              </select>
            );
          },
        },
        {
          text: "Result Value",
          dataField: "result",
          sort: true,
          formatter: (cell, row) => (
            <input
              type="text"
              className="form-control"
              ref={el => (this[`resultRef_${row.analyte_id}`] = el)} // Bind ref
              defaultValue={row.result || ""} // Set default value
              placeholder="Enter result"
              onBlur={e => {
                const value = e.target.value.trim();
                const updatedData = this.state.combinedData.map(item =>
                  item.id === row.id ? { ...item, result: value } : item
                );
                this.setState({ combinedData: updatedData });
              }}
              onChange={e => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  e.target.value = value;
                } else {
                  e.target.value = value.slice(0, -1); // Remove invalid character
                }
              }}
            />
          ),
        },
        {
          text: "Actions",
          dataField: "Actions",
          formatter: (cell, row) => (
            <button
              onClick={() => this.handleUpdate(row)}
              className="btn btn-success"
            >
              Update
            </button>
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
          formatter: (cell, row) => {
            const instruments = this.state?.Instrument || []; // ✅ safely pull from state
            console.log(
              "🎯 Instrument dropdown rendering for row:",
              row.id,
              "Available instruments:",
              instruments.length
            );
            return (
              <select
                className="form-select me-2"
                value={row.instrument_name || ""}
                onChange={e => this.handleInstrumentChange(e, row)}
              >
                <option value="">Select Instrument</option>
                {instruments.map(instr => (
                  <option key={instr.id} value={instr.id}>
                    {instr.name}
                  </option>
                ))}
              </select>
            );
          },
        },
        {
          text: "Method",
          dataField: "method_name",
          sort: true,
          formatter: (cell, row) => {
            const analyte = getAnalyteById(row.analyte_id);
            const analyteMethodIds = (analyte?.methods || []).map(id =>
              String(id)
            );
            const methodOptions = ListMethods.filter(
              m =>
                m.status === "Active" && analyteMethodIds.includes(String(m.id))
            );

            return (
              <select
                className="form-select me-2"
                value={row.method_name || ""}
                onChange={e => this.handleMethodChange(e, row)}
              >
                <option value="">Select Method</option>
                {methodOptions.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            );
          },
        },
        {
          text: "Reagent",
          dataField: "reagent_name",
          sort: true,
          formatter: (cell, row) => {
            const analyte = getAnalyteById(row.analyte_id);
            const analyteReagentIds = (analyte?.reagents || []).map(id =>
              String(id)
            );
            const reagentOptions = ReagentList.filter(
              r =>
                r.status === "Active" &&
                analyteReagentIds.includes(String(r.id))
            );

            return (
              <select
                className="form-select me-2"
                value={row.reagent_name || ""}
                onChange={e => this.handleReagentChange(e, row)}
              >
                <option value="">Select Reagent</option>
                {reagentOptions.map(reagent => (
                  <option key={reagent.id} value={reagent.id}>
                    {reagent.name}
                  </option>
                ))}
              </select>
            );
          },
        },

        {
          text: "Result Type",
          dataField: "result_type",
          sort: true,
          formatter: (cellContent, list) => (
            <select
              className="form-select me-2"
              value={list.result_type || ""}
              onChange={e => this.handleResultTypeChange(e, list)}
            >
              <option value="">Select Result Type</option>
              {["Positive", "Negative", "Equivocal"].map((type, index) => (
                <option
                  key={index}
                  value={type}
                  style={{
                    backgroundColor:
                      type === list.result_type ? "#007bff" : "white",
                    color: type === list.result_type ? "white" : "black",
                  }}
                >
                  {type}
                </option>
              ))}
            </select>
          ),
        },
        {
          text: "Result Value",
          dataField: "result",
          sort: true,
          formatter: (cell, row) => (
            <input
              type="text"
              className="form-control"
              ref={el => (this[`resultRef_${row.analyte_id}`] = el)} // Bind ref
              defaultValue={row.result || ""} // Set default value
              placeholder="Enter result"
              onBlur={e => {
                const value = e.target.value.trim();
                const updatedData = this.state.combinedData.map(item =>
                  item.id === row.id ? { ...item, result: value } : item
                );
                this.setState({ combinedData: updatedData });
              }}
              onChange={e => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value)) {
                  e.target.value = value;
                } else {
                  e.target.value = value.slice(0, -1); // Remove invalid character
                }
              }}
            />
          ),
        },
        {
          text: "Actions",
          dataField: "Actions",
          formatter: (cellContent, list) => (
            <div className="d-flex flex-row align-items-start">
              <button
                onClick={() => this.handleSubmit(list)}
                className="btn btn-success"
              >
                Submit
              </button>
            </div>
          ),
        },
      ];
    }

    // 🚧 Suggestion: Implement qualitative block too (or return null if unsupported)
    return [];
    this.handleUpdate = this.handleUpdate.bind(this);
    this.validateResult = this.validateResult.bind(this);
  };
  checkAndCombine = () => {
    const { SchemeAnalytesList } = this.props;
    const {
      ListUnits,
      ListMethods,
      Instrument,
      ReagentList,
      submittedResults,
      isDataLoaded,
    } = this.state;

    const allReady =
      SchemeAnalytesList?.length &&
      ListUnits?.length &&
      ListMethods?.length &&
      Instrument?.length &&
      ReagentList?.length &&
      submittedResults?.length;

    if (allReady && !isDataLoaded) {
      console.log("✅ All data ready — combining now");
      this.setState({ isDataLoaded: true }, this.combineData);
    } else {
      console.log(
        "🕐 Waiting — allReady?",
        allReady,
        "isDataLoaded:",
        isDataLoaded
      );
    }
  };

  componentDidMount() {
    const {
      onGetSchemeAnalyte,
      onGetUnitsList,
      onGetMethodsList,
      onGetInstrumentList,
      onGetReagents,
      onGetResultsList,
    } = this.props;

    const roundId = this.props.match.params.id;

    const searchParams = new URLSearchParams(this.props.location.search);
    const participantIDFromQuery = searchParams.get("participantID");

    const userAuth = localStorage.getItem("authUser");
    const userId = userAuth ? JSON.parse(userAuth).user_id : null;

    const participantID = participantIDFromQuery || userId;

    console.log(
      "componentDidMount — roundId:",
      roundId,
      "participantID:",
      participantID
    );

    if (participantID) {
      this.setState({ participantID }, () => {
        console.log(
          "✅ Set Participant ID in state:",
          this.state.participantID
        );

        if (roundId) {
          console.log("✅ Triggering data fetch");

          onGetSchemeAnalyte(roundId);
          onGetUnitsList(userId); // ✅ Removed userId
          onGetMethodsList(userId); // ✅ Removed userId
          onGetInstrumentList(userId); // ✅ Removed userId
          onGetReagents(userId); // ✅ Removed userId
          onGetResultsList(roundId);

          this.fetchSubmittedResults(); // ✅ Only here
        } else {
          console.warn("⛔ Skipped fetching — missing roundId");
        }
      });
    }

    // ✅ This must stay outside (not inside the participantID block)
    const submittedOn = localStorage.getItem("submittedOn");
    if (submittedOn) {
      this.setState({ submittedOn });
    }

    // ❌ REMOVE this.fetchSubmittedResults() here
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      SchemeAnalytesList,
      ListUnits,
      ListMethods,
      Instrument,
      ReagentList,
      ResultList,
    } = this.props;

    const { submittedResults, isDataLoaded } = this.state;

    const roundId = this.props.match.params.id;
    const searchParams = new URLSearchParams(this.props.location.search);
    const prevParticipantID = new URLSearchParams(
      prevProps.location.search
    ).get("participantID");
    const currParticipantID = searchParams.get("participantID");

    const prevUserId = prevState.user_id;
    const currUserId = this.state.participantID;

    const userAuth = localStorage.getItem("authUser");
    const userId = userAuth ? JSON.parse(userAuth).user_id : null;

    // 🔄 If participant changes
    if (prevParticipantID !== currParticipantID) {
      console.log("Participant changed:", currParticipantID);
      this.setState({ user_id: currParticipantID, isDataLoaded: false }, () => {
        this.props.onGetSchemeAnalyte(roundId);
        this.props.onGetUnitsList(userId);
        this.props.onGetMethodsList(userId);
        this.props.onGetInstrumentList(userId);
        this.props.onGetReagents(userId);
        this.props.onGetResultsList(roundId);
        this.fetchSubmittedResults();
      });
    }

    // 🔄 If user_id gets set for the first time
    if (!prevUserId && currUserId && roundId) {
      console.log("✅ user_id now available → Fetching lists");
      this.props.onGetSchemeAnalyte(roundId);
      this.props.onGetUnitsList(userId);
      this.props.onGetMethodsList(userId);
      this.props.onGetInstrumentList(userId);
      this.props.onGetReagents(userId);
      this.props.onGetResultsList(roundId);
      this.fetchSubmittedResults();
    }

    // 🔁 Sync props to local state and check data readiness
    if (
      prevProps.ListUnits !== ListUnits ||
      prevProps.ListMethods !== ListMethods ||
      prevProps.Instrument !== Instrument ||
      prevProps.ReagentList !== ReagentList
    ) {
      this.setState(
        {
          ListUnits,
          ListMethods,
          Instrument,
          ReagentList,
        },
        () => {
          const {
            submittedResults,
            ListUnits,
            ListMethods,
            Instrument,
            ReagentList,
            isDataLoaded,
          } = this.state;
          const { SchemeAnalytesList } = this.props;

          const allReady =
            SchemeAnalytesList?.length &&
            ListUnits?.length &&
            ListMethods?.length &&
            Instrument?.length &&
            ReagentList?.length &&
            submittedResults?.length;

          if (allReady && !isDataLoaded) {
            console.log("✅ All data ready — combining (delayed)");
            this.setState({ isDataLoaded: true }, this.combineData);
          }
        }
      );
    }

    // 🔄 If analytes changed, sync them into state
    if (prevProps.SchemeAnalytesList !== SchemeAnalytesList) {
      this.setState({ SchemeAnalytesList });
    }

    console.log("🧪 Checking combineData readiness:", {
      analytes: SchemeAnalytesList?.length,
      units: ListUnits?.length,
      methods: ListMethods?.length,
      instruments: Array.isArray(Instrument)
        ? Instrument.length
        : "(not array)",
      reagents: ReagentList?.length,
      results: ResultList?.length ?? "(unknown)",
      submitted: submittedResults?.length,
      isDataLoaded,
    });

    // 🔁 Recombine if results change after loading
    if (
      prevProps.ResultList !== ResultList &&
      isDataLoaded &&
      submittedResults?.length
    ) {
      console.log("🔄 ResultList changed → recombining");
      this.combineData();
    }
  }

  fetchSubmittedResults = async () => {
    const roundId = this.props.match.params.id;
    const { participantID } = this.state;

    if (!roundId || !participantID) {
      console.warn(
        "⛔ roundId or participantID missing — skipping fetchSubmittedResults"
      );
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/registration-admin/getResultsData/${roundId}`);

      console.log("📦 Full API Response:", res);
      console.log("📦 API Response Data:", res.data);

      const allResults = res?.data?.data;

      if (!Array.isArray(allResults)) {
        console.error(
          "❌ Submitted results data is missing or not an array:",
          allResults
        );
        return;
      }

      const filtered = allResults.filter(
        result => result.lab && result.lab.id === parseInt(participantID)
      );

      console.log(
        "✅ Filtered results for lab ID",
        participantID,
        ":",
        filtered
      );

      this.setState({ submittedResults: filtered }, () => {
        console.log("✅ submittedResults set");
        this.checkAndCombine(); // ✅ Now it can trigger combineData immediately if all other data is ready
      });
    } catch (error) {
      console.error("🚨 Error fetching submitted results:", error);
    }
  };

  combineData = () => {
    console.log("🛠 combineData() called");

    const { SchemeAnalytesList } = this.props;

    const {
      submittedResults,
      ListUnits,
      ListMethods,
      ReagentList,
      Instrument,
    } = this.state;

    const combinedData = SchemeAnalytesList.map(analyte => {
      const userResult = submittedResults.find(result => {
        const analyteId =
          result.analyte?.id ?? result.analyte ?? result.analyte_id ?? null;
        return String(analyteId) === String(analyte.id);
      });

      const availableUnits = ListUnits.filter(unit =>
        (analyte.units || []).map(String).includes(String(unit.id))
      );

      const availableMethods = ListMethods.filter(method =>
        (analyte.methods || []).map(String).includes(String(method.id))
      );

      const availableReagents = ReagentList.filter(reagent =>
        (analyte.reagents || []).map(String).includes(String(reagent.id))
      );

      let availableInstruments = [];
      if (Array.isArray(analyte.instruments)) {
        if (typeof analyte.instruments[0] === "object") {
          const analyteInstrumentIds = analyte.instruments.map(i => i.id);
          availableInstruments = Instrument.filter(instr =>
            analyteInstrumentIds.map(String).includes(String(instr.id))
          );
        } else {
          availableInstruments = Instrument.filter(instr =>
            analyte.instruments.map(String).includes(String(instr.id))
          );
        }
      }

      console.log("🔍 Analyte:", analyte.name, `(ID: ${analyte.id})`);
      console.log("📦 Instruments from analyte:", analyte.instruments);
      console.log(
        "📦 All Instruments:",
        Instrument.map(i => i.id)
      );
      console.log(
        "✅ Matched Instruments:",
        availableInstruments.map(i => i.name || i.id)
      );

      return {
        id: analyte.id,
        analyte_name: analyte.name || "-",
        analyte_id: analyte.id,

        lab_id: userResult?.lab?.id ?? null,
        units: userResult?.units?.id ?? userResult?.units ?? "",
        instrument_name:
          userResult?.instrument?.id ?? userResult?.instrument ?? "",
        method_name: userResult?.method?.id ?? userResult?.method ?? "",
        reagent_name: userResult?.reagents?.id ?? userResult?.reagents ?? "",

        availableUnits,
        availableInstruments,
        availableMethods,
        availableReagents,

        result: userResult?.result || "",
        result_status: userResult?.result_status || null,
        result_type: userResult?.result_type || null,
      };
    });

    console.log("📋 Final combinedData:", combinedData);
    this.setState({ combinedData });
  };

  // Helper method: Constructs result data
  constructResultData = (list, resultValue, resultStatus) => {
    const { rounds, scheme_id, round_status } = this.props;
    const round_id = this.props.match.params.id;

    return {
      round_id,
      analyte_id: list.analyte_id,
      rounds,
      scheme_id,
      round_status: round_status || "Closed",
      result_status: resultStatus,
      result_type: list.result_type || null,
      result: resultValue,
      units: list.units && !isNaN(list.units) ? parseInt(list.units) : null,
      instrument: list.instrument_name ? parseInt(list.instrument_name) : null,
      method: list.method_name ? parseInt(list.method_name) : null,
      reagents: list.reagent_name ? parseInt(list.reagent_name) : null,
    };
  };

  // Helper method: Validates result
  validateResult = resultValue => {
    if (!resultValue) {
      alert("Result is required before submitting.");
      return false;
    }
    return true;
  };

  // Update a single analyte
  handleUpdate = async list => {
    const { participantID } = this.state;
    const resultValue =
      this[`resultRef_${list.analyte_id}`]?.value?.trim() || null;

    if (!this.validateResult(resultValue)) return;

    const resultData = {
      round_id: this.props.match.params.id,
      analyte_id: list.analyte_id,
      result: resultValue,
      result_type: list.result_type || "Not Submitted",
      result_status: "Created",
      rounds: this.props.rounds,
      round_status: this.props.round_status || "Closed",
      scheme_id: this.props.scheme_id,
      units: list.units && !isNaN(list.units) ? parseInt(list.units) : null,
      instrument_name: list.instrument_name || null,
      method_name: list.method_name || null,
      reagent_name: list.reagent_name || null,
    };

    // ✅ Use a callback instead of await
    this.props.onUpdateResult(
      resultData,
      list.lab_id || participantID,
      async response => {
        if (response?.status === 200 || response?.status === "200") {
          alert(response.message || "Result updated successfully.");
          await this.fetchSubmittedResults();
          this.combineData();
        } else {
          alert(response?.message || "Failed to update result.");
        }
      }
    );
  };

  // Submit all results
  handleSubmit = async () => {
    const { participantID, combinedData } = this.state;

    let atLeastOneSubmitted = false;

    for (const row of combinedData) {
      const resultValue =
        this[`resultRef_${row.analyte_id}`]?.value?.trim() || "";

      if (!resultValue) {
        console.warn(
          `⏭ Skipping analyte ${row.analyte_name} — no result value entered.`
        );
        continue;
      }

      const resultData = {
        round_id: this.props.match.params.id,
        analyte_id: row.analyte_id,
        result: resultValue,
        result_type: row.result_type || "Not Submitted",
        result_status: "Submitted",
        rounds: this.props.rounds,
        round_status: this.props.round_status || "Closed",
        scheme_id: this.props.scheme_id,
        units: row.units && !isNaN(row.units) ? parseInt(row.units) : null,
        instrument_name: row.instrument_name || null,
        method_name: row.method_name || null,
        reagent_name: row.reagent_name || null,
      };

      try {
        await this.props.onUpdateResult(resultData, participantID);
        atLeastOneSubmitted = true;
      } catch (err) {
        console.error(
          `❌ Failed to submit result for ${
            row.analyte_name || row.analyte_id
          }`,
          err
        );
      }
    }

    if (atLeastOneSubmitted) {
      await this.fetchSubmittedResults();
      this.combineData();
      alert("✅ Submitted all analytes with result values.");
    } else {
      alert("⚠️ No results were submitted. Please enter result values first.");
    }
  };

  handleUnitChange = (event, row) => {
    const { value } = event.target;

    const updatedData = this.state.combinedData.map(item => {
      if (item.analyte_id === row.analyte_id) {
        return { ...item, units: value }; // Update `units` for the matching analyte
      }
      return item;
    });

    console.log("Updated Combined Data:", updatedData); // Debugging state updates
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
    console.log("Round Status:", this.props.round_status);

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
              <title>Participant Result | NEQAS</title>
            </MetaTags>
            <Container fluid>
              {/* <Breadcrumbs title="Participant" breadcrumbItem="Unapproved" /> */}
              <Row className="mb-3 text-danger">
                <strong>
                  <Col className="d-flex flex-wrap justify-content-md-around justify-content-sm-start  p-3">
                    <div className="d-flex flex-column flex-md-row align-items-start  mb-2 mb-md-0 p-2">
                      <span className="me-2">Participant No:</span>
                      <span>{<span>{this.state.participantID}</span>}</span>
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
              <div className="d-flex flex-wrap align-items-center gap-3 ms-5">
                <Button
                  onClick={this.exportToExcel}
                  className="mb-3 btn btn-secondary"
                  style={{ minWidth: "140px" }}
                >
                  Download Results
                </Button>
                <Button
                  onClick={() => {
                    const { organization_name, id, id1 } =
                      this.props.match.params;
                    this.props.history.push(
                      `/${organization_name}/${id}/${id1}/report1_view`
                    );
                  }}
                  className="mb-3 btn btn-secondary"
                  style={{ minWidth: "140px" }}
                >
                  Print
                </Button>
                <Link
                  to={`/${organization_name}/result-history/${id}?participantId=${this.state.participantID}&scheme_id=${scheme_id}`}
                >
                  <Button
                    className="mb-3 btn btn-secondary"
                    style={{ minWidth: "140px" }}
                  >
                    History
                  </Button>
                </Link>

                {/* Remove the Re-Submit button */}
                <Button
                  className="mb-3 btn btn-success"
                  style={{ minWidth: "140px" }}
                  onClick={this.handleSubmit}
                >
                  Submit
                </Button>
              </div>

              <Row className="justify-content-center align-item-center">
                <Col lg="10">
                  <Card>
                    <CardBody>
                      {combinedData.length === 0 && (
                        <div className="text-danger mb-3">
                          No data to display — check if matching logic or API
                          response structure is correct.
                        </div>
                      )}

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
                                    id="printable-table"
                                    keyField="analyte_id" // ✅ must match your data keys
                                    data={this.state.combinedData} // ✅ required to render rows
                                    columns={this.getApprovedLabListColumns()} // ✅ required to render columns
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
  // participant_ids: PropTypes.array,
  SchemeAnalytesList: PropTypes.array,
  cycle_no: PropTypes.string,
  history: PropTypes.object.isRequired, // Add this line for history

  rounds: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  scheme_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),

  round_status: PropTypes.string,
  result_type: PropTypes.string,
  // scheme_id: PropTypes.number,
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
  onUpdateResult: PropTypes.func,
  roundStatus: PropTypes.object,
  onGetResultsList: PropTypes.func,
  location: PropTypes.object,
};

const mapStateToProps = state => {
  if (!state) {
    console.error("Redux state is undefined!");
    return {};
  }

  console.log("Redux State:", state);

  return {
    schemeName: state?.SchemeAnalytesList?.schemeName || "",
    schemeType: state?.SchemeAnalytesList?.schemeType || "",
    SchemeAnalytesList: state?.SchemeAnalytesList?.SchemeAnalytesList || [],
    rounds: state?.SchemeAnalytesList?.rounds || "",
    scheme_id: state?.SchemeAnalytesList?.scheme_id || null,
    round_status: state?.SchemeAnalytesList?.round_status || "",
    result_type: state?.SchemeAnalytesList?.result_type || "",
    issue_date: state?.SchemeAnalytesList?.issue_date || "",
    closing_date: state?.SchemeAnalytesList?.closing_date || "",
    cycle_no: state?.SchemeAnalytesList?.cycle_no || "",
    ListUnits: state?.ListUnits?.ListUnits || [],
    ListMethods: state?.ListMethods?.ListMethods || [],
    Instrument: state?.Instrument?.Instrument || [],
    ReagentList: state?.ReagentList?.ReagentList || [],
    ResultList: state?.SchemeAnalytesList?.ResultList || [],
  };
};

const mapDispatchToProps = dispatch => ({
  onGetSchemeAnalyte: id => dispatch(getSchemeAnalytesList(id)),
  onGetUnitsList: id => dispatch(getunitlist(id)),
  onGetMethodsList: id => dispatch(getmethodlist(id)),
  onGetInstrumentList: id => dispatch(getInstrumentlist(id)),
  onGetReagents: id => dispatch(getReagentlist(id)),
  onPostResult: (result, id) => dispatch(postResult(result, id)),
  onUpdateResult: (result, id) => dispatch(updateResult(result, id)),
  onGetResultsList: id => dispatch(getResultsList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Results));
