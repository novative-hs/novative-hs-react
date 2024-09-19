import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { SCHEMES_ANALYTES, POST_RESULT, GET_RESULT } from "./actionTypes";

import {
  getSchemeAnalytesListSuccess,
  getSchemeAnalytesListFail,
  postResultSuccess,
  postResultFail,
  getResultsListSuccess,
  getResultsListFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getSchemeAnalytesList,
  postResult,
  getResultsList,
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
////////////////
function* fetchResultList(object) {
  try {
    const response = yield call(getResultsList, object.payload);

    yield put(getResultsListSuccess(response.data));
  } catch (error) {
    yield put(getResultsListFail(error));
  }
}

function* AnalyteSchemeSaga() {
  yield takeEvery(SCHEMES_ANALYTES, fetchAnalytesScheme);
  yield takeEvery(POST_RESULT, onPostResult);
  yield takeEvery(GET_RESULT, fetchResultList);
}

export default AnalyteSchemeSaga;
