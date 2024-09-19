import {
  
  GET_RESULT_SUBMIT,
  GET_RESULT_SUBMIT_SUCCESS,
  GET_RESULT_SUBMIT_FAIL,

  GET_REPORT,
  GET_REPORT_SUCCESS,
  GET_REPORT_FAIL,

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
    console.log("Dispatching GET_REPORT_SUCCESS with data:", Report);
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
  
