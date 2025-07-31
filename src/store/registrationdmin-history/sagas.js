import { call, put, takeEvery } from "redux-saga/effects";

// Redux action types
import { GET_HISTORY_LIST_ROUND, GET_RESULT_HISTORY, GET_HISTORY_LIST_CSR } from "./actionTypes";

// Action creators
import { getActivityLogRoundsSuccess, getActivityLogRoundsFail, getResultHistorySuccess, getResultHistoryFail, getActivityLogCsrSuccess, getActivityLogCsrFail, } from "./actions";

// Helper API call
import { getHistoryRounds, getResultHistory, getHistoryCsr } from "../../helpers/django_api_helper";

function* fetchActivityLogRounds(action) {
  try {
    const { id } = action.payload;  // Destructure id and type from payload
    const response = yield call(getHistoryRounds, id); 
    // console.log("SAGAAAAAAAA",response)
    yield put(getActivityLogRoundsSuccess(response));  // Dispatch success with the response
  } catch (error) {
    yield put(getActivityLogRoundsFail(error));  // Dispatch failure if error occurs
  }
}

 function* fetchActivityLogCsr(action) {
    try {
      const { id } = action.payload;
      console.log("[Saga] Fetching CSR Activity Log for User ID:", id);

      const response = yield call(getHistoryCsr, id);

      console.log("[Saga] API Response received:", response);

      yield put(getActivityLogCsrSuccess(response));
    } catch (error) {
      console.error("[Saga] Error fetching CSR Activity Log:", error);
      yield put(getActivityLogCsrFail(error));
    }
  }
function* fetchActivityLogResult(action) {
  try {
    const { id, participantId, scheme_id} = action.payload;  // Destructure id and type from payload
    const response = yield call(getResultHistory, id, participantId, scheme_id); // Pass both id and type to the API call
    // console.log("SAGAAAAAAAA",response)
    yield put(getResultHistorySuccess(response));  // Dispatch success with the response
  } catch (error) {
    yield put(getResultHistoryFail(error));  // Dispatch failure if error occurs
  }
}

function* RoundsHistorySaga() {
  yield takeEvery(GET_HISTORY_LIST_ROUND, fetchActivityLogRounds);  // Watch for GET_HISTORY_LIST action
  yield takeEvery(GET_RESULT_HISTORY, fetchActivityLogResult);  
   yield takeEvery(GET_HISTORY_LIST_CSR, fetchActivityLogCsr);
}

export default RoundsHistorySaga;
