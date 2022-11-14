import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_FEEDBACKS } from "./actionTypes";

import { getFeedbacksSuccess, getFeedbacksFail } from "./actions";

//Include Both Helper File with needed methods
import { getFeedbacks } from "../../helpers/django_api_helper";

function* fetchFeedbacks(object) {
  try {
    const response = yield call(getFeedbacks, object.payload);
    yield put(getFeedbacksSuccess(response.data));
  } catch (error) {
    yield put(getFeedbacksFail(error));
  }
}
function* feedbacksSaga() {
  yield takeEvery(GET_FEEDBACKS, fetchFeedbacks);
}

export default feedbacksSaga;
