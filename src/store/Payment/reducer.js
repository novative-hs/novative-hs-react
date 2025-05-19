// reducer.js
import {
  ADD_NEW_Payment_SUCCESS,
  ADD_NEW_Payment_FAIL,
  GET_PARTICIPANT_PAYMENT_SUCCESS,
  GET_PARTICIPANT_PAYMENT_FAIL,
  GET_PARTICIPANT_SCHEME_LIST_SUCCESS,
  GET_PARTICIPANT_SCHEME_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  AddPayment: [],
  GetPayment: [],
  error: {},
};

const AddPayment = (state = INIT_STATE, action) => {
  switch (action.type) {
    case ADD_NEW_Payment_SUCCESS:
      return {
        ...state,
        AddPayment: [...state.AddPayment, action.payload.data],
      };
    case ADD_NEW_Payment_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case GET_PARTICIPANT_PAYMENT_SUCCESS:
      console.log("GET_PARTICIPANT_PAYMENT_SUCCESS:", action.payload);
      return {
        ...state,
        GetPayment: action.payload || [], // Ensure it's always an array
      };

    case GET_PARTICIPANT_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // participant schem list

    case GET_PARTICIPANT_SCHEME_LIST_SUCCESS:
      console.log(
        "GET_PARTICIPANT_SCHEME_LIST_SUCCESS action.payload:",
        action.payload
      );
      return {
        ...state,
        PaymentSchemeList: Array.isArray(action.payload.schemes)
          ? action.payload.schemes
          : [],
        participant_name: action.payload.participant_name || "Unknown",
        membership_status: action.payload.membership_status || "Unknown",
        price: action.payload.price || "",
        discount: action.payload.discount || "",
        paid_amount: action.payload.paid_amount || "",
        pay_date: action.payload.pay_date || "",
        payment_mode: action.payload.payment_mode || "",
        received_by: action.payload.received_by || "",
        error: null,
      };

    case GET_PARTICIPANT_SCHEME_LIST_FAIL:
      return {
        ...state,
        PaymentSchemeList: [], // Clear list on failure
        participant_name: "Unknown", // Reset participant name on failure
        error: action.payload,
      };

    default:
      return state;
  }
};

export default AddPayment;
