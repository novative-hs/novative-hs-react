import {
  GET_REAGENTS_LIST_SUCCESS,
  GET_REAGENTS_LIST_FAIL,
  ADD_NEW_REAGENTS_SUCCESS,
  ADD_NEW_REAGENTS_FAIL,
  UPDATE_REAGENTS_SUCCESS,
  UPDATE_REAGENTS_FAIL,
  DELETE_REAGENT_SUCCESS,
  DELETE_REAGENT_FAIL,

  GET_ANALYTESREAGENTS_LIST_SUCCESS,
  GET_ANALYTESREAGENTS_LIST_FAIL,
  ADD_NEW_ANALYTESREAGENTS_SUCCESS,
  ADD_NEW_ANALYTESREAGENTS_FAIL,
  UPDATE_ANALYTESREAGENTS_SUCCESS,
  UPDATE_ANALYTESREAGENTS_FAIL
} from "./actionTypes";

const INIT_STATE = {
  ReagentAnalyteList: [],
  AddAnalyteReagents: [],
  analytesreagent: [],

  ReagentList: [],
  error: {},
  AddReagents: [],
  reagent: [],
};

const ReagentList = (state = INIT_STATE, action) => {
  switch (action.type) {
    /////analytesreagents
    case GET_ANALYTESREAGENTS_LIST_SUCCESS:
console.log("Reducer - Action Payload for GET_ANALYTESREAGENTS_LIST_SUCCESS:", action.payload);

return {
  ...state,
  ReagentAnalyteList: action.payload.reagents,  // Store reagents array
  analyte_name: action.payload.analyte_name,    // Store analyte name
};

case GET_ANALYTESREAGENTS_LIST_FAIL:
console.error("Reducer - Error Payload for GET_ANALYTESREAGENTS_LIST_FAIL:", action.payload);

return {
  ...state,
  error: action.payload,
};

      case ADD_NEW_ANALYTESREAGENTS_SUCCESS:
        return {
          ...state,
          AddAnalyteReagents: [...state.AddAnalyteReagents, action.payload.data],
        };
  
      case ADD_NEW_ANALYTESREAGENTS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case UPDATE_ANALYTESREAGENTS_SUCCESS:
        return {
          ...state,
          ReagentAnalyteList: state.ReagentAnalyteList.map(analytesreagent =>
            analytesreagent.id.toString() === action.payload.id.toString()
              ? { analytesreagent, ...action.payload }
              : analytesreagent
          ),
        };
  
      case UPDATE_ANALYTESREAGENTS_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    ////reagents
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
      case DELETE_REAGENT_SUCCESS:
        return {
          ...state,
          ListReagents: state.ListReagents.filter(
            reagent => reagent.id.toString() !== action.payload.id.toString()
          ),
        };
  
      case DELETE_REAGENT_FAIL:
        return {
          ...state,
          error: action.payload,
        };


    default:
      return state;
  }
};

export default ReagentList;

