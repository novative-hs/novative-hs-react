import {
  ADD_NEW_CEMPLOYEE_DATA,
  ADD_CEMPLOYEE_DATA_SUCCESS,
  ADD_CEMPLOYEE_DATA_FAIL,
  GET_LABCORPORATE,
  GET_LABCORPORATE_SUCCESS,
  GET_LABCORPORATE_FAIL,
  GET_EMPLOYEECORPORATE,
  GET_EMPLOYEECORPORATE_SUCCESS,
  GET_EMPLOYEECORPORATE_FAIL,
  UPDATE_CEMPLOYEE,
  UPDATE_CEMPLOYEE_SUCCESS,
  UPDATE_CEMPLOYEE_FAIL,
} from "./actionTypes";

export const getLabCorporate = id => ({
  type: GET_LABCORPORATE,
  payload: id,
});

export const getLabCorporateSuccess = cemployeeData => ({
  type: GET_LABCORPORATE_SUCCESS,
  payload: cemployeeData,
});

export const getLabCorporateFail = error => ({
  type: GET_LABCORPORATE_FAIL,
  payload: error,
});
export const getEmployeeCorporate = id => ({
  type: GET_EMPLOYEECORPORATE,
  payload: id,
});

export const getEmployeeCorporateSuccess = cemployeeData => ({
  type: GET_EMPLOYEECORPORATE_SUCCESS,
  payload: cemployeeData,
});

export const getEmployeeCorporateFail = error => ({
  type: GET_EMPLOYEECORPORATE_FAIL,
  payload: error,
});

export const addNewCemployeeData = (cemployeeData, id) => ({
  type: ADD_NEW_CEMPLOYEE_DATA,
  payload: { cemployeeData, id },
});

export const addCemployeeDataSuccess = cemployeeData => ({
  type: ADD_CEMPLOYEE_DATA_SUCCESS,
  payload: cemployeeData,
});

export const addCemployeeDataFail = error => ({
  type: ADD_CEMPLOYEE_DATA_FAIL,
  payload: error,
});
export const updateCemployee = cemployee => ({
  type: UPDATE_CEMPLOYEE,
  payload: cemployee,
});

export const updateCemployeeSuccess = cemployee => ({
  type: UPDATE_CEMPLOYEE_SUCCESS,
  payload: cemployee,
});

export const updateCemployeeFail = error => ({
  type: UPDATE_CEMPLOYEE_FAIL,
  payload: error,
});
