// import { UPDATE_NEW_PAYMENT } from "helpers/url_helper";
import {
  ADD_NEW_Payment,
  ADD_NEW_Payment_SUCCESS,
  ADD_NEW_Payment_FAIL,
  GET_PARTICIPANT_PAYMENT,
  GET_PARTICIPANT_PAYMENT_SUCCESS,
  GET_PARTICIPANT_PAYMENT_FAIL,
  GET_PARTICIPANT_SCHEME_LIST,
  GET_PARTICIPANT_SCHEME_LIST_SUCCESS,
  GET_PARTICIPANT_SCHEME_LIST_FAIL,
  UPDATE_NEW_PAYMENT, 
  UPDATE_NEW_PAYMENT_SUCCESS,
  UPDATE_NEW_PAYMENT_FAIL
} from "./actionTypes";


export const addNewPayment = (id, payment) => {
  return {
    type: ADD_NEW_Payment,
    payload: {id, payment },
  };
};

export const addNewPaymentSuccess = (id, payment) => (
  console.log("data in case of success",id, payment ),
  {
  type: ADD_NEW_Payment_SUCCESS,
  payload: {id, payment},
});

export const addNewPaymentFail = error => (
  console.log("data in case of error",error ),
  {
  type: ADD_NEW_Payment_FAIL,
  payload: error,
});
 export const updatePayment= payment => {
    return {
      type: UPDATE_NEW_PAYMENT,
      payload: payment,
    };
  };
  
export const updatePaymentSuccess = payment => {
  console.log("✅ Payment update succeeded:", payment); // ✅ Debug log
  return {
    type: UPDATE_NEW_PAYMENT_SUCCESS,
    payload: payment,
  };
};

export const updatePaymentFail = error => {
  console.error("❌ Payment update failed:", error); // ❌ Debug log
  return {
    type: UPDATE_NEW_PAYMENT_FAIL,
    payload: error,
  };
};

export const getParticipantPayment = id => {
  console.log("📥 Getting participant payment for ID:", id); // ℹ️ Debug log
  return {
    type: GET_PARTICIPANT_PAYMENT,
    payload: id,
  };
};


export const getparticipantpaymentSuccess = GetPayment => ({
  type: GET_PARTICIPANT_PAYMENT_SUCCESS,
  payload: GetPayment
});

export const getparticipantpaymentFail = error => ({
  type: GET_PARTICIPANT_PAYMENT_FAIL,
  payload: error,
});


///participant scheme list

export const getParticipantSchemelist = (id) => {
  console.log("Action Payload (ID):", id);
  return {
    type: GET_PARTICIPANT_SCHEME_LIST,
    payload: id,
  };
};


export const getParticipantSchemelistSuccess = GetPayment => ({
  type: GET_PARTICIPANT_SCHEME_LIST_SUCCESS,
  payload: GetPayment
});

export const getParticipantSchemelistFail = error => ({
  type: GET_PARTICIPANT_SCHEME_LIST_FAIL,
  payload: error,
});