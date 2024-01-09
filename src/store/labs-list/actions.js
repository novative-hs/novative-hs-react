import {
  GET_LABS_LIST,
  GET_LABS_LIST_SUCCESS,
  GET_LABS_LIST_FAIL,
  GET_DONORSA,
  GET_DONORSA_SUCCESS,
  GET_DONORSA_FAIL,
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
export const getDonorsA = () => ({
  type: GET_DONORSA,
});

export const getDonorsASuccess = donors => ({
  type: GET_DONORSA_SUCCESS,
  payload: donors,
});

export const getDonorsAFail = error => ({
  type: GET_DONORSA_FAIL,
  payload: error,
});