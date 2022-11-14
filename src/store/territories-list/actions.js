import {
  GET_TERRITORIES_LIST,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
} from "./actionTypes";

export const getTerritoriesList = () => ({
  type: GET_TERRITORIES_LIST,
  payload: {},
});

export const getTerritoriesListSuccess =
  territories => ({
    type: GET_TERRITORIES_LIST_SUCCESS,
    payload: territories,
  });

export const getTerritoriesListFail = error => ({
  type: GET_TERRITORIES_LIST_FAIL,
  payload: error,
});
