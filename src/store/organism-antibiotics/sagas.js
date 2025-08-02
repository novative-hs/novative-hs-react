import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_ORGANISM_LIST, ADD_ORGANISM_LIST, UPDATE_ORGANISM_LIST, DELETE_ORGANISM_LIST} from "./actionTypes";

import { getOrganismlistSuccess, getOrganismlistFail, addOrganismlistSuccess, addOrganismlistFail, updateorganismSuccess, updateorganismFail, deleteorganismSuccess, deleteorganismFail} from "./actions";

//Include Both Helper File with needed methods
import { getOrganismlist, addOrganismlist, updateorganism , deleteorganism} from "../../helpers/django_api_helper";

// ADD EQUIPMENT TYPE FILE

function* fetchOrganismList(object) {
  try {
    const response = yield call(getOrganismlist, object.payload);
    console.log("Response from getOrganismlist:", response); // Log the response object
    yield put(getOrganismlistSuccess(response.data));
  } catch (error) {
    yield put(getOrganismlistFail(error));
  }
}
function* AddOrganismlist(action) {
  try {
    console.log("Received payload in saga:", action.payload); // this should now show { name, code, ... }
    const response = yield call(addOrganismlist, action.payload); // API call
    yield put(addOrganismlistSuccess(response.data));
  } catch (error) {
    console.log("Saga error:", error);
    yield put(addOrganismlistFail(error));
  }
}
function* UpdateOrganismlist(action) {
  try {
    console.log("Received payload in saga:", action.payload); // this should now show { name, code, ... }
    const response = yield call(updateorganism, action.payload); // API call
    yield put(updateorganismSuccess(response.data));
  } catch (error) {
    console.log("Saga error:", error);
    yield put(updateorganismFail(error));
  }
}

function* DeleteOrganism(action) {
  try {
    console.log("Received payload in saga:", action.payload); // this should now show { name, code, ... }
    const response = yield call(deleteorganism, action.payload); // API call
    yield put(deleteorganismSuccess(response.data));
  } catch (error) {
    console.log("Saga error:", error);
    yield put(deleteorganismFail(error));
  }
}


function* OrganismListSaga(object) {
 
  yield takeEvery(GET_ORGANISM_LIST, fetchOrganismList);
  yield takeEvery(ADD_ORGANISM_LIST, AddOrganismlist);
  yield takeEvery(UPDATE_ORGANISM_LIST, UpdateOrganismlist);
  yield takeEvery(DELETE_ORGANISM_LIST, DeleteOrganism);
}

export default OrganismListSaga;