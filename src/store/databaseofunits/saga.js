import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_INSTRUMENT_TYPE_LIST, ADD_NEW_INSTRUMENT_TYPE, UPDATE_NEW_INSTRUMENT_TYPE, GET_ANALYTE_LIST, ADD_NEW_ANALYTE_LIST,  UPDATE_NEW_ANALYTE_LIST, GET_CYCLEANALYTE_LIST,ADD_NEW_CYCLEANALYTE,UPDATE_CYCLEANALYTE
} from "./actionTypes";

import { getinstrumenttypelistSuccess, getinstrumenttypelistFail,addNewInstrumentTypeSuccess,addNewInstrumentTypeFail ,updateNewInstrumentTypeSuccess,updateNewInstrumentTypeFail, addNewAnalyteListFail, addNewAnalyteListSuccess, updateAnalyteListSuccess,updateAnalyteListFail,getAnalytelistFail, getAnalytelistSuccess, getCycleAnalytelistSuccess,getCycleAnalytelistFail,addNewCycleAnalytelistSuccess,addNewCycleAnalytelistFail,updateCycleAnalytelistSuccess,updateCycleAnalytelistFail
} from "./actions";

//Include Both Helper File with needed methods
import { getInstrumenttypelist ,addNewInstrumentType,updateNewInstrumentType, getAnalytelist, updateAnalyte , addNewAnalyte, getCycleAnalytelist,addNewCycleAnalytelist,updateCycleAnalytelist} from "../../helpers/django_api_helper";



/// Cycle Analytes
function* fetchCycleAnalyteList(object) {
  try {
    const response = yield call(getCycleAnalytelist, object.payload);
    yield put(getCycleAnalytelistSuccess(response.data));
  } catch (error) {
    yield put(getCycleAnalytelistFail(error));
  }
}
function* onAddNewCycleAnalyte(object) {
  try {
    const response = yield call(
      addNewCycleAnalytelist,
      object.payload.createCycleAnalyte,
      object.payload.id
    );
    yield put(addNewCycleAnalytelistSuccess(response));
  } catch (error) {
    yield put(addNewCycleAnalytelistFail(error));
  }
}
function* onUpdateCycleAnalyte({ payload: cycleanalyte }) {
  try {
    const response = yield call(updateCycleAnalytelist, cycleanalyte);
    yield put(updateCycleAnalytelistSuccess(response));
  } catch (error) {
    yield put(updateCycleAnalytelistFail (error));
  }
}


// InstrumentType
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



// Analytes
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

  yield takeEvery(GET_CYCLEANALYTE_LIST, fetchCycleAnalyteList);
  yield takeEvery(ADD_NEW_CYCLEANALYTE, onAddNewCycleAnalyte );
  yield takeEvery(UPDATE_CYCLEANALYTE, onUpdateCycleAnalyte);

}

export default InstrumentTypeListSaga;
