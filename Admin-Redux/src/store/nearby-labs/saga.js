import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_NEARBY_LABS,
} from "./actionTypes";

import {
  getNearbyLabsSuccess,
  getNearbyLabsFail,
  
} from "./actions";

//Include Both Helper File with needed methods
import {
  getNearbyLabs,

} from "../../helpers/django_api_helper";

function* fetchNearbyLabs(object) {
  try {
    const response = yield call(getNearbyLabs, object.payload.address);
    yield put(getNearbyLabsSuccess(response));
  } catch (error) {
    yield put(getNearbyLabsFail(error));
  }
}

function* nearbyLabsSaga() {
  yield takeEvery(GET_NEARBY_LABS, fetchNearbyLabs);
}

export default nearbyLabsSaga;
