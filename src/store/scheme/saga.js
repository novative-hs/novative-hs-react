import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_SCHEME_LIST, ADD_NEW_SCHEME_LIST,  UPDATE_NEW_SCHEME_LIST, DELETE_SCHEME
} from "./actionTypes";

import { addNewSchemeListFail, addNewSchemeListSuccess, updateSchemeListSuccess,updateSchemeListFail,getSchemelistFail, getSchemelistSuccess, deleteSchemeSuccess,
  deleteSchemeFail
} from "./actions";

//Include Both Helper File with needed methods
import { getSchemelist, updateScheme , addNewScheme, deleteScheme} from "../../helpers/django_api_helper";


function* fetchSchemeList(object) {
  try {
    const response = yield call(getSchemelist, object.payload);
    console.log("Response from getMethodlist:", response); // Log the response object
    yield put(getSchemelistSuccess(response.data));
  } catch (error) {
    yield put(getSchemelistFail(error));
  }
}
function* fetchCorporateTestsList(object) {
  try {
    const response = yield call(getCorporateTestsList, object.payload);
    yield put(getCorporateTestsListSuccess(response));
  } catch (error) {
    yield put(getCorporateTestsListFail(error));
  }
}
function* onAddNewScheme(object) {
  try {
    const response = yield call(
      addNewScheme,
      object.payload.createUnit,
      object.payload.id
    );
    yield put(addNewSchemeListSuccess(response));
  } catch (error) {
    yield put(addNewSchemeListFail(error));
  }
}
function* onUpdateScheme({ payload: unit }) {
  try {
    const response = yield call(updateScheme, unit);
    yield put(updateSchemeListSuccess(response));
  } catch (error) {
    yield put(updateSchemeListFail (error));
  }
}

function* onDeleteScheme({ payload: unit }) {
  try {
    const response = yield call(deleteScheme, unit);
    yield put(deleteSchemeSuccess(response));
  } catch (error) {
    yield put(deleteSchemeFail(error));
  }
}

function* InstrumentTypeListSaga() {

  yield takeEvery( GET_SCHEME_LIST, fetchSchemeList);
  yield takeEvery( ADD_NEW_SCHEME_LIST, onAddNewScheme);
  yield takeEvery( UPDATE_NEW_SCHEME_LIST, onUpdateScheme);
  yield takeEvery(DELETE_SCHEME, onDeleteScheme);
}

export default InstrumentTypeListSaga;
