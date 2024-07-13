import {
    GET_PROVINCE_LIST,
    GET_PROVINCE_LIST_FAIL,
    GET_PROVINCE_LIST_SUCCESS,
    ADD_NEW_PROVINCE,
    ADD_NEW_PROVINCE_SUCCESS,
    ADD_NEW_PROVINCE_FAIL,
    UPDATE_PROVINCE,
    UPDATE_PROVINCE_SUCCESS,
    UPDATE_PROVINCE_FAIL,
  } from "./actionTypes";
  // get province Action
  export const getprovincelist = (id) => ({
    type: 'GET_PROVINCE_LIST',
    payload: id,
  });
  
  export const getprovincelistSuccess = ListProvince => ({
    type: GET_PROVINCE_LIST_SUCCESS,
    payload: ListProvince,
  });
  
  export const getprovincelistFail = error => ({
    type: GET_PROVINCE_LIST_FAIL,
    payload: error,
  });
  //Add  province Action
  export const addNewProvince = (createProvince, id) => ({
    type: ADD_NEW_PROVINCE,
    payload: { createProvince, id },
  });

  export const addNewProvinceSuccess = createProvince => ({
    type: ADD_NEW_PROVINCE_SUCCESS,
    payload: createProvince,
  });
  
  export const addNewProvinceFail = error => ({
    type: ADD_NEW_PROVINCE_FAIL,
    payload: error,
  });
  //Update  province Action
  export const updateProvince = province => {
    return {
      type: UPDATE_PROVINCE,
      payload: province,
    };
  };
  
  export const updateProvincesSuccess = province => ({
    type: UPDATE_PROVINCE_SUCCESS,
    payload: province,
  });
  
  export const updateProvincesFail = error => ({
    type: UPDATE_PROVINCE_FAIL,
    payload: error,
  });
