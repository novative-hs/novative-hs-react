import {
  GET_TEST_CERTIFICATES_SUCCESS,
  GET_TEST_CERTIFICATES_FAIL,
  ADD_TEST_CERTIFICATE_SUCCESS,
  ADD_TEST_CERTIFICATE_FAIL,
  UPDATE_TEST_CERTIFICATE_SUCCESS,
  UPDATE_TEST_CERTIFICATE_FAIL,
  DELETE_TEST_CERTIFICATE_SUCCESS,
  DELETE_TEST_CERTIFICATE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  testCertificates: [],
  error: {},
};

const testCertificates = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_TEST_CERTIFICATES_SUCCESS:
      return {
        ...state,
        testCertificates: action.payload.data,
      };

    case GET_TEST_CERTIFICATES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_TEST_CERTIFICATE_SUCCESS:
      return {
        ...state,
        testCertificates: [...state.testCertificates, action.payload],
      };

    case ADD_TEST_CERTIFICATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_TEST_CERTIFICATE_SUCCESS:
      return {
        ...state,
        testCertificates: state.testCertificates.map(testCertificate =>
          testCertificate.id.toString() === action.payload.id.toString()
            ? { testCertificate, ...action.payload }
            : testCertificate
        ),
      };

    case UPDATE_TEST_CERTIFICATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_TEST_CERTIFICATE_SUCCESS:
      return {
        ...state,
        testCertificates: state.testCertificates.filter(
          testCertificate =>
            testCertificate.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_TEST_CERTIFICATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default testCertificates;
