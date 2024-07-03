
import {
  GET_SCHEME_LIST,
  GET_SCHEME_LIST_SUCCESS,
  GET_SCHEME_LIST_FAIL,
  ADD_NEW_SCHEME_LIST,
  ADD_NEW_SCHEME_LIST_SUCCESS,
  ADD_NEW_SCHEME_LIST_FAIL,
  UPDATE_NEW_SCHEME_LIST,
  UPDATE_NEW_SCHEME_LIST_SUCCESS,
  UPDATE_NEW_SCHEME_LIST_FAIL,
} from "./actionTypes";

// Scheme
export const getschemelist = id => ({
  type: GET_SCHEME_LIST,
  payload: id,
});

export const getschemelistSuccess = SchemeList => {
  console.log("Scheme List response in success action:", SchemeList); 
  return {
    type: GET_SCHEME_LIST_SUCCESS,
    payload: SchemeList,
  };
};

export const getschemelistFail = (error) => {
  console.log("Error response in fail action:", error); 
  return {
    type: GET_SCHEME_LIST_FAIL,
    payload: error,
  };
};


export const addNewSchemeList = (createUnit, id) => {
  console.log('Action Creator - addNewSchemeList called with:', createUnit, id);
  return {
    type: ADD_NEW_SCHEME_LIST,
    payload: { createUnit, id },
  };
};

export const addNewSchemeListSuccess = createUnit => ({
  type: ADD_NEW_SCHEME_LIST_SUCCESS,
  payload: createUnit,
});

export const addNewSchemeListFail = error => ({
  type: ADD_NEW_SCHEME_LIST_FAIL,
  payload: error,
});

export const updateSchemeList = unit => ({
  type: UPDATE_NEW_SCHEME_LIST,
  payload: unit,
});

export const updateSchemeListSuccess = unit => ({
  type: UPDATE_NEW_SCHEME_LIST_SUCCESS,
  payload: unit,
});

export const updateSchemeListFail = error => ({
  type: UPDATE_NEW_SCHEME_LIST_FAIL,
  payload: error,
});