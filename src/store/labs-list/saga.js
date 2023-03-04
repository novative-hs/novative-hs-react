import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_LABS_LIST, GET_DONORS } from "./actionTypes";

import {
  getLabsListSuccess,
  getLabsListFail,
  getDonorsSuccess,
  getDonorsFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getLabsList , getDonors } from "../../helpers/django_api_helper";

function* fetchLabsList(object) {
  try {
    const response = yield call(getLabsList, object.payload);
    yield put(getLabsListSuccess(response));
  } catch (error) {
    yield put(getLabsListFail(error));
  }
}
function* fetchDonors() {
  try {
    const response = yield call(getDonors);
    yield put(getDonorsSuccess(response));
  } catch (error) {
    yield put(getDonorsFail(error));
  }
}

function* LabsSaga() {
  yield takeEvery(
    GET_LABS_LIST,
    fetchLabsList
  );
yield takeEvery(GET_DONORS, fetchDonors);

}

export default LabsSaga;
