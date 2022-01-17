import {
  ADD_CORPORATE_INFORMATION,
  ADD_CORPORATE_INFORMATION_SUCCESSFUL,
  ADD_CORPORATE_INFORMATION_FAILED,
} from "./actionTypes";

const initialState = {
  addCorporateError: null,
  message: null,
  loading: false,
};

const corporateInformation = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CORPORATE_INFORMATION:
      state = {
        ...state,
        corporate: null,
        loading: true,
        addCorporateError: null,
      };
      break;
    case ADD_CORPORATE_INFORMATION_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        corporate: action.payload,
        addCorporateError: null,
      };
      break;
    case ADD_CORPORATE_INFORMATION_FAILED:
      state = {
        ...state,
        corporate: null,
        loading: false,
        addCorporateError: action.payload.corporate,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default corporateInformation;
