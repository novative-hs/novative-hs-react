import {
    GET_CITY_LIST,
    GET_CITY_LIST_FAIL,
    GET_CITY_LIST_SUCCESS,
    ADD_NEW_CITY,
    ADD_NEW_CITY_SUCCESS,
    ADD_NEW_CITY_FAIL,
    UPDATE_CITY,
    UPDATE_CITY_SUCCESS,
    UPDATE_CITY_FAIL,
  } from "./actionTypes";
  // get City Action
  export const getcitylist = (id) => ({
    type: 'GET_CITY_LIST',
    payload: id,
  });
  
  export const getcitylistSuccess = ListCity => ({
    type: GET_CITY_LIST_SUCCESS,
    payload: ListCity,
  });
  
  export const getcitylistFail = error => ({
    type: GET_CITY_LIST_FAIL,
    payload: error,
  });
  //Add  City Action
  export const addNewCity = (createCity, id) => ({
    type: ADD_NEW_CITY,
    payload: { createCity, id },
  });

  export const addNewCitySuccess = createCity => ({
    type: ADD_NEW_CITY_SUCCESS,
    payload: createCity,
  });
  
  export const addNewCityFail = error => ({
    type: ADD_NEW_CITY_FAIL,
    payload: error,
  });
  //Update  City Action
  export const updateCity = city => {
    return {
      type: UPDATE_CITY,
      payload: city,
    };
  };
  
  export const updateCitysSuccess = city => ({
    type: UPDATE_CITY_SUCCESS,
    payload: city,
  });
  
  export const updateCitysFail = error => ({
    type: UPDATE_CITY_FAIL,
    payload: error,
  });

  
