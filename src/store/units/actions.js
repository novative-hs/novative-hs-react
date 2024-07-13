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
    GET_INSTRUMENTSINTYPE,
    GET_INSTRUMENTSINTYPE_SUCCESS,
    GET_INSTRUMENTSINTYPE_FAIL,
    GET_ANALYTESMETHODS,
    GET_ANALYTESMETHODS_SUCCESS,
    GET_ANALYTESMETHODS_FAIL,
    GET_ANALYTESREAGENTS,
    GET_ANALYTESREAGENTS_SUCCESS,
    GET_ANALYTESREAGENTS_FAIL,
    GET_ANALYTESINSTRUMENTS,
    GET_ANALYTESINSTRUMENTS_SUCCESS,
    GET_ANALYTESINSTRUMENTS_FAIL,
    GET_INSTRUMENTSINMANUFACTURER,
    GET_INSTRUMENTSINMANUFACTURER_SUCCESS,
    GET_INSTRUMENTSINMANUFACTURER_FAIL,
    GET_REAGENTSINMANUFACTURER,
    GET_REAGENTSINMANUFACTURER_SUCCESS,
    GET_REAGENTSINMANUFACTURER_FAIL,

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

///get instrumentsin instrument type
export const getInstrumentsInType = (id) => ({
  type: GET_INSTRUMENTSINTYPE,
  payload: id,
});

export const getInstrumentsInTypeSuccess = InstrumentsInType => ({
  type: GET_INSTRUMENTSINTYPE_SUCCESS,
  payload: InstrumentsInType,
});

export const getInstrumentsInTypeFail = error => ({
  type: GET_INSTRUMENTSINTYPE_FAIL,
  payload: error,
});

///get REAGENTS in Manufacturer
export const getReagentsInManufacturer = (id) => ({
  type: GET_REAGENTSINMANUFACTURER,
  payload: id,
});

export const getReagentsInManufacturerSuccess = ReagentsInManufacturer => ({
  type: GET_REAGENTSINMANUFACTURER_SUCCESS,
  payload: ReagentsInManufacturer,
});

export const getReagentsInManufacturerFail = error => ({
  type: GET_REAGENTSINMANUFACTURER_FAIL,
  payload: error,
});

///get instrumentsin Manufacturer
export const getInstrumentsInManufacturer = (id) => ({
  type: GET_INSTRUMENTSINMANUFACTURER,
  payload: id,
});

export const getInstrumentsInManufacturerSuccess = InstrumentsInManufacturer => ({
  type: GET_INSTRUMENTSINMANUFACTURER_SUCCESS,
  payload: InstrumentsInManufacturer,
});

export const getInstrumentsInManufacturerFail = error => ({
  type: GET_INSTRUMENTSINMANUFACTURER_FAIL,
  payload: error,
});
///get analytes associated with reagent
export const getAnalyteReagent = (id) => ({
  type: GET_ANALYTESREAGENTS,
  payload: id,
});

export const getAnalyteReagentSuccess = ReagentAnalyte => ({
  type: GET_ANALYTESREAGENTS_SUCCESS,
  payload: ReagentAnalyte,
});

export const getAnalyteReagentFail = error => ({
  type: GET_ANALYTESREAGENTS_FAIL,
  payload: error,
});
///get analytes associated with instruments
export const getAnalyteInstrument = (id) => ({
  type: GET_ANALYTESINSTRUMENTS,
  payload: id,
});

export const getAnalyteInstrumentSuccess = InstrumentAnalyte => ({
  type: GET_ANALYTESINSTRUMENTS_SUCCESS,
  payload: InstrumentAnalyte,
});

export const getAnalyteInstrumentFail = error => ({
  type: GET_ANALYTESINSTRUMENTS_FAIL,
  payload: error,
});
///get analytes associated with METHOD
export const getAnalyteMethod = (id) => ({
  type: GET_ANALYTESMETHODS,
  payload: id,
});

export const getAnalyteMethodSuccess = MethodAnalyte => ({
  type: GET_ANALYTESMETHODS_SUCCESS,
  payload: MethodAnalyte,
});

export const getAnalyteMethodFail = error => ({
  type: GET_ANALYTESMETHODS_FAIL,
  payload: error,
});

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

  
