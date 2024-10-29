import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { SCHEMES_ANALYTES, POST_RESULT, GET_RESULT, GET_STATISTICS,POST_SERELOGY_VALUES,GET_SERELOGY_VALUES } from "./actionTypes";

import {
  getSchemeAnalytesListSuccess,
  getSchemeAnalytesListFail,
  postResultSuccess,
  postResultFail,
  getResultsListSuccess,
  getResultsListFail,
  getStatisticsListSuccess,
  getStatisticsListFail,
  postValuesSuccess,
  postValuesFail,
  getResultValuesSuccess,
  getResultValuesFail
} from "./actions";

//Include Both Helper File with needed methods
import {
  getSchemeAnalytesList,
  postResult,
  getResultsList,
  getStatisticsList,
  addSereologyValues,
  getSereologyValues
} from "../../helpers/django_api_helper";

function* fetchAnalytesScheme(object) {
  try {
    const response = yield call(getSchemeAnalytesList, object.payload);
    // console.log("ResponseSaga :", response.data);
    yield put(getSchemeAnalytesListSuccess(response.data));
  } catch (error) {
    yield put(getSchemeAnalytesListFail(error));
  }
}

// POST RESULT
function* onPostResult(object) {
  try {
    const response = yield call(
      postResult,
      object.payload.result,
      object.payload.id
    );
    yield put(postResultSuccess(response));
  } catch (error) {
    yield put(postResultFail(error));
  }
}
/////////////////////////
function* onPostValues(object) {
  try {
    const response = yield call(
      addSereologyValues,
      object.payload.result,
      object.payload.id
    );
    yield put(postValuesSuccess(response));
  } catch (error) {
    yield put(postValuesFail(error));
  }
}
////////////////
function* fetchResultList(object) {
  try {
    const response = yield call(getResultsList, object.payload);

    yield put(getResultsListSuccess(response.data));
  } catch (error) {
    yield put(getResultsListFail(error));
  }
}
////////////////
function* fetchValuesList(action) {
  try {
    const { id, round_id } = action.payload; // Extract values from the action payload
    const response = yield call(getSereologyValues, id, round_id);

    yield put(getResultValuesSuccess(response.data)); // Dispatch success action with the data
  } catch (error) {
    // Dispatch failure action with the error
    yield put(getResultValuesFail(error));
  }
}

////////////////
function* fetchStatisticsList(object) {
  try {
    const response = yield call(getStatisticsList, object.payload);

    yield put(getStatisticsListSuccess(response.data));
  } catch (error) {
    yield put(getStatisticsListFail(error));
  }
}

function* AnalyteSchemeSaga() {
  yield takeEvery(SCHEMES_ANALYTES, fetchAnalytesScheme);
  yield takeEvery(POST_RESULT, onPostResult);
  yield takeEvery(POST_SERELOGY_VALUES, onPostValues);
  yield takeEvery(GET_RESULT, fetchResultList);
  yield takeEvery(GET_SERELOGY_VALUES, fetchValuesList);
  yield takeEvery(GET_STATISTICS, fetchStatisticsList);
}

export default AnalyteSchemeSaga;
