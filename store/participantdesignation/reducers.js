import {
    GET_DESIGNATION_LIST_SUCCESS,
    GET_DESIGNATION_LIST_FAIL,
    ADD_NEW_DESIGNATION_SUCCESS,
    ADD_NEW_DESIGNATION_FAIL,
    UPDATE_DESIGNATION_SUCCESS,
    UPDATE_DESIGNATION_FAIL,


  } from "./actionTypes";
  
  const INIT_STATE = {
    ListDesignation: [],
    error: {},
    AddDesignation: [],
    designation: [],
  };
  
  const ListDesignation = (state = INIT_STATE, action) => {
    switch (action.type) {
      
      ////DESIGNATION
      case GET_DESIGNATION_LIST_SUCCESS:
        return {
          ...state,
          ListDesignation: action.payload,
        };
  
      case GET_DESIGNATION_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case ADD_NEW_DESIGNATION_SUCCESS:
        return {
          ...state,
          AddDesignation: [...state.AddDesignation, action.payload.data],
        };
  
      case ADD_NEW_DESIGNATION_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case UPDATE_DESIGNATION_SUCCESS:
        return {
          ...state,
          ListDesignation: state.ListDesignation.map(designation =>
            designation.id.toString() === action.payload.id.toString()
              ? { designation, ...action.payload }
              : designation
          ),
        };
  
      case UPDATE_DESIGNATION_FAIL:
        return {
          ...state,
          error: action.payload,
        };


      default:
        return state;
    }
  };
  
  export default ListDesignation;
  