
import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_HOME_DATA,
} from "./actionTypes";

import { gethomedataSuccess, gethomedataFail
} from "./actions";

//Include Both Helper File with needed methods
import { gethomedata} from "../../helpers/django_api_helper";

function* fetchHomeData(action) {
  try {
    const response = yield call(gethomedata, action.payload);
    console.log("Saga Response:", response.data);
    yield put(gethomedataSuccess(response.data));
  } catch (error) {
    console.error("Saga Error:", error);
    yield put(gethomedataFail(error));
  }
}

function* HomeSaga() {
  yield takeEvery(GET_HOME_DATA, fetchHomeData);
}

export default HomeSaga;
