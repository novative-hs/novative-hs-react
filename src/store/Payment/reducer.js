// reducer.js
import {
  ADD_NEW_Payment_SUCCESS,
  ADD_NEW_Payment_FAIL,
  GET_PARTICIPANT_PAYMENT_SUCCESS,
  GET_PARTICIPANT_PAYMENT_FAIL,
  GET_PARTICIPANT_SCHEME_LIST_SUCCESS,
  GET_PARTICIPANT_SCHEME_LIST_FAIL,
  UPDATE_NEW_PAYMENT_SUCCESS,
  UPDATE_NEW_PAYMENT_FAIL,
  
 CONFIRM_PAYMENT_SUCCESS,
  CONFIRM_PAYMENT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  AddPayment: [],
  GetPayment: [],
  PaymentSchemeList: [],
  participant_name: "",
  membership_status: "",
  price: "",
  discount: "",
  paid_amount: "",
  pay_date: "",
  payment_mode: "",
  received_by: "",
  photo_url: "",
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
      return {
        ...state,
        GetPayment: action.payload || [],
      };

    case GET_PARTICIPANT_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_NEW_PAYMENT_SUCCESS:
      console.log(
        "✅ Reducer received payment update payload:",
        action.payload
      );

      if (!action.payload || !action.payload.id) {
        console.error(
          "❌ UPDATE_NEW_PAYMENT_SUCCESS failed: payload.id is missing"
        );
        return state; // return unchanged state to prevent crashing
      }

      return {
        ...state,
        GetPayment: state.GetPayment.map((payment) =>
          payment?.id?.toString() === action.payload.id.toString()
            ? { ...payment, ...action.payload }
            : payment
        ),
      };

    case UPDATE_NEW_PAYMENT_FAIL:
      console.error("❌ UPDATE_NEW_PAYMENT_FAIL error:", action.payload);
      return {
        ...state,
        error: action.payload,
      };

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
        original_price: action.payload.original_price || "",
        photo_url: action.payload.photo_url || "", // <-- add here too!
        error: null,
      };

    case GET_PARTICIPANT_SCHEME_LIST_FAIL:
      return {
        ...state,
        PaymentSchemeList: [],
        participant_name: "Unknown",
        error: action.payload,
      };

case CONFIRM_PAYMENT_SUCCESS:
        console.log("CONFIRM_PAYMENT_SUCCESS:", action.payload);
        return {
          ...state,
          confirmpayment: action.payload || [],  // Ensure it's always an array
        };
      

    case CONFIRM_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default AddPayment;
