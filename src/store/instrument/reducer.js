import {
  GET_INSTRUMENT_LIST_SUCCESS,
  GET_INSTRUMENT_LIST_FAIL,
  ADD_NEW_INSTRUMENT_SUCCESS,
  ADD_NEW_INSTRUMENT_FAIL,
  UPDATE_INSTRUMENT_SUCCESS,
  UPDATE_INSTRUMENT_FAIL,
  GET_ANALYTESEQUIPMENTS_LIST_SUCCESS,
  GET_ANALYTESEQUIPMENTS_LIST_FAIL,
  ADD_NEW_ANALYTESEQUIPMENTS_SUCCESS,
  ADD_NEW_ANALYTESEQUIPMENTS_FAIL,
  UPDATE_ANALYTESEQUIPMENTS_SUCCESS,
  UPDATE_ANALYTESEQUIPMENTS_FAIL,
  DELETE_INSTRUMENT_SUCCESS,
  DELETE_INSTRUMENT_FAIL

} from "./actionTypes";

const INIT_STATE = {
  EquipmentAnalyteList: [],
  AddAnalyteEquipments: [],
  analytesequipment: [],


  Instrument:[],
  AddUnits: [],  
  unit: [],
  error: {}, 
};

const Instrument = (state = INIT_STATE, action) => {
  switch (action.type) {

/////analytesequipments
case GET_ANALYTESEQUIPMENTS_LIST_SUCCESS:
  console.log("Reducer - Action Payload for GET_ANALYTESEQUIPMENTS_LIST_SUCCESS:", action.payload);
  
  const updatedStateSuccess = {
    ...state,
    EquipmentAnalyteList: action.payload.equipments, // Update to handle equipment list
    analyte_name: action.payload.analyte_name,       // Store the analyte name
  };
  
  console.log("Reducer - Updated State for GET_ANALYTESEQUIPMENTS_LIST_SUCCESS:", updatedStateSuccess);
  return updatedStateSuccess;

case GET_ANALYTESEQUIPMENTS_LIST_FAIL:
  console.error("Reducer - Error Payload for GET_ANALYTESEQUIPMENTS_LIST_FAIL:", action.payload);
  
  const updatedStateFail = {
    ...state,
    error: action.payload,
  };
    case ADD_NEW_ANALYTESEQUIPMENTS_SUCCESS:
      return {
        ...state,
        AddAnalyteEquipments: [...state.AddAnalyteEquipments, action.payload.data],
      };

    case ADD_NEW_ANALYTESEQUIPMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case UPDATE_ANALYTESEQUIPMENTS_SUCCESS:
      return {
        ...state,
        EquipmentAnalyteList: state.EquipmentAnalyteList.map(analytesequipment =>
          analytesequipment.id.toString() === action.payload.id.toString()
            ? { analytesequipment, ...action.payload }
            : analytesequipment
        ),
      };

    case UPDATE_ANALYTESEQUIPMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

case GET_INSTRUMENT_LIST_SUCCESS:
  console.log("Data received in success action:", action.payload); // Log the action.payload
  return {
    ...state,
    Instrument: action.payload,
  };

case GET_INSTRUMENT_LIST_FAIL:
  return {
    ...state,
    error: action.payload,
  };

  case ADD_NEW_INSTRUMENT_SUCCESS:
    return {
      ...state,
      AddUnits: [...state.AddUnits, action.payload.data],
    };

  case ADD_NEW_INSTRUMENT_FAIL:
    return {
      ...state,
      error: action.payload,
    };
  case UPDATE_INSTRUMENT_SUCCESS:
    return {
      ...state,
      Instrument: state.Instrument.map(unit =>
        unit.id.toString() === action.payload.id.toString()
          ? { unit, ...action.payload }
          : unit
      ),
    };

  case UPDATE_INSTRUMENT_FAIL:
    return {
      ...state,
      error: action.payload,
    };
    //////
    case DELETE_INSTRUMENT_SUCCESS:
          return {
            ...state,
            Instrument: state.Instrument.filter(
              unit => unit.id.toString() !== action.payload.id.toString()
            ),
          };
    
        case DELETE_INSTRUMENT_FAIL:
          return {
            ...state,
            error: action.payload,
          };


    default:
      return state;
  }
};

export default Instrument;

