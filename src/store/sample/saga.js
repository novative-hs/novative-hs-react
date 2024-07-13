import { takeEvery, put, call } from "redux-saga/effects";
import { 
  GET_SAMPLE_LIST,
  ADD_NEW_SAMPLE_LIST,
  UPDATE_NEW_SAMPLE_LIST,
  DELETE_NEW_SAMPLE_LIST,
} from "./actionTypes";

import { 
  getSamplelistSuccess,
  getSamplelistFail,

  addNewSampleListSuccess, 
  addNewSampleListFail,

  updateSampleListSuccess,
  updateSampleListFail,

  deleteSampleListSuccess,
  deleteSampleListFail,
} from "./actions";
import { getSamplelist, addNewSampleList, updateSampleList, deleteSampleList  } from "../../helpers/django_api_helper";

function* fetchSampleList(action) {
  try {
    const { id } = action.payload; // Extract 'id' from the action payload
    const response = yield call(getSamplelist, id);
    if (Array.isArray(response.data)) {
      // Dispatch success action with the response data
      yield put(getSamplelistSuccess(response.data));
    } else {
      throw new Error("Response data is not an array");
    }
  } catch (error) {
    console.error("Error fetching sample list:", error); // Log the error if API call fails

    // Dispatch fail action with the error object
    yield put(getSamplelistFail(error));
  }
}

function* onAddSampleList(action) {
  try {
    const response = yield call(addNewSampleList, action.payload.sample);
    yield put(addNewSampleListSuccess(response));
  } catch (error) {
    yield put(addNewSampleListFail(error));
  }
}


function* onUpdateSampleList({ payload: sample }) {
  try {
    const response = yield call(updateSampleList, sample);
    yield put(updateSampleListSuccess(response));
  } catch (error) {
    yield put(updateSampleListFail (error));
  }
}
function* onDeleteSampleList(action) {
  try {
    const response = yield call(deleteSampleList, action.payload);
    console.log("Response from deleteSampleList:", response); // Log the response object
    yield put(deleteSampleListSuccess(response));
  } catch (error) {
    console.log("Error in onDeleteSampleList saga:", error); // Log the error
    yield put(deleteSampleListFail(error));
  }
}

function* SampleSaga() {
  yield takeEvery(GET_SAMPLE_LIST, fetchSampleList);
  yield takeEvery(ADD_NEW_SAMPLE_LIST, onAddSampleList);
  yield takeEvery(UPDATE_NEW_SAMPLE_LIST, onUpdateSampleList);
  yield takeEvery(DELETE_NEW_SAMPLE_LIST, onDeleteSampleList);
}

export default SampleSaga;
