import { takeEvery, put, call } from "redux-saga/effects";

//Account Redux states
import { ADD_CORPORATE_INFORMATION } from "./actionTypes";
import {
  addCorporateInformationSuccessful,
  addCorporateInformationFailed,
} from "./actions";

//Include Both Helper File with needed methods
import { postCorporateInformation } from "../../../helpers/django_api_helper";

// Is user register successfull then direct plot user in redux.
function* addCorporateInformation({ payload: { corporate, id } }) {
  try {
    const response = yield call(postCorporateInformation, id, corporate);

    console.log("Response: ", response);

    if (response.status == 400) {
      yield put(addCorporateInformationFailed(response.message));
    } else {
      yield put(addCorporateInformationSuccessful(response));
    }
  } catch (error) {
    yield put(addCorporateInformationFailed(error));
  }
}

function* CorporateInformationSaga() {
  yield takeEvery(ADD_CORPORATE_INFORMATION, addCorporateInformation);
}

export default CorporateInformationSaga;
