import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { DELETE_REAGENT,GET_REAGENTS_LIST, ADD_NEW_REAGENTS , UPDATE_REAGENTS ,GET_ANALYTESREAGENTS_LIST,ADD_NEW_ANALYTESREAGENTS,UPDATE_ANALYTESREAGENTS} from "./actionTypes";

import { deleteReagentSuccess,deleteReagentFail,getReagentlistSuccess, getReagentlistFail, addNewReagentsSuccess, addNewReagentsFail, updateReagentsSuccess, updateReagentsFail ,getAnalyteReagentlistSuccess,getAnalyteReagentlistFail,addNewAnalyteReagentlistSuccess,addNewAnalyteReagentlistFail,updateAnalyteReagentlistSuccess,updateAnalyteReagentlistFail } from "./actions";


import { deleteReagent,getReagentsList, addNewReagents, updateReagents,
  getAnalyteReagentlist,addNewAnalyteReagentlist,updateAnalyteReagentlist } from "../../helpers/django_api_helper";

///analyte reagents
function* fetchAnalyteReagentsList(object) {
  try {
    console.log("Saga - Fetching analyte reagents with payload:", object.payload);

    // Make the API call
    const response = yield call(getAnalyteReagentlist, object.payload);
    console.log("Saga - API response received:", response);

    // Extract data
    const analyteData = {
      analyte_name: response.data.analyte_name, // Extract analyte_name
      reagents: response.data.reagents,        // Extract reagents array
    };
    console.log("Saga - Dispatching success with analyteData:", analyteData);

    // Dispatch success action
    yield put(getAnalyteReagentlistSuccess(analyteData));
  } catch (error) {
    console.error("Saga - Error fetching analyte reagents:", error);
    yield put(getAnalyteReagentlistFail(error));
  }
}

function* onAddNewAnalyteReagents(object) {
  try {
    const response = yield call(
      addNewAnalyteReagentlist,
      object.payload.createAnalyteReagent,
      object.payload.id
    );
    yield put(addNewAnalyteReagentlistSuccess(response));
  } catch (error) {
    yield put(addNewAnalyteReagentlistFail(error));
  }
}
function* onUpdateAnalyteReagents({ payload: analytesreagent }) {
  try {
    const response = yield call(updateAnalyteReagentlist, analytesreagent);
    yield put(updateAnalyteReagentlistSuccess(response));
  } catch (error) {
    yield put(updateAnalyteReagentlistFail (error));
  }
}

////reagents

function* fetchReagentsList(object) {
  try {
    const response = yield call(getReagentsList, object.payload);
    yield put(getReagentlistSuccess(response.data));
  } catch (error) {
    yield put(getReagentlistFail(error));
  }
}
function* onAddNewReagents(object) {
  try {
    const response = yield call(
      addNewReagents,
      object.payload.createReagent,
      object.payload.id
    );
    yield put(addNewReagentsSuccess(response));
  } catch (error) {
    yield put(addNewReagentsFail(error));
  }
}
function* onUpdateReagents({ payload: reagent }) {
  try {
    const response = yield call(updateReagents, reagent);
    yield put(updateReagentsSuccess(response));
  } catch (error) {
    yield put(updateReagentsFail (error));
  }
}
function* onDeleteReagent({ payload: Reagent }) {
  try {
    const response = yield call(deleteReagent, Reagent);
    yield put(deleteReagentSuccess(response));
  } catch (error) {
    yield put(deleteReagentFail(error));
  }
}


function* ReagentsListSaga() {
  yield takeEvery(GET_ANALYTESREAGENTS_LIST, fetchAnalyteReagentsList);
  yield takeEvery(ADD_NEW_ANALYTESREAGENTS, onAddNewAnalyteReagents );
  yield takeEvery(UPDATE_ANALYTESREAGENTS, onUpdateAnalyteReagents);


  yield takeEvery(GET_REAGENTS_LIST, fetchReagentsList);
  yield takeEvery(ADD_NEW_REAGENTS, onAddNewReagents );
  yield takeEvery(UPDATE_REAGENTS, onUpdateReagents);
  yield takeEvery(DELETE_REAGENT, onDeleteReagent);
}

export default ReagentsListSaga;

