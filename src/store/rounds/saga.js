import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_ROUND_LIST,ADD_NEW_ROUND_LIST,UPDATE_NEW_ROUND_LIST } from "./actionTypes";

import { getroundlistSuccess,getroundlistFail,addNewRoundListSuccess,addNewRoundListFail, updateRoundListSuccess,updateRoundListFail } from "./actions";

//Include Both Helper File with needed rounds
import { getRoundlist,addNewRound, updateRound} from "../../helpers/django_api_helper";

function* fetchRoundList(object) {
  try {
    const response = yield call(getRoundlist, object.payload);
    console.log("Response from getRoundlist:", response); // Log the response object
    yield put(getroundlistSuccess(response.data));
  } catch (error) {
    console.error("Error in fetchRoundList:", error);
    yield put(getroundlistFail(error));
  }
}
function* onAddNewRound(object) {
  try {
    const response = yield call(
      addNewRound,
      object.payload.createUnit,
      object.payload.id
    );
    yield put(addNewRoundListSuccess(response));
  } catch (error) {
    yield put(addNewRoundListFail(error));
  }
}
function* onUpdateround({ payload: unit }) {
  try {
    const response = yield call(updateRound, unit);
    yield put(updateRoundListSuccess(response));
  } catch (error) {
    yield put(updateRoundListFail (error));
  }
}


function* RoundListSaga() {
  
  yield takeEvery(GET_ROUND_LIST, fetchRoundList);
  yield takeEvery(ADD_NEW_ROUND_LIST, onAddNewRound);
  yield takeEvery(UPDATE_NEW_ROUND_LIST, onUpdateround);

 
}

export default RoundListSaga;
