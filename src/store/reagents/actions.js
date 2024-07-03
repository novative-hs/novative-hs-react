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

    GET_ANALYTESREAGENTS_LIST,
    GET_ANALYTESREAGENTS_LIST_SUCCESS,
    GET_ANALYTESREAGENTS_LIST_FAIL,
    ADD_NEW_ANALYTESREAGENTS,
    ADD_NEW_ANALYTESREAGENTS_SUCCESS,
    ADD_NEW_ANALYTESREAGENTS_FAIL,
    UPDATE_ANALYTESREAGENTS,
    UPDATE_ANALYTESREAGENTS_SUCCESS,
    UPDATE_ANALYTESREAGENTS_FAIL

  } from "./actionTypes";
    // get  Analyte Reagents
  export const getAnalyteReagentlist = (id) => ({
    type: GET_ANALYTESREAGENTS_LIST,
    payload: id,
  });
  
  export const getAnalyteReagentlistSuccess = ReagentAnalyteList => ({
    type: GET_ANALYTESREAGENTS_LIST_SUCCESS,
    payload: ReagentAnalyteList,
  });
  
  export const getAnalyteReagentlistFail = error => ({
    type: GET_ANALYTESREAGENTS_LIST_FAIL,
    payload: error,
  });
  //Add  Analyte Reagents
  export const addNewAnalyteReagentlist = (createReagent, id) => ({
    type: ADD_NEW_ANALYTESREAGENTS,
    payload: { createReagent, id },
  });

  export const addNewAnalyteReagentlistSuccess = createReagent => ({
    type: ADD_NEW_ANALYTESREAGENTS_SUCCESS,
    payload: createReagent,
  });
  
  export const addNewAnalyteReagentlistFail = error => ({
    type: ADD_NEW_ANALYTESREAGENTS_FAIL,
    payload: error,
  });
  //Update  Analyte Reagents
  export const updateAnalyteReagentlist = analytesreagent => {
    console.log('action creator called with analytesreagent:', analytesreagent);
    return {
      type: UPDATE_ANALYTESREAGENTS,
      payload: analytesreagent,
    };
  };
  export const updateAnalyteReagentlistSuccess = analytesreagent => ({
    type: UPDATE_ANALYTESREAGENTS_SUCCESS,
    payload: analytesreagent,
  });
  
  export const updateAnalyteReagentlistFail = error => ({
    type: UPDATE_ANALYTESREAGENTS_FAIL,
    payload: error,
  });
  // get   Reagents
  export const getReagentlist = (id) => ({
    type: GET_REAGENTS_LIST,
    payload: id,
  });
  
  export const getReagentlistSuccess = ReagentList => ({
    type: GET_REAGENTS_LIST_SUCCESS,
    payload: ReagentList,
  });
  
  export const getReagentlistFail = error => ({
    type: GET_REAGENTS_LIST_FAIL ,
    payload: error,
  });
  //Add Reagents
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
  //Update  Reagents 
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

  
