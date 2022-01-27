import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_TEST_CERTIFICATES,
  ADD_NEW_TEST_CERTIFICATE,
  DELETE_TEST_CERTIFICATE,
  UPDATE_TEST_CERTIFICATE,
} from "./actionTypes";

import {
  getTestCertificatesSuccess,
  getTestCertificatesFail,
  addTestCertificateFail,
  addTestCertificateSuccess,
  updateTestCertificateSuccess,
  updateTestCertificateFail,
  deleteTestCertificateSuccess,
  deleteTestCertificateFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getTestCertificates,
  addNewTestCertificate,
  updateTestCertificate,
  deleteTestCertificate,
} from "../../helpers/django_api_helper";

function* fetchTestCertificates(object) {
  try {
    const response = yield call(getTestCertificates, object.payload);
    yield put(getTestCertificatesSuccess(response));
  } catch (error) {
    yield put(getTestCertificatesFail(error));
  }
}

function* onAddNewTestCertificate(object) {
  try {
    const response = yield call(
      addNewTestCertificate,
      object.payload.testCertificate,
      object.payload.id
    );
    yield put(addTestCertificateSuccess(response));
  } catch (error) {
    yield put(addTestCertificateFail(error));
  }
}

function* onUpdateTestCertificate({ payload: testCertificate }) {
  try {
    const response = yield call(updateTestCertificate, testCertificate);
    yield put(updateTestCertificateSuccess(response));
  } catch (error) {
    yield put(updateTestCertificateFail(error));
  }
}

function* onDeleteTestCertificate({ payload: testCertificate }) {
  try {
    const response = yield call(deleteTestCertificate, testCertificate);
    yield put(deleteTestCertificateSuccess(response));
  } catch (error) {
    yield put(deleteTestCertificateFail(error));
  }
}

function* testCertificatesSaga() {
  yield takeEvery(GET_TEST_CERTIFICATES, fetchTestCertificates);
  yield takeEvery(ADD_NEW_TEST_CERTIFICATE, onAddNewTestCertificate);
  yield takeEvery(UPDATE_TEST_CERTIFICATE, onUpdateTestCertificate);
  yield takeEvery(DELETE_TEST_CERTIFICATE, onDeleteTestCertificate);
}

export default testCertificatesSaga;
