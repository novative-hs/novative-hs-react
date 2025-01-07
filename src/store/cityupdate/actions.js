import {
  GET_DATA,
  GET_DATA_FAIL,
  GET_DATA_SUCCESS,
  ADD_DATA,
  ADD_DATA_SUCCESS,
  ADD_DATA_FAIL,
} from './actionTypes';

export const getData = (id) => {
  console.log("Dispatching GET_DATA action with payload:", id);
  return{
    type: GET_DATA,
  payload: id,
  }
  
};

export const getDataSuccess = (tablelist) => (
  console.log("data in actions", tablelist),
  {
    type: GET_DATA_SUCCESS,
    payload: tablelist,
  }
);

export const getDataFail = (error) => ({
  type: GET_DATA_FAIL,
  payload: error,
});

// Add Data Action with validation
export const addData = (tablecreate, id) => ({
      type: ADD_DATA,
      payload: { tablecreate, id },
    
  });


export const addDataSuccess = (tablecreate) => ({
  type: ADD_DATA_SUCCESS,
  payload: tablecreate,
});

export const addDataFail = (error) => ({
  type: ADD_DATA_FAIL,
  payload: error,
});
