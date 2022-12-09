import {
  GET_NEARBY_PACKAGES,
  GET_NEARBY_PACKAGES_FAIL,
  GET_NEARBY_PACKAGES_SUCCESS,
} from "./actionTypes";

export const getNearbyPackages = (search_type, address, id, test_name) => ({
  type: GET_NEARBY_PACKAGES,
  payload: { search_type, address, id, test_name },
});

export const getNearbyPackagesSuccess = nearbyPackages => ({
  type: GET_NEARBY_PACKAGES_SUCCESS,
  payload: nearbyPackages,
});


export const getNearbyPackagesFail = error => ({
  type: GET_NEARBY_PACKAGES_FAIL,
  payload: error,
});

