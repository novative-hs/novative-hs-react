import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_PARTICIPANT_LIST, GET_ROUNDSLABS_LIST,ADD_NEW_ROUNDSLABS,UPDATE_ROUNDSLABS} from "./actionTypes";

import { getParticipantListSuccess, getParticipantListFail, getRoundLablistSuccess,getRoundLablistFail,addNewRoundLablistSuccess,addNewRoundLablistFail,updateRoundLablistSuccess,updateRoundLablistFail } from "./actions";

//Include Both Helper File with needed methods
import { getParticipantList, getRoundLablist,addNewRoundLablist,updateRoundLablist} from "../../helpers/django_api_helper";


/// Rounds Participants
function* fetchRoundLabsList(object) {
  try {
    const response = yield call(getRoundLablist, object.payload);
    yield put(getRoundLablistSuccess(response.data));
  } catch (error) {
    yield put(getRoundLablistFail(error));
  }
}
function* onAddNewRoundLabs(object) {
  try {
    const response = yield call(
      addNewRoundLablist,
      object.payload.createRoundLab,
      object.payload.id
    );
    yield put(addNewRoundLablistSuccess(response));
  } catch (error) {
    yield put(addNewRoundLablistFail(error));
  }
}
function* onUpdateRoundLabs({ payload: roundslab }) {
  try {
    const response = yield call(updateRoundLablist, roundslab);
    yield put(updateRoundLablistSuccess(response));
  } catch (error) {
    yield put(updateRoundLablistFail (error));
  }
}

function* fetchParticipantList(object) {
  try {
    const response = yield call(getParticipantList, object.payload);
    yield put(getParticipantListSuccess(response.data));
  } catch (error) {
    yield put(getParticipantListFail(error));
  }
}

function* participantListSaga() {

  yield takeEvery(GET_ROUNDSLABS_LIST, fetchRoundLabsList);
  yield takeEvery(ADD_NEW_ROUNDSLABS, onAddNewRoundLabs );
  yield takeEvery(UPDATE_ROUNDSLABS, onUpdateRoundLabs);


  yield takeEvery(GET_PARTICIPANT_LIST, fetchParticipantList);
}

export default participantListSaga;
