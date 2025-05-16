
import {
  GET_CYCLE_LIST,
  GET_CYCLE_LIST_SUCCESS,
  GET_CYCLE_LIST_FAIL,
  ADD_NEW_CYCLE_LIST,
  ADD_NEW_CYCLE_LIST_SUCCESS,
  ADD_NEW_CYCLE_LIST_FAIL,
  UPDATE_NEW_CYCLE_LIST,
  UPDATE_NEW_CYCLE_LIST_SUCCESS,
  UPDATE_NEW_CYCLE_LIST_FAIL,
  DELETE_CYCLE,
  DELETE_CYCLE_SUCCESS,
  DELETE_CYCLE_FAIL,
  ///////////////
  GET_CYCLE_ROUND_LIST,
  GET_CYCLE_ROUND_LIST_SUCCESS,
  GET_CYCLE_ROUND_LIST_FAIL,
  ////
  DELETE_CYCLE_ROUND_LIST,
  DELETE_CYCLE_ROUND_LIST_SUCCESS,
  DELETE_CYCLE_ROUND_LIST_FAIL,
} from "./actionTypes";

// Cycle
export const getcyclelist = id => ({
  type: GET_CYCLE_LIST,
  payload: id,
});

export const getcyclelistSuccess = CycleList => {
  console.log("Cycle List response in success action:", CycleList); 
  return {
    type: GET_CYCLE_LIST_SUCCESS,
    payload: CycleList,
  };
};

export const getcyclelistFail = (error) => {
  console.log("Error response in fail action:", error); 
  return {
    type: GET_CYCLE_LIST_FAIL,
    payload: error,
  };
};
///////////////////////////////////////
export const getCycleRoundlist = (id) => ({
  type: GET_CYCLE_ROUND_LIST,
  payload: id,
  payload: id,
});

export const getCycleRoundlistSuccess = (MethodList) => {
  console.log("MethodList response in success action:", MethodList); 
  return {
    type: GET_CYCLE_ROUND_LIST_SUCCESS,
    payload: MethodList,
  };
};

export const getCycleRoundlistFail = (error) => {
  console.log("Error response in fail action:", error); 
  return {
    type: GET_CYCLE_ROUND_LIST_FAIL,
    payload: error,
  };
};

export const addNewCycleList = (createUnit, id) => {
  console.log('Action Creator - addNewCycleList called with:', createUnit, id);
  return {
    type: ADD_NEW_CYCLE_LIST,
    payload: { createUnit, id },
  };
};

export const addNewCycleListSuccess = createUnit => ({
  type: ADD_NEW_CYCLE_LIST_SUCCESS,
  payload: createUnit,
});

export const addNewCycleListFail = error => ({
  type: ADD_NEW_CYCLE_LIST_FAIL,
  payload: error,
});


export const updateCycleList = cycle => {
  console.log("Updating cycle with data:", cycle); // Debugging console.log
  return {
    type: UPDATE_NEW_CYCLE_LIST,
    payload: cycle,
  };
};

export const updateCycleListSuccess = cycle => {
  console.log("Update cycle success with data:", cycle); // Debugging console.log
  return {
    type: UPDATE_NEW_CYCLE_LIST_SUCCESS,
    payload: cycle,
  };
};

export const updateCycleListFail = error => {
  console.log("Update cycle failed with error:", error); // Debugging console.log
  return {
    type: UPDATE_NEW_CYCLE_LIST_FAIL,
    payload: error,
  };
};


export const deleteCycle = unit => ({
  type: DELETE_CYCLE,
  payload: unit,
});

export const deleteCycleSuccess = unit => ({
  type: DELETE_CYCLE_SUCCESS,
  payload: unit,
});

export const deleteCycleFail = error => ({
  type: DELETE_CYCLE_FAIL,
  payload: error,
});


export const deleteCycleRound = unit => ({
  type: DELETE_CYCLE_ROUND_LIST,
  payload: unit,
});

export const deleteCycleRoundSuccess = unit => ({
  type: DELETE_CYCLE_ROUND_LIST_SUCCESS,
  payload: unit,
});

export const deleteCycleRoundFail = error => ({
  type: DELETE_CYCLE_ROUND_LIST_FAIL,
  payload: error,
});
