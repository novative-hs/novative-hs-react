import { takeEvery, put, call } from "redux-saga/effects";

// Login Redux States
import { FORGET_PASSWORD } from "./actionTypes";
import { userForgetPasswordSuccess, userForgetPasswordError } from "./actions";

//Include Both Helper File with needed methods
import { postForgetPwd } from "../../../helpers/django_api_helper";

//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* forgetUser({ payload: { user } }) {
  try {
    const response = yield call(postForgetPwd, { email: user.email });
    if (response) {
      yield put(
        userForgetPasswordSuccess(
          "Reset link is sent to your mailbox, check there first. If not found, please check in the spam."
        )
      );
    }
  } catch (error) {
    yield put(userForgetPasswordError(error));
  }
}

function* forgetPasswordSaga() {
  yield takeEvery(FORGET_PASSWORD, forgetUser);
}

export default forgetPasswordSaga;
