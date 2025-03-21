import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { DELETE_ANALYTE,DELETE_INSTRUMENT_TYPE,GET_INSTRUMENT_TYPE_LIST, ADD_NEW_INSTRUMENT_TYPE, UPDATE_NEW_INSTRUMENT_TYPE, GET_ANALYTE_LIST, GET_ANALYTEFORSCHEME_LIST, ADD_NEW_ANALYTE_LIST,  UPDATE_NEW_ANALYTE_LIST, GET_SCHEMEANALYTE_LIST,ADD_NEW_SCHEMEANALYTE,UPDATE_SCHEMEANALYTE, GET_ANALYTESCYCLES, GET_SAMPLE_ANALYTE_LIST,ADD_NEW_SAMPLE_ANALYTE,UPDATE_SAMPLE_ANALYTE, ADD_EQUIPMENTTYPE_FILE, GET_ANALYTESSAMPLE, GET_INSTRUMENT_ANALYTE_LIST, ADD_NEW_INSTRUMENT_ANALYTE, UPDATE_INSTRUMENT_ANALYTE, GET_INSTRUMENT_DETAIL, 
} from "./actionTypes";

import { deleteAnalyteSuccess,deleteAnalyteFail,getinstrumenttypelistSuccess, getinstrumenttypelistFail,addNewInstrumentTypeSuccess,addNewInstrumentTypeFail ,updateNewInstrumentTypeSuccess,updateNewInstrumentTypeFail, addNewAnalyteListFail, addNewAnalyteListSuccess, updateAnalyteListSuccess,updateAnalyteListFail,getAnalytelistFail, getAnalyteforSchemelistSuccess, getAnalyteforSchemelistFail, getAnalytelistSuccess,deleteInstrumentTypeSuccess,deleteInstrumentTypeFail, getSchemeAnalytelistSuccess,getSchemeAnalytelistFail,addNewSchemeAnalytelistSuccess,addNewSchemeAnalytelistFail,updateSchemeAnalytelistSuccess,updateSchemeAnalytelistFail, getAnalyteCycleFail,getAnalyteCycleSuccess, getSampleAnalytelistSuccess,getSampleAnalytelistFail,addNewSampleAnalytelistSuccess,addNewSampleAnalytelistFail,updateSampleAnalytelistSuccess,updateSampleAnalytelistFail,addEquipmentTypefileFail, getAnalyteSampleFail, getAnalyteSampleSuccess, getInstrumentDetailSuccess, getInstrumentDetailFail, 
  addNewInstrumentAnalytelistSuccess, addNewInstrumentAnalytelistFail,getInstrumentAnalytelistFail, updateInstrumentAnalytelistSuccess, updateInstrumentAnalytelistFail, getInstrumentAnalytelistSuccess
} from "./actions";

//Include Both Helper File with needed methods
import { deleteAnalyte,deleteInstrumentType,getInstrumenttypelist ,addNewInstrumentType,updateNewInstrumentType, getAnalytelist, updateAnalyte , addNewAnalyte, getSchemeAnalytelist, getAnalyteforSchemelist, addNewSchemeAnalytelist,updateSchemeAnalytelist, getAnalyteCycle,  addEquipmentTypefile, getSampleAnalytelist,addNewSampleAnalytelist,updateSampleAnalytelist, getAnalyteSampleList, getInstrumentAnalytelist, addNewInstrumentAnalytelist, updateInstrumentAnalytelist, getInstrumentDetail, } from "../../helpers/django_api_helper";

// ADD EQUIPMENT TYPE FILE

