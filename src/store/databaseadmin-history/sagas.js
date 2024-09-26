import { call, put, takeEvery } from "redux-saga/effects";

// Redux action types
import { GET_HISTORY_LIST } from "./actionTypes";

// Action creators
import { getActivityLogUnitsSuccess, getActivityLogUnitsFail } from "./actions";

// Helper API call
import { getHistoryUnits } from "../../helpers/django_api_helper";

function* fetchActivityLogUnits(action) {
  try {
    const { id, type } = action.payload;  // Destructure id and type from payload
    const response = yield call(getHistoryUnits, id, type); // Pass both id and type to the API call
    yield put(getActivityLogUnitsSuccess(response));  // Dispatch success with the response
  } catch (error) {
    yield put(getActivityLogUnitsFail(error));  // Dispatch failure if error occurs
  }
}

function* UnitsHistorySaga() {
  yield takeEvery(GET_HISTORY_LIST, fetchActivityLogUnits);  // Watch for GET_HISTORY_LIST action
}

export default UnitsHistorySaga;
