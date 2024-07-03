import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_NEWS,
  ADD_NEWS
} from "./actionTypes";

import { getNewsSuccess,getNewsFail,addNewsSuccess,addNewsFail
} from "./actions";

//Include Both Helper File with needed methods
import { getNews,addNews} from "../../helpers/django_api_helper";

function* fetchNews(object) {
  try {
    const response = yield call(getNews, object.payload);
    console.log("Response :", response); 
    yield put(getNewsSuccess(response.data));
  } catch (error) {
    yield put(getNewsFail(error));
  }
}
function* onAddNews(object) {
  try {
    const response = yield call(addNews, object.payload);
    yield put(addNewsSuccess(response.data));
  } catch (error) {
    yield put(addNewsFail(error));
  }
}


function* NewsSaga() {
  yield takeEvery(GET_NEWS, fetchNews);
  yield takeEvery(ADD_NEWS, onAddNews);
}

export default NewsSaga;
