import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_PROVINCE_LIST, ADD_NEW_PROVINCE , UPDATE_PROVINCE} from "./actionTypes";

import { getprovincelistSuccess, getprovincelistFail, addNewProvinceSuccess, addNewProvinceFail, updateProvincesSuccess, updateProvincesFail } from "./actions";

//Include Both Helper File with needed methods
import { getProvinceList, addNewCreateProvince, updateProvince} from "../../helpers/django_api_helper";

function* fetchProvinceList(object) {
  try {
    const response = yield call(getProvinceList, object.payload);
    yield put(getprovincelistSuccess(response.data));
  } catch (error) {
    yield put(getprovincelistFail(error));
  }
}
function* onAddNewProvince(object) {
  try {
    const response = yield call(
      addNewCreateProvince,
      object.payload.createProvince,
      object.payload.id
    );
    yield put(addNewProvinceSuccess(response));
  } catch (error) {
    yield put(addNewProvinceFail(error));
  }
}
function* onUpdateProvince({ payload: province }) {
  try {
    const response = yield call(updateProvince, province);
    yield put(updateProvincesSuccess(response));
  } catch (error) {
    yield put(updateProvincesFail (error));
  }
}


function* ProvinceListSaga() {
  yield takeEvery(GET_PROVINCE_LIST, fetchProvinceList);
  yield takeEvery(ADD_NEW_PROVINCE, onAddNewProvince );
  yield takeEvery(UPDATE_PROVINCE, onUpdateProvince);
}

export default ProvinceListSaga;
