import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACTIVITY_LOG_FINANCE,
} from "./actionTypes";

import {
  getActivityLogFinanceSuccess,
  getActivityLogFinanceFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getActivityLogFinance,
} from "../../helpers/django_api_helper";

function* fetchActivityLogFinance(object) {
  try {
    const response = yield call(getActivityLogFinance, object.payload);
    yield put(getActivityLogFinanceSuccess(response));
  } catch (error) {
    yield put(getActivityLogFinanceFail(error));
  }
}

function* activitylogfinanceSaga() {
  yield takeEvery(GET_ACTIVITY_LOG_FINANCE, fetchActivityLogFinance);
}

export default activitylogfinanceSaga;
