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

    GET_ANALYTESMETHODS_LIST,
    GET_ANALYTESMETHODS_LIST_SUCCESS,
    GET_ANALYTESMETHODS_LIST_FAIL,
    ADD_NEW_ANALYTESMETHODS,
    ADD_NEW_ANALYTESMETHODS_SUCCESS,
    ADD_NEW_ANALYTESMETHODS_FAIL,
    UPDATE_ANALYTESMETHODS,
    UPDATE_ANALYTESMETHODS_SUCCESS,
    UPDATE_ANALYTESMETHODS_FAIL
  } from "./actionTypes";

  // get  Analyte Methods
  export const getAnalyteMethodlist = (id) => ({
    type: GET_ANALYTESMETHODS_LIST,
    payload: id,
  });
  
  export const getAnalyteMethodlistSuccess = MethodAnalyteList => ({
    type: GET_ANALYTESMETHODS_LIST_SUCCESS,
    payload: MethodAnalyteList,
  });
  
  export const getAnalyteMethodlistFail = error => ({
    type: GET_ANALYTESMETHODS_LIST_FAIL,
    payload: error,
  });
  //Add  Analyte Methods
  export const addNewAnalyteMethodlist = (createAnalyteMethod, id) => ({
    type: ADD_NEW_ANALYTESMETHODS,
    payload: { createAnalyteMethod, id },
  });

  export const addNewAnalyteMethodlistSuccess = createAnalyteMethod => ({
    type: ADD_NEW_ANALYTESMETHODS_SUCCESS,
    payload: createAnalyteMethod,
  });
  
  export const addNewAnalyteMethodlistFail = error => ({
    type: ADD_NEW_ANALYTESMETHODS_FAIL,
    payload: error,
  });
  //Update  Analyte Methods
  export const updateAnalyteMethodlist = analytesmethod => {
    console.log('action creator called with analytesmethod:', analytesmethod);
    return {
      type: UPDATE_ANALYTESMETHODS,
      payload: analytesmethod,
    };
  };
  export const updateAnalyteMethodlistSuccess = analytesmethod => ({
    type: UPDATE_ANALYTESMETHODS_SUCCESS,
    payload: analytesmethod,
  });
  
  export const updateAnalyteMethodlistFail = error => ({
    type: UPDATE_ANALYTESMETHODS_FAIL,
    payload: error,
  });


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