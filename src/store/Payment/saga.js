import { call, put, takeEvery } from "redux-saga/effects";
import {
  ADD_NEW_Payment,
  GET_PARTICIPANT_PAYMENT,
  GET_PARTICIPANT_SCHEME_LIST,
  UPDATE_NEW_PAYMENT,
  DELETE_PAYMENT,
  CONFIRM_PAYMENT,
} from "./actionTypes";
import {
  addNewPaymentSuccess,
  addNewPaymentFail,
  getparticipantpaymentSuccess,
  getparticipantpaymentFail,
  getParticipantSchemelistSuccess,
  getParticipantSchemelistFail,
  updatePayment,
  updatePaymentSuccess,
  updatePaymentFail,
  deletePaymentSuccess,
  deletePaymentFail,
  confirmpaymentSuccess,
  confirmpaymentFail,
} from "./actions";
import {
  addNewPayment,
  getParticipantPayment,
  getParticipantSchemelist,
  updateNewPayment,
  deletePayment,
  confirmpayment,
} from "../../helpers/django_api_helper";

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
    console.log("Full API Response:", response);

    // Access the 'payments' array inside the response
    const payments = response.payments || [];

    if (payments.length > 0) {
      yield put(getparticipantpaymentSuccess(payments));
    } else {
      throw new Error("No data returned");
    }
  } catch (error) {
    console.error("Error fetching Participant Payment:", error);
    yield put(getparticipantpaymentFail(error));
  }
}
function* onUpdatePayment({ payload: payment }) {
  try {
    console.log("🧾 Saga received payment payload:", payment); // ✅ Check here

    const response = yield call(updateNewPayment, payment);

    yield put(updatePaymentSuccess({ ...response, id: payment.id }));
  } catch (error) {
    console.error("❌ Error in onUpdatePayment saga:", error);
    yield put(updatePaymentFail(error));
  }
}

function* fetchParticipantSchemelist(action) {
  try {
    const response = yield call(getParticipantSchemelist, action.payload);
    console.log("API Response in Saga:", response);

    const data = response.data || {};
    const schemes = data.schemes || [];

    // Extract all relevant fields
    const participant_name = data.participant_name || "Unknown";
    const membership_status = data.membership_status || "Unknown";
    const price = data.price || "";
    const discount = data.discount || "";
    const paid_amount = data.paid_amount || "";
    const pay_date = data.pay_date || "";
    const payment_mode = data.payment_mode || "";
    const received_by = data.received_by || "";
    const original_price = data.original_price || "";
    const photo_url = data.photo_url || ""; // <-- add this line

    // Dispatch success with all fields
    yield put(
      getParticipantSchemelistSuccess({
        schemes,
        participant_name,
        membership_status,
        price,
        discount,
        paid_amount,
        original_price,
        pay_date,
        payment_mode,
        received_by,
        photo_url, // <-- add here too
      })
    );
  } catch (error) {
    console.error("Error in Saga:", error);
    yield put(getParticipantSchemelistFail(error));
  }
}

function* onDeletePayment({ payload }) {
  try {
    const response = yield call(deletePayment, payload);
    yield put(deletePaymentSuccess(payload.id));
  } catch (error) {
    console.error("❌ Error deleting payment:", error);
    yield put(deletePaymentFail(error));
  }
}

function* confirmPaymentSaga(action) {
  try {
    const response = yield call(confirmpayment, action.payload);
    console.log("✅ Full API Response:", response);

    if (response && response.message === "Payment confirmed") {
      yield put(confirmpaymentSuccess(response)); // send success action
    } else {
      throw new Error("Unexpected response");
    }
  } catch (error) {
    console.error("❌ Error confirming payment:", error);
    yield put(confirmpaymentFail(error));
  }
}

function* PaymentSaga() {
  yield takeEvery(ADD_NEW_Payment, onAddNewPayment);
  yield takeEvery(GET_PARTICIPANT_PAYMENT, fetchParticipantPayment);
  yield takeEvery(GET_PARTICIPANT_SCHEME_LIST, fetchParticipantSchemelist);
  yield takeEvery(UPDATE_NEW_PAYMENT, onUpdatePayment);
  yield takeEvery(DELETE_PAYMENT, onDeletePayment); // ✅ Add this line
  yield takeEvery(CONFIRM_PAYMENT, confirmPaymentSaga);
}
export default PaymentSaga;
