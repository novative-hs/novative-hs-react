import {
  SCHEMES_ANALYTES_SUCCESS,
  SCHEMES_ANALYTES_FAIL,
  POST_RESULT_SUCCESS,
  POST_RESULT_FAIL,
  UPDATE_RESULT_SUCCESS,
  UPDATE_RESULT_FAIL,
  GET_RESULT_SUCCESS,
  GET_RESULT_FAIL,
  GET_STATISTICS_SUCCESS,
  GET_STATISTICS_FAIL,
  POST_SERELOGY_VALUES_SUCCESS,
  POST_SERELOGY_VALUES_FAIL,
  GET_SERELOGY_VALUES_SUCCESS,
  GET_SERELOGY_VALUES_FAIL,
  GET_ANALYTE_RESULT_PARTICIPANT_SUCCESS,
  GET_ANALYTE_RESULT_PARTICIPANT_FAIL,
  GET_MICRO_RESULT_DATA_SUCCESS,
  GET_MICRO_RESULT_DATA_FAIL,
  POST_MICRO_RESULT_SUCCESS,
  POST_MICRO_RESULT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  SchemeAnalytesList: [],
  getAnalyteResultParticipant: [],
  PostResult: [],
  PostMicroResult: [],
  updateResult: [],
  updateMicroResult: [],
  PostValues: [],
  ResultList: [],
  ValuesList: [],
  Statistics: [],
  schemeName: "",
  rounds: "",
  error: {},
  round_status: "",
  rounds_instance: "",
  scheme_id: "",
  schemeType: "",
  round_id: "",
  MicroResultList: {
    ListOrganism: [],
    ListAntibiotic: [],
    ReagentList: [],
    Instrument: [],
  },
};

const SchemeAnalytesList = (state = INIT_STATE, action) => {
  switch (action.type) {
    //get schemeAnalyte
    case SCHEMES_ANALYTES_SUCCESS:
      // console.log("Data received in reducerrrr:", action.payload.rounds); // Log the action.payload
      return {
        ...state,
        SchemeAnalytesList: action.payload.analytes,
        rounds: action.payload.round_no,
        sample: action.payload.rounds.sample,
        round_id: action.payload.rounds.id,
        issue_date: action.payload.round_issuedate,
        closing_date: action.payload.round_closingdate,
        schemeName: action.payload.scheme_name,
        schemeType: action.payload.scheme_type,
        round_status: action.payload.round_status,
        result_type: action.payload.result_type,
        scheme_id: action.payload.scheme_id,
        cycle_no: action.payload.cycle_no,
      };

    case SCHEMES_ANALYTES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    //post result
    case POST_RESULT_SUCCESS:
      return {
        ...state,
        PostResult: [...state.PostResult, action.payload.data],
      };

    case POST_RESULT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    ////////////////
    //UPDATE result

    case UPDATE_RESULT_SUCCESS:
      return {
        ...state,
        UPDATEResult: [...state.updateResult, action.payload.data],
      };

    case UPDATE_RESULT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    /////////////////////////////
    case POST_SERELOGY_VALUES_SUCCESS:
      return {
        ...state,
        PostValues: [...state.PostValues, action.payload.data],
      };

    case POST_SERELOGY_VALUES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    ////////////////////
    case GET_RESULT_SUCCESS:
      return {
        ...state,
        ResultList: action.payload.results,
        updated_at: action.payload.updated_at, // Store updated_at
      };

    case GET_RESULT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    /////////////////////////
    case GET_SERELOGY_VALUES_SUCCESS:
      return {
        ...state,
        ValuesList: action.payload,
      };
    case GET_SERELOGY_VALUES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    ///////////////////////////////
    case GET_STATISTICS_SUCCESS:
      return {
        ...state,
        Statistics: action.payload,
      };
    case GET_STATISTICS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    ///////////////////////////////////
    case GET_ANALYTE_RESULT_PARTICIPANT_SUCCESS:
      console.log(
        "GET_ANALYTE_RESULT_PARTICIPANT_SUCCESS action payload:",
        action.payload
      );
      return {
        ...state,
        getAnalyteResultParticipant: action.payload.data,
      };
    case GET_ANALYTE_RESULT_PARTICIPANT_FAIL:
      console.error(
        "GET_ANALYTE_RESULT_PARTICIPANT_FAIL error:",
        action.payload
      );

      return {
        ...state,
        error: action.payload,
      };
    case GET_MICRO_RESULT_DATA_SUCCESS:
      console.log("GET_MICRO_RESULT_DATA_SUCCESS payload:", action.payload);
      return {
        ...state,
        ListOrganism: action.payload.organisms,
        ListAntibiotic: action.payload.antibiotics,
        ReagentList: action.payload.reagents,
        Instrument: action.payload.instruments,
        ResultList: action.payload.results || [], // ✅
        MicroResultList: action.payload,
        error: null,
      };

    case GET_MICRO_RESULT_DATA_FAIL:
      console.error("GET_MICRO_RESULT_DATA_FAIL error:", action.payload);
      return {
        ...state,
        MicroResultList: null,
        ListOrganism: [],
        ListAntibiotic: [],
        ReagentList: [],
        Instrument: [],
        error: action.payload,
      };
    case POST_MICRO_RESULT_SUCCESS:
      return {
        ...state,
        PostMicroResult: [...state.PostMicroResult, action.payload.data],
      };

    case POST_MICRO_RESULT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default SchemeAnalytesList;
