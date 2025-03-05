import { call, put, takeEvery } from "redux-saga/effects";
import { ADD_NEW_Payment, GET_PARTICIPANT_PAYMENT, GET_PARTICIPANT_SCHEME_LIST } from "./actionTypes";
import {
  addNewPaymentSuccess,
  addNewPaymentFail,
  getparticipantpaymentSuccess,
  getparticipantpaymentFail,
  getParticipantSchemelistSuccess,
  getParticipantSchemelistFail,
} from "./actions";
import { addNewPayment, getParticipantPayment, getParticipantSchemelist} from "../../helpers/django_api_helper";

function* onAddNewPayment(object) {
  console.log("data in saga1", object.payload.payment);
  console.log("data in saga222222", object.payload.id);
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
function* fetchParticipantPayment() {
  try {
    const response = yield call(getParticipantPayment);
    console.log("Full API Response:", response);  // Log the full response
    console.log("API Response Data:", response);  // Log the data (no need for `data` if it's an array)

    if (response && response.length > 0) {
      yield put(getparticipantpaymentSuccess(response));  // Pass the array directly if that's the data
    } else {
      throw new Error("No data returned");
    }
  } catch (error) {
    console.error("Error fetching Participant Payment:", error);
    yield put(getparticipantpaymentFail(error));  // Handle error
  }
}
function* fetchParticipantSchemelist(action) {
  try {
    console.log("Saga Payload (ID):", action.payload);

    // Call the API
    const response = yield call(getParticipantSchemelist, action.payload);
    console.log("API Response in Saga:", response);

    // Extract schemes from response.data
    const data = response.data?.schemes || []; // Adjusted to access `schemes` array in response.data

    if (data.length > 0) {
      console.log("Dispatching Success Action with Data:", data);
      yield put(getParticipantSchemelistSuccess(data)); // Dispatch success with valid data
    } else {
      console.warn("Empty schemes array in API response");
      yield put(getParticipantSchemelistSuccess([])); // Handle empty response gracefully
    }
  } catch (error) {
    console.error("Error in Saga:", error);
    yield put(getParticipantSchemelistFail(error));
  }
}








function* PaymentSaga() {
  yield takeEvery(ADD_NEW_Payment, onAddNewPayment);
  yield takeEvery(GET_PARTICIPANT_PAYMENT, fetchParticipantPayment);
  yield takeEvery(GET_PARTICIPANT_SCHEME_LIST, fetchParticipantSchemelist);
}

export default PaymentSaga;
