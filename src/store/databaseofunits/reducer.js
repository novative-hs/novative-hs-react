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
  UPDATE_SAMPLE_ANALYTE_FAIL
} from "./actionTypes";

const INIT_STATE = {
  SchemeAnalyteList: [],
  AddSchemeAnalyte: [],
  schemeanalyte: [],
  SampleAnalyteList:[],

  CycleAnalyte:[],

  EquipmentData:[],
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
                  return {
                    ...state,
                    SchemeAnalyteList: action.payload.analytes, // Update to handle reagents array
                  };
                
                    case GET_SCHEMEANALYTE_LIST_FAIL:
                      return {
                        ...state,
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
                      CycleAnalyte: action.payload, // Update to handle units array
                    };
                  
                      case GET_ANALYTESCYCLES_FAIL:
                        return {
                          ...state,
                          error: action.payload,
                        };

                    // Sample Analytes
                      case GET_SAMPLE_ANALYTE_LIST_SUCCESS:
                        return {
                          ...state,
                          SampleAnalyteList: action.payload.analytes, // Update to handle reagents array
                        };

                      case GET_SAMPLE_ANALYTE_LIST_FAIL:
                        return {
                          ...state,
                          error: action.payload,
                        };
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
                      
    default:
      return state;
  }
};

export default ListUnit;

