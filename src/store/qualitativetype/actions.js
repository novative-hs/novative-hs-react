import {
    GET_QUALITATIVETYPE_LIST,
    GET_QUALITATIVETYPE_LIST_FAIL,
    GET_QUALITATIVETYPE_LIST_SUCCESS,
    ADD_NEW_QUALITATIVETYPE,
    ADD_NEW_QUALITATIVETYPE_SUCCESS,
    ADD_NEW_QUALITATIVETYPE_FAIL,
    UPDATE_QUALITATIVETYPE,
    UPDATE_QUALITATIVETYPE_SUCCESS,
    UPDATE_QUALITATIVETYPE_FAIL,
    GET_AnalyteQualitativeUnits_LIST,
    GET_AnalyteQualitativeUnits_LIST_SUCCESS,
    ADD_NEW_AnalyteQualitativeUnits,
    ADD_NEW_AnalyteQualitativeUnits_SUCCESS,
    ADD_NEW_AnalyteQualitativeUnits_FAIL,
    UPDATE_AnalyteQualitativeUnits,
    UPDATE_AnalyteQualitativeUnits_SUCCESS,
    UPDATE_AnalyteQualitativeUnits_FAIL,
    GET_AnalyteQualitativeUnits_LIST_FAIL,
    

  } from "./actionTypes";

 // get  Analyte Qualitative
 export const getAnalyteQualitativelist = (id) => ({
  type: GET_AnalyteQualitativeUnits_LIST,
  payload: id,
});

export const getAnalyteQualitativelistSuccess = ReagentAnalyteList => ({
  type: GET_AnalyteQualitativeUnits_LIST_SUCCESS,
  payload: ReagentAnalyteList,
});

export const getAnalyteQualitativelistFail = error => ({
  type: GET_AnalyteQualitativeUnits_LIST_FAIL,
  payload: error,
});
//Add  Analyte Qualitative
export const addNewAnalyteQualitativelist = (createAnalyteReagent, id) => ({
  type: ADD_NEW_AnalyteQualitativeUnits,
  payload: { createAnalyteReagent, id },
});

export const addNewAnalyteQualitativelistSuccess = createAnalyteReagent => ({
  type: ADD_NEW_AnalyteQualitativeUnits_SUCCESS,
  payload: createAnalyteReagent,
});

export const addNewAnalyteQualitativelistFail = error => ({
  type: ADD_NEW_AnalyteQualitativeUnits_FAIL,
  payload: error,
});
//Update  Analyte Qualitative
export const updateAnalyteQualitativelist = analytesreagent => {
  console.log('action creator called with analytesreagent:', analytesreagent);
  return {
    type: UPDATE_AnalyteQualitativeUnits,
    payload: analytesreagent,
  };
};
export const updateAnalyteQualitativelistSuccess = analytesreagent => {
  console.log('action creator success:', analytesreagent);
  return {
    type: UPDATE_AnalyteQualitativeUnits_SUCCESS,
  payload: analytesreagent,
};
};

export const updateAnalyteQualitativelistFail = error => {
  console.log('action creator success:', error);
  return {
    type: UPDATE_AnalyteQualitativeUnits_FAIL,
  payload: error,
};
};
  // get QualitativeType Action
  export const getqualitativetypelist = (id) => ({
    type: 'GET_QUALITATIVETYPE_LIST',
    payload: id,
  });
  
  export const getqualitativetypelistSuccess = ListQualitativeType => ({
    type: GET_QUALITATIVETYPE_LIST_SUCCESS,
    payload: ListQualitativeType,
  });
  
  export const getqualitativetypelistFail = error => ({
    type: GET_QUALITATIVETYPE_LIST_FAIL,
    payload: error,
  });
  //Add  QualitativeType Action
  export const addNewQualitativeType = (createQualitativeType, id) => ({
    type: ADD_NEW_QUALITATIVETYPE,
    payload: { createQualitativeType, id },
  });

  export const addNewQualitativeTypeSuccess = createQualitativeType => ({
    type: ADD_NEW_QUALITATIVETYPE_SUCCESS,
    payload: createQualitativeType,
  });
  
  export const addNewQualitativeTypeFail = error => ({
    type: ADD_NEW_QUALITATIVETYPE_FAIL,
    payload: error,
  });
  //Update  QualitativeType Action
  export const updateQualitativeType = qualitativetype => {
    // Log when the action is created and the payload it carries
    console.log("Action: updateQualitativeTypessssssssssss - Payload:", qualitativetype);
    
    return {
      type: UPDATE_QUALITATIVETYPE,
      payload: qualitativetype,
    };
  };
  
  export const updateQualitativeTypeSuccess = qualitativetype => {
    // Log when the success action is created and the payload it carries
    console.log("Action: updateQualitativeTypeSuccessyyyyyyyyyyyyyyyyyy - Payload:", qualitativetype);
    
    return {
      type: UPDATE_QUALITATIVETYPE_SUCCESS,
      payload: qualitativetype,
    };
  };
  
  export const updateQualitativeTypeFail = error => {
    // Log when the fail action is created and the error it carries
    console.log("Action: updateQualitativeTypeFail - Error:", error);
    
    return {
      type: UPDATE_QUALITATIVETYPE_FAIL,
      payload: error,
    };
  };
  
  
