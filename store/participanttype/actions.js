import {
    GET_TYPE_LIST,
    GET_TYPE_LIST_FAIL,
    GET_TYPE_LIST_SUCCESS,
    ADD_NEW_TYPE,
    ADD_NEW_TYPE_SUCCESS,
    ADD_NEW_TYPE_FAIL,
    UPDATE_TYPE,
    UPDATE_TYPE_SUCCESS,
    UPDATE_TYPE_FAIL,
  } from "./actionTypes";
  // get TYPE Action
  export const gettypelist = (id) => ({
    type: 'GET_TYPE_LIST',
    payload: id,
  });
  
  export const gettypelistSuccess = ListType => ({
    type: GET_TYPE_LIST_SUCCESS,
    payload: ListType,
  });
  
  export const gettypelistFail = error => ({
    type: GET_TYPE_LIST_FAIL,
    payload: error,
  });
  //Add  TYPE Action
  export const addNewType = (createType, id) => ({
    type: ADD_NEW_TYPE,
    payload: { createType, id },
  });

  export const addNewTypeSuccess = createType => ({
    type: ADD_NEW_TYPE_SUCCESS,
    payload: createType,
  });
  
  export const addNewTypeFail = error => ({
    type: ADD_NEW_TYPE_FAIL,
    payload: error,
  });
  //Update  TYPE Action
  export const updateType = type => {
    return {
      type: UPDATE_TYPE,
      payload: type,
    };
  };
  
  export const updateTypesSuccess = type => ({
    type: UPDATE_TYPE_SUCCESS,
    payload: type,
  });
  
  export const updateTypesFail = error => ({
    type: UPDATE_TYPE_FAIL,
    payload: error,
  });

  
