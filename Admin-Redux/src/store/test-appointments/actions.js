import {
  GET_TEST_APPOINTMENTS,
  GET_TEST_APPOINTMENTS_FAIL,
  GET_TEST_APPOINTMENTS_SUCCESS,
  // ADD_NEW_TEST_APPOINTMENT,
  // ADD_TEST_APPOINTMENT_SUCCESS,
  // ADD_TEST_APPOINTMENT_FAIL,
  UPDATE_TEST_APPOINTMENT,
  UPDATE_TEST_APPOINTMENT_SUCCESS,
  UPDATE_TEST_APPOINTMENT_FAIL,
  // DELETE_TEST_APPOINTMENT,
  // DELETE_TEST_APPOINTMENT_SUCCESS,
  // DELETE_TEST_APPOINTMENT_FAIL,
} from "./actionTypes";

export const getTestAppointments = id => ({
  type: GET_TEST_APPOINTMENTS,
  payload: id,
});

export const getTestAppointmentsSuccess = testAppointments => ({
  type: GET_TEST_APPOINTMENTS_SUCCESS,
  payload: testAppointments,
});

export const getTestAppointmentsFail = error => ({
  type: GET_TEST_APPOINTMENTS_FAIL,
  payload: error,
});

// export const addNewTestAppointment = (testAppointment, id) => ({
//   type: ADD_NEW_TEST_APPOINTMENT,
//   payload: { testAppointment, id },
// });

// export const addTestAppointmentSuccess = testAppointment => ({
//   type: ADD_TEST_APPOINTMENT_SUCCESS,
//   payload: testAppointment,
// });

// export const addTestAppointmentFail = error => ({
//   type: ADD_TEST_APPOINTMENT_FAIL,
//   payload: error,
// });

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

// export const deleteTestAppointment = testAppointment => ({
//   type: DELETE_TEST_APPOINTMENT,
//   payload: testAppointment,
// });

// export const deleteTestAppointmentSuccess = testAppointment => ({
//   type: DELETE_TEST_APPOINTMENT_SUCCESS,
//   payload: testAppointment,
// });

// export const deleteTestAppointmentFail = error => ({
//   type: DELETE_TEST_APPOINTMENT_FAIL,
//   payload: error,
// });
