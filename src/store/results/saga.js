import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  SCHEMES_ANALYTES,
  POST_RESULT,
  UPDATE_RESULT,
  GET_RESULT,
  GET_STATISTICS,
  POST_SERELOGY_VALUES,
  GET_SERELOGY_VALUES,
  GET_ANALYTE_RESULT_PARTICIPANT,
  GET_MICRO_RESULT_DATA,
  POST_MICRO_RESULT,
} from "./actionTypes";

import {
  getSchemeAnalytesListSuccess,
  getSchemeAnalytesListFail,
  postResultSuccess,
  postResultFail,
  updateResultSuccess,
  updateResultFail,
  getResultsListSuccess,
  getResultsListFail,
  getStatisticsListSuccess,
  getStatisticsListFail,
  postValuesSuccess,
  postValuesFail,
  getResultValuesSuccess,
  getResultValuesFail,
  getAnalyteResultParticipantSuccess,
  getAnalyteResultParticipantFail,
  getmicroresultdataSuccess,
  getmicroresultdataFail,
  postMicroResultSuccess,
  postMicroResultFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getSchemeAnalytesList,
  postResult,
  updateResult,
  getResultsList,
  getStatisticsList,
  addSereologyValues,
  getSereologyValues,
  getAnalyteResultParticipantlist,
  getmicroresultdatalist,
  postMicroResult,
} from "../../helpers/django_api_helper";

function* fetchAnalytesScheme(object) {
  try {
    const response = yield call(getSchemeAnalytesList, object.payload);
    // console.log("ResponseSaga :", response.data);
    yield put(getSchemeAnalytesListSuccess(response.data));
  } catch (error) {
    yield put(getSchemeAnalytesListFail(error));
  }
}

// POST RESULT
function* onPostResult(object) {
  try {
    const response = yield call(
      postResult,
      object.payload.result,
      object.payload.id
    );
    yield put(postResultSuccess(response));
  } catch (error) {
    yield put(postResultFail(error));
  }
}
/////////////////////////

function* onUpdateResult(action) {
  try {
    const { result, id, callback } = action.payload;
    const response = yield call(updateResult, result, id);
    const payload = response?.data || response;

    if (payload?.status === 200) {
      yield put(updateResultSuccess(payload));
    } else {
      yield put(updateResultFail(payload));
    }

    if (callback) callback(payload); // ✅ Call it
    return payload;
  } catch (error) {
    const errPayload = error?.response?.data || { message: "Unexpected error" };
    yield put(updateResultFail(errPayload));
    if (action.payload.callback) action.payload.callback(errPayload);
    return errPayload;
  }
}

/////////////////////////
function* onPostValues(object) {
  try {
    const response = yield call(
      addSereologyValues,
      object.payload.result,
      object.payload.id
    );
    yield put(postValuesSuccess(response));
  } catch (error) {
    yield put(postValuesFail(error));
  }
}
////////////////
function* fetchResultList(object) {
  try {
    const response = yield call(getResultsList, object.payload);

    if (response.data.length > 0) {
      const updated_at = response.data[0].updated_at; // Extract updated_at

      yield put(
        getResultsListSuccess({
          results: response.data,
          updated_at: updated_at, // Send updated_at to reducer
        })
      );
    } else {
      yield put(getResultsListFail("No results found"));
    }
  } catch (error) {
    yield put(getResultsListFail(error));
  }
}

////////////////
function* fetchValuesList(action) {
  try {
    const { id, round_id } = action.payload; // Extract values from the action payload
    const response = yield call(getSereologyValues, id, round_id);

    yield put(getResultValuesSuccess(response.data)); // Dispatch success action with the data
  } catch (error) {
    // Dispatch failure action with the error
    yield put(getResultValuesFail(error));
  }
}

////////////////
function* fetchStatisticsList(object) {
  try {
    const response = yield call(getStatisticsList, object.payload);

    yield put(getStatisticsListSuccess(response.data));
  } catch (error) {
    yield put(getStatisticsListFail(error));
  }
}

function* fetchAnalyteResultParticpant(action) {
  try {
    const { roundId, analyteId } = action.payload;
    console.log(
      "Fetching data for Round ID:",
      roundId,
      "Analyte ID:",
      analyteId
    );

    const response = yield call(
      getAnalyteResultParticipantlist,
      roundId,
      analyteId
    );
    console.log("API Response:", response.data);

    yield put(getAnalyteResultParticipantSuccess(response.data));
  } catch (error) {
    console.error("Error fetching data:", error);
    yield put(getAnalyteResultParticipantFail(error));
  }
}
function* fetchMicroResultList(action) {
  try {
    const response = yield call(getmicroresultdatalist, action.payload);

    console.log("✅ API Raw Response:", response);

    yield put(
      getmicroresultdataSuccess({
        instruments: response.instruments,
        reagents: response.reagents,
        organisms: response.organisms,
        antibiotics: response.antibiotics,
        results: response.results, // ✅ from API response
      })
    );
  } catch (error) {
    console.error("❌ Error in saga:", error);
    yield put(getmicroresultdataFail(error?.response?.data || error.message));
  }
}

/////////////
function* onPostMicroResult(object) {
  try {
    const response = yield call(
      postMicroResult,
      object.payload.result,
      object.payload.id
    );
    yield put(postMicroResultSuccess(response));
  } catch (error) {
    yield put(postMicroResultFail(error));
  }
}
function* AnalyteSchemeSaga() {
  yield takeEvery(SCHEMES_ANALYTES, fetchAnalytesScheme);
  yield takeEvery(POST_RESULT, onPostResult);
  yield takeEvery(UPDATE_RESULT, onUpdateResult);
  yield takeEvery(POST_SERELOGY_VALUES, onPostValues);
  yield takeEvery(GET_RESULT, fetchResultList);
  yield takeEvery(GET_SERELOGY_VALUES, fetchValuesList);
  yield takeEvery(GET_STATISTICS, fetchStatisticsList);
  yield takeEvery(GET_ANALYTE_RESULT_PARTICIPANT, fetchAnalyteResultParticpant);
  yield takeEvery(GET_MICRO_RESULT_DATA, fetchMicroResultList);
  yield takeEvery(POST_MICRO_RESULT, onPostMicroResult);
}

export default AnalyteSchemeSaga;
