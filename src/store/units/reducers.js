import {
    GET_UNITS_LIST_SUCCESS,
    GET_UNITS_LIST_FAIL,
    ADD_NEW_UNITS_SUCCESS,
    ADD_NEW_UNITS_FAIL,
    UPDATE_UNITS_SUCCESS,
    UPDATE_UNITS_FAIL,

  } from "./actionTypes";
  
  const INIT_STATE = {
    ListUnits: [],
    error: {},
    AddUnits: [],
    unit: [],
  };
  
  const ListUnits = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_UNITS_LIST_SUCCESS:
        return {
          ...state,
          ListUnits: action.payload,
        };
  
      case GET_UNITS_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case ADD_NEW_UNITS_SUCCESS:
        return {
          ...state,
          AddUnits: [...state.AddUnits, action.payload.data],
        };
  
      case ADD_NEW_UNITS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case UPDATE_UNITS_SUCCESS:
        return {
          ...state,
          ListUnits: state.ListUnits.map(unit =>
            unit.id.toString() === action.payload.id.toString()
              ? { unit, ...action.payload }
              : unit
          ),
        };
  
      case UPDATE_UNITS_FAIL:
        return {
          ...state,
          error: action.payload,
        };


      default:
        return state;
    }
  };
  
  export default ListUnits;
  