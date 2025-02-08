import {
  GET_SCHEME_LIST,
  GET_SCHEME_LIST_SUCCESS,
  GET_SCHEME_LIST_FAIL,
  ADD_NEW_SCHEME_LIST,
  ADD_NEW_SCHEME_LIST_SUCCESS,
  ADD_NEW_SCHEME_LIST_FAIL,
  UPDATE_NEW_SCHEME_LIST,
  UPDATE_NEW_SCHEME_LIST_SUCCESS,
  UPDATE_NEW_SCHEME_LIST_FAIL,
  DELETE_SCHEME,
  DELETE_SCHEME_SUCCESS,
  DELETE_SCHEME_FAIL,
} from "./actionTypes";




//////////////Scheme////////////
export const getSchemelist = (id) => ({
  type: GET_SCHEME_LIST,
  payload: id,
  payload: id,
});

export const getSchemelistSuccess = (MethodList) => {
  console.log("MethodList response in success action:", MethodList); 
  return {
    type: GET_SCHEME_LIST_SUCCESS,
    payload: MethodList,
  };
};

export const getSchemelistFail = (error) => {
  console.log("Error response in fail action:", error); 
  return {
    type: GET_SCHEME_LIST_FAIL,
    payload: error,
  };
};

// Add New Scheme Action
export const addNewSchemeList = (createUnit, id) => {
  console.log("addNewSchemeList - createUnit:", createUnit); // Log the 'createUnit' argument
  console.log("addNewSchemeList - id:", id); // Log the 'id' argument
  
  return {
    type: ADD_NEW_SCHEME_LIST,
    payload: { createUnit, id },
  };
};

// Add New Scheme Success Action
export const addNewSchemeListSuccess = createUnit => {
  console.log("addNewSchemeListSuccess - createUnit:", createUnit); // Log the 'createUnit' payload
  
  return {
    type: ADD_NEW_SCHEME_LIST_SUCCESS,
    payload: createUnit,
  };
};

// Add New Scheme Failure Action
export const addNewSchemeListFail = error => {
  console.log("addNewSchemeListFail - error:", error); // Log the 'error' payload
  
  return {
    type: ADD_NEW_SCHEME_LIST_FAIL,
    payload: error,
  };
};

//////////////Update Scheme////////////
export const updateSchemeList = unit => ({
  type: UPDATE_NEW_SCHEME_LIST,
  payload: unit,
  active: true,
});

export const updateSchemeListSuccess = unit => ({
  type: UPDATE_NEW_SCHEME_LIST_SUCCESS,
  payload: unit,
});

export const updateSchemeListFail = error => ({
  type: UPDATE_NEW_SCHEME_LIST_FAIL,
  payload: error,
});

export const deleteScheme = id => ({
  type: DELETE_SCHEME,
  payload: id,
});

export const deleteSchemeSuccess = id => ({
  type: DELETE_SCHEME_SUCCESS,
  payload: id,
});

export const deleteSchemeFail = error => ({
  type: DELETE_SCHEME_FAIL,
  payload: error,
});
