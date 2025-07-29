import {
  GET_HOME_DATA,
  GET_HOME_DATA_SUCCESS,
  GET_HOME_DATA_FAIL,
  
} from "./actionTypes";

export const gethomedata = (id) => ({
    type: GET_HOME_DATA,
    payload: id,
  });
  
  export const gethomedataSuccess = home => {
    console.log("home response in success action:", home); 
    return {
      type: GET_HOME_DATA_SUCCESS,
      payload: home,
    };
  };
  
  export const gethomedataFail = (error) => {
    // console.log("Error response in fail action:", error); 
    return {
      type: GET_HOME_DATA_FAIL,
      payload: error,
    };
  };




