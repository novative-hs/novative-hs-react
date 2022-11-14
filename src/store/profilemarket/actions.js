import {
  GET_NEARBY_PROFILES,
  GET_NEARBY_PROFILES_FAIL,
  GET_NEARBY_PROFILES_SUCCESS,
} from "./actionTypes";

export const getNearbyProfiles = (search_type, address, id, test_name) => ({
  type: GET_NEARBY_PROFILES,
  payload: { search_type, address, id, test_name },
});

export const getNearbyProfilesSuccess = nearbyProfiles => ({
  type: GET_NEARBY_PROFILES_SUCCESS,
  payload: nearbyProfiles,
});


export const getNearbyProfilesFail = error => ({
  type: GET_NEARBY_PROFILES_FAIL,
  payload: error,
});

