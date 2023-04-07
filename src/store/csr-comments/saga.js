import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_NOTES,
  ADD_NEW_NOTE,
} from "./actionTypes";

import {
  getNotesSuccess,
  getNotesFail,
  addNoteFail,
  addNoteSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getNotes,
  addNewNote,
} from "../../helpers/django_api_helper";

function* fetchNotes(object) {
  try {
    const response = yield call(getNotes, object.payload);
    yield put(getNotesSuccess(response));
  } catch (error) {
    yield put(getNotesFail(error));
  }
}

function* onAddNewNote(object) {
  try {
    const response = yield call(
      addNewNote,
      object.payload.note,
      object.payload.id
    );
    yield put(addNoteSuccess(response));
  } catch (error) {
    yield put(addNoteFail(error));
  }
}

function* notesSaga() {
  yield takeEvery(GET_NOTES, fetchNotes);
  yield takeEvery(ADD_NEW_NOTE, onAddNewNote);
}

export default notesSaga;
