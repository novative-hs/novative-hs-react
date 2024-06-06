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
    case GET_HISTORY_LIST_SUCCESS:
      console.log("Data received in reducer:", action.payload.data); // Add this line
      return {
        ...state,
        activitylogUnits: action.payload.data,
      };

    case GET_HISTORY_LIST_FAIL:
      console.log("Error received in reducer:", action.payload); // Add this line
      return {
        ...state,
        error: action.payload,
      };
      
    default:
      return state;
  }
};

export default activitylogUnits;
