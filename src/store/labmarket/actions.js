import {
  GET_NEARBY_LABS,
  GET_NEARBY_LABS_FAIL,
  GET_NEARBY_LABS_SUCCESS,
  GET_ADV_LIVE,
  GET_ADV_LIVE_FAIL,
  GET_ADV_LIVE_SUCCESS,
} from "./actionTypes";

export const getNearbyLabs = locationDetails => ({
  type: GET_NEARBY_LABS,
  payload: { locationDetails },
});

export const getNearbyLabsSuccess = nearbyLabs => ({
  type: GET_NEARBY_LABS_SUCCESS,
  payload: nearbyLabs,
});

export const getNearbyLabsFail = error => ({
  type: GET_NEARBY_LABS_FAIL,
  payload: error,
});


export const getAdvLive = id => ({
  type: GET_ADV_LIVE,
  payload: id,
});

export const getAdvLiveSuccess = advLives => ({
  type: GET_ADV_LIVE_SUCCESS,
  payload: advLives,
});

export const getAdvLiveFail = error => ({
  type: GET_ADV_LIVE_FAIL,
  payload: error,
});

