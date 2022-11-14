import { call, put, takeEvery } from "redux-saga/effects";

// LabMarket Redux States
import {
  GET_HOME_SAMPLED_TESTS,
  GET_CHECKOUT_ITEMS,
  ADD_CHECKOUT_DATA,
} from "./actionTypes";
import {
  getHomeSampledTestsFail,
  getHomeSampledTestsSuccess,
  getCheckoutItemsFail,
  getCheckoutItemsSuccess,
  addCheckoutDataSuccess,
  addCheckoutDataFail,
} from "./actions";

// Include Helper File with needed methods
import {
  getHomeSampledTests,
  getCheckoutItems,
  addCheckoutData,
} from "helpers/django_api_helper";

function* fetchHomeSampledTests(object) {
  try {
    const response = yield call(getHomeSampledTests, object.payload);
    yield put(getHomeSampledTestsSuccess(response.data));
  } catch (error) {
    yield put(getHomeSampledTestsFail(error));
  }
}

function* fetchCheckoutItems(object) {
  try {
    const response = yield call(
      getCheckoutItems,
      object.payload.id,
      object.payload.is_home_sampling_availed
    );
    yield put(getCheckoutItemsSuccess(response.data));
  } catch (error) {
    yield put(getCheckoutItemsFail(error));
  }
}

function* onAddCheckoutData(object) {
  try {
    const response = yield call(
      addCheckoutData,
      object.payload.checkoutData,
      object.payload.id
    );
    yield put(addCheckoutDataSuccess(response.data));
  } catch (error) {
    yield put(addCheckoutDataFail(error));
  }
}

function* checkoutSaga() {
  yield takeEvery(GET_HOME_SAMPLED_TESTS, fetchHomeSampledTests);
  yield takeEvery(GET_CHECKOUT_ITEMS, fetchCheckoutItems);
  yield takeEvery(ADD_CHECKOUT_DATA, onAddCheckoutData);
}

export default checkoutSaga;
