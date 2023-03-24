import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_ADV_INVOICE_DETAIL } from "./actionTypes";
import {
  getAdvInvoiceDetailSuccess,
  getAdvInvoiceDetailFail,
} from "./actions";

//Include Both Helper File with needed methods
import { getAdvInvoiceDetail } from "helpers/django_api_helper";

function* fetchAdvInvoiceDetail(object) {
  try {
    const response = yield call(getAdvInvoiceDetail, object.payload);
    console.log("response", response)
    yield put(getAdvInvoiceDetailSuccess(response));
  } catch (error) {
    yield put(getAdvInvoiceDetailFail(error));
  }
}

function* advInvoiceDetailSaga() {
  yield takeEvery(GET_ADV_INVOICE_DETAIL, fetchAdvInvoiceDetail);
}

export default advInvoiceDetailSaga;
