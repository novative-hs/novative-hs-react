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
  DELETE_INSTRUMENT_TYPE,
  DELETE_INSTRUMENT_TYPE_SUCCESS,
  DELETE_INSTRUMENT_TYPE_FAIL,
  DELETE_ANALYTE,
  DELETE_ANALYTE_SUCCESS,
  DELETE_ANALYTE_FAIL,
  GET_ANALYTE_LIST,
  GET_ANALYTE_LIST_SUCCESS,
  GET_ANALYTE_LIST_FAIL,
  GET_ANALYTEFORSCHEME_LIST,
  GET_ANALYTEFORSCHEME_LIST_SUCCESS,
  GET_ANALYTEFORSCHEME_LIST_FAIL,
  ADD_NEW_ANALYTE_LIST,
  ADD_NEW_ANALYTE_LIST_SUCCESS,
  ADD_NEW_ANALYTE_LIST_FAIL,
  UPDATE_NEW_ANALYTE_LIST,
  UPDATE_NEW_ANALYTE_LIST_SUCCESS,
  UPDATE_NEW_ANALYTE_LIST_FAIL,
  ADD_EQUIPMENTTYPE_FILE,
  ADD_EQUIPMENTTYPE_FILE_SUCCESS,
  ADD_EQUIPMENTTYPE_FILE_FAIL,
  GET_SCHEMEANALYTE_LIST,
  GET_SCHEMEANALYTE_LIST_SUCCESS,
  GET_SCHEMEANALYTE_LIST_FAIL,
  ADD_NEW_SCHEMEANALYTE,
  ADD_NEW_SCHEMEANALYTE_SUCCESS,
  ADD_NEW_SCHEMEANALYTE_FAIL,
  UPDATE_SCHEMEANALYTE,
  UPDATE_SCHEMEANALYTE_SUCCESS,
  UPDATE_SCHEMEANALYTE_FAIL,


//Cycle Analyte
  GET_ANALYTESCYCLES,
  GET_ANALYTESCYCLES_SUCCESS,
  GET_ANALYTESCYCLES_FAIL,

// Sample Analyte
  GET_SAMPLE_ANALYTE_LIST,
  GET_SAMPLE_ANALYTE_LIST_SUCCESS,
  GET_SAMPLE_ANALYTE_LIST_FAIL,
  ADD_NEW_SAMPLE_ANALYTE,
  ADD_NEW_SAMPLE_ANALYTE_SUCCESS,
  ADD_NEW_SAMPLE_ANALYTE_FAIL,
  UPDATE_SAMPLE_ANALYTE,
  UPDATE_SAMPLE_ANALYTE_SUCCESS,
  UPDATE_SAMPLE_ANALYTE_FAIL
} from "./actionTypes";


// equipment type file upload
export const addEquipmentTypefile = (EquipmentData, id) => (
  console.log("data file", EquipmentData),
  {
  type: ADD_EQUIPMENTTYPE_FILE,
  payload: { EquipmentData, id},
});

export const addEquipmentTypefileSuccess = EquipmentData => ({
  type: ADD_EQUIPMENTTYPE_FILE_SUCCESS,
  payload: EquipmentData,
});

export const addEquipmentTypefileFail = error => (
  {
  type: ADD_EQUIPMENTTYPE_FILE_FAIL,
  payload: error,
});

//////////////Analyte for scheme////////////
export const getAnalyteforSchemelist = (id) => ({
  type: GET_ANALYTEFORSCHEME_LIST,
  payload: id,
});

export const getAnalyteforSchemelistSuccess = (AnalyteList) => {
  console.log("Analyte response in success action:", AnalyteList); 
  return {
    type: GET_ANALYTEFORSCHEME_LIST_SUCCESS,
    payload: AnalyteList,
  };
};

export const getAnalyteforSchemelistFail = (error) => {
  console.log("Error response in fail action:", error); 
  return {
    type: GET_ANALYTEFORSCHEME_LIST_FAIL,
    payload: error,
  };
};


//////////////Analyte////////////
export const getAnalytelist = (id) => ({
  type: GET_ANALYTE_LIST,
  payload: id,
});

