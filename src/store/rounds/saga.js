import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_ROUND_LIST,
  ADD_NEW_ROUND_LIST,
  UPDATE_NEW_ROUND_LIST,
  DELETE_ROUND,
  GET_ROUND_PARTICIPANT_LIST,
  DELETE_ROUND_PARTICIPANT,
} from "./actionTypes";
import {
  getroundlistSuccess,
  getroundlistFail,
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
    yield put(deleteRoundParticipantFail(error.response ? error.response.data : "Unknown error"));
  }
}
function* RoundListSaga() {
  yield takeEvery(GET_ROUND_LIST, fetchRoundList);
  yield takeEvery(GET_ROUND_PARTICIPANT_LIST, fetchRoundParticipantlist);
  yield takeEvery(ADD_NEW_ROUND_LIST, onAddNewRound);
  yield takeEvery(UPDATE_NEW_ROUND_LIST, onUpdateround);
  yield takeEvery(DELETE_ROUND, onDeleteRound);
  yield takeEvery(DELETE_ROUND_PARTICIPANT, onDeleteRoundParticipant); // ✅ Added correctly
}

export default RoundListSaga;
