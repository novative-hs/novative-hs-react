import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_COUNTRY_LIST, ADD_NEW_COUNTRY , UPDATE_COUNTRY} from "./actionTypes";

import { getcountrylistSuccess, getcountrylistFail, addNewCountrySuccess, addNewCountryFail, updateCountrysSuccess, updateCountrysFail } from "./actions";

//Include Both Helper File with needed methods
import { getCountryList, addNewCreateCountry, updateCountry} from "../../helpers/django_api_helper";

function* fetchCountryList(object) {
  try {
    const response = yield call(getCountryList, object.payload);
    yield put(getcountrylistSuccess(response.data));
  } catch (error) {
    yield put(getcountrylistFail(error));
  }
}
function* onAddNewCountry(object) {
  try {
    const response = yield call(
      addNewCreateCountry,
      object.payload.createCountry,
      object.payload.id
    );
    yield put(addNewCountrySuccess(response));
  } catch (error) {
    yield put(addNewCountryFail(error));
  }
}
function* onUpdateCountry({ payload: country }) {
  try {
    const response = yield call(updateCountry, country);
    yield put(updateCountrysSuccess(response));
  } catch (error) {
    yield put(updateCountrysFail (error));
  }
}


function* CountryListSaga() {
  yield takeEvery(GET_COUNTRY_LIST, fetchCountryList);
  yield takeEvery(ADD_NEW_COUNTRY, onAddNewCountry );
  yield takeEvery(UPDATE_COUNTRY, onUpdateCountry);
}

export default CountryListSaga;
