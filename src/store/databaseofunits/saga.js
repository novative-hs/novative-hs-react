import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_INSTRUMENT_TYPE_LIST, ADD_NEW_INSTRUMENT_TYPE, UPDATE_NEW_INSTRUMENT_TYPE, GET_ANALYTE_LIST, ADD_NEW_ANALYTE_LIST,  UPDATE_NEW_ANALYTE_LIST
} from "./actionTypes";

import { getinstrumenttypelistSuccess, getinstrumenttypelistFail,addNewInstrumentTypeSuccess,addNewInstrumentTypeFail ,updateNewInstrumentTypeSuccess,updateNewInstrumentTypeFail, addNewAnalyteListFail, addNewAnalyteListSuccess,  updateAnalyteListSuccess,updateAnalyteListFail,getAnalytelistFail, getAnalytelistSuccess
} from "./actions";

//Include Both Helper File with needed methods
import { getInstrumenttypelist ,addNewInstrumentType,updateNewInstrumentType,getAnalytelist,updateAnalyte , addNewAnalyte} from "../../helpers/django_api_helper";

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

  yield takeEvery( GET_ANALYTE_LIST, fetchAnalyteList);
  yield takeEvery( ADD_NEW_ANALYTE_LIST, onAddNewAnalyte);
  yield takeEvery( UPDATE_NEW_ANALYTE_LIST, onUpdateAnalyte);
}

export default InstrumentTypeListSaga;
