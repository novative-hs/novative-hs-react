import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_INVOICE_DETAIL, GET_ADVINVOICE_DETAIL, UPDATE_PAYMENT_INFO } from "./actionTypes";
import {
  getInvoiceDetailSuccess,
  getInvoiceDetailFail,
  getAdvInvoiceDetailSuccess,
  getAdvInvoiceDetailFail,
  updatePaymentInfoSuccess,
  updatePaymentInfoFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getInvoiceDetail, getAdvInvoiceDetail} from "helpers/django_api_helper";

function* fetchInvoiceDetail(object) {
  try {
    const response = yield call(getInvoiceDetail, object.payload);
    console.log("response", response)
    yield put(getInvoiceDetailSuccess(response));
  } catch (error) {
    yield put(getInvoiceDetailFail(error));
  }
}

function* fetchAdvInvoiceDetail(object) {
  try {
    const response = yield call(getAdvInvoiceDetail, object.payload);
    console.log("response", response)
    yield put(getAdvInvoiceDetailSuccess(response));
  } catch (error) {
    yield put(getAdvInvoiceDetailFail(error));
  }
  console.log("invoice sagga",object)
}

function* onUpdatePaymentInfo(object) {
  try {
    const response = yield call(updatePaymentInfo, object.payload);
    yield put(updatePaymentInfoSuccess(response));
  } catch (error) {
    yield put(updatePaymentInfoFail(error));
  }
}

function* invoiceSaga() {
  yield takeEvery(GET_INVOICE_DETAIL, fetchInvoiceDetail);
  yield takeEvery(GET_ADVINVOICE_DETAIL, fetchAdvInvoiceDetail);
  yield takeEvery(UPDATE_PAYMENT_INFO, onUpdatePaymentInfo);
}

export default invoiceSaga;
