import {
  GET_NEARBY_LABS_SUCCESS,
  GET_NEARBY_LABS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  nearbyLabs: [],
  error: {},
};

const nearbyLabs = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_NEARBY_LABS_SUCCESS:
      return {
        ...state,
        nearbyLabs: [...state.nearbyLabs, action.payload],
      };

    case GET_NEARBY_LABS_FAIL:
      return {
        ...state,
        error: action.payload,
      };



    default:
      return state;
  }
};

export default nearbyLabs;
