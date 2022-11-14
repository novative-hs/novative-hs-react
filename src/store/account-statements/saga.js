import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_ACCOUNT_STATEMENTS } from "./actionTypes";

import {
  getAccountStatementsFail,
  getAccountStatementsSuccess,
} from "./actions";
//Include Both Helper File with needed methods
import { getAccountStatements } from "../../helpers/django_api_helper";

function* fetchAccountStatements(object) {
  try {
    const response = yield call(getAccountStatements, object.payload);
    yield put(getAccountStatementsSuccess(response));
  } catch (error) {
    yield put(getAccountStatementsFail(error));
  }
}

function* AccountStatementsSaga() {
  yield takeEvery(GET_ACCOUNT_STATEMENTS, fetchAccountStatements);
}

export default AccountStatementsSaga;
