import { call, put, takeEvery } from "redux-saga/effects";

// Ecommerce Redux States
import { GET_PRODUCT_DETAIL, GET_NEARBY_LABS } from "./actionTypes";
import {
  getProductDetailFail,
  getProductDetailSuccess,
  getNearbyLabsFail,
  getNearbyLabsSuccess,
  getShopsFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getProductDetail } from "helpers/fakebackend_helper";

import { getNearbyLabs } from "helpers/django_api_helper";

function* fetchNearbyLabs(object) {
  try {
    const response = yield call(
      getNearbyLabs,
      object.payload.address,
      object.payload.id
    );
    yield put(getNearbyLabsSuccess(response.data));
  } catch (error) {
    yield put(getNearbyLabsFail(error));
  }
}

function* fetchProductDetail({ productId }) {
  try {
    const response = yield call(getProductDetail, productId);
    yield put(getProductDetailSuccess(response));
  } catch (error) {
    yield put(getProductDetailFail(error));
  }
}

function* labMarketSaga() {
  yield takeEvery(GET_NEARBY_LABS, fetchNearbyLabs);
  yield takeEvery(GET_PRODUCT_DETAIL, fetchProductDetail);
}

export default labMarketSaga;
