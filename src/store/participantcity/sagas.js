import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_CITY_LIST, ADD_NEW_CITY , UPDATE_CITY} from "./actionTypes";

import { getcitylistSuccess, getcitylistFail, addNewCitySuccess, addNewCityFail, updateCitysSuccess, updateCitysFail } from "./actions";

//Include Both Helper File with needed methods
import { getCityList, addNewCreateCity, updateCity} from "../../helpers/django_api_helper";

function* fetchCityList(object) {
  try {
    const response = yield call(getCityList, object.payload);
    yield put(getcitylistSuccess(response.data));
  } catch (error) {
    yield put(getcitylistFail(error));
  }
}
function* onAddNewCity(object) {
  try {
    const response = yield call(
      addNewCreateCity,
      object.payload.createCity,
      object.payload.id
    );
    yield put(addNewCitySuccess(response));
  } catch (error) {
    yield put(addNewCityFail(error));
  }
}
function* onUpdateCity({ payload: city }) {
  try {
    const response = yield call(updateCity, city);
    yield put(updateCitysSuccess(response));
  } catch (error) {
    yield put(updateCitysFail (error));
  }
}


function* CityListSaga() {
  yield takeEvery(GET_CITY_LIST, fetchCityList);
  yield takeEvery(ADD_NEW_CITY, onAddNewCity );
  yield takeEvery(UPDATE_CITY, onUpdateCity);
}

export default CityListSaga;
