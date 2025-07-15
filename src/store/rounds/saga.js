import { call, put, takeEvery } from "redux-saga/effects";

import {
  GET_ROUND_LIST,
  GET_CSR_ROUND_LIST,
  GET_SUBMITTED_PARTICIPANTS,
  GET_UNSUBMITTED_PARTICIPANTS,
  ADD_NEW_ROUND_LIST,
  UPDATE_NEW_ROUND_LIST,
  DELETE_ROUND,
  GET_ROUND_PARTICIPANT_LIST,
  DELETE_ROUND_PARTICIPANT,
} from "./actionTypes";
import {
  getroundlistSuccess,
  getcsrroundlistSuccess,
  getcsrroundlistFail,
  getroundlistFail,
  getsubmittedparticipantsSuccess,
  getsubmittedparticipantsFail,
  getUnsubmittedparticipantsSuccess,
  getUnsubmittedparticipantsFail,
  addNewRoundListSuccess,
  addNewRoundListFail,
  updateRoundListSuccess,
  updateRoundListFail,
  deleteRoundSuccess,
  deleteRoundFail,
  getRoundParticipantlistSuccess,
  getRoundParticipantlistFail,
  deleteRoundParticipantSuccess,
  deleteRoundParticipantFail,
} from "./actions";
import {
  getRoundlist,
  getcsrroundlist,
  getsubmittedparticipants,
  getUnsubmittedparticipants,
  getRoundParticipantlist,
  addNewRound,
  updateRound,
  deleteRound,
  deleteRoundParticipant, // Backend API call function
} from "../../helpers/django_api_helper";

function* fetchRoundList({ payload }) {
  try {
    const response = yield call(getRoundlist, payload);
    yield put(getroundlistSuccess(response.data));
  } catch (error) {
    yield put(
      getroundlistFail(error.response ? error.response.data : "Unknown error")
    );
  }
}
function* fetchCsrroundList({ payload }) {
  try {
    const csrId = payload;  // ✅ just ID now
    const response = yield call(getcsrroundlist, payload);
    yield put(getcsrroundlistSuccess(response.data));
  } catch (error) {
    yield put(getcsrroundlistFail(error?.response?.data || "Unknown error"));
  }
}



function* fetchRoundParticipantlist({ payload }) {
  try {
    const response = yield call(getRoundParticipantlist, payload.id);
    if (response.data && response.data.data) {
      yield put(getRoundParticipantlistSuccess(response.data.data));
    } else {
      yield put(getRoundParticipantlistFail("Invalid response structure"));
    }
  } catch (error) {
    yield put(
      getRoundParticipantlistFail(
        error.response ? error.response.data : "Unknown error"
      )
    );
  }
}

function* onAddNewRound({ payload }) {
  try {
    const response = yield call(addNewRound, payload.createUnit, payload.id);
    yield put(addNewRoundListSuccess(response));
  } catch (error) {
    yield put(
      addNewRoundListFail(
        error.response ? error.response.data : "Unknown error"
      )
    );
  }
}

function* onUpdateround({ payload }) {
  try {
    const response = yield call(updateRound, payload);
    yield put(updateRoundListSuccess(response));
  } catch (error) {
    yield put(
      updateRoundListFail(
        error.response ? error.response.data : "Unknown error"
      )
    );
  }
}

function* onDeleteRound({ payload }) {
  try {
    const response = yield call(deleteRound, payload);
    yield put(deleteRoundSuccess(response));
  } catch (error) {
    yield put(
      deleteRoundFail(error.response ? error.response.data : "Unknown error")
    );
  }
}
function* onDeleteRoundParticipant({ payload }) {
  try {
    const { roundId, participantId } = payload;

    console.log("Saga: Removing participant with:", { roundId, participantId });

    if (!roundId || !participantId) {
      throw new Error("Invalid roundId or participantId");
    }

    const response = yield call(deleteRoundParticipant, roundId, participantId);

    console.log("Saga Response:", response.data);

    // Dispatch the success action
    yield put(deleteRoundParticipantSuccess({ id: participantId }));
  } catch (error) {
    console.error("Saga Error:", error);
    yield put(
      deleteRoundParticipantFail(
        error.response ? error.response.data : "Unknown error"
      )
    );
  }
}

function* fetchsubmittedparticipants({ payload }) {
  try {
    console.log("Fetching submitted participants with payload:", payload); // Log the incoming payload
    const response = yield call(getsubmittedparticipants, payload);

    // Log the response data
    console.log("Response received from API:", response);

    // Check if response.data exists
    if (response.data) {
      yield put(getsubmittedparticipantsSuccess(response.data)); // Dispatch success with response data
      console.log("Dispatching success with data:", response.data); // Log the dispatched data
    } else {
      console.error("No data found in the response:", response); // Log if there's no data
      yield put(getsubmittedparticipantsFail("No data returned"));
    }
  } catch (error) {
    // Log error response if any
    console.error("Error fetching submitted participants:", error);

    // Dispatch failure with detailed error
    yield put(
      getsubmittedparticipantsFail(
        error.response ? error.response.data : "Unknown error"
      )
    );
  }
}

function* fetchUnsubmittedParticipants({ payload }) {
  try {
    console.log("Fetching unsubmitted participants with payload:", payload);
    const response = yield call(getUnsubmittedparticipants, payload);

    console.log("Response received from API:", response);

    if (response.data) {
      yield put(getUnsubmittedparticipantsSuccess(response.data));
      console.log("Dispatching success with data:", response.data);
    } else {
      console.error("No data found in the response:", response);
      yield put(getUnsubmittedparticipantsFail("No data returned"));
    }
  } catch (error) {
    console.error("Error fetching unsubmitted participants:", error);
    yield put(
      getUnsubmittedparticipantsFail(
        error.response ? error.response.data : "Unknown error"
      )
    );
  }
}

function* RoundListSaga() {
  yield takeEvery(GET_ROUND_LIST, fetchRoundList);
  yield takeEvery(GET_CSR_ROUND_LIST, fetchCsrroundList);
  yield takeEvery(GET_ROUND_PARTICIPANT_LIST, fetchRoundParticipantlist);
  yield takeEvery(ADD_NEW_ROUND_LIST, onAddNewRound);
  yield takeEvery(UPDATE_NEW_ROUND_LIST, onUpdateround);
  yield takeEvery(DELETE_ROUND, onDeleteRound);
  yield takeEvery(DELETE_ROUND_PARTICIPANT, onDeleteRoundParticipant); // ✅ Added correctly
  yield takeEvery(GET_SUBMITTED_PARTICIPANTS, fetchsubmittedparticipants);
  yield takeEvery(GET_UNSUBMITTED_PARTICIPANTS, fetchUnsubmittedParticipants);
}

export default RoundListSaga;
