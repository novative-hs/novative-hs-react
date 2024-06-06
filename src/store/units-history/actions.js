import {
    GET_HISTORY_LIST,
    GET_HISTORY_LIST_SUCCESS,
    GET_HISTORY_LIST_FAIL,
  } from "./actionTypes";
  
  // ----------- Units History list APIs actions -----------------
  export const getActivityLogUnits = (id, type) => {
    console.log("ID and Type passed to getActivityLogUnits:", id, type);
    return {
      type: GET_HISTORY_LIST,
      payload: { id, type },
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
  