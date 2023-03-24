import {
  GET_ADV_INVOICE_DETAIL_SUCCESS,
  GET_ADV_INVOICE_DETAIL_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  advInvoiceDetail: {},
  error: {},
};

const advInvoice = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ADV_INVOICE_DETAIL_SUCCESS:
      return {
        ...state,
        advInvoiceDetail: action.payload,
      };

    case GET_ADV_INVOICE_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default advInvoice;
