import { takeEvery, put, call } from "redux-saga/effects"

//Account Redux states
import { REGISTER_USER } from "./actionTypes"
import { registerUserSuccessful, registerUserFailed } from "./actions"


//Include Both Helper File with needed methods
import {
  postRegister,
} from "../../../helpers/django_api_helper"

const API_URL = "http://127.0.0.1:8000/api"

// Is user register successfull then direct plot user in redux.
function* registerUser({ payload: { user } }) {
  try {
    const response = yield call(postRegister, API_URL + "/account/register/", user)
    console.log(response)
    yield put(registerUserSuccessful(response))
  } catch (error) {
    console.log("Error: ", error)
    yield put(registerUserFailed(error))
  }
}

function* accountSaga() {
  yield takeEvery(REGISTER_USER, registerUser)
}

export default accountSaga
