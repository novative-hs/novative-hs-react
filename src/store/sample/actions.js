import {
  GET_SAMPLE_LIST,
  GET_SAMPLE_LIST_SUCCESS,
  GET_SAMPLE_LIST_FAIL,

  ADD_NEW_SAMPLE_LIST,
  ADD_NEW_SAMPLE_LIST_SUCCESS,
  ADD_NEW_SAMPLE_LIST_FAIL,

  UPDATE_NEW_SAMPLE_LIST,
  UPDATE_NEW_SAMPLE_LIST_SUCCESS,
  UPDATE_NEW_SAMPLE_LIST_FAIL,

  DELETE_NEW_SAMPLE_LIST,
  DELETE_NEW_SAMPLE_LIST_SUCCESS,
  DELETE_NEW_SAMPLE_LIST_FAIL,
} from "./actionTypes";

export const getSamplelist = (id) => ({
  type: GET_SAMPLE_LIST,
  payload: { id },
});

export const getSamplelistSuccess = (ListUnitt) => {
  return {
    type: GET_SAMPLE_LIST_SUCCESS,
    payload: ListUnitt,
  };
};

export const getSamplelistFail = (error) => {
  return {
    type: GET_SAMPLE_LIST_FAIL,
    payload: error,
  };
};



export const addNewSampleList = (sample, id) => {
  return {
    type: ADD_NEW_SAMPLE_LIST,
    payload: { sample , id},
  };
};

export const addNewSampleListSuccess = sample => {
  return {
    type: ADD_NEW_SAMPLE_LIST_SUCCESS,
    payload: sample,
  };
};

export const addNewSampleListFail = error => {
  return {
    type: ADD_NEW_SAMPLE_LIST_FAIL,
    payload: error,
  };
};
export const updateSampleList = sample => ({
  type: UPDATE_NEW_SAMPLE_LIST,
  payload: sample,
});

export const updateSampleListSuccess = sample => ({
  type: UPDATE_NEW_SAMPLE_LIST_SUCCESS,
  payload: sample,
});

export const updateSampleListFail = error => ({
  type: UPDATE_NEW_SAMPLE_LIST_FAIL,
  payload: error,
});


export const deleteSampleList = sample => ({
  type: DELETE_NEW_SAMPLE_LIST,
  payload: sample, // Ensure sample object contains only necessary data, especially sample.id
});

export const deleteSampleListSuccess = sample => ({
  type: DELETE_NEW_SAMPLE_LIST_SUCCESS,
  payload: sample,
});

export const deleteSampleListFail = error => ({
  type: DELETE_NEW_SAMPLE_LIST_FAIL,
  payload: error,
});
