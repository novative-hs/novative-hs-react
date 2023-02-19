import { call, put, takeEvery } from "redux-saga/effects";

// TestMarket Redux States
import { GET_NEARBY_RADIOLOGY, GET_RADIOLOGY } from "./actionTypes";
import { getNearbyRadiologyFail, getNearbyRadiologySuccess, getRadiologyFail, getRadiologySuccess } from "./actions";

// Include Helper File with needed methods
import { getNearbyRadiology , getRadiology } from "helpers/django_api_helper";

function* fetchNearbyRadiology(object) {
  try {
    const response = yield call(
      getNearbyRadiology,
      object.payload.search_type,
      object.payload.address,
      object.payload.id,
      object.payload.test_name
    );
    yield put(getNearbyRadiologySuccess(response.data));
  } catch (error) {
    yield put(getNearbyRadiologyFail(error));
  }
}
function* fetchRadiology() {
  try {
    const response = yield call(getRadiology);
    yield put(getRadiologySuccess(response));
  } catch (error) {
    yield put(getRadiologyFail(error));
  }
}

function* RadiologyMarketSaga() {
  yield takeEvery(GET_NEARBY_RADIOLOGY, fetchNearbyRadiology);
  yield takeEvery(GET_RADIOLOGY, fetchRadiology);
}

export default RadiologyMarketSaga;
