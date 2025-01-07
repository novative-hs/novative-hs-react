// reducers.js

import {
  GET_DATA_SUCCESS,
  GET_DATA_FAIL,
  ADD_DATA_SUCCESS,
  ADD_DATA_FAIL,
} from './actionTypes';

// Initial state of the reducer
const INIT_STATE = {
  tablelist: [],
  error: null,
  loading: true,
  tablecreate: [],
};

// City reducer function
const cityReducer = (state = INIT_STATE, action) => {
  console.log("Reducer received action:", action);


  switch (action.type) {
    // Case for successful GET data request
    case GET_DATA_SUCCESS:
      console.log("GET_DATA_SUCCESS action payload:", action.payload);
      return {
        ...state,
        tablelist: action.payload,  // Set new table list from the payload
        error: null,                   // Reset any previous error
        loading: false,                // Set loading to false after data is fetched
      };

    // Case for failed GET data request
    case GET_DATA_FAIL:
      console.error("GET_DATA_FAIL error payload:", action.payload);
      return {
        ...state,
        error: action.payload,         // Set error message
        loading: false,                // Set loading to false
      };

    // Case for successful ADD data request
    case ADD_DATA_SUCCESS:
    console.log("ADD_DATA_SUCCESS triggered with payload:", action.payload); // Debug log
    return {
        ...state,
        tablelist: [...state.tablelist, action.payload], // Assuming data is an array
        error: null,
    };
case ADD_DATA_FAIL:
    console.log("ADD_DATA_FAIL triggered with payload:", action.payload); // Debug log
    return {
        ...state,
        error: action.payload,
    };


    // Default case to return the current state
    default:
      return state;
  }
};

// Export the cityReducer as the default export
export default cityReducer;
