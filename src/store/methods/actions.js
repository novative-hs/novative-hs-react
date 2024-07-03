import {
    GET_METHODS_LIST,
    GET_METHODS_LIST_FAIL,
    GET_METHODS_LIST_SUCCESS,
    ADD_NEW_METHODS,
    ADD_NEW_METHODS_SUCCESS,
    ADD_NEW_METHODS_FAIL,
    UPDATE_METHODS,
    UPDATE_METHODS_SUCCESS,
    UPDATE_METHODS_FAIL,
  } from "./actionTypes";
  // get Methods Action
  export const getmethodlist = (id) => ({
    type: 'GET_METHODS_LIST',
    payload: id,
  });
  
  export const getmethodlistSuccess = ListMethods => ({
    type: GET_METHODS_LIST_SUCCESS,
    payload: ListMethods,
  });
  
  export const getmethodlistFail = error => ({
    type: GET_METHODS_LIST_FAIL,
    payload: error,
  });
  //Add  Methods Action
  export const addNewMethod = (createMethods, id) => ({
    type: ADD_NEW_METHODS,
    payload: { createMethods, id },
  });

  export const addNewMethodSuccess = createMethods => ({
    type: ADD_NEW_METHODS_SUCCESS,
    payload: createMethods,
  });
  
  export const addNewMethodFail = error => ({
    type: ADD_NEW_METHODS_FAIL,
    payload: error,
  });
  //Update  Methods Action
  export const updateMethods = method => {
    return {
      type: UPDATE_METHODS,
      payload: method,
    };
  };
  
  export const updateMethodsSuccess = method => ({
    type: UPDATE_METHODS_SUCCESS,
    payload: method,
  });
  
  export const updateMethodsFail = error => ({
    type: UPDATE_METHODS_FAIL,
    payload: error,
  });