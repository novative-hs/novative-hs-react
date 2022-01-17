import {
  ADD_LAB_INFORMATION,
  ADD_LAB_INFORMATION_SUCCESSFUL,
  ADD_LAB_INFORMATION_FAILED,
} from "./actionTypes";

const initialState = {
  addLabError: null,
  message: null,
  loading: false,
};

const labInformation = (state = initialState, action) => {
  switch (action.type) {
    case ADD_LAB_INFORMATION:
      state = {
        ...state,
        lab: null,
        loading: true,
        addLabError: null,
      };
      break;
    case ADD_LAB_INFORMATION_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        lab: action.payload,
        addLabError: null,
      };
      break;
    case ADD_LAB_INFORMATION_FAILED:
      state = {
        ...state,
        lab: null,
        loading: false,
        addLabError: action.payload.lab,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default labInformation;
