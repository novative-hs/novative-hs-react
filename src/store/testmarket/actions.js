import {
  GET_NEARBY_TESTS,
  GET_NEARBY_TESTS_FAIL,
  GET_NEARBY_TESTS_SUCCESS,
} from "./actionTypes";

export const getNearbyTests = (search_type, address, id, test_name) => ({
  type: GET_NEARBY_TESTS,
  payload: { search_type, address, id, test_name },
});

export const getNearbyTestsSuccess = nearbyTests => ({
  type: GET_NEARBY_TESTS_SUCCESS,
  payload: nearbyTests,
});


export const getNearbyTestsFail = error => ({
  type: GET_NEARBY_TESTS_FAIL,
  payload: error,
});

