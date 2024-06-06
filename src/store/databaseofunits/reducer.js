import {
  GET_INSTRUMENT_TYPE_LIST_SUCCESS,
  GET_INSTRUMENT_TYPE_LIST_FAIL,
  ADD_NEW_INSTRUMENT_TYPE_SUCCESS,
  ADD_NEW_INSTRUMENT_TYPE_FAIL,
  UPDATE_NEW_INSTRUMENT_TYPE_SUCCESS,
  UPDATE_NEW_INSTRUMENT_TYPE_FAIL,
  GET_METHOD_LIST_SUCCESS,
  GET_METHOD_LIST_FAIL,
  ADD_NEW_METHOD_LIST_SUCCESS,
  ADD_NEW_METHOD_LIST_FAIL,
  UPDATE_NEW_METHOD_LIST_SUCCESS,
  UPDATE_NEW_METHOD_LIST_FAIL,
  GET_ANALYTE_LIST_SUCCESS,
  GET_ANALYTE_LIST_FAIL,
  ADD_NEW_ANALYTE_LIST_SUCCESS,
  ADD_NEW_ANALYTE_LIST_FAIL,
  UPDATE_NEW_ANALYTE_LIST_SUCCESS,
  UPDATE_NEW_ANALYTE_LIST_FAIL
} from "./actionTypes";

const INIT_STATE = {
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


//////////////////////////method
        case GET_METHOD_LIST_SUCCESS:
          console.log("Data received in success action:", action.payload); // Log the action.payload
          return {
            ...state,
            ListUnit: action.payload,
          };
    
        case GET_METHOD_LIST_FAIL:
          return {
            ...state,
            error: action.payload,
          };
    
          case ADD_NEW_METHOD_LIST_SUCCESS:
            return {
              ...state,
              AddUnits: [...state.AddUnits, action.payload.data],
            };
      
          case ADD_NEW_METHOD_LIST_FAIL:
            return {
              ...state,
              error: action.payload,
            };
          case UPDATE_NEW_METHOD_LIST_SUCCESS:
            return {
              ...state,
              ListUnit: state.ListUnit.map(unit =>
                unit.id.toString() === action.payload.id.toString()
                  ? { unit, ...action.payload }
                  : unit
              ),
            };
      
          case UPDATE_NEW_METHOD_LIST_FAIL:
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
    default:
      return state;
  }
};

export default ListUnit;

