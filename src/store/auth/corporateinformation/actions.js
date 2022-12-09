import {
  ADD_CORPORATE_INFORMATION,
  ADD_CORPORATE_INFORMATION_SUCCESSFUL,
  ADD_CORPORATE_INFORMATION_FAILED,
} from "./actionTypes";

export const addCorporateInformation = (corporate, id) => {
  return {
    type: ADD_CORPORATE_INFORMATION,
    payload: { corporate, id },
  };
};

export const addCorporateInformationSuccessful = (corporate, id) => {
  return {
    type: ADD_CORPORATE_INFORMATION_SUCCESSFUL,
    payload: { corporate, id },
  };
};

export const addCorporateInformationFailed = (corporate, id) => {
  return {
    type: ADD_CORPORATE_INFORMATION_FAILED,
    payload: { corporate, id },
  };
};
