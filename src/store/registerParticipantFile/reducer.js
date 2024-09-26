
import {
    REGISTER_PARTICIPANT_LIST_SUCCESS,
    REGISTER_PARTICIPANT_LIST_FAIL,
  } from "./actionTypes";
  
  const INIT_STATE = {
    regParticipant: [],  
  
  };
  
  const regParticipant = (state = INIT_STATE, action) => {
    switch (action.type) {
          
            case REGISTER_PARTICIPANT_LIST_SUCCESS:
              return {
                ...state,
                regParticipant: [...state.regParticipant, action.payload.data],
              };
            case REGISTER_PARTICIPANT_LIST_FAIL:
              return {
                ...state,
                error: action.payload,
              };
              
           
      default:
        return state;
    }
  };
  
  export default regParticipant;
  
  