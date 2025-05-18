
import {
  GET_CYCLE_LIST_SUCCESS,
  GET_CYCLE_LIST_FAIL,
  ADD_NEW_CYCLE_LIST_SUCCESS,
  ADD_NEW_CYCLE_LIST_FAIL,
  UPDATE_NEW_CYCLE_LIST_SUCCESS,
  UPDATE_NEW_CYCLE_LIST_FAIL,
  DELETE_CYCLE_SUCCESS,
  DELETE_CYCLE_FAIL,
  GET_CYCLE_ROUND_LIST_SUCCESS,
  GET_CYCLE_ROUND_LIST_FAIL,
  DELETE_CYCLE_ROUND_LIST_SUCCESS,
  DELETE_CYCLE_ROUND_LIST_FAIL
} from "./actionTypes";

const INIT_STATE = {
  CycleList: [],
  AddUnits: [],  
  cycle: [],
  error: {}, 
};

const CycleList = (state = INIT_STATE, action) => {
  switch (action.type) {
        case GET_CYCLE_LIST_SUCCESS:
          console.log("Data received in success action:", action.payload); // Log the action.payload
          return {
            ...state,
            CycleList: action.payload,
          };
        case GET_CYCLE_LIST_FAIL:
          return {
            ...state,
            error: action.payload,
          };
          case ADD_NEW_CYCLE_LIST_SUCCESS:
            return {
              ...state,
              AddUnits: [...state.AddUnits, action.payload.data],
            };
          case ADD_NEW_CYCLE_LIST_FAIL:
            return {
              ...state,
              error: action.payload,
            };
            case UPDATE_NEW_CYCLE_LIST_SUCCESS:
              console.log("Reducer: UPDATE_NEW_CYCLE_LIST_SUCCESS action:", action);
              return {
                ...state,
                CycleList: state.CycleList.map(cycle =>
                  cycle.id.toString() === action.payload.id.toString()
                    ? { ...cycle, ...action.payload }
                    : cycle
                ),
              };
        
            case UPDATE_NEW_CYCLE_LIST_FAIL:
              console.log("Reducer: UPDATE_NEW_CYCLE_LIST_FAIL action:", action);
              console.error("Reducer: Error in updating cycle list:", action.payload);
              return {
                ...state,
                error: action.payload,
              };

          case DELETE_CYCLE_SUCCESS:
            return {
              ...state,
              unit: state.unit.filter(
                person => person.id.toString() !== action.payload.id.toString()
              ),
            };
        
          case DELETE_CYCLE_FAIL:
            return {
              ...state,
              error: action.payload,
            };
           case DELETE_CYCLE_ROUND_LIST_SUCCESS:
  return {
    ...state,
    CycleList: state.CycleList.map(cycle => ({
      ...cycle,
      rounds: (cycle.rounds || []).filter(
        round => round.id !== action.payload
      ),
    })),
  };

        
          case DELETE_CYCLE_ROUND_LIST_FAIL:
            return {
              ...state,
              error: action.payload,
            };
            case GET_CYCLE_ROUND_LIST_SUCCESS:
              console.log("Data received in success action:", action.payload); // Log the action.payload
              return {
                ...state,
                CycleList: action.payload,
              };
        
            case GET_CYCLE_ROUND_LIST_FAIL:
              return {
                ...state,
                error: action.payload,
              };
    default:
      return state;
  }
};

export default CycleList;

