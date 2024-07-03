import {
  GET_LABS_LIST,
  GET_LABS_LIST_SUCCESS,
  GET_LABS_LIST_FAIL,
  
  GET_LC_LIST,
  GET_LC_LIST_SUCCESS,
  GET_LC_LIST_FAIL,
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

//////////////////////////////

/////////////////
export const getLcList = () => ({
  type: GET_LC_LIST,
  payload: {},
});

export const getLcListSuccess =
  donors => ({
    type: GET_LC_LIST_SUCCESS,
    payload: donors,
  });

export const getLcListFail = error => ({
  type: GET_LC_LIST_FAIL,
  payload: error,
});
////////////////////
