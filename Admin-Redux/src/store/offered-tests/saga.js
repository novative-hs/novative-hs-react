import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_TESTS,
  GET_OFFERED_TESTS,
  GET_OFFERED_TEST_PROFILE,
  ADD_NEW_OFFERED_TEST,
  DELETE_OFFERED_TEST,
  UPDATE_OFFERED_TEST,
} from "./actionTypes";

import {
  getTestsSuccess,
  getTestsFail,
  getOfferedTestsSuccess,
  getOfferedTestsFail,
  getOfferedTestProfileSuccess,
  getOfferedTestProfileFail,
  addOfferedTestFail,
  addOfferedTestSuccess,
  updateOfferedTestSuccess,
  updateOfferedTestFail,
  deleteOfferedTestSuccess,
  deleteOfferedTestFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getTests,
  getOfferedTests,
  getOfferedTestProfile,
  addNewOfferedTest,
  updateOfferedTest,
  deleteOfferedTest,
} from "../../helpers/django_api_helper";

function* fetchOfferedTests(object) {
  try {
    const response = yield call(getOfferedTests, object.payload);
    yield put(getOfferedTestsSuccess(response));
  } catch (error) {
    yield put(getOfferedTestsFail(error));
  }
}

function* fetchTests() {
  try {
    const response = yield call(getTests);
    console.log("Response: ", response);
    yield put(getTestsSuccess(response));
  } catch (error) {
    yield put(getTestsFail(error));
  }
}

function* fetchOfferedTestProfile() {
  try {
    const response = yield call(getOfferedTestProfile);
    yield put(getOfferedTestProfileSuccess(response));
  } catch (error) {
    yield put(getOfferedTestProfileFail(error));
  }
}

function* onAddNewOfferedTest({ payload: offeredTest }) {
  try {
    const response = yield call(addNewOfferedTest, offeredTest);
    yield put(addOfferedTestSuccess(response));
  } catch (error) {
    yield put(addOfferedTestFail(error));
  }
}

function* onUpdateOfferedTest({ payload: offeredTest }) {
  try {
    const response = yield call(updateOfferedTest, offeredTest);
    yield put(updateOfferedTestSuccess(response));
  } catch (error) {
    yield put(updateOfferedTestFail(error));
  }
}

function* onDeleteOfferedTest({ payload: offeredTest }) {
  try {
    const response = yield call(deleteOfferedTest, offeredTest);
    yield put(deleteOfferedTestSuccess(response));
  } catch (error) {
    yield put(deleteOfferedTestFail(error));
  }
}

function* offeredTestsSaga() {
  yield takeEvery(GET_TESTS, fetchTests);
  yield takeEvery(GET_OFFERED_TESTS, fetchOfferedTests);
  yield takeEvery(GET_OFFERED_TEST_PROFILE, fetchOfferedTestProfile);
  yield takeEvery(ADD_NEW_OFFERED_TEST, onAddNewOfferedTest);
  yield takeEvery(UPDATE_OFFERED_TEST, onUpdateOfferedTest);
  yield takeEvery(DELETE_OFFERED_TEST, onDeleteOfferedTest);
}

export default offeredTestsSaga;
