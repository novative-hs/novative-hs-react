import axios from "axios";
import { del, get, post, put } from "./api_helper";
import * as url from "./url_helper";

const headers = {
  "Content-Type":
    "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
};

const authorizedHeaders = {
  Authorization: "Token b136c8c0bc5b5daa74de8839a6c85b4482be7353",
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

// ------------- Offered Test Requests START -------------
export const getTests = () =>
  get(url.GET_TESTS, {
    headers: authorizedHeaders,
  });

export const getUnits = () =>
  get(url.GET_UNITS, {
    headers: authorizedHeaders,
  });

export const getOfferedTests = id =>
  get(url.GET_OFFERED_TESTS + id, {
    headers: authorizedHeaders,
  });

export const addNewOfferedTest = (offeredTest, id) => {
  let formData = new FormData();
  formData.append("test_id", offeredTest.test_id);
  formData.append("unit_id", offeredTest.unit_id);
  formData.append("reporting_range", offeredTest.reporting_range);
  formData.append("time_required_in_days", offeredTest.time_required_in_days);
  formData.append("price", offeredTest.price);
  formData.append("is_eqa_participation", offeredTest.is_eqa_participation);
  formData.append(
    "is_home_sampling_available",
    offeredTest.is_home_sampling_available
  );

  return axios.post(url.ADD_NEW_OFFERED_TEST + id, formData, {
    headers: authorizedHeaders,
  });
};

export const updateOfferedTest = offeredTest => {
  let formData = new FormData();
  formData.append("id", offeredTest.id);
  formData.append("test_id", offeredTest.test_id);
  formData.append("unit_id", offeredTest.unit_id);
  formData.append("reporting_range", offeredTest.reporting_range);
  formData.append("time_required_in_days", offeredTest.time_required_in_days);
  formData.append("price", offeredTest.price);
  formData.append("is_eqa_participation", offeredTest.is_eqa_participation);
  formData.append(
    "is_home_sampling_available",
    offeredTest.is_home_sampling_available
  );

  return axios.put(url.UPDATE_OFFERED_TEST + offeredTest.id, formData, {
    headers: authorizedHeaders,
  });
};

export const deleteOfferedTest = offeredTest =>
  del(url.DELETE_OFFERED_TEST + offeredTest.id, {
    headers: authorizedHeaders,
  });

// ------------- Sample Collector Requests START -------------
export const getSampleCollectors = id =>
  get(url.GET_SAMPLE_COLLECTORS + id, {
    headers: authorizedHeaders,
  });

export const addNewSampleCollector = (sampleCollector, id) => {
  let formData = new FormData();
  formData.append("name", sampleCollector.name);
  formData.append("cnic", sampleCollector.cnic);
  formData.append("phone", sampleCollector.phone);
  formData.append("photo", sampleCollector.photo);

  return axios.post(url.ADD_NEW_SAMPLE_COLLECTOR + id, formData, {
    headers: authorizedHeaders,
  });
};

export const updateSampleCollector = sampleCollector => {
  let formData = new FormData();
  formData.append("id", sampleCollector.id);
  formData.append("name", sampleCollector.name);
  formData.append("cnic", sampleCollector.cnic);
  formData.append("phone", sampleCollector.phone);
  formData.append("photo", sampleCollector.photo);

  return axios.put(url.UPDATE_SAMPLE_COLLECTOR + sampleCollector.id, formData, {
    headers: authorizedHeaders,
  });
};

export const deleteSampleCollector = sampleCollector =>
  del(url.DELETE_SAMPLE_COLLECTOR + sampleCollector.id, {
    headers: authorizedHeaders,
  });
