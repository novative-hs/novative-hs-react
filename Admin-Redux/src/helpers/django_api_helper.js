import axios from "axios"
import { del, get, post, put } from "./api_helper"
import * as url from "./url_helper"


// Original Register Method
const postRegister = (url, data) => {
  return axios
    .post(url, data)
    .then(response => {
      if (response.status >= 200 || response.status <= 299) {
        return response
      }
      throw response
    })
    .catch(err => {
      throw err.response.data
    })
}


export {
  postRegister,
}