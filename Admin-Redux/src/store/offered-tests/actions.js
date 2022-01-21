import {
  GET_TESTS,
  GET_TESTS_FAIL,
  GET_TESTS_SUCCESS,
  GET_OFFERED_TESTS,
  GET_OFFERED_TESTS_FAIL,
  GET_OFFERED_TESTS_SUCCESS,
  GET_OFFERED_TEST_PROFILE,
  GET_OFFERED_TEST_PROFILE_FAIL,
  GET_OFFERED_TEST_PROFILE_SUCCESS,
  ADD_NEW_OFFERED_TEST,
  ADD_OFFERED_TEST_SUCCESS,
  ADD_OFFERED_TEST_FAIL,
  UPDATE_OFFERED_TEST,
  UPDATE_OFFERED_TEST_SUCCESS,
  UPDATE_OFFERED_TEST_FAIL,
  DELETE_OFFERED_TEST,
  DELETE_OFFERED_TEST_SUCCESS,
  DELETE_OFFERED_TEST_FAIL,
} from "./actionTypes";

export const getTests = () => ({
  type: GET_TESTS,
});

export const getTestsSuccess = tests => ({
  type: GET_TESTS_SUCCESS,
  payload: tests,
});

export const getTestsFail = error => ({
  type: GET_TESTS_FAIL,
  payload: error,
});

export const getOfferedTests = id => ({
  type: GET_OFFERED_TESTS,
  payload: id,
});

export const getOfferedTestsSuccess = offeredTests => ({
  type: GET_OFFERED_TESTS_SUCCESS,
  payload: offeredTests,
});

export const getOfferedTestsFail = error => ({
  type: GET_OFFERED_TESTS_FAIL,
  payload: error,
});

export const getOfferedTestProfile = () => ({
  type: GET_OFFERED_TEST_PROFILE,
});

export const getOfferedTestProfileSuccess = offeredTestProfile => ({
  type: GET_OFFERED_TEST_PROFILE_SUCCESS,
  payload: offeredTestProfile,
});

export const getOfferedTestProfileFail = error => ({
  type: GET_OFFERED_TEST_PROFILE_FAIL,
  payload: error,
});

export const addNewOfferedTest = offeredTest => ({
  type: ADD_NEW_OFFERED_TEST,
  payload: offeredTest,
});

export const addOfferedTestSuccess = offeredTest => ({
  type: ADD_OFFERED_TEST_SUCCESS,
  payload: offeredTest,
});

export const addOfferedTestFail = error => ({
  type: ADD_OFFERED_TEST_FAIL,
  payload: error,
});

export const updateOfferedTest = offeredTest => ({
  type: UPDATE_OFFERED_TEST,
  payload: offeredTest,
});

export const updateOfferedTestSuccess = offeredTest => ({
  type: UPDATE_OFFERED_TEST_SUCCESS,
  payload: offeredTest,
});

export const updateOfferedTestFail = error => ({
  type: UPDATE_OFFERED_TEST_FAIL,
  payload: error,
});

export const deleteOfferedTest = offeredTest => ({
  type: DELETE_OFFERED_TEST,
  payload: offeredTest,
});

export const deleteOfferedTestSuccess = offeredTest => ({
  type: DELETE_OFFERED_TEST_SUCCESS,
  payload: offeredTest,
});

export const deleteOfferedTestFail = error => ({
  type: DELETE_OFFERED_TEST_FAIL,
  payload: error,
});
