import {

  GET_RESULT_SUBMIT_SUCCESS,
  GET_RESULT_SUBMIT_FAIL,

  GET_REPORT_SUCCESS,
  GET_REPORT_FAIL
  
} from "./actionTypes";

const INIT_STATE = {
  ResultSubmit: [],
  Report: [],
  error: {},
};

const ResultSubmit = (state = INIT_STATE, action) => {
  switch (action.type) {
    
  ////////////////////
    case GET_RESULT_SUBMIT_SUCCESS:
      return {
        ...state,
        ResultSubmit: action.payload,
      };
    case GET_RESULT_SUBMIT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_REPORT_SUCCESS:
      console.log("action.payloadcdd", action.payload)
      return {
        ...state,
        Report: action.payload,
      };
    case GET_REPORT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default ResultSubmit;
