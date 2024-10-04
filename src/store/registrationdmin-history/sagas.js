import { call, put, takeEvery } from "redux-saga/effects";

// Redux action types
import { GET_HISTORY_LIST_ROUND, GET_RESULT_HISTORY } from "./actionTypes";

// Action creators
import { getActivityLogRoundsSuccess, getActivityLogRoundsFail, getResultHistorySuccess, getResultHistoryFail } from "./actions";

// Helper API call
import { getHistoryRounds, getResultHistory } from "../../helpers/django_api_helper";

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
}

export default RoundsHistorySaga;
