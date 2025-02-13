import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_SCHEME_LIST,  GET_SCHEMEANALYTE, GET_SCHEMENAME, ADD_NEW_SCHEME_LIST,  UPDATE_NEW_SCHEME_LIST, DELETE_SCHEME
} from "./actionTypes";

import { addNewSchemeListFail, addNewSchemeListSuccess, getSchemeAnalyteSuccess, getSchemeAnalyteFail, getSchemeNameSuccess, getSchemeNameFail,  updateSchemeListSuccess,updateSchemeListFail,getSchemelistFail, getSchemelistSuccess, deleteSchemeSuccess,
  deleteSchemeFail
} from "./actions";

//Include Both Helper File with needed methods
import { getSchemelist, getSchemeName, getSchemeAnalyte, updateScheme , addNewScheme, deleteScheme} from "../../helpers/django_api_helper";


function* fetchSchemeList(object) {
  try {
    const response = yield call(getSchemelist, object.payload);
    console.log("Response from getMethodlist:", response); // Log the response object
    yield put(getSchemelistSuccess(response.data));
  } catch (error) {
    yield put(getSchemelistFail(error));
  }
}
function* fetchSchemeAnalyte(action) {
  try {
    console.log("Fetching scheme analyte with payload:", action.payload);
    const response = yield call(getSchemeAnalyte, action.payload);
    
    // Log the full response to inspect its structure
    console.log("Saga Full Response:", response);
    
    // Validate the response structure
    if (response.data?.status === "success" && Array.isArray(response.data?.data?.analytes)) {
      // Dispatch action with the analytes data
      yield put({ 
        type: 'GET_SCHEMEANALYTE_SUCCESS', 
        payload: response.data.data.analytes 
      });
    } else {
      // Handle unexpected response structure
      yield put({
        type: 'GET_SCHEMEANALYTE_FAIL',
        payload: 'Unexpected response structure.'
      });
    }
  } catch (error) {
    console.error("Saga Error:", error.message);
    yield put({
      type: 'GET_SCHEMEANALYTE_FAIL',
      payload: error.message || "Failed to fetch scheme analyte."
    });
  }
}


function* fetchSchemeName(object) {
  try {
    const response = yield call(getSchemeName, object.payload);
    yield put(getSchemeNameSuccess(response.data));
  } catch (error) {
    yield put(getSchemeNameFail(error));
  }
}
function* onAddNewScheme(object) {
  try {
    const response = yield call(
      addNewScheme,
      object.payload.createUnit,
      object.payload.id
    );
    yield put(addNewSchemeListSuccess(response));
  } catch (error) {
    yield put(addNewSchemeListFail(error));
  }
}
function* onUpdateScheme({ payload: unit }) {
  try {
    const response = yield call(updateScheme, unit);
    yield put(updateSchemeListSuccess(response));
  } catch (error) {
    yield put(updateSchemeListFail (error));
  }
}

function* onDeleteScheme({ payload: unit }) {
  try {
    const response = yield call(deleteScheme, unit);
    yield put(deleteSchemeSuccess(response));
  } catch (error) {
    yield put(deleteSchemeFail(error));
  }
}

function* InstrumentTypeListSaga() {

  yield takeEvery( GET_SCHEME_LIST, fetchSchemeList);
  yield takeEvery(GET_SCHEMEANALYTE, fetchSchemeAnalyte);
  yield takeEvery(GET_SCHEMENAME, fetchSchemeName);
  yield takeEvery( ADD_NEW_SCHEME_LIST, onAddNewScheme);
  yield takeEvery( UPDATE_NEW_SCHEME_LIST, onUpdateScheme);
  yield takeEvery(DELETE_SCHEME, onDeleteScheme);
}

export default InstrumentTypeListSaga;
