import {
  GET_INSTRUMENT_LIST_SUCCESS,
  GET_INSTRUMENT_LIST_FAIL,
  ADD_NEW_INSTRUMENT_SUCCESS,
  ADD_NEW_INSTRUMENT_FAIL,
  UPDATE_INSTRUMENT_SUCCESS,
  UPDATE_INSTRUMENT_FAIL
} from "./actionTypes";

const INIT_STATE = {
  Instrument:[],
  AddUnits: [],  
  unit: [],
  error: {}, 
};

const Instrument = (state = INIT_STATE, action) => {
  switch (action.type) {
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

    default:
      return state;
  }
};

export default Instrument;

