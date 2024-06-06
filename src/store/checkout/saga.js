import { call, put, takeEvery } from "redux-saga/effects";

// LabMarket Redux States
import {
  
  GET_CHECKOUT_ITEMS,
  ADD_CHECKOUT_DATA,
  
} from "./actionTypes";
import {
 
  getCheckoutItemsFail,
  getCheckoutItemsSuccess,
  addCheckoutDataSuccess,
  addCheckoutDataFail,
} from "./actions";

// Include Helper File with needed methods
import {
  getCheckoutItems,
  addCheckoutData,
  
} from "helpers/django_api_helper";


function* fetchCheckoutItems(object) {
  try {
    const response = yield call(
      getCheckoutItems,
      object.payload.id,
      object.payload.is_home_sampling_availed,
      object.payload.is_state_sampling_availed,
    );
    console.log("object saga",object)
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
 

  yield takeEvery(GET_CHECKOUT_ITEMS, fetchCheckoutItems);
  yield takeEvery(ADD_CHECKOUT_DATA, onAddCheckoutData);
}

export default checkoutSaga;
