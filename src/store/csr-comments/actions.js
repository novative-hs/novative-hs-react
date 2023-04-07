import {
  GET_NOTES,
  GET_NOTES_FAIL,
  GET_NOTES_SUCCESS,
  ADD_NEW_NOTE,
  ADD_NOTE_SUCCESS,
  ADD_NOTE_FAIL,
} from "./actionTypes";

export const getNotes = id => ({
  type: GET_NOTES,
  payload: id,
});

export const getNotesSuccess = notes => ({
  type: GET_NOTES_SUCCESS,
  payload: notes,
});

export const getNotesFail = error => ({
  type: GET_NOTES_FAIL,
  payload: error,
});

export const addNewNote = (note, id) => ({
  type: ADD_NEW_NOTE,
  payload: { note, id },
});

export const addNoteSuccess = note => ({
  type: ADD_NOTE_SUCCESS,
  payload: note,
});

export const addNoteFail = error => ({
  type: ADD_NOTE_FAIL,
  payload: error,
});
