import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_HISTORY_LIST} from "./actionTypes";

import {getActivityLogUnitsSuccess , getActivityLogUnitsFail  } from "./actions";

//Include Both Helper File with needed methods
import {  getHistoryUnits} from "../../helpers/django_api_helper";

function* fetchActivityLogUnits(action) {
  try {
    const id = action.payload; 
    const response = yield call(getHistoryUnits, id); 
    yield put(getActivityLogUnitsSuccess(response));
  } catch (error) {
    yield put(getActivityLogUnitsFail(error));
  }
}

function* UnitsHistorySaga() {
  yield takeEvery(GET_HISTORY_LIST, fetchActivityLogUnits);
}

export default UnitsHistorySaga;
