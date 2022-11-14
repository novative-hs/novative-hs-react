import {
  GET_QUALITY_CERTIFICATES,
  GET_QUALITY_CERTIFICATES_FAIL,
  GET_QUALITY_CERTIFICATES_SUCCESS,
  ADD_NEW_QUALITY_CERTIFICATE,
  ADD_QUALITY_CERTIFICATE_SUCCESS,
  ADD_QUALITY_CERTIFICATE_FAIL,
  UPDATE_QUALITY_CERTIFICATE,
  UPDATE_QUALITY_CERTIFICATE_SUCCESS,
  UPDATE_QUALITY_CERTIFICATE_FAIL,
  DELETE_QUALITY_CERTIFICATE,
  DELETE_QUALITY_CERTIFICATE_SUCCESS,
  DELETE_QUALITY_CERTIFICATE_FAIL,
} from "./actionTypes";

export const getQualityCertificates = id => ({
  type: GET_QUALITY_CERTIFICATES,
  payload: id,
});

export const getQualityCertificatesSuccess = qualityCertificates => ({
  type: GET_QUALITY_CERTIFICATES_SUCCESS,
  payload: qualityCertificates,
});

export const getQualityCertificatesFail = error => ({
  type: GET_QUALITY_CERTIFICATES_FAIL,
  payload: error,
});

export const addNewQualityCertificate = (qualityCertificate, id) => ({
  type: ADD_NEW_QUALITY_CERTIFICATE,
  payload: { qualityCertificate, id },
});

export const addQualityCertificateSuccess = qualityCertificate => ({
  type: ADD_QUALITY_CERTIFICATE_SUCCESS,
  payload: qualityCertificate,
});

export const addQualityCertificateFail = error => ({
  type: ADD_QUALITY_CERTIFICATE_FAIL,
  payload: error,
});

export const updateQualityCertificate = qualityCertificate => ({
  type: UPDATE_QUALITY_CERTIFICATE,
  payload: qualityCertificate,
});

export const updateQualityCertificateSuccess = qualityCertificate => ({
  type: UPDATE_QUALITY_CERTIFICATE_SUCCESS,
  payload: qualityCertificate,
});

export const updateQualityCertificateFail = error => ({
  type: UPDATE_QUALITY_CERTIFICATE_FAIL,
  payload: error,
});

export const deleteQualityCertificate = qualityCertificate => ({
  type: DELETE_QUALITY_CERTIFICATE,
  payload: qualityCertificate,
});

export const deleteQualityCertificateSuccess = qualityCertificate => ({
  type: DELETE_QUALITY_CERTIFICATE_SUCCESS,
  payload: qualityCertificate,
});

export const deleteQualityCertificateFail = error => ({
  type: DELETE_QUALITY_CERTIFICATE_FAIL,
  payload: error,
});
