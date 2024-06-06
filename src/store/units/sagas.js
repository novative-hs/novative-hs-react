import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_UNITS_LIST, ADD_NEW_UNITS , UPDATE_UNITS } from "./actionTypes";

import { getunitlistSuccess, getunitlistFail, addNewUnitSuccess, addNewUnitFail, updateUnitsSuccess, updateUnitsFail  } from "./actions";

//Include Both Helper File with needed methods
import { getUnitsList, addNewCreateUnits, updateUnits } from "../../helpers/django_api_helper";

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
  yield takeEvery(GET_UNITS_LIST, fetchUnitsList);
  yield takeEvery(ADD_NEW_UNITS, onAddNewUnit );
  yield takeEvery(UPDATE_UNITS, onUpdateUnits);
}

export default UnitsListSaga;
