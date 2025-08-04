import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_ORGANISM_LIST, ADD_ORGANISM_LIST, UPDATE_ORGANISM_LIST, DELETE_ORGANISM_LIST, GET_ANTIBIOTIC_LIST, ADD_ANTIBIOTIC_LIST, UPDATE_ANTIBIOTIC_LIST, DELETE_ANTIBIOTIC_LIST} from "./actionTypes";

import { getOrganismlistSuccess, getOrganismlistFail, addOrganismlistSuccess, addOrganismlistFail, updateorganismSuccess, updateorganismFail, deleteorganismSuccess, deleteorganismFail, getAntibioticlistSuccess, getAntibioticlistFail, addAntibioticlistSuccess, addAntibioticlistFail, updateantibioticSuccess, updateantibioticFail, deleteantibioticSuccess, deleteantibioticFail} from "./actions";

//Include Both Helper File with needed methods
import { getOrganismlist, addOrganismlist, updateorganism , deleteorganism, getAntibioticlist, addAntibioticlist, updateantibiotic , deleteantibiotic} from "../../helpers/django_api_helper";

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

function* fetchAntibioticList(object) {
  try {
    const response = yield call(getAntibioticlist, object.payload);
    console.log("Response from getOrganismlist:", response); // Log the response object
    yield put(getAntibioticlistSuccess(response.data));
  } catch (error) {
    yield put(getAntibioticlistFail(error));
  }
}
function* AddAntibioticlist(action) {
  try {
    console.log("Received payload in saga:", action.payload); // this should now show { name, code, ... }
    const response = yield call(addAntibioticlist, action.payload); // API call
    yield put(addAntibioticlistSuccess(response.data));
  } catch (error) {
    console.log("Saga error:", error);
    yield put(addAntibioticlistFail(error));
  }
}
function* UpdateAntibiotic(action) {
  try {
    console.log("Received payload in saga:", action.payload); // this should now show { name, code, ... }
    const response = yield call(updateantibiotic, action.payload); // API call
    yield put(updateantibioticSuccess(response.data));
  } catch (error) {
    console.log("Saga error:", error);
    yield put(updateantibioticFail(error));
  }
}

function* DeleteAntibiotic(action) {
  try {
    console.log("Received payload in saga:", action.payload); // this should now show { name, code, ... }
    const response = yield call(deleteantibiotic, action.payload); // API call
    yield put(deleteantibioticSuccess(response.data));
  } catch (error) {
    console.log("Saga error:", error);
    yield put(deleteantibioticFail(error));
  }
}



function* OrganismListSaga(object) {
 
  yield takeEvery(GET_ORGANISM_LIST, fetchOrganismList);
  yield takeEvery(ADD_ORGANISM_LIST, AddOrganismlist);
  yield takeEvery(UPDATE_ORGANISM_LIST, UpdateOrganismlist);
  yield takeEvery(DELETE_ORGANISM_LIST, DeleteOrganism);
  yield takeEvery(GET_ANTIBIOTIC_LIST, fetchAntibioticList);
  yield takeEvery(ADD_ANTIBIOTIC_LIST, AddAntibioticlist);
  yield takeEvery(UPDATE_ANTIBIOTIC_LIST, UpdateAntibiotic);
  yield takeEvery(DELETE_ANTIBIOTIC_LIST, DeleteAntibiotic);
}

export default OrganismListSaga;