import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_ANALYTESREAGENTS,GET_ANALYTESMETHODS,GET_INSTRUMENTSINTYPE,GET_ANALYTESUNITS,GET_UNITS_LIST, ADD_NEW_UNITS , UPDATE_UNITS,GET_ANALYTESUNITS_LIST,ADD_NEW_ANALYTESUNITS,UPDATE_ANALYTESUNITS, GET_ANALYTESINSTRUMENTS, GET_INSTRUMENTSINMANUFACTURER, GET_REAGENTSINMANUFACTURER } from "./actionTypes";

import { getAnalyteReagentFail,getAnalyteReagentSuccess,getAnalyteMethodFail,getAnalyteMethodSuccess,getInstrumentsInTypeSuccess,getInstrumentsInTypeFail,getAnalyteUnitSuccess,getAnalyteUnitFail,getunitlistSuccess, getunitlistFail, addNewUnitSuccess, addNewUnitFail, updateUnitsSuccess, updateUnitsFail ,getAnalyteUnitlistSuccess,getAnalyteUnitlistFail,addNewAnalyteUnitlistSuccess, addNewAnalyteUnitlistFail,updateAnalyteUnitlistSuccess,updateAnalyteUnitlistFail, getAnalyteInstrumentSuccess, getAnalyteInstrumentFail, getInstrumentsInManufacturerSuccess, getInstrumentsInManufacturerFail, getReagentsInManufacturerSuccess, getReagentsInManufacturerFail} from "./actions";

//Include Both Helper File with needed methods
import { getAnalyteInstrument,getAnalyteReagent,getAnalyteMethod,instrumentsintype,instrumentsinmaufacturer,getAnalyteUnit,getUnitsList, addNewCreateUnits, updateUnits,getAnalyteUnitlist,addNewAnalyteUnitlist,updateAnalyteUnitlist, reagentsinmaufacturer } from "../../helpers/django_api_helper";


///get instrumentsin MANUFACTURER
function* fetchReagentInManufacturer(object) {
  try {
    const response = yield call(reagentsinmaufacturer, object.payload);
    console.log("Saga - API Response:", response); // Log the full API response

    const reagents = response?.data || []; // Extract reagents array
    const manufacturerName = response?.manufacturer_name || "Unknown Manufacturer"; // Extract manufacturer name

    const transformedResponse = {
      data: reagents,
      manufacturerName: manufacturerName,
    };

    console.log("Saga - Transformed Response:", transformedResponse); // Log transformed response

    yield put(getReagentsInManufacturerSuccess(transformedResponse));
  } catch (error) {
    console.error("Saga - Error Fetching Reagents:", error.message, error.stack);
    yield put(getReagentsInManufacturerFail(error));
  }
}

///get instrumentsin MANUFACTURER
function* fetchInstrumentInManufacturer(object) {
  try {
    console.log("Saga - Payload for API Call:", object.payload);

    // Call the API
    const response = yield call(instrumentsinmaufacturer, object.payload);
    console.log("Saga - API Response:", response); // Log the raw response

    // Extract fields directly from response
    const instruments = response?.data || []; // Directly access response.data
    const manufacturerName = response?.manufacturer_name || "Unknown Manufacturer"; // Directly access response.manufacturer_name

    console.log("Saga - Extracted Instruments:", instruments);
    console.log("Saga - Extracted Manufacturer Name:", manufacturerName);

    // Prepare the transformed response
    const transformedResponse = {
      data: instruments,
      manufacturerName: manufacturerName,
    };

    console.log("Saga - Transformed Response:", transformedResponse); // Log transformed response

    // Dispatch success action
    yield put(getInstrumentsInManufacturerSuccess(transformedResponse));
  } catch (error) {
    console.error("Saga - Error Fetching Instruments:", error.message, error.stack); // Log error details
    yield put(getInstrumentsInManufacturerFail(error));
  }
}



///get instrumentsin instrument type
function* fetchInstrumentsInType(object) {
  try {
    console.log("Saga - Payload for API Call:", object.payload); // Log the payload

    // Make the API call
    const response = yield call(instrumentsintype, object.payload);
    console.log("Saga - API Raw Response:", response); // Log the full response object

    // Validate the response structure
    if (!response || typeof response.instrument_type_name === "undefined" || !Array.isArray(response.instruments)) {
      console.error("Saga - API Response is undefined or malformed:", response);
      yield put(getInstrumentsInTypeFail("API Response is undefined or malformed"));
      return;
    }

    // Extract data
    const {
      instrument_type_name = "Unknown Equipment Type",
      instruments = [],
    } = response;

    console.log("Saga - Extracted Instrument Type Name:", instrument_type_name);
    console.log("Saga - Extracted Instruments:", instruments);

    // Dispatch success action
    yield put(
      getInstrumentsInTypeSuccess({
        equipmentTypeName: instrument_type_name,
        instruments,
      })
    );
  } catch (error) {
    console.error("Saga - Error in fetchInstrumentInType:", error.message, error.stack);
    yield put(getInstrumentsInTypeFail(error.message || "Unknown error occurred"));
  }
}




///////analytes associated with method
function* fetchAnalyteMethods(object) {
  try {
    console.log("Saga - Payload for API Call:", object.payload);

    const response = yield call(getAnalyteMethod, object.payload);
    console.log("Saga - API Response:", response);

    // Extract analytes and method name from response
    const analytes = response?.data || [];
    const methodName = response?.method_name || "Unknown Method";

    const transformedResponse = {
      analytes,
      methodName,
    };

    console.log("Saga - Transformed Response:", transformedResponse);

    // Dispatch success action
    yield put(getAnalyteMethodSuccess(transformedResponse));
  } catch (error) {
    console.error("Saga - Error Fetching Analyte Methods:", error.message, error.stack);
    yield put(getAnalyteMethodFail(error));
  }
}


