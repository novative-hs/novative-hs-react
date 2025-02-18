// reducer.js
import {
  ADD_NEW_Payment_SUCCESS,
  ADD_NEW_Payment_FAIL,
  GET_PARTICIPANT_PAYMENT_SUCCESS,
  GET_PARTICIPANT_PAYMENT_FAIL,
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
          GetPayment: action.payload || [],  // Ensure it's always an array
        };
      

    case GET_PARTICIPANT_PAYMENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default AddPayment;
