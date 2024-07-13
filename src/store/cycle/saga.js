import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_CYCLE_LIST,ADD_NEW_CYCLE_LIST,UPDATE_NEW_CYCLE_LIST, DELETE_CYCLE } from "./actionTypes";

import { getcyclelistSuccess,getcyclelistFail,addNewCycleListSuccess,addNewCycleListFail, updateCycleListSuccess,updateCycleListFail, deleteCycleSuccess,
  deleteCycleFail} from "./actions";

//Include Both Helper File with needed cycles
import { getCyclelist,addNewCycle, updateCycle,deleteCycle} from "../../helpers/django_api_helper";

function* fetchCycleList(object) {
  try {
    const response = yield call(getCyclelist, object.payload);
    console.log("Response from getCyclelist:", response); // Log the response object
    yield put(getcyclelistSuccess(response.data));
  } catch (error) {
    console.error("Error in fetchCycleList:", error);
    yield put(getcyclelistFail(error));
  }
}
function* onAddNewCycle(object) {
  try {
    const response = yield call(
      addNewCycle,
      object.payload.createUnit,
      object.payload.id
    );
    yield put(addNewCycleListSuccess(response));
  } catch (error) {
    yield put(addNewCycleListFail(error));
  }
}

function* onUpdatecycle({ payload: cycle }) {
  try {
    const response = yield call(updateCycle, cycle);
    yield put(updateCycleListSuccess(response));
  } catch (error) {
    yield put(updateCycleListFail (error));
  }
}

function* onDeleteCycle({ payload: unit }) {
  try {
    const response = yield call(deleteCycle, unit);
    yield put(deleteCycleSuccess(response));
  } catch (error) {
    yield put(deleteCycleFail(error));
  }
}


function* CycleListSaga() {
  
  yield takeEvery(GET_CYCLE_LIST, fetchCycleList);
  yield takeEvery(ADD_NEW_CYCLE_LIST, onAddNewCycle);
  yield takeEvery(UPDATE_NEW_CYCLE_LIST, onUpdatecycle);
  yield takeEvery(DELETE_CYCLE, onDeleteCycle);
 
}

export default CycleListSaga;
