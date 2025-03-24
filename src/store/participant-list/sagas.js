import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_PARTICIPANT_LIST, GET_PARTICIPANTROUND_LIST, GET_ROUNDSLABS_LIST,ADD_NEW_ROUNDSLABS,UPDATE_ROUNDSLABS} from "./actionTypes";

import { getParticipantListSuccess, getParticipantListFail, getParticipantRoundListSuccess, getParticipantRoundListFail, getRoundLablistSuccess,getRoundLablistFail,addNewRoundLablistSuccess,addNewRoundLablistFail,updateRoundLablistSuccess,updateRoundLablistFail } from "./actions";

//Include Both Helper File with needed methods
import { getParticipantList, getParticipantRoundList, getRoundLablist,addNewRoundLablist,updateRoundLablist} from "../../helpers/django_api_helper";


/// Rounds Participants
function* fetchRoundLabsList(object) {
  try {
    const response = yield call(getRoundLablist, object.payload);
    console.log("API Response:", response.data); 
    yield put(getRoundLablistSuccess(response.data));
  } catch (error) {
    yield put(getRoundLablistFail(error));
  }
}
function* onAddNewRoundLabs(object) {
  try {
    const response = yield call(
      addNewRoundLablist,
      object.payload.createRoundLab,
      object.payload.id
    );
    yield put(addNewRoundLablistSuccess(response));
  } catch (error) {
    yield put(addNewRoundLablistFail(error));
  }
}
function* onUpdateRoundLabs({ payload: roundslab }) {
  try {
    const response = yield call(updateRoundLablist, roundslab);
    yield put(updateRoundLablistSuccess(response));
  } catch (error) {
    yield put(updateRoundLablistFail (error));
  }
}

function* fetchParticipantList(object) {
  try {
    const response = yield call(getParticipantList, object.payload);
    yield put(getParticipantListSuccess(response.data));
  } catch (error) {
    yield put(getParticipantListFail(error));
  }
}
function* fetchParticipantRoundList(action) {
  console.log("Saga Triggered: fetchParticipantRoundList");
  console.log("Payload received in saga:", action.payload);

  try {
    // Call the API
    const response = yield call(getParticipantRoundList, action.payload);
    console.log("Full API Response Object:", response);

    // Extract participant list and round details
    const participantList = response?.data || []; // Correctly map to `data`
    const roundDetails = response?.round_details || {}; // Correctly map to `round_details`

    // Log extracted data
    console.log("Extracted Participant List:", participantList);
    console.log("Extracted Round Details:", roundDetails);

    // Dispatch success with participant list and round details
    yield put(getParticipantRoundListSuccess({ participantList, roundDetails }));
    console.log("Dispatched GET_PARTICIPANTROUND_LIST_SUCCESS");
  } catch (error) {
    // Log error details
    console.error("Error in fetchParticipantRoundList saga:", error);

    // Dispatch failure action
    yield put(getParticipantRoundListFail(error));
    console.log("Dispatched GET_PARTICIPANTROUND_LIST_FAIL with error:", error);
  }
}

function* participantListSaga() {

  yield takeEvery(GET_ROUNDSLABS_LIST, fetchRoundLabsList);
  yield takeEvery(ADD_NEW_ROUNDSLABS, onAddNewRoundLabs );
  yield takeEvery(UPDATE_ROUNDSLABS, onUpdateRoundLabs);


  yield takeEvery(GET_PARTICIPANT_LIST, fetchParticipantList);
  yield takeEvery(GET_PARTICIPANTROUND_LIST, fetchParticipantRoundList);

}

export default participantListSaga;
