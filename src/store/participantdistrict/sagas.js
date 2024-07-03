import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_DISTRICT_LIST, ADD_NEW_DISTRICT , UPDATE_DISTRICT} from "./actionTypes";

import { getdistrictlistSuccess, getdistrictlistFail, addNewDistrictSuccess, addNewDistrictFail, updateDistrictsSuccess, updateDistrictsFail } from "./actions";

//Include Both Helper File with needed methods
import { getDistrictList, addNewCreateDistrict, updateDistrict} from "../../helpers/django_api_helper";

function* fetchDistrictList(object) {
  try {
    const response = yield call(getDistrictList, object.payload);
    yield put(getdistrictlistSuccess(response.data));
  } catch (error) {
    yield put(getdistrictlistFail(error));
  }
}
function* onAddNewDistrict(object) {
  try {
    const response = yield call(
      addNewCreateDistrict,
      object.payload.createDistrict,
      object.payload.id
    );
    yield put(addNewDistrictSuccess(response));
  } catch (error) {
    yield put(addNewDistrictFail(error));
  }
}
function* onupdateDistrict({ payload: district }) {
  try {
    const response = yield call(updateDistrict, district);
    yield put(updateDistrictsSuccess(response));
  } catch (error) {
    yield put(updateDistrictsFail (error));
  }
}


function* DistrictListSaga() {
  yield takeEvery(GET_DISTRICT_LIST, fetchDistrictList);
  yield takeEvery(ADD_NEW_DISTRICT, onAddNewDistrict );
  yield takeEvery(UPDATE_DISTRICT, onupdateDistrict);
}

export default DistrictListSaga;
