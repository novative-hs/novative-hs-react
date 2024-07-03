import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_TYPE_LIST, ADD_NEW_TYPE , UPDATE_TYPE} from "./actionTypes";

import { gettypelistSuccess, gettypelistFail, addNewTypeSuccess, addNewTypeFail, updateTypesSuccess, updateTypesFail } from "./actions";

//Include Both Helper File with needed methods
import { getTypeList, addNewCreateType, updateType} from "../../helpers/django_api_helper";

function* fetchTypeList(object) {
  try {
    const response = yield call(getTypeList, object.payload);
    yield put(gettypelistSuccess(response.data));
  } catch (error) {
    yield put(gettypelistFail(error));
  }
}
function* onAddNewType(object) {
  try {
    const response = yield call(
      addNewCreateType,
      object.payload.createType,
      object.payload.id
    );
    yield put(addNewTypeSuccess(response));
  } catch (error) {
    yield put(addNewTypeFail(error));
  }
}
function* onUpdateType({ payload: type }) {
  try {
    const response = yield call(updateType, type);
    yield put(updateTypesSuccess(response));
  } catch (error) {
    yield put(updateTypesFail (error));
  }
}


function* TypeListSaga() {
  yield takeEvery(GET_TYPE_LIST, fetchTypeList);
  yield takeEvery(ADD_NEW_TYPE, onAddNewType );
  yield takeEvery(UPDATE_TYPE, onUpdateType);
}

export default TypeListSaga;
