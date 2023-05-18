import {
  GET_ACTIVITY_LOG_FINANCE,
  GET_ACTIVITY_LOG_FINANCE_FAIL,
  GET_ACTIVITY_LOG_FINANCE_SUCCESS,
} from "./actionTypes";

// ----------- Pathologist list APIs actions -----------------
export const getActivityLogFinance = id => ({
  type: GET_ACTIVITY_LOG_FINANCE,
  payload: id,
});

export const getActivityLogFinanceSuccess = activitylogfinance => ({
  type: GET_ACTIVITY_LOG_FINANCE_SUCCESS,
  payload: activitylogfinance,
});

export const getActivityLogFinanceFail = error => ({
  type: GET_ACTIVITY_LOG_FINANCE_FAIL,
  payload: error,
});



