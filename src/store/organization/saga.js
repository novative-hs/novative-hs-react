import { takeEvery, put, call } from "redux-saga/effects";

//Account Redux states
import { REGISTER_ORGANIZATION } from "./actionTypes";
import { registerOrganizationSuccessful, registerOrganizationFailed } from "./actions";

//Include Both Helper File with needed methods
import { organizationRegister } from "../../helpers/django_api_helper";

// Is user register successfull then direct plot user in redux.
function* registerOrganization({ payload: { user } }) {
  try {
    const response = yield call(organizationRegister, user);
    yield put(registerOrganizationSuccessful(response));

    if (response.error) {
      yield put(registerOrganizationFailed(response));
    } else if (response.status === 400) {
      yield put(registerOrganizationFailed(response.message));
    }
  } catch (error) {
    yield put(registerOrganizationFailed(error));
  }
}

function* organizationaccountSaga() {
  yield takeEvery(REGISTER_ORGANIZATION, registerOrganization);
}

export default organizationaccountSaga;
