import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_RESULT_SUBMIT,
  GET_REPORT,
  GET_SERELOGY_RESULT,
} from "./actionTypes";

import {
  getResultSubmitSuccess,
  getResultSubmitFail,
  getReportSuccess,
  getReportFail,
  getSereologyResultSuccess,
  getSereologyResultFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getResultSubmit,
  getReport,
  getSereologyResult,
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
function* fetchReport(action) {
  try {
    // destructure both values
    const { roundId, participantId } = action.payload;

    // pass both to API helper
    const response = yield call(getReport, roundId, participantId);

    console.log("API Response:", response);

    if (response && response.participants_results) {
      const reportData = {
        participants_results: response.participants_results,
        analyte_result_summary: response.analyte_result_summary,
        round_name: response.round_name,
        scheme_name: response.scheme_name,
        issue_date: response.issue_date,
        closing_date: response.closing_date,
        cycle_no: response.cycle_no,
        sample: response.sample,
        matrix: response.matrix || "N/A",
        robust_mean: response.robust_mean,
      };

      console.log("Prepared report data:", reportData);
      yield put(getReportSuccess(reportData));
    } else {
      yield put(getReportFail("No participants data"));
    }
  } catch (error) {
    console.error("Error fetching report:", error);
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
