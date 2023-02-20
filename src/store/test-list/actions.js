import {
  GET_TESTS_LIST,
  GET_TESTS_LIST_SUCCESS,
  GET_TESTS_LIST_FAIL,
} from "./actionTypes";

export const getTestsList = () => ({
  type: GET_TESTS_LIST,
  payload: {},
});

export const getTestsListSuccess =
  tests => ({
    type: GET_TESTS_LIST_SUCCESS,
    payload: tests,
  });

export const getTestsListFail = error => ({
  type: GET_TESTS_LIST_FAIL,
  payload: error,
});
