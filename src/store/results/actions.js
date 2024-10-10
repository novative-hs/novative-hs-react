import {
  SCHEMES_ANALYTES,
  SCHEMES_ANALYTES_SUCCESS,
  SCHEMES_ANALYTES_FAIL,

  POST_RESULT,
  POST_RESULT_SUCCESS,
  POST_RESULT_FAIL,

  GET_RESULT,
  GET_RESULT_SUCCESS,
  GET_RESULT_FAIL,

  GET_STATISTICS,
  GET_STATISTICS_SUCCESS,
  GET_STATISTICS_FAIL,

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
    return {
      type: POST_RESULT,
      payload: { result, id },
    };
  };
  
  export const postResultSuccess = result => ({
    type: POST_RESULT_SUCCESS,
    payload: result,
  });
  
  export const postResultFail = error => ({
    type: POST_RESULT_FAIL,
    payload: error,
  });

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
  
