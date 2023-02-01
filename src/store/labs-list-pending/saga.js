import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_LABS_LIST_PENDING_FEE } from "./actionTypes";

import {
  getLabsListPendingFeeSuccess,
  getLabsListPendingFeeFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getLabsListPendingFee } from "../../helpers/django_api_helper";

function* fetchLabsListPendingFee(object) {
  try {
    const response = yield call(getLabsListPendingFee, object.payload);
    yield put(getLabsListPendingFeeSuccess(response));
  } catch (error) {
    yield put(getLabsListPendingFeeFail(error));
  }
}

function* LabsListPendingFeeSaga() {
  yield takeEvery(
    GET_LABS_LIST_PENDING_FEE,
    fetchLabsListPendingFee
  );
}

export default LabsListPendingFeeSaga;
