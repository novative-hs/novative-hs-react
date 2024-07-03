import {
    GET_TYPE_LIST_SUCCESS,
    GET_TYPE_LIST_FAIL,
    ADD_NEW_TYPE_SUCCESS,
    ADD_NEW_TYPE_FAIL,
    UPDATE_TYPE_SUCCESS,
    UPDATE_TYPE_FAIL,


  } from "./actionTypes";
  
  const INIT_STATE = {
    ListType: [],
    error: {},
    AddType: [],
    type: [],
  };
  
  const ListType = (state = INIT_STATE, action) => {
    switch (action.type) {
      
      ////TYPE
      case GET_TYPE_LIST_SUCCESS:
        return {
          ...state,
          ListType: action.payload,
        };
  
      case GET_TYPE_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case ADD_NEW_TYPE_SUCCESS:
        return {
          ...state,
          AddType: [...state.AddType, action.payload.data],
        };
  
      case ADD_NEW_TYPE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case UPDATE_TYPE_SUCCESS:
        return {
          ...state,
          ListType: state.ListType.map(type =>
            type.id.toString() === action.payload.id.toString()
              ? { type, ...action.payload }
              : type
          ),
        };
  
      case UPDATE_TYPE_FAIL:
        return {
          ...state,
          error: action.payload,
        };


      default:
        return state;
    }
  };
  
  export default ListType;
  