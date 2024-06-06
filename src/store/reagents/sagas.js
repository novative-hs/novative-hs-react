import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_REAGENTS_LIST, ADD_NEW_REAGENTS , UPDATE_REAGENTS } from "./actionTypes";

import { getReagentlistSuccess, getReagentlistFail, addNewReagentsSuccess, addNewReagentsFail, updateReagentsSuccess, updateReagentsFail  } from "./actions";

//Include Both Helper File with needed methods
import { getReagentsList, addNewReagents, updateReagents } from "../../helpers/django_api_helper";

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


function* ReagentsListSaga() {
  yield takeEvery(GET_REAGENTS_LIST, fetchReagentsList);
  yield takeEvery(ADD_NEW_REAGENTS, onAddNewReagents );
  yield takeEvery(UPDATE_REAGENTS, onUpdateReagents);
}

export default ReagentsListSaga;
