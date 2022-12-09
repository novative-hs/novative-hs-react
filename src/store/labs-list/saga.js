import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_LABS_LIST } from "./actionTypes";

import {
  getLabsListSuccess,
  getLabsListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getLabsList } from "../../helpers/django_api_helper";

function* fetchLabsList(object) {
  try {
    const response = yield call(getLabsList, object.payload);
    yield put(getLabsListSuccess(response));
  } catch (error) {
    yield put(getLabsListFail(error));
  }
}

function* LabsSaga() {
  yield takeEvery(
    GET_LABS_LIST,
    fetchLabsList
  );
}

export default LabsSaga;
