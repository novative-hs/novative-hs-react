import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_DESIGNATION_LIST, ADD_NEW_DESIGNATION , UPDATE_DESIGNATION} from "./actionTypes";

import { getdesignationlistSuccess, getdesignationlistFail, addNewDesignationSuccess, addNewDesignationFail, updateDesignationsSuccess, updateDesignationsFail } from "./actions";

//Include Both Helper File with needed methods
import { getDesignationList, addNewCreateDesignation, updateDesignation} from "../../helpers/django_api_helper";

function* fetchDesignationList(object) {
  try {
    const response = yield call(getDesignationList, object.payload);
    yield put(getdesignationlistSuccess(response.data));
  } catch (error) {
    yield put(getdesignationlistFail(error));
  }
}
function* onAddNewDesignation(object) {
  try {
    const response = yield call(
      addNewCreateDesignation,
      object.payload.createDesignation,
      object.payload.id
    );
    yield put(addNewDesignationSuccess(response));
  } catch (error) {
    yield put(addNewDesignationFail(error));
  }
}
function* onupdateDesignation({ payload: designation }) {
  try {
    const response = yield call(updateDesignation, designation);
    yield put(updateDesignationsSuccess(response));
  } catch (error) {
    yield put(updateDesignationsFail (error));
  }
}


function* DesignationListSaga() {
  yield takeEvery(GET_DESIGNATION_LIST, fetchDesignationList);
  yield takeEvery(ADD_NEW_DESIGNATION, onAddNewDesignation );
  yield takeEvery(UPDATE_DESIGNATION, onupdateDesignation);
}

export default DesignationListSaga;
