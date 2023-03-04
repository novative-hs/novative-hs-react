import {
  GET_LABS_LIST,
  GET_LABS_LIST_SUCCESS,
  GET_LABS_LIST_FAIL,
  GET_DONORS,
  GET_DONORS_SUCCESS,
  GET_DONORS_FAIL,
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
export const getDonors = () => ({
  type: GET_DONORS,
});

export const getDonorsSuccess = donors => ({
  type: GET_DONORS_SUCCESS,
  payload: donors,
});

export const getDonorsFail = error => ({
  type: GET_DONORS_FAIL,
  payload: error,
});