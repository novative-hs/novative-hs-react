import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {

  GET_PENDING_LABS,
  GET_APPROVED_LABS,
  GET_UNAPPROVED_LABS,
  APPROVE_UNAPPROVE_LAB,
  GET_ALL_PARTICIPANT,
  UPDATE_MEMBERSHIP_STATUS,
  UPDATE_LABS,
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
  getAllLabsSuccess,
  getAllLabsFail,
  updateMembershipStatusSuccess,
  updateMembershipStatusFail,
  updateAllLabsSuccess,
  updateAllLabsFail
} from "./actions";

//Include Both Helper File with needed methods
import {
  getPendingLabs,
  approveUnapproveLab,
  getApprovedLabs,
  getUnapprovedLabs,
  getAllLabs,
  updateMembershipstatus,
  updateAllLabs
} from "../../helpers/django_api_helper";

function* onupdateMembershipStatus({ payload: status }) {
  try {
    const response = yield call(updateMembershipstatus, status);
    yield put(updateMembershipStatusSuccess(response));
  } catch (error) {
    yield put(updateMembershipStatusFail(error));
  }
}

function* fetchAllLabs(action) {
  try {
    const response = yield call(getAllLabs, action.payload);
    yield put(getAllLabsSuccess(response));
  } catch (error) {
    yield put(getAllLabsFail(error));
  }
}
function* onupdateAllLabs({ payload: status }) {
  try {
    const response = yield call(updateAllLabs, status);
    yield put(updateAllLabsSuccess(response));
  } catch (error) {
    yield put(getAllLabsFail(error));
  }
}
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
  yield takeEvery(UPDATE_MEMBERSHIP_STATUS, onupdateMembershipStatus);
  yield takeEvery(GET_ALL_PARTICIPANT, fetchAllLabs);
  yield takeEvery(GET_PENDING_LABS, fetchPendingLabs);
  yield takeEvery(GET_APPROVED_LABS, fetchApprovedLabs);
  yield takeEvery(GET_UNAPPROVED_LABS, fetchUnapprovedLabs);
  yield takeEvery(APPROVE_UNAPPROVE_LAB, onApproveUnapproveLab);
  yield takeEvery(UPDATE_LABS, onupdateAllLabs);

 
}

export default registrationAdminSaga;
