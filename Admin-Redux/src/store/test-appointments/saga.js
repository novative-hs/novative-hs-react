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

// function* onAddNewTestAppointment(object) {
//   try {
//     const response = yield call(
//       addNewTestAppointment,
//       object.payload.TestAppointment,
//       object.payload.id
//     );
//     yield put(addTestAppointmentSuccess(response));
//   } catch (error) {
//     yield put(addTestAppointmentFail(error));
//   }
// }

function* onUpdateTestAppointment({ payload: TestAppointment }) {
  try {
    const response = yield call(updateTestAppointment, TestAppointment);
    yield put(updateTestAppointmentSuccess(response));
  } catch (error) {
    yield put(updateTestAppointmentFail(error));
  }
}

// function* onDeleteTestAppointment({ payload: TestAppointment }) {
//   try {
//     const response = yield call(deleteTestAppointment, TestAppointment);
//     yield put(deleteTestAppointmentSuccess(response));
//   } catch (error) {
//     yield put(deleteTestAppointmentFail(error));
//   }
// }

function* TestAppointmentsSaga() {
  yield takeEvery(GET_TEST_APPOINTMENTS, fetchTestAppointments);
  // yield takeEvery(ADD_NEW_TEST_APPOINTMENT, onAddNewTestAppointment);
  yield takeEvery(UPDATE_TEST_APPOINTMENT, onUpdateTestAppointment);
  // yield takeEvery(DELETE_TEST_APPOINTMENT, onDeleteTestAppointment);
}

export default TestAppointmentsSaga;
