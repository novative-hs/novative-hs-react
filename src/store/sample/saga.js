import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_SAMPLE,
  ADD_SAMPLE
} from "./actionTypes";

import {
  getSampleSuccess,
  getSampleFail,
  addSampleSuccess,
  addSampleFail
} from "./actions";

// Include Both Helper File with needed methods
import { getSample, addSample } from "../../helpers/django_api_helper";

function* fetchSample(object) {
  try {

    const response = yield call(getSample, object.payload);
 
    yield put(getSampleSuccess(response.data));
  } catch (error) {
  
    yield put(getSampleFail(error));
  }
}

function* onAddSample(object) {
  try {
   
    const response = yield call(addSample, object.payload);
   
    yield put(addSampleSuccess(response.data));
  } catch (error) {
 
    yield put(addSampleFail(error));
  }
}

function* SampleSaga() {
  yield takeEvery(GET_SAMPLE, fetchSample);
  yield takeEvery(ADD_SAMPLE, onAddSample);
}

export default SampleSaga;
