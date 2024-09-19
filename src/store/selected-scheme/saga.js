import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { SELECTED_SCHEMES } from "./actionTypes";

import {
  getSelectedSchemesListFail,
  getSelectedSchemesListSuccess,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getSelectedSchemesList,
} from "../../helpers/django_api_helper";

function* fetchSchemeList(object) {
  try {
    const response = yield call(getSelectedSchemesList, object.payload);
    // console.log("Response from getMethodlist:", response); // Log the response object
    yield put(getSelectedSchemesListSuccess(response.data));
  } catch (error) {
    yield put(getSelectedSchemesListFail(error));
  }
}
function* SelectedSchemeListSaga() {
  yield takeEvery(SELECTED_SCHEMES, fetchSchemeList);
}

export default SelectedSchemeListSaga;
