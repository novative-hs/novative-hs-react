import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_ONLY_MEDICAL_LIST } from "./actionTypes";

import {
  onlyMedicalTestListSuccess,
  onlyMedicalTestListFail,
} from "./actions";

//Include Both Helper File with needed methods
import { onlyMedicalTestList } from "../../helpers/django_api_helper";

function* fetchonlyMedicalTestList(object) {
  try {
    const response = yield call(onlyMedicalTestList, object.payload);
    yield put(onlyMedicalTestListSuccess(response));
  } catch (error) {
    yield put(onlyMedicalTestListFail(error));
  }
}

function* onlyMedicalTestListSaga() {
  yield takeEvery(
    GET_ONLY_MEDICAL_LIST,
    fetchonlyMedicalTestList
  );
}

export default onlyMedicalTestListSaga;