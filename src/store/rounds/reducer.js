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
  DELETE_ROUND_PARTICIPANT_SUCCESS,
  DELETE_ROUND_PARTICIPANT_FAIL,
  

 GET_SUBMITTED_PARTICIPANTS_SUCCESS,
  GET_SUBMITTED_PARTICIPANTS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  RoundList: [],
  AddUnits: [],
  RoundParticipantlist: [], // ✅ Ensure this exists to store participant data
  roundDetails: {},
  ParticipantList: [], // ✅ This is used in `add-labs-round-page.js`
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

    // ✅ Update round participant list
    case GET_ROUND_PARTICIPANT_LIST_SUCCESS:
      console.log("Reducer - Updated State with Payload:", action.payload);
      return {
        ...state,
        RoundParticipantlist: action.payload.participants || [],
        roundDetails: action.payload.round_details || {},
        error: null,
      };

    case GET_ROUND_PARTICIPANT_LIST_FAIL:
      return {
        ...state,
        RoundParticipantlist: [],
        roundDetails: {},
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
        RoundList: state.RoundList.map((round) =>
          round.id.toString() === action.payload.id.toString()
            ? { ...round, ...action.payload }
            : round
        ),
      };

    case UPDATE_NEW_ROUND_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // ✅ delete participant from RoundParticipantList
    case DELETE_ROUND_PARTICIPANT_SUCCESS:
      return {
        ...state,
        RoundParticipantlist: state.RoundParticipantlist.filter(
          (participant) =>
            participant.id.toString() !== action.payload.id.toString()
        ),
        // ✅ Only detele the specific participant from `ParticipantList`
        ParticipantList: state.ParticipantList.filter(
          (participant) => participant.id !== action.payload.id
        ),
      };

    case DELETE_ROUND_PARTICIPANT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

         
case GET_SUBMITTED_PARTICIPANTS_SUCCESS:
  return {
    ...state,
    RoundParticipantlist: action.payload.participants,
    roundDetails: action.payload.round_details,
  };

    case GET_SUBMITTED_PARTICIPANTS_FAIL:
      console.log("GET_SUBMITTED_PARTICIPANTS_FAIL action dispatched with payload:", action.payload);
      return {
        ...state,
        error: action.payload,
      };


    default:
      return state;
  }
};

export default RoundList;
