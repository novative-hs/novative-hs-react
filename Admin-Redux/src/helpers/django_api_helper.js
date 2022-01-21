import axios from "axios";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

const headers = {
  "Content-Type":
    "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
};

// Post Register Information to create account
export const postRegister = (url, data) => {
  return axios
    .post(url, data)
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 400:
            message = err.response.data;
            break;
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Post Patient Information
export const postPatientInformation = (url, data) => {
  let formData = new FormData();
  formData.append("name", data.name);
  formData.append("cnic", data.cnic);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("address", data.address);
  formData.append("city", data.city);
  formData.append("district", data.district);
  formData.append("is_corporate_user", data.is_corporate_user);
  formData.append("corporate_unique_id", data.corporate_unique_id);

  return axios
    .post(url, formData, { headers: headers })
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 400:
            message = err.response.data;
            break;
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Post Lab Information
export const postLabInformation = (url, data) => {
  let formData = new FormData();
  formData.append("name", data.name);
  formData.append("logo", data.logo);
  formData.append("owner_name", data.owner_name);
  formData.append("registration_no", data.registration_no);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("landline", data.landline);
  formData.append("address", data.address);
  formData.append("city", data.city);
  formData.append("district", data.district);
  formData.append("complaint_handling_email", data.complaint_handling_email);
  formData.append("complaint_handling_phone", data.complaint_handling_phone);
  formData.append(
    "accept_credit_card_for_payment",
    data.accept_credit_card_for_payment
  );

  return axios
    .post(url, formData, { headers: headers })
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 400:
            message = err.response.data;
            break;
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Post Lab Information
export const postCorporateInformation = (url, data) => {
  let formData = new FormData();
  formData.append("name", data.name);
  formData.append("logo", data.logo);
  formData.append("owner_name", data.owner_name);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("landline", data.landline);
  formData.append("address", data.address);
  formData.append("city", data.city);
  formData.append("district", data.district);

  return axios
    .post(url, formData, { headers: headers })
    .then(response => {
      if (response.status >= 200 || response.status <= 299)
        return response.data;
      throw response.data;
    })
    .catch(err => {
      let message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 400:
            message = err.response.data;
            break;
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
export const postLogin = data => post(url.POST_LOGIN, data);

// Offered Test Requests
export const getOfferedTests = id => get(url.GET_OFFERED_TESTS + id);
export const addNewOfferedTest = offeredTest =>
  post(url.ADD_NEW_OFFERED_TEST, offeredTest);
export const updateOfferedTest = offeredTest =>
  put(url.UPDATE_OFFERED_TEST, offeredTest);
export const deleteOfferedTest = offeredTest =>
  del(url.DELETE_OFFERED_TEST, { headers: { offeredTest } });
export const getOfferedTestProfile = () => get(url.GET_OFFERED_TEST_PROFILE);
