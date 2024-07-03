import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_SECTOR_LIST, ADD_NEW_SECTOR , UPDATE_SECTOR} from "./actionTypes";

import { getsectorlistSuccess, getsectorlistFail, addNewSectorSuccess, addNewSectorFail, updateSectorsSuccess, updateSectorsFail } from "./actions";

//Include Both Helper File with needed methods
import { getSectorList, addNewCreateSector, updateSector} from "../../helpers/django_api_helper";

function* fetchSectorList(object) {
  try {
    const response = yield call(getSectorList, object.payload);
    yield put(getsectorlistSuccess(response.data));
  } catch (error) {
    yield put(getsectorlistFail(error));
  }
}
function* onAddNewSector(object) {
  try {
    const response = yield call(
      addNewCreateSector,
      object.payload.createSector,
      object.payload.id
    );
    yield put(addNewSectorSuccess(response));
  } catch (error) {
    yield put(addNewSectorFail(error));
  }
}
function* onUpdateSector({ payload: sector }) {
  try {
    const response = yield call(updateSector, sector);
    yield put(updateSectorsSuccess(response));
  } catch (error) {
    yield put(updateSectorsFail (error));
  }
}


function* SectorListSaga() {
  yield takeEvery(GET_SECTOR_LIST, fetchSectorList);
  yield takeEvery(ADD_NEW_SECTOR, onAddNewSector );
  yield takeEvery(UPDATE_SECTOR, onUpdateSector);
}

export default SectorListSaga;
