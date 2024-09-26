import {
  GET_HISTORY_LIST_SUCCESS,
  GET_HISTORY_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  activitylogUnits: [],
  error: {},
};

const activitylogUnits = (state = INIT_STATE, action) => {
  switch (action.type) {
    // Get units history success
    case GET_HISTORY_LIST_SUCCESS:
      console.log("Data received in reducer:", action.payload); // Log the full payload
      return {
        ...state,
        activitylogUnits: action.payload.data, // Assuming action.payload.data contains the list of units
      };

    // Handle failure
    case GET_HISTORY_LIST_FAIL:
      console.log("Error received in reducer:", action.payload); // Log the error
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default activitylogUnits;
