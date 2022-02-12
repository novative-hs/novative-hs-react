import {
  GET_TEST_APPOINTMENTS_PENDING_LIST_SUCCESS,
  GET_TEST_APPOINTMENTS_PENDING_LIST_FAIL,
  GET_TEST_APPOINTMENTS_IN_PROCESS_LIST_SUCCESS,
  GET_TEST_APPOINTMENTS_IN_PROCESS_LIST_FAIL,
  GET_TEST_APPOINTMENTS_COMPLETED_LIST_SUCCESS,
  GET_TEST_APPOINTMENTS_COMPLETED_LIST_FAIL,
  UPDATE_TEST_APPOINTMENT_SUCCESS,
  UPDATE_TEST_APPOINTMENT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  testAppointments: [],
  error: {},
};

const testAppointments = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TEST_APPOINTMENTS_PENDING_LIST_SUCCESS:
      return {
        ...state,
        testAppointments: action.payload.data,
      };

    case GET_TEST_APPOINTMENTS_PENDING_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_TEST_APPOINTMENTS_IN_PROCESS_LIST_SUCCESS:
      return {
        ...state,
        testAppointments: action.payload.data,
      };

    case GET_TEST_APPOINTMENTS_IN_PROCESS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_TEST_APPOINTMENTS_COMPLETED_LIST_SUCCESS:
      return {
        ...state,
        testAppointments: action.payload.data,
      };

    case GET_TEST_APPOINTMENTS_COMPLETED_LIST_FAIL:
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
