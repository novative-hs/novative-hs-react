
import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_BANK_LIST, ADD_NEW_BANK , UPDATE_BANK} from "./actionTypes";

import { getbanklistSuccess, getbanklistFail, addNewBankSuccess, addNewBankFail, updateBanksSuccess, updateBanksFail } from "./actions";

//Include Both Helper File with needed methods
import { getBankList, addNewCreateBank, updateBank} from "../../helpers/django_api_helper";

function* fetchBankList(action) {
  try {
    console.log("📥 fetchBankList → Payload received:", action.payload); // Log payload

    const response = yield call(getBankList, action.payload);

    console.log("✅ fetchBankList → API response:", response); // Log API response

    yield put(getbanklistSuccess(response.data));

  } catch (error) {
    console.error("❌ fetchBankList → API call failed:", error); // Log error
    yield put(getbanklistFail(error));
  }
}

function* onAddNewBank(action) {
  const { createBank, id } = action.payload;
  console.log("✅ createBank:", createBank); // this should be your flat object
  const response = yield call(addNewCreateBank, createBank);
  yield put(addNewBankSuccess(response));
}

function* onUpdateBank({ payload: bank }) {
  try {
    const response = yield call(updateBank, bank);
    yield put(updateBanksSuccess(response));
  } catch (error) {
    yield put(updateBanksFail (error));
  }
}


function* BankListSaga() {
  yield takeEvery(GET_BANK_LIST, fetchBankList);
  yield takeEvery(ADD_NEW_BANK, onAddNewBank );
  yield takeEvery(UPDATE_BANK, onUpdateBank);
}

export default BankListSaga;
