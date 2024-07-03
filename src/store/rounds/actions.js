
import {
  GET_ROUND_LIST,
  GET_ROUND_LIST_SUCCESS,
  GET_ROUND_LIST_FAIL,
  ADD_NEW_ROUND_LIST,
  ADD_NEW_ROUND_LIST_SUCCESS,
  ADD_NEW_ROUND_LIST_FAIL,
  UPDATE_NEW_ROUND_LIST,
  UPDATE_NEW_ROUND_LIST_SUCCESS,
  UPDATE_NEW_ROUND_LIST_FAIL,
} from "./actionTypes";

// Round
export const getroundlist = id => ({
  type: GET_ROUND_LIST,
  payload: id,
});

export const getroundlistSuccess = RoundList => {
  console.log("Round List response in success action:", RoundList); 
  return {
    type: GET_ROUND_LIST_SUCCESS,
    payload: RoundList,
  };
};

export const getroundlistFail = (error) => {
  console.log("Error response in fail action:", error); 
  return {
    type: GET_ROUND_LIST_FAIL,
    payload: error,
  };
};


export const addNewRoundList = (createUnit, id) => {
  console.log('Action Creator - addNewRoundList called with:', createUnit, id);
  return {
    type: ADD_NEW_ROUND_LIST,
    payload: { createUnit, id },
  };
};

export const addNewRoundListSuccess = createUnit => ({
  type: ADD_NEW_ROUND_LIST_SUCCESS,
  payload: createUnit,
});

export const addNewRoundListFail = error => ({
  type: ADD_NEW_ROUND_LIST_FAIL,
  payload: error,
});

export const updateRoundList = unit => ({
  type: UPDATE_NEW_ROUND_LIST,
  payload: unit,
});

export const updateRoundListSuccess = unit => ({
  type: UPDATE_NEW_ROUND_LIST_SUCCESS,
  payload: unit,
});

export const updateRoundListFail = error => ({
  type: UPDATE_NEW_ROUND_LIST_FAIL,
  payload: error,
});