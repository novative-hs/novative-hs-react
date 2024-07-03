import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_DEPARTMENT_LIST, ADD_NEW_DEPARTMENT , UPDATE_DEPARTMENT} from "./actionTypes";

import { getdepartmentlistSuccess, getdepartmentlistFail, addNewDepartmentSuccess, addNewDepartmentFail, updateDepartmentsSuccess, updateDepartmentsFail } from "./actions";

//Include Both Helper File with needed methods
import { getDepartmentList, addNewCreateDepartment, updateDepartment} from "../../helpers/django_api_helper";

function* fetchDepartmentList(object) {
  try {
    const response = yield call(getDepartmentList, object.payload);
    yield put(getdepartmentlistSuccess(response.data));
  } catch (error) {
    yield put(getdepartmentlistFail(error));
  }
}
function* onAddNewDepartment(object) {
  try {
    const response = yield call(
      addNewCreateDepartment,
      object.payload.createDepartment,
      object.payload.id
    );
    yield put(addNewDepartmentSuccess(response));
  } catch (error) {
    yield put(addNewDepartmentFail(error));
  }
}
function* onUpdateDepartment({ payload: department }) {
  try {
    const response = yield call(updateDepartment, department);
    yield put(updateDepartmentsSuccess(response));
  } catch (error) {
    yield put(updateDepartmentsFail (error));
  }
}


function* DepartmentListSaga() {
  yield takeEvery(GET_DEPARTMENT_LIST, fetchDepartmentList);
  yield takeEvery(ADD_NEW_DEPARTMENT, onAddNewDepartment );
  yield takeEvery(UPDATE_DEPARTMENT, onUpdateDepartment);
}

export default DepartmentListSaga;
