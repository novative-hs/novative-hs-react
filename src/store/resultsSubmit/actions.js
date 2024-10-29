import {
  
  GET_RESULT_SUBMIT,
  GET_RESULT_SUBMIT_SUCCESS,
  GET_RESULT_SUBMIT_FAIL,

  GET_REPORT,
  GET_REPORT_SUCCESS,
  GET_REPORT_FAIL,

  GET_SERELOGY_RESULT,
  GET_SERELOGY_RESULT_SUCCESS,
  GET_SERELOGY_RESULT_FAIL,

} from "./actionTypes";


  ////////////////////////////////
  export const getResultSubmit = id => ({
    type: GET_RESULT_SUBMIT,
    payload: id,
  });
  
  export const getResultSubmitSuccess = ResultSubmit => {
    return {
      type: GET_RESULT_SUBMIT_SUCCESS,
      payload: ResultSubmit,
    };
  };
  
  export const getResultSubmitFail = (error) => {
    return {
      type: GET_RESULT_SUBMIT_FAIL,
      payload: error,
    };
  };

  ///////////////////////
  export const getReport = id => ({
    type: GET_REPORT,
    payload: id,
  });
  
  export const getReportSuccess = Report => {
    // console.log("Dispatching GET_REPORT_SUCCESS with data:", Report);
    return {
      type: GET_REPORT_SUCCESS,
      payload: Report,
    };
  };
  
  export const getReportFail = (error) => {
    return {
      type: GET_REPORT_FAIL,
      payload: error,
    };
  };
  ///////////////////////
  export const getSereologyResult = id => ({
    type: GET_SERELOGY_RESULT,
    payload: id,
  });
  
  export const getSereologyResultSuccess = Result => {
    return {
      type: GET_SERELOGY_RESULT_SUCCESS,
      payload: Result,
    };
  };
  
  export const getSereologyResultFail = (error) => {
    return {
      type: GET_SERELOGY_RESULT_FAIL,
      payload: error,
    };
  };
  
