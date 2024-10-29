import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {  GET_RESULT_SUBMIT, GET_REPORT, GET_SERELOGY_RESULT } from "./actionTypes";

import {
  getResultSubmitSuccess,
  getResultSubmitFail,
  getReportSuccess,
  getReportFail,
  getSereologyResultSuccess,
  getSereologyResultFail
} from "./actions";

//Include Both Helper File with needed methods
import {
  getResultSubmit,getReport, getSereologyResult
} from "../../helpers/django_api_helper";

////////////////
function* fetchResultList(object) {
  try {
    const response = yield call(getResultSubmit, object.payload);
    // console.log("SAGA", object.payload)
    yield put(getResultSubmitSuccess(response.data));
  } catch (error) {
    yield put(getResultSubmitFail(error));
  }
}

function* fetchReport(object) {
  try {
    const response = yield call(getReport, object.payload);
    // console.log("SAGAAAA", object.payload)
    // console.log("API Response:", response)
    yield put(getReportSuccess(response.participants_results));
  } catch (error) {
    yield put(getReportFail(error));
  }
}
function* fetchSerologReport(object) {
  try {
    const response = yield call(getSereologyResult, object.payload);
    // console.log("SAGAAAA...", response)
    yield put(getSereologyResultSuccess(response));
  } catch (error) {
    yield put(getSereologyResultFail(error));
  }
}

function* ResultSubmitSaga() {
  yield takeEvery(GET_RESULT_SUBMIT, fetchResultList);
  yield takeEvery(GET_REPORT, fetchReport);
  yield takeEvery(GET_SERELOGY_RESULT, fetchSerologReport);
}

export default ResultSubmitSaga;
