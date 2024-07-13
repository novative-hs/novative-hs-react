import {
    GET_COUNTRY_LIST,
    GET_COUNTRY_LIST_FAIL,
    GET_COUNTRY_LIST_SUCCESS,
    ADD_NEW_COUNTRY,
    ADD_NEW_COUNTRY_SUCCESS,
    ADD_NEW_COUNTRY_FAIL,
    UPDATE_COUNTRY,
    UPDATE_COUNTRY_SUCCESS,
    UPDATE_COUNTRY_FAIL,
  } from "./actionTypes";
  // get country Action
  export const getcountrylist = (id) => ({
    type: 'GET_COUNTRY_LIST',
    payload: id,
  });
  
  export const getcountrylistSuccess = ListCountry => ({
    type: GET_COUNTRY_LIST_SUCCESS,
    payload: ListCountry,
  });
  
  export const getcountrylistFail = error => ({
    type: GET_COUNTRY_LIST_FAIL,
    payload: error,
  });
  //Add  country Action
  export const addNewCountry = (createCountry, id) => ({
    type: ADD_NEW_COUNTRY,
    payload: { createCountry, id },
  });

  export const addNewCountrySuccess = createCountry => ({
    type: ADD_NEW_COUNTRY_SUCCESS,
    payload: createCountry,
  });
  
  export const addNewCountryFail = error => ({
    type: ADD_NEW_COUNTRY_FAIL,
    payload: error,
  });
  //Update  country Action
  export const updateCountry = country => {
    return {
      type: UPDATE_COUNTRY,
      payload: country,
    };
  };
  
  export const updateCountrysSuccess = country => ({
    type: UPDATE_COUNTRY_SUCCESS,
    payload: country,
  });
  
  export const updateCountrysFail = error => ({
    type: UPDATE_COUNTRY_FAIL,
    payload: error,
  });
