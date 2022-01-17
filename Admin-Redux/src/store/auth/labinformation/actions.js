import {
  ADD_LAB_INFORMATION,
  ADD_LAB_INFORMATION_SUCCESSFUL,
  ADD_LAB_INFORMATION_FAILED,
} from "./actionTypes";

export const addLabInformation = (lab, id) => {
  return {
    type: ADD_LAB_INFORMATION,
    payload: { lab, id },
  };
};

export const addLabInformationSuccessful = (lab, id) => {
  return {
    type: ADD_LAB_INFORMATION_SUCCESSFUL,
    payload: { lab, id },
  };
};

export const addLabInformationFailed = (lab, id) => {
  return {
    type: ADD_LAB_INFORMATION_FAILED,
    payload: { lab, id },
  };
};
