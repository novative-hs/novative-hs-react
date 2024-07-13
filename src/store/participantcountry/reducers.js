import {
    GET_COUNTRY_LIST_SUCCESS,
    GET_COUNTRY_LIST_FAIL,
    ADD_NEW_COUNTRY_SUCCESS,
    ADD_NEW_COUNTRY_FAIL,
    UPDATE_COUNTRY_SUCCESS,
    UPDATE_COUNTRY_FAIL,


  } from "./actionTypes";
  
  const INIT_STATE = {
    ListCountry: [],
    error: {},
    AddCountry: [],
    country: [],
  };
  
  const ListCountry = (state = INIT_STATE, action) => {
    switch (action.type) {
      
      ////COUNTRY
      case GET_COUNTRY_LIST_SUCCESS:
        return {
          ...state,
          ListCountry: action.payload,
        };
  
      case GET_COUNTRY_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case ADD_NEW_COUNTRY_SUCCESS:
        return {
          ...state,
          AddCountry: [...state.AddCountry, action.payload.data],
        };
  
      case ADD_NEW_COUNTRY_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case UPDATE_COUNTRY_SUCCESS:
        return {
          ...state,
          ListCountry: state.ListCountry.map(country =>
            country.id.toString() === action.payload.id.toString()
              ? { country, ...action.payload }
              : country
          ),
        };
  
      case UPDATE_COUNTRY_FAIL:
        return {
          ...state,
          error: action.payload,
        };


      default:
        return state;
    }
  };
  
  export default ListCountry;
  