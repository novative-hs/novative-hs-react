import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACTIVITY_LOG_MARKETER,
} from "./actionTypes";

import {
  getActivityLogMarketerSuccess,
  getActivityLogMarketerFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getActivityLogMarketer,
} from "../../helpers/django_api_helper";

function* fetchActivityLogMarketer(object) {
  try {
    const response = yield call(getActivityLogMarketer, object.payload);
    yield put(getActivityLogMarketerSuccess(response));
  } catch (error) {
    yield put(getActivityLogMarketerFail(error));
  }
}

function* activitylogmarketerSaga() {
  yield takeEvery(GET_ACTIVITY_LOG_MARKETER, fetchActivityLogMarketer);
}

export default activitylogmarketerSaga;
