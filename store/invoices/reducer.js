import {
  GET_INVOICE_DETAIL_SUCCESS,
  GET_INVOICE_DETAIL_FAIL,
  GET_ADVINVOICE_DETAIL_SUCCESS,
  GET_ADVINVOICE_DETAIL_FAIL,
  UPDATE_PAYMENT_INFO_SUCCESS,
  UPDATE_PAYMENT_INFO_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  invoiceDetail: {},
  advinvoiceDetail: {},
  paymentDetail: {},
  error: {},
};

const invoices = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_INVOICE_DETAIL_SUCCESS:
      return {
        ...state,
        invoiceDetail: action.payload.data,
      };

    case GET_INVOICE_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_ADVINVOICE_DETAIL_SUCCESS:
      return {
        ...state,
        advinvoiceDetail: action.payload.data,
      };

    case GET_ADVINVOICE_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };


    case UPDATE_PAYMENT_INFO_SUCCESS:
      return {
        ...state,
        paymentDetail: action.payload.data,
      };

    case UPDATE_PAYMENT_INFO_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default invoices;
