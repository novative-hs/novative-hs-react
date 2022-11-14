import { call, put, takeEvery } from "redux-saga/effects";

// TestMarket Redux States
import { GET_NEARBY_PROFILES } from "./actionTypes";
import { getNearbyProfilesFail, getNearbyProfilesSuccess } from "./actions";

// Include Helper File with needed methods
import { getNearbyProfiles } from "helpers/django_api_helper";

function* fetchNearbyProfiles(object) {
  try {
    const response = yield call(
      getNearbyProfiles,
      object.payload.search_type,
      object.payload.address,
      object.payload.id,
      object.payload.test_name
    );
    yield put(getNearbyProfilesSuccess(response.data));
  } catch (error) {
    yield put(getNearbyProfilesFail(error));
  }
}
function* ProfileMarketSaga() {
  yield takeEvery(GET_NEARBY_PROFILES, fetchNearbyProfiles);
}

export default ProfileMarketSaga;
