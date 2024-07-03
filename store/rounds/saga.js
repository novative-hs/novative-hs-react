import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_ROUND_LIST,ADD_NEW_ROUND_LIST,UPDATE_NEW_ROUND_LIST, DELETE_ROUND} from "./actionTypes";

import { getroundlistSuccess,getroundlistFail,addNewRoundListSuccess,addNewRoundListFail, updateRoundListSuccess,updateRoundListFail, deleteRoundSuccess,
  deleteRoundFail } from "./actions";

//Include Both Helper File with needed rounds
import { getRoundlist,addNewRound, updateRound, deleteRound} from "../../helpers/django_api_helper";

function* fetchRoundList(object) {
  try {
    const response = yield call(getRoundlist, object.payload);

    yield put(getroundlistSuccess(response.data));
  } catch (error) {

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


function* onUpdateround({ payload: round }) {
  console.log("data in saga is ",round )
  try {
    const response = yield call(updateRound, round);
    yield put(updateRoundListSuccess(response));
  } catch (error) {
    yield put(updateRoundListFail (error));
  }
}

function* onDeleteRound({ payload: round }) {
  try {
    const response = yield call(deleteRound, round);
    yield put(deleteRoundSuccess(response));
  } catch (error) {
    yield put(deleteRoundFail(error));
  }
}


function* RoundListSaga() {
  
  yield takeEvery(GET_ROUND_LIST, fetchRoundList);
  yield takeEvery(ADD_NEW_ROUND_LIST, onAddNewRound);
  yield takeEvery(UPDATE_NEW_ROUND_LIST, onUpdateround);
  yield takeEvery(DELETE_ROUND, onDeleteRound);

}

export default RoundListSaga;
