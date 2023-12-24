import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_LABCORPORATE,
  GET_EMPLOYEECORPORATE,
  ADD_NEW_CEMPLOYEE_DATA,
  UPDATE_CEMPLOYEE,
} from "./actionTypes";

import {
  getLabCorporateSuccess,
  getLabCorporateFail,
  getEmployeeCorporateSuccess,
  getEmployeeCorporateFail,
  addCemployeeDataFail,
  addCemployeeDataSuccess,
  updateCemployeeSuccess,
  updateCemployeeFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getLabCorporate,
  getEmployeeCorporate,
  addNewCemployeeData,
  updateCemployee,
} from "../../helpers/django_api_helper";

function* fetchLabCorporate(object) {
  try {
    const response = yield call(getLabCorporate, object.payload);
    yield put(getLabCorporateSuccess(response));
  } catch (error) {
    yield put(getLabCorporateFail(error));
  }
}
function* fetchEmployeeCorporate(object) {
  try {
    const response = yield call(getEmployeeCorporate, object.payload);
    yield put(getEmployeeCorporateSuccess(response));
  } catch (error) {
    yield put(getEmployeeCorporateFail(error));
  }
}

function* onAddNewCemployeeData(object) {
  try {
    const response = yield call(
      addNewCemployeeData,
      object.payload.cemployeeData,
      object.payload.id
    );
    yield put(addCemployeeDataSuccess(response));
  } catch (error) {
    yield put(addCemployeeDataFail(error));
  }
}
function* onUpdateCemployee({ payload: cemployee }) {
  try {
    const response = yield call(updateCemployee, cemployee);
    yield put(updateCemployeeSuccess(response));
  } catch (error) {
    yield put(updateCemployeeFail(error));
  }
}

function* cemployeeDataSaga() {
  yield takeEvery(GET_LABCORPORATE, fetchLabCorporate);
  yield takeEvery(GET_EMPLOYEECORPORATE, fetchEmployeeCorporate);
  yield takeEvery(ADD_NEW_CEMPLOYEE_DATA, onAddNewCemployeeData);
  yield takeEvery(UPDATE_CEMPLOYEE, onUpdateCemployee);

}

export default cemployeeDataSaga;
