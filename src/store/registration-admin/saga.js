

import { call, put, takeEvery } from "redux-saga/effects";
import axios from 'axios';


// Crypto Redux States
import {

  GET_PENDING_LABS,
  GET_APPROVED_LABS,
  GET_UNAPPROVED_LABS,
  GET_SUSPENDED_LABS,
  APPROVE_UNAPPROVE_LAB,
  GET_ALL_PARTICIPANT,
  UPDATE_MEMBERSHIP_STATUS,
  UPDATE_LABS,
  GET_DELETE_PARTICIPANT,
} from "./actionTypes";

import {
  getPendingLabsSuccess,
  getPendingLabsFail,
  getApprovedLabsSuccess,
  getApprovedLabsFail,
  getSuspendedLabsSuccess,
  getSuspendedLabsFail,
  getUnapprovedLabsSuccess,
  getUnapprovedLabsFail,
  approveUnapproveLabSuccess,
  approveUnapproveLabFail,
  getAllLabsSuccess,
  getAllLabsFail,
  updateMembershipStatusSuccess,
  updateMembershipStatusFail,
  updateAllLabsSuccess,
  updateAllLabsFail,
  getDeleteParticipantSuccess,
  getDeleteParticipantFail
} from "./actions";

//Include Both Helper File with needed methods
import {
  getPendingLabs,
  approveUnapproveLab,
  getApprovedLabs,
  getSuspendedLabs,
  getUnapprovedLabs,
  getAllLabs,
  updateMembershipstatus,
  updateAllLabs,
  deleteParticipant ,
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
    console.log('[Saga] fetchAllLabs started with payload:', action.payload);

    const response = yield call(getAllLabs, action.payload);

    console.log('[Saga] fetchAllLabs API response:', response);

    yield put(getAllLabsSuccess(response));

    console.log('[Saga] Dispatched getAllLabsSuccess');
  } catch (error) {
    console.error('[Saga] fetchAllLabs failed:', error);

    yield put(getAllLabsFail(error.message || 'Fetch all labs failed'));

    console.log('[Saga] Dispatched getAllLabsFail');
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

function* fetchSuspendedLabs(action) {
  try {
    const response = yield call(getSuspendedLabs, action.payload);
    yield put(getSuspendedLabsSuccess(response));
  } catch (error) {
    yield put(getSuspendedLabsFail(error));
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


function* onDeleteParticipant({ payload, meta }) {
  const { participantId } = payload;
  const { resolve, reject } = meta || {};

  try {
    const response = yield call(deleteParticipant, participantId);

    // Axios typically throws for 403/404, so this is just a fallback
    if (response?.status === 200 || response?.status === 204) {
      yield put(getDeleteParticipantSuccess(participantId));
      if (resolve) resolve(response);
    } else {
      const errorMsg =
        response?.message || "Failed to delete participant.";
      yield put(getDeleteParticipantFail(errorMsg));
      if (reject) reject(errorMsg);
    }
  } catch (error) {
    const errorMsg =
      error?.response?.data?.message || "Failed to delete participant.";
    yield put(getDeleteParticipantFail(errorMsg));
    if (reject) reject(errorMsg);
  }
}


function* registrationAdminSaga() {
  yield takeEvery(UPDATE_MEMBERSHIP_STATUS, onupdateMembershipStatus);
  yield takeEvery(GET_ALL_PARTICIPANT, fetchAllLabs);
  yield takeEvery(GET_DELETE_PARTICIPANT, onDeleteParticipant);
  yield takeEvery(GET_PENDING_LABS, fetchPendingLabs);
  yield takeEvery(GET_APPROVED_LABS, fetchApprovedLabs);
  yield takeEvery(GET_UNAPPROVED_LABS, fetchUnapprovedLabs);
  yield takeEvery(GET_SUSPENDED_LABS, fetchSuspendedLabs);
  yield takeEvery(APPROVE_UNAPPROVE_LAB, onApproveUnapproveLab);
  yield takeEvery(UPDATE_LABS, onupdateAllLabs);

 
}

export default registrationAdminSaga;



