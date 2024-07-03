import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_INSTRUMENT_LIST,
  ADD_NEW_INSTRUMENT,UPDATE_INSTRUMENT
} from "./actionTypes";

import { getInstrumentlistSuccess,getInstrumentlistFail,addNewInstrumentSuccess,addNewInstrumentFail,updateInstrumentSuccess,updateInstrumentFail
} from "./actions";

//Include Both Helper File with needed methods
import { getInstrumentlist,addNewInstrument,updateInstrument} from "../../helpers/django_api_helper";

function* fetchInstrumentList(object) {
  try {
    const response = yield call(getInstrumentlist, object.payload);
    console.log("Response from getMethodlist:", response); // Log the response object
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

function* InstrumentTypeListSaga() {
  yield takeEvery(GET_INSTRUMENT_LIST, fetchInstrumentList);
  yield takeEvery(ADD_NEW_INSTRUMENT, onAddNewInstrument);
  yield takeEvery(UPDATE_INSTRUMENT, onUpdateInstrument);
}

export default InstrumentTypeListSaga;
