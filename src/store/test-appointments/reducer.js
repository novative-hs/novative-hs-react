import {
  GET_TEST_APPOINTMENTS_PENDING_LIST_SUCCESS,
  GET_TEST_APPOINTMENTS_PENDING_LIST_FAIL,
  GET_TEST_APPOINTMENTS_IN_PROCESS_LIST_SUCCESS,
  GET_TEST_APPOINTMENTS_IN_PROCESS_LIST_FAIL,
  GET_TEST_APPOINTMENTS_COMPLETED_LIST_SUCCESS,
  GET_TEST_APPOINTMENTS_COMPLETED_LIST_FAIL,
  UPDATE_TEST_APPOINTMENT_SUCCESS,
  UPDATE_TEST_APPOINTMENT_FAIL,
  ADD_COLLECTIONPOINT_TESTAPPOINTMENT_SUCCESS,
  ADD_COLLECTIONPOINT_TESTAPPOINTMENT_FAIL,
  GET_LAB_PROFILE_SUCCESS,
  GET_LAB_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  testAppointmentsPendingList: [],
  testAppointmentsInProcessList: [],
  testAppointmentsCompletedList: [],
  error: {},
  labProfiles: [],

};

const testAppointments = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LAB_PROFILE_SUCCESS:
      return {
        ...state,
        labProfiles: action.payload.data,
      };

    case GET_LAB_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_COLLECTIONPOINT_TESTAPPOINTMENT_SUCCESS:
      return {
        ...state,
        testAppointmentsPendingList: [...state.testAppointmentsPendingList, action.payload],
      };

    case ADD_COLLECTIONPOINT_TESTAPPOINTMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_TEST_APPOINTMENTS_PENDING_LIST_SUCCESS:
      return {
        ...state,
        testAppointmentsPendingList: action.payload.data,
      };

    case GET_TEST_APPOINTMENTS_PENDING_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_TEST_APPOINTMENTS_IN_PROCESS_LIST_SUCCESS:
      return {
        ...state,
        testAppointmentsInProcessList: action.payload.data,
      };

    case GET_TEST_APPOINTMENTS_IN_PROCESS_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_TEST_APPOINTMENTS_COMPLETED_LIST_SUCCESS:
      return {
        ...state,
        testAppointmentsCompletedList: action.payload.data,
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
