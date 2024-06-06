import {
  GET_MANUFACTURAL_LIST_FAIL,
  GET_MANUFACTURAL_LIST_SUCCESS,
  ADD_NEW_MANUFACTURAL_SUCCESS,
  ADD_NEW_MANUFACTURAL_FAIL,
  UPDATE_MANUFACTURAL_SUCCESS,
  UPDATE_MANUFACTURAL_FAIL,

  } from "./actionTypes";
  
  const INIT_STATE = {
    ManufacturalList: [],
    error: {},
    AddManufactural: [],
    manufactural: [],
  };
  
  const  ManufacturalList = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_MANUFACTURAL_LIST_SUCCESS:
        return {
          ...state,
           ManufacturalList: action.payload,
        };
  
      case GET_MANUFACTURAL_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case  ADD_NEW_MANUFACTURAL_SUCCESS:
        return {
          ...state,
          AddManufactural: [...state.AddManufactural, action.payload.data],
        };
  
      case ADD_NEW_MANUFACTURAL_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case  UPDATE_MANUFACTURAL_SUCCESS:
        return {
          ...state,
           ManufacturalList: state. ManufacturalList.map( manufactural =>
             manufactural.id.toString() === action.payload.id.toString()
              ? {  manufactural, ...action.payload }
              :  manufactural
          ),
        };
  
      case UPDATE_MANUFACTURAL_FAIL:
        return {
          ...state,
          error: action.payload,
        };


      default:
        return state;
    }
  };
  
  export default  ManufacturalList;
  