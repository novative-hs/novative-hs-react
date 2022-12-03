import { call, put, takeEvery } from "redux-saga/effects";

// TestMarket Redux States
import { GET_NEARBY_PROFILES, GET_PROFILES } from "./actionTypes";
import { getNearbyProfilesFail, getNearbyProfilesSuccess, getProfilesSuccess, getProfilesFail } from "./actions";

// Include Helper File with needed methods
import { getNearbyProfiles, getProfiles } from "helpers/django_api_helper";

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

function* fetchProfiles() {
  try {
    const response = yield call(getProfiles);
    yield put(getProfilesSuccess(response));
  } catch (error) {
    yield put(getProfilesFail(error));
  }
}
function* ProfileMarketSaga() {
  yield takeEvery(GET_NEARBY_PROFILES, fetchNearbyProfiles);
  yield takeEvery(GET_PROFILES, fetchProfiles);
}

export default ProfileMarketSaga;
