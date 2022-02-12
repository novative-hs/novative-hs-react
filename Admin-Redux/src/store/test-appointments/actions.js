import {
  GET_TEST_APPOINTMENTS_PENDING_LIST,
  GET_TEST_APPOINTMENTS_PENDING_LIST_SUCCESS,
  GET_TEST_APPOINTMENTS_PENDING_LIST_FAIL,
  GET_TEST_APPOINTMENTS_IN_PROCESS_LIST,
  GET_TEST_APPOINTMENTS_IN_PROCESS_LIST_SUCCESS,
  GET_TEST_APPOINTMENTS_IN_PROCESS_LIST_FAIL,
  GET_TEST_APPOINTMENTS_COMPLETED_LIST,
  GET_TEST_APPOINTMENTS_COMPLETED_LIST_SUCCESS,
  GET_TEST_APPOINTMENTS_COMPLETED_LIST_FAIL,
  UPDATE_TEST_APPOINTMENT,
  UPDATE_TEST_APPOINTMENT_SUCCESS,
  UPDATE_TEST_APPOINTMENT_FAIL,
} from "./actionTypes";

export const getTestAppointmentsPendingList = id => ({
  type: GET_TEST_APPOINTMENTS_PENDING_LIST,
  payload: id,
});

export const getTestAppointmentsPendingListSuccess = testAppointments => ({
  type: GET_TEST_APPOINTMENTS_PENDING_LIST_SUCCESS,
  payload: testAppointments,
});

export const getTestAppointmentsPendingListFail = error => ({
  type: GET_TEST_APPOINTMENTS_PENDING_LIST_FAIL,
  payload: error,
});

export const getTestAppointmentsInProcessList = id => ({
  type: GET_TEST_APPOINTMENTS_IN_PROCESS_LIST,
  payload: id,
});

export const getTestAppointmentsInProcessListSuccess = testAppointmentsInProcessList => ({
  type: GET_TEST_APPOINTMENTS_IN_PROCESS_LIST_SUCCESS,
  payload: testAppointmentsInProcessList,
});

export const getTestAppointmentsInProcessListFail = error => ({
  type: GET_TEST_APPOINTMENTS_IN_PROCESS_LIST_FAIL,
  payload: error,
});

export const getTestAppointmentsCompletedList = id => ({
  type: GET_TEST_APPOINTMENTS_COMPLETED_LIST,
  payload: id,
});

export const getTestAppointmentsCompletedListSuccess = testAppointments => ({
  type: GET_TEST_APPOINTMENTS_COMPLETED_LIST_SUCCESS,
  payload: testAppointments,
});

export const getTestAppointmentsCompletedListFail = error => ({
  type: GET_TEST_APPOINTMENTS_COMPLETED_LIST_FAIL,
  payload: error,
});

export const updateTestAppointment = testAppointment => ({
  type: UPDATE_TEST_APPOINTMENT,
  payload: testAppointment,
});

export const updateTestAppointmentSuccess = testAppointment => ({
  type: UPDATE_TEST_APPOINTMENT_SUCCESS,
  payload: testAppointment,
});

export const updateTestAppointmentFail = error => ({
  type: UPDATE_TEST_APPOINTMENT_FAIL,
  payload: error,
});
