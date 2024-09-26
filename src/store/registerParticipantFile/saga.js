import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { REGISTER_PARTICIPANT_LIST,} from "./actionTypes";

import { addParticipantsSuccess, addParticipantsFail} from "./actions";

//Include Both Helper File with needed rounds
import {addParticipants} from "../../helpers/django_api_helper";


function* onAddParticipants(object) {
  try {
    const response = yield call(
      addParticipants,
      object.payload.addUser,
      object.payload.id
    );
    yield put(addParticipantsSuccess(response));
  } catch (error) {
    yield put(addParticipantsFail(error));
  }
}


function* regParticipantSaga() {
  
  yield takeEvery(REGISTER_PARTICIPANT_LIST, onAddParticipants);
}

export default regParticipantSaga;
