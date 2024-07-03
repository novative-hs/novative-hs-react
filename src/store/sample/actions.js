import {
  GET_SAMPLE,
  GET_SAMPLE_SUCCESS,
  GET_SAMPLE_FAIL,
  ADD_SAMPLE,
  ADD_SAMPLE_SUCCESS,
  ADD_SAMPLE_FAIL
} from "./actionTypes";

//////////INSTRUMENT

export const getSample = id => {
  console.log("Getting sample with ID:", id);  // Added console log
  return {
    type: GET_SAMPLE,
    payload: id ,  
  };
};

export const getSampleSuccess = (sample) => {
  console.log("Sample response in success action:", sample); 
  return {
    type: GET_SAMPLE_SUCCESS,
    payload: sample,
  };
};

export const getSampleFail = (error, id) => {
  console.log("Error response in fail action:", error); 
  return {
    type: GET_SAMPLE_FAIL,
    payload: { error, id },  // Modified payload to include error and id
  };
};

export const addSample = (sample) => {

  return {
    type: ADD_SAMPLE,
    payload: sample,
  };
};


export const addSampleSuccess = (sample) => {
  console.log("Sample response in success action:", sample); 
  return {
    type: ADD_SAMPLE_SUCCESS,
    payload: sample,
  };
};

export const addSampleFail = (error) => {
  console.log("Error response in fail action:", error); 
  return {
    type: ADD_SAMPLE_FAIL,
    payload: error,
  };
};
