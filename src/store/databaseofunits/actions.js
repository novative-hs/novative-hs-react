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
  GET_ANALYTE_LIST,
  GET_ANALYTE_LIST_SUCCESS,
  GET_ANALYTE_LIST_FAIL,
  ADD_NEW_ANALYTE_LIST,
  ADD_NEW_ANALYTE_LIST_SUCCESS,
  ADD_NEW_ANALYTE_LIST_FAIL,
  UPDATE_NEW_ANALYTE_LIST,
  UPDATE_NEW_ANALYTE_LIST_SUCCESS,
  UPDATE_NEW_ANALYTE_LIST_FAIL,


  GET_CYCLEANALYTE_LIST,
  GET_CYCLEANALYTE_LIST_SUCCESS,
  GET_CYCLEANALYTE_LIST_FAIL,
  ADD_NEW_CYCLEANALYTE,
  ADD_NEW_CYCLEANALYTE_SUCCESS,
  ADD_NEW_CYCLEANALYTE_FAIL,
  UPDATE_CYCLEANALYTE,
  UPDATE_CYCLEANALYTE_SUCCESS,
  UPDATE_CYCLEANALYTE_FAIL
} from "./actionTypes";


//////////////analyte////////////
export const getAnalytelist = (id) => ({
  type: GET_ANALYTE_LIST,
  payload: id,
});

export const getAnalytelistSuccess = (MethodList) => {
  console.log("Analyte response in success action:", MethodList); 
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
export const getinstrumenttypelist = (id) => ({
  type: GET_INSTRUMENT_TYPE_LIST,
  payload: id,
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




// Get Cycle Analytes
export const getCycleAnalytelist = (id) => ({
  type: GET_CYCLEANALYTE_LIST,
  payload: id,
});

export const getCycleAnalytelistSuccess = CycleAnalyteList => ({
  type: GET_CYCLEANALYTE_LIST_SUCCESS,
  payload: CycleAnalyteList,
});

export const getCycleAnalytelistFail = error => ({
  type: GET_CYCLEANALYTE_LIST_FAIL,
  payload: error,
});
//Add  Cycle Analytes
export const addNewCycleAnalytelist = (createCycleAnalyte, id) => ({
  type: ADD_NEW_CYCLEANALYTE,
  payload: { createCycleAnalyte, id },
});

export const addNewCycleAnalytelistSuccess = createCycleAnalyte => ({
  type: ADD_NEW_CYCLEANALYTE_SUCCESS,
  payload: createCycleAnalyte,
});

export const addNewCycleAnalytelistFail = error => ({
  type: ADD_NEW_CYCLEANALYTE_FAIL,
  payload: error,
});
//Update  Cycle Analytes
export const updateCycleAnalytelist = cycleanalyte => {
  console.log('action creator called with cycleanalyte:', cycleanalyte);
  return {
    type: UPDATE_CYCLEANALYTE,
    payload: cycleanalyte,
  };
};
export const updateCycleAnalytelistSuccess = cycleanalyte => ({
  type: UPDATE_CYCLEANALYTE_SUCCESS,
  payload: cycleanalyte,
});

export const updateCycleAnalytelistFail = error => ({
  type: UPDATE_CYCLEANALYTE_FAIL,
  payload: error,
});

