import {
    GET_UNITS_LIST,
    GET_UNITS_LIST_FAIL,
    GET_UNITS_LIST_SUCCESS,
    ADD_NEW_UNITS,
    ADD_NEW_UNITS_SUCCESS,
    ADD_NEW_UNITS_FAIL,
    UPDATE_UNITS,
    UPDATE_UNITS_SUCCESS,
    UPDATE_UNITS_FAIL,
    GET_ANALYTESUNITS,
    GET_ANALYTESUNITS_SUCCESS,
    GET_ANALYTESUNITS_FAIL,

    GET_ANALYTESUNITS_LIST,
    GET_ANALYTESUNITS_LIST_SUCCESS,
    GET_ANALYTESUNITS_LIST_FAIL,
    ADD_NEW_ANALYTESUNITS,
    ADD_NEW_ANALYTESUNITS_SUCCESS,
    ADD_NEW_ANALYTESUNITS_FAIL,
    UPDATE_ANALYTESUNITS,
    UPDATE_ANALYTESUNITS_SUCCESS,
    UPDATE_ANALYTESUNITS_FAIL

  } from "./actionTypes";
///get analytes associated with unit
  export const getAnalyteUnit = (id) => ({
    type: GET_ANALYTESUNITS,
    payload: id,
  });
  
  export const getAnalyteUnitSuccess = UnitAnalyte => ({
    type: GET_ANALYTESUNITS_SUCCESS,
    payload: UnitAnalyte,
  });
  
  export const getAnalyteUnitFail = error => ({
    type: GET_ANALYTESUNITS_FAIL,
    payload: error,
  });

// get  Analyte units
export const getAnalyteUnitlist = (id) => ({
  type: GET_ANALYTESUNITS_LIST,
  payload: id,
});

export const getAnalyteUnitlistSuccess = UnitAnalyteList => ({
  type: GET_ANALYTESUNITS_LIST_SUCCESS,
  payload: UnitAnalyteList,
});

export const getAnalyteUnitlistFail = error => ({
  type: GET_ANALYTESUNITS_LIST_FAIL,
  payload: error,
});
//Add  Analyte units
export const addNewAnalyteUnitlist = (createAnalyteUnit, id) => ({
  type: ADD_NEW_ANALYTESUNITS,
  payload: { createAnalyteUnit, id },
});

export const addNewAnalyteUnitlistSuccess = createAnalyteUnit => ({
  type: ADD_NEW_ANALYTESUNITS_SUCCESS,
  payload: createAnalyteUnit,
});

export const addNewAnalyteUnitlistFail = error => ({
  type: ADD_NEW_ANALYTESUNITS_FAIL,
  payload: error,
});
//Update  Analyte units
export const updateAnalyteUnitlist = analytesunit => {
  console.log('action creator called with analytesunit:', analytesunit);
  return {
    type: UPDATE_ANALYTESUNITS,
    payload: analytesunit,
  };
};
export const updateAnalyteUnitlistSuccess = analytesunit => ({
  type: UPDATE_ANALYTESUNITS_SUCCESS,
  payload: analytesunit,
});

export const updateAnalyteUnitlistFail = error => ({
  type: UPDATE_ANALYTESUNITS_FAIL,
  payload: error,
});


  // get Units Action
  export const getunitlist = (id) => ({
    type: 'GET_UNITS_LIST',
    payload: id,
  });
  
  export const getunitlistSuccess = ListUnits => ({
    type: GET_UNITS_LIST_SUCCESS,
    payload: ListUnits,
  });
  
  export const getunitlistFail = error => ({
    type: GET_UNITS_LIST_FAIL,
    payload: error,
  });
  //Add  Units Action
  export const addNewUnit = (createUnit, id) => ({
    type: ADD_NEW_UNITS,
    payload: { createUnit, id },
  });

  export const addNewUnitSuccess = createUnit => ({
    type: ADD_NEW_UNITS_SUCCESS,
    payload: createUnit,
  });
  
  export const addNewUnitFail = error => ({
    type: ADD_NEW_UNITS_FAIL,
    payload: error,
  });
  //Update  Units Action
  export const updateUnits = unit => {
    return {
      type: UPDATE_UNITS,
      payload: unit,
    };
  };
  
  export const updateUnitsSuccess = unit => ({
    type: UPDATE_UNITS_SUCCESS,
    payload: unit,
  });
  
  export const updateUnitsFail = error => ({
    type: UPDATE_UNITS_FAIL,
    payload: error,
  });

  
