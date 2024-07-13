import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_INSTRUMENT_LIST,
  ADD_NEW_INSTRUMENT,UPDATE_INSTRUMENT,GET_ANALYTESEQUIPMENTS_LIST,ADD_NEW_ANALYTESEQUIPMENTS,UPDATE_ANALYTESEQUIPMENTS,
  DELETE_INSTRUMENT
} from "./actionTypes";

import { getInstrumentlistSuccess,getInstrumentlistFail,addNewInstrumentSuccess,addNewInstrumentFail,updateInstrumentSuccess,updateInstrumentFail,getAnalyteEquipmentlistSuccess,getAnalyteEquipmentlistFail,
  addNewAnalyteEquipmentlistSuccess,addNewAnalyteEquipmentlistFail,updateAnalyteEquipmentlistSuccess,updateAnalyteEquipmentlistFail,
  deleteInstrumentSuccess,
  deleteInstrumentFail
} from "./actions";

//Include Both Helper File with needed methods
import { getInstrumentlist,addNewInstrument,updateInstrument,getAnalyteEquipmentlist,addNewAnalyteEquipmentlist,
  updateAnalyteEquipmentlist,
  deleteInstrument

} from "../../helpers/django_api_helper";

///analyte equipments
function* fetchAnalyteEquipmentsList(object) {
  try {
    const response = yield call(getAnalyteEquipmentlist, object.payload);
    yield put(getAnalyteEquipmentlistSuccess(response.data));
  } catch (error) {
    yield put(getAnalyteEquipmentlistFail(error));
  }
}
function* onAddNewAnalyteEquipments(object) {
  try {
    const response = yield call(
      addNewAnalyteEquipmentlist,
      object.payload.createAnalyteEquipment,
      object.payload.id
    );
    yield put(addNewAnalyteEquipmentlistSuccess(response));
  } catch (error) {
    yield put(addNewAnalyteEquipmentlistFail(error));
  }
}
function* onUpdateAnalyteEquipments({ payload: analytesequipment }) {
  try {
    const response = yield call(updateAnalyteEquipmentlist, analytesequipment);
    yield put(updateAnalyteEquipmentlistSuccess(response));
  } catch (error) {
    yield put(updateAnalyteEquipmentlistFail (error));
  }
}
////////////////////
function* fetchInstrumentList(object) {
  try {
    const response = yield call(getInstrumentlist, object.payload);
    console.log("Response from getInstrumentlist:", response); // Log the response object
    yield put(getInstrumentlistSuccess(response.data));
  } catch (error) {
    yield put(getInstrumentlistFail(error));
  }
}
function* onAddNewInstrument(object) {
  try {
    const response = yield call(
      addNewInstrument,
      object.payload.createUnit,
      object.payload.id
    );
    yield put(addNewInstrumentSuccess(response));
  } catch (error) {
    yield put(addNewInstrumentFail(error));
  }
}
function* onUpdateInstrument({ payload: unit }) {
  try {
    const response = yield call(updateInstrument, unit);
    yield put(updateInstrumentSuccess(response));
  } catch (error) {
    yield put(updateInstrumentFail (error));
  }
}
function* onDeleteInstrument({ payload: Instrument }) {
  try {
    const response = yield call(deleteInstrument, Instrument);
    yield put(deleteInstrumentSuccess(response));
  } catch (error) {
    yield put(deleteInstrumentFail(error));
  }
}

function* InstrumentTypeListSaga() {

  yield takeEvery(GET_ANALYTESEQUIPMENTS_LIST, fetchAnalyteEquipmentsList);
  yield takeEvery(ADD_NEW_ANALYTESEQUIPMENTS, onAddNewAnalyteEquipments );
  yield takeEvery(UPDATE_ANALYTESEQUIPMENTS, onUpdateAnalyteEquipments);


  yield takeEvery(GET_INSTRUMENT_LIST, fetchInstrumentList);
  yield takeEvery(ADD_NEW_INSTRUMENT, onAddNewInstrument);
  yield takeEvery(UPDATE_INSTRUMENT, onUpdateInstrument);
  yield takeEvery(DELETE_INSTRUMENT, onDeleteInstrument);
}

export default InstrumentTypeListSaga;
