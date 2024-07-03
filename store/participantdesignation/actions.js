import {
    GET_DESIGNATION_LIST,
    GET_DESIGNATION_LIST_FAIL,
    GET_DESIGNATION_LIST_SUCCESS,
    ADD_NEW_DESIGNATION,
    ADD_NEW_DESIGNATION_SUCCESS,
    ADD_NEW_DESIGNATION_FAIL,
    UPDATE_DESIGNATION,
    UPDATE_DESIGNATION_SUCCESS,
    UPDATE_DESIGNATION_FAIL,
  } from "./actionTypes";
  // get Designation Action
  export const getdesignationlist = (id) => ({
    type: 'GET_DESIGNATION_LIST',
    payload: id,
  });
  
  export const getdesignationlistSuccess = ListDesignation => ({
    type: GET_DESIGNATION_LIST_SUCCESS,
    payload: ListDesignation,
  });
  
  export const getdesignationlistFail = error => ({
    type: GET_DESIGNATION_LIST_FAIL,
    payload: error,
  });
  //Add  Designation Action
  export const addNewDesignation = (createDesignation, id) => ({
    type: ADD_NEW_DESIGNATION,
    payload: { createDesignation, id },
  });

  export const addNewDesignationSuccess = createDesignation => ({
    type: ADD_NEW_DESIGNATION_SUCCESS,
    payload: createDesignation,
  });
  
  export const addNewDesignationFail = error => ({
    type: ADD_NEW_DESIGNATION_FAIL,
    payload: error,
  });
  //Update  Designation Action
  export const updateDesignation = designation => {
    return {
      type: UPDATE_DESIGNATION,
      payload: designation,
    };
  };
  
  export const updateDesignationsSuccess = designation => ({
    type: UPDATE_DESIGNATION_SUCCESS,
    payload: designation,
  });
  
  export const updateDesignationsFail = error => ({
    type: UPDATE_DESIGNATION_FAIL,
    payload: error,
  });

  
