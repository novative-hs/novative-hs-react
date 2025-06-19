

import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_NEWS,
  ADD_NEWS,
  GET_COMMENTS,
  ADD_COMMENTS,
} from "./actionTypes";

import { getNewsSuccess,getNewsFail,addNewsSuccess,addNewsFail, getCommentsSuccess,getCommentsFail, addCommentsSuccess, addCommentsFail
} from "./actions";

//Include Both Helper File with needed methods
import { getNews,addNews, getComments, addComments} from "../../helpers/django_api_helper";

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

function* fetchComments(object) {
  try {
    const response = yield call(getComments, object.payload);
    console.log("Response :", response); 
    yield put(getCommentsSuccess(response.data));
  } catch (error) {
    yield put(getCommentsFail(error));
  }
}
function* onAddComments(action) {
  const { payload, resolve, reject } = action;

  try {
    const response = yield call(addComments, payload); // your API call
    yield put(addCommentsSuccess(response.data));

    if (resolve) resolve(response.data); // ✅ notify React component
  } catch (error) {
    yield put(addCommentsFail(error));

    if (reject) reject(error); // ✅ notify React component
  }
}



function* NewsSaga() {
  yield takeEvery(GET_NEWS, fetchNews);
  yield takeEvery(ADD_NEWS, onAddNews);
  yield takeEvery(ADD_COMMENTS, onAddComments);
  yield takeEvery(GET_COMMENTS, fetchComments);
}

export default NewsSaga;
