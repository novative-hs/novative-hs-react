import {
  GET_ONLY_MEDICAL_LIST,
  GET_ONLY_MEDICAL_LIST_SUCCESS,
  GET_ONLY_MEDICAL_LIST_FAIL,
} from "./actionTypes";

export const onlyMedicalTestList = () => ({
  type: GET_ONLY_MEDICAL_LIST,
  payload: {},
});

export const onlyMedicalTestListSuccess = onlyMedicalTestList => ({
    type: GET_ONLY_MEDICAL_LIST_SUCCESS,
    payload: onlyMedicalTestList,
  });

export const onlyMedicalTestListFail = error => ({
  type: GET_ONLY_MEDICAL_LIST_FAIL,
  payload: error,
});
