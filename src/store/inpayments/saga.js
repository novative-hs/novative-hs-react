import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACCEPTED_LAB_ADVERTISEMENTS,
  GET_IN_PAYMENT, 
  GET_LABS,
  GET_DONORS,
  ADD_NEW_IN_PAYMENT,
} from "./actionTypes";

import {
  getAcceptedLabAdvertisementsSuccess,
  getAcceptedLabAdvertisementsFail,
  getLabsSuccess,
  getLabsFail,
  getDonorsSuccess,
  getDonorsFail,
  getInPaymentSuccess,
  getInPaymentFail,
  addInPaymentFail,
  addInPaymentSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import { getInPayment,   getLabs, getDonors,   getAcceptedLabAdvertisements,
  addNewInPayment,
 } from "../../helpers/django_api_helper";

//Include Both Helper File with needed methods
// import {
//   // getInPayment,
//   addNewInPayment,
// } from "../../helpers/django_api_helper";

// function* fetchInPayments(object) {
//   try {
//     const response = yield call(getInPayment, object.payload);
//     yield put(getInPaymentSuccess(response));
//   } catch (error) {
//     yield put(getInPaymentFail(error));
//   }
// }
function* fetchLabAdvertisements() {
  try {
    const response = yield call(getAcceptedLabAdvertisements);
    console.log ("advertisement saga: ", response);
    yield put(getAcceptedLabAdvertisementsSuccess(response));
  } catch (error) {
    yield put(getAcceptedLabAdvertisementsFail(error));
  }
}
function* fetchLabs() {
  try {
    const response = yield call(getLabs);
    yield put(getLabsSuccess(response));
  } catch (error) {
    yield put(getLabsFail(error));
  }
}
function* fetchDonors() {
  try {
    const response = yield call(getDonors);
    yield put(getDonorsSuccess(response));
  } catch (error) {
    yield put(getDonorsFail(error));
  }
}
function* fetchInPayments(object) {
  try {
    const response = yield call(getInPayment, object.payload);
    yield put(getInPaymentSuccess(response));
  } catch (error) {
    yield put(getInPaymentFail(error));
  }
}

function* onAddNewInPayment(object) {
  try {
    const response = yield call(
      addNewInPayment,
      object.payload.inPayment,
      object.payload.id
    );
    yield put(addInPaymentSuccess(response));
  } catch (error) {
    yield put(addInPaymentFail(error));
  }
}

function* inPaymentSaga() {
  yield takeEvery(GET_ACCEPTED_LAB_ADVERTISEMENTS, fetchLabAdvertisements);
  yield takeEvery(GET_IN_PAYMENT,fetchInPayments);
  yield takeEvery(GET_LABS, fetchLabs);
  yield takeEvery(GET_DONORS, fetchDonors);
  yield takeEvery(ADD_NEW_IN_PAYMENT, onAddNewInPayment);
}

export default inPaymentSaga;
