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
    yield put(getReagentsInManufacturerSuccess(response.data));
  } catch (error) {
    yield put(getReagentsInManufacturerFail(error));
  }
}

///get instrumentsin MANUFACTURER
function* fetchInstrumentInManufacturer(object) {
  try {
    const response = yield call(instrumentsinmaufacturer, object.payload);
    yield put(getInstrumentsInManufacturerSuccess(response.data));
  } catch (error) {
    yield put(getInstrumentsInManufacturerFail(error));
  }
}
///get instrumentsin instrument type
function* fetchInstrumentInType(object) {
  try {
    const response = yield call(instrumentsintype, object.payload);
    yield put(getInstrumentsInTypeSuccess(response.data));
  } catch (error) {
    yield put(getInstrumentsInTypeFail(error));
  }
}

///////analytes associated with method
function* fetchAnalyteMethods(object) {
  try {
    const response = yield call(getAnalyteMethod, object.payload);
    yield put(getAnalyteMethodSuccess(response.data));
  } catch (error) {
    yield put(getAnalyteMethodFail(error));
  }
}

///////analytes associated with instrument
function* fetchAnalyteInstruments(object) {
  try {
    const response = yield call(getAnalyteInstrument, object.payload);
    yield put(getAnalyteInstrumentSuccess(response.data));
  } catch (error) {
    yield put(getAnalyteInstrumentFail(error));
  }
}

///////analytes associated with reagent
function* fetchAnalyteReagents(object) {
  try {
    const response = yield call(getAnalyteReagent, object.payload);
    yield put(getAnalyteReagentSuccess(response.data));
  } catch (error) {
    yield put(getAnalyteReagentFail(error));
  }
}
///////analytes associated with unit
function* fetchAnalyteUnits(object) {
  try {
    const response = yield call(getAnalyteUnit, object.payload);
    yield put(getAnalyteUnitSuccess(response.data));
  } catch (error) {
    yield put(getAnalyteUnitFail(error));
  }
}
///analyte units
function* fetchAnalyteUnitsList(object) {
  try {
    const response = yield call(getAnalyteUnitlist, object.payload);
    yield put(getAnalyteUnitlistSuccess(response.data));
  } catch (error) {
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
  yield takeEvery(GET_INSTRUMENTSINTYPE, fetchInstrumentInType);
  yield takeEvery(GET_INSTRUMENTSINMANUFACTURER, fetchInstrumentInManufacturer);
  yield takeEvery(GET_REAGENTSINMANUFACTURER, fetchReagentInManufacturer);

  yield takeEvery(GET_UNITS_LIST, fetchUnitsList);
  yield takeEvery(ADD_NEW_UNITS, onAddNewUnit );
  yield takeEvery(UPDATE_UNITS, onUpdateUnits);
}

export default UnitsListSaga;
