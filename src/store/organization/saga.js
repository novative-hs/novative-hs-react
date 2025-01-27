import { takeEvery, put, call } from "redux-saga/effects";

//Account Redux states
import { REGISTER_ORGANIZATION, GET_ORGANIZATION_LIST ,  UPDATE_ORGANIZATION_LIST, DELETE_ORGANIZATION_LIST, } from "./actionTypes";
import { registerOrganizationSuccessful, registerOrganizationFailed ,getOrganizationlistSuccess, getOrganizationlistFail,updateOrganizationListSuccess, updateOrganizationListFail,
  //  deleteOrganizationListSuccess, deleteOrganizationListFail,
   } from "./actions";

//Include Both Helper File with needed methods
import { organizationRegister , getOrganizationlist,  updateOrganizationList,
  //  deleteOrganizationList 
  } from "../../helpers/django_api_helper";

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
function* fetchOrganizationList(action) {
  try {
    const response = yield call(getOrganizationlist, action.payload);
  
    yield put(getOrganizationlistSuccess(response.data));
  } catch (error) {
    yield put(getOrganizationlistFail(error));
  }
}

function* onUpdateOrganization({ payload: organization }) {
  try {
    const response = yield call(updateOrganizationList, organization);
    yield put(updateOrganizationListSuccess(response));
  } catch (error) {
    yield put(updateOrganizationListFail (error));
  }
}

// function* ondeleteOrganization({ payload: organization }) {
//     try {
//       const response = yield call(deleteOrganizationList, organization);
//       yield put(deleteOrganizationListSuccess(response));
//     } catch (error) {
//       yield put(deleteOrganizationListFail(error));
//     }
//   }
function* organizationaccountSaga() {
  yield takeEvery(GET_ORGANIZATION_LIST, fetchOrganizationList);
  yield takeEvery(REGISTER_ORGANIZATION, registerOrganization);
  yield takeEvery(UPDATE_ORGANIZATION_LIST, onUpdateOrganization);
  // yield takeEvery(DELETE_ORGANIZATION_LIST, ondeleteOrganization);
}

export default organizationaccountSaga;
