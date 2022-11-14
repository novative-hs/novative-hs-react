import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_QUALITY_CERTIFICATES,
  ADD_NEW_QUALITY_CERTIFICATE,
  DELETE_QUALITY_CERTIFICATE,
  UPDATE_QUALITY_CERTIFICATE,
} from "./actionTypes";

import {
  getQualityCertificatesSuccess,
  getQualityCertificatesFail,
  addQualityCertificateFail,
  addQualityCertificateSuccess,
  updateQualityCertificateSuccess,
  updateQualityCertificateFail,
  deleteQualityCertificateSuccess,
  deleteQualityCertificateFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getQualityCertificates,
  addNewQualityCertificate,
  updateQualityCertificate,
  deleteQualityCertificate,
} from "../../helpers/django_api_helper";

function* fetchQualityCertificates(object) {
  try {
    const response = yield call(getQualityCertificates, object.payload);
    yield put(getQualityCertificatesSuccess(response));
  } catch (error) {
    yield put(getQualityCertificatesFail(error));
  }
}

function* onAddNewQualityCertificate(object) {
  try {
    const response = yield call(
      addNewQualityCertificate,
      object.payload.qualityCertificate,
      object.payload.id
    );
    yield put(addQualityCertificateSuccess(response));
  } catch (error) {
    yield put(addQualityCertificateFail(error));
  }
}

function* onUpdateQualityCertificate({ payload: qualityCertificate }) {
  try {
    const response = yield call(updateQualityCertificate, qualityCertificate);
    yield put(updateQualityCertificateSuccess(response));
  } catch (error) {
    yield put(updateQualityCertificateFail(error));
  }
}

function* onDeleteQualityCertificate({ payload: qualityCertificate }) {
  try {
    const response = yield call(deleteQualityCertificate, qualityCertificate);
    yield put(deleteQualityCertificateSuccess(response));
  } catch (error) {
    yield put(deleteQualityCertificateFail(error));
  }
}

function* qualityCertificatesSaga() {
  yield takeEvery(GET_QUALITY_CERTIFICATES, fetchQualityCertificates);
  yield takeEvery(ADD_NEW_QUALITY_CERTIFICATE, onAddNewQualityCertificate);
  yield takeEvery(UPDATE_QUALITY_CERTIFICATE, onUpdateQualityCertificate);
  yield takeEvery(DELETE_QUALITY_CERTIFICATE, onDeleteQualityCertificate);
}

export default qualityCertificatesSaga;
