import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_METHODS_LIST, ADD_NEW_METHODS , UPDATE_METHODS } from "./actionTypes";

import { getmethodlistSuccess, getmethodlistFail, addNewMethodSuccess, addNewMethodFail, updateMethodsSuccess, updateMethodsFail  } from "./actions";

//Include Both Helper File with needed methods
import {getMethodlist,addNewMethod, updateMethod } from "../../helpers/django_api_helper";

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
  yield takeEvery(GET_METHODS_LIST, fetchMethodsList);
  yield takeEvery(ADD_NEW_METHODS, onAddNewMethod );
  yield takeEvery(UPDATE_METHODS, onUpdateMethods);
}

export default MethodsListSaga;
