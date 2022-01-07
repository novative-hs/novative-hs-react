import axios from "axios"
import { del, get, post, put } from "./api_helper"
import * as url from "./url_helper"


// Original Register Method
export const postRegister = (url, data) => {
  return axios
    .post(url, data)
    .then(response => {
      if (response.status >= 200 || response.status <= 299) return response.data
      throw response.data
    })
    .catch(err => {
      let message
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 400:
            message = err.response.data
            break
          case 404:
            message = "Sorry! the page you are looking for could not be found"
            break
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team"
            break
          case 401:
            message = "Invalid credentials"
            break
          default:
            message = err[1]
            break
        }
      }
      throw message
    })
}


// postSocialLogin
export const postPatientInformation = (url, data) => { 
  return axios
  .post(url, data)
  .then(response => {
    if (response.status >= 200 || response.status <= 299) return response.data
    throw response.data
  })
  .catch(err => {
    let message
    if (err.response && err.response.status) {
      switch (err.response.status) {
        case 400:
          message = err.response.data
          break
        case 404:
          message = "Sorry! the page you are looking for could not be found"
          break
        case 500:
          message =
            "Sorry! something went wrong, please contact our support team"
          break
        case 401:
          message = "Invalid credentials"
          break
        default:
          message = err[1]
          break
      }
    }
    throw message
  })
}