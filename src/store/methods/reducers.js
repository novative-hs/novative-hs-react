import {
    GET_METHODS_LIST_SUCCESS,
    GET_METHODS_LIST_FAIL,
    ADD_NEW_METHODS_SUCCESS,
    ADD_NEW_METHODS_FAIL,
    UPDATE_METHODS_SUCCESS,
    UPDATE_METHODS_FAIL,
    DELETE_METHOD_SUCCESS,
    DELETE_METHOD_FAIL,

    GET_ANALYTESMETHODS_LIST_SUCCESS,
    GET_ANALYTESMETHODS_LIST_FAIL,
    ADD_NEW_ANALYTESMETHODS_SUCCESS,
    ADD_NEW_ANALYTESMETHODS_FAIL,
    UPDATE_ANALYTESMETHODS_SUCCESS,
    UPDATE_ANALYTESMETHODS_FAIL

  } from "./actionTypes";
  
  const INIT_STATE = {

    MethodAnalyteList: [],
    AddAnalyteMethods: [],
    analytesmethod: [],


    ListMethods: [],
    error: {},
    AddMethods: [],
    method: [],
  };
  
  const ListMethods = (state = INIT_STATE, action) => {
    switch (action.type) {
      /////analytesmethods
      case GET_ANALYTESMETHODS_LIST_SUCCESS:
      return {
        ...state,
        MethodAnalyteList: action.payload.methods, // Update to handle methods array
      };
    
        case GET_ANALYTESMETHODS_LIST_FAIL:
          return {
            ...state,
            error: action.payload,
          };
        case ADD_NEW_ANALYTESMETHODS_SUCCESS:
          return {
            ...state,
            AddAnalyteMethods: [...state.AddAnalyteMethods, action.payload.data],
          };
    
        case ADD_NEW_ANALYTESMETHODS_FAIL:
          return {
            ...state,
            error: action.payload,
          };
        case UPDATE_ANALYTESMETHODS_SUCCESS:
          return {
            ...state,
            MethodAnalyteList: state.MethodAnalyteList.map(analytesmethod =>
              analytesmethod.id.toString() === action.payload.id.toString()
                ? { analytesmethod, ...action.payload }
                : analytesmethod
            ),
          };
    
        case UPDATE_ANALYTESMETHODS_FAIL:
          return {
            ...state,
            error: action.payload,
          };
  
      ///////////
      case GET_METHODS_LIST_SUCCESS:
        console.log("method list",action.payload);
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
        case DELETE_METHOD_SUCCESS:
          return {
            ...state,
            ListMethods: state.ListMethods.filter(
              method => method.id.toString() !== action.payload.id.toString()
            ),
          };
    
        case DELETE_METHOD_FAIL:
          return {
            ...state,
            error: action.payload,
          };

      default:
        return state;
    }
  };
  
  export default ListMethods;
  