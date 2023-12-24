import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_UNITS,
  GET_TESTS,
  GET_OFFERED_TESTS,
  GET_CORPORATE_TESTS,
  GET_LAB_PROFILE,
  GET_OFFEREDTEST_REFERRELFEE,
  GET_OFFEREDPROFILE_REFERRELFEE,
  GET_OFFEREDPACKAGE_REFERRELFEE,
  GET_OFFEREDRADIOLOGY_REFERRELFEE,
  ADD_NEW_OFFERED_TEST,
  ADD_NEW_CORPORATE_TEST,
  ADD_NEW_OFFERED_MAINTEST,
  DELETE_OFFERED_TEST,
  UPDATE_OFFERED_TEST,
  UPDATE_CORPORATE_TEST,
  UPDATE_CORPORATE_STATUS,


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
  getCorporateTestsSuccess,
  getCorporateTestsFail,
  getOfferedTestsReferrelSuccess,
  getOfferedTestsReferrelFail,
  getOfferedProfilesReferrelSuccess,
  getOfferedProfilesReferrelFail,
  getOfferedPackagesReferrelSuccess,
  getOfferedPackagesReferrelFail,
  getOfferedRadiologysReferrelSuccess,
  getOfferedRadiologysReferrelFail,
  addOfferedTestFail,
  addOfferedTestSuccess,
  addCorporateTestFail,
  addCorporateTestSuccess,
  addOfferedMainTestFail,
  addOfferedMainTestSuccess,
  updateOfferedTestSuccess,
  updateOfferedTestFail,
  updateCorporateTestSuccess,
  updateCorporateTestFail,
  updateCorporateStatusSuccess,
  updateCorporateStatusFail,
  deleteOfferedTestSuccess,
  deleteOfferedTestFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getUnits,
  getTests,
  getOfferedTests,
  getCorporateTests,
  getOfferedTestsReferrel,
  getOfferedProfilesReferrel,
  getOfferedPackagesReferrel,
  getOfferedRadiologysReferrel,
  getLabProfile,
  addNewOfferedTest,
  addNewCorporateTest,
  addNewOfferedMainTest,
  updateOfferedTest,
  updateCorporateTest,
  updateCorporateStatus,
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
function* fetchCorporateTests(object) {
  try {
    const response = yield call(getCorporateTests, object.payload);
    yield put(getCorporateTestsSuccess(response));
  } catch (error) {
    yield put(getCorporateTestsFail(error));
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
function* fetchOfferedProfilesReferrel(object) {
  try {
    const response = yield call(getOfferedProfilesReferrel, object.payload);
    yield put(getOfferedProfilesReferrelSuccess(response));
  } catch (error) {
    yield put(getOfferedProfilesReferrelFail(error));
  }
}
function* fetchOfferedPackagesReferrel(object) {
  try {
    const response = yield call(getOfferedPackagesReferrel, object.payload);
    yield put(getOfferedPackagesReferrelSuccess(response));
  } catch (error) {
    yield put(getOfferedPackagesReferrelFail(error));
  }
}
function* fetchOfferedRadiologysReferrel(object) {
  try {
    const response = yield call(getOfferedRadiologysReferrel, object.payload);
    yield put(getOfferedRadiologysReferrelSuccess(response));
  } catch (error) {
    yield put(getOfferedRadiologysReferrelFail(error));
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
function* onAddNewCorporateTest(object) {
  try {
    const response = yield call(
      addNewCorporateTest,
      object.payload.offeredTest,
      object.payload.id
    );
    yield put(addCorporateTestSuccess(response));
  } catch (error) {
    yield put(addCorporateTestFail(error));
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
function* onUpdateCorporateTest({ payload: offeredTest }) {
  try {
    const response = yield call(updateCorporateTest, offeredTest);
    yield put(updateCorporateTestSuccess(response));
  } catch (error) {
    yield put(updateCorporateTestFail(error));
  }
}
function* onUpdateCorporateStatus({ payload: offeredTest }) {
  try {
    const response = yield call(updateCorporateStatus, offeredTest);
    yield put(updateCorporateStatusSuccess(response));
  } catch (error) {
    yield put(updateCorporateStatusFail(error));
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
  yield takeEvery(GET_CORPORATE_TESTS, fetchCorporateTests);
  yield takeEvery(GET_LAB_PROFILE, fetchLabProfile);
  yield takeEvery(GET_OFFEREDTEST_REFERRELFEE, fetchOfferedTestsReferrel);
  yield takeEvery(GET_OFFEREDPROFILE_REFERRELFEE, fetchOfferedProfilesReferrel);
  yield takeEvery(GET_OFFEREDPACKAGE_REFERRELFEE, fetchOfferedPackagesReferrel);
  yield takeEvery(GET_OFFEREDRADIOLOGY_REFERRELFEE, fetchOfferedRadiologysReferrel);
  yield takeEvery(ADD_NEW_OFFERED_TEST, onAddNewOfferedTest);
  yield takeEvery(ADD_NEW_CORPORATE_TEST, onAddNewCorporateTest);
  yield takeEvery(ADD_NEW_OFFERED_MAINTEST, onAddNewOfferedMainTest);
  yield takeEvery(UPDATE_OFFERED_TEST, onUpdateOfferedTest);
  yield takeEvery(UPDATE_CORPORATE_TEST, onUpdateCorporateTest);
  yield takeEvery(UPDATE_CORPORATE_STATUS, onUpdateCorporateStatus);
  yield takeEvery(DELETE_OFFERED_TEST, onDeleteOfferedTest);
}

export default offeredTestsSaga;
