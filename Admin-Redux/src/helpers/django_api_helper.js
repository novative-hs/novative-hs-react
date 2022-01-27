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
export const postRegister = user => {
  return axios
    .post(url.POST_REGISTER, user)
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
export const postPatientInformation = (id, patient) => {
  let formData = new FormData();
  formData.append("name", patient.name);
  formData.append("cnic", patient.cnic);
  formData.append("email", patient.email);
  formData.append("phone", patient.phone);
  formData.append("address", patient.address);
  formData.append("city", patient.city);
  formData.append("district", patient.district);
  formData.append("is_corporate_user", patient.is_corporate_user);
  formData.append("corporate_unique_id", patient.corporate_unique_id);

  return axios
    .post(`${url.POST_PATIENT_INFORMATION}/${id}`, formData, {
      headers: headers,
    })
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
export const postLabInformation = (id, lab) => {
  let formData = new FormData();
  formData.append("name", lab.name);
  formData.append("logo", lab.logo);
  formData.append("owner_name", lab.owner_name);
  formData.append("registration_no", lab.registration_no);
  formData.append("email", lab.email);
  formData.append("phone", lab.phone);
  formData.append("landline", lab.landline);
  formData.append("address", lab.address);
  formData.append("city", lab.city);
  formData.append("district", lab.district);
  formData.append("complaint_handling_email", lab.complaint_handling_email);
  formData.append("complaint_handling_phone", lab.complaint_handling_phone);
  formData.append(
    "accept_credit_card_for_payment",
    lab.accept_credit_card_for_payment
  );

  return axios
    .post(`${url.POST_LAB_INFORMATION}/${id}`, formData, { headers: headers })
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
export const postCorporateInformation = (id, corporate) => {
  let formData = new FormData();
  formData.append("name", corporate.name);
  formData.append("logo", corporate.logo);
  formData.append("owner_name", corporate.owner_name);
  formData.append("email", corporate.email);
  formData.append("phone", corporate.phone);
  formData.append("landline", corporate.landline);
  formData.append("address", corporate.address);
  formData.append("city", corporate.city);
  formData.append("district", corporate.district);

  return axios
    .post(`${url.POST_CORPORATE_INFORMATION}/${id}`, formData, {
      headers: headers,
    })
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
export const postLogin = user => {
  let formData = new FormData();
  formData.append("username", user.username);
  formData.append("password", user.password);

  return axios.post(url.POST_LOGIN, formData, { headers: authorizedHeaders });
};

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
  get(`${url.GET_OFFERED_TESTS}/${id}`, {
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

  return axios.post(`${url.ADD_NEW_OFFERED_TEST}/${id}`, formData, {
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

  return axios.put(`${url.UPDATE_OFFERED_TEST}/${offeredTest.id}`, formData, {
    headers: authorizedHeaders,
  });
};

export const deleteOfferedTest = offeredTest =>
  del(`${url.DELETE_OFFERED_TEST}/${offeredTest.id}`, {
    headers: authorizedHeaders,
  });

// ------------- Sample Collector Requests START -------------
export const getSampleCollectors = id =>
  get(`${url.GET_SAMPLE_COLLECTORS}/${id}`, {
    headers: authorizedHeaders,
  });

export const addNewSampleCollector = (sampleCollector, id) => {
  let formData = new FormData();
  formData.append("name", sampleCollector.name);
  formData.append("cnic", sampleCollector.cnic);
  formData.append("phone", sampleCollector.phone);
  formData.append("photo", sampleCollector.photo);

  return axios.post(`${url.ADD_NEW_SAMPLE_COLLECTOR}/${id}`, formData, {
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

  return axios.put(
    `${url.UPDATE_SAMPLE_COLLECTOR}/${sampleCollector.id}`,
    formData,
    {
      headers: authorizedHeaders,
    }
  );
};

export const deleteSampleCollector = sampleCollector =>
  del(`${url.DELETE_SAMPLE_COLLECTOR}/${sampleCollector.id}`, {
    headers: authorizedHeaders,
  });

// ------------- Test Certificate Requests START -------------
export const getTestCertificates = id =>
  get(`${url.GET_TEST_CERTIFICATES}/${id}`, {
    headers: authorizedHeaders,
  });

export const addNewTestCertificate = (testCertificate, id) => {
  let formData = new FormData();
  formData.append("name", testCertificate.name);
  formData.append("photo", testCertificate.photo);

  return axios.post(`${url.ADD_NEW_TEST_CERTIFICATE}/${id}`, formData, {
    headers: authorizedHeaders,
  });
};

export const updateTestCertificate = testCertificate => {
  let formData = new FormData();
  formData.append("id", testCertificate.id);
  formData.append("name", testCertificate.name);
  formData.append("photo", testCertificate.photo);

  return axios.put(
    `${url.UPDATE_TEST_CERTIFICATE}/${testCertificate.id}`,
    formData,
    {
      headers: authorizedHeaders,
    }
  );
};

export const deleteTestCertificate = testCertificate =>
  del(`${url.DELETE_TEST_CERTIFICATE}/${testCertificate.id}`, {
    headers: authorizedHeaders,
  });
