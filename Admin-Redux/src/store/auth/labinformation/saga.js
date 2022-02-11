import { takeEvery, put, call } from "redux-saga/effects";

//Account Redux states
import { GET_LABS, ADD_LAB_INFORMATION } from "./actionTypes";
import {
  getLabsSuccess,
  getLabsFail,
  addLabInformationSuccessful,
  addLabInformationFailed,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getLabs,
  postLabInformation,
} from "../../../helpers/django_api_helper";

function* fetchLabs() {
  try {
    const response = yield call(getLabs);
    console.log("Response: ", response);
    yield put(getLabsSuccess(response));
  } catch (error) {
    yield put(getLabsFail(error));
  }
}

// Is user register successfull then direct plot user in redux.
function* addLabInformation({ payload: { lab, id } }) {
  try {
    const response = yield call(postLabInformation, id, lab);

    console.log("Response: ", response);

    if (response.status == 400) {
      yield put(addLabInformationFailed(response.message));
    } else {
      yield put(addLabInformationSuccessful(response));
    }
  } catch (error) {
    yield put(addLabInformationFailed(error));
  }
}

function* LabInformationSaga() {
  yield takeEvery(GET_LABS, fetchLabs);
  yield takeEvery(ADD_LAB_INFORMATION, addLabInformation);
}

export default LabInformationSaga;
