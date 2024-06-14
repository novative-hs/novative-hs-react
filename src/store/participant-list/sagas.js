import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_PARTICIPANT_LIST} from "./actionTypes";

import { getParticipantListSuccess, getParticipantListFail } from "./actions";

//Include Both Helper File with needed methods
import { getParticipantList} from "../../helpers/django_api_helper";

function* fetchParticipantList(object) {
  try {
    const response = yield call(getParticipantList, object.payload);
    yield put(getParticipantListSuccess(response.data));
  } catch (error) {
    yield put(getParticipantListFail(error));
  }
}

function* participantListSaga() {
  yield takeEvery(GET_PARTICIPANT_LIST, fetchParticipantList);
}

export default participantListSaga;
