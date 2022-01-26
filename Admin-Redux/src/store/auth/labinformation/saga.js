import { takeEvery, put, call } from "redux-saga/effects";

//Account Redux states
import { ADD_LAB_INFORMATION } from "./actionTypes";
import {
  addLabInformationSuccessful,
  addLabInformationFailed,
} from "./actions";

//Include Both Helper File with needed methods
import { postLabInformation } from "../../../helpers/django_api_helper";

const API_URL = "http://127.0.0.1:8000/api";

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
  yield takeEvery(ADD_LAB_INFORMATION, addLabInformation);
}

export default LabInformationSaga;
