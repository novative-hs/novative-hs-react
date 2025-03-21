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
console.log("Reducer - InstrumentsInManufacturer Success Payload:", action.payload); // Log payload
return {
  ...state,
  InstrumentsInManufacturer: action.payload.data || [], // Instruments array
  manufacturerName: action.payload.manufacturerName || "Unknown Manufacturer", // Manufacturer name
};

case GET_INSTRUMENTSINMANUFACTURER_FAIL:
console.error("Reducer - Error Fetching Instruments:", action.payload); // Log error payload
return {
  ...state,
  InstrumentsInManufacturer: [], // Reset to empty array on failure
  manufacturerName: "Unknown Manufacturer", // Reset manufacturer name
  error: action.payload,
};



    /////instruments in instrument type
    case GET_INSTRUMENTSINTYPE_SUCCESS:
      console.log("Reducer - InstrumentsInType Payload:", action.payload);
      return {
        ...state,
        InstrumentsInType: action.payload.instruments || [], // Save instruments
        EquipmentTypeName: action.payload.equipmentTypeName || "Unknown Equipment Type", // Save instrument type name
      };
    

      case GET_INSTRUMENTSINTYPE_FAIL:
        console.error("Reducer - Error fetching instruments:", action.payload);
        return {
          ...state,
          InstrumentsInType: [],
          EquipmentTypeName: "Unknown Equipment Type", // Reset to "Unknown" on failure
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
console.log("Reducer - UnitAnalyte:", action.payload); // Log the payload
return {
  ...state,
  UnitAnalyte: action.payload.analytes || [], // Store analytes
  UnitName: action.payload.unitName || "Unknown Unit", // Store unit name
};

case GET_ANALYTESUNITS_FAIL:
console.error("Reducer - Error fetching unit analytes:", action.payload);
return {
  ...state,
  UnitAnalyte: [], // Reset UnitAnalyte on failure
  UnitName: "Unknown Unit", // Reset UnitName on failure
  error: action.payload,
};


    /////analytesunits
    case GET_ANALYTESUNITS_LIST_SUCCESS:
console.log("ANALYTESUNITS:", action.payload);
return {
  ...state,
  UnitAnalyteList: {
    analyte_name: action.payload.analyte_name || "Unknown", // Fallback if `analyte_name` is undefined
    units: Array.isArray(action.payload.units) ? action.payload.units : [], // Ensure `units` is an array
    master_unit: action.payload.master_unit || null,
    conversion_formula: action.payload.conversion_formula || null,
  },
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

