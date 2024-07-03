import {
  GET_INSTRUMENT_LIST,
  GET_INSTRUMENT_LIST_SUCCESS,
  GET_INSTRUMENT_LIST_FAIL,
  ADD_NEW_INSTRUMENT,
  ADD_NEW_INSTRUMENT_SUCCESS,
  ADD_NEW_INSTRUMENT_FAIL,
  UPDATE_INSTRUMENT,
  UPDATE_INSTRUMENT_SUCCESS,
  UPDATE_INSTRUMENT_FAIL
} from "./actionTypes";

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


