import axios from "axios";
import { del, get, post, put } from "./api_helper";
import authHeader from "./django-token-access/auth-token-header";
import * as url from "./url_helper";

function getHeader(token) {
  // If there is some token then return the header with token
  if (token) {
    return {
      Authorization: "Token " + token,
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
    };
  } else {
    return {
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
    };
  }
}

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
      headers: getHeader(authHeader()),
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
  formData.append("type", lab.type);
  formData.append("main_lab_account_id", lab.main_lab_account_id);
  formData.append("financial_settlement", lab.financial_settlement);
  formData.append("logo", lab.logo);
  formData.append("owner_name", lab.owner_name);
  formData.append("registration_no", lab.registration_no);
  formData.append("national_taxation_no", lab.national_taxation_no);
  formData.append("is_iso_certified", lab.is_iso_certified);
  formData.append("iso_certificate", lab.iso_certificate);
  formData.append("lab_experience", lab.lab_experience);
  formData.append("email", lab.email);
  formData.append("phone", lab.phone);
  formData.append("landline", lab.landline);
  formData.append("address", lab.address);
  formData.append("city", lab.city);
  formData.append("district", lab.district);
  formData.append("complaint_handling_email", lab.complaint_handling_email);
  formData.append("complaint_handling_phone", lab.complaint_handling_phone);
  formData.append(
    "is_digital_payment_accepted",
    lab.is_digital_payment_accepted
  );
  formData.append("is_registering_for_first_time", lab.is_registering_for_first_time);
  formData.append("registered_by", lab.registered_by);
  formData.append("marketer_name", lab.marketer_name);
  formData.append("marketer_cnic", lab.marketer_cnic);
  formData.append("marketer_email", lab.marketer_email);
  formData.append("marketer_phone", lab.marketer_phone);
  formData.append("marketer_city", lab.marketer_city);

  return axios
    .post(`${url.POST_LAB_INFORMATION}/${id}`, formData, {
      headers: getHeader(authHeader()),
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
          case 500:
            message =
              "Sorry! something went wrong, please contact our support team";
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
      headers: getHeader(authHeader()),
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

  return axios.post(url.POST_LOGIN, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Get Labs Request -------------
export const getLabs = () =>
  get(url.GET_LABS, {
    headers: getHeader(authHeader()),
  });

// ------------- Offered Test Requests START -------------
export const getTests = () =>
  get(url.GET_TESTS, {
    headers: getHeader(authHeader()),
  });

export const getUnits = () =>
  get(url.GET_UNITS, {
    headers: getHeader(authHeader()),
  });

export const getOfferedTests = id =>
  get(`${url.GET_OFFERED_TESTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewOfferedTest = (offeredTest, id) => {
  let formData = new FormData();
  formData.append("test_id", offeredTest.test_id);
  formData.append("unit_id", offeredTest.unit_id);
  formData.append("duration_required", offeredTest.duration_required);
  formData.append("duration_type", offeredTest.duration_type);
  formData.append("price", offeredTest.price);
  formData.append("is_eqa_participation", offeredTest.is_eqa_participation);
  formData.append(
    "is_home_sampling_available",
    offeredTest.is_home_sampling_available
  );

  return axios.post(`${url.ADD_NEW_OFFERED_TEST}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateOfferedTest = offeredTest => {
  let formData = new FormData();
  formData.append("id", offeredTest.id);
  formData.append("test_id", offeredTest.test_id);
  formData.append("unit_id", offeredTest.unit_id);
  formData.append("duration_required", offeredTest.duration_required);
  formData.append("duration_type", offeredTest.duration_type);
  formData.append("price", offeredTest.price);
  formData.append("is_eqa_participation", offeredTest.is_eqa_participation);
  formData.append(
    "is_home_sampling_available",
    offeredTest.is_home_sampling_available
  );

  return axios.put(`${url.UPDATE_OFFERED_TEST}/${offeredTest.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const deleteOfferedTest = offeredTest =>
  del(`${url.DELETE_OFFERED_TEST}/${offeredTest.id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Home Sample Collector Requests START -------------
export const getSampleCollectors = id =>
  get(`${url.GET_SAMPLE_COLLECTORS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewSampleCollector = (sampleCollector, id) => {
  let formData = new FormData();
  formData.append("name", sampleCollector.name);
  formData.append("gender", sampleCollector.gender);
  formData.append("cnic", sampleCollector.cnic);
  formData.append("phone", sampleCollector.phone);
  formData.append("photo", sampleCollector.photo);

  return axios.post(`${url.ADD_NEW_SAMPLE_COLLECTOR}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateSampleCollector = sampleCollector => {
  let formData = new FormData();
  formData.append("id", sampleCollector.id);
  formData.append("name", sampleCollector.name);
  formData.append("gender", sampleCollector.gender);
  formData.append("cnic", sampleCollector.cnic);
  formData.append("phone", sampleCollector.phone);
  formData.append("photo", sampleCollector.photo);

  return axios.put(
    `${url.UPDATE_SAMPLE_COLLECTOR}/${sampleCollector.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const deleteSampleCollector = sampleCollector =>
  del(`${url.DELETE_SAMPLE_COLLECTOR}/${sampleCollector.id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Test Certificate Requests START -------------
export const getQualityCertificates = id =>
  get(`${url.GET_QUALITY_CERTIFICATES}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewQualityCertificate = (qualityCertificate, id) => {
  let formData = new FormData();
  formData.append("name", qualityCertificate.name);
  formData.append("type", qualityCertificate.type);
  formData.append("certificate", qualityCertificate.certificate);

  return axios.post(`${url.ADD_NEW_QUALITY_CERTIFICATE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateQualityCertificate = qualityCertificate => {
  let formData = new FormData();
  formData.append("id", qualityCertificate.id);
  formData.append("name", qualityCertificate.name);
  formData.append("type", qualityCertificate.type);
  formData.append("certificate", qualityCertificate.certificate);

  return axios.put(
    `${url.UPDATE_QUALITY_CERTIFICATE}/${qualityCertificate.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const deleteQualityCertificate = qualityCertificate =>
  del(`${url.DELETE_QUALITY_CERTIFICATE}/${qualityCertificate.id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Pathologists START -------------
export const getPathologists = id =>
  get(`${url.GET_PATHOLOGISTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewPathologist = (pathologist, id) => {
  let formData = new FormData();
  formData.append("name", pathologist.name);
  formData.append("email", pathologist.email);
  formData.append("phone", pathologist.phone);
  formData.append("landline", pathologist.landline);
  formData.append("designation", pathologist.designation);
  formData.append(
    "is_available_for_consultation",
    pathologist.is_available_for_consultation
  );
  formData.append(
    "is_available_on_whatsapp",
    pathologist.is_available_on_whatsapp
  );
  formData.append("is_associated_with_pap", pathologist.is_associated_with_pap);

  return axios.post(`${url.ADD_NEW_PATHOLOGIST}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updatePathologist = pathologist => {
  let formData = new FormData();
  formData.append("id", pathologist.id);
  formData.append("name", pathologist.name);
  formData.append("email", pathologist.email);
  formData.append("phone", pathologist.phone);
  formData.append("landline", pathologist.landline);
  formData.append("designation", pathologist.designation);
  formData.append(
    "is_available_for_consultation",
    pathologist.is_available_for_consultation
  );
  formData.append(
    "is_available_on_whatsapp",
    pathologist.is_available_on_whatsapp
  );
  formData.append("is_associated_with_pap", pathologist.is_associated_with_pap);

  return axios.put(`${url.UPDATE_PATHOLOGIST}/${pathologist.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const deletePathologist = pathologist =>
  del(`${url.DELETE_PATHOLOGIST}/${pathologist.id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Forget Password Requests START -------------
export const postForgetPwd = data => {
  let formData = new FormData();
  formData.append("email", data.email);

  return axios.post(url.POST_FORGET_PASSWORD, formData, {
    headers: getHeader(authHeader()),
  });
};

export const postConfirmPwd = (user, token) => {
  let formData = new FormData();
  formData.append("password", user.password);
  formData.append("token", token);

  return axios.post(url.POST_CONFIRM_PASSWORD, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Test Appointment Requests START -------------
export const getTestAppointmentsPendingList = id =>
  get(`${url.GET_TEST_APPOINTMENTS_PENDING_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getTestAppointmentsInProcessList = id =>
  get(`${url.GET_TEST_APPOINTMENTS_IN_PROCESS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getTestAppointmentsCompletedList = id =>
  get(`${url.GET_TEST_APPOINTMENTS_COMPLETED_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateTestAppointment = testAppointment => {
  let formData = new FormData();
  formData.append("id", testAppointment.id);
  formData.append("patient_id", testAppointment.patient_id);
  formData.append("offered_test_id", testAppointment.offered_test_id);
  formData.append("booking_date_time", testAppointment.booking_date_time);
  formData.append(
    "requested_appointment_date_time",
    testAppointment.requested_appointment_date_time
  );
  formData.append(
    "sample_collection_date_time",
    testAppointment.sample_collection_date_time
  );
  formData.append(
    "result_upload_date_time",
    testAppointment.result_upload_date_time
  );
  formData.append("status", testAppointment.status);
  formData.append("result", testAppointment.result);

  return axios.put(
    `${url.UPDATE_TEST_APPOINTMENT}/${testAppointment.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

// ------------- Lab Profile Requests START -------------
export const getLabProfile = id =>
  get(`${url.GET_LAB_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateLabProfile = (labProfile, id) => {
  console.log(labProfile.registration_no);
  console.log(labProfile.email);
  let formData = new FormData();
  formData.append("account_id", id);
  formData.append("name", labProfile.name);
  formData.append("logo", labProfile.logo);
  formData.append("owner_name", labProfile.owner_name);
  formData.append("registration_no", labProfile.registration_no);
  formData.append("lab_experience", labProfile.lab_experience);
  formData.append("email", labProfile.email);
  formData.append("phone", labProfile.phone);
  formData.append("landline", labProfile.landline);
  formData.append("address", labProfile.address);
  formData.append("city", labProfile.city);
  formData.append("district", labProfile.district);
  formData.append(
    "complaint_handling_email",
    labProfile.complaint_handling_email
  );
  formData.append(
    "complaint_handling_phone",
    labProfile.complaint_handling_phone
  );
  formData.append(
    "is_digital_payment_accepted",
    labProfile.is_digital_payment_accepted
  );
  formData.append("is_active", labProfile.is_active);

  return axios.put(`${url.UPDATE_LAB_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Patient Test Appointment Requests START -------------
export const getPatientTestAppointmentsList = id =>
  get(`${url.GET_PATIENT_TEST_APPOINTMENTS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Patient Profile Requests START -------------
export const getPatientProfile = id =>
  get(`${url.GET_PATIENT_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updatePatientProfile = (patientProfile, id) => {
  let formData = new FormData();
  formData.append("account_id", id);
  formData.append("name", patientProfile.name);
  formData.append("cnic", patientProfile.cnic);
  formData.append("email", patientProfile.email);
  formData.append("phone", patientProfile.phone);
  formData.append("address", patientProfile.address);
  formData.append("city", patientProfile.city);
  formData.append("district", patientProfile.district);

  return axios.put(`${url.UPDATE_PATIENT_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Get Nearby Labs
export const getNearbyLabs = (address, id) => {
  let formData = new FormData();
  formData.append("address", address);

  return axios.post(`${url.GET_NEARBY_LABS}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
