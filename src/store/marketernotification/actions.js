import {
  GET_ACTIVITY_LOG,
  GET_ACTIVITY_LOG_FAIL,
  GET_ACTIVITY_LOG_SUCCESS,
  GET_MARKETER_NOTIFICATION,
  GET_MARKETER_NOTIFICATION_FAIL,
  GET_MARKETER_NOTIFICATION_SUCCESS,
} from "./actionTypes";

// ----------- Pathologist list APIs actions -----------------
export const getActivityLog = id => ({
  type: GET_ACTIVITY_LOG,
  payload: id,
});

export const getActivityLogSuccess = activitylog => ({
  type: GET_ACTIVITY_LOG_SUCCESS,
  payload: activitylog,
});

export const getActivityLogFail = error => ({
  type: GET_ACTIVITY_LOG_FAIL,
  payload: error,
});

export const getMarketerNotification = (id,previousApiCallTime) => ({
  type: GET_MARKETER_NOTIFICATION,
  payload: {id,previousApiCallTime},
});

export const getMarketerNotificationSuccess = marketerNotification => ({
  type: GET_MARKETER_NOTIFICATION_SUCCESS,
  payload: marketerNotification,
});

export const getMarketerNotificationFail = error => ({
  type: GET_MARKETER_NOTIFICATION_FAIL,
  payload: error,
});


