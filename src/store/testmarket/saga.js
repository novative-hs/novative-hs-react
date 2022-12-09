import { call, put, takeEvery } from "redux-saga/effects";

// TestMarket Redux States
import { GET_NEARBY_TESTS } from "./actionTypes";
import { getNearbyTestsFail, getNearbyTestsSuccess } from "./actions";

// Include Helper File with needed methods
import { getNearbyTests } from "helpers/django_api_helper";

function* fetchNearbyTests(object) {
  try {
    const response = yield call(
      getNearbyTests,
      object.payload.search_type,
      object.payload.address,
      object.payload.id,
      object.payload.test_name
    );
    yield put(getNearbyTestsSuccess(response.data));
  } catch (error) {
    yield put(getNearbyTestsFail(error));
  }
}
function* TestMarketSaga() {
  yield takeEvery(GET_NEARBY_TESTS, fetchNearbyTests);
}

export default TestMarketSaga;
