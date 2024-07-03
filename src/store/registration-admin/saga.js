import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {

  GET_PENDING_LABS,
  GET_APPROVED_LABS,
  GET_UNAPPROVED_LABS,
  APPROVE_UNAPPROVE_LAB,

} from "./actionTypes";

import {
  getPendingLabsSuccess,
  getPendingLabsFail,
  getApprovedLabsSuccess,
  getApprovedLabsFail,
  getUnapprovedLabsSuccess,
  getUnapprovedLabsFail,
  approveUnapproveLabSuccess,
  approveUnapproveLabFail,

 
} from "./actions";

//Include Both Helper File with needed methods
import {
  getPendingLabs,
  approveUnapproveLab,
  getApprovedLabs,
  getUnapprovedLabs,
 

} from "../../helpers/django_api_helper";

function* fetchPendingLabs(action) {
  try {
    const response = yield call(getPendingLabs, action.payload);
    yield put(getPendingLabsSuccess(response));
  } catch (error) {
    yield put(getPendingLabsFail(error));
  }
}

function* fetchApprovedLabs(action) {
  try {
    const response = yield call(getApprovedLabs, action.payload);
    yield put(getApprovedLabsSuccess(response));
  } catch (error) {
    yield put(getApprovedLabsFail(error));
  }
}

function* fetchUnapprovedLabs(action) {
  try {
    const response = yield call(getUnapprovedLabs, action.payload);
    yield put(getUnapprovedLabsSuccess(response));
  } catch (error) {
    yield put(getUnapprovedLabsFail(error));
  }
}

function* onApproveUnapproveLab(object) {
  try {
    const response = yield call(approveUnapproveLab, object.payload.data);
    yield put(approveUnapproveLabSuccess(response));
  } catch (error) {
    yield put(approveUnapproveLabFail(error));
  }
}




function* registrationAdminSaga() {
  yield takeEvery(GET_PENDING_LABS, fetchPendingLabs);
  yield takeEvery(GET_APPROVED_LABS, fetchApprovedLabs);
  yield takeEvery(GET_UNAPPROVED_LABS, fetchUnapprovedLabs);
  yield takeEvery(APPROVE_UNAPPROVE_LAB, onApproveUnapproveLab);

 
}

export default registrationAdminSaga;
