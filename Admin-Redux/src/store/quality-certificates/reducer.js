import {
  GET_QUALITY_CERTIFICATES_SUCCESS,
  GET_QUALITY_CERTIFICATES_FAIL,
  ADD_QUALITY_CERTIFICATE_SUCCESS,
  ADD_QUALITY_CERTIFICATE_FAIL,
  UPDATE_QUALITY_CERTIFICATE_SUCCESS,
  UPDATE_QUALITY_CERTIFICATE_FAIL,
  DELETE_QUALITY_CERTIFICATE_SUCCESS,
  DELETE_QUALITY_CERTIFICATE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  qualityCertificates: [],
  error: {},
};

const qualityCertificates = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_QUALITY_CERTIFICATES_SUCCESS:
      return {
        ...state,
        qualityCertificates: action.payload.data,
      };

    case GET_QUALITY_CERTIFICATES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_QUALITY_CERTIFICATE_SUCCESS:
      return {
        ...state,
        qualityCertificates: [...state.qualityCertificates, action.payload],
      };

    case ADD_QUALITY_CERTIFICATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_QUALITY_CERTIFICATE_SUCCESS:
      return {
        ...state,
        qualityCertificates: state.qualityCertificates.map(qualityCertificate =>
          qualityCertificate.id.toString() === action.payload.id.toString()
            ? { qualityCertificate, ...action.payload }
            : qualityCertificate
        ),
      };

    case UPDATE_QUALITY_CERTIFICATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_QUALITY_CERTIFICATE_SUCCESS:
      return {
        ...state,
        qualityCertificates: state.qualityCertificates.filter(
          qualityCertificate =>
            qualityCertificate.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_QUALITY_CERTIFICATE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default qualityCertificates;
