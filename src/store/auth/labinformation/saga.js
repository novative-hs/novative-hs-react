import { takeEvery, put, call } from "redux-saga/effects";

//Account Redux states
import { GET_LABS, ADD_LAB_INFORMATION, GET_TERRITORIES_LIST } from "./actionTypes";
import {
  getTerritoriesListSuccess,
  getTerritoriesListFail,
  getLabsSuccess,
  getLabsFail,
  addLabInformationSuccessful,
  addLabInformationFailed,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getLabs,
  postLabInformation,
  getTerritoriesList,
} from "../../../helpers/django_api_helper";

function* fetchTerritoriesList(object) {
  try {
    const response = yield call(getTerritoriesList, object.payload);
    yield put(getTerritoriesListSuccess(response));
  } catch (error) {
    yield put(getTerritoriesListFail(error));
  }
}
function* fetchLabs() {
  try {
    const response = yield call(getLabs);
    yield put(getLabsSuccess(response));
  } catch (error) {
    yield put(getLabsFail(error));
  }
}

// Is user register successfull then direct plot user in redux.
function* addLabInformation({ payload: { lab, id } }) {
  try {
    const response = yield call(postLabInformation, id, lab);

    if (response.status == 400) {
      yield put(addLabInformationFailed(response.message));
    } else {
      yield put(addLabInformationSuccessful(response));
    }
  } catch (error) {
    yield put(addLabInformationFailed(error));
  }
}

function* LabInformationSaga() {
  yield takeEvery(GET_LABS, fetchLabs);
  yield takeEvery(ADD_LAB_INFORMATION, addLabInformation);
  yield takeEvery(GET_TERRITORIES_LIST,fetchTerritoriesList);
}

export default LabInformationSaga;
