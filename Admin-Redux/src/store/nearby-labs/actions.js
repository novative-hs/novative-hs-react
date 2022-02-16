import {
  GET_NEARBY_LABS,
  GET_NEARBY_LABS_FAIL,
  GET_NEARBY_LABS_SUCCESS,

} from "./actionTypes";

// ----------- Sample collector list APIs actions -----------------

export const getNearbyLabs = address => ({
  type: GET_NEARBY_LABS,
  payload: address,
});

export const getNearbyLabsSuccess = nearbyLabs => ({
  type: GET_NEARBY_LABS_SUCCESS,
  payload: nearbyLabs,
});

export const getNearbyLabsFail = error => ({
  type: GET_NEARBY_LABS_FAIL,
  payload: error,
});


