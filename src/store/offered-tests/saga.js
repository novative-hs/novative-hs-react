import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_UNITS,
  GET_TESTS,
  GET_OFFERED_TESTS,
  GET_LAB_PROFILE,
  GET_OFFEREDTEST_REFERRELFEE,
  ADD_NEW_OFFERED_TEST,
  ADD_NEW_OFFERED_MAINTEST,
  DELETE_OFFERED_TEST,
  UPDATE_OFFERED_TEST,
} from "./actionTypes";

import {
  getLabProfileSuccess,
  getLabProfileFail,
  getUnitsSuccess,
  getUnitsFail,
  getTestsSuccess,
  getTestsFail,
  getOfferedTestsSuccess,
  getOfferedTestsFail,
  getOfferedTestsReferrelSuccess,
  getOfferedTestsReferrelFail,
  addOfferedTestFail,
  addOfferedTestSuccess,
  addOfferedMainTestFail,
  addOfferedMainTestSuccess,
  updateOfferedTestSuccess,
  updateOfferedTestFail,
  deleteOfferedTestSuccess,
  deleteOfferedTestFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getUnits,
  getTests,
  getOfferedTests,
  getOfferedTestsReferrel,
  getLabProfile,
  addNewOfferedTest,
  addNewOfferedMainTest,
  updateOfferedTest,
  deleteOfferedTest,
} from "../../helpers/django_api_helper";

function* fetchLabProfile(object) {
  try {
    const response = yield call(getLabProfile, object.payload);
    yield put(getLabProfileSuccess(response));

  } catch (error) {
    yield put(getLabProfileFail(error));
  }
}

function* fetchTests() {
  try {
    const response = yield call(getTests);
    yield put(getTestsSuccess(response));
  } catch (error) {
    yield put(getTestsFail(error));
  }
}

function* fetchUnits() {
  try {
    const response = yield call(getUnits);
    yield put(getUnitsSuccess(response));
  } catch (error) {
    yield put(getUnitsFail(error));
  }
}

function* fetchOfferedTests(object) {
  try {
    const response = yield call(getOfferedTests, object.payload);
    yield put(getOfferedTestsSuccess(response));
  } catch (error) {
    yield put(getOfferedTestsFail(error));
  }
}
function* fetchOfferedTestsReferrel(object) {
  try {
    const response = yield call(getOfferedTestsReferrel, object.payload);
    yield put(getOfferedTestsReferrelSuccess(response));
  } catch (error) {
    yield put(getOfferedTestsReferrelFail(error));
  }
}

function* onAddNewOfferedTest(object) {
  try {
    const response = yield call(
      addNewOfferedTest,
      object.payload.offeredTest,
      object.payload.id
    );
    yield put(addOfferedTestSuccess(response));
  } catch (error) {
    yield put(addOfferedTestFail(error));
  }
}
function* onAddNewOfferedMainTest(object) {
  try {
    const response = yield call(
      addNewOfferedMainTest,
      object.payload.offeredTest,
      object.payload.id
    );
    yield put(addOfferedMainTestSuccess(response));
  } catch (error) {
    yield put(addOfferedMainTestFail(error));
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
  yield takeEvery(GET_UNITS, fetchUnits);
  yield takeEvery(GET_TESTS, fetchTests);
  yield takeEvery(GET_OFFERED_TESTS, fetchOfferedTests);
  yield takeEvery(GET_LAB_PROFILE, fetchLabProfile);
  yield takeEvery(GET_OFFEREDTEST_REFERRELFEE, fetchOfferedTestsReferrel);
  yield takeEvery(ADD_NEW_OFFERED_TEST, onAddNewOfferedTest);
  yield takeEvery(ADD_NEW_OFFERED_MAINTEST, onAddNewOfferedMainTest);
  yield takeEvery(UPDATE_OFFERED_TEST, onUpdateOfferedTest);
  yield takeEvery(DELETE_OFFERED_TEST, onDeleteOfferedTest);
}

export default offeredTestsSaga;
