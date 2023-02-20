import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_TESTS_LIST } from "./actionTypes";

import {
  getTestsListSuccess,
  getTestsListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getTestsList } from "../../helpers/django_api_helper";

function* fetchTestsList(object) {
  try {
    const response = yield call(getTestsList, object.payload);
    yield put(getTestsListSuccess(response));
  } catch (error) {
    yield put(getTestsListFail(error));
  }
}

function* TestsSaga() {
  yield takeEvery(
    GET_TESTS_LIST,
    fetchTestsList
  );
}

export default TestsSaga;
