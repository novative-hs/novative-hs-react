import {
  GET_PATIENT_TEST_APPOINTMENTS_COMPLETED_LIST_SUCCESS,
  GET_PATIENT_TEST_APPOINTMENTS_COMPLETED_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  patientTestAppointmentsCompletedList: [],
  error: {},
};

const patientTestAppointments = (state = INIT_STATE, action) => {
  switch (action.type) {
    
    case GET_PATIENT_TEST_APPOINTMENTS_COMPLETED_LIST_SUCCESS:
      return {
        ...state,
        patientTestAppointmentsCompletedList: action.payload.data,
      };

    case GET_PATIENT_TEST_APPOINTMENTS_COMPLETED_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default patientTestAppointments;
