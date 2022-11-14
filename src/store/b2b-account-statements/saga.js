import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_B2B_ACCOUNT_STATEMENTS } from "./actionTypes";

import {
  getB2bAccountStatementsFail,
  getB2bAccountStatementsSuccess,
} from "./actions";
//Include Both Helper File with needed methods
import { getB2bAccountStatements } from "../../helpers/django_api_helper";

function* fetchB2bAccountStatements(object) {
  try {
    const response = yield call(getB2bAccountStatements, object.payload);
    yield put(getB2bAccountStatementsSuccess(response));
  } catch (error) {
    yield put(getB2bAccountStatementsFail(error));
  }
}

function* B2bAccountStatementsSaga() {
  yield takeEvery(GET_B2B_ACCOUNT_STATEMENTS, fetchB2bAccountStatements);
}

export default B2bAccountStatementsSaga;