// Sample Analyte
function* fetchSampleAnalyteList(object) {
  try {
    // Call the API and get the response
    const response = yield call(getSampleAnalytelist, object.payload);

    // Extract `sample_name` and `analytes` from the API response
    const { sample_name, analytes } = response.data;

    console.log("Saga - API Response:", response.data); // Debugging log
    console.log("Saga - Extracted Sample Name:", sample_name);
    console.log("Saga - Extracted Analytes:", analytes);

    // Dispatch success action with structured payload
    yield put(
      getSampleAnalytelistSuccess({
        sampleName: sample_name || "Unknown Sample", // Default if missing
        analytes: analytes || [], // Default to empty array if missing
      })
    );
  } catch (error) {
    console.error("Saga - Error in fetchSampleAnalyteList:", error);
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
//////////////////////////////////////
function* fetchInstrumentAnalyteList(object) {
  try {
    console.log("Saga - Payload for API Call:", object.payload);

    const response = yield call(getInstrumentAnalytelist, object.payload);
    console.log("Saga - API Response:", response);

    // Safely extract the data
    const analytes = response?.analytes || []; // Ensure analytes is an array
    const instrumentName = response?.instrument_name || "Unknown Instrument";

    const transformedResponse = {
      analytes,
      instrumentName,
    };

    console.log("Saga - Transformed Response:", transformedResponse);

    // Dispatch success action
    yield put(getInstrumentAnalytelistSuccess(transformedResponse));
  } catch (error) {
    console.error("Saga - Error Fetching Instrument Analytes:", error.message, error.stack);
    yield put(getInstrumentAnalytelistFail(error));
  }
}


function* onAddNewInstrumentAnalyte(object) {
  try {
    const response = yield call(
      addNewInstrumentAnalytelist,
      object.payload.addInstrumentAnalyte,
      object.payload.id
    );
    yield put(addNewInstrumentAnalytelistSuccess(response));
  } catch (error) {
    yield put(addNewInstrumentAnalytelistFail(error));
  }
}
function* onUpdateInstrumentAnalyte({ payload: schemeanalyte }) {
  try {
    const response = yield call(updateInstrumentAnalytelist, schemeanalyte);
    yield put(updateInstrumentAnalytelistSuccess(response));
  } catch (error) {
    yield put(updateInstrumentAnalytelistFail (error));
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
    console.log("Saga - Fetching Scheme Analyte List with Payload:", object.payload);

    // Call the API
    const response = yield call(getSchemeAnalytelist, object.payload);
    console.log("Saga - API Response:", response.data); // Log the full API response

    // Extract analytes
    const analytes = response.data.analytes || [];
    console.log("Saga - Extracted Analytes:", analytes); // Log the extracted analytes

    // Extract scheme name as a string
    const SchemeName = response.data.scheme_name || "Unknown";
    console.log("Saga - Extracted Scheme Name:", SchemeName); // Log the extracted scheme name

    // Dispatch success with both analytes and scheme name
    yield put(
      getSchemeAnalytelistSuccess({
        analytes,
        SchemeName, // Pass scheme name as a string
      })
    );
  } catch (error) {
    console.error("Saga - Error Fetching Scheme Analyte List:", error); // Log any errors
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
    console.log("API Response for Analyte Cycles:", response.data);

    const analytes = response.data.analytes || [];
    const CycleName = response.data.cycle_name || "Unknown"; // Default to "Unknown" if missing

    yield put(getAnalyteCycleSuccess({ analytes, CycleName }));
  } catch (error) {
    console.error("Error in fetchAnalyteCycles:", error);
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
    console.log("Fetching Analytes for Scheme with Payload:", object.payload);

    const response = yield call(getAnalyteforSchemelist, object.payload);
    console.log("Response from getAnalyteforSchemelist:", response.data);

    const analytes = response.data.analytes || [];
    const SchemeName = response.data.scheme_name || "Unknown";

    yield put(
      getAnalyteforSchemelistSuccess({
        analytes,
        SchemeName, // Include scheme name in the success payload
      })
    );
  } catch (error) {
    console.error("Error in fetchAnalyteforSchemeList:", error);
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

function* fetchAnalyteSample(object) {
  try {
    // Call the API and fetch the response
    const response = yield call(getAnalyteSampleList, object.payload);

    // Extract `sample_name` and other relevant data from the API response
    const sampleName = response.data.sample_name || "Unknown Sample"; // Default to "Unknown Sample" if missing
    const analytes = response.data.analytes || []; // Assuming the response contains analytes

    console.log("Saga - API Response:", response.data); // Debugging log
    console.log("Saga - Extracted Sample Name:", sampleName);

    // Dispatch success action with extracted data
    yield put(
      getAnalyteSampleSuccess({
        analytes,
        sampleName,
      })
    );
  } catch (error) {
    console.error("Saga - Error in fetchAnalyteSample:", error);
    yield put(getAnalyteSampleFail(error));
  }
}


function* fetchInstrumentDetail(object) {
  try {
    const response = yield call(getInstrumentDetail, object.payload);
    yield put(getInstrumentDetailSuccess(response.data));
  } catch (error) {
    yield put(getInstrumentDetailFail(error));
  }
}
function* InstrumentTypeListSaga() {
  yield takeEvery(GET_INSTRUMENT_TYPE_LIST, fetchInstrumentTypeList);
  yield takeEvery(ADD_NEW_INSTRUMENT_TYPE, onAddNewInstrumentType);
  yield takeEvery(ADD_EQUIPMENTTYPE_FILE, onAddEquipmentTypefile);
  yield takeEvery(UPDATE_NEW_INSTRUMENT_TYPE, onUpdateInstrumentType);
  yield takeEvery(DELETE_INSTRUMENT_TYPE, onDeleteInstrumentType);
  yield takeEvery(GET_ANALYTESSAMPLE, fetchAnalyteSample);
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

  yield takeEvery(GET_INSTRUMENT_ANALYTE_LIST, fetchInstrumentAnalyteList);
  yield takeEvery(ADD_NEW_INSTRUMENT_ANALYTE, onAddNewInstrumentAnalyte );
  yield takeEvery(UPDATE_INSTRUMENT_ANALYTE, onUpdateInstrumentAnalyte);

  yield takeEvery(GET_INSTRUMENT_DETAIL, fetchInstrumentDetail);
}

export default InstrumentTypeListSaga;