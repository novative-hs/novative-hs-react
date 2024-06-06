import {
  GET_NEARBY_LABS,
  GET_NEARBY_LABS_FAIL,
  GET_NEARBY_LABS_SUCCESS,
 
  GET_REGION_WISE_ADVERTISEMENT,
  GET_REGION_WISE_ADVERTISEMENT_FAIL,
  GET_REGION_WISE_ADVERTISEMENT_SUCCESS,
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


export const getRegionWiseAdvertisement = locationDetails => ({
  type: GET_REGION_WISE_ADVERTISEMENT,
  payload: { locationDetails },
});

export const getRegionWiseAdvertisementSuccess = regionWiseAdvertisement => ({
  type: GET_REGION_WISE_ADVERTISEMENT_SUCCESS,
  payload: regionWiseAdvertisement,
});

export const getRegionWiseAdvertisementFail = error => ({
  type: GET_REGION_WISE_ADVERTISEMENT_FAIL,
  payload: error,
});


export const getAdvLive = locationDetails => ({
  type: GET_ADV_LIVE,
  payload: { locationDetails },
});

export const getAdvLiveSuccess = advLives => ({
  type: GET_ADV_LIVE_SUCCESS,
  payload: advLives,
});

export const getAdvLiveFail = error => ({
  type: GET_ADV_LIVE_FAIL,
  payload: error,
});

