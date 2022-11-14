import {
  GET_NEARBY_TESTS_FAIL,
  GET_NEARBY_TESTS_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  nearbyTests: [],
  error: {},
};

const TestMarket = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_NEARBY_TESTS_SUCCESS:
      return {
        ...state,
        nearbyTests: action.payload.data,
      };

    case GET_NEARBY_TESTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default TestMarket;