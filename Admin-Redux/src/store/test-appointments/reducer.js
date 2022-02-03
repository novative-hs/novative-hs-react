import {
  GET_TEST_APPOINTMENTS_SUCCESS,
  GET_TEST_APPOINTMENTS_FAIL,
  UPDATE_TEST_APPOINTMENT_SUCCESS,
  UPDATE_TEST_APPOINTMENT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  testAppointments: [],
  error: {},
};

const testAppointments = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TEST_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        testAppointments: action.payload.data,
      };

    case GET_TEST_APPOINTMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_TEST_APPOINTMENT_SUCCESS:
      return {
        ...state,
        testAppointments: state.testAppointments.map(testAppointment =>
          testAppointment.id.toString() === action.payload.id.toString()
            ? { testAppointment, ...action.payload }
            : testAppointment
        ),
      };

    case UPDATE_TEST_APPOINTMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default testAppointments;
