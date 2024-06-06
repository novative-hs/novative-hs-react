import {
    GET_REAGENTS_LIST,
    GET_REAGENTS_LIST_FAIL,
    GET_REAGENTS_LIST_SUCCESS,
    ADD_NEW_REAGENTS,
    ADD_NEW_REAGENTS_SUCCESS,
    ADD_NEW_REAGENTS_FAIL,
    UPDATE_REAGENTS,
    UPDATE_REAGENTS_SUCCESS,
    UPDATE_REAGENTS_FAIL,
  } from "./actionTypes";
  // get Units Action
  export const getReagentlist = () => ({
    type: GET_REAGENTS_LIST,
    payload: {},
  });
  
  export const getReagentlistSuccess = ReagentList => ({
    type: GET_REAGENTS_LIST_SUCCESS,
    payload: ReagentList,
  });
  
  export const getReagentlistFail = error => ({
    type: GET_REAGENTS_LIST_FAIL,
    payload: error,
  });
  //Add  Units Action
  export const addNewReagents = (createReagent, id) => ({
    type: ADD_NEW_REAGENTS,
    payload: { createReagent, id },
  });

  export const addNewReagentsSuccess = createReagent => ({
    type: ADD_NEW_REAGENTS_SUCCESS,
    payload: createReagent,
  });
  
  export const addNewReagentsFail = error => ({
    type: ADD_NEW_REAGENTS_FAIL,
    payload: error,
  });
  //Update  Units Action
  export const updateReagents = reagent => {
    console.log('updateReagents action creator called with reagent:', reagent);
    return {
      type: UPDATE_REAGENTS,
      payload: reagent,
    };
  };
  export const updateReagentsSuccess = reagent => ({
    type: UPDATE_REAGENTS_SUCCESS,
    payload: reagent,
  });
  
  export const updateReagentsFail = error => ({
    type: UPDATE_REAGENTS_FAIL,
    payload: error,
  });

  
