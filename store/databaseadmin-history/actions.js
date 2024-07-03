import {
    GET_HISTORY_LIST,
    GET_HISTORY_LIST_SUCCESS,
    GET_HISTORY_LIST_FAIL,
  } from "./actionTypes";
  
  // ----------- Units History list APIs actions -----------------
  export const getActivityLogUnits = id => {
    console.log("ID passed to getActivityLogUnits:", id); // Add this line
    return {
      type: GET_HISTORY_LIST,
      payload: id,
    };
  };
  
  export const getActivityLogUnitsSuccess = activitylogUnits => {
   
    return {
      type: GET_HISTORY_LIST_SUCCESS,
      payload: activitylogUnits,
    };
  };
  
  export const getActivityLogUnitsFail = error => ({
    type: GET_HISTORY_LIST_FAIL,
    payload: error,
  });
  