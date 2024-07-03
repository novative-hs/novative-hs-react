import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_METHODS_LIST, ADD_NEW_METHODS , UPDATE_METHODS ,GET_ANALYTESMETHODS_LIST,ADD_NEW_ANALYTESMETHODS,UPDATE_ANALYTESMETHODS} from "./actionTypes";

import { getmethodlistSuccess, getmethodlistFail, addNewMethodSuccess, addNewMethodFail, updateMethodsSuccess, updateMethodsFail,getAnalyteMethodlistSuccess,getAnalyteMethodlistFail,addNewAnalyteMethodlistSuccess,addNewAnalyteMethodlistFail,updateAnalyteMethodlistSuccess,updateAnalyteMethodlistFail  } from "./actions";

//Include Both Helper File with needed methods
import {getMethodlist,addNewMethod, updateMethod, getAnalytemethodlist,updateAnalytemethodlist,addNewAnalytemethodlist } from "../../helpers/django_api_helper";

///analyte methods
function* fetchAnalyteMethodsList(object) {
  try {
    const response = yield call(getAnalytemethodlist, object.payload);
    yield put(getAnalyteMethodlistSuccess(response.data));
  } catch (error) {
    yield put(getAnalyteMethodlistFail(error));
  }
}
function* onAddNewAnalyteMethods(object) {
  try {
    const response = yield call(
      addNewAnalytemethodlist,
      object.payload.createAnalyteMethod,
      object.payload.id
    );
    yield put(addNewAnalyteMethodlistSuccess(response));
  } catch (error) {
    yield put(addNewAnalyteMethodlistFail(error));
  }
}
function* onUpdateAnalyteMethods({ payload: analytesmethod }) {
  try {
    const response = yield call(updateAnalytemethodlist, analytesmethod);
    yield put(updateAnalyteMethodlistSuccess(response));
  } catch (error) {
    yield put(updateAnalyteMethodlistFail (error));
  }
}

///method

function* fetchMethodsList(object) {
  try {
    const response = yield call(getMethodlist, object.payload);
    yield put(getmethodlistSuccess(response.data));
  } catch (error) {
    yield put(getmethodlistFail(error));
  }
}
function* onAddNewMethod(object) {
  try {
    const response = yield call(
      addNewMethod,
      object.payload.createMethods,
      object.payload.id
    );
    yield put(addNewMethodSuccess(response));
  } catch (error) {
    yield put(addNewMethodFail(error));
  }
}
function* onUpdateMethods({ payload: unit }) {
  try {
    const response = yield call(updateMethod, unit);
    yield put(updateMethodsSuccess(response));
  } catch (error) {
    yield put(updateMethodsFail (error));
  }
}


function* MethodsListSaga() {


  yield takeEvery(GET_ANALYTESMETHODS_LIST, fetchAnalyteMethodsList);
  yield takeEvery(ADD_NEW_ANALYTESMETHODS, onAddNewAnalyteMethods );
  yield takeEvery(UPDATE_ANALYTESMETHODS, onUpdateAnalyteMethods);


  yield takeEvery(GET_METHODS_LIST, fetchMethodsList);
  yield takeEvery(ADD_NEW_METHODS, onAddNewMethod );
  yield takeEvery(UPDATE_METHODS, onUpdateMethods);
}

export default MethodsListSaga;
