import {
  SCHEMES_ANALYTES_SUCCESS,
  SCHEMES_ANALYTES_FAIL,
  POST_RESULT_SUCCESS,
  POST_RESULT_FAIL,

  GET_RESULT_SUCCESS,
  GET_RESULT_FAIL
  
} from "./actionTypes";

const INIT_STATE = {
  SchemeAnalytesList: [],
  PostResult: [],
  ResultList: [],
  schemeName: '',
  rounds:'',
  error: {},
  round_status:'', 
  result_status:'', 
  scheme_id: ''
};

const SchemeAnalytesList = (state = INIT_STATE, action) => {
  switch (action.type) {
    //get schemeAnalyte
    case SCHEMES_ANALYTES_SUCCESS:
      // console.log("Data received in reducerrrr:", action.payload); // Log the action.payload
      return {
        ...state,
        SchemeAnalytesList: action.payload.analytes,
        rounds: action.payload.round_no,
        issue_date: action.payload.round_issuedate,
        closing_date: action.payload.round_closingdate,
        schemeName: action.payload.scheme_name,
        schemeType: action.payload.scheme_type,
        participant_ids: action.payload.participant_ids,
        round_status:action.payload.round_status,
        result_status:action.payload.result_status,
        result_type: action.payload.result_type,
        scheme_id:action.payload.scheme_id,
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
  ////////////////////
    case GET_RESULT_SUCCESS:
      return {
        ...state,
        ResultList: action.payload,
      };
    case GET_RESULT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default SchemeAnalytesList;
