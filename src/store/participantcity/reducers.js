import {
    GET_CITY_LIST_SUCCESS,
    GET_CITY_LIST_FAIL,
    ADD_NEW_CITY_SUCCESS,
    ADD_NEW_CITY_FAIL,
    UPDATE_CITY_SUCCESS,
    UPDATE_CITY_FAIL,


  } from "./actionTypes";
  
  const INIT_STATE = {
    ListCity: [],
    error: {},
    AddCity: [],
    city: [],
  };
  
  const ListCity = (state = INIT_STATE, action) => {
    switch (action.type) {
      
      ////CITY
      case GET_CITY_LIST_SUCCESS:
        return {
          ...state,
          ListCity: action.payload,
        };
  
      case GET_CITY_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case ADD_NEW_CITY_SUCCESS:
        return {
          ...state,
          AddCity: [...state.AddCity, action.payload.data],
        };
  
      case ADD_NEW_CITY_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case UPDATE_CITY_SUCCESS:
        return {
          ...state,
          ListCity: state.ListCity.map(city =>
            city.id.toString() === action.payload.id.toString()
              ? { city, ...action.payload }
              : city
          ),
        };
  
      case UPDATE_CITY_FAIL:
        return {
          ...state,
          error: action.payload,
        };


      default:
        return state;
    }
  };
  
  export default ListCity;
  