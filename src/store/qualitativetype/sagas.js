import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_QUALITATIVETYPE_LIST, ADD_NEW_QUALITATIVETYPE , UPDATE_QUALITATIVETYPE, GET_AnalyteQualitativeUnits_LIST, ADD_NEW_AnalyteQualitativeUnits, UPDATE_AnalyteQualitativeUnits,} from "./actionTypes";

import { getqualitativetypelistSuccess, getqualitativetypelistFail, addNewQualitativeTypeSuccess, addNewQualitativeTypeFail, updateQualitativeTypeSuccess, updateQualitativeTypeFail, getAnalyteQualitativelistSuccess, getAnalyteQualitativelistFail, addNewAnalyteQualitativelistSuccess, addNewAnalyteQualitativelistFail,updateAnalyteQualitativelistSuccess, updateAnalyteQualitativelistFail} from "./actions";

//Include Both Helper File with needed methods
import {getQualitativeTypeList, addNewCreateQualitativeType, updateQualitativeType, getAnalyteQualitativelist, addNewAnalyteQualitativelist, updateAnalyteQualitativelist } from "../../helpers/django_api_helper";


///analyte reagents
function* fetchAnalyteQualitativeUnitsList(object) {
  try {
    const response = yield call(getAnalyteQualitativelist, object.payload);
    yield put(getAnalyteQualitativelistSuccess(response.data));
  } catch (error) {
    yield put(getAnalyteQualitativelistFail(error));
  }
}
function* onAddNewAnalyteQualitativeUnits(object) {
  try {
    const response = yield call(
      addNewAnalyteQualitativelist,
      object.payload.createAnalyteReagent,
      object.payload.id
    );
    yield put(addNewAnalyteQualitativelistSuccess(response));
  } catch (error) {
    yield put(addNewAnalyteQualitativelistFail(error));
  }
}
function* onUpdateAnalyteQualitativeUnits({ payload: analytesreagent }) {
  try {
    const response = yield call(updateAnalyteQualitativelist, analytesreagent);
    yield put(updateAnalyteQualitativelistSuccess(response));
  } catch (error) {
    yield put(updateAnalyteQualitativelistFail (error));
  }
}



function* fetchQualitativeTypeList(object) {
  try {
    const response = yield call(getQualitativeTypeList, object.payload);
    yield put(getqualitativetypelistSuccess(response.data));
  } catch (error) {
    yield put(getqualitativetypelistFail(error));
  }
}
function* onAddNewQualitativeType(object) {
  try {
    const response = yield call(
      addNewCreateQualitativeType,
      object.payload.createQualitativeType,
      object.payload.id
    );
    yield put(addNewQualitativeTypeSuccess(response));
  } catch (error) {
    yield put(addNewQualitativeTypeFail(error));
  }
}
function* onUpdateQualitativeType({ payload: qualitativetype }) {
  try {
    // Log the payload received by the saga
    console.log("Saga: onUpdateQualitativeType - Received Payload:", qualitativetype);

    // Call the API function to update the qualitative type
    const response = yield call(updateQualitativeType, qualitativetype);

    // Log the API response
    console.log("Saga: onUpdateQualitativeType - API Response:", response);

    // Dispatch the success action with the API response
    yield put(updateQualitativeTypeSuccess(response));
  } catch (error) {
    // Log any errors encountered during the API call
    console.error("Saga: onUpdateQualitativeType - Error:", error);

    // Dispatch the failure action with the error
    yield put(updateQualitativeTypeFail(error));
  }
}

function* QualitativeTypeListSaga() {

  yield takeEvery(GET_QUALITATIVETYPE_LIST, fetchQualitativeTypeList);
  yield takeEvery(ADD_NEW_QUALITATIVETYPE, onAddNewQualitativeType );
  yield takeEvery(UPDATE_QUALITATIVETYPE, onUpdateQualitativeType);

  yield takeEvery(GET_AnalyteQualitativeUnits_LIST, fetchAnalyteQualitativeUnitsList);
  yield takeEvery(ADD_NEW_AnalyteQualitativeUnits, onAddNewAnalyteQualitativeUnits );
  yield takeEvery(UPDATE_AnalyteQualitativeUnits, onUpdateAnalyteQualitativeUnits);
}

export default QualitativeTypeListSaga;