export const getAnalytelistSuccess = (AnalyteList) => {
  console.log("Analyte response in success action:", AnalyteList); 
  return {
    type: GET_ANALYTE_LIST_SUCCESS,
    payload: AnalyteList,
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

//delete analyte Action
export const deleteAnalyte = Analyte => ({
  type: DELETE_ANALYTE,
  payload: Analyte,
});

export const deleteAnalyteSuccess = Analyte => ({
  type: DELETE_ANALYTE_SUCCESS,
  payload: Analyte,
});

export const deleteAnalyteFail = error => ({
  type: DELETE_ANALYTE_FAIL,
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
export const deleteInstrumentType = InstrumentType => ({
  type: DELETE_INSTRUMENT_TYPE,
  payload: InstrumentType,
});

export const deleteInstrumentTypeSuccess = InstrumentType => ({
  type: DELETE_INSTRUMENT_TYPE_SUCCESS,
  payload: InstrumentType,
});

export const deleteInstrumentTypeFail = error => ({
  type: DELETE_INSTRUMENT_TYPE_FAIL,
  payload: error,
});



// Get Scheme Analytes
export const getSchemeAnalytelist = (id) => ({
  type: GET_SCHEMEANALYTE_LIST,
  payload: id,
});

export const getSchemeAnalytelistSuccess = SchemeAnalyteList => ({
  type: GET_SCHEMEANALYTE_LIST_SUCCESS,
  payload: SchemeAnalyteList,
});

export const getSchemeAnalytelistFail = error => ({
  type: GET_SCHEMEANALYTE_LIST_FAIL,
  payload: error,
});
//Add  Scheme Analytes
export const addNewSchemeAnalytelist = (createSchemeAnalyte, id) => ({
  type: ADD_NEW_SCHEMEANALYTE,
  payload: { createSchemeAnalyte, id },
});

export const addNewSchemeAnalytelistSuccess = createSchemeAnalyte => ({
  type: ADD_NEW_SCHEMEANALYTE_SUCCESS,
  payload: createSchemeAnalyte,
});

export const addNewSchemeAnalytelistFail = error => ({
  type: ADD_NEW_SCHEMEANALYTE_FAIL,
  payload: error,
});
//Update  Scheme Analytes
export const updateSchemeAnalytelist = schemeanalyte => {
  console.log('action creator called with schemeanalyte:', schemeanalyte);
  return {
    type: UPDATE_SCHEMEANALYTE,
    payload: schemeanalyte,
  };
};
export const updateSchemeAnalytelistSuccess = schemeanalyte => ({
  type: UPDATE_SCHEMEANALYTE_SUCCESS,
  payload: schemeanalyte,
});

export const updateSchemeAnalytelistFail = error => ({
  type: UPDATE_SCHEMEANALYTE_FAIL,
  payload: error,
});



///Get Analytes Associated With Cycle
export const getAnalyteCycle = (id) => ({
  type: GET_ANALYTESCYCLES,
  payload: id,
});

export const getAnalyteCycleSuccess = CycleAnalyte => ({
  type: GET_ANALYTESCYCLES_SUCCESS,
  payload: CycleAnalyte,
});

export const getAnalyteCycleFail = error => ({
  type: GET_ANALYTESCYCLES_FAIL,
  payload: error,
});


// Get Sample Analyte
export const getSampleAnalytelist = (id) => ({
  type: GET_SAMPLE_ANALYTE_LIST,
  payload: id,
});

export const getSampleAnalytelistSuccess = SampleAnalyteList => (
  console.log("data in actionsffffffffffffffffff", SampleAnalyteList ),
  {
  type: GET_SAMPLE_ANALYTE_LIST_SUCCESS,
  payload: SampleAnalyteList,
});

export const getSampleAnalytelistFail = error => (
  console.log("data in actionsffffffffffffffffff", error ),
  {
  type: GET_SAMPLE_ANALYTE_LIST_FAIL,
  payload: error,
});
//Add  Sample Analyte
export const addNewSampleAnalytelist = (createSampleAnalyte, id) => ({
  type: ADD_NEW_SAMPLE_ANALYTE,
  payload: { createSampleAnalyte, id },
});

export const addNewSampleAnalytelistSuccess = createSampleAnalyte => ({
  type: ADD_NEW_SAMPLE_ANALYTE_SUCCESS,
  payload: createSampleAnalyte,
});

export const addNewSampleAnalytelistFail = error => ({
  type: ADD_NEW_SAMPLE_ANALYTE_FAIL,
  payload: error,
});
//Update  Sample Analyte
export const updateSampleAnalytelist = schemeanalyte => {
  console.log('action creator called with schemeanalyte:', schemeanalyte);
  return {
    type: UPDATE_SAMPLE_ANALYTE,
    payload: schemeanalyte,
  };
};
export const updateSampleAnalytelistSuccess = schemeanalyte => ({
  type: UPDATE_SAMPLE_ANALYTE_SUCCESS,
  payload: schemeanalyte,
});

export const updateSampleAnalytelistFail = error => ({
  type: UPDATE_SAMPLE_ANALYTE_FAIL,
  payload: error,
});

