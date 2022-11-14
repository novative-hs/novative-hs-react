import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_CSR_LIST,
  GET_AUDITOR_LIST,
  GET_FINANCE_OFFICER_LIST,
  ADD_STAFF,
  UPDATE_STAFF,
  DELETE_STAFF,
} from "./actionTypes";

import {
  getCSRListSuccess,
  getCSRListFail,
  getAuditorListSuccess,
  getAuditorListFail,
  getFinanceOfficerListSuccess,
  getFinanceOfficerListFail,
  addStaffSuccess,
  addStaffFail,
  updateStaffSuccess,
  updateStaffFail,
  deleteStaffSuccess,
  deleteStaffFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getCSRList,
  getAuditorList,
  getFinanceOfficerList,
  addStaff,
  updateStaff,
  deleteStaff,
} from "../../helpers/django_api_helper";

function* fetchCSRList() {
  try {
    const response = yield call(getCSRList);
    yield put(getCSRListSuccess(response));
  } catch (error) {
    yield put(getCSRListFail(error));
  }
}

function* fetchAuditorList() {
  try {
    const response = yield call(getAuditorList);
    yield put(getAuditorListSuccess(response));
  } catch (error) {
    yield put(getAuditorListFail(error));
  }
}

function* fetchFinanceOfficerList() {
  try {
    const response = yield call(getFinanceOfficerList);
    yield put(getFinanceOfficerListSuccess(response));
  } catch (error) {
    yield put(getFinanceOfficerListFail(error));
  }
}

function* onAddStaff(object) {
  try {
    const response = yield call(
      addStaff,
      object.payload.staff,
      object.payload.id
    );
    yield put(addStaffSuccess(response.data));
  } catch (error) {
    yield put(addStaffFail(error));
  }
}

function* onUpdateStaff({ payload: staff }) {
  try {
    const response = yield call(updateStaff, staff);
    yield put(updateStaffSuccess(response));
  } catch (error) {
    yield put(updateStaffFail(error));
  }
}

function* onDeleteStaff({ payload: staff }) {
  try {
    const response = yield call(deleteStaff, staff);
    yield put(deleteStaffSuccess(response));
  } catch (error) {
    yield put(deleteStaffFail(error));
  }
}

function* staffSaga() {
  yield takeEvery(GET_CSR_LIST, fetchCSRList);
  yield takeEvery(GET_AUDITOR_LIST, fetchAuditorList);
  yield takeEvery(GET_FINANCE_OFFICER_LIST, fetchFinanceOfficerList);
  yield takeEvery(ADD_STAFF, onAddStaff);
  yield takeEvery(UPDATE_STAFF, onUpdateStaff);
  yield takeEvery(DELETE_STAFF, onDeleteStaff);
}

export default staffSaga;
