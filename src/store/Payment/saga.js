import { call, put, takeEvery } from "redux-saga/effects";

import { ADD_NEW_Payment } from "./actionTypes";

import { addNewPaymentSuccess,addNewPaymentFail, } from "./actions";

import { addNewPayment,} from "../../helpers/django_api_helper";


function* onAddNewPayment(object) {
  console.log("daata in saga1", object.payload.payment),
  console.log("daata in saga222222", object.payload.id)
  try {
    const response = yield call(
      addNewPayment,
      object.payload.payment,
      object.payload.id
   
    );
    yield put(addNewPaymentSuccess(response));
  } catch (error) {
    yield put(addNewPaymentFail(error));
  }
}





function* PaymentSaga() {
  

  yield takeEvery(ADD_NEW_Payment, onAddNewPayment);

 
}

export default PaymentSaga;
