import { takeEvery, put, call, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER } from "./actionTypes";
import { loginSuccess, logoutUserSuccess, apiError } from "./actions";

//Include Both Helper File with needed methods
import { postLogin } from "../../../helpers/django_api_helper";

function* loginUser({ payload: { user, history } }) {
  try {
    const response = yield call(postLogin, user); // user has username, password, guest_id

    if (response.data && response.data.data) {
      const data = response.data.data;

      // Save to local storage
      localStorage.setItem("authUser", JSON.stringify(data));

      // Dispatch success
      yield put(loginSuccess(data));

      // ✅ Redirect based on account_type
      // switch (data.account_type) {
      //   case "labowner":
      //     history.push("/dashboard-lab");
      //     break;
      //   case "nhs":
      //     history.push("/dashboard-nhs");
      //     break;
      //   case "b2bclient":
      //     history.push("/dashboard-b2bclient");
      //     break;
      //   default:
      //     history.push("/dashboard");
      // }
    } else {
      const message = response.data.message || "Login failed";
      yield put(apiError(message));
    }
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      "Sorry! You have provided invalid credentials.";
    yield put(apiError(message));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");

    // if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
    //   const response = yield call(fireBaseBackend.logout);
    //   yield put(logoutUserSuccess(response));
    // }
    history.push("/login");
  } catch (error) {
    yield put(apiError(error));
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser);
  yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
