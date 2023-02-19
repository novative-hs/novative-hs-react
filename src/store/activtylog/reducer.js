import {
  GET_ACTIVITY_LOG_SUCCESS,
  GET_ACTIVITY_LOG_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  activitylog: [],
  error: {},
};

const activitylog = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ACTIVITY_LOG_SUCCESS:
      return {
        ...state,
        activitylog: action.payload.data,
      };

    case GET_ACTIVITY_LOG_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default activitylog;
