import {
  GET_PARTICIPANT_LIST_FAIL,
  GET_PARTICIPANT_LIST_SUCCESS,
  

  } from "./actionTypes";
  
  const INIT_STATE = {
    ParticipantList: [],
    error: {},
  };
  
  const  ParticipantList = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_PARTICIPANT_LIST_SUCCESS:
        return {
          ...state,
          ParticipantList: action.payload,
        };
  
      case GET_PARTICIPANT_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default  ParticipantList;
  