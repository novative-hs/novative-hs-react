import {
  SCHEMES_ANALYTES_SUCCESS,
  SCHEMES_ANALYTES_FAIL,
  POST_RESULT_SUCCESS,
  POST_RESULT_FAIL,

  GET_RESULT_SUCCESS,
  GET_RESULT_FAIL,

  GET_STATISTICS_SUCCESS,
  GET_STATISTICS_FAIL,

  POST_SERELOGY_VALUES_SUCCESS,
  POST_SERELOGY_VALUES_FAIL,
  GET_SERELOGY_VALUES_SUCCESS,
  GET_SERELOGY_VALUES_FAIL
  
} from "./actionTypes";

const INIT_STATE = {
  SchemeAnalytesList: [],
  PostResult: [],
  PostValues: [],
  ResultList: [],
  ValuesList: [],
  Statistics:[],
  schemeName: '',
  rounds:'',
  error: {},
  round_status:'', 
  rounds_instance:'', 
  scheme_id: '',
  schemeType: '',
  round_id: '',
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
        round_status:action.payload.round_status,
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
        ResultList: action.payload,
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
    default:
      return state;
  }
};

export default SchemeAnalytesList;
