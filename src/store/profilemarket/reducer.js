import {
  GET_NEARBY_PROFILES_FAIL,
  GET_NEARBY_PROFILES_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  nearbyProfiles: [],
  error: {},
};

const ProfileMarket = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_NEARBY_PROFILES_SUCCESS:
      return {
        ...state,
        nearbyProfiles: action.payload.data,
      };

    case GET_NEARBY_PROFILES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default ProfileMarket;
