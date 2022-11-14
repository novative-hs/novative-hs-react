import {
  GET_ACCOUNT_STATEMENTS,
  GET_ACCOUNT_STATEMENTS_SUCCESS,
  GET_ACCOUNT_STATEMENTS_FAIL,
} from "./actionTypes";

export const getAccountStatements = id => ({
  type: GET_ACCOUNT_STATEMENTS,
  payload: id,
});

export const getAccountStatementsSuccess = accountStatements => ({
  type: GET_ACCOUNT_STATEMENTS_SUCCESS,
  payload: accountStatements,
});

export const getAccountStatementsFail = error => ({
  type: GET_ACCOUNT_STATEMENTS_FAIL,
  payload: error,
});