///////analytes associated with instrument
function* fetchAnalyteInstruments(object) {
  try {
    console.log("Saga - Payload for API Call:", object.payload);

    const response = yield call(getAnalyteInstrument, object.payload);
    console.log("Saga - API Response:", response);

    const analytes = response?.data || []; // Ensure it's an array
    const instrumentName = response?.instrument_name || "Unknown Instrument";

    const transformedResponse = {
      data: analytes,
      instrumentName: instrumentName,
    };

    console.log("Saga - Transformed Response:", transformedResponse);

    yield put(getAnalyteInstrumentSuccess(transformedResponse));
  } catch (error) {
    console.error("Saga - Error Fetching Analytes:", error.message, error.stack);
    yield put(getAnalyteInstrumentFail(error));
  }
}


///////analytes associated with reagent
function* fetchAnalyteReagents(object) {
  try {
    console.log("Saga - Payload for API Call:", object.payload);

    const response = yield call(getAnalyteReagent, object.payload);
    console.log("Saga - API Response:", response);

    // Extract data from response
    const analytes = response?.data || [];
    const reagentName = response?.reagent_name || "Unknown Reagent";

    const transformedResponse = {
      analytes,
      reagentName,
    };

    console.log("Saga - Transformed Response:", transformedResponse);

    // Dispatch success action
    yield put(getAnalyteReagentSuccess(transformedResponse));
  } catch (error) {
    console.error("Saga - Error Fetching Reagent Analytes:", error.message, error.stack);
    yield put(getAnalyteReagentFail(error));
  }
}

///////analytes associated with unit
function* fetchAnalyteUnits(object) {
  try {
    // Call the API and get the response
    const response = yield call(getAnalyteUnit, object.payload);

    // Extract `unit_name` and `analytes` from the API response
    const { unit_name, analytes } = response.data;

    console.log("Saga - API Response for Unit Analytes:", response.data); // Debugging log
    console.log("Saga - Extracted Unit Name:", unit_name);
    console.log("Saga - Extracted Analytes:", analytes);

    // Dispatch the success action with structured payload
    yield put(getAnalyteUnitSuccess({ unitName: unit_name, analytes }));
  } catch (error) {
    console.error("Saga - Error in fetchAnalyteUnits:", error);
    yield put(getAnalyteUnitFail(error));
  }
}

///analyte units
function* fetchAnalyteUnitsList(action) {
  try {
    const response = yield call(getAnalyteUnitlist, action.payload);
    console.log("Saga - Dispatching success with:", response.data);
    yield put(getAnalyteUnitlistSuccess(response.data));
  } catch (error) {
    console.error("Saga - Error:", error);
    yield put(getAnalyteUnitlistFail(error));
  }
}

function* onAddNewAnalyteUnits(object) {
  try {
    const response = yield call(
      addNewAnalyteUnitlist,
      object.payload.createAnalyteUnit,
      object.payload.id
    );
    yield put(addNewAnalyteUnitlistSuccess(response));
  } catch (error) {
    yield put(addNewAnalyteUnitlistFail(error));
  }
}
function* onUpdateAnalyteUnits({ payload: analytesunit }) {
  try {
    const response = yield call(updateAnalyteUnitlist, analytesunit);
    yield put(updateAnalyteUnitlistSuccess(response));
  } catch (error) {
    yield put(updateAnalyteUnitlistFail (error));
  }
}
////
function* fetchUnitsList(object) {
  try {
    const response = yield call(getUnitsList, object.payload);
    yield put(getunitlistSuccess(response.data));
  } catch (error) {
    yield put(getunitlistFail(error));
  }
}
function* onAddNewUnit(object) {
  try {
    const response = yield call(
      addNewCreateUnits,
      object.payload.createUnit,
      object.payload.id
    );
    yield put(addNewUnitSuccess(response));
  } catch (error) {
    yield put(addNewUnitFail(error));
  }
}
function* onUpdateUnits({ payload: unit }) {
  try {
    const response = yield call(updateUnits, unit);
    yield put(updateUnitsSuccess(response));
  } catch (error) {
    yield put(updateUnitsFail (error));
  }
}


function* UnitsListSaga() {

  yield takeEvery(GET_ANALYTESUNITS_LIST, fetchAnalyteUnitsList);
  yield takeEvery(ADD_NEW_ANALYTESUNITS, onAddNewAnalyteUnits );
  yield takeEvery(UPDATE_ANALYTESUNITS, onUpdateAnalyteUnits);

  yield takeEvery(GET_ANALYTESMETHODS, fetchAnalyteMethods);
  yield takeEvery(GET_ANALYTESINSTRUMENTS, fetchAnalyteInstruments);
  yield takeEvery(GET_ANALYTESREAGENTS, fetchAnalyteReagents);
  yield takeEvery(GET_ANALYTESUNITS, fetchAnalyteUnits);
  yield takeEvery(GET_INSTRUMENTSINTYPE, fetchInstrumentsInType);
  yield takeEvery(GET_INSTRUMENTSINMANUFACTURER, fetchInstrumentInManufacturer);
  yield takeEvery(GET_REAGENTSINMANUFACTURER, fetchReagentInManufacturer);

  yield takeEvery(GET_UNITS_LIST, fetchUnitsList);
  yield takeEvery(ADD_NEW_UNITS, onAddNewUnit );
  yield takeEvery(UPDATE_UNITS, onUpdateUnits);
}

export default UnitsListSaga;
