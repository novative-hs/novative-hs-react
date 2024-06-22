import {
  GET_SAMPLE_SUCCESS,
  GET_SAMPLE_FAIL,
  ADD_SAMPLE_SUCCESS,
  ADD_SAMPLE_FAIL
} from "./actionTypes";

const INIT_STATE = {
  sample:[],
  error: {}, 
};

const sample = (state = INIT_STATE, action) => {
  switch (action.type) {
case GET_SAMPLE_SUCCESS:

  return {
    ...state,
    sample: action.payload.data,
  };

case GET_SAMPLE_FAIL:
  return {
    ...state,
    error: action.payload,
  };

  case ADD_SAMPLE_SUCCESS:
    return {
      ...state,
      sample: [...state.sample, action.payload.data],
    };

  case ADD_SAMPLE_FAIL:
    return {
      ...state,
      error: action.payload,
    };
      
    default:
      return state;
  }
};

export default sample;

