import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_MANUFACTURAL_LIST, ADD_NEW_MANUFACTURAL , UPDATE_MANUFACTURAL, DELETE_MANUFACTURER } from "./actionTypes";

import { getManufacturalListSuccess, getManufacturalListFail, addNewManufacturalSuccess, addNewManufacturalFail, updateManufacturalSuccess, updateManufacturalFail, deleteManufacturerSuccess, deleteManufacturerFail } from "./actions";

//Include Both Helper File with needed methods
import { getManufacturalList, addNewManufactural, updateManufactural,deleteManufacturer } from "../../helpers/django_api_helper";

function* fetchManufacturalList(object) {
  try {
    const response = yield call(getManufacturalList, object.payload);
    yield put(getManufacturalListSuccess(response.data));
  } catch (error) {
    yield put(getManufacturalListFail(error));
  }
}
function* onAddNewManufactural(object) {
  try {
    const response = yield call(
      addNewManufactural,
      object.payload.createManufactural,
      object.payload.id
    );
    yield put(addNewManufacturalSuccess(response));
  } catch (error) {
    yield put(addNewManufacturalFail(error));
  }
}
function* onUpdateManufactural({ payload: manufactural }) {
  try {
    const response = yield call(updateManufactural, manufactural);
    yield put(updateManufacturalSuccess(response));
  } catch (error) {
    yield put(updateManufacturalFail(error));
  }
}
function* onDeleteManufactural({ payload: Analyte }) {
  try {
    const response = yield call(deleteManufacturer, Analyte);
    yield put(deleteManufacturerSuccess(response));
  } catch (error) {
    yield put(deleteManufacturerFail(error));
  }
}

function* ManufacturalListSaga() {
  yield takeEvery(GET_MANUFACTURAL_LIST, fetchManufacturalList);
  yield takeEvery(ADD_NEW_MANUFACTURAL, onAddNewManufactural );
  yield takeEvery(UPDATE_MANUFACTURAL, onUpdateManufactural);
  yield takeEvery(DELETE_MANUFACTURER, onDeleteManufactural);
}

export default ManufacturalListSaga;
