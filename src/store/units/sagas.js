import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_ANALYTESUNITS,GET_UNITS_LIST, ADD_NEW_UNITS , UPDATE_UNITS,GET_ANALYTESUNITS_LIST,ADD_NEW_ANALYTESUNITS,UPDATE_ANALYTESUNITS } from "./actionTypes";

import { getAnalyteUnitSuccess,getAnalyteUnitFail,getunitlistSuccess, getunitlistFail, addNewUnitSuccess, addNewUnitFail, updateUnitsSuccess, updateUnitsFail ,getAnalyteUnitlistSuccess,getAnalyteUnitlistFail,addNewAnalyteUnitlistSuccess, addNewAnalyteUnitlistFail,updateAnalyteUnitlistSuccess,updateAnalyteUnitlistFail} from "./actions";

//Include Both Helper File with needed methods
import { getAnalyteUnit,getUnitsList, addNewCreateUnits, updateUnits,getAnalyteUnitlist,addNewAnalyteUnitlist,updateAnalyteUnitlist } from "../../helpers/django_api_helper";

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

  yield takeEvery(GET_ANALYTESUNITS, fetchAnalyteUnits);

  yield takeEvery(GET_UNITS_LIST, fetchUnitsList);
  yield takeEvery(ADD_NEW_UNITS, onAddNewUnit );
  yield takeEvery(UPDATE_UNITS, onUpdateUnits);
}

export default UnitsListSaga;
