import {
  GET_HISTORY_LIST_ROUND,
  GET_HISTORY_LIST_ROUND_SUCCESS,
  GET_HISTORY_LIST_ROUND_FAIL,

  GET_RESULT_HISTORY,
  GET_RESULT_HISTORY_SUCCESS,
  GET_RESULT_HISTORY_FAIL,
} from "./actionTypes";

// ----------- Units History list APIs actions -----------------
export const getActivityLogRounds = (id) => {
  // console.log("ID passed to getActivityLogRounds:", id); // Log both id and type
  return {
    type: GET_HISTORY_LIST_ROUND,
    payload: {id}, // Pass both id and type as payload
  };
};

export const getActivityLogRoundsSuccess = activitylogRounds => {
  return {
    type: GET_HISTORY_LIST_ROUND_SUCCESS,
    payload: activitylogRounds,
  };
};

export const getActivityLogRoundsFail = error => ({
  type: GET_HISTORY_LIST_ROUND_FAIL,
  payload: error,
});

////////////////////////////
export const getResultHistory = (id, participantId, scheme_id) => {
  // console.log("getResultHistory Actions:", id, participantId, scheme_id); // Log both id and type
  return {
    type: GET_RESULT_HISTORY,
    payload: { id, participantId, scheme_id}, // Pass both id and type as payload
  };
};

export const getResultHistorySuccess = activitylogUnits => {
  return {
    type: GET_RESULT_HISTORY_SUCCESS,
    payload: activitylogUnits,
  };
};

export const getResultHistoryFail = error => ({
  type: GET_RESULT_HISTORY_FAIL,
  payload: error,
});