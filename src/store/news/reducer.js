

import {
  GET_NEWS_SUCCESS,
  GET_NEWS_FAIL,
  ADD_NEWS_SUCCESS,
  ADD_NEWS_FAIL,
  GET_COMMENTS_SUCCESS,
  GET_COMMENTS_FAIL,
  ADD_COMMENTS_SUCCESS,
  ADD_COMMENTS_FAIL,

} from "./actionTypes";

const INIT_STATE = {
  news: [],
  comments: [],  
  error: {}, 
};

const news = (state = INIT_STATE, action) => {
  switch (action.type) {
case GET_NEWS_SUCCESS:
  console.log("Data received in success action:", action.payload); // Log the action.payload
  return {
    ...state,
    news: action.payload,
  };

case GET_NEWS_FAIL:
  return {
    ...state,
    error: action.payload,
  };

  case ADD_NEWS_SUCCESS:
    return {
      ...state,
      news: [...state.news, action.payload.data],
    };

  case ADD_NEWS_FAIL:
    return {
      ...state,
      error: action.payload,
    };
 case GET_COMMENTS_SUCCESS:
  console.log("Data received in success action:", action.payload); // Log the action.payload
  return {
    ...state,
    news: action.payload,
  };

case GET_COMMENTS_FAIL:
  return {
    ...state,
    error: action.payload,
  };

case ADD_COMMENTS_SUCCESS:
    return {
      ...state,
      news: [...state.news, action.payload.data],
    };

  case ADD_COMMENTS_FAIL:
    return {
      ...state,
      error: action.payload,
    };
    default:
      return state;
  }
};

export default news;

