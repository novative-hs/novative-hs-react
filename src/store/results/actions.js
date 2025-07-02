import {
  SCHEMES_ANALYTES,
  SCHEMES_ANALYTES_SUCCESS,
  SCHEMES_ANALYTES_FAIL,

  POST_RESULT,
  POST_RESULT_SUCCESS,
  POST_RESULT_FAIL,

  UPDATE_RESULT,
  UPDATE_RESULT_SUCCESS,
  UPDATE_RESULT_FAIL,

  GET_RESULT,
  GET_RESULT_SUCCESS,
  GET_RESULT_FAIL,

  GET_STATISTICS,
  GET_STATISTICS_SUCCESS,
  GET_STATISTICS_FAIL,


  POST_SERELOGY_VALUES,
  POST_SERELOGY_VALUES_SUCCESS,
  POST_SERELOGY_VALUES_FAIL,
  GET_SERELOGY_VALUES,
  GET_SERELOGY_VALUES_SUCCESS,
  GET_SERELOGY_VALUES_FAIL,

  GET_ANALYTE_RESULT_PARTICIPANT,
  GET_ANALYTE_RESULT_PARTICIPANT_SUCCESS,
  GET_ANALYTE_RESULT_PARTICIPANT_FAIL,


} from "./actionTypes";

export const getSchemeAnalytesList = (id) => ({
    type: SCHEMES_ANALYTES,
    payload: id,
  });
 
  export const getSchemeAnalytesListSuccess = SchemeAnalytesList => {
    // console.log(" response in success action:", SchemeAnalytesList);
    return {
      type: SCHEMES_ANALYTES_SUCCESS,
      payload: SchemeAnalytesList,
    };
  };
  export const getSchemeAnalytesListFail = (error) => {
    // console.log("Error response in fail action:", error);
    return {
      type: SCHEMES_ANALYTES_FAIL,
      payload: error,
    };
  };

  export const postResult = (result, id) => {
    console.log("🚀 Dispatching POST_RESULT Action:");
    console.log("📌 Result Data:", result);
    console.log("📌 User ID:", id);
 
    return {
      type: POST_RESULT,
      payload: { result, id },
    };
  };
 
  export const postResultSuccess = (result) => {
    console.log("✅ POST_RESULT_SUCCESS Action Dispatched:");
    console.log("📌 Response Data:", result);
 
    return {
      type: POST_RESULT_SUCCESS,
      payload: result,
    };
  };
 
  export const postResultFail = (error) => {
    console.error("❌ POST_RESULT_FAIL Action Dispatched:");
    console.error("📌 Error:", error);
 
    return {
      type: POST_RESULT_FAIL,
      payload: error,
    };
  };
 
  ////////////////////////
 export const updateResult = (result, id) => {
    console.log("🚀 Dispatching POST_RESULT Action:");
    console.log("📌 Result Data:", result);
    console.log("📌 User ID:", id);
  
    return {
      type: UPDATE_RESULT,
      payload: { result, id },
    };
  };
  
  export const updateResultSuccess = (result) => {
    console.log("✅ UPDATE_RESULT_SUCCESS Action Dispatched:");
    console.log("📌 Response Data:", result);
  
    return {
      type: UPDATE_RESULT_SUCCESS,
      payload: result,
    };
  };
export const updateResultFail = (error) => {
  console.error("❌ UPDATE_RESULT_FAIL Action Dispatched:");
  console.error("📌 Error:", error);

  return {
    type: UPDATE_RESULT_FAIL,
    payload: error,
  };
};
  ////////////////////////////////
  export const getResultsList = id => ({
    type: GET_RESULT,
    payload: id,
  });
 
  export const getResultsListSuccess = ResultList => {
 
    return {
      type: GET_RESULT_SUCCESS,
      payload: ResultList,
    };
  };
 
  export const getResultsListFail = (error) => {
    return {
      type: GET_RESULT_FAIL,
      payload: error,
    };
  };
  ////////////////////////////////
  export const getStatisticsList = id => ({
    type: GET_STATISTICS,
    payload: id,
  });
 
  export const getStatisticsListSuccess = ResultList => {
 
    return {
      type: GET_STATISTICS_SUCCESS,
      payload: ResultList,
    };
  };
 
  export const getStatisticsListFail = (error) => {
    return {
      type: GET_STATISTICS_FAIL,
      payload: error,
    };
  };

  export const postValues = (result, id) => {
    return {
      type: POST_SERELOGY_VALUES,
      payload: { result, id },
    };
  };
 
  export const postValuesSuccess = result => ({
    type: POST_SERELOGY_VALUES_SUCCESS,
    payload: result,
  });
 
  export const postValuesFail = error => ({
    type: POST_SERELOGY_VALUES_FAIL,
    payload: error,
  });

  export const getResultValues = (id, round_id) => {
    // console.log("Fetching result values for ID:", id, "and round_id:", round_id);
    return {
      type: GET_SERELOGY_VALUES,
      payload: { id, round_id },
    };
  };
 
  export const getResultValuesSuccess = ResultList => {
 
    return {
      type: GET_SERELOGY_VALUES_SUCCESS,
      payload: ResultList,
    };
  };
 
  export const getResultValuesFail = (error) => {
    return {
      type: GET_SERELOGY_VALUES_FAIL,
      payload: error,
    };
  };

export function getAnalyteResultParticipant(roundId, analyteId) {
  console.log("Dispatching GET_ANALYTE_RESULT_PARTICIPANT with:", roundId, analyteId);
  return {
    type: GET_ANALYTE_RESULT_PARTICIPANT,
    payload: { roundId: roundId, analyteId: analyteId },
  };
}

// Action on successful fetch
export function getAnalyteResultParticipantSuccess(getAnalyteResultParticipant) {
  console.log("GET_ANALYTE_RESULT_PARTICIPANT_SUCCESS:", getAnalyteResultParticipant);
  return {
    type: GET_ANALYTE_RESULT_PARTICIPANT_SUCCESS,
    payload: getAnalyteResultParticipant,
  };
}

// Action on failure
export function getAnalyteResultParticipantFail(error) {
  console.error("GET_ANALYTE_RESULT_PARTICIPANT_FAIL:", error);
  return {
    type: GET_ANALYTE_RESULT_PARTICIPANT_FAIL,
    payload: error,
  };
}