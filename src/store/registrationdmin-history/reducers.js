import {
  GET_HISTORY_LIST_ROUND_SUCCESS,
  GET_HISTORY_LIST_ROUND_FAIL,
  GET_RESULT_HISTORY_SUCCESS,
  GET_RESULT_HISTORY_FAIL
} from "./actionTypes";

const INIT_STATE = {
  activitylogRounds: [],
  activitylogResults: [],
  error: {},
};

const activitylogRounds = (state = INIT_STATE, action) => {
  switch (action.type) {
    // Get units history success
    case GET_HISTORY_LIST_ROUND_SUCCESS:
      // console.log("Data received in reducer:", action.payload); // Log the full payload
      return {
        ...state,
        activitylogRounds: action.payload.data, // Assuming action.payload.data contains the list of units
      };

    // Handle failure
    case GET_HISTORY_LIST_ROUND_FAIL:
      // console.log("Error received in reducer:", action.payload); // Log the error
      return {
        ...state,
        error: action.payload,
      };

    //////////// 
    
    case GET_RESULT_HISTORY_SUCCESS:
      // console.log("Data received in reducer:", action.payload); // Log the full payload
      return {
        ...state,
        activitylogResults: action.payload.data, // Assuming action.payload.data contains the list of units
      };

    // Handle failure
    case GET_RESULT_HISTORY_FAIL:
      // console.log("Error received in reducer:", action.payload); // Log the error
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default activitylogRounds;
