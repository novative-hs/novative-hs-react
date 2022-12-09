import {
  GET_ADV_INVOICE_DETAIL,
  GET_ADV_INVOICE_DETAIL_FAIL,
  GET_ADV_INVOICE_DETAIL_SUCCESS,
} from "./actionTypes";

export const getAdvInvoiceDetail = id => ({
  type: GET_ADV_INVOICE_DETAIL,
  payload: id,
});

export const getAdvInvoiceDetailSuccess = advInvoiceDetail => ({
  type: GET_ADV_INVOICE_DETAIL_SUCCESS,
  payload: advInvoiceDetail,
});

export const getAdvInvoiceDetailFail = error => ({
  type: GET_ADV_INVOICE_DETAIL_FAIL,
  payload: error,
});