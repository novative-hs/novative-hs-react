import {
  GET_FEEDBACKS,
  GET_FEEDBACKS_FAIL,
  GET_FEEDBACKS_SUCCESS,
} from "./actionTypes";

export const getFeedbacks = id => ({
  type: GET_FEEDBACKS,
  payload: id,
});

export const getFeedbacksSuccess = feedbacks => ({
  type: GET_FEEDBACKS_SUCCESS,
  payload: feedbacks,
});

export const getFeedbacksFail = error => ({
  type: GET_FEEDBACKS_FAIL,
  payload: error,
});