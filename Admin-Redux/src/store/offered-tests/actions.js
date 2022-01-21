import {
  GET_OFFERED_TEST_PROFILE,
  GET_OFFERED_TEST_PROFILE_FAIL,
  GET_OFFERED_TEST_PROFILE_SUCCESS,
  GET_OFFERED_TESTS,
  GET_OFFERED_TESTS_FAIL,
  GET_OFFERED_TESTS_SUCCESS,
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

export const getOfferedTests = () => ({
  type: GET_OFFERED_TESTS,
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
