import {
  GET_INSTRUMENT_TYPE_LIST_SUCCESS,
  GET_INSTRUMENT_TYPE_LIST_FAIL,
  ADD_NEW_INSTRUMENT_TYPE_SUCCESS,
  ADD_NEW_INSTRUMENT_TYPE_FAIL,
  UPDATE_NEW_INSTRUMENT_TYPE_SUCCESS,
  UPDATE_NEW_INSTRUMENT_TYPE_FAIL,
  GET_ANALYTE_LIST_SUCCESS,
  GET_ANALYTE_LIST_FAIL,
  ADD_NEW_ANALYTE_LIST_SUCCESS,
  ADD_NEW_ANALYTE_LIST_FAIL,
  UPDATE_NEW_ANALYTE_LIST_SUCCESS,
  UPDATE_NEW_ANALYTE_LIST_FAIL,


  GET_CYCLEANALYTE_LIST_SUCCESS,
  GET_CYCLEANALYTE_LIST_FAIL,
  ADD_NEW_CYCLEANALYTE_SUCCESS,
  ADD_NEW_CYCLEANALYTE_FAIL,
  UPDATE_CYCLEANALYTE_SUCCESS,
  UPDATE_CYCLEANALYTE_FAIL
} from "./actionTypes";

const INIT_STATE = {
  CycleAnalyteList: [],
  AddCycleAnalyte: [],
  cycleanalyte: [],


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

              // Cycle Analytes
                case GET_CYCLEANALYTE_LIST_SUCCESS:
                  return {
                    ...state,
                    CycleAnalyteList: action.payload.analytes, // Update to handle reagents array
                  };
                
                    case GET_CYCLEANALYTE_LIST_FAIL:
                      return {
                        ...state,
                        error: action.payload,
                      };
                    case ADD_NEW_CYCLEANALYTE_SUCCESS:
                      return {
                        ...state,
                        AddCycleAnalyte: [...state.AddCycleAnalyte, action.payload.data],
                      };
                
                    case ADD_NEW_CYCLEANALYTE_FAIL:
                      return {
                        ...state,
                        error: action.payload,
                      };
                    case UPDATE_CYCLEANALYTE_SUCCESS:
                      return {
                        ...state,
                        CycleAnalyteList: state.CycleAnalyteList.map(cycleanalyte =>
                          cycleanalyte.id.toString() === action.payload.id.toString()
                            ? { cycleanalyte, ...action.payload }
                            : cycleanalyte
                        ),
                      };
                
                    case UPDATE_CYCLEANALYTE_FAIL:
                      return {
                        ...state,
                        error: action.payload,
                      };
    default:
      return state;
  }
};

export default ListUnit;

