import {
  GET_LABS_LIST,
  GET_LABS_LIST_SUCCESS,
  GET_LABS_LIST_FAIL,
 
} from "./actionTypes";

export const getLabsList = () => ({
  type: GET_LABS_LIST,
  payload: {},
});

export const getLabsListSuccess =
  labs => ({
    type: GET_LABS_LIST_SUCCESS,
    payload: labs,
  });

export const getLabsListFail = error => ({
  type: GET_LABS_LIST_FAIL,
  payload: error,
});
