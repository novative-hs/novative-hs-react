import {
    GET_METHODS_LIST_SUCCESS,
    GET_METHODS_LIST_FAIL,
    ADD_NEW_METHODS_SUCCESS,
    ADD_NEW_METHODS_FAIL,
    UPDATE_METHODS_SUCCESS,
    UPDATE_METHODS_FAIL,

  } from "./actionTypes";
  
  const INIT_STATE = {
    ListMethods: [],
    error: {},
    AddMethods: [],
    method: [],
  };
  
  const ListMethods = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_METHODS_LIST_SUCCESS:
        return {
          ...state,
          ListMethods: action.payload,
        };
  
      case GET_METHODS_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case ADD_NEW_METHODS_SUCCESS:
        return {
          ...state,
          AddMethods: [...state.AddMethods, action.payload.data],
        };
  
      case ADD_NEW_METHODS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case UPDATE_METHODS_SUCCESS:
        return {
          ...state,
          ListMethods: state.ListMethods.map(method =>
            method.id.toString() === action.payload.id.toString()
              ? { method, ...action.payload }
              : method
          ),
        };
  
      case UPDATE_METHODS_FAIL:
        return {
          ...state,
          error: action.payload,
        };


      default:
        return state;
    }
  };
  
  export default ListMethods;
  