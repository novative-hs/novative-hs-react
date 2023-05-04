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
  ADD_NEW_COLLECTIONPOINT_TESTAPPOINTMENT,
  ADD_COLLECTIONPOINT_TESTAPPOINTMENT_SUCCESS,
  ADD_COLLECTIONPOINT_TESTAPPOINTMENT_FAIL,
  GET_LAB_PROFILE,
  GET_LAB_PROFILE_FAIL,
  GET_LAB_PROFILE_SUCCESS,
} from "./actionTypes";

export const getLabProfile = id => ({
  type: GET_LAB_PROFILE,
  payload: id,
});

export const getLabProfileSuccess = labProfiles => (
  console.log("actions lab profile",labProfiles),
  {
  type: GET_LAB_PROFILE_SUCCESS,
  payload: labProfiles,
});

export const getLabProfileFail = error => ({
  type: GET_LAB_PROFILE_FAIL,
  payload: error,
});

export const addNewCollectionPointTestAppointment = (testAppointment, id) => ({
  type: ADD_NEW_COLLECTIONPOINT_TESTAPPOINTMENT,
  payload: { testAppointment, id },
});

export const addCollectionPointTestAppointmentSuccess = testAppointment => ({
  type: ADD_COLLECTIONPOINT_TESTAPPOINTMENT_SUCCESS,
  payload: testAppointment,
});

export const addCollectionPointTestAppointmentFail = error => ({
  type: ADD_COLLECTIONPOINT_TESTAPPOINTMENT_FAIL,
  payload: error,
});

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
