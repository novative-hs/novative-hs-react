
import {
  ADD_NEW_Payment,
  ADD_NEW_Payment_SUCCESS,
  ADD_NEW_Payment_FAIL,
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

