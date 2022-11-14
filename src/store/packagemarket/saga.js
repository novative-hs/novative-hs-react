import { call, put, takeEvery } from "redux-saga/effects";

// TestMarket Redux States
import { GET_NEARBY_PACKAGES } from "./actionTypes";
import { getNearbyPackagesFail, getNearbyPackagesSuccess } from "./actions";

// Include Helper File with needed methods
import { getNearbyPackages } from "helpers/django_api_helper";

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
function* PackageMarketSaga() {
  yield takeEvery(GET_NEARBY_PACKAGES, fetchNearbyPackages);
}

export default PackageMarketSaga;
