import {
    GET_DEPARTMENT_LIST,
    GET_DEPARTMENT_LIST_FAIL,
    GET_DEPARTMENT_LIST_SUCCESS,
    ADD_NEW_DEPARTMENT,
    ADD_NEW_DEPARTMENT_SUCCESS,
    ADD_NEW_DEPARTMENT_FAIL,
    UPDATE_DEPARTMENT,
    UPDATE_DEPARTMENT_SUCCESS,
    UPDATE_DEPARTMENT_FAIL,
  } from "./actionTypes";
  // get DEPARTMENT Action
  export const getdepartmentlist = (id) => ({
    type: 'GET_DEPARTMENT_LIST',
    payload: id,
  });
  
  export const getdepartmentlistSuccess = ListDepartment => ({
    type: GET_DEPARTMENT_LIST_SUCCESS,
    payload: ListDepartment,
  });
  
  export const getdepartmentlistFail = error => ({
    type: GET_DEPARTMENT_LIST_FAIL,
    payload: error,
  });
  //Add  DEPARTMENT Action
  export const addNewDepartment = (createDepartment, id) => ({
    type: ADD_NEW_DEPARTMENT,
    payload: { createDepartment, id },
  });

  export const addNewDepartmentSuccess = createDepartment => ({
    type: ADD_NEW_DEPARTMENT_SUCCESS,
    payload: createDepartment,
  });
  
  export const addNewDepartmentFail = error => ({
    type: ADD_NEW_DEPARTMENT_FAIL,
    payload: error,
  });
  //Update  DEPARTMENT Action
  export const updateDepartment = department => {
    return {
      type: UPDATE_DEPARTMENT,
      payload: department,
    };
  };
  
  export const updateDepartmentsSuccess = department => ({
    type: UPDATE_DEPARTMENT_SUCCESS,
    payload: department,
  });
  
  export const updateDepartmentsFail = error => ({
    type: UPDATE_DEPARTMENT_FAIL,
    payload: error,
  });

  
