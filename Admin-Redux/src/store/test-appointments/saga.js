import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_TEST_APPOINTMENTS,
  UPDATE_TEST_APPOINTMENT,
} from "./actionTypes";

import {
  getTestAppointmentsSuccess,
  getTestAppointmentsFail,
  updateTestAppointmentSuccess,
  updateTestAppointmentFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getTestAppointments,
  updateTestAppointment,
} from "../../helpers/django_api_helper";

function* fetchTestAppointments(object) {
  try {
    const response = yield call(getTestAppointments, object.payload);
    yield put(getTestAppointmentsSuccess(response));
  } catch (error) {
    yield put(getTestAppointmentsFail(error));
  }
}

function* onUpdateTestAppointment({ payload: TestAppointment }) {
  try {
    const response = yield call(updateTestAppointment, TestAppointment);
    yield put(updateTestAppointmentSuccess(response));
  } catch (error) {
    yield put(updateTestAppointmentFail(error));
  }
}

function* TestAppointmentsSaga() {
  yield takeEvery(GET_TEST_APPOINTMENTS, fetchTestAppointments);
  yield takeEvery(UPDATE_TEST_APPOINTMENT, onUpdateTestAppointment);
}

export default TestAppointmentsSaga;
