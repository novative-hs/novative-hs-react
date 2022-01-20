import { takeEvery, put, call, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes";
import { loginSuccess, logoutUserSuccess, apiError } from "./actions";

//Include Both Helper File with needed methods
import { postLogin } from "../../../helpers/django_api_helper";

const API_URL = "http://127.0.0.1:8000/api";

function* loginUser({ payload: { user, history } }) {
  console.log("User: ", user);
  try {
    const response = yield call(postLogin, {
      username: user.username,
      password: user.password,
    });

    console.log("Account type: ", response.data.account_type);
    console.log("Token: ", response.data.token);

    localStorage.setItem("authUser", JSON.stringify(response));
    yield put(loginSuccess(response));

    if (response.data.account_type == "patient") {
      history.push("/dashboard-patient");
    } else if (response.data.account_type == "labowner") {
      history.push("/dashboard-lab");
    } else if (response.data.account_type == "corporate") {
      history.push("/dashboard-corporate");
    } else {
      history.push("/dashboard");
    }
  } catch (error) {
    yield put(apiError(error));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUser");

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout);
      yield put(logoutUserSuccess(response));
    }
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
