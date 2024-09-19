import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { DELETE_ANALYTE,DELETE_INSTRUMENT_TYPE,GET_INSTRUMENT_TYPE_LIST, ADD_NEW_INSTRUMENT_TYPE, UPDATE_NEW_INSTRUMENT_TYPE, GET_ANALYTE_LIST, GET_ANALYTEFORSCHEME_LIST, ADD_NEW_ANALYTE_LIST,  UPDATE_NEW_ANALYTE_LIST, GET_SCHEMEANALYTE_LIST,ADD_NEW_SCHEMEANALYTE,UPDATE_SCHEMEANALYTE, GET_ANALYTESCYCLES, GET_SAMPLE_ANALYTE_LIST,ADD_NEW_SAMPLE_ANALYTE,UPDATE_SAMPLE_ANALYTE, ADD_EQUIPMENTTYPE_FILE
} from "./actionTypes";

import { deleteAnalyteSuccess,deleteAnalyteFail,getinstrumenttypelistSuccess, getinstrumenttypelistFail,addNewInstrumentTypeSuccess,addNewInstrumentTypeFail ,updateNewInstrumentTypeSuccess,updateNewInstrumentTypeFail, addNewAnalyteListFail, addNewAnalyteListSuccess, updateAnalyteListSuccess,updateAnalyteListFail,getAnalytelistFail, getAnalyteforSchemelistSuccess, getAnalyteforSchemelistFail, getAnalytelistSuccess,deleteInstrumentTypeSuccess,deleteInstrumentTypeFail, getSchemeAnalytelistSuccess,getSchemeAnalytelistFail,addNewSchemeAnalytelistSuccess,addNewSchemeAnalytelistFail,updateSchemeAnalytelistSuccess,updateSchemeAnalytelistFail, getAnalyteCycleFail,getAnalyteCycleSuccess, getSampleAnalytelistSuccess,getSampleAnalytelistFail,addNewSampleAnalytelistSuccess,addNewSampleAnalytelistFail,updateSampleAnalytelistSuccess,updateSampleAnalytelistFail,addEquipmentTypefileFail
} from "./actions";

//Include Both Helper File with needed methods
import { deleteAnalyte,deleteInstrumentType,getInstrumenttypelist ,addNewInstrumentType,updateNewInstrumentType, getAnalytelist, updateAnalyte , addNewAnalyte, getSchemeAnalytelist, getAnalyteforSchemelist, addNewSchemeAnalytelist,updateSchemeAnalytelist, getAnalyteCycle, addEquipmentTypefile, getSampleAnalytelist,addNewSampleAnalytelist,updateSampleAnalytelist} from "../../helpers/django_api_helper";

// ADD EQUIPMENT TYPE FILE

// Sample Analyte
function* fetchSampleAnalyteList(object) {
  try {
    const response = yield call(getSampleAnalytelist, object.payload);
    yield put(getSampleAnalytelistSuccess(response.data));
  } catch (error) {
    yield put(getSampleAnalytelistFail(error));
  }
}
function* onAddNewSampleAnalyte(object) {
  try {
    const response = yield call(
      addNewSampleAnalytelist,
      object.payload.createSampleAnalyte,
      object.payload.id
    );
    yield put(addNewSampleAnalytelistSuccess(response));
  } catch (error) {
    yield put(addNewSampleAnalytelistFail(error));
  }
}
function* onUpdateSampleAnalyte({ payload: schemeanalyte }) {
  try {
    const response = yield call(updateSampleAnalytelist, schemeanalyte);
    yield put(updateSampleAnalytelistSuccess(response));
  } catch (error) {
    yield put(updateSampleAnalytelistFail (error));
  }
}
function* onAddEquipmentTypefile(object) {
  console.log("saga responce", object)

  try {
    const response = yield call(
      addEquipmentTypefile,
      object.payload.EquipmentData,
      object.payload.id
    );
    yield put(addEquipmentTypefileSuccess(response));
  } catch (error) {
    yield put(addEquipmentTypefileFail(error));
  }
}
/// Scheme Analytes
function* fetchSchemeAnalyteList(object) {
  try {
    const response = yield call(getSchemeAnalytelist, object.payload);
    yield put(getSchemeAnalytelistSuccess(response.data));
  } catch (error) {
    yield put(getSchemeAnalytelistFail(error));
  }
}
function* onAddNewSchemeAnalyte(object) {
  try {
    const response = yield call(
      addNewSchemeAnalytelist,
      object.payload.createSchemeAnalyte,
      object.payload.id
    );
    yield put(addNewSchemeAnalytelistSuccess(response));
  } catch (error) {
    yield put(addNewSchemeAnalytelistFail(error));
  }
}

function* onUpdateSchemeAnalyte({ payload: schemeanalyte }) {
  try {
    const response = yield call(updateSchemeAnalytelist, schemeanalyte);
    yield put(updateSchemeAnalytelistSuccess(response));
  } catch (error) {
    yield put(updateSchemeAnalytelistFail (error));
  }
}


/////// Analytes Associated Aith Cycle
function* fetchAnalyteCycles(object) {
  try {
    const response = yield call(getAnalyteCycle, object.payload);
    yield put(getAnalyteCycleSuccess(response.data));
  } catch (error) {
    yield put(getAnalyteCycleFail(error));
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

function* onDeleteInstrumentType({ payload: InstrumentType }) {
  try {
    const response = yield call(deleteInstrumentType, InstrumentType);
    yield put(deleteInstrumentTypeSuccess(response));
  } catch (error) {
    yield put(deleteInstrumentTypeFail(error));
  }
}

function* fetchAnalyteList(object) {
  try {
    const response = yield call(getAnalytelist, object.payload);
    console.log("Response from getAnalytelist:", response); // Log the response object
    yield put(getAnalytelistSuccess(response.data));
  } catch (error) {
    yield put(getAnalytelistFail(error));
  }
}
function* fetchAnalyteforSchemeList(object) {
  try {
    const response = yield call(getAnalyteforSchemelist, object.payload);
    console.log("Response from getAnalytelist:", response); // Log the response object
    yield put(getAnalyteforSchemelistSuccess(response.data));
  } catch (error) {
    yield put(getAnalyteforSchemelistFail(error));
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

function* onDeleteAnalyte({ payload: Analyte }) {
  try {
    const response = yield call(deleteAnalyte, Analyte);
    yield put(deleteAnalyteSuccess(response));
  } catch (error) {
    yield put(deleteAnalyteFail(error));
  }
}

function* InstrumentTypeListSaga() {
  yield takeEvery(GET_INSTRUMENT_TYPE_LIST, fetchInstrumentTypeList);
  yield takeEvery(ADD_NEW_INSTRUMENT_TYPE, onAddNewInstrumentType);
  yield takeEvery(ADD_EQUIPMENTTYPE_FILE, onAddEquipmentTypefile);
  yield takeEvery(UPDATE_NEW_INSTRUMENT_TYPE, onUpdateInstrumentType);
  yield takeEvery(DELETE_INSTRUMENT_TYPE, onDeleteInstrumentType);

  yield takeEvery( GET_ANALYTE_LIST, fetchAnalyteList);
  yield takeEvery( GET_ANALYTEFORSCHEME_LIST, fetchAnalyteforSchemeList);
  yield takeEvery( ADD_NEW_ANALYTE_LIST, onAddNewAnalyte);
  yield takeEvery( UPDATE_NEW_ANALYTE_LIST, onUpdateAnalyte);
  yield takeEvery(DELETE_ANALYTE, onDeleteAnalyte);

  yield takeEvery(GET_SCHEMEANALYTE_LIST, fetchSchemeAnalyteList);
  yield takeEvery(ADD_NEW_SCHEMEANALYTE, onAddNewSchemeAnalyte );
  yield takeEvery(UPDATE_SCHEMEANALYTE, onUpdateSchemeAnalyte);

  yield takeEvery(GET_ANALYTESCYCLES, fetchAnalyteCycles);

  yield takeEvery(GET_SAMPLE_ANALYTE_LIST, fetchSampleAnalyteList);
  yield takeEvery(ADD_NEW_SAMPLE_ANALYTE, onAddNewSampleAnalyte );
  yield takeEvery(UPDATE_SAMPLE_ANALYTE, onUpdateSampleAnalyte);
}

export default InstrumentTypeListSaga;
