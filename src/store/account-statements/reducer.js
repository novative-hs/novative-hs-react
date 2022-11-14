import {
  GET_ACCOUNT_STATEMENTS_SUCCESS,
  GET_ACCOUNT_STATEMENTS_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  accountStatements: [],
  error: {},
};

const accountStatements = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_ACCOUNT_STATEMENTS_SUCCESS:
      return {
        ...state,
        accountStatements: action.payload.data,
      };

    case GET_ACCOUNT_STATEMENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default accountStatements;
