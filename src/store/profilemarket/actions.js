import {
  GET_NEARBY_PROFILES,
  GET_NEARBY_PROFILES_FAIL,
  GET_NEARBY_PROFILES_SUCCESS,
  GET_PROFILES,
  GET_PROFILES_FAIL,
  GET_PROFILES_SUCCESS,
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

export const getProfiles = () => ({
  type: GET_PROFILES,
  // payload: {},
});

export const getProfilesSuccess = Profiles => ({
  type: GET_PROFILES_SUCCESS,
  payload: Profiles,
});

export const getProfilesFail = error => ({
  type: GET_PROFILES_FAIL,
  payload: error,
});

