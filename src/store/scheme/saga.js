import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_SCHEME_LIST,ADD_NEW_SCHEME_LIST,UPDATE_NEW_SCHEME_LIST } from "./actionTypes";

import { getschemelistSuccess,getschemelistFail,addNewSchemeListSuccess,addNewSchemeListFail, updateSchemeListSuccess,updateSchemeListFail } from "./actions";

//Include Both Helper File with needed schemes
import { getSchemelist,addNewScheme, updateScheme} from "../../helpers/django_api_helper";

function* fetchSchemeList(object) {
  try {
    const response = yield call(getSchemelist, object.payload);
    console.log("Response from getSchemelist:", response); // Log the response object
    yield put(getschemelistSuccess(response.data));
  } catch (error) {
    console.error("Error in fetchSchemeList:", error);
    yield put(getschemelistFail(error));
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
function* onUpdatescheme({ payload: unit }) {
  try {
    const response = yield call(updateScheme, unit);
    yield put(updateSchemeListSuccess(response));
  } catch (error) {
    yield put(updateSchemeListFail (error));
  }
}


function* SchemeListSaga() {
  
  yield takeEvery(GET_SCHEME_LIST, fetchSchemeList);
  yield takeEvery(ADD_NEW_SCHEME_LIST, onAddNewScheme);
  yield takeEvery(UPDATE_NEW_SCHEME_LIST, onUpdatescheme);

 
}

export default SchemeListSaga;
