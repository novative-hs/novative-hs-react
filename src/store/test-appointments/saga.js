import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_TEST_APPOINTMENTS_PENDING_LIST,
  GET_TEST_APPOINTMENTS_IN_PROCESS_LIST,
  GET_TEST_APPOINTMENTS_COMPLETED_LIST,
  UPDATE_TEST_APPOINTMENT,
} from "./actionTypes";

import {
  getTestAppointmentsPendingListSuccess,
  getTestAppointmentsPendingListFail,
  getTestAppointmentsInProcessListSuccess,
  getTestAppointmentsInProcessListFail,
  getTestAppointmentsCompletedListSuccess,
  getTestAppointmentsCompletedListFail,
  updateTestAppointmentSuccess,
  updateTestAppointmentFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getTestAppointmentsPendingList,
  getTestAppointmentsInProcessList,
  getTestAppointmentsCompletedList,
  updateTestAppointment,
} from "../../helpers/django_api_helper";

function* fetchTestAppointmentsPendingList(object) {
  try {
    const response = yield call(getTestAppointmentsPendingList, object.payload);
    yield put(getTestAppointmentsPendingListSuccess(response));
  } catch (error) {
    yield put(getTestAppointmentsPendingListFail(error));
  }
}

function* fetchTestAppointmentsInProcessList(object) {
  try {
    const response = yield call(
      getTestAppointmentsInProcessList,
      object.payload
    );
    yield put(getTestAppointmentsInProcessListSuccess(response));
  } catch (error) {
    yield put(getTestAppointmentsInProcessListFail(error));
  }
}

function* fetchTestAppointmentsCompletedList(object) {
  try {
    const response = yield call(
      getTestAppointmentsCompletedList,
      object.payload
    );
    yield put(getTestAppointmentsCompletedListSuccess(response));
  } catch (error) {
    yield put(getTestAppointmentsCompletedListFail(error));
  }
}

function* onUpdateTestAppointment({ payload: testAppointment }) {
  console.log("Saga: ", testAppointment);
  try {
    const response = yield call(updateTestAppointment, testAppointment);
    console.log("Inside try: ", response);
    yield put(updateTestAppointmentSuccess(response));
  } catch (error) {
    console.log("Inside catch: ", error);
    yield put(updateTestAppointmentFail(error));
  }
}

function* TestAppointmentsSaga() {
  yield takeEvery(
    GET_TEST_APPOINTMENTS_PENDING_LIST,
    fetchTestAppointmentsPendingList
  );
  yield takeEvery(
    GET_TEST_APPOINTMENTS_IN_PROCESS_LIST,
    fetchTestAppointmentsInProcessList
  );
  yield takeEvery(
    GET_TEST_APPOINTMENTS_COMPLETED_LIST,
    fetchTestAppointmentsCompletedList
  );
  yield takeEvery(UPDATE_TEST_APPOINTMENT, onUpdateTestAppointment);
}

export default TestAppointmentsSaga;
