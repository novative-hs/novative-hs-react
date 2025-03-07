
import {
  GET_ROUND_LIST_SUCCESS,
  GET_ROUND_LIST_FAIL,
  GET_ROUND_PARTICIPANT_LIST_SUCCESS,
  GET_ROUND_PARTICIPANT_LIST_FAIL,
  ADD_NEW_ROUND_LIST_SUCCESS,
  ADD_NEW_ROUND_LIST_FAIL,
  UPDATE_NEW_ROUND_LIST_SUCCESS,
  UPDATE_NEW_ROUND_LIST_FAIL,
  DELETE_ROUND_SUCCESS,
  DELETE_ROUND_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  RoundList: [],
  AddUnits: [],  
  unit: [],
  error: {}, 
};

const RoundList = (state = INIT_STATE, action) => {
  switch (action.type) {
        case GET_ROUND_LIST_SUCCESS:
          return {
            ...state,
            RoundList: action.payload,
          };
        case GET_ROUND_LIST_FAIL:
          return {
            ...state,
            error: action.payload,
          };

        // participant schem list
              case GET_ROUND_PARTICIPANT_LIST_SUCCESS:
          console.log("Reducer - Updated State with Payload:", action.payload);
          return {
            ...state,
            RoundParticipantlist: Array.isArray(action.payload) ? action.payload : [],
            error: null,
          };
        
              
              case GET_ROUND_PARTICIPANT_LIST_FAIL:
                return {
                  ...state,
                  RoundParticipantlist: [], // Clear list on failure
                  error: action.payload,
                };
          case ADD_NEW_ROUND_LIST_SUCCESS:
            return {
              ...state,
              AddUnits: [...state.AddUnits, action.payload.data],
            };
          case ADD_NEW_ROUND_LIST_FAIL:
            return {
              ...state,
              error: action.payload,
            };
            
          case UPDATE_NEW_ROUND_LIST_SUCCESS:
            return {
              ...state,
              RoundList: state.RoundList.map(round =>
                round.id.toString() === action.payload.id.toString()
                  ? { round, ...action.payload }
                  : round
              ),
            };
          case UPDATE_NEW_ROUND_LIST_FAIL:
            return {
              ...state,
              error: action.payload,
            };
            case DELETE_ROUND_SUCCESS:
              return {
                ...state,
                rounds: state.rounds.filter(
                  round =>
                    round.id.toString() !== action.payload.id.toString()
                ),
              };
        
            case DELETE_ROUND_FAIL:
              return {
                ...state,
                error: action.payload,
              };
            
    default:
      return state;
  }
};

export default RoundList;
