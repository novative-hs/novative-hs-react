import {
    GET_DEPARTMENT_LIST_SUCCESS,
    GET_DEPARTMENT_LIST_FAIL,
    ADD_NEW_DEPARTMENT_SUCCESS,
    ADD_NEW_DEPARTMENT_FAIL,
    UPDATE_DEPARTMENT_SUCCESS,
    UPDATE_DEPARTMENT_FAIL,


  } from "./actionTypes";
  
  const INIT_STATE = {
    ListDepartment: [],
    error: {},
    AddDepartment: [],
    department: [],
  };
  
  const ListDepartment = (state = INIT_STATE, action) => {
    switch (action.type) {
      
      ////DEPARTMENT
      case GET_DEPARTMENT_LIST_SUCCESS:
        return {
          ...state,
          ListDepartment: action.payload,
        };
  
      case GET_DEPARTMENT_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case ADD_NEW_DEPARTMENT_SUCCESS:
        return {
          ...state,
          AddDepartment: [...state.AddDepartment, action.payload.data],
        };
  
      case ADD_NEW_DEPARTMENT_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case UPDATE_DEPARTMENT_SUCCESS:
        return {
          ...state,
          ListDepartment: state.ListDepartment.map(department =>
            department.id.toString() === action.payload.id.toString()
              ? { department, ...action.payload }
              : department
          ),
        };
  
      case UPDATE_DEPARTMENT_FAIL:
        return {
          ...state,
          error: action.payload,
        };


      default:
        return state;
    }
  };
  
  export default ListDepartment;
  