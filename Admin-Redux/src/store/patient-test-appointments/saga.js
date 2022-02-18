import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_PATIENT_TEST_APPOINTMENTS_COMPLETED_LIST,
} from "./actionTypes";

import {
  getPatientTestAppointmentsCompletedListSuccess,
  getPatientTestAppointmentsCompletedListFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getPatientTestAppointmentsCompletedList,
} from "../../helpers/django_api_helper";




function* fetchPatientTestAppointmentsCompletedList(object) {
  try {
    const response = yield call(getPatientTestAppointmentsCompletedList, object.payload);
    console.log("response of saga: ", response);
    yield put(getPatientTestAppointmentsCompletedListSuccess(response));
  } catch (error) {
    yield put(getPatientTestAppointmentsCompletedListFail(error));
  }
}


function* PatientTestAppointmentsSaga() {
  yield takeEvery(GET_PATIENT_TEST_APPOINTMENTS_COMPLETED_LIST, fetchPatientTestAppointmentsCompletedList);
}

export default PatientTestAppointmentsSaga;
