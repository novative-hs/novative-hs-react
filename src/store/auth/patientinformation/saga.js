import { takeEvery, put, call } from "redux-saga/effects";

//Account Redux states
import { ADD_PATIENT_INFORMATION, GET_TERRITORIES_LIST  } from "./actionTypes";
import {
  getTerritoriesListSuccess,
  getTerritoriesListFail,
  addPatientInformationSuccessful,
  addPatientInformationFailed,
} from "./actions";

//Include Both Helper File with needed methods
import { postPatientInformation, getTerritoriesList } from "../../../helpers/django_api_helper";

// Is user register successfull then direct plot user in redux.

// Territories
function* fetchTerritoriesList(object) {
  try {
    const response = yield call(getTerritoriesList, object.payload);
    yield put(getTerritoriesListSuccess(response));
  } catch (error) {
    yield put(getTerritoriesListFail(error));
  }
}
function* addPatientInformation({ payload: { patient, id } }) {
  try {
    const response = yield call(postPatientInformation, id, patient);
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
  yield takeEvery(GET_TERRITORIES_LIST,fetchTerritoriesList);
}

export default PatientInformationSaga;
