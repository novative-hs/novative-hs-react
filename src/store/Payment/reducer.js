
import {
  ADD_NEW_Payment_SUCCESS,
  ADD_NEW_Payment_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  AddPayment: [],  
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
            
    default:
      return state;
  }
};

export default AddPayment;

