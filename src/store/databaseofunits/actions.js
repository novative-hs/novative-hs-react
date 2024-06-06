import {
  GET_INSTRUMENT_TYPE_LIST,
  GET_INSTRUMENT_TYPE_LIST_FAIL,
  GET_INSTRUMENT_TYPE_LIST_SUCCESS,
  ADD_NEW_INSTRUMENT_TYPE,
  ADD_NEW_INSTRUMENT_TYPE_SUCCESS,
  ADD_NEW_INSTRUMENT_TYPE_FAIL,
  UPDATE_NEW_INSTRUMENT_TYPE,
  UPDATE_NEW_INSTRUMENT_TYPE_SUCCESS,
  UPDATE_NEW_INSTRUMENT_TYPE_FAIL,
  GET_METHOD_LIST,
  GET_METHOD_LIST_SUCCESS,
  GET_METHOD_LIST_FAIL,
  ADD_NEW_METHOD_LIST,
  ADD_NEW_METHOD_LIST_SUCCESS,
  ADD_NEW_METHOD_LIST_FAIL,
  UPDATE_NEW_METHOD_LIST,
  UPDATE_NEW_METHOD_LIST_SUCCESS,
  UPDATE_NEW_METHOD_LIST_FAIL,
  GET_ANALYTE_LIST,
  GET_ANALYTE_LIST_SUCCESS,
  GET_ANALYTE_LIST_FAIL,
  ADD_NEW_ANALYTE_LIST,
  ADD_NEW_ANALYTE_LIST_SUCCESS,
  ADD_NEW_ANALYTE_LIST_FAIL,
  UPDATE_NEW_ANALYTE_LIST,
  UPDATE_NEW_ANALYTE_LIST_SUCCESS,
  UPDATE_NEW_ANALYTE_LIST_FAIL
} from "./actionTypes";
////////method /////////////////
export const getmethodlist = () => ({
  type: GET_METHOD_LIST,
  payload: {},
});

export const getmethodlistSuccess = (MethodList) => {
  console.log("MethodList response in success action:", MethodList); 
  return {
    type: GET_METHOD_LIST_SUCCESS,
    payload: MethodList,
  };
};

export const getmethodlistFail = (error) => {
  console.log("Error response in fail action:", error); 
  return {
    type: GET_METHOD_LIST_FAIL,
    payload: error,
  };
};


export const addNewMethodList = (createUnit, id) => ({
  type: ADD_NEW_METHOD_LIST,
  payload: { createUnit, id },
});

export const addNewMethodListSuccess = createUnit => ({
  type: ADD_NEW_METHOD_LIST_SUCCESS,
  payload: createUnit,
});

export const addNewMethodListFail = error => ({
  type: ADD_NEW_METHOD_LIST_FAIL,
  payload: error,
});

export const updateMethodList = unit => ({
  type: UPDATE_NEW_METHOD_LIST,
  payload: unit,
});

export const updateMethodListSuccess = unit => ({
  type: UPDATE_NEW_METHOD_LIST_SUCCESS,
  payload: unit,
});

export const updateMethodListFail = error => ({
  type: UPDATE_NEW_METHOD_LIST_FAIL,
  payload: error,
});
//////////////analyte////////////
export const getAnalytelist = () => ({
  type: GET_ANALYTE_LIST,
  payload: {},
});

export const getAnalytelistSuccess = (MethodList) => {
  console.log("MethodList response in success action:", MethodList); 
  return {
    type: GET_ANALYTE_LIST_SUCCESS,
    payload: MethodList,
  };
};

export const getAnalytelistFail = (error) => {
  console.log("Error response in fail action:", error); 
  return {
    type: GET_ANALYTE_LIST_FAIL,
    payload: error,
  };
};


export const addNewAnalyteList = (createUnit, id) => ({
  type: ADD_NEW_ANALYTE_LIST,
  payload: { createUnit, id },
});

export const addNewAnalyteListSuccess = createUnit => ({
  type: ADD_NEW_ANALYTE_LIST_SUCCESS,
  payload: createUnit,
});

export const addNewAnalyteListFail = error => ({
  type: ADD_NEW_ANALYTE_LIST_FAIL,
  payload: error,
});

export const updateAnalyteList = unit => ({
  type: UPDATE_NEW_ANALYTE_LIST,
  payload: unit,
});

export const updateAnalyteListSuccess = unit => ({
  type: UPDATE_NEW_ANALYTE_LIST_SUCCESS,
  payload: unit,
});

export const updateAnalyteListFail = error => ({
  type: UPDATE_NEW_ANALYTE_LIST_FAIL,
  payload: error,
});
/////////////////instrument///////////
export const getinstrumenttypelist = () => ({
  type: GET_INSTRUMENT_TYPE_LIST,
  payload: {},
});

export const getinstrumenttypelistSuccess = (ListUnit) => {
  console.log("ListUnit response in success action:", ListUnit); // Log the ListUnit payload
  return {
    type: GET_INSTRUMENT_TYPE_LIST_SUCCESS,
    payload: ListUnit,
  };
};

export const getinstrumenttypelistFail = (error) => {
  console.log("Error response in fail action:", error); // Log the error payload
  return {
    type: GET_INSTRUMENT_TYPE_LIST_FAIL,
    payload: error,
  };
};


export const addNewInstrumentType = (createUnit, id) => ({
  type: ADD_NEW_INSTRUMENT_TYPE,
  payload: { createUnit, id },
});

export const addNewInstrumentTypeSuccess = createUnit => ({
  type: ADD_NEW_INSTRUMENT_TYPE_SUCCESS,
  payload: createUnit,
});

export const addNewInstrumentTypeFail = error => ({
  type: ADD_NEW_INSTRUMENT_TYPE_FAIL,
  payload: error,
});

export const updateNewInstrumentType = unit => ({
  type: UPDATE_NEW_INSTRUMENT_TYPE,
  payload: unit,
});

export const updateNewInstrumentTypeSuccess = unit => ({
  type: UPDATE_NEW_INSTRUMENT_TYPE_SUCCESS,
  payload: unit,
});

export const updateNewInstrumentTypeFail = error => ({
  type: UPDATE_NEW_INSTRUMENT_TYPE_FAIL,
  payload: error,
});

