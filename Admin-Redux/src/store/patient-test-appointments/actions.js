import {
  GET_PATIENT_TEST_APPOINTMENTS_COMPLETED_LIST,
  GET_PATIENT_TEST_APPOINTMENTS_COMPLETED_LIST_SUCCESS,
  GET_PATIENT_TEST_APPOINTMENTS_COMPLETED_LIST_FAIL,
} from "./actionTypes";


export const getPatientTestAppointmentsCompletedList = id => ({
  type: GET_PATIENT_TEST_APPOINTMENTS_COMPLETED_LIST,
  payload: id,
});

export const getPatientTestAppointmentsCompletedListSuccess = patientTestAppointments => ({
  type: GET_PATIENT_TEST_APPOINTMENTS_COMPLETED_LIST_SUCCESS,
  payload: patientTestAppointments,
});

export const getPatientTestAppointmentsCompletedListFail = error => ({
  type: GET_PATIENT_TEST_APPOINTMENTS_COMPLETED_LIST_FAIL,
  payload: error,
});

