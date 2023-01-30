import {
  GET_LABS_LIST_PENDING_FEE_SUCCESS,
  GET_LABS_LIST_PENDING_FEE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  labsListPendingFee: [],
  error: {},
};

const labsListPendingFee = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LABS_LIST_PENDING_FEE_SUCCESS:
      return {
        ...state,
        labsListPendingFee: action.payload.data,
      };

    case GET_LABS_LIST_PENDING_FEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default labsListPendingFee;