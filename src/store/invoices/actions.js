import {
  GET_INVOICE_DETAIL,
  GET_INVOICE_DETAIL_FAIL,
  GET_INVOICE_DETAIL_SUCCESS,
  UPDATE_PAYMENT_INFO,
  UPDATE_PAYMENT_INFO_SUCCESS,
  UPDATE_PAYMENT_INFO_FAIL,
} from "./actionTypes";

export const getInvoiceDetail = id => ({
  type: GET_INVOICE_DETAIL,
  payload: id,
});

export const getInvoiceDetailSuccess = invoices => ({
  type: GET_INVOICE_DETAIL_SUCCESS,
  payload: invoices,
});

export const getInvoiceDetailFail = error => ({
  type: GET_INVOICE_DETAIL_FAIL,
  payload: error,
});

export const updatePaymentInfo = id => ({
  type: UPDATE_PAYMENT_INFO,
  payload: id,
});

export const updatePaymentInfoSuccess = paymentDetails => ({
  type: UPDATE_PAYMENT_INFO_SUCCESS,
  payload: paymentDetails,
});

export const updatePaymentInfoFail = error => ({
  type: UPDATE_PAYMENT_INFO_FAIL,
  payload: error,
});
