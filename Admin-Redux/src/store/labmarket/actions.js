import {
  GET_NEARBY_LABS,
  GET_NEARBY_LABS_FAIL,
  GET_NEARBY_LABS_SUCCESS,
  GET_PRODUCT_DETAIL,
  GET_PRODUCT_DETAIL_FAIL,
  GET_PRODUCT_DETAIL_SUCCESS,
} from "./actionTypes";

export const getNearbyLabs = (address, id) => ({
  type: GET_NEARBY_LABS,
  payload: { address, id },
});

export const getNearbyLabsSuccess = nearbyLabs => ({
  type: GET_NEARBY_LABS_SUCCESS,
  payload: nearbyLabs,
});

export const getNearbyLabsFail = error => ({
  type: GET_NEARBY_LABS_FAIL,
  payload: error,
});

export const getProductDetail = productId => ({
  type: GET_PRODUCT_DETAIL,
  productId,
});

export const getProductDetailSuccess = products => ({
  type: GET_PRODUCT_DETAIL_SUCCESS,
  payload: products,
});

export const getProductDetailFail = error => ({
  type: GET_PRODUCT_DETAIL_FAIL,
  payload: error,
});
