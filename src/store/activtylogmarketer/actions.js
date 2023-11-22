import {
  GET_ACTIVITY_LOG_MARKETER,
  GET_ACTIVITY_LOG_MARKETER_FAIL,
  GET_ACTIVITY_LOG_MARKETER_SUCCESS,
} from "./actionTypes";

// ----------- Pathologist list APIs actions -----------------
export const getActivityLogMarketer = id => ({
  type: GET_ACTIVITY_LOG_MARKETER,
  payload: id,
});

export const getActivityLogMarketerSuccess = activitylogmarketer => ({
  type: GET_ACTIVITY_LOG_MARKETER_SUCCESS,
  payload: activitylogmarketer,
});

export const getActivityLogMarketerFail = error => ({
  type: GET_ACTIVITY_LOG_MARKETER_FAIL,
  payload: error,
});



