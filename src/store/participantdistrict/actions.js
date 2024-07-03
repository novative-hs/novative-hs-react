import {
    GET_DISTRICT_LIST,
    GET_DISTRICT_LIST_FAIL,
    GET_DISTRICT_LIST_SUCCESS,
    ADD_NEW_DISTRICT,
    ADD_NEW_DISTRICT_SUCCESS,
    ADD_NEW_DISTRICT_FAIL,
    UPDATE_DISTRICT,
    UPDATE_DISTRICT_SUCCESS,
    UPDATE_DISTRICT_FAIL,
  } from "./actionTypes";
  // get DISTRICT Action
  export const getdistrictlist = (id) => ({
    type: 'GET_DISTRICT_LIST',
    payload: id,
  });
  
  export const getdistrictlistSuccess = ListDistrict => ({
    type: GET_DISTRICT_LIST_SUCCESS,
    payload: ListDistrict,
  });
  
  export const getdistrictlistFail = error => ({
    type: GET_DISTRICT_LIST_FAIL,
    payload: error,
  });
  //Add  DISTRICT Action
  export const addNewDistrict = (createDistrict, id) => ({
    type: ADD_NEW_DISTRICT,
    payload: { createDistrict, id },
  });

  export const addNewDistrictSuccess = createDistrict => ({
    type: ADD_NEW_DISTRICT_SUCCESS,
    payload: createDistrict,
  });
  
  export const addNewDistrictFail = error => ({
    type: ADD_NEW_DISTRICT_FAIL,
    payload: error,
  });
  //Update  DISTRICT Action
  export const updateDistrict = district => {
    return {
      type: UPDATE_DISTRICT,
      payload: district,
    };
  };
  
  export const updateDistrictsSuccess = district => ({
    type: UPDATE_DISTRICT_SUCCESS,
    payload: district,
  });
  
  export const updateDistrictsFail = error => ({
    type: UPDATE_DISTRICT_FAIL,
    payload: error,
  });

  
