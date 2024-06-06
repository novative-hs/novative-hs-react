import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_INSTRUMENT_TYPE_LIST, ADD_NEW_INSTRUMENT_TYPE, UPDATE_NEW_INSTRUMENT_TYPE,
  GET_METHOD_LIST,ADD_NEW_METHOD_LIST,UPDATE_NEW_METHOD_LIST,  GET_ANALYTE_LIST, ADD_NEW_ANALYTE_LIST,  UPDATE_NEW_ANALYTE_LIST
} from "./actionTypes";

import { getinstrumenttypelistSuccess, getinstrumenttypelistFail,addNewInstrumentTypeSuccess,addNewInstrumentTypeFail ,updateNewInstrumentTypeSuccess,updateNewInstrumentTypeFail,
  getmethodlistSuccess,getmethodlistFail,addNewMethodListSuccess,addNewMethodListFail,  addNewAnalyteListFail, addNewAnalyteListSuccess, updateMethodListSuccess,updateMethodListFail, updateAnalyteListSuccess,updateAnalyteListFail,getAnalytelistFail, getAnalytelistSuccess
} from "./actions";

//Include Both Helper File with needed methods
import { getInstrumenttypelist ,addNewInstrumentType,updateNewInstrumentType,getMethodlist,addNewMethod,getAnalytelist, updateMethod, updateAnalyte , addNewAnalyte} from "../../helpers/django_api_helper";

function* fetchInstrumentTypeList(object) {
  try {
    const response = yield call(getInstrumenttypelist, object.payload);
    console.log("Response from getinstrumenttypelist:", response); // Log the response object
    yield put(getinstrumenttypelistSuccess(response.data));
  } catch (error) {
    yield put(getinstrumenttypelistFail(error));
  }
}
function* onAddNewInstrumentType(object) {
  try {
    const response = yield call(
      addNewInstrumentType,
      object.payload.createUnit,
      object.payload.id
    );
    yield put(addNewInstrumentTypeSuccess(response));
  } catch (error) {
    yield put(addNewInstrumentTypeFail(error));
  }
}
function* onUpdateInstrumentType({ payload: unit }) {
  try {
    const response = yield call(updateNewInstrumentType, unit);
    yield put(updateNewInstrumentTypeSuccess(response));
  } catch (error) {
    yield put(updateNewInstrumentTypeFail (error));
  }
}
function* fetchMethodList(object) {
  try {
    const response = yield call(getMethodlist, object.payload);
    console.log("Response from getMethodlist:", response); // Log the response object
    yield put(getmethodlistSuccess(response.data));
  } catch (error) {
    yield put(getmethodlistFail(error));
  }
}
function* onAddNewMethod(object) {
  try {
    const response = yield call(
      addNewMethod,
      object.payload.createUnit,
      object.payload.id
    );
    yield put(addNewMethodListSuccess(response));
  } catch (error) {
    yield put(addNewMethodListFail(error));
  }
}
function* onUpdatemethod({ payload: unit }) {
  try {
    const response = yield call(updateMethod, unit);
    yield put(updateMethodListSuccess(response));
  } catch (error) {
    yield put(updateMethodListFail (error));
  }
}

function* fetchAnalyteList(object) {
  try {
    const response = yield call(getAnalytelist, object.payload);
    console.log("Response from getMethodlist:", response); // Log the response object
    yield put(getAnalytelistSuccess(response.data));
  } catch (error) {
    yield put(getAnalytelistFail(error));
  }
}
function* onAddNewAnalyte(object) {
  try {
    const response = yield call(
      addNewAnalyte,
      object.payload.createUnit,
      object.payload.id
    );
    yield put(addNewAnalyteListSuccess(response));
  } catch (error) {
    yield put(addNewAnalyteListFail(error));
  }
}
function* onUpdateAnalyte({ payload: unit }) {
  try {
    const response = yield call(updateAnalyte, unit);
    yield put(updateAnalyteListSuccess(response));
  } catch (error) {
    yield put(updateAnalyteListFail (error));
  }
}

function* InstrumentTypeListSaga() {
  yield takeEvery(GET_INSTRUMENT_TYPE_LIST, fetchInstrumentTypeList);
  yield takeEvery(ADD_NEW_INSTRUMENT_TYPE, onAddNewInstrumentType);
  yield takeEvery(UPDATE_NEW_INSTRUMENT_TYPE, onUpdateInstrumentType);
  yield takeEvery(GET_METHOD_LIST, fetchMethodList);
  yield takeEvery(ADD_NEW_METHOD_LIST, onAddNewMethod);
  yield takeEvery(UPDATE_NEW_METHOD_LIST, onUpdatemethod);

  yield takeEvery( GET_ANALYTE_LIST, fetchAnalyteList);
  yield takeEvery( ADD_NEW_ANALYTE_LIST, onAddNewAnalyte);
  yield takeEvery( UPDATE_NEW_ANALYTE_LIST, onUpdateAnalyte);
}

export default InstrumentTypeListSaga;
