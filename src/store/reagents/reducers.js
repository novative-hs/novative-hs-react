import {
    GET_REAGENTS_LIST_SUCCESS,
    GET_REAGENTS_LIST_FAIL,
    ADD_NEW_REAGENTS_SUCCESS,
    ADD_NEW_REAGENTS_FAIL,
    UPDATE_REAGENTS_SUCCESS,
    UPDATE_REAGENTS_FAIL,

  } from "./actionTypes";
  
  const INIT_STATE = {
    ReagentList: [],
    error: {},
    AddReagents: [],
    reagent: [],
  };
  
  const ReagentList = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_REAGENTS_LIST_SUCCESS:
        return {
          ...state,
          ReagentList: action.payload,
        };
  
      case GET_REAGENTS_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case ADD_NEW_REAGENTS_SUCCESS:
        return {
          ...state,
          AddReagents: [...state.AddReagents, action.payload.data],
        };
  
      case ADD_NEW_REAGENTS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case UPDATE_REAGENTS_SUCCESS:
        return {
          ...state,
          ReagentList: state.ReagentList.map(reagent =>
            reagent.id.toString() === action.payload.id.toString()
              ? { reagent, ...action.payload }
              : reagent
          ),
        };
  
      case UPDATE_REAGENTS_FAIL:
        return {
          ...state,
          error: action.payload,
        };


      default:
        return state;
    }
  };
  
  export default ReagentList;
  