import {
    GET_PARTICIPANT_LIST,
    GET_PARTICIPANT_LIST_FAIL,
    GET_PARTICIPANT_LIST_SUCCESS,
    GET_PARTICIPANTROUND_LIST,
    GET_PARTICIPANTROUND_LIST_FAIL,
    GET_PARTICIPANTROUND_LIST_SUCCESS,

    GET_ROUNDSLABS_LIST,
    GET_ROUNDSLABS_LIST_SUCCESS,
    GET_ROUNDSLABS_LIST_FAIL,
    ADD_NEW_ROUNDSLABS,
    ADD_NEW_ROUNDSLABS_SUCCESS,
    ADD_NEW_ROUNDSLABS_FAIL,
    UPDATE_ROUNDSLABS,
    UPDATE_ROUNDSLABS_SUCCESS,
    UPDATE_ROUNDSLABS_FAIL
   
  } from "./actionTypes";

  // get Participents
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

  // get Participents Round
  export const getParticipantRoundList = (id) => ({
    type: GET_PARTICIPANTROUND_LIST,
    payload: id,
  });
  
  export const getParticipantRoundListSuccess =  ParticipantList => ({
    type: GET_PARTICIPANTROUND_LIST_SUCCESS,
    payload:  ParticipantList,
  });
  
  export const getParticipantRoundListFail = error => ({
    type: GET_PARTICIPANTROUND_LIST_FAIL,
    payload: error,
  });




   // Get RoundsLabs
   export const getRoundLablist = (id) => ({
    type: GET_ROUNDSLABS_LIST,
    payload: id,
  });
  
  export const getRoundLablistSuccess = LabRoundList => ({
    type: GET_ROUNDSLABS_LIST_SUCCESS,
    payload: LabRoundList,
  });
  
  export const getRoundLablistFail = error => ({
    type: GET_ROUNDSLABS_LIST_FAIL,
    payload: error,
  });
  //Add  RoundsLabs
  export const addNewRoundLablist = (createRoundLab, id) => ({
    type: ADD_NEW_ROUNDSLABS,
    payload: { createRoundLab, id },
  });

  export const addNewRoundLablistSuccess = createRoundLab => ({
    type: ADD_NEW_ROUNDSLABS_SUCCESS,
    payload: createRoundLab,
  });
  
  export const addNewRoundLablistFail = error => ({
    type: ADD_NEW_ROUNDSLABS_FAIL,
    payload: error,
  });
  //Update  Rounds Labs
  export const updateRoundLablist = roundslab => {
    console.log('action creator called with roundslab:', roundslab);
    return {
      type: UPDATE_ROUNDSLABS,
      payload: roundslab,
    };
  };
  export const updateRoundLablistSuccess = roundslab => ({
    type: UPDATE_ROUNDSLABS_SUCCESS,
    payload: roundslab,
  });
  
  export const updateRoundLablistFail = error => ({
    type: UPDATE_ROUNDSLABS_FAIL,
    payload: error,
  });

  
