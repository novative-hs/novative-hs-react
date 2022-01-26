import { takeEvery, put, call } from "redux-saga/effects";

//Account Redux states
import { ADD_PATIENT_INFORMATION } from "./actionTypes";
import {
  addPatientInformationSuccessful,
  addPatientInformationFailed,
} from "./actions";

//Include Both Helper File with needed methods
import { postPatientInformation } from "../../../helpers/django_api_helper";

const API_URL = "http://127.0.0.1:8000/api";

// Is user register successfull then direct plot user in redux.
function* addPatientInformation({ payload: { patient, id } }) {
  try {
    const response = yield call(postPatientInformation, id, patient);

    console.log("Response: ", response);

    if (response.status == 400) {
      yield put(addPatientInformationFailed(response.message));
    } else {
      yield put(addPatientInformationSuccessful(response));
    }
  } catch (error) {
    yield put(addPatientInformationFailed(error));
  }
}

function* PatientInformationSaga() {
  yield takeEvery(ADD_PATIENT_INFORMATION, addPatientInformation);
}

export default PatientInformationSaga;
