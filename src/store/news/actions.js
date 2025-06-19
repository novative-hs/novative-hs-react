import {
  GET_NEWS,
  GET_NEWS_SUCCESS,
  GET_NEWS_FAIL,
  ADD_NEWS,
  ADD_NEWS_SUCCESS,
  ADD_NEWS_FAIL,
  GET_COMMENTS,
  GET_COMMENTS_SUCCESS,
  GET_COMMENTS_FAIL,
  ADD_COMMENTS,
  ADD_COMMENTS_SUCCESS,
  ADD_COMMENTS_FAIL,
  
} from "./actionTypes";

export const getNews = (id) => ({
    type: GET_NEWS,
    payload: id,
  });
  
  export const getNewsSuccess = news => {
    // console.log("News response in success action:", news); 
    return {
      type: GET_NEWS_SUCCESS,
      payload: news,
    };
  };
  
  export const getNewsFail = (error) => {
    // console.log("Error response in fail action:", error); 
    return {
      type: GET_NEWS_FAIL,
      payload: error,
    };
  };

export const addNews = news => ({
  type: ADD_NEWS,
  payload: news,
});

export const addNewsSuccess = news => ({
  type: ADD_NEWS_SUCCESS,
  payload: news,
});

export const addNewsFail = error => ({
  type: ADD_NEWS_FAIL,
  payload: error,
});

export const getComments = (id) => ({
    type: GET_COMMENTS,
    payload: id,
  });
  
  export const getCommentsSuccess = news => {
    // console.log("News response in success action:", news); 
    return {
      type: GET_COMMENTS_SUCCESS,
      payload: news,
    };
  };
  
  export const getCommentsFail = (error) => {
    // console.log("Error response in fail action:", error); 
    return {
      type: GET_COMMENTS_FAIL,
      payload: error,
    };
  };

  export const addComments = news => ({
  type: ADD_COMMENTS,
  payload: news,
});

export const addCommentsSuccess = news => ({
  type: ADD_COMMENTS_SUCCESS,
  payload: news,
});

export const addCommentsFail = error => ({
  type: ADD_COMMENTS_FAIL,
  payload: error,
});
