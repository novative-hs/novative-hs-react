import {
REGISTER_PARTICIPANT_LIST,
REGISTER_PARTICIPANT_LIST_SUCCESS,
REGISTER_PARTICIPANT_LIST_FAIL,
} from "./actionTypes";
//Add  Units Action
export const addParticipants = (addUser, id) => ({
    type: REGISTER_PARTICIPANT_LIST,
    payload: { addUser, id },
  });

  export const addParticipantsSuccess = addUser => ({
    type: REGISTER_PARTICIPANT_LIST_SUCCESS,
    payload: addUser,
  });
  
  export const addParticipantsFail = error => ({
    type: REGISTER_PARTICIPANT_LIST_FAIL,
    payload: error,
  });