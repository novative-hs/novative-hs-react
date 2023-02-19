import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACTIVITY_LOG,
} from "./actionTypes";

import {
  getActivityLogSuccess,
  getActivityLogFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getActivityLog,
} from "../../helpers/django_api_helper";

function* fetchActivityLog(object) {
  try {
    const response = yield call(getActivityLog, object.payload);
    yield put(getActivityLogSuccess(response));
  } catch (error) {
    yield put(getActivityLogFail(error));
  }
}

function* activitylogSaga() {
  yield takeEvery(GET_ACTIVITY_LOG, fetchActivityLog);
}

export default activitylogSaga;
