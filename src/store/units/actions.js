import {
    GET_UNITS_LIST,
    GET_UNITS_LIST_FAIL,
    GET_UNITS_LIST_SUCCESS,
    ADD_NEW_UNITS,
    ADD_NEW_UNITS_SUCCESS,
    ADD_NEW_UNITS_FAIL,
    UPDATE_UNITS,
    UPDATE_UNITS_SUCCESS,
    UPDATE_UNITS_FAIL,
  } from "./actionTypes";
  // get Units Action
  export const getunitlist = (id) => ({
    type: 'GET_UNITS_LIST',
    payload: id,
  });
  
  export const getunitlistSuccess = ListUnits => ({
    type: GET_UNITS_LIST_SUCCESS,
    payload: ListUnits,
  });
  
  export const getunitlistFail = error => ({
    type: GET_UNITS_LIST_FAIL,
    payload: error,
  });
  //Add  Units Action
  export const addNewUnit = (createUnit, id) => ({
    type: ADD_NEW_UNITS,
    payload: { createUnit, id },
  });

  export const addNewUnitSuccess = createUnit => ({
    type: ADD_NEW_UNITS_SUCCESS,
    payload: createUnit,
  });
  
  export const addNewUnitFail = error => ({
    type: ADD_NEW_UNITS_FAIL,
    payload: error,
  });
  //Update  Units Action
  export const updateUnits = unit => {
    return {
      type: UPDATE_UNITS,
      payload: unit,
    };
  };
  
  export const updateUnitsSuccess = unit => ({
    type: UPDATE_UNITS_SUCCESS,
    payload: unit,
  });
  
  export const updateUnitsFail = error => ({
    type: UPDATE_UNITS_FAIL,
    payload: error,
  });

  
