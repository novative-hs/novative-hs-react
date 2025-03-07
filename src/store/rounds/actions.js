import {
  GET_ROUND_LIST,
  GET_ROUND_LIST_SUCCESS,
  GET_ROUND_LIST_FAIL,
  GET_ROUND_PARTICIPANT_LIST,
  GET_ROUND_PARTICIPANT_LIST_SUCCESS,
  GET_ROUND_PARTICIPANT_LIST_FAIL,
  ADD_NEW_ROUND_LIST,
  ADD_NEW_ROUND_LIST_SUCCESS,
  ADD_NEW_ROUND_LIST_FAIL,
  UPDATE_NEW_ROUND_LIST,
  UPDATE_NEW_ROUND_LIST_SUCCESS,
  UPDATE_NEW_ROUND_LIST_FAIL,
  DELETE_ROUND,
  DELETE_ROUND_SUCCESS,
  DELETE_ROUND_FAIL,
} from "./actionTypes";

// Round
export const getroundlist = id => ({
  type: GET_ROUND_LIST,
  payload: id,
});

export const getroundlistSuccess = RoundList => {

  return {
    type: GET_ROUND_LIST_SUCCESS,
    payload: RoundList,
  };
};

export const getroundlistFail = (error) => {
  return {
    type: GET_ROUND_LIST_FAIL,
    payload: error,
  };
};

///Round participant list

export const getRoundParticipantlist = (id) => {
  console.log("Action Payload (ID):", id);
  return {
    type: GET_ROUND_PARTICIPANT_LIST,
    payload: id,
  };
};


export const getRoundParticipantlistSuccess = RoundList => ({
  type: GET_ROUND_PARTICIPANT_LIST_SUCCESS,
  payload: RoundList
});

export const getRoundParticipantlistFail = error => ({
  type: GET_ROUND_PARTICIPANT_LIST_FAIL,
  payload: error,
});


export const addNewRoundList = (createUnit, id) => {
  return {
    type: ADD_NEW_ROUND_LIST,
    payload: { createUnit, id },
  };
};

export const addNewRoundListSuccess = createUnit => ({
  type: ADD_NEW_ROUND_LIST_SUCCESS,
  payload: createUnit,
});

export const addNewRoundListFail = error => ({
  type: ADD_NEW_ROUND_LIST_FAIL,
  payload: error,
});

export const updateRoundList = round => {
  console.log('updatevvvvvvvvvvvvvvvvvcalled with:', round);
  return{
  type: UPDATE_NEW_ROUND_LIST,
  payload: round,
}};

export const updateRoundListSuccess = round => {
  console.log('update round Success:', round);
  return{
  type: UPDATE_NEW_ROUND_LIST_SUCCESS,
  payload: round,
}};

export const updateRoundListFail = error => {
  console.log('update round fail:', error);
  return{
  type: UPDATE_NEW_ROUND_LIST_FAIL,
  payload: error,
}};


export const deleteRound = round => ({
  type: DELETE_ROUND,
  payload: round,
});

export const deleteRoundSuccess = round => ({
  type: DELETE_ROUND_SUCCESS,
  payload: round,
});

export const deleteRoundFail = error => ({
  type: DELETE_ROUND_FAIL,
  payload: error,
});