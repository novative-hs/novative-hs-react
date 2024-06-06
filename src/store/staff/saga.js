import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_CSR_LIST,
  GET_TERRITORIES_LIST,
  GET_AUDITOR_LIST,
  GET_FINANCE_OFFICER_LIST,
  ADD_STAFF,
  UPDATE_STAFF,
  DELETE_STAFF,
} from "./actionTypes";

import {
  getCSRListSuccess,
  getCSRListFail,
  getDatabaseadminListSuccess,
  getDatabaseadminListFail,
  getFinanceOfficerListSuccess,
  getFinanceOfficerListFail,
  getAuditorListSuccess,
  getAuditorListFail,
  getRegistrationAdminListSuccess,
  getRegistrationAdminListFail,
  addStaffSuccess,
  addStaffFail,
  getTerritoriesListSuccess,
  getTerritoriesListFail,
  updateStaffSuccess,
  updateStaffFail,
  deleteStaffSuccess,
  deleteStaffFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getCSRList,
  getAuditorList,
  getRegistrationAdminList,
  addStaff,
  updateStaff,
  deleteStaff,
  getTerritoriesList,
} from "../../helpers/django_api_helper";

function* fetchCSRList() {
  try {
    const response = yield call(getCSRList);
    yield put(getCSRListSuccess(response));
  } catch (error) {
    yield put(getCSRListFail(error));
  }
}

function* fetchTerritoriesList(object) {
  try {
    const response = yield call(getTerritoriesList, object.payload);
    yield put(getTerritoriesListSuccess(response));
  } catch (error) {
    yield put(getTerritoriesListFail(error));
  }
}
function* fetchAuditorList() {
  try {
    const response = yield call(getAuditorList);
    yield put(getDatabaseadminListSuccess(response));
  } catch (error) {
    yield put(getDatabaseadminListFail(error));
  }
}

function* fetchFinanceOfficerList() {
  try {
    const response = yield call(getRegistrationAdminList);
    yield put(getRegistrationAdminListSuccess(response));
  } catch (error) {
    yield put(getRegistrationAdminListFail(error));
  }
}
function* onAddStaff({ payload: { staff, userID } }) {
  try {
    const response = yield call(addStaff, userID, staff);
    if (response.status == 400) {
      yield put(addStaffFail(response.message));
    } else {
      yield put(addStaffSuccess(response));
    }
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
  yield takeEvery(GET_TERRITORIES_LIST,fetchTerritoriesList);
}

export default staffSaga;
