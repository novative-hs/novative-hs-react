import { takeEvery, put, call, takeLatest } from "redux-saga/effects";

// Login Redux States
import { LOGIN_USER, LOGOUT_USER } from "./actionTypes";
import { loginSuccess, logoutUserSuccess, apiError } from "./actions";

//Include Both Helper File with needed methods
import { postLogin } from "../../../helpers/django_api_helper";

const authorizedHeaders = {
  Authorization: "Token b136c8c0bc5b5daa74de8839a6c85b4482be7353",
  "Content-Type":
    "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
};

function* loginUser({ payload: { user, history } }) {
  console.log("User: ", user);
  try {
    const response = yield call(postLogin, {
      username: user.username,
      password: user.password,
    });

    const data = response.data.data;

    localStorage.setItem("authUser", JSON.stringify(response));
    yield put(loginSuccess(response));

    if (data.account_type == "patient") {
      history.push("/dashboard-patient/" + data.user_id);
    } else if (data.account_type == "labowner") {
      history.push("/dashboard-lab/" + data.user_id);
    } else if (data.account_type == "corporate") {
      history.push("/dashboard-corporate/" + data.user_id);
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
