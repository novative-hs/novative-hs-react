import { call, put, takeEvery } from "redux-saga/effects";

// LabMarket Redux States
import { GET_NEARBY_LABS, 
  GET_ADV_LIVE } from "./actionTypes";
import { getNearbyLabsFail, getNearbyLabsSuccess, 
  getAdvLiveFail, getAdvLiveSuccess } from "./actions";

// Include Helper File with needed methods
import { getNearbyLabs, getAdvLive } from "helpers/django_api_helper";

function* fetchNearbyLabs(object) {
  try {
    const response = yield call(getNearbyLabs, object.payload.locationDetails);
    yield put(getNearbyLabsSuccess(response.data));
  } catch (error) {
    yield put(getNearbyLabsFail(error));
  }
}

function* fetchAdvLive(object) {
  try {
    const response = yield call(getAdvLive, object.payload);
    yield put(getAdvLiveSuccess(response));
  } catch (error) {
    yield put(getAdvLiveFail(error));
  }
}

function* labMarketSaga() {
  yield takeEvery(GET_NEARBY_LABS, fetchNearbyLabs);
  yield takeEvery(GET_ADV_LIVE, fetchAdvLive);
}

export default labMarketSaga;
