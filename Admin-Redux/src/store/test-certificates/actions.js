import {
  GET_TEST_CERTIFICATES,
  GET_TEST_CERTIFICATES_FAIL,
  GET_TEST_CERTIFICATES_SUCCESS,
  ADD_NEW_TEST_CERTIFICATE,
  ADD_TEST_CERTIFICATE_SUCCESS,
  ADD_TEST_CERTIFICATE_FAIL,
  UPDATE_TEST_CERTIFICATE,
  UPDATE_TEST_CERTIFICATE_SUCCESS,
  UPDATE_TEST_CERTIFICATE_FAIL,
  DELETE_TEST_CERTIFICATE,
  DELETE_TEST_CERTIFICATE_SUCCESS,
  DELETE_TEST_CERTIFICATE_FAIL,
} from "./actionTypes";

export const getTestCertificates = id => ({
  type: GET_TEST_CERTIFICATES,
  payload: id,
});

export const getTestCertificatesSuccess = testCertificates => ({
  type: GET_TEST_CERTIFICATES_SUCCESS,
  payload: testCertificates,
});

export const getTestCertificatesFail = error => ({
  type: GET_TEST_CERTIFICATES_FAIL,
  payload: error,
});

export const addNewTestCertificate = (testCertificate, id) => ({
  type: ADD_NEW_TEST_CERTIFICATE,
  payload: { testCertificate, id },
});

export const addTestCertificateSuccess = testCertificate => ({
  type: ADD_TEST_CERTIFICATE_SUCCESS,
  payload: testCertificate,
});

export const addTestCertificateFail = error => ({
  type: ADD_TEST_CERTIFICATE_FAIL,
  payload: error,
});

export const updateTestCertificate = testCertificate => ({
  type: UPDATE_TEST_CERTIFICATE,
  payload: testCertificate,
});

export const updateTestCertificateSuccess = testCertificate => ({
  type: UPDATE_TEST_CERTIFICATE_SUCCESS,
  payload: testCertificate,
});

export const updateTestCertificateFail = error => ({
  type: UPDATE_TEST_CERTIFICATE_FAIL,
  payload: error,
});

export const deleteTestCertificate = testCertificate => ({
  type: DELETE_TEST_CERTIFICATE,
  payload: testCertificate,
});

export const deleteTestCertificateSuccess = testCertificate => ({
  type: DELETE_TEST_CERTIFICATE_SUCCESS,
  payload: testCertificate,
});

export const deleteTestCertificateFail = error => ({
  type: DELETE_TEST_CERTIFICATE_FAIL,
  payload: error,
});
