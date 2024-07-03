import {
  GET_NEWS,
  GET_NEWS_SUCCESS,
  GET_NEWS_FAIL,
  ADD_NEWS,
  ADD_NEWS_SUCCESS,
  ADD_NEWS_FAIL
} from "./actionTypes";

//////////INSTRUMENT
export const getNews = () => ({
  type: GET_NEWS,
  payload: {},
});

export const getNewsSuccess = news => {
  console.log("News response in success action:", news); 
  return {
    type: GET_NEWS_SUCCESS,
    payload: news,
  };
};

export const getNewsFail = (error) => {
  console.log("Error response in fail action:", error); 
  return {
    type: GET_NEWS_FAIL,
    payload: error,
  };
};
export const addNews = (news) => ({
  type: ADD_NEWS,
  payload: news,
});

export const addNewsSuccess = news => {
  console.log("News response in success action:", news); 
  return {
    type: ADD_NEWS_SUCCESS,
    payload: news,
  };
};

export const addNewsFail = (error) => {
  console.log("Error response in fail action:", error); 
  return {
    type: ADD_NEWS_FAIL,
    payload: error,
  };
};