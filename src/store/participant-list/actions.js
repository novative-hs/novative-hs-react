import {
    GET_PARTICIPANT_LIST,
    GET_PARTICIPANT_LIST_FAIL,
    GET_PARTICIPANT_LIST_SUCCESS,
   
  } from "./actionTypes";
  // get Units Action
  export const getParticipantList = (id) => ({
    type: GET_PARTICIPANT_LIST,
    payload: id,
  });
  
  export const getParticipantListSuccess =  ParticipantList => ({
    type: GET_PARTICIPANT_LIST_SUCCESS,
    payload:  ParticipantList,
  });
  
  export const getParticipantListFail = error => ({
    type: GET_PARTICIPANT_LIST_FAIL,
    payload: error,
  });

  
