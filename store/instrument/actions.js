import {
  GET_INSTRUMENT_LIST,
  GET_INSTRUMENT_LIST_SUCCESS,
  GET_INSTRUMENT_LIST_FAIL,
  ADD_NEW_INSTRUMENT,
  ADD_NEW_INSTRUMENT_SUCCESS,
  ADD_NEW_INSTRUMENT_FAIL,
  UPDATE_INSTRUMENT,
  UPDATE_INSTRUMENT_SUCCESS,
  UPDATE_INSTRUMENT_FAIL,

  GET_ANALYTESEQUIPMENTS_LIST,
  GET_ANALYTESEQUIPMENTS_LIST_SUCCESS,
  GET_ANALYTESEQUIPMENTS_LIST_FAIL,
  ADD_NEW_ANALYTESEQUIPMENTS,
  ADD_NEW_ANALYTESEQUIPMENTS_SUCCESS,
  ADD_NEW_ANALYTESEQUIPMENTS_FAIL,
  UPDATE_ANALYTESEQUIPMENTS,
  UPDATE_ANALYTESEQUIPMENTS_SUCCESS,
  UPDATE_ANALYTESEQUIPMENTS_FAIL
} from "./actionTypes";


export const getAnalyteEquipmentlist = (id) => ({
  type: GET_ANALYTESEQUIPMENTS_LIST,
  payload: id,
});

export const getAnalyteEquipmentlistSuccess = EquipmentAnalyteList => ({
  type: GET_ANALYTESEQUIPMENTS_LIST_SUCCESS,
  payload: EquipmentAnalyteList,
});

export const getAnalyteEquipmentlistFail = error => ({
  type: GET_ANALYTESEQUIPMENTS_LIST_FAIL,
  payload: error,
});
//Add  Analyte Equipments
export const addNewAnalyteEquipmentlist = (createAnalyteEquipment, id) => ({
  type: ADD_NEW_ANALYTESEQUIPMENTS,
  payload: { createAnalyteEquipment, id },
});

export const addNewAnalyteEquipmentlistSuccess = createAnalyteEquipment => ({
  type: ADD_NEW_ANALYTESEQUIPMENTS_SUCCESS,
  payload: createAnalyteEquipment,
});

export const addNewAnalyteEquipmentlistFail = error => ({
  type: ADD_NEW_ANALYTESEQUIPMENTS_FAIL,
  payload: error,
});
//Update  Analyte Equipments
export const updateAnalyteEquipmentlist = analytesequipment => {
  console.log('action creator called with analytesequipment:', analytesequipment);
  return {
    type: UPDATE_ANALYTESEQUIPMENTS,
    payload: analytesequipment,
  };
};
export const updateAnalyteEquipmentlistSuccess = analytesequipment => ({
  type: UPDATE_ANALYTESEQUIPMENTS_SUCCESS,
  payload: analytesequipment,
});

export const updateAnalyteEquipmentlistFail = error => ({
  type: UPDATE_ANALYTESEQUIPMENTS_FAIL,
  payload: error,
});
//////////INSTRUMENT
export const getInstrumentlist = (id) => ({
  type: GET_INSTRUMENT_LIST,
  payload: id,
});

export const getInstrumentlistSuccess = (MethodList) => {
  console.log("Instrument response in success action:", MethodList); 
  return {
    type: GET_INSTRUMENT_LIST_SUCCESS,
    payload: MethodList,
  };
};

export const getInstrumentlistFail = (error) => {
  console.log("Error response in fail action:", error); 
  return {
    type: GET_INSTRUMENT_LIST_FAIL,
    payload: error,
  };
};


export const addNewInstrument = (createUnit, id) => ({
  type: ADD_NEW_INSTRUMENT,
  payload: { createUnit, id },
});

export const addNewInstrumentSuccess = createUnit => ({
  type: ADD_NEW_INSTRUMENT_SUCCESS,
  payload: createUnit,
});

export const addNewInstrumentFail = error => ({
  type: ADD_NEW_INSTRUMENT_FAIL,
  payload: error,
});

export const updateInstrument = unit => ({
  type: UPDATE_INSTRUMENT,
  payload: unit,
});

export const updateInstrumentSuccess = unit => ({
  type: UPDATE_INSTRUMENT_SUCCESS,
  payload: unit,
});

export const updateInstrumentFail = error => ({
  type: UPDATE_INSTRUMENT_FAIL,
  payload: error,
});


