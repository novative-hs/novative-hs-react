import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ADVERTISEMENTS,
  GET_IN_PAYMENT, 
  GET_LABS,
  GET_DONORS,
  ADD_NEW_IN_PAYMENT,
} from "./actionTypes";

import {
  getAdvertisementsSuccess,
  getAdvertisementsFail,
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
import { getInPayment,   getLabs, getDonors,   getAdvertisements,
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
function* fetchAdvertisements() {
  try {
    const response = yield call(getAdvertisements);
    console.log ("advertisement saga: ", response);
    yield put(getAdvertisementsSuccess(response));
  } catch (error) {
    yield put(getAdvertisementsFail(error));
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
  yield takeEvery(GET_ADVERTISEMENTS, fetchAdvertisements);
  yield takeEvery(GET_IN_PAYMENT,fetchInPayments);
  yield takeEvery(GET_LABS, fetchLabs);
  yield takeEvery(GET_DONORS, fetchDonors);
  yield takeEvery(ADD_NEW_IN_PAYMENT, onAddNewInPayment);
}

export default inPaymentSaga;
