import { identity } from "@fullcalendar/core";
import axios from "axios";
import bankAccount from "pages/BankAccounts/bank-account";
import discountLabHazirs from "store/discount-labhazir/reducer";
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
  formData.append("phone", patient.phone);
  formData.append("city_id", patient.city_id);
  formData.append("url", patient.url);
  console.log(url, patient.city_id)
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
// Post Patient Information
export const postB2bClientInformation = (id, b2bclient) => {
  let formData = new FormData();
  formData.append("business_name", b2bclient.name);
  formData.append("landline", b2bclient.landline);
  formData.append("website_url", b2bclient.website_url);
  formData.append("city_id", b2bclient.city_id);
  formData.append("business_logo", b2bclient.business_logo);
  // formData.append("city", b2bclient.city);
  // formData.append("district", b2bclient.district);

  return axios
    .post(`${url.POST_B2BCLIENT_INFORMATION}/${id}`, formData, {
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

// Post Patient Information
export const postDonorInformation = (id, donor) => {
  let formData = new FormData();
  formData.append("name", donor.name);
  formData.append("phone", donor.phone);
  formData.append("email", donor.email);
  formData.append("type", donor.type);
  formData.append("cnic", donor.cnic);
  // formData.append("province", donor.province);
  formData.append("city_id", donor.city_id);
  // formData.append("district", donor.district);
  formData.append("company_name", donor.company_name);
  formData.append("is_income_tax_payable", donor.is_income_tax_payable);
  formData.append("is_blocked", donor.is_blocked);

  return axios
    .post(`${url.POST_DONOR_INFORMATION}/${id}`, formData, {
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
  formData.append("branch_name", lab.branch_name);
  formData.append("main_lab_account_id", lab.main_lab_account_id);
  formData.append("financial_settlement", lab.financial_settlement);
  formData.append("logo", lab.logo);
  // formData.append("owner_name", lab.owner_name);
  // formData.append("registration_no", lab.registration_no);
  // formData.append("health_dept_certificate", lab.health_dept_certificate);
  formData.append("national_taxation_no", lab.national_taxation_no);
  // formData.append("is_iso_certified", lab.is_iso_certified);
  // formData.append("iso_certificate", lab.iso_certificate);
  formData.append("lab_experience", lab.lab_experience);
  // formData.append("phone", lab.phone);
  formData.append("landline", lab.landline);
  formData.append("address", lab.address);
  // formData.append("province", lab.province);
  // formData.append("district", lab.district);
  formData.append("city_id", lab.city_id);
  // formData.append("office", lab.office);
  // formData.append("complaint_handling_email", lab.complaint_handling_email);
  // formData.append("complaint_handling_phone", lab.complaint_handling_phone);
  formData.append(
    "is_digital_payment_accepted",
    lab.is_digital_payment_accepted
  );
  formData.append(
    "is_registering_for_first_time",
    lab.is_registering_for_first_time
  );
  formData.append("registered_by", lab.registered_by);
  formData.append("lab_staff_name", lab.lab_staff_name);
  formData.append("lab_staff_designation", lab.lab_staff_designation);
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

export const getDonors = () =>
  get(url.GET_DONORS, {
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
export const getOfferedTestsReferrel = id =>
  get(`${url.GET_OFFEREDTEST_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewOfferedTest = (offeredTest, id) => {
  let formData = new FormData();
  formData.append("test_id", offeredTest.test_id);
  // formData.append("unit_id", offeredTest.unit_id);
  formData.append("duration_required", offeredTest.duration_required);
  formData.append("duration_type", offeredTest.duration_type);
  formData.append("sample_type", offeredTest.sample_type);
  formData.append("price", offeredTest.price);
  formData.append("is_eqa_participation", offeredTest.is_eqa_participation);
  formData.append(
    "is_home_sampling_available",
    offeredTest.is_home_sampling_available
  );
  formData.append("is_test_performed", offeredTest.is_test_performed);

  return axios.post(`${url.ADD_NEW_OFFERED_TEST}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateOfferedTest = offeredTest => {
  let formData = new FormData();
  formData.append("id", offeredTest.id);
  formData.append("test_id", offeredTest.test_id);
  // formData.append("unit_id", offeredTest.unit_id);
  formData.append("duration_required", offeredTest.duration_required);
  formData.append("duration_type", offeredTest.duration_type);
  formData.append("sample_type", offeredTest.sample_type);
  formData.append("price", offeredTest.price);
  formData.append("is_eqa_participation", offeredTest.is_eqa_participation);
  formData.append(
    "is_home_sampling_available",
    offeredTest.is_home_sampling_available
  );
  formData.append("is_test_performed", offeredTest.is_test_performed);

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
  formData.append("account_id", sampleCollector.account_id);

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
  formData.append("certificate_type", qualityCertificate.certificate_type);
  formData.append("expiry_date", qualityCertificate.expiry_date);

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
  formData.append("certificate_type", qualityCertificate.certificate_type);
  formData.append("expiry_date", qualityCertificate.expiry_date);

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
  formData.append("photo", pathologist.photo);
  formData.append("qualification", pathologist.qualification);
  formData.append("speciality", pathologist.speciality); //
  formData.append("pmdc_reg_no", pathologist.pmdc_reg_no);
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
  formData.append("photo", pathologist.photo);
  formData.append("qualification", pathologist.qualification);
  formData.append("speciality", pathologist.speciality); //
  formData.append("pmdc_reg_no", pathologist.pmdc_reg_no);
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

export const postChangePwd = user => {
  let formData = new FormData();
  formData.append("old_password", user.old_password);
  formData.append("new_password", user.new_password);

  return axios.post(url.POST_CHANGE_PASSWORD, formData, {
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
  formData.append("status", testAppointment.status);
  formData.append("process", testAppointment.process);

  if (testAppointment.process == "pending") {
    formData.append(
      "estimated_sample_collection_at",
      testAppointment.estimated_sample_collection_at
    );
    // formData.append(
    //   "estimated_result_uploading_at",
    //   testAppointment.estimated_result_uploading_at
    // );
  } else if (testAppointment.process == "rescheduling") {
    formData.append("rescheduled_by", testAppointment.rescheduledBy);

    if (testAppointment.reschedule_reason == "Other") {
      formData.append("reschedule_reason", testAppointment.reason);
    } else {
      formData.append("reschedule_reason", testAppointment.reschedule_reason);
    }
  } else {
    if (
      testAppointment.patient_unique_id &&
      testAppointment.patient_unique_id.length > 0
    ) {
      formData.append("patient_unique_id", testAppointment.patient_unique_id);
    }

    formData.append("is_rescheduled", testAppointment.isRescheduled);
    formData.append("result_type", testAppointment.result_type);
    formData.append("url", testAppointment.url);
    formData.append("result", testAppointment.result);

    if (testAppointment.assigned_to && testAppointment.assigned_to == null) {
      formData.append("assigned_to", "");
    } else {
      formData.append("assigned_to", testAppointment.assigned_to);
    }
  }

  // console.log("formData: ", formData);
  console.log("testAppointment: ", testAppointment);

  // formData.append("id", testAppointment.id);
  // formData.append("patient_unique_id", testAppointment.patient_unique_id);
  // formData.append("patient_id", testAppointment.patient_id);
  // formData.append("booked_at", testAppointment.booked_at);
  // formData.append(
  //   "appointment_requested_at",
  //   testAppointment.appointment_requested_at
  // );

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
  let formData = new FormData();
  formData.append("account_id", id);
  formData.append("name", labProfile.name);
  formData.append("logo", labProfile.logo);
  formData.append("lab_experience", labProfile.lab_experience);
  formData.append("email", labProfile.email);
  formData.append("landline", labProfile.landline);
  formData.append("address", labProfile.address);
  formData.append("city", labProfile.city);
  formData.append("district", labProfile.district);
  formData.append("province", labProfile.province);

  return axios.put(`${url.UPDATE_LAB_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Lab Settings Requests START -------------
export const getLabSettings = id =>
  get(`${url.GET_LAB_SETTINGS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateLabSettings = (labSettings, id) => {
  let formData = new FormData();

  formData.append("account_id", id);
  formData.append("is_247_opened", labSettings.is_247_opened);
  formData.append("opening_time", labSettings.opening_time);
  formData.append("closing_time", labSettings.closing_time);
  formData.append("health_dept_certified", labSettings.health_dept_certified);
  formData.append("registration_no", labSettings.registration_no);
  formData.append("license_no", labSettings.license_no);
  formData.append(
    "health_dept_certificate",
    labSettings.health_dept_certificate
  );
  formData.append("phone", labSettings.phone);
  formData.append(
    "complaint_handling_email",
    labSettings.complaint_handling_email
  );
  formData.append(
    "complaint_handling_phone",
    labSettings.complaint_handling_phone
  );
  formData.append("home_sampling_charges", labSettings.home_sampling_charges);
  formData.append(
    "is_digital_payment_accepted",
    labSettings.is_digital_payment_accepted
  );
  formData.append("is_active", labSettings.is_active);

  return axios.put(`${url.UPDATE_LAB_SETTINGS}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getLabPayments = id =>
  get(`${url.GET_LAB_PAYMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateLabPayments = (labPayments, id) => {
  let formData = new FormData();

  formData.append("test_appointment_id", id);
  formData.append("counter_discount", labPayments.counter_discount);
  formData.append("amount_received", labPayments.amount_received);
  formData.append("received_by", labPayments.received_by);

  // if (labPayments.amount == labPayments.amount_received) {
  //   formData.append("counter_discount", labPayments.counter_discount == 0);
  //   formData.append("amount_received", labPayments.amount_received);
  //   formData.append("received_by", labPayments.received_by);
  //   } else {
  //   formData.append("counter_discount", labPayments.counter_discount);
  //   formData.append("amount_received", labPayments.amount_received);
  //   formData.append("received_by", labPayments.received_by);
  // }

  return axios.put(`${url.UPDATE_LAB_PAYMENTS}/${id}`, formData, {
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
  formData.append("phone", patientProfile.phone);

  return axios.put(`${url.UPDATE_PATIENT_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Get Nearby Labs
export const getNearbyLabs = locationDetails => {
  let formData = new FormData();
  formData.append("latitude", locationDetails.latitude);
  formData.append("longitude", locationDetails.longitude);
  formData.append("search_type", locationDetails.search_type);
  formData.append("address", locationDetails.address);
  formData.append("city", locationDetails.city);

  console.log("donorSetting: ", locationDetails)

  return axios.post(`${url.GET_NEARBY_LABS}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Get Nearby Tests
export const getNearbyTests = data => {
  let formData = new FormData();

  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("search_type", data.search_type);
  formData.append("address", data.address);
  formData.append("city", data.city);
  formData.append("test_name", data.test_name);
  console.log("donorSetting: ", data)

  return axios.post(`${url.GET_NEARBY_TESTS}`, formData, {
    headers: getHeader(authHeader()),
  });
};
// Get Nearby Tests
export const getNearbyProfiles = data => {
  let formData = new FormData();

  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("search_type", data.search_type);
  formData.append("address", data.address);
  formData.append("city", data.city);
  formData.append("test_name", data.test_name);
  console.log("donorSetting: ", data);

  return axios.post(`${url.GET_NEARBY_PROFILES}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getProfiles = () =>
  get(url.GET_PROFILES, {
    headers: getHeader(authHeader()),
  });
// Get Nearby Packages
export const getNearbyPackages = data => {
  let formData = new FormData();

  formData.append("latitude", data.latitude);
  formData.append("longitude", data.longitude);
  formData.append("search_type", data.search_type);
  formData.append("address", data.address);
  formData.append("city", data.city);
  formData.append("test_name", data.test_name);

  return axios.post(`${url.GET_NEARBY_PACKAGES}`, formData, {
    headers: getHeader(authHeader()),
  });
};
// ------------- Corporate Profile Requests START -------------
export const getCorporateProfile = id =>
  get(`${url.GET_CORPORATE_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateCorporateProfile = (corporateProfile, id) => {
  let formData = new FormData();
  formData.append("account_id", id);
  formData.append("unique_id", uid);
  formData.append("name", corporateProfile.name);
  formData.append("logo", corporateProfile.logo);
  formData.append("owner_name", corporateProfile.owner_name);
  formData.append("email", corporateProfile.email);
  formData.append("phone", corporateProfile.phone);
  formData.append("landline", corporateProfile.landline);
  formData.append("address", corporateProfile.address);
  formData.append("city", corporateProfile.city);
  formData.append("district", corporateProfile.district);
  return axios.put(`${url.UPDATE_CORPORATE_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ----------------- Patient Feedback -----------------
export const addNewPatientFeedback = patientFeedback => {
  let formData = new FormData();
  //formData.append("test_appointment_id", patientFeedback.id);
  formData.append("rating", patientFeedback.rating);
  formData.append("review", patientFeedback.review);

  return axios.post(
    `${url.ADD_NEW_PATIENT_FEEDBACK}/${patientFeedback.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};
// ----------------- Complaints -----------------
export const addNewComplaint = complaint => {
  let formData = new FormData();
  formData.append("complainant", complaint.complainant);
  formData.append("complainee", complaint.complainee);
  formData.append("lab_id", complaint.lab_id);
  formData.append("labhazir_complainee", complaint.labhazir_complainee);
  formData.append("name", complaint.name);
  formData.append("email", complaint.email);
  formData.append("city", complaint.city);
  formData.append("phone", complaint.phone);
  formData.append("subject", complaint.subject);
  formData.append("message", complaint.message);
 console.log("data",complaint )
  return axios.post(`${url.ADD_NEW_COMPLAINT}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getUnhandledComplaints = id =>
  get(`${url.GET_UNHANDLED_COMPLAINTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

  export const updateUnhandledComplaints = data => {
    let formData = new FormData();
    formData.append("comment", data.comment);
    console.log("Form data: ", formData);
  
    return axios.put(`${url.UPDATE_UNHANDLED_COMPLAINTS}/${data.id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
// export const updateUnhandledComplaints = id => {
//   let formData = new FormData();

//   return axios.put(`${url.UPDATE_UNHANDLED_COMPLAINTS}/${id}`, formData, {
//     headers: getHeader(authHeader()),
//   });
// };

export const getHandledComplaints = id =>
  get(`${url.GET_HANDLED_COMPLAINTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Cart START -------------
export const getCarts = id =>
  get(`${url.GET_CARTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const emptyCart = id =>
  del(`${url.EMPTY_CART}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const deleteCart = cart =>
  del(`${url.DELETE_CART}/${cart.id}`, {
    headers: getHeader(authHeader()),
  });

export const addToCart = (cart, id) => {
  let formData = new FormData();
  formData.append("lab_id", cart.lab_id);
  formData.append("offered_test_id", cart.id);

  return axios.post(`${url.ADD_TO_CART}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Get Home Sampled Tests
export const getHomeSampledTests = id =>
  get(`${url.GET_HOME_SAMPLED_TESTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

// Get Checkout Items
export const getCheckoutItems = (id, is_home_sampling_availed) => {
  let formData = new FormData();
  formData.append("is_home_sampling_availed", is_home_sampling_availed);

  return axios.post(`${url.GET_CHECKOUT_ITEMS}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Add checkout data
export const addCheckoutData = (checkoutData, id) => {
  let formData = new FormData();
  formData.append("uuid", checkoutData.uuid);
  formData.append("patient_name", checkoutData.patient_name);
  formData.append("patient_age", checkoutData.patient_age);
  formData.append("patient_gender", checkoutData.patient_gender);
  formData.append("patient_address", checkoutData.patient_address);
  formData.append("city_id", checkoutData.city_id);
  formData.append("patient_city", checkoutData.patient_city);
  formData.append("patient_district", checkoutData.patient_district);
  // formData.append(
  //   "relationsip_with_patient",
  //   checkoutData.relationsip_with_patient
  // );
  formData.append(
    "appointment_requested_at",
    checkoutData.appointment_requested_at
  );
  formData.append(
    "is_home_sampling_availed",
    checkoutData.is_home_sampling_availed
  );
  formData.append("payment_method", checkoutData.payment_method);
  formData.append("card_number", checkoutData.card_number);
  formData.append("name_on_card", checkoutData.name_on_card);
  formData.append("expiry_date", checkoutData.expiry_date);
  formData.append("cvv_code", checkoutData.cvv_code);

  return axios.post(`${url.ADD_CHECKOUT_DATA}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Get Invoice Detail
export const getInvoiceDetail = id =>
  get(`${url.GET_INVOICE_DETAIL}/${id}`, {
    headers: getHeader(authHeader()),
  });

// FEEDBACK
export const getFeedbacks = id =>
  get(`${url.GET_FEEDBACKS}/${id}`, {
    headers: getHeader(authHeader()),
  });
// export const updatePaymentInfo = id => {
//   let formData = new FormData();

//   return axios.put(`${url.UPDATE_PAYMENT_INFO}/${id}`, formData, {
//     headers: getHeader(authHeader()),
//   });
// };

// Get Test Description
export const getTestDescriptions = id =>
  get(`${url.GET_TEST_DESCRIPTIONS}/${id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- B2B client -------------
export const getB2bReferredPatientsList = id =>
  get(`${url.GET_B2B_REFERRED_PATIENTS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
// ------------- B2B client -------------
export const getB2bLabSharesList = id =>
  get(`${url.GET_B2B_LAB_SHARES_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getB2bSharesLabList = id =>
  get(`${url.GET_B2B_SHARES_LAB_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const updateLabShare = b2bLabShare => {
  let formData = new FormData();
  // formData.append("account_id", id);
  formData.append("b2b_shares", b2bLabShare.b2b_shares);

  return axios.put(`${url.UPDATE_LAB_SHARE}/${b2bLabShare.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateAllLabShare = b2bLabShare => {
  let formData = new FormData();
  // formData.append("account_id", id);
  formData.append("b2b_shares", b2bLabShare.b2b_shares);

  return axios.put(
    `${url.UPDATE_ALL_LAB_SHARE}/${b2bLabShare.b2b_id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};
export const addNewLabShare = (b2bLabShare, id) => {
  let formData = new FormData();
  formData.append("lab_id", b2bLabShare.lab_id);
  formData.append("b2b_shares", b2bLabShare.b2b_shares);


  return axios.post(`${url.ADD_NEW_LAB_SHARE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};


// ------------- B2B List -------------
export const getB2bAllClientsList = () =>
  get(`${url.GET_B2B_ALL_CLIENTS_LIST}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Lab Profile Requests START -------------
export const getB2bProfile = id =>
  get(`${url.GET_B2B_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateB2bProfile = (b2bProfile, id) => {
  let formData = new FormData();
  // formData.append("account_id", id);
  formData.append("business_name", b2bProfile.business_name);
  formData.append("email", b2bProfile.email);
  formData.append("landline", b2bProfile.landline);
  formData.append("website_url", b2bProfile.website_url);
  formData.append("business_logo", b2bProfile.business_logo)

  return axios.put(`${url.UPDATE_B2B_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- ACCOUNT STATEMENTS -------------
export const getB2bAccountStatements = id =>
  get(`${url.GET_B2B_ACCOUNT_STATEMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });
// ------------- Donor Settings Requests START -------------
  export const addNewB2bPayment = (b2bPayment, id) => {
    let formData = new FormData();
    // formData.append("lab_id", donorPayment.lab_id);
    formData.append("payment_method", b2bPayment.payment_method);
    formData.append("address_type", b2bPayment.address_type);
    formData.append("address", b2bPayment.address);
    formData.append("amount", b2bPayment.amount);
    formData.append("paid_at", b2bPayment.paid_at);
    formData.append("deposited_at", b2bPayment.deposited_at);
    formData.append("deposit_bank", b2bPayment.deposit_bank);
    formData.append("cheque_no", b2bPayment.cheque_no);
    formData.append("cheque_image", b2bPayment.cheque_image);
    formData.append("deposit_slip", b2bPayment.deposit_slip);
    formData.append("is_cleared", b2bPayment.is_cleared);
    formData.append("cleared_at", b2bPayment.cleared_at);
    formData.append("is_settled", b2bPayment.is_settled);

  
    return axios.post(`${url.ADD_NEW_B2B_PAYMENT}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };

// ------------- Donor Profile Requests START -------------
export const getDonorProfile = id =>
  get(`${url.GET_DONOR_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateDonorProfile = (donorProfile, id) => {
  let formData = new FormData();
  // formData.append("account_id", id);
  formData.append("name", donorProfile.name);
  formData.append("phone", donorProfile.phone);
  formData.append("email", donorProfile.email);
  formData.append("type", donorProfile.type);
  formData.append("cnic", donorProfile.cnic);
  formData.append("company_name", donorProfile.company_name);
  formData.append("is_income_tax_payable", donorProfile.is_income_tax_payable);
  formData.append("is_blocked", donorProfile.is_blocked);


  return axios.put(`${url.UPDATE_DONOR_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Donor -------------
export const getDonorReferredAppointmentsList = id =>
  get(`${url.GET_DONOR_REFERRED_APPOINTMENTS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Donor Settings Requests START -------------
export const getDonorSettings = id =>
  get(`${url.GET_DONOR_SETTINGS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateDonorSettings = (donorSetting, id) => {
  let formData = new FormData();

  formData.append("account_id", id);
  formData.append("donation_to", donorSetting.donation_to);
  formData.append("province", donorSetting.province);
  formData.append("district", donorSetting.district);
  formData.append("city", donorSetting.city);


  console.log("donorSetting: ", donorSetting);

  return axios.put(`${url.UPDATE_DONOR_SETTINGS}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- ACCOUNT STATEMENTS -------------
export const getDonorAccountStatements = id =>
  get(`${url.GET_DONOR_ACCOUNT_STATEMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });
// ------------- Donor Settings Requests START -------------
  export const addNewDonorPayment = (donorPayment, id) => {
    let formData = new FormData();
    // formData.append("lab_id", donorPayment.lab_id);
    formData.append("payment_method", donorPayment.payment_method);
    formData.append("address_type", donorPayment.address_type);
    formData.append("address", donorPayment.address);
    formData.append("amount", donorPayment.amount);
    formData.append("paid_at", donorPayment.paid_at);
    formData.append("deposited_at", donorPayment.deposited_at);
    formData.append("deposit_bank", donorPayment.deposit_bank);
    formData.append("cheque_no", donorPayment.cheque_no);
    formData.append("cheque_image", donorPayment.cheque_image);
    formData.append("deposit_slip", donorPayment.deposit_slip);
    formData.append("is_cleared", donorPayment.is_cleared);
    formData.append("cleared_at", donorPayment.cleared_at);
    formData.append("is_settled", donorPayment.is_settled);

  
    return axios.post(`${url.ADD_NEW_DONOR_PAYMENT}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };

  // Add Bank

  export const updateBank = bank => {
    let formData = new FormData();
    formData.append("name", bank.name);
    formData.append("phone", bank.phone);
    formData.append("email", bank.email);
    formData.append("registered_at", bank.registered_at);
    formData.append("registered_by", bank.registered_by);

    // formData.append("expiry_date", bank.expiry_date);
  
    return axios.put(
      `${url.UPDATE_BANK}/${bank.id}`,
      formData,
      {
        headers: getHeader(authHeader()),
      }
    );
  };

  export const addNewCreateBank = (createBank, id) => {
    let formData = new FormData();
    // formData.append("lab_id", createBank.lab_id);
    formData.append("name", createBank.name);
    formData.append("phone", createBank.phone);
    formData.append("email", createBank.email);
    formData.append("registered_at", createBank.registered_at);
    formData.append("registered_by", createBank.registered_by);

  
    return axios.post(`${url.ADD_NEW_CREATE_BANK}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };

  // List of Banks
  export const getBanks = () =>
  get(url.GET_BANKS, {
    headers: getHeader(authHeader()),
  });

  // List of Bank Accounts 
  export const getBankAccounts = () =>
  get(url.GET_BANK_ACCOUNTS, {
    headers: getHeader(authHeader()),
  });

    // Add Bank Account

    export const addNewBankAccount = (bankAccount, id) => {
      let formData = new FormData();
      // formData.append("lab_id", bankAccount.lab_id);
      formData.append("bank_id", bankAccount.bank_id);
      formData.append("account_no", bankAccount.account_no);
      formData.append("categorey", bankAccount.categorey);
      formData.append("currency", bankAccount.currency);
      formData.append("city", bankAccount.city);
      formData.append("address", bankAccount.address);
      formData.append("branch_no", bankAccount.branch_no);
      formData.append("opening_balance", bankAccount.opening_balance);
      formData.append("creating_at", bankAccount.creating_at);
      formData.append("status", bankAccount.status);  
    
      return axios.post(`${url.ADD_NEW_BANK_ACCOUNT}/${id}`, formData, {
        headers: getHeader(authHeader()),
      });
    };
// ------------- ACCOUNT STATEMENTS -------------
export const getAccountStatements = id =>
  get(`${url.GET_ACCOUNT_STATEMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Staff Profile Requests START -------------
export const getStaffProfile = id =>
  get(`${url.GET_STAFF_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateStaffProfile = (labProfile, id) => {
  let formData = new FormData();
  formData.append("account_id", id);
  formData.append("name", labProfile.name);
  formData.append("phone", labProfile.phone);
  formData.append("roles", labProfile.roles);

  return axios.put(`${url.UPDATE_STAFF_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const addStaff = (staff, id) => {
  let formData = new FormData();
  formData.append("name", staff.name);
  formData.append("cnic", staff.cnic);
  formData.append("phone", staff.phone);
  formData.append("roles", staff.roles);
  formData.append("city", staff.city);
  formData.append("photo", staff.photo);
  formData.append("territory_office", staff.territory_office);
  console.log("data",formData);
  return axios.post(`${url.ADD_STAFF}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateStaff = staff => {
  let formData = new FormData();
  formData.append("name", staff.name);
  formData.append("cnic", staff.cnic);
  formData.append("phone", staff.phone);
  formData.append("roles", staff.roles);
  formData.append("city", staff.city);
  formData.append("territory_office", staff.territory_office);

  return axios.put(`${url.UPDATE_STAFF}/${staff.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const deleteStaff = staff =>
  del(`${url.DELETE_STAFF}/${staff.id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Sample Collector Profile Requests START -------------
export const getSampleCollectorProfile = id =>
  get(`${url.GET_SAMPLE_COLLECTOR_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateSampleCollectorProfile = (sampleCollectorProfile, id) => {
  let formData = new FormData();
  formData.append("account_id", id);
  formData.append("name", sampleCollectorProfile.name);
  formData.append("phone", sampleCollectorProfile.phone);
  // formData.append("", sampleCollectorProfile.roles);

  return axios.put(`${url.UPDATE_SAMPLE_COLLECTOR_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Sample Collector Test Appointment Requests START -------------
export const getSampleCollectionInProcessList = id =>
  get(`${url.GET_SAMPLE_COLLECTION_IN_PROCESS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getSampleCollectionCompletedList = id =>
  get(`${url.GET_SAMPLE_COLLECTION_COMPLETED_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateSampleCollectionStatus = data => {
  let formData = new FormData();
  formData.append("id", data.id);
  formData.append("collection_status", data.collection_status);
  formData.append("payment_method", data.payment_method);
  // formData.append("amount_recieved_by_collector", data.amount_recieved_by_collector);
  formData.append("is_exact_amount_collected", data.is_exact_amount_collected);

  return axios.put(
    `${url.UPDATE_SAMPLE_COLLECTION_STATUS}/${data.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

// ------------- STAFF Requests START -------------
export const getCSRList = () =>
  get(`${url.GET_CSR_LIST}`, {
    headers: getHeader(authHeader()),
  });

export const getAuditorList = () =>
  get(`${url.GET_AUDITOR_LIST}`, {
    headers: getHeader(authHeader()),
  });

export const getFinanceOfficerList = () =>
  get(`${url.GET_FINANCE_OFFICER_LIST}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Registration Admin requests START -------------
export const getPendingLabs = () =>
  get(`${url.GET_PENDING_LABS}`, {
    headers: getHeader(authHeader()),
  });

export const getApprovedLabs = () =>
  get(`${url.GET_APPROVED_LABS}`, {
    headers: getHeader(authHeader()),
  });

export const getUnapprovedLabs = () =>
  get(`${url.GET_UNAPPROVED_LABS}`, {
    headers: getHeader(authHeader()),
  });

export const approveUnapproveLab = data => {
  let formData = new FormData();
  formData.append("lab_id", data.labId);
  formData.append("is_approved", data.isApproved);

  return axios.put(`${url.APPROVE_UNAPPROVE_LAB}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getPendingB2BClients = () =>
  get(`${url.GET_PENDING_B2B_CLIENTS}`, {
    headers: getHeader(authHeader()),
  });

export const getApprovedB2BClients = () =>
  get(`${url.GET_APPROVED_B2B_CLIENTS}`, {
    headers: getHeader(authHeader()),
  });

export const getUnapprovedB2BClients = () =>
  get(`${url.GET_UNAPPROVED_B2B_CLIENTS}`, {
    headers: getHeader(authHeader()),
  });

export const approveUnapproveB2BClient = data => {
  let formData = new FormData();
  formData.append("b2b_id", data.b2bId);
  formData.append("is_approved", data.isApproved);

  return axios.put(`${url.APPROVE_UNAPPROVE_B2B_CLIENT}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getPendingDonors = () =>
  get(`${url.GET_PENDING_DONORS}`, {
    headers: getHeader(authHeader()),
  });

export const getApprovedDonors = () =>
  get(`${url.GET_APPROVED_DONORS}`, {
    headers: getHeader(authHeader()),
  });

export const getUnapprovedDonors = () =>
  get(`${url.GET_UNAPPROVED_DONORS}`, {
    headers: getHeader(authHeader()),
  });

export const approveUnapproveDonor = data => {
  let formData = new FormData();
  formData.append("donor_id", data.donorId);
  formData.append("is_approved", data.isApproved);

  return axios.put(`${url.APPROVE_UNAPPROVE_DONOR}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- CSR Admin requests START -------------
export const getPendingComplaints = () =>
  get(`${url.GET_PENDING_COMPLAINTS}`, {
    headers: getHeader(authHeader()),
  });
  export const getPendingComplaintsLabhazir = () =>
  get(`${url.GET_PENDING_COMPLAINTS_LABHAZIR}`, {
    headers: getHeader(authHeader()),
  });
  
export const getInProcessComplaints = () =>
  get(`${url.GET_INPROCESS_COMPLAINTS}`, {
    headers: getHeader(authHeader()),
  });

export const getInProcessComplaintsLabhazir = () =>
  get(`${url.GET_INPROCESS_COMPLAINTS_LABHAZIR }`, {
    headers: getHeader(authHeader()),
  });

export const getResolvedComplaints = () =>
  get(`${url.GET_RESOLVED_COMPLAINTS}`, {
    headers: getHeader(authHeader()),
  });

  export const getResolvedComplaintsLabhazir = () =>
  get(`${url.GET_RESOLVED_COMPLAINTS_LABHAZIR}`, {
    headers: getHeader(authHeader()),
  });

export const assignComplaint = data => {
  let formData = new FormData();
  formData.append("id", data.id);
  // formData.append("office", data.office);
  formData.append("assigned_to", data.assignedTo);

  return axios.put(`${url.ASSIGN_COMPLAINT}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- CSR Admin requests START -------------
export const getPendingAudits = () =>
  get(`${url.GET_PENDING_AUDITS}`, {
    headers: getHeader(authHeader()),
  });

export const getInProcessAudits = () =>
  get(`${url.GET_INPROCESS_AUDITS}`, {
    headers: getHeader(authHeader()),
  });

export const getPassedAudits = () =>
  get(`${url.GET_PASSED_AUDITS}`, {
    headers: getHeader(authHeader()),
  });
  export const getFailedAudits = () =>
  get(`${url.GET_FAILED_AUDITS}`, {
    headers: getHeader(authHeader()),
  });

export const assignAudit = data => {
  let formData = new FormData();
  formData.append("id", data.id);
  formData.append("assigned_to", data.assignedTo);

  return axios.put(`${url.ASSIGN_AUDIT}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Advertisements Requests START -------------
export const getAdvertisements = () =>
  get(`${url.GET_ADVERTISEMENTS}`, {
    headers: getHeader(authHeader()),
  });

export const addNewAdvertisement = (advertisement, id) => {
  let formData = new FormData();
  formData.append("title", advertisement.title);
  formData.append("poster", advertisement.poster);
  formData.append("description", advertisement.description);
  formData.append("posted_at", advertisement.posted_at);
  formData.append("posted_till", advertisement.posted_till);
  formData.append("region_type", advertisement.region_type);
  formData.append("province", advertisement.province);
  formData.append("city_id", advertisement.city_id);
  formData.append("district", advertisement.district);

  return axios.post(`${url.ADD_NEW_ADVERTISEMENT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateAdvertisement = advertisement => {
  let formData = new FormData();
  formData.append("id", advertisement.id);
  formData.append("title", advertisement.title);
  formData.append("poster", advertisement.poster);
  formData.append("description", advertisement.description);
  formData.append("posted_at", advertisement.posted_at);
  formData.append("posted_till", advertisement.posted_till);
  formData.append("region_type", advertisement.region_type);
  formData.append("province", advertisement.province);
  formData.append("city_id", advertisement.city_id);
  formData.append("district", advertisement.district);

  return axios.put(
    `${url.UPDATE_ADVERTISEMENT}/${advertisement.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const deleteAdvertisement = advertisement =>
  del(`${url.DELETE_ADVERTISEMENT}/${advertisement.id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Discount LabHazir Requests START -------------
export const getDiscountLabHazirs = id =>
  get(`${url.GET_DISCOUNT_LABHAZIR}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateDiscountLabHazir = data => {
  let formData = new FormData();

  formData.append("discount", data.discount);

  if (data.discount > 0) {
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
  }

  return axios.put(`${url.UPDATE_DISCOUNT_LABHAZIR}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateDiscountAllLabHazir = data => {
  let formData = new FormData();
  // formData.append("account_id", id);
  formData.append("discount", data.discount);

  if (data.discount > 0) {
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
  }

  return axios.put(`${url.UPDATE_DISCOUNT_ALL_LABHAZIR}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Discount LabHazir Lab Requests START -------------

export const getLabsList = ()=>
get(`${url.GET_LABS_LIST}`, {
  headers: getHeader(authHeader()),
});

export const getDiscountLabHazirToLabs = id =>
  get(`${url.GET_DISCOUNT_LABHAZIRTOLABS}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const updateDiscountLabHazirToLab = data => {
    let formData = new FormData();
  
    formData.append("discount_by_labhazir", data.discount_by_labhazir);
  
    if (data.discount_by_labhazir > 0) {
      formData.append("start_date_by_labhazir", data.start_date_by_labhazir);
      formData.append("end_date_by_labhazir", data.end_date_by_labhazir);
    }
  
    return axios.put(`${url.UPDATE_DISCOUNT_LABHAZIRTOLAB}/${data.id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
  
export const updateDiscountAllLabHazirToLab = data => {
    let formData = new FormData();
    // formData.append("account_id", id);
    formData.append("discount_by_labhazir", data.discount_by_labhazir);
    // formData.append("shared_percentage", data.shared_percentage);
  
    if (data.discount_by_labhazir > 0) {
      formData.append("start_date_by_labhazir", data.start_date_by_labhazir);
      formData.append("end_date_by_labhazir", data.end_date_by_labhazir);
    }
  
    return axios.put(`${url.UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB}/${data.lab_id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };

// export const getReferrelFeeLabs = id =>
//   get(`${url.GET_REFERREL_FEES}/${id}`, {
//     headers: getHeader(authHeader()),
//   });
export const getPutReferrelFeeLabs = () =>
  get(`${url.GET_PUT_REFERREL_FEES}`, {
    headers: getHeader(authHeader()),
  });
export const getReferrelFeeLabs = () =>
  get(`${url.GET_REFERREL_FEES}`, {
    headers: getHeader(authHeader()),
  });
  
export const updateReferrelFeeLab = referrelLabFee => {
    let formData = new FormData();
  
    formData.append("shared_percentage", referrelLabFee.shared_percentage);
  
    return axios.put(`${url.UPDATE_REFERREL_FEE}/${referrelLabFee.id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
export const updateReferrelAllFeeLab = referrelLabFee => {
    let formData = new FormData();
    // formData.append("account_id", id);
    formData.append("shared_percentage", referrelLabFee.shared_percentage);

    return axios.put(`${url.UPDATE_REFERREL_ALL_FEE}/${referrelLabFee.lab_id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
  

//discount lab
export const getDiscountLab = id =>
  get(`${url.GET_DISCOUNT_LAB}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const updateDiscountLab = data => {
  let formData = new FormData();

  formData.append("discount", data.discount);

  if (data.discount > 0) {
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
  }

  return axios.put(`${url.UPDATE_DISCOUNT_LAB}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateDiscountAllLab = data => {
  let formData = new FormData();
  // formData.append("account_id", id);
  formData.append("discount", data.discount);

  if (data.discount > 0) {
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
  }

  return axios.put(`${url.UPDATE_DISCOUNT_ALL_LAB}/${data.lab_id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Assigned Audits Requests START -------------
export const getAssignedAudits = id =>
  get(`${url.GET_ASSIGNED_AUDITS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateAssignedAudits = data => {
  let formData = new FormData();
  formData.append("audit_report", data.auditReport);
  formData.append("audit_status", data.audit_status);
  formData.append("comment", data.comment);
  console.log("Form data: ", formData);

  return axios.put(`${url.UPDATE_ASSIGNED_AUDITS}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const getLabAudits = id =>
  get(`${url.GET_LAB_AUDITS}/${id}`, {
    headers: getHeader(authHeader()),
  });

  export const addNewAudit = (audit, id) => {
    let formData = new FormData();
    formData.append("lab_id", audit.lab_id);
    formData.append("reason_of_reaudit", audit.reason_of_reaudit);

    return axios.post(`${url.ADD_NEW_AUDIT}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };

export const getAuditorsCompletedAudits = id =>
  get(`${url.GET_AUDITORS_COMPLETED_AUDITS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getInPayment = id =>
  get(`${url.GET_IN_PAYMENT}/${id}`, {
    headers: getHeader(authHeader()),
  });
// ------------- Lab Advertisements Requests START -------------
export const getLabAdvertisements = id =>
  get(`${url.GET_LAB_ADVERTISEMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewLabAdvertisement = (advertisement, id) => {
  let formData = new FormData();
  formData.append("title", advertisement.title);
  formData.append("poster", advertisement.poster);
  formData.append("description", advertisement.description);
  formData.append("posted_at", advertisement.posted_at);
  formData.append("posted_till", advertisement.posted_till);
  formData.append("region_type", advertisement.region_type);
  formData.append("province", advertisement.province);
  formData.append("city_id", advertisement.city_id);
  formData.append("district", advertisement.district);
  formData.append("amount", advertisement.amount);
  formData.append("number_of_days", advertisement.number_of_days);


  return axios.post(`${url.ADD_NEW_LAB_ADVERTISEMENT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateLabAdvertisement = advertisement => {
  let formData = new FormData();
  formData.append("id", advertisement.id);
  formData.append("title", advertisement.title);
  formData.append("poster", advertisement.poster);
  formData.append("description", advertisement.description);
  formData.append("posted_at", advertisement.posted_at);
  formData.append("posted_till", advertisement.posted_till);
  formData.append("region_type", advertisement.region_type);
  formData.append("province", advertisement.province);
  formData.append("city_id", advertisement.city_id);
  formData.append("district", advertisement.district);
  formData.append("amount", advertisement.amount);
  formData.append("number_of_days", advertisement.number_of_days);

  return axios.put(`${url.UPDATE_LAB_ADVERTISEMENT}/${advertisement.id}`,
  formData,
    {
      headers: getHeader(authHeader()),
    }
  )
  };

  export const getB2bClients = () =>
  get(url.GET_B2B_CLIENTS, {
    headers: getHeader(authHeader()),
  });

  // ------------- inPayments Settings Requests START -------------
  export const addNewInPayment = (inPayment, id) => {
    let formData = new FormData();
    formData.append("payment_for", inPayment.payment_for);
    formData.append("lab_id", inPayment.lab_id);
    formData.append("donor_id", inPayment.donor_id);
    formData.append("advertisement_id", inPayment.advertisement_id);
    formData.append("payment_method", inPayment.payment_method);
    formData.append("recieved_by", inPayment.recieved_by);
    formData.append("handover_to", inPayment.handover_to);
    formData.append("amount", inPayment.amount);
    formData.append("paid_at", inPayment.paid_at);
    formData.append("cheque_payment_date", inPayment.cheque_payment_date);
    formData.append("cheque_no", inPayment.cheque_no); 
    formData.append("cheque_image", inPayment.cheque_image);
    formData.append("refered_no", inPayment.refered_no);
    formData.append("status", inPayment.status);

    return axios.post(`${url.ADD_NEW_IN_PAYMENT}/${id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };

// ------------- PAYMENT IN STATUS---------------------
export const updatePaymentStatus = paymentStatus => {
  let formData = new FormData();
  formData.append("id", paymentStatus.id);
  formData.append("deposit_at", paymentStatus.deposit_at);
  // formData.append("bankaccount_id", paymentStatus.bankaccount_id);
  // formData.append("deposit_slip", paymentStatus.deposit_slip);
  formData.append("status", paymentStatus.status);
  return axios.put(
    `${url.UPDATE_PAYMENT_STATUS}/${paymentStatus.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const updatePaymentInStatus = paymentInStatus => {
  let formData = new FormData();
  formData.append("is_cleared",  paymentInStatus.is_cleared);
  return axios.put(
    `${url.UPDATE_PAYMENTIN_STATUS}/${paymentInStatus.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};
export const updatePaymentInBouncedStatus = paymentInBouncedStatus => {
  let formData = new FormData();
  // formData.append("id", paymentInBouncedStatus.id);
  formData.append("deposit_at", paymentInBouncedStatus.deposit_at);
  formData.append("bankaccount_id", paymentInBouncedStatus.bankaccount_id);
  formData.append("deposit_slip", paymentInBouncedStatus.deposit_slip);
  formData.append("status", paymentInBouncedStatus.status);
  return axios.put(
    `${url.UPDATE_PAYMENTINBOUNCED_STATUS}/${paymentInBouncedStatus.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

// ------------- Lab Advertisements Requests START -------------
export const deleteLabAdvertisement = advertisement =>
  del(`${url.DELETE_LAB_ADVERTISEMENT}/${advertisement.id}`, {
    headers: getHeader(authHeader()),
  });


export const getPaymentStatuss = id =>
  get(`${url.GET_PAYMENT_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
});
export const getDepositStatuss = id =>
  get(`${url.GET_DEPOSIT_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
});
export const getClearStatuss = id =>
  get(`${url.GET_CLEAR_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
});


// ------------- Registration Admin requests START -------------

export const getClearedInPayments = id =>
  get(`${url.GET_CLEARED_IN_PAYMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getApprovedInPayments = id =>
  get(`${url.GET_APPROVED_IN_PAYMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getUnapprovedInPayments = id =>
  get(`${url.GET_UNAPPROVED_IN_PAYMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

  export const updateApproveUnapproveInPayment = data => {
    let formData = new FormData();
    formData.append("id", data.id);
    formData.append("is_approved", data.is_approved);
  
    return axios.put(`${url.UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT}/${data.id}`, formData, {
      headers: getHeader(authHeader()),
    });
  };


// ------------- Advertisement Price List Requests START -------------
export const getAdvertisementPriceLists = () =>
  get(`${url.GET_ADVERTISEMENT_PRICE_LISTS}`, {
    headers: getHeader(authHeader()),
  });

export const addNewAdvertisementPriceList = (advertisementPriceList, id) => {
  let formData = new FormData();
  formData.append("amount", advertisementPriceList.amount);
  formData.append("number_of_days", advertisementPriceList.number_of_days);
  formData.append("entered_at", advertisementPriceList.entered_at);

  return axios.post(`${url.ADD_NEW_ADVERTISEMENT_PRICE_LIST}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// BANK ACCOUNTS
export const getBankaccounts = id =>
  get(`${url.GET_BANKACCOUNTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateBankaccount = bankAccount => {
  let formData = new FormData();
  formData.append("id", bankAccount.id);
  formData.append("account_no", bankAccount.account_no);
  formData.append("status", bankAccount.status);

  return axios.put(`${url.UPDATE_BANKACCOUNT}/${bankAccount.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// export const deleteBankaccount = pathologist =>
//   del(`${url.DELETE_BANKACCOUNT}/${pathologist.id}`, {
//     headers: getHeader(authHeader()),
//   });

export const getOutPayment = id =>
get(`${url.GET_OUT_PAYMENT}/${id}`, {
  headers: getHeader(authHeader()),
});
export const getLabsMof = ()=>
get(`${url.GET_LABS_MOF}`, {
  headers: getHeader(authHeader()),
});

// ------------- inPayments Settings Requests START -------------
export const addNewOutPayment = ( outPayment, id) => {
  let formData = new FormData();
  formData.append("payment_for",  outPayment.payment_for);
  formData.append("lab_id",   outPayment.lab_id);
  formData.append("b2b_id",   outPayment.b2b_id);
  formData.append("payment_method",   outPayment.payment_method);
  formData.append("bankaccount_id",   outPayment.bankaccount_id);
  // formData.append("bank_id",   outPayment.bank_id);
  formData.append("amount",   outPayment.amount);
  formData.append("payment_at",  outPayment.payment_at);
  formData.append("cheque_no",  outPayment.cheque_no);
  formData.append("deposit_copy",   outPayment.deposit_copy);
  formData.append("refered_no",   outPayment.refered_no);
  formData.append("status",   outPayment.status);
  // formData.append("is_cleared",  outPayment.is_cleared);
  // formData.append("cleared_at",   outPayment.cleared_at);
  formData.append("comments",  outPayment.comments);


  return axios.post(`${url.ADD_NEW_OUT_PAYMENT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getPaymentOutStatuss = id =>
  get(`${url.GET_PAYMENTOUT_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getBouncedStatuss = id =>
  get(`${url.GET_BOUNCED_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getBouncedInStatuss = id =>
  get(`${url.GET_BOUNCEDIN_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getCreatedOutStatuss = id =>
  get(`${url.GET_CREATEDOUT_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
  });
// ------------- PAYMENT IN STATUS---------------------
export const updatePaymentOutStatus = paymentOutStatus => {
  let formData = new FormData();
  formData.append("is_cleared",  paymentOutStatus.is_cleared);
  return axios.put(
    `${url.UPDATE_PAYMENTOUT_STATUS}/${paymentOutStatus.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const updatePaymentOutCreatedStatuss = paymentOutCreatedStatuss => {
  let formData = new FormData();
  // formData.append("payment_for",  paymentOutCreatedStatuss.payment_for);
  // formData.append("lab_id",   paymentOutCreatedStatuss.lab_id);
  // formData.append("b2b_id",   paymentOutCreatedStatuss.b2b_id);
  formData.append("amount",   paymentOutCreatedStatuss.amount);
  formData.append("cheque_no",  paymentOutCreatedStatuss.cheque_no);
  formData.append("payment_at",  paymentOutCreatedStatuss.payment_at);
  formData.append("deposit_copy",   paymentOutCreatedStatuss.deposit_copy);
  formData.append("payment_method",   paymentOutCreatedStatuss.payment_method);
  // formData.append("bankaccount_id",   paymentOutCreatedStatuss.bankaccount_id);
  // formData.append("bank_id",   paymentOutCreatedStatuss.bank_id);
  // formData.append("refered_no",   paymentOutCreatedStatuss.refered_no);
  // formData.append("cleared_at",   paymentOutCreatedStatuss.cleared_at);
  formData.append("status",  paymentOutCreatedStatuss.status);
  formData.append("comments",  paymentOutCreatedStatuss.comments);

  return axios.put(
    `${url.UPDATE_PAYMENTOUTCREATED_STATUS}/${paymentOutCreatedStatuss.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};
    
export const updateAdvertisementPriceList = advertisementPriceList => {
  let formData = new FormData();
  formData.append("amount", advertisementPriceList.amount);
  formData.append("number_of_days", advertisementPriceList.number_of_days);
  formData.append("entered_at", advertisementPriceList.entered_at);

  return axios.put(
    `${url.UPDATE_ADVERTISEMENT_PRICE_LIST}/${advertisement.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const deleteAdvertisementPriceList = advertisementPriceList =>
  del(`${url.DELETE_ADVERTISEMENT_PRICE_LIST}/${advertisementPriceList.id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Lab Advertisements Requests TO labhazir START -------------
export const getLabAdvertisementRequests = id =>
  get(`${url.GET_LAB_ADVERTISEMENT_REQUESTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateLabAdvertisementRequest = advertisement => {
  let formData = new FormData();
   formData.append("id", advertisement.id);
  // formData.append("title", advertisement.title);
  // formData.append("poster", advertisement.poster);
  // formData.append("description", advertisement.description);
  // formData.append("posted_at", advertisement.posted_at);
  // formData.append("posted_till", advertisement.posted_till);
  // formData.append("region_type", advertisement.region_type);
  // formData.append("province", advertisement.province);
  // formData.append("city", advertisement.city);
  // formData.append("district", advertisement.district);
  // formData.append("amount", advertisement.amount);
  // formData.append("number_of_days", advertisement.number_of_days);
  formData.append("request_status", advertisement.request_status);
  formData.append("declined_reason", advertisement.declined_reason);
  formData.append("responded_at", advertisement.responded_at);

  return axios.put(
    `${url.UPDATE_LAB_ADVERTISEMENT_REQUEST}/${advertisement.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const deletePaymentout = paymentout =>
  del(`${url.DELETE_PAYMENTOUT}/${paymentout.id}`, {
    headers: getHeader(authHeader()),
  });


// ------------- Accepeted Lab Advertisements Requests TO labhazir START -------------
export const getLabAdvertisementRequestsAccepted= () =>
  get(`${url.GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Advertisements Live START -------------
export const getAdvertisementLives=() =>
  get(`${url.GET_ADVERTISEMENT_LIVES}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Advertisements Live START -------------
export const getAdvLive=() =>
  get(`${url.GET_ADV_LIVE}`, {
    headers: getHeader(authHeader()),
  });

//------------ Get Advertisement Invoice Detail-------------
export const getAdvInvoiceDetail = id =>
  get(`${url.GET_ADV_INVOICE_DETAIL}/${id}`, {
    headers: getHeader(authHeader()),
  });

//------------ Get Territories List-------------
  export const getTerritoriesList = ()=>
  get(`${url.GET_TERRITORIES_LIST}`, {
    headers: getHeader(authHeader()),
  });


//------------ Get CSR Central Territories List-------------
export const getCsrCentralList = ()=>
get(`${url.GET_CSR_CENTRAL_TERRITORY_LIST}`, {
  headers: getHeader(authHeader()),
});

//------------ Get CSR SOUTH Territories List-------------
export const getCsrSouthList = ()=>
get(`${url.GET_CSR_SOUTH_TERRITORY_LIST}`, {
  headers: getHeader(authHeader()),
});

//------------ Get CSR NORTH Territories List-------------
export const getCsrNorthList = ()=>
get(`${url.GET_CSR_NORTH_TERRITORY_LIST}`, {
  headers: getHeader(authHeader()),
});

//------------ Get AUDITOR Central Territories List-------------
export const getAuditorCentralList = ()=>
get(`${url.GET_AUDITOR_CENTRAL_TERRITORY_LIST}`, {
  headers: getHeader(authHeader()),
});

//------------ Get Auditor SOUTH Territories List-------------
export const getAuditorSouthList = ()=>
get(`${url.GET_AUDITOR_SOUTH_TERRITORY_LIST}`, {
  headers: getHeader(authHeader()),
});

//------------ Get Auditor NORTH Territories List-------------
export const getAuditorNorthList = ()=>
get(`${url.GET_AUDITOR_NORTH_TERRITORY_LIST}`, {
  headers: getHeader(authHeader()),
});