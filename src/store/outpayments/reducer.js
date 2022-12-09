import {
  GET_LABS_MOF_SUCCESS,
  GET_LABS_MOF_FAIL,
  GET_BANKS_SUCCESS,
  GET_BANKS_FAIL,
  GET_BANK_ACCOUNTS_SUCCESS,
  GET_BANK_ACCOUNTS_FAIL,
  GET_B2B_CLIENTS_SUCCESS,
  GET_B2B_CLIENTS_FAIL,
  GET_OUT_PAYMENT_SUCCESS,
  GET_OUT_PAYMENT_FAIL,
  ADD_OUT_PAYMENT_SUCCESS,
  ADD_OUT_PAYMENT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  outPayments: [],
  b2bClients: [],
  outPayment: [],
  bankAccounts: [],
  banks: [],
  labsMof: [],
  error: {},
};

const outPayments = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_BANK_ACCOUNTS_SUCCESS:
      return {
        ...state,
        bankAccounts: action.payload.data,
      };

    case GET_BANK_ACCOUNTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_BANKS_SUCCESS:
      return {
        ...state,
        banks: action.payload.data,
      };

    case GET_BANKS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_LABS_MOF_SUCCESS:
      return {
        ...state,
        labsMof: action.payload.data,
      };

    case GET_LABS_MOF_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_B2B_CLIENTS_SUCCESS:
        return {
          ...state,
          b2bClients: action.payload.data,
        };
  
      case GET_B2B_CLIENTS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
    case GET_OUT_PAYMENT_SUCCESS:
      return {
        ...state,
        outPayments: action.payload.data,
      };

    case GET_OUT_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };                

    case ADD_OUT_PAYMENT_SUCCESS:
      return {
        ...state,
        outPayments: [...state.outPayments, action.payload.data],
      };

    case ADD_OUT_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default outPayments;
