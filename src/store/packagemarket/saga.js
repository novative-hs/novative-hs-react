import { call, put, takeEvery } from "redux-saga/effects";

// TestMarket Redux States
import { GET_NEARBY_PACKAGES, GET_PACKAGES } from "./actionTypes";
import { getNearbyPackagesFail, getNearbyPackagesSuccess, getPackagesFail, getPackagesSuccess } from "./actions";

// Include Helper File with needed methods
import { getNearbyPackages , getPackages } from "helpers/django_api_helper";

function* fetchNearbyPackages(object) {
  try {
    const response = yield call(
      getNearbyPackages,
      object.payload.search_type,
      object.payload.address,
      object.payload.id,
      object.payload.test_name
    );
    yield put(getNearbyPackagesSuccess(response.data));
  } catch (error) {
    yield put(getNearbyPackagesFail(error));
  }
}
function* fetchPackages() {
  try {
    const response = yield call(getPackages);
    yield put(getPackagesSuccess(response));
  } catch (error) {
    yield put(getPackagesFail(error));
  }
}

function* PackageMarketSaga() {
  yield takeEvery(GET_NEARBY_PACKAGES, fetchNearbyPackages);
  yield takeEvery(GET_PACKAGES, fetchPackages);
}

export default PackageMarketSaga;
