import {
  GET_SCHEME_LIST,
  GET_SCHEME_LIST_SUCCESS,
  GET_SCHEME_LIST_FAIL,
  GET_SCHEMENAME,
  GET_SCHEMENAME_SUCCESS,
  GET_SCHEMENAME_FAIL,
  GET_SCHEMEANALYTE,
  GET_SCHEMEANALYTE_SUCCESS,
  GET_SCHEMEANALYTE_FAIL,
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
///get analytes associated with unit
  export const getSchemeAnalyte = (id) => ({
    type: GET_SCHEMEANALYTE,
    payload: id,
  });
  
  export const getSchemeAnalyteSuccess = SchemeAnalyte => ({
    type: GET_SCHEMEANALYTE_SUCCESS,
    payload: SchemeAnalyte,
  });
  
  export const getSchemeAnalyteFail = error => ({
    type: GET_SCHEMEANALYTE_FAIL,
    payload: error,
  });

  ///get analytes associated with unit
  export const getSchemeName = (id) => ({
    type: GET_SCHEMENAME,
    payload: id,
  });
  
  export const getSchemeNameSuccess = UnitAnalyte => ({
    type: GET_SCHEMENAME_SUCCESS,
    payload: UnitAnalyte,
  });
  
  export const getSchemeNameFail = error => ({
    type: GET_SCHEMENAME_FAIL,
    payload: error,
  });

//////////////Add New Scheme////////////
export const addNewSchemeList = (createUnit, id) => ({
  type: ADD_NEW_SCHEME_LIST,
  payload: { createUnit, id },
});

export const addNewSchemeListSuccess = createUnit => ({
  type: ADD_NEW_SCHEME_LIST_SUCCESS,
  payload: createUnit,
});

export const addNewSchemeListFail = error => ({
  type: ADD_NEW_SCHEME_LIST_FAIL,
  payload: error,
});

//////////////Update Scheme////////////
export const updateSchemeList = unit => ({
  type: UPDATE_NEW_SCHEME_LIST,
  payload: unit,
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
