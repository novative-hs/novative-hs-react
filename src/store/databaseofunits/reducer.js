import {
  GET_INSTRUMENT_TYPE_LIST_SUCCESS,
  GET_INSTRUMENT_TYPE_LIST_FAIL,
  ADD_NEW_INSTRUMENT_TYPE_SUCCESS,
  ADD_NEW_INSTRUMENT_TYPE_FAIL,
  UPDATE_NEW_INSTRUMENT_TYPE_SUCCESS,
  UPDATE_NEW_INSTRUMENT_TYPE_FAIL,
  DELETE_INSTRUMENT_TYPE_SUCCESS,
  DELETE_INSTRUMENT_TYPE_FAIL,
  DELETE_ANALYTE_SUCCESS,
  DELETE_ANALYTE_FAIL,
  GET_ANALYTE_LIST_SUCCESS,
  GET_ANALYTE_LIST_FAIL,
  GET_ANALYTEFORSCHEME_LIST_SUCCESS,
  GET_ANALYTEFORSCHEME_LIST_FAIL,
  ADD_NEW_ANALYTE_LIST_SUCCESS,
  ADD_NEW_ANALYTE_LIST_FAIL,
  UPDATE_NEW_ANALYTE_LIST_SUCCESS,
  UPDATE_NEW_ANALYTE_LIST_FAIL,
  ADD_EQUIPMENTTYPE_FILE_SUCCESS,
  ADD_EQUIPMENTTYPE_FILE_FAIL,
  GET_SCHEMEANALYTE_LIST_SUCCESS,
  GET_SCHEMEANALYTE_LIST_FAIL,
  ADD_NEW_SCHEMEANALYTE_SUCCESS,
  ADD_NEW_SCHEMEANALYTE_FAIL,
  UPDATE_SCHEMEANALYTE_SUCCESS,
  UPDATE_SCHEMEANALYTE_FAIL,

  // Cycle Analytes
  GET_ANALYTESCYCLES_SUCCESS,
  GET_ANALYTESCYCLES_FAIL,

  // Sample Analyte
  GET_SAMPLE_ANALYTE_LIST_SUCCESS,
  GET_SAMPLE_ANALYTE_LIST_FAIL,
  ADD_NEW_SAMPLE_ANALYTE_SUCCESS,
  ADD_NEW_SAMPLE_ANALYTE_FAIL,
  UPDATE_SAMPLE_ANALYTE_SUCCESS,
  UPDATE_SAMPLE_ANALYTE_FAIL,

  /////////////////////////////////
  GET_INSTRUMENT_ANALYTE_LIST_SUCCESS,
  GET_INSTRUMENT_ANALYTE_LIST_FAIL,
  ADD_NEW_INSTRUMENT_ANALYTE_SUCCESS,
  ADD_NEW_INSTRUMENT_ANALYTE_FAIL,
  UPDATE_INSTRUMENT_ANALYTE_SUCCESS,
  UPDATE_INSTRUMENT_ANALYTE_FAIL,
  ///////////////////////////////////////
  GET_ANALYTESSAMPLE_SUCCESS,
  GET_ANALYTESSAMPLE_FAIL,
  GET_INSTRUMENT_DETAIL_SUCCESS,
  GET_INSTRUMENT_DETAIL_FAIL,

} from "./actionTypes";

const INIT_STATE = {
  SchemeAnalyteList: [],
  AddSchemeAnalyte: [],
  schemeanalyte: [],
  SampleAnalyteList: [],
  InstrumentAnalyteList: [],
  CycleAnalyte: [],
  InstrumentDetail: [],
  EquipmentData: [],
  InstrumentDetail: {},
  SampleListAnalytes: [],
  ListUnit: [],
  AddUnits: [],
  unit: [],
  error: {},
};

