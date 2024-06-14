import {
    GET_MANUFACTURAL_LIST,
    GET_MANUFACTURAL_LIST_FAIL,
    GET_MANUFACTURAL_LIST_SUCCESS,
    ADD_NEW_MANUFACTURAL,
    ADD_NEW_MANUFACTURAL_SUCCESS,
    ADD_NEW_MANUFACTURAL_FAIL,
    UPDATE_MANUFACTURAL,
    UPDATE_MANUFACTURAL_SUCCESS,
    UPDATE_MANUFACTURAL_FAIL,
  } from "./actionTypes";
  // get Units Action
  export const getManufacturalList = () => ({
    type: GET_MANUFACTURAL_LIST,
    payload: {},
  });
  
  export const getManufacturalListSuccess =  ManufacturalList => ({
    type: GET_MANUFACTURAL_LIST_SUCCESS,
    payload:  ManufacturalList,
  });
  
  export const getManufacturalListFail = error => ({
    type: GET_MANUFACTURAL_LIST_FAIL,
    payload: error,
  });
  //Add  Units Action
  export const addNewManufactural = (createManufactural, id) => ({
    type: ADD_NEW_MANUFACTURAL,
    payload: { createManufactural, id },
  });

  export const addNewManufacturalSuccess = createManufactural => ({
    type: ADD_NEW_MANUFACTURAL_SUCCESS,
    payload: createManufactural,
  });
  
  export const addNewManufacturalFail = error => ({
    type: ADD_NEW_MANUFACTURAL_FAIL,
    payload: error,
  });
  //Update  Units Action
  export const updateManufactural = manufactural => {
    console.log('update Manufactural action creator called with reagent:', manufactural);
    return {
      type: UPDATE_MANUFACTURAL,
      payload: manufactural,
    };
  };
  export const updateManufacturalSuccess = manufactural => ({
    type: UPDATE_MANUFACTURAL_SUCCESS,
    payload: manufactural,
  });
  
  export const updateManufacturalFail = error => ({
    type: UPDATE_MANUFACTURAL_FAIL,
    payload: error,
  });

  