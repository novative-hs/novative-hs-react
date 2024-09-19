import {
    GET_QUALITATIVETYPE_LIST_SUCCESS,
    GET_QUALITATIVETYPE_LIST_FAIL,
    ADD_NEW_QUALITATIVETYPE_SUCCESS,
    ADD_NEW_QUALITATIVETYPE_FAIL,
    UPDATE_QUALITATIVETYPE_SUCCESS,
    UPDATE_QUALITATIVETYPE_FAIL,
    GET_AnalyteQualitativeUnits_LIST_SUCCESS,
    GET_AnalyteQualitativeUnits_LIST_FAIL,
    ADD_NEW_AnalyteQualitativeUnits_SUCCESS,
    ADD_NEW_AnalyteQualitativeUnits_FAIL,
    UPDATE_AnalyteQualitativeUnits_SUCCESS,
    UPDATE_AnalyteQualitativeUnits_FAIL,


  } from "./actionTypes";
  
  const INIT_STATE = {

    ReagentAnalyteList: [],
    AddAnalyteReagents: [],
    analytesreagent: [],
    
    ListQualitativeType: [],
    error: {},
    AddQualitativeType: [],
    qualitativetype: [],
  };
  
  const ListQualitativeType = (state = INIT_STATE, action) => {
    switch (action.type) {
  
      /////analytesqualitative
      case GET_AnalyteQualitativeUnits_LIST_SUCCESS:
      console.log("Reducer: GET_AnalyteQualitativeUnits_LIST_SUCCESS action received:", action);
      console.log("Reducer: Payload received:", action.payload);
      console.log("Reducer: Qualitativetype in payload:", action.payload.qualitativetype);
      
      return {
        ...state,
        ReagentAnalyteList: action.payload.qualitativetype || [], // Update to use qualitativetype
      };

    case GET_AnalyteQualitativeUnits_LIST_FAIL:
      console.error("Reducer: GET_AnalyteQualitativeUnits_LIST_FAIL action received:", action);
      console.error("Reducer: Error encountered:", action.payload);
      
      return {
        ...state,
        error: action.payload,
      };
        case ADD_NEW_AnalyteQualitativeUnits_SUCCESS:
          return {
            ...state,
            AddAnalyteReagents: [...state.AddAnalyteReagents, action.payload.data],
          };
    
        case ADD_NEW_AnalyteQualitativeUnits_FAIL:
          return {
            ...state,
            error: action.payload,
          };
        case UPDATE_AnalyteQualitativeUnits_SUCCESS:
          return {
            ...state,
            ReagentAnalyteList: state.ReagentAnalyteList.map(analytesreagent =>
              analytesreagent.id.toString() === action.payload.id.toString()
                ? { analytesreagent, ...action.payload }
                : analytesreagent
            ),
          };
    
        case UPDATE_AnalyteQualitativeUnits_FAIL:
          return {
            ...state,
            error: action.payload,
          };
  
      ////qualitativetypes
      case GET_QUALITATIVETYPE_LIST_SUCCESS:
        return {
          ...state,
          ListQualitativeType: action.payload,
        };
  
      case GET_QUALITATIVETYPE_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case ADD_NEW_QUALITATIVETYPE_SUCCESS:
        return {
          ...state,
          AddQualitativeType: [...state.AddQualitativeType, action.payload.data],
        };
  
      case ADD_NEW_QUALITATIVETYPE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
        case UPDATE_QUALITATIVETYPE_SUCCESS:
          console.log('UPDATE_QUALITATIVETYPE_SUCCESS action payload:', action.payload);
          const updatedListQualitativeType = state.ListQualitativeType.map(qualitativetype =>
            qualitativetype.id.toString() === action.payload.id.toString()
              ? { ...qualitativetype, ...action.payload }
              : qualitativetype
          );
          console.log('Updated ListQualitativeType:', updatedListQualitativeType);
          return {
            ...state,
            ListQualitativeType: updatedListQualitativeType,
          };
        
        case UPDATE_QUALITATIVETYPE_FAIL:
          console.error('UPDATE_QUALITATIVETYPE_FAIL action payload:', action.payload);
          return {
            ...state,
            error: action.payload,
          };
        


      default:
        return state;
    }
  };
  
  export default ListQualitativeType;
  