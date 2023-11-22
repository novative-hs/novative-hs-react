import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  // GET_CEMPLOYEE_DATAS,
  ADD_NEW_CEMPLOYEE_DATA,
  UPDATE_CEMPLOYEE,
  GET_CEMPLOYEES,
} from "./actionTypes";

import {
  // getCreateCemployeesSuccess,
  // getCreateCemployeesFail,
  getCemployeesSuccess,
  getCemployeesFail,
  addCemployeeDataFail,
  addCemployeeDataSuccess,
  updateCemployeeSuccess,
  updateCemployeeFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  // getCreateCemployees,
  addNewCemployeeData,
  updateCemployee,
  getCemployees,
} from "../../helpers/django_api_helper";

// function* fetchCreateCemployees(object) {
//   try {
//     const response = yield call(getCreateCemployees, object.payload);
//     yield put(getCreateCemployeesSuccess(response));
//   } catch (error) {
//     yield put(getCreateCemployeesFail(error));
//   }
// }
function* fetchCemployees() {
  try {
    const response = yield call(getCemployees);
    yield put(getCemployeesSuccess(response));
  } catch (error) {
    yield put(getCemployeesFail(error));
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
  // yield takeEvery(GET_CEMPLOYEE_DATAS, fetchCreateCemployees);
  yield takeEvery(GET_CEMPLOYEES, fetchCemployees);
  yield takeEvery(ADD_NEW_CEMPLOYEE_DATA, onAddNewCemployeeData);
  yield takeEvery(UPDATE_CEMPLOYEE, onUpdateCemployee);

}

export default cemployeeDataSaga;
