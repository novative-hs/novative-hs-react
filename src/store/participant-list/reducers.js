import {
  GET_PARTICIPANT_LIST_FAIL,
  GET_PARTICIPANT_LIST_SUCCESS,
  GET_PARTICIPANTROUND_LIST_FAIL,
  GET_PARTICIPANTROUND_LIST_SUCCESS,

  GET_ROUNDSLABS_LIST_SUCCESS,
  GET_ROUNDSLABS_LIST_FAIL,
  ADD_NEW_ROUNDSLABS_SUCCESS,
  ADD_NEW_ROUNDSLABS_FAIL,
  UPDATE_ROUNDSLABS_SUCCESS,
  UPDATE_ROUNDSLABS_FAIL
  

  } from "./actionTypes";
  
  const INIT_STATE = {
    LabRoundList: [],
    AddRoundLabs: [],
    roundslab: [],


    ParticipantList: [],
    error: {},
  };
  
  const  ParticipantList = (state = INIT_STATE, action) => {
    switch (action.type) {
      ///// Rounds Participants
      case GET_ROUNDSLABS_LIST_SUCCESS:
        console.log("Reducer: Payload received:", action.payload); // Log payload for confirmation
        return {
            ...state,
            LabRoundList: action.payload, // Use payload directly
        };
    
    case GET_ROUNDSLABS_LIST_FAIL:
        console.error("Reducer: Error encountered:", action.payload); // Log error
        return {
            ...state,
            error: action.payload.message || action.payload, // Store error message
        };
        case ADD_NEW_ROUNDSLABS_SUCCESS:
          return {
            ...state,
            AddRoundLabs: [...state.AddRoundLabs, action.payload.data],
          };
    
        case ADD_NEW_ROUNDSLABS_FAIL:
          return {
            ...state,
            error: action.payload,
          };
        case UPDATE_ROUNDSLABS_SUCCESS:
          return {
            ...state,
            LabRoundList: state.LabRoundList.map(roundslab =>
              roundslab.id.toString() === action.payload.id.toString()
                ? { roundslab, ...action.payload }
                : roundslab
            ),
          };
    
        case UPDATE_ROUNDSLABS_FAIL:
          return {
            ...state,
            error: action.payload,
          };

      // Participant
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
      // Round Participant
      case GET_PARTICIPANTROUND_LIST_SUCCESS:
        console.log("GET_PARTICIPANTROUND_LIST_SUCCESS: Payload:", action.payload);
        return {
          ...state,
          ParticipantList: action.payload.participantList,
          roundDetails: action.payload.roundDetails,
        };
      
      
          case GET_PARTICIPANTROUND_LIST_FAIL:
            return {
              ...state,
              error: action.payload,
            };
      default:
        return state;
    }
  };
  
  export default  ParticipantList;
  