import {
  GET_LABS,
  GET_LABS_SUCCESS,
  GET_LABS_FAIL,
  ADD_LAB_INFORMATION,
  ADD_LAB_INFORMATION_SUCCESSFUL,
  ADD_LAB_INFORMATION_FAILED,
} from "./actionTypes";

export const getLabs = () => ({
  type: GET_LABS,
});

export const getLabsSuccess = labs => ({
  type: GET_LABS_SUCCESS,
  payload: labs,
});

export const getLabsFail = error => ({
  type: GET_LABS_FAIL,
  payload: error,
});

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
