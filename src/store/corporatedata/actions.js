import {
  ADD_NEW_CEMPLOYEE_DATA,
  ADD_CEMPLOYEE_DATA_SUCCESS,
  ADD_CEMPLOYEE_DATA_FAIL,
  GET_LABCORPORATE,
  GET_LABCORPORATE_SUCCESS,
  GET_LABCORPORATE_FAIL,
  UPDATE_CEMPLOYEE,
  UPDATE_CEMPLOYEE_SUCCESS,
  UPDATE_CEMPLOYEE_FAIL,
} from "./actionTypes";

export const getLabCorporate = id => ({
  type: GET_LABCORPORATE,
  payload: id,
});

export const getLabCorporateSuccess = cemployees => ({
  type: GET_LABCORPORATE_SUCCESS,
  payload: cemployees,
});

export const getLabCorporateFail = error => ({
  type: GET_LABCORPORATE_FAIL,
  payload: error,
});
export const getCemployees = () => ({
  type: GET_CEMPLOYEES,
});

export const getCemployeesSuccess = cemployees => ({
  type: GET_CEMPLOYEES_SUCCESS,
  payload: cemployees,
});

export const getCemployeesFail = error => ({
  type: GET_CEMPLOYEES_FAIL,
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
