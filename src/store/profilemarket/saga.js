import { call, put, takeEvery } from "redux-saga/effects";

// TestMarket Redux States
import { GET_NEARBY_PROFILES, GET_PROFILES, GET_TERRITORIES_LIST } from "./actionTypes";
import { getNearbyProfilesFail, getNearbyProfilesSuccess,  getTerritoriesListSuccess,
  getTerritoriesListFail,getProfilesSuccess, getProfilesFail,getTerritoriesList } from "./actions";

// Include Helper File with needed methods
import { getNearbyProfiles, getProfiles } from "helpers/django_api_helper";

function* fetchTerritoriesList(object) {
  try {
    const response = yield call(getTerritoriesList, object.payload);
    yield put(getTerritoriesListSuccess(response));
  } catch (error) {
    yield put(getTerritoriesListFail(error));
  }
}

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
  yield takeEvery(
    GET_TERRITORIES_LIST,
    fetchTerritoriesList
  );
}

export default ProfileMarketSaga;
