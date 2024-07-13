import {
    GET_UNITS_LIST_SUCCESS,
    GET_UNITS_LIST_FAIL,
    ADD_NEW_UNITS_SUCCESS,
    ADD_NEW_UNITS_FAIL,
    UPDATE_UNITS_SUCCESS,
    UPDATE_UNITS_FAIL,

    GET_ANALYTESUNITS_SUCCESS,
    GET_ANALYTESUNITS_FAIL,
    GET_INSTRUMENTSINTYPE_SUCCESS,
    GET_INSTRUMENTSINTYPE_FAIL,
    GET_ANALYTESMETHODS_SUCCESS,
    GET_ANALYTESMETHODS_FAIL,
    GET_ANALYTESREAGENTS_SUCCESS,
    GET_ANALYTESREAGENTS_FAIL,
    GET_ANALYTESINSTRUMENTS_SUCCESS,
    GET_ANALYTESINSTRUMENTS_FAIL,

    GET_ANALYTESUNITS_LIST_SUCCESS,
    GET_ANALYTESUNITS_LIST_FAIL,
    ADD_NEW_ANALYTESUNITS_SUCCESS,
    ADD_NEW_ANALYTESUNITS_FAIL,
    UPDATE_ANALYTESUNITS_SUCCESS,
    UPDATE_ANALYTESUNITS_FAIL,
    GET_INSTRUMENTSINMANUFACTURER_FAIL,
    GET_INSTRUMENTSINMANUFACTURER_SUCCESS,
    GET_REAGENTSINMANUFACTURER_SUCCESS,
    GET_REAGENTSINMANUFACTURER_FAIL

  } from "./actionTypes";
  
  const INIT_STATE = {

    UnitAnalyteList: [],
    AddAnalyteUnits: [],
    analytesunit: [],

    UnitAnalyte:[],
    InstrumentsInType:[],
    InstrumentsInManufacturer:[],
    ReagentsInManufacturer:[],
    MethodAnalyte:[],
    ReagentAnalyte:[],
    InstrumentAnalyte:[],

    ListUnits: [],
    error: {},
    AddUnits: [],
    unit: [],
  };
  
  const ListUnits = (state = INIT_STATE, action) => {
    switch (action.type) {

      /////reagents in MANUFACTURER
      case GET_REAGENTSINMANUFACTURER_SUCCESS:
        console.log("ReagentsInManufacturer:", action.payload);
      return {
        ...state,
        ReagentsInManufacturer: action.payload, // Update to handle units array
      };
    
        case GET_REAGENTSINMANUFACTURER_FAIL:
          return {
            ...state,
            error: action.payload,
          };


      /////instruments in MANUFACTURER
      case GET_INSTRUMENTSINMANUFACTURER_SUCCESS:
        console.log("InstrumentsInManufacturer:", action.payload);
      return {
        ...state,
        InstrumentsInManufacturer: action.payload, // Update to handle units array
      };
    
        case GET_INSTRUMENTSINMANUFACTURER_FAIL:
          return {
            ...state,
            error: action.payload,
          };


      /////instruments in instrument type
      case GET_INSTRUMENTSINTYPE_SUCCESS:
        console.log("InstrumentsInType:", action.payload);
      return {
        ...state,
        InstrumentsInType: action.payload, // Update to handle units array
      };
    
        case GET_INSTRUMENTSINTYPE_FAIL:
          return {
            ...state,
            error: action.payload,
          };

        /////analytes associated with methods
      case GET_ANALYTESMETHODS_SUCCESS:
        console.log("ANALYTESMETHODS:", action.payload);
      return {
        ...state,
        MethodAnalyte: action.payload, // Update to handle units array
      };
    
        case GET_ANALYTESMETHODS_FAIL:
          return {
            ...state,
            error: action.payload,
          };

          /////analytes associated with INSTRUMENTS
      case GET_ANALYTESINSTRUMENTS_SUCCESS:
        console.log("InstrumentAnalyte:", action.payload);
      return {
        ...state,
        InstrumentAnalyte: action.payload, // Update to handle units array
      };
    
        case GET_ANALYTESINSTRUMENTS_FAIL:
          return {
            ...state,
            error: action.payload,
          };
          /////analytes associated with REAGENTS
      case GET_ANALYTESREAGENTS_SUCCESS:
        console.log("ANALYTESREAGENTS:", action.payload);
      return {
        ...state,
        ReagentAnalyte: action.payload, // Update to handle units array
      };
    
        case GET_ANALYTESREAGENTS_FAIL:
          return {
            ...state,
            error: action.payload,
          };
      /////analytes associated with units
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
  