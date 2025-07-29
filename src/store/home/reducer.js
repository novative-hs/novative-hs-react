import {
  GET_HOME_DATA_SUCCESS,
  GET_HOME_DATA_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  home: [],
  error: {}, 
};

const home = (state = INIT_STATE, action) => {
  switch (action.type) {
case GET_HOME_DATA_SUCCESS:
  console.log("Data received in success action:", action.payload); // Log the action.payload
  return {
    ...state,
    home: action.payload,
  };

case GET_HOME_DATA_FAIL:
  return {
    ...state,
    error: action.payload,
  };

  
    default:
      return state;
  }
};

export default home;

