import {
    GET_UNITS_LIST_SUCCESS,
    GET_UNITS_LIST_FAIL,
    ADD_NEW_UNITS_SUCCESS,
    ADD_NEW_UNITS_FAIL,
    UPDATE_UNITS_SUCCESS,
    UPDATE_UNITS_FAIL,

    GET_ANALYTESUNITS_SUCCESS,
    GET_ANALYTESUNITS_FAIL,

    GET_ANALYTESUNITS_LIST_SUCCESS,
    GET_ANALYTESUNITS_LIST_FAIL,
    ADD_NEW_ANALYTESUNITS_SUCCESS,
    ADD_NEW_ANALYTESUNITS_FAIL,
    UPDATE_ANALYTESUNITS_SUCCESS,
    UPDATE_ANALYTESUNITS_FAIL

  } from "./actionTypes";
  
  const INIT_STATE = {

    UnitAnalyteList: [],
    AddAnalyteUnits: [],
    analytesunit: [],

    UnitAnalyte:[],

    ListUnits: [],
    error: {},
    AddUnits: [],
    unit: [],
  };
  
  const ListUnits = (state = INIT_STATE, action) => {
    switch (action.type) {
      case GET_ANALYTESUNITS_SUCCESS:
        console.log("ANALYTESUNITS:", action.payload);
      return {
        ...state,
        UnitAnalyte: action.payload, // Update to handle units array
      };
    
        case GET_ANALYTESUNITS_FAIL:
          return {
            ...state,
            error: action.payload,
          };

      /////analytesunits
      case GET_ANALYTESUNITS_LIST_SUCCESS:
        console.log("ANALYTESUNITS:", action.payload);
      return {
        ...state,
        UnitAnalyteList: action.payload, // Update to handle units array
      };
    
        case GET_ANALYTESUNITS_LIST_FAIL:
          return {
            ...state,
            error: action.payload,
          };
        case ADD_NEW_ANALYTESUNITS_SUCCESS:
          return {
            ...state,
            AddAnalyteUnits: [...state.AddAnalyteUnits, action.payload.data],
          };
    
        case ADD_NEW_ANALYTESUNITS_FAIL:
          return {
            ...state,
            error: action.payload,
          };
        case UPDATE_ANALYTESUNITS_SUCCESS:
          return {
            ...state,
            UnitAnalyteList: state.UnitAnalyteList.map(analytesunit =>
              analytesunit.id.toString() === action.payload.id.toString()
                ? { analytesunit, ...action.payload }
                : analytesunit
            ),
          };
    
        case UPDATE_ANALYTESUNITS_FAIL:
          return {
            ...state,
            error: action.payload,
          };
  
      ////units
      case GET_UNITS_LIST_SUCCESS:
        return {
          ...state,
          ListUnits: action.payload,
        };
  
      case GET_UNITS_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case ADD_NEW_UNITS_SUCCESS:
        return {
          ...state,
          AddUnits: [...state.AddUnits, action.payload.data],
        };
  
      case ADD_NEW_UNITS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case UPDATE_UNITS_SUCCESS:
        return {
          ...state,
          ListUnits: state.ListUnits.map(unit =>
            unit.id.toString() === action.payload.id.toString()
              ? { unit, ...action.payload }
              : unit
          ),
        };
  
      case UPDATE_UNITS_FAIL:
        return {
          ...state,
          error: action.payload,
        };


      default:
        return state;
    }
  };
  
  export default ListUnits;
  