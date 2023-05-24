import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_OUT_PAYMENT, 
  GET_LABS_MOF,
  GET_LIST_DONATIONAPPOINTMENT,
  GET_BANKS,
  GET_BANK_ACCOUNTS,
  GET_B2B_CLIENTS,
    ADD_NEW_OUT_PAYMENT,
    GET_STAFF_PROFILE,

} from "./actionTypes";

import {
  getStaffProfileSuccess,
  getStaffProfileFail,
  getLabsMofSuccess,
  getLabsMofFail,
  getListDonationAppointmentSuccess,
  getListDonationAppointmentFail,
  getBankAccountsSuccess,
  getBankAccountsFail,
  getBanksSuccess,
  getBanksFail,
  getB2bClientsSuccess,
  getB2bClientsFail,
  getOutPaymentSuccess,
  getOutPaymentFail,
  addOutPaymentFail,
  addOutPaymentSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import { getOutPayment, getLabsMof ,getListDonationAppointment, getStaffProfile,  getBanks,   getBankAccounts,

  addNewOutPayment,
  getB2bClients, 
 } from "../../helpers/django_api_helper";

 function* fetchBankAccounts() {
  try {
    const response = yield call(getBankAccounts);
    yield put(getBankAccountsSuccess(response));
  } catch (error) {
    yield put(getBankAccountsFail(error));
  }
}

function* fetchStaffProfile(object) {
  console.log("Saga: ", object);
  try {
    const response = yield call(getStaffProfile, object.payload);
    yield put(getStaffProfileSuccess(response));
  } catch (error) {
    yield put(getStaffProfileFail(error));
  }
}

//Include Both Helper File with needed methods
// import {
//   // getOutPayment,
//   addNewOutPayment,
// } from "../../helpers/django_api_helper";

// function* fetchOutPayments(object) {
//   try {
//     const response = yield call(getOutPayment, object.payload);
//     yield put(getOutPaymentSuccess(response));
//   } catch (error) {
//     yield put(getOutPaymentFail(error));
//   }
// }
function* fetchBanks() {
  try {
    const response = yield call(getBanks);
    yield put(getBanksSuccess(response));
  } catch (error) {
    yield put(getBanksFail(error));
  }
}
function* fetchLabsMof() {
  try {
    const response = yield call(getLabsMof);
    yield put(getLabsMofSuccess(response));
  } catch (error) {
    yield put(getLabsMofFail(error));
  }
}
function* fetchListDonationAppointment() {
  try {
    const response = yield call(getListDonationAppointment);
    yield put(getListDonationAppointmentSuccess(response));
  } catch (error) {
    yield put(getListDonationAppointmentFail(error));
  }
}

function* fetchB2bAllClientsList(object) {
  try {
    const response = yield call(getB2bClients, object.payload);
    yield put(getB2bClientsSuccess(response));
  } catch (error) {
    yield put(getB2bClientsFail(error));
  }
}
function* fetchOutPayments(object) {
  try {
    const response = yield call(getOutPayment, object.payload);
    yield put(getOutPaymentSuccess(response));
  } catch (error) {
    yield put(getOutPaymentFail(error));
  }
}

function* onAddNewOutPayment(object) {
  try {
    const response = yield call(
      addNewOutPayment,
      object.payload.outPayment,
      object.payload.id
    );
    yield put(addOutPaymentSuccess(response));
  } catch (error) {
    yield put(addOutPaymentFail(error));
  }
}

function* outPaymentSaga() {
  yield takeEvery(GET_STAFF_PROFILE, fetchStaffProfile);
  yield takeEvery(GET_BANKS, fetchBanks);
  yield takeEvery(GET_BANK_ACCOUNTS, fetchBankAccounts);
  yield takeEvery(GET_OUT_PAYMENT,fetchOutPayments);
  yield takeEvery(GET_LABS_MOF, fetchLabsMof);
  yield takeEvery(GET_LIST_DONATIONAPPOINTMENT, fetchListDonationAppointment);
  yield takeEvery(
    GET_B2B_CLIENTS,
    fetchB2bAllClientsList
  );  
  yield takeEvery(ADD_NEW_OUT_PAYMENT, onAddNewOutPayment);
}

export default outPaymentSaga;