const ListUnit = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_INSTRUMENT_TYPE_LIST_SUCCESS:
      console.log("Data received in success action:", action.payload); // Log the action.payload
      return {
        ...state,
        ListUnit: action.payload,
      };

    case GET_INSTRUMENT_TYPE_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_NEW_INSTRUMENT_TYPE_SUCCESS:
      return {
        ...state,
        AddUnits: [...state.AddUnits, action.payload.data],
      };

    case ADD_NEW_INSTRUMENT_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case ADD_EQUIPMENTTYPE_FILE_SUCCESS:
      return {
        ...state,
        EquipmentData: [...state.EquipmentData, action.payload.data],
      };

    case ADD_EQUIPMENTTYPE_FILE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_NEW_INSTRUMENT_TYPE_SUCCESS:
      return {
        ...state,
        ListUnit: state.ListUnit.map(unit =>
          unit.id.toString() === action.payload.id.toString()
            ? { unit, ...action.payload }
            : unit
        ),
      };

    case UPDATE_NEW_INSTRUMENT_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_INSTRUMENT_TYPE_LIST_SUCCESS:
      console.log("Data received in success action:", action.payload); // Log the action.payload
      return {
        ...state,
        ListUnit: action.payload,
      };

    case GET_INSTRUMENT_TYPE_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_NEW_INSTRUMENT_TYPE_SUCCESS:
      return {
        ...state,
        ListUnit: state.ListUnit.map(unit =>
          unit.id.toString() === action.payload.id.toString()
            ? { unit, ...action.payload }
            : unit
        ),
      };

    case UPDATE_NEW_INSTRUMENT_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_INSTRUMENT_TYPE_SUCCESS:
      return {
        ...state,
        ListUnit: state.ListUnit.filter(
          unit => unit.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_INSTRUMENT_TYPE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    /////////////analyte
    case GET_ANALYTE_LIST_SUCCESS:
      console.log("Data received in success action:", action.payload); // Log the action.payload
      return {
        ...state,
        ListUnit: action.payload,
      };

    case GET_ANALYTE_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    /////////////analyte for scheme
    case GET_ANALYTEFORSCHEME_LIST_SUCCESS:
      console.log("Data received in success action:", action.payload); // Log the action payload
      console.log("Reducer - Updated State with SchemeName:", action.payload.SchemeName);
      return {
        ...state,
        ListUnit: action.payload.analytes || [], // Store the analytes in ListUnit
        SchemeName: action.payload.SchemeName || "Unknown", // Store the scheme name separately
      };
    
    case GET_ANALYTEFORSCHEME_LIST_FAIL:
      return {
        ...state,
        ListUnit: [], // Clear ListUnit on failure
        SchemeName: "Unknown", // Reset SchemeName on failure
        error: action.payload,
      };
    

    case ADD_NEW_ANALYTE_LIST_SUCCESS:
      return {
        ...state,
        AddUnits: [...state.AddUnits, action.payload.data],
      };

    case ADD_NEW_ANALYTE_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_NEW_ANALYTE_LIST_SUCCESS:
      return {
        ...state,
        ListUnit: state.ListUnit.map(unit =>
          unit.id.toString() === action.payload.id.toString()
            ? { unit, ...action.payload }
            : unit
        ),
      };

    case UPDATE_NEW_ANALYTE_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case DELETE_ANALYTE_SUCCESS:
      return {
        ...state,
        ListUnit: state.ListUnit.filter(
          unit => unit.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_ANALYTE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // Scheme Analytes
    case GET_SCHEMEANALYTE_LIST_SUCCESS:
      console.log("Reducer - Updated State with Payload:", action.payload);
      return {
        ...state,
        SchemeAnalyteList: Array.isArray(action.payload.analytes) ? action.payload.analytes : [],
        SchemeName: action.payload.SchemeName || "Unknown", // Set SchemeName as a string
        error: null,
      };
    
    case GET_SCHEMEANALYTE_LIST_FAIL:
      return {
        ...state,
        SchemeAnalyteList: [],
        SchemeName: "Unknown", // Reset SchemeName on failure
        error: action.payload,
      };
    

    case ADD_NEW_SCHEMEANALYTE_SUCCESS:
      return {
        ...state,
        AddSchemeAnalyte: [...state.AddSchemeAnalyte, action.payload.data],
      };

    case ADD_NEW_SCHEMEANALYTE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_SCHEMEANALYTE_SUCCESS:
      return {
        ...state,
        SchemeAnalyteList: state.SchemeAnalyteList.map(schemeanalyte =>
          schemeanalyte.id.toString() === action.payload.id.toString()
            ? { schemeanalyte, ...action.payload }
            : schemeanalyte
        ),
      };

    case UPDATE_SCHEMEANALYTE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    ///// Analytes Associated With Cycle
    case GET_ANALYTESCYCLES_SUCCESS:
  console.log("ANALYTESCYCLES:", action.payload);
  return {
    ...state,
    CycleAnalyte: action.payload.analytes || [], // Store analytes
    CycleName: action.payload.CycleName || "Unknown", // Store cycle name
  };

case GET_ANALYTESCYCLES_FAIL:
  return {
    ...state,
    CycleAnalyte: [],
    CycleName: "Unknown", // Reset cycle name on failure
    error: action.payload,
  };


    // Sample Analytes
    case GET_SAMPLE_ANALYTE_LIST_SUCCESS:
  console.log("Reducer - Payload for Sample Analyte:", action.payload);
  return {
    ...state,
    SampleAnalyteList: action.payload.analytes || [], // Save analytes
    SampleName: action.payload.sampleName || "Unknown Sample", // Save sample name
  };

case GET_SAMPLE_ANALYTE_LIST_FAIL:
  console.error("Reducer - Error fetching sample analytes:", action.payload);
  return {
    ...state,
    SampleAnalyteList: [], // Reset SampleAnalyteList on failure
    SampleName: "Unknown Sample", // Reset SampleName on failure
    error: action.payload,
  };

    /////////////////////////////////////////////////////
    case GET_INSTRUMENT_ANALYTE_LIST_SUCCESS:
      console.log("Instrument Analyte List:", action.payload);
      return {
        ...state,
        InstrumentAnalyteList: action.payload.analytes,
        instrumentName: action.payload.instrumentName || "Unknown Instrument",
      };
    
    case GET_INSTRUMENT_ANALYTE_LIST_FAIL:
      console.error("Error Fetching Instrument Analytes:", action.payload);
      return {
        ...state,
        InstrumentAnalyteList: [],
        instrumentName: "Unknown Instrument",
        error: action.payload,
      };
    
    case ADD_NEW_INSTRUMENT_ANALYTE_SUCCESS:
      return {
        ...state,
        AddInstrumentAnalyte: [
          ...state.AddInstrumentAnalyte,
          action.payload.data,
        ],
      };

    case ADD_NEW_INSTRUMENT_ANALYTE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_INSTRUMENT_ANALYTE_SUCCESS:
      return {
        ...state,
        InstrumentAnalyteList: state.InstrumentAnalyteList.map(schemeanalyte =>
          schemeanalyte.id.toString() === action.payload.id.toString()
            ? { schemeanalyte, ...action.payload }
            : schemeanalyte
        ),
      };

    case UPDATE_INSTRUMENT_ANALYTE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    //////////////////////////////////////////
    case ADD_NEW_SAMPLE_ANALYTE_SUCCESS:
      return {
        ...state,
        AddSampleAnalyte: [...state.AddSampleAnalyte, action.payload.data],
      };

    case ADD_NEW_SAMPLE_ANALYTE_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_SAMPLE_ANALYTE_SUCCESS:
      return {
        ...state,
        SampleAnalyteList: state.SampleAnalyteList.map(schemeanalyte =>
          schemeanalyte.id.toString() === action.payload.id.toString()
            ? { schemeanalyte, ...action.payload }
            : schemeanalyte
        ),
      };

    case UPDATE_SAMPLE_ANALYTE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      case GET_ANALYTESSAMPLE_SUCCESS:
        console.log("Reducer - SampleListAnalyte:", action.payload);
        return {
          ...state,
          SampleListAnalyte: action.payload.analytes || [], // Extract analytes
          SampleName: action.payload.sampleName || "Unknown Sample", // Extract sample name
        };
      
      case GET_ANALYTESSAMPLE_FAIL:
        console.error(
          "Reducer - Error fetching sample analytes:",
          action.payload
        );
        return {
          ...state,
          SampleListAnalyte: [], // Reset SampleListAnalyte on failure
          SampleName: "Unknown Sample", // Reset SampleName on failure
          error: action.payload,
        };
      
    case GET_INSTRUMENT_DETAIL_SUCCESS:
      console.log("IIIIIIIIINSTRUMENTDETAIL:", action.payload);
      return {
        ...state,
        InstrumentDetail: action.payload, // Update to handle units array
      };

    case GET_INSTRUMENT_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default ListUnit;