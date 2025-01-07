import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_DATA, ADD_DATA } from "./actionTypes";

import { getDataSuccess, getDataFail, addDataSuccess, addDataFail } from "./actions";

// Include Helper File with needed methods
import { getData, addData } from "../../helpers/django_api_helper";

// Fetch data saga
function* fetchData(object) {
  console.log("Saga received GET_DATA action with payload:", object.payload);
  try {
    // Call the getData API method
    const response = yield call(getData, object.payload);
    console.log("API response for GET_DATA:", response);
    // Dispatch success action with the fetched data
    yield put(getDataSuccess(response.data));
  } catch (error) {
    // Dispatch failure action if an error occurs
    console.error("GET_DATA API error:", error);
    yield put(getDataFail(error));
  }
}

// Add data saga
function* onAddData(action) {
  console.log("Saga received action:", action);

  try {
    const { tablecreate } = action.payload || {};
    if (!tablecreate || !tablecreate.name) {
      throw new Error("Payload missing required fields: 'name'");
    }

    const response = yield call(
         addData,
         action.payload.tablecreate,
         action.payload.id
       );
    console.log("Saga API response:", response);

    yield put(addDataSuccess(response.data));
    console.log("ADD_DATA_SUCCESS dispatched");
  } catch (error) {
    console.error("Saga error:", error.message);
    yield put(addDataFail(error.message));
  }
}


// Watcher saga for both GET_DATA and ADD_DATA actions
function* CityUpdateSaga() {
  yield takeEvery(GET_DATA, fetchData);
  yield takeEvery(ADD_DATA, onAddData);
}

export default CityUpdateSaga;
