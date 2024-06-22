
import {
  GET_SCHEME_LIST_SUCCESS,
  GET_SCHEME_LIST_FAIL,
  ADD_NEW_SCHEME_LIST_SUCCESS,
  ADD_NEW_SCHEME_LIST_FAIL,
  UPDATE_NEW_SCHEME_LIST_SUCCESS,
  UPDATE_NEW_SCHEME_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  SchemeList: [],
  AddUnits: [],  
  unit: [],
  error: {}, 
};

const SchemeList = (state = INIT_STATE, action) => {
  switch (action.type) {
        case GET_SCHEME_LIST_SUCCESS:
          console.log("Data received in success action:", action.payload); // Log the action.payload
          return {
            ...state,
            SchemeList: action.payload,
          };
        case GET_SCHEME_LIST_FAIL:
          return {
            ...state,
            error: action.payload,
          };
          case ADD_NEW_SCHEME_LIST_SUCCESS:
            return {
              ...state,
              AddUnits: [...state.AddUnits, action.payload.data],
            };
          case ADD_NEW_SCHEME_LIST_FAIL:
            return {
              ...state,
              error: action.payload,
            };
          case UPDATE_NEW_SCHEME_LIST_SUCCESS:
            return {
              ...state,
              SchemeList: state.SchemeList.map(unit =>
                unit.id.toString() === action.payload.id.toString()
                  ? { unit, ...action.payload }
                  : unit
              ),
            };
          case UPDATE_NEW_SCHEME_LIST_FAIL:
            return {
              ...state,
              error: action.payload,
            };
            
    default:
      return state;
  }
};

export default SchemeList;

