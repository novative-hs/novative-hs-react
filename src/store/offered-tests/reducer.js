import {
  GET_UNITS_SUCCESS,
  GET_UNITS_FAIL,
  GET_TESTS_SUCCESS,
  GET_TESTS_FAIL,
  GET_OFFERED_TESTS_SUCCESS,
  GET_OFFERED_TESTS_FAIL,
  GET_OFFEREDTEST_REFERRELFEE_SUCCESS,
  GET_OFFEREDTEST_REFERRELFEE_FAIL,
  ADD_OFFERED_TEST_SUCCESS,
  ADD_OFFERED_TEST_FAIL,
  UPDATE_OFFERED_TEST_SUCCESS,
  UPDATE_OFFERED_TEST_FAIL,
  DELETE_OFFERED_TEST_SUCCESS,
  DELETE_OFFERED_TEST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  units: [],
  tests: [],
  offeredTests: [],
  error: {},
};

const tests = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_UNITS_SUCCESS:
      return {
        ...state,
        units: action.payload.data,
      };

    case GET_UNITS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_TESTS_SUCCESS:
      return {
        ...state,
        tests: action.payload.data,
      };

    case GET_TESTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      case GET_OFFERED_TESTS_SUCCESS:
        return {
          ...state,
          offeredTests: action.payload.data,
        };
  
      case GET_OFFERED_TESTS_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    case GET_OFFEREDTEST_REFERRELFEE_SUCCESS:
      return {
        ...state,
        offeredTests: action.payload.data,
      };

    case GET_OFFEREDTEST_REFERRELFEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_OFFERED_TEST_SUCCESS:
      return {
        ...state,
        offeredTests: [...state.offeredTests, action.payload],
      };

    case ADD_OFFERED_TEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_OFFERED_TEST_SUCCESS:
      return {
        ...state,
        offeredTests: state.offeredTests.map(offeredTest =>
          offeredTest.id.toString() === action.payload.id.toString()
            ? { offeredTest, ...action.payload }
            : offeredTest
        ),
      };

    case UPDATE_OFFERED_TEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_OFFERED_TEST_SUCCESS:
      return {
        ...state,
        offeredTests: state.offeredTests.filter(
          offeredTest =>
            offeredTest.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_OFFERED_TEST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default tests;
