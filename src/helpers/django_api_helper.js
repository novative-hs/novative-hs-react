import { identity } from "@fullcalendar/core";
import axios from "axios";

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
export const postRegister = user => {
  let formData = new FormData();
  formData.append("name", user.name);
  formData.append("email", user.email);
  formData.append("phone", user.phone);
  formData.append("type", user.type);
  formData.append("sector", user.sector);
  formData.append("designation", user.designation);
  formData.append("address", user.address);
  formData.append("added_by", user.added_by);
  formData.append("password", user.password);
  formData.append("password2", user.password2);
  formData.append("email_participant", user.email_participant);
  formData.append("city", user.city);
  formData.append("country", user.country);
  formData.append("province", user.province);
  formData.append("billing_address", user.billing_address);
  formData.append("shipping_address", user.shipping_address);
  formData.append("department", user.department);
  formData.append("district", user.district);
  formData.append("lab_staff_name", user.lab_staff_name);
  formData.append("landline_registered_by", user.landline_registered_by);
  formData.append("website", user.website);
  formData.append("username", user.username);
  formData.append("password2", user.password2);
  formData.append("password", user.password);
  formData.append("account_type", user.account_type);
  formData.append("added_by", user.added_by);

  console.log("data", user);

  return axios
    .post(`${url.POST_REGISTER}`, formData, {
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
// Post Register Information to create account
// export const postRegister = user => {
//   console.log("django user", user)

//   return axios
//     .post(url.POST_REGISTER, user)
//     .then(response => {
//       if (response.status >= 200 || response.status <= 299)
//         return response.data;
//       throw response.data;
//     }
//     )

//     .catch(err => {
//       let message;
//       if (err.response && err.response.status) {
//         switch (err.response.status) {
//           case 400:
//             message = err.response.data;
//             break;
//           case 404:
//             message = "Sorry! the page you are looking for could not be found";
//             break;
//           case 500:
//             message =
//               "Sorry! something went wrong, please contact our support team";
//             break;
//           case 401:
//             message = "Invalid credentials";
//             break;
//           default:
//             message = err[1];
//             break;
//         }
//       }
//       throw message;

//     }
//     );
// };

export const organizationRegister = user => {
  let formData = new FormData();
  formData.append("username", user.username);
  formData.append("password2", user.password2);
  formData.append("email_for_particiepnts", user.email_for_particiepnts);
  formData.append("password_for_particiepnts", user.password_for_particiepnts);
  formData.append("password", user.password);
  formData.append("country", user.country);
  formData.append("account_type", user.account_type);
  formData.append("name", user.name);
  formData.append("email", user.email);
  formData.append("currency", user.currency);
  formData.append("payment_proof", user.payment_proof);
  formData.append("amount", user.amount);
  formData.append("issue_date", user.issue_date);
  formData.append("closing_date", user.closing_date);
  formData.append("website", user.website);
  formData.append("logo", user.photo);
  console.log("data", user);

  return axios
    .post(`${url.ORGANIZATION_REGISTER}`, formData, {
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

export const getOrganizationlist = () => {
  return axios
    .get(url.GET_ORGANIZATION_LIST, {
      headers: getHeader(authHeader()),
    })
    .then(response => {
      console.log("getOrganizationList response:", response); // Log the entire response for debugging
      return response; // Return the response to the caller
    })
    .catch(error => {
      console.error("Error fetching organization list:", error); // Log any errors that occur
      throw error; // Re-throw the error for handling in the calling code
    });
};

// helper.js

export const updateOrganizationList = async organization => {
  let formData = new FormData();
  formData.append("id", organization.id); // Include the organization ID in the form data
  formData.append("name", organization.name);
  formData.append("email", organization.email);
  formData.append("website", organization.website);
  formData.append("country", organization.country);
  formData.append("status", organization.status);
  formData.append("currency", organization.currency);
  formData.append("amount", organization.amount);
  formData.append("issue_date", organization.issue_date);
  formData.append("closing_date", organization.closing_date);
  formData.append("photo", organization.photo);
  formData.append("payment_proof", organization.payment_proof);

  return axios
    .put(`${url.UPDATE_ORGANIZATION_LIST}/${organization.id}`, formData, {
      headers: getHeader(authHeader()),
    })
    .then(response => {
      console.log("updateNewOrganization response:", response); // Log the entire response for debugging
      return response; // Return the response to the caller
    })
    .catch(error => {
      console.error("Error updating organization:", error); // Log any errors that occur
      throw error; // Re-throw the error for handling in the calling code
    });
};

export const deleteOrganizationList = organization =>
  del(`${url.DELETE_ORGANIZATION_LIST}/${organization.id}`, {
    headers: getHeader(authHeader()),
  });



// Post Lab Information
export const postLabInformation = (id, lab) => {
  let formData = new FormData();
  formData.append("name", lab.name);
  formData.append("city", lab.city);
  formData.append("department", lab.department);
  formData.append("organization", lab.organization);
  formData.append("country", lab.country);
  formData.append("postalcode", lab.postalcode);
  formData.append(
    "is_registering_for_first_time",
    lab.is_registering_for_first_time
  );
  formData.append("fax", lab.fax);
  formData.append("email", lab.email);
  // formData.append("logo", lab.logo);
  // formData.append("owner_name", lab.owner_name);
  // formData.append("registration_no", lab.registration_no);
  // formData.append("health_dept_certificate", lab.health_dept_certificate);
  formData.append("national_taxation_no", lab.national_taxation_no);
  // formData.append("is_iso_certified", lab.is_iso_certified);
  // formData.append("iso_certificate", lab.iso_certificate);
  // formData.append("lab_experience", lab.lab_experience);
  formData.append("is_homesampling_offered", lab.is_homesampling_offered);
  formData.append("home_sampling_charges", lab.home_sampling_charges);
  formData.append("state_sampling_charges", lab.state_sampling_charges);
  formData.append("state_sampling_time", lab.state_sampling_time);
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

  console.log("djangooooo user", lab);
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
  // formData.append("logo", corporate.logo);
  formData.append("national_taxation_no", corporate.national_taxation_no);
  formData.append("email", corporate.email);
  formData.append("phone", corporate.phone);
  formData.append("landline", corporate.landline);
  formData.append("address", corporate.address);
  formData.append("city_id", corporate.city_id);
  formData.append("website_url", corporate.website_url);
  formData.append("payment_terms", corporate.payment_terms);
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
  formData.append("guest_id", user.guest_id);

  console.log("django api", user);
  return axios.post(url.POST_LOGIN, formData, {
    headers: getHeader(authHeader()),
  });
};
//////////////////////////
export const getNews = id =>
  get(`${url.GET_NEWS}/${id}`, {
    headers: getHeader(authHeader()),
  });
// export const getNews = (id) =>
//   get(`${url.GET_NEWS}/${id}`, {
//     headers: getHeader(authHeader()),
//   }).then(response => {
//     console.log('News response:', response.data); // Add console log here to see data
//     return response.data; // Return the data for further handling in Redux
//   }).catch(error => {
//     console.error('Error fetching news:', error); // Handle errors if needed
//     throw error; // Propagate the error for further handling
//   });

//For Participants
// export const getNewsParticipant = (id) =>
//   get(`${url.GET_NEWS_PARTICIPANT}/${id}`, {
//     headers: getHeader(authHeader()),
//   });
//******************************* */
export const addNews = news => {
  console.log("Calling addNews function with data:", news);
  let formData = new FormData();
  formData.append("title", news.title);

  formData.append("description", news.description);
  formData.append("added_by", news.added_by);
  if (news.picture) {
    formData.append("picture", news.picture);
  }
  // console.log("fffffffffform", formData)
  // Log each key-value pair in the FormData
  //  formData.forEach((value, key) => {
  //   console.log("form dataaaaaaaaaaaaa", key, value);
  // });
  return axios.post(`${url.ADD_NEWS}`, formData, {
    headers: getHeader(authHeader()),
  });
};
// export const addNews = (news) => {
//   console.log("Calling addNews function with data:", news); // Add console log to check if function is called

//   let formData = new FormData();
//   formData.append("title", news.title);
//   formData.append("description", news.description);
//   formData.append("added_by", news.added_by);

//   if (news.picture) {
//     formData.append("picture", news.picture);
//   }

//   return axios.post(url.ADD_NEWS, formData, {
//     headers: {
//       ...getHeader(authHeader()), // Assuming getHeader returns headers object
//       'Content-Type': 'multipart/form-data',  // Ensure correct content type for FormData
//       // Add any additional headers if needed
//     },
//   })
//   .then(response => {
//     console.log("aaaaaaaaaaaaaaaaaa:", response.data);
//     return response.data; // Return data if successful
//   })
//   .catch(error => {
//     console.error("bbbbbbbbbbbbbbbbb:", error);
//     throw error; // Throw error to handle it in your Redux action or component
//   });
// };

export const addParticipants = register => {
  let formData = new FormData();
  formData.append("name", register.name);
  formData.append("user_name", register.user_name);
  formData.append("email", register.email);
  formData.append("phone", register.phone);
  formData.append("type", register.type);
  formData.append("sector", register.sector);
  formData.append("designation", register.designation);
  formData.append("address", register.address);
  formData.append("password_foradmins", register.password_foradmins);
  formData.append("added_by", register.added_by);
  formData.append("password", register.password);
  formData.append("password2", register.password2);
  formData.append("email_participant", register.email_participant);
  formData.append("city", register.city);
  formData.append("country", register.country);
  formData.append("province", register.province);
  formData.append("billing_address", register.billing_address);
  formData.append("shipping_address", register.shipping_address);
  formData.append("department", register.department);
  formData.append("district", register.district);
  formData.append("lab_staff_name", register.lab_staff_name);
  formData.append("landline_registered_by", register.landline_registered_by);
  formData.append("website", register.website);
  return axios.post(`${url.REGISTER_PARTICIPANT_LIST}`, formData, {
    headers: getHeader(authHeader()),
  });
};

//---------------database admin get units list-------
///////////instrumentlist/////////////
export const getInstrumentlist = id =>
  get(`${url.GET_INSTRUMENT_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const addNewInstrument = createUnit => {
  let formData = new FormData();
  formData.append("name", createUnit.name);
  formData.append("added_by", createUnit.added_by);
  formData.append("code", createUnit.code);
  formData.append("model", createUnit.model);
  formData.append("status", createUnit.status);
  formData.append("instrument_type", createUnit.instrument_type);
  formData.append("manufactural", createUnit.manufactural);
  formData.append("country", createUnit.country);
    return axios.post(`${url.ADD_NEW_INSTRUMENT}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
  export const addEquipmentTypefile = (EquipmentData) => {
    let formData = new FormData();
    formData.append("excel_file", EquipmentData.excel_file);

    console.log("django api helper", EquipmentData)
  
    return axios.post(`${url.ADD_EQUIPMENTTYPE_FILE}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
  export const updateInstrument = unit => {
    let formData = new FormData();
    formData.append("name", unit.name);
    formData.append("added_by", unit.added_by);
    formData.append("code", unit.code);
    formData.append("model", unit.model);
    formData.append("status", unit.status);
    formData.append("instrument_type", unit.instrument_type);
    formData.append("manufactural", unit.manufactural);
    formData.append("country", unit.country);
    return axios.put(
      `${url.UPDATE_NEW_INSTRUMENT}/${unit.id}`,
      formData,
      {
        headers: getHeader(authHeader()),
      }
    );
  };
  export const deleteInstrument = Instrument =>
    del(`${url.DELETE_INSTRUMENT}/${Instrument.id}`, {
      headers: getHeader(authHeader()),
    });

export const getUnitsList = id => {
  if (id) {
    return get(`${url.GET_UNITS_LIST}/${id}`, {
      headers: getHeader(authHeader()),
    });
  } else {
    console.error("Invalid id:", id);
    return Promise.reject("Invalid id");
  }
};

export const addNewCreateUnits = createUnit => {
  let formData = new FormData();
  formData.append("name", createUnit.name);
  formData.append("added_by", createUnit.added_by);
  return axios.post(`${url.ADD_NEW_UNITS}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateUnits = unit => {
  let formData = new FormData();
  // Make sure 'unit' object contains 'id' field
  console.log("id received is ", unit.id);
  formData.append("id", unit.id);
  formData.append("name", unit.name);
  formData.append("added_by", unit.added_by);
  return axios.put(`${url.UPDATE_UNITS}/${unit.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getQualitativeTypeList = id => {
  if (id) {
      return get(`${url.GET_QualitativeType_LIST}/${id}`, {
          headers: getHeader(authHeader()),
      });
  } else {
      console.error('Invalid id:', id);
      return Promise.reject('Invalid id');
  }
};

export const addNewCreateQualitativeType = (createQualitativeType) => {
let formData = new FormData();
formData.append("name", createQualitativeType.name);
formData.append("number", createQualitativeType.number);
formData.append("added_by", createQualitativeType.added_by);
return axios.post(`${url.ADD_NEW_QualitativeType}`, formData, {
  headers: getHeader(authHeader()),
});
};
export const updateQualitativeType = qualitativetype => {
let formData = new FormData();
// Make sure 'qualitativetype' object contains 'id' field
console.log("id received is ", qualitativetype.id)
formData.append("id", qualitativetype.id);
formData.append("name", qualitativetype.name);
formData.append("number", qualitativetype.number);
formData.append("added_by", qualitativetype.added_by);
return axios.put(
  `${url.UPDATE_QualitativeType}/${qualitativetype.id}`,
  formData,
  {
    headers: getHeader(authHeader()),
  }
);
};



export const getHistoryUnits = (id, type) => {
  console.log("ID and type passed to getHistoryUnits:", id, type);
  return get(`${url.GET_HISTORY_LIST}/${id}`, {
    headers: getHeader(authHeader()),
    params: { type }, // Send type as a query parameter
  });
};

export const getHistoryRounds = (id) => {
  console.log("getHistoryRounds:", id);
  return get(`${url.GET_HISTORY_LIST_ROUND}/${id}`, {
    headers: getHeader(authHeader()),
  });
};
export const getResultHistory = (id, participantId, scheme_id) => {
  return get(`${url.GET_RESULT_HISTORY}/${id}`, {
    headers: getHeader(authHeader()),
    params: { participantId, scheme_id },
  });
};


// Sample
 export const getSamplelist = (id) =>
    get(`${url.GET_SAMPLE_LIST}/${id}`, {
      headers: getHeader(authHeader()),
    });
/////////////////////////////////
  export const addNewSampleList = sample => {
    let formData = new FormData();
    formData.append("samplename", sample.samplename);
    formData.append("added_by", sample.added_by);
    formData.append("sampleno", sample.sampleno);
    formData.append("scheme", sample.scheme);
    formData.append("detail", sample.detail);
    formData.append("notes", sample.notes);
    formData.append("status", sample.status);
    return axios.post(`${url.ADD_NEW_SAMPLE_LIST}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
//////////////////////////////////////
export const updateSampleList = sample => {
    let formData = new FormData();
    formData.append("samplename", sample.samplename);
    formData.append("sampleno", sample.sampleno);
    formData.append("scheme", sample.scheme);
    formData.append("cycle", sample.cycle);
    formData.append("round", sample.round);
    formData.append("detail", sample.detail);
    formData.append("notes", sample.notes);
    formData.append("added_by", sample.added_by);
    
    return axios.put(
      `${url.UPDATE_NEW_SAMPLE_LIST}/${sample.id}`,
        formData,
        {
            headers: getHeader(authHeader()),
        }
    );
};
///////////////////////
export const deleteSampleList = sample =>
  del(`${url.DELETE_NEW_SAMPLE_LIST}/${sample.id}`, {
    headers: getHeader(authHeader()),
  });
  
/////////Analyte Sample List
export const getSampleAnalytelist = (id) =>
  get(`${url.GET_SAMPLE_ANALYTE_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewSampleAnalytelist = (createSchemeAnalyte) => {
  let formData = new FormData();
  formData.append("analytes", createSchemeAnalyte.analytes);
  formData.append("added_by", createSchemeAnalyte.added_by);
  return axios.post(`${url.ADD_SAMPLE_ANALYTE_LIST}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateSampleAnalytelist = schemeanalyte => {
  let formData = new FormData();
  formData.append("analytes", schemeanalyte.analytes);
  return axios.put(
    `${url.UPDATE_SAMPLE_ANALYTE_LIST}/${schemeanalyte.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

//---------------database admin get Reagents list-------
export const getReagentsList = id =>
  get(`${url.GET_REAGENTS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

//---------------Get Participant List-------
export const getParticipantList = id =>
  get(`${url.GET_PARTICIPANT_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

//---------------Get ParticipantRound List-------
export const getParticipantRoundList = id =>
  get(`${url.GET_PARTICIPANTROUND_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

//---------------Round add Labs-------
export const getRoundLablist = id =>
  get(`${url.GET_ROUND_LABS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getSelectedSchemesList = id =>
  get(`${url.SELECTED_SCHEMES}/${id}`, {
    headers: getHeader(authHeader()),
  });
//------------- results page
export const getSchemeAnalytesList = id =>
  get(`${url.SCHEMES_ANALYTES}/${id}`, {
    headers: getHeader(authHeader()),
  });

//Get result list
export const getResultsList = id =>
  get(`${url.GET_RESULT}/${id}`, {
    headers: getHeader(authHeader()),
  });

//submit result lab count 
export const getResultSubmit = id =>
  get(`${url.GET_RESULT_SUBMIT}/${id}`, {
    headers: getHeader(authHeader()),
  });
// export const getReport = id =>
//   get(`${url.GET_REPORT}/${id}`, {
//     headers: getHeader(authHeader()),
//   });
export const getReport = id => 
  get(`${url.GET_REPORT}/${id}`, {
    headers: getHeader(authHeader()),
  }).then(response => {
    console.log("API Raw Response:", response); // Log the raw response
    return response; // Ensure response is being returned correctly
  }).catch(error => {
    console.error("Error in API Call:", error);
  });
  
//Participant result POST
export const postResult = (result, id) => {
  let formData = new FormData();
  formData.append("round_id", result.round_id);
  formData.append("analyte_id", result.analyte_id);
  formData.append("unit_name", result.unit_name);
  formData.append("instrument_name", result.instrument_name);
  formData.append("method_name", result.method_name);
  formData.append("reagent_name", result.reagent_name);
  formData.append("result", result.result);
  formData.append("rounds", result.rounds);
  formData.append("round_status", result.round_status);
  formData.append("scheme_id", result.scheme_id);
  formData.append("result_status", result.result_status);
  formData.append("result_type", result.result_type);

  return axios.post(`${url.POST_RESULT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// export const getSchemeAnalytesList = (id) => {
//   return axios.get(`${url.SCHEMES_ANALYTES}/${id}`, {
//     headers: getHeader(authHeader()), // Ensure getHeader and authHeader are correct
//   })
//   .then(response => {
//     // Log the response data
//     console.log("Response data:", response.data);
//     return response; // Return the response for further use
//   })
//   .catch(error => {
//     // Log any errors encountered
//     console.error("Error fetching data:", error);
//     throw error; // Rethrow the error to be handled by the caller
//   });
// };
export const addNewRoundLablist = createRoundLab => {
  let formData = new FormData();
  formData.append("participants", createRoundLab.participants);
  formData.append("added_by", createRoundLab.added_by);
  return axios.post(`${url.ADD_ROUND_LABS}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateRoundLablist = roundslab => {
  let formData = new FormData();
  formData.append("participants", roundslab.participants);
  return axios.put(`${url.UPDATE_ROUNDLABS}/${roundslab.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const addNewReagents = createReagent => {
  let formData = new FormData();
  formData.append("name", createReagent.name);
  formData.append("code", createReagent.code);
  formData.append("status", createReagent.status);
  formData.append("added_by", createReagent.added_by);
  formData.append("manufactural", createReagent.manufactural);
  formData.append("country", createReagent.country);
  return axios.post(`${url.ADD_NEW_REAGENTS}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateReagents = reagent => {
  let formData = new FormData();

  console.log("id received is ", reagent.id);
  formData.append("id", reagent.id);
  formData.append("code", reagent.code);
  formData.append("status", reagent.status);
  formData.append("name", reagent.name);
  formData.append("added_by", reagent.added_by);
  formData.append("manufactural", reagent.manufactural);
  formData.append("country", reagent.country);
  return axios.put(`${url.UPDATE_REAGENTS}/${reagent.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const deleteReagent = Reagent =>
  del(`${url.DELETE_REAGENT}/${Reagent.id}`, {
    headers: getHeader(authHeader()),
  });

//---------------Analyte add Reagents-------
export const getAnalyteReagentlist = id =>
  get(`${url.GET_ANALYTE_REAGENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewAnalyteReagentlist = createAnalyteReagent => {
  let formData = new FormData();
  formData.append("reagents", createAnalyteReagent.reagents);
  formData.append("added_by", createAnalyteReagent.added_by);
  return axios.post(`${url.ADD_ANALYTE_REAGENTS}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateAnalyteReagentlist = analytesreagent => {
  let formData = new FormData();
  formData.append("reagents", analytesreagent.reagents);
  return axios.put(
    `${url.UPDATE_ANALYTEREAGENTS}/${analytesreagent.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

//---------------Analyte add Qualitative-------
export const getAnalyteQualitativelist = (id) =>
  get(`${url.GET_ANALYTE_QUALITATIVE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewAnalyteQualitativelist = (createAnalyteReagent) => {
  let formData = new FormData();
  formData.append("qualitativetype", createAnalyteReagent.reagents);
  formData.append("added_by", createAnalyteReagent.added_by);
  return axios.post(`${url.ADD_ANALYTE_QUALITATIVE}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateAnalyteQualitativelist = analytesreagent => {
  let formData = new FormData();
  formData.append("qualitativetype", analytesreagent.reagents);
  return axios.put(
    `${url.UPDATE_ANALYTEQUALITATIVE}/${analytesreagent.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};
///////analytes associated with unit
export const getAnalyteUnit = id =>
  get(`${url.GET_ANALYTESUNITS}/${id}`, {
    headers: getHeader(authHeader()),
  });

///////analytes associated with REAGENT
export const getAnalyteReagent = id =>
  get(`${url.GET_ANALYTESREAGENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

///////analytes associated with INSTRUMENT
export const getAnalyteInstrument = id =>
  get(`${url.GET_ANALYTESINSTRUMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

///////analytes associated with METHOD
export const getAnalyteMethod = id =>
  get(`${url.GET_ANALYTESMETHODS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const instrumentsintype = id =>
  get(`${url.GET_INSTRUMENTSINTYPE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const instrumentsinmaufacturer = id =>
  get(`${url.GET_INSTRUMENTSINMANUFACTURER}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const reagentsinmaufacturer = id =>
  get(`${url.GET_REAGENTSINMANUFACTURER}/${id}`, {
    headers: getHeader(authHeader()),
  });

//---------------Analyte add Units-------
export const getAnalyteUnitlist = id =>
  get(`${url.GET_ANALYTESUNITS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewAnalyteUnitlist = createAnalyteUnit => {
  let formData = new FormData();
  formData.append("units", createAnalyteUnit.units);
  formData.append("added_by", createAnalyteUnit.added_by);
  formData.append("masterUnit", createAnalyteUnit.masterUnit);

  return axios.post(`${url.ADD_NEW_ANALYTESUNITS}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateAnalyteUnitlist = analytesunit => {
  let formData = new FormData();
  formData.append("units", analytesunit.units);
  formData.append("masterUnit", analytesunit.masterUnit);
  return axios.put(
    `${url.UPDATE_ANALYTESUNITS}/${analytesunit.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

//---------------Analyte add Methods-------
export const getAnalytemethodlist = id =>
  get(`${url.GET_ANALYTESMETHODS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewAnalytemethodlist = createAnalyteMethod => {
  let formData = new FormData();
  formData.append("methods", createAnalyteMethod.methods);
  formData.append("added_by", createAnalyteMethod.added_by);
  return axios.post(`${url.ADD_NEW_ANALYTESMETHODS}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateAnalytemethodlist = analytesmethod => {
  let formData = new FormData();
  formData.append("methods", analytesmethod.methods);
  return axios.put(
    `${url.UPDATE_ANALYTESMETHODS}/${analytesmethod.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

//---------------Analyte add Equipments-------
export const getAnalyteEquipmentlist = id =>
  get(`${url.GET_ANALYTESEQUIPMENTS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewAnalyteEquipmentlist = createAnalyteEquipment => {
  let formData = new FormData();
  formData.append("equipments", createAnalyteEquipment.equipments);
  formData.append("added_by", createAnalyteEquipment.added_by);
  return axios.post(`${url.ADD_NEW_ANALYTESEQUIPMENTS}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateAnalyteEquipmentlist = analytesequipment => {
  let formData = new FormData();
  formData.append("equipments", analytesequipment.equipments);
  return axios.put(
    `${url.UPDATE_ANALYTESEQUIPMENTS}/${analytesequipment.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};
//---------------database admin get Manufactural list-------
export const getManufacturalList = id =>
  get(`${url.GET_MANUFACTURAL_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewManufactural = createManufactural => {
  let formData = new FormData();
  formData.append("name", createManufactural.name);
  formData.append("website", createManufactural.website);
  formData.append("country", createManufactural.country);
  formData.append("added_by", createManufactural.added_by);
  return axios.post(`${url.ADD_NEW_MANUFACTURAL}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateManufactural = manufactural => {
  let formData = new FormData();

  console.log("id received is ", manufactural);
  formData.append("id", manufactural.id);
  formData.append("name", manufactural.name);
  formData.append("website", manufactural.website);
  formData.append("country", manufactural.country);
  formData.append("added_by", manufactural.added_by);
  return axios.put(`${url.UPDATE_MANUFACTURAL}/${manufactural.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const deleteManufacturer = Analyte =>
  del(`${url.DELETE_MANUFACTURER}/${Analyte.id}`, {
    headers: getHeader(authHeader()),
  });

export const getInstrumenttypelist = id =>
  get(`${url.GET_INSTRUMENT_TYPE_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

// export const getSharedPercentageApprovedFeeTests = id =>
//   get(`${url.GET_SHARED_PERCENTAGE_APPROVED_FEE}/${id}`, {
//     headers: getHeader(authHeader()),
//   });

export const addNewInstrumentType = createUnit => {
  let formData = new FormData();
  formData.append("name", createUnit.name);
  formData.append("added_by", createUnit.added_by);
  return axios.post(`${url.ADD_NEW_INSTRUMENT_TYPE}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateNewInstrumentType = unit => {
  let formData = new FormData();
  formData.append("name", unit.name);
  formData.append("added_by", unit.added_by);
  return axios.put(`${url.UPDATE_NEW_INSTRUMENT_TYPE}/${unit.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const deleteInstrumentType = InstrumentType =>
  del(`${url.DELETE_INSTRUMENT_TYPE}/${InstrumentType.id}`, {
    headers: getHeader(authHeader()),
  });

///////////methodlist/////////////n
export const getMethodlist = id =>
  get(`${url.GET_METHOD_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const addNewMethod = createUnit => {
  let formData = new FormData();
  formData.append("name", createUnit.name);
  formData.append("added_by", createUnit.added_by);
  formData.append("code", createUnit.code);
  formData.append("status", createUnit.status);
  return axios.post(`${url.ADD_NEW_METHOD}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateMethod = unit => {
  let formData = new FormData();
  formData.append("name", unit.name);
  formData.append("added_by", unit.added_by);
  formData.append("code", unit.code);
  formData.append("status", unit.status);
  return axios.put(`${url.UPDATE_METHOD}/${unit.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateMembershipstatus = status => {
  let formData = new FormData();
  formData.append("membership_status", status.membership_status);
  formData.append("added_by", status.added_by);
  return axios.put(
    `${url.UPDATE_MEMBERSHIP_STATUS}/${status.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const deleteMethod = Method =>
  del(`${url.DELETE_METHOD}/${Method.id}`, {
    headers: getHeader(authHeader()),
  });
///////////Scheme list/////////////
export const getSchemelist = id =>
  get(`${url.GET_SCHEME_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const addNewScheme = (createUnit, id) => {
  let formData = new FormData();
  formData.append("name", createUnit.name);
  formData.append("price", createUnit.price);
  formData.append("analytetype", createUnit.analytetype);
  formData.append("added_by", createUnit.added_by);
  formData.append("status", createUnit.status);
  return axios.post(`${url.ADD_NEW_SCHEME}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateScheme = unit => {
  let formData = new FormData();
  formData.append("name", unit.name);
  formData.append("price", unit.price);
  formData.append("added_by", unit.added_by);
  formData.append("analytetype", unit.analytetype);
  formData.append("status", unit.status);
  return axios.put(`${url.UPDATE_SCHEME}/${unit.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const deleteScheme = unit =>
  del(`${url.DELETE_SCHEME}/${unit.id}`, {
    headers: getHeader(authHeader()),
  });

//////////Cycle List/////////////
export const getCyclelist = id =>
  get(`${url.GET_CYCLE_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const addNewCycle = (createUnit, id) => {
  console.log("Adding New Cycle", createUnit, id);
  let formData = new FormData();
  formData.append("scheme_name", createUnit.scheme_name);
  formData.append("cycle_no", createUnit.cycle_no);
  formData.append("rounds", createUnit.rounds);
  // formData.append("cycle", createUnit.cycle);
  formData.append("start_date", createUnit.start_date);
  formData.append("end_date", createUnit.end_date);
  formData.append("analytes", createUnit.analytes);
  formData.append("status", createUnit.status);
  formData.append("added_by", createUnit.added_by);
  return axios
    .post(`${url.ADD_NEW_CYCLE}`, formData, {
      headers: {
        ...getHeader(authHeader()),
        "Content-Type": "multipart/form-data",
      },
    })
    .then(response => {
      console.log("Cycle added successfully:", response.data);
      return response.data;
    })
    .catch(error => {
      console.error(
        "Error adding cycle:",
        error.response ? error.response.data : error.message
      );
      throw error;
    });
};

export const updateCycle = cycle => {
  let formData = new FormData();
  formData.append("id", cycle.id);
  formData.append("scheme_name", cycle.scheme_name);
  formData.append("cycle_no", cycle.cycle_no);
  formData.append("cycle", cycle.cycle);
  formData.append("start_date", cycle.start_date);
  formData.append("end_date", cycle.end_date);
  formData.append("rounds", cycle.rounds);
  // formData.append("added_by", unit.added_by);
  // formData.append("analytes", cycle.analytes);
  formData.append("status", cycle.status);
  return axios.put(
    `${url.UPDATE_CYCLE}/${cycle.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const deleteCycle = unit =>
  del(`${url.DELETE_CYCLE}/${unit.id}`, {
    headers: getHeader(authHeader()),
  });

//-----------------Payment----------------
export const addNewPayment = (payment, id) => {
  console.log("data in django api helper", payment.participant);
  let formData = new FormData();
  formData.append("participant", payment.participant);
  formData.append("scheme", payment.scheme);
  // formData.append("cycle_no", payment.cycle_no);
  formData.append("price", payment.price);
  formData.append("discount", payment.discount);
  formData.append("paymentmethod", payment.paymentmethod);
  formData.append("paydate", payment.paydate);
  formData.append("photo", payment.photo);
  formData.append("added_by", payment.added_by);
  return axios.post(`${url.ADD_NEW_PAYMENT}`, formData, {
    headers: {
      ...getHeader(authHeader()),
      "Content-Type": "multipart/form-data",
    },
  });
};
// ---------------Scheme add Analytes-------
export const getSchemeAnalytelist = id =>
  get(`${url.GET_SCHEME_ANALYTE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewSchemeAnalytelist = createSchemeAnalyte => {
  let formData = new FormData();
  formData.append("analytes", createSchemeAnalyte.analytes);
  formData.append("added_by", createSchemeAnalyte.added_by);
  return axios.post(`${url.ADD_SCHEME_ANALYTE}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateSchemeAnalytelist = schemeanalyte => {
  let formData = new FormData();
  formData.append("analytes", schemeanalyte.analytes);
  return axios.put(
    `${url.UPDATE_SCHEME_ANALYTE}/${schemeanalyte.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};


/////// Analytes Associated With Cycle
export const getAnalyteCycle = (id) =>
  get(`${url.GET_ANALYTESCYCLES}/${id}`, {
    headers: getHeader(authHeader()),
  });

///////////Analyte list/////////////
export const getAnalytelist = id =>
  get(`${url.GET_ANALYTE_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

///////////Analyte FOR Scheme/////////////
export const getAnalyteforSchemelist = id =>
  get(`${url.GET_ANALYTEFORSCHEME_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewAnalyte = (createUnit) => {
    let formData = new FormData();
    formData.append("name", createUnit.name);
    formData.append("added_by", createUnit.added_by);
    formData.append("code", createUnit.code);
    formData.append("status", createUnit.status);
    return axios.post(`${url.ADD_NEW_ANALYTE}`, formData, {
      headers: getHeader(authHeader()),
    });
  };
  
export const updateAnalyte = unit => {
  let formData = new FormData();
  formData.append("name", unit.name);
  formData.append("added_by", unit.added_by);
  formData.append("code", unit.code);
  formData.append("status", unit.status);

  // Assuming reagents is an array of reagent IDs
  if (unit.reagents && unit.reagents.length > 0) {
    unit.reagents.forEach((reagent, index) => {
      formData.append(`reagents[${index}]`, reagent);
    });
  }

  return axios.put(`${url.UPDATE_ANALYTE}/${unit.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const deleteAnalyte = Analyte =>
  del(`${url.DELETE_ANALYTE}/${Analyte.id}`, {
    headers: getHeader(authHeader()),
  });

////participant city
export const getCityList = id =>
  get(`${url.GET_CITY_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewCreateCity = createCity => {
  let formData = new FormData();
  formData.append("name", createCity.name);
  formData.append("added_by", createCity.added_by);
  return axios.post(`${url.ADD_NEW_CITY}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateCity = city => {
  let formData = new FormData();
  // Make sure 'city' object contains 'id' field
  console.log("id received is ", city.id);
  formData.append("id", city.id);
  formData.append("name", city.name);
  formData.append("added_by", city.added_by);
  return axios.put(`${url.UPDATE_CITY}/${city.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

////participant country
export const getCountryList = id =>
  get(`${url.GET_COUNTRY_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewCreateCountry = createCountry => {
  let formData = new FormData();
  formData.append("name", createCountry.name);
  formData.append("added_by", createCountry.added_by);
  return axios.post(`${url.ADD_NEW_COUNTRY}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateCountry = country => {
  let formData = new FormData();
  // Make sure 'country' object contains 'id' field
  console.log("id received is ", country.id);
  formData.append("id", country.id);
  formData.append("name", country.name);
  formData.append("added_by", country.added_by);
  return axios.put(`${url.UPDATE_COUNTRY}/${country.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

////participant Province
export const getProvinceList = id =>
  get(`${url.GET_PROVINCE_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewCreateProvince = createProvince => {
  let formData = new FormData();
  formData.append("name", createProvince.name);
  formData.append("added_by", createProvince.added_by);
  return axios.post(`${url.ADD_NEW_PROVINCE}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateProvince = province => {
  let formData = new FormData();
  // Make sure 'province' object contains 'id' field
  console.log("id received is ", province.id);
  formData.append("id", province.id);
  formData.append("name", province.name);
  formData.append("added_by", province.added_by);
  return axios.put(`${url.UPDATE_PROVINCE}/${province.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

///participant district
export const getDistrictList = id =>
  get(`${url.GET_DISTRICT_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewCreateDistrict = createDistrict => {
  let formData = new FormData();
  formData.append("name", createDistrict.name);
  formData.append("added_by", createDistrict.added_by);
  return axios.post(`${url.ADD_NEW_DISTRICT}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateDistrict = district => {
  let formData = new FormData();
  console.log("id received is ", district.id);
  formData.append("id", district.id);
  formData.append("name", district.name);
  formData.append("added_by", district.added_by);
  return axios.put(`${url.UPDATE_DISTRICT}/${district.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

///participant department
export const getDepartmentList = id =>
  get(`${url.GET_DEPARTMENT_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewCreateDepartment = createDepartment => {
  let formData = new FormData();
  formData.append("name", createDepartment.name);
  formData.append("added_by", createDepartment.added_by);
  return axios.post(`${url.ADD_NEW_DEPARTMENT}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateDepartment = department => {
  let formData = new FormData();
  console.log("id received is ", department.id);
  formData.append("id", department.id);
  formData.append("name", department.name);
  formData.append("added_by", department.added_by);
  return axios.put(`${url.UPDATE_DEPARTMENT}/${department.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

///participant Designation
export const getDesignationList = id =>
  get(`${url.GET_DESIGNATION_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewCreateDesignation = createDesignation => {
  let formData = new FormData();
  formData.append("name", createDesignation.name);
  formData.append("added_by", createDesignation.added_by);
  return axios.post(`${url.ADD_NEW_DESIGNATION}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateDesignation = designation => {
  let formData = new FormData();
  console.log("id received is ", designation.id);
  formData.append("id", designation.id);
  formData.append("name", designation.name);
  formData.append("added_by", designation.added_by);
  return axios.put(`${url.UPDATE_DESIGNATION}/${designation.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

///participant type
export const getTypeList = id =>
  get(`${url.GET_TYPE_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewCreateType = createType => {
  let formData = new FormData();
  formData.append("name", createType.name);
  formData.append("added_by", createType.added_by);
  return axios.post(`${url.ADD_NEW_TYPE}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateType = type => {
  let formData = new FormData();
  console.log("id received is ", type.id);
  formData.append("id", type.id);
  formData.append("name", type.name);
  formData.append("added_by", type.added_by);
  return axios.put(`${url.UPDATE_TYPE}/${type.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

///participant sector
export const getSectorList = id =>
  get(`${url.GET_SECTOR_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewCreateSector = createSector => {
  let formData = new FormData();
  formData.append("name", createSector.name);
  formData.append("added_by", createSector.added_by);
  return axios.post(`${url.ADD_NEW_SECTOR}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateSector = sector => {
  let formData = new FormData();
  console.log("id received is ", sector.id);
  formData.append("id", sector.id);
  formData.append("name", sector.name);
  formData.append("added_by", sector.added_by);
  return axios.put(`${url.UPDATE_SECTOR}/${sector.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
// ------------- Get Labs Request -------------
export const getLabs = () =>
  get(url.GET_LABS, {
    headers: getHeader(authHeader()),
  });

export const getMainLabs = () =>
  get(url.GET_MAIN_LABS, {
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
export const getCorporateTests = id =>
  get(`${url.GET_CORPORATE_TESTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

// List of Corporate
export const getLabCorporate = id =>
  get(`${url.GET_LABCORPORATE}/${id}`, {
    headers: getHeader(authHeader()),
  });

// List of Corporate

export const getACorporate = () =>
  get(url.GET_ACORPORATE, {
    headers: getHeader(authHeader()),
  });

export const getRFeeCorporate = () =>
  get(url.GET_RFeeCORPORATE, {
    headers: getHeader(authHeader()),
  });

export const updateACorporateStatus = offeredTest => {
  let formData = new FormData();
  formData.append("plateform_charges", offeredTest.plateform_charges);
  // formData.append("is_active", offeredTest.is_active);

  return axios.put(
    `${url.UPDATE_ACORPORATE_STATUS}/${offeredTest.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

// List of Accepted Corporate
export const getALabCorporate = id =>
  get(`${url.GET_ALABCORPORATE}/${id}`, {
    headers: getHeader(authHeader()),
  });

// List of Corporate Employee
export const getEmployeeCorporate = id =>
  get(`${url.GET_EMPLOYEECORPORATE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getLabsCorporate = id =>
  get(`${url.GET_LABSCORPORATE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getOfferedTestsReferrel = id =>
  get(`${url.GET_OFFEREDTEST_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getCOfferedTestsReferrel = id =>
  get(`${url.GET_COFFEREDTEST_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getCOfferedProfilesReferrel = id =>
  get(`${url.GET_COFFEREDPROFILE_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getCOfferedPackagesReferrel = id =>
  get(`${url.GET_COFFEREDPACKAGE_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getCOfferedRadiologysReferrel = id =>
  get(`${url.GET_COFFEREDRADIOLOGY_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getOfferedProfilesReferrel = id =>
  get(`${url.GET_OFFEREDPROFILE_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getOfferedPackagesReferrel = id =>
  get(`${url.GET_OFFEREDPACKAGE_REFERRELFEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getOfferedRadiologysReferrel = id =>
  get(`${url.GET_OFFEREDRADIOLOGY_REFERRELFEE}/${id}`, {
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
  formData.append("is_active", offeredTest.is_active);
  console.log("api helper", offeredTest, id);
  return axios.post(`${url.ADD_NEW_OFFERED_TEST}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const addNewCorporateTest = (offeredTest, id) => {
  let formData = new FormData();
  formData.append("test_id", offeredTest.test_id);
  formData.append("price", offeredTest.price);
  formData.append("start_date", offeredTest.start_date);
  formData.append("end_date", offeredTest.end_date);
  console.log("api helper", offeredTest, id);
  return axios.post(`${url.ADD_NEW_CORPORATE_TEST}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const addNewCorporate = (offeredTest, id) => {
  let formData = new FormData();
  formData.append("corporate_id", offeredTest.corporate_id);
  formData.append("status", offeredTest.status);
  console.log("api helper", offeredTest, id);
  return axios.post(`${url.ADD_NEW_CORPORATE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const addNewOfferedMainTest = (offeredTest, id) => {
  let formData = new FormData();
  formData.append("main_lab_tests", offeredTest.main_lab_tests);
  // formData.append("unit_id", offeredTest.unit_id);
  console.log("dataaaa", offeredTest);
  return axios.post(`${url.ADD_NEW_OFFERED_MAINTEST}/${id}`, formData, {
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
  formData.append("is_active", offeredTest.is_active);

  return axios.put(`${url.UPDATE_OFFERED_TEST}/${offeredTest.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateCorporateTest = offeredTest => {
  let formData = new FormData();
  formData.append("id", offeredTest.id);
  formData.append("test_id", offeredTest.test_id);
  formData.append("price", offeredTest.price);
  formData.append("start_date", offeredTest.start_date);
  formData.append("end_date", offeredTest.end_date);
  // formData.append("is_active", offeredTest.is_active);

  return axios.put(`${url.UPDATE_CORPORATE_TEST}/${offeredTest.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const updateCorporateStatus = offeredTest => {
  let formData = new FormData();
  formData.append("status", offeredTest.status);
  formData.append("shared_percentage", offeredTest.shared_percentage);
  // formData.append("is_active", offeredTest.is_active);

  return axios.put(
    `${url.UPDATE_CORPORATE_STATUS}/${offeredTest.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
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

// ------------- Live chat for csr and csr admin complaints -------------
export const getNotesComplaint = id =>
  get(`${url.GET_NOTES_COMPLAINT}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewNoteComplaint = (note, id) => {
  let formData = new FormData();
  formData.append("note", note.note);
  formData.append("complaint_id", note.complaint_id);

  console.log("heeeeeee", note, id);
  return axios.post(`${url.ADD_NEW_NOTE_COMPLAINT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- Test Certificate Requests START -------------
export const getNotes = id =>
  get(`${url.GET_NOTES}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewNote = (note, id) => {
  let formData = new FormData();
  formData.append("note", note.note);
  formData.append("appointment_id", note.appointment_id);

  console.log("heeeeeee", note, id);
  return axios.post(`${url.ADD_NEW_NOTE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const getMsgs = id =>
  get(`${url.GET_MSGS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewMsg = (msg, id) => {
  let formData = new FormData();
  formData.append("msg", msg.msg);
  formData.append("advertisement_id", msg.advertisement_id);

  console.log("heeeeeee", msg, id);
  return axios.post(`${url.ADD_NEW_MSG}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
// ------------- Test Certificate Requests START -------------

export const addNewCollectionPointQuality = (qualityCertificate, id) => {
  let formData = new FormData();
  formData.append("main_lab_quality", qualityCertificate.main_lab_quality);
  // formData.append("unit_id", qualityCertificate.unit_id);
  console.log("main_lab_quality", qualityCertificate);
  return axios.post(`${url.ADD_NEW_COLLECTIONPOINT_QUALITY}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

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
  formData.append(
    "sub_certificate_type",
    qualityCertificate.sub_certificate_type
  );
  formData.append("expiry_date", qualityCertificate.expiry_date);
  formData.append("start_date", qualityCertificate.start_date);
  formData.append("end_date", qualityCertificate.end_date);

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
  formData.append("start_date", qualityCertificate.start_date);
  formData.append("end_date", qualityCertificate.end_date);

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

export const getActivityLog = id =>
  get(`${url.GET_ACTIVITY_LOG}/${id}`, {
    headers: getHeader(authHeader()),
  });

// export const getNotification = id =>
// get(`${url.GET_NOTIFICATION}/${id}`, {
//   headers: getHeader(authHeader()),
// });
export const getNotification = (id, previousApiCallTime) => {
  let formData = new FormData();
  formData.append("previousApiCallTime", previousApiCallTime);
  formData.append("id", id);
  console.log("data", previousApiCallTime);
  return axios.post(`${url.GET_NOTIFICATION}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getSampleNotification = (id, previousApiCallTime) => {
  let formData = new FormData();
  formData.append("previousApiCallTime", previousApiCallTime);
  formData.append("id", id);
  console.log("data", previousApiCallTime);
  return axios.post(`${url.GET_SAMPLE_NOTIFICATION}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getMarketerNotification = (id, previousApiCallTime) => {
  let formData = new FormData();
  formData.append("previousApiCallTime", previousApiCallTime);
  formData.append("id", id);
  console.log("data", previousApiCallTime);
  return axios.post(`${url.GET_MARKETER_NOTIFICATION}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getCsrAdminNotification = (id, previousApiCallTime) => {
  let formData = new FormData();
  formData.append("previousApiCallTime", previousApiCallTime);
  formData.append("id", id);
  console.log("data", previousApiCallTime);
  return axios.post(`${url.GET_CSR_ADMIN_NOTIFICATION}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getRegAdminNotification = (id, previousApiCallTime) => {
  let formData = new FormData();
  formData.append("previousApiCallTime", previousApiCallTime);
  formData.append("id", id);
  console.log("data", previousApiCallTime);
  return axios.post(`${url.GET_REG_ADMIN_NOTIFICATION}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getCsrOfficerNotification = (id, previousApiCallTime) => {
  let formData = new FormData();
  formData.append("previousApiCallTime", previousApiCallTime);
  formData.append("id", id);
  console.log("data", previousApiCallTime);
  return axios.post(`${url.GET_CSR_OFFICER_NOTIFICATION}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
// ------------- Finanace START Activity Log-------------

export const getActivityLogFinance = id =>
  get(`${url.GET_ACTIVITY_LOG_FINANCE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getLcList = () =>
  get(`${url.GET_LC_LIST}`, {
    headers: getHeader(authHeader()),
  });
export const getCorporateList = () =>
  get(`${url.GET_CORPORATE_LIST}`, {
    headers: getHeader(authHeader()),
  });
// ------------- Corporate START Activity Log-------------

export const getCorporateCommit = id =>
  get(`${url.GET_CORPORATE_COMMIT}/${id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Marketer Admin Activity Log -------------

export const getActivityLogMarketer = id =>
  get(`${url.GET_ACTIVITY_LOG_MARKETER}/${id}`, {
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

// ------------- Lab Profile Requests START -------------
export const getLabProfile = id =>
  get(`${url.GET_LAB_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateLabProfile = (labProfile, id) => {
  let formData = new FormData();
  formData.append("account_id", id);
  formData.append("shipping_address", labProfile.shipping_address);
  formData.append("billing_address", labProfile.billing_address);
  formData.append("landline_registered_by", labProfile.landline_registered_by);

  formData.append("email_participant", labProfile.email_participant);
  formData.append("name", labProfile.name);
  formData.append("lab_staff_name", labProfile.lab_staff_name);
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
  formData.append("opening_day", labSettings.opening_day);
  formData.append("closing_day", labSettings.closing_day);
  formData.append("health_dept_certified", labSettings.health_dept_certified);
  // formData.append("lab_experience", labSettings.lab_experience);
  formData.append("registration_no", labSettings.registration_no);
  formData.append("license_no", labSettings.license_no);
  formData.append(
    "is_homesampling_offered",
    labSettings.is_homesampling_offered
  );
  formData.append(
    "health_dept_certificate",
    labSettings.health_dept_certificate
  );
  formData.append("phone", labSettings.phone);
  formData.append("type", labSettings.type);
  formData.append(
    "complaint_handling_email",
    labSettings.complaint_handling_email
  );
  formData.append(
    "complaint_handling_phone",
    labSettings.complaint_handling_phone
  );
  formData.append("home_sampling_charges", labSettings.home_sampling_charges);
  formData.append("state_sampling_charges", labSettings.state_sampling_charges);
  formData.append("state_sampling_time", labSettings.state_sampling_time);

  formData.append(
    "is_digital_payment_accepted",
    labSettings.is_digital_payment_accepted
  );
  formData.append("is_active", labSettings.is_active);

  formData.append("account_number", labSettings.account_number);
  formData.append("branch_code", labSettings.branch_code);
  console.log("labsettings", labSettings);

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
  return axios.put(`${url.UPDATE_LAB_PAYMENTS}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Get Region Wise Advertisement
export const getRegionWiseAdvertisement = locationDetails => {
  let formData = new FormData();
  formData.append("latitude", locationDetails.latitude);
  formData.append("longitude", locationDetails.longitude);
  formData.append("search_type", locationDetails.search_type);
  formData.append("address", locationDetails.address);
  formData.append("city", locationDetails.city);

  return axios.post(`${url.GET_REGION_WISE_ADVERTISEMENT}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const getTestss = () =>
  get(url.GET_TESTSS, {
    headers: getHeader(authHeader()),
  });

export const getProfiles = () =>
  get(url.GET_PROFILES, {
    headers: getHeader(authHeader()),
  });

export const getPackages = () =>
  get(url.GET_PACKAGES, {
    headers: getHeader(authHeader()),
  });

export const getRadiology = () =>
  get(url.GET_RADIOLOGY, {
    headers: getHeader(authHeader()),
  });
export const getTestsList = id =>
  get(`${url.GET_TESTS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getCorporateTestsList = id =>
  get(`${url.GET_CORPORATE_TESTS_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Corporate Profile Requests START -------------
export const getCorporateProfile = id =>
  get(`${url.GET_CORPORATE_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getCorporateProfileforpayment = id =>
  get(`${url.GET_CORPORATE_PROFILE}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateCorporateProfile = (CorporateProfile, id) => {
  console.log("Updating corporate profile:", CorporateProfile, id);

  let formData = new FormData();
  formData.append("name", CorporateProfile.name);
  // formData.append("logo", CorporateProfile.logo);
  formData.append("email", CorporateProfile.email);
  formData.append("phone", CorporateProfile.phone);
  formData.append("landline", CorporateProfile.landline);
  formData.append("address", CorporateProfile.address);
  formData.append("city", CorporateProfile.city);
  formData.append("payment_terms", CorporateProfile.payment_terms);
  formData.append(
    "national_taxation_no",
    CorporateProfile.national_taxation_no
  );

  return axios.put(`${url.UPDATE_CORPORATE_PROFILE}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
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
  console.log("data", complaint);
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
  formData.append("status", data.status);
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

export const getCsrAppointments = id =>
  get(`${url.GET_CSR_APPOINTMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateCsrAppointments = csrAppointment => {
  let formData = new FormData();
  // formData.append("comment", data.comment);
  formData.append("status", csrAppointment.status);
  // formData.append("appointment_option", csrAppointment.appointment_option);
  // formData.append("staff", csrAppointment.staff);
  // formData.append("comments", csrAppointment.comments);
  console.log("Form data: ", csrAppointment);

  return axios.put(
    `${url.UPDATE_CSR_APPOINTMENTS}/${csrAppointment.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const getCsrComplaints = id =>
  get(`${url.GET_CSR_COMPLAINTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const updateCsrComplaints = csrcomplaint => {
  let formData = new FormData();
  // formData.append("comment", data.comment);
  formData.append(
    "appointment_requested_at",
    csrcomplaint.appointment_requested_at
  );
  formData.append("appointment_option", csrcomplaint.appointment_option);
  formData.append("staff", csrcomplaint.staff);
  formData.append("comments", csrcomplaint.comments);
  console.log("Form data: ", csrcomplaint);

  return axios.put(
    `${url.UPDATE_CSR_COMPLAINTS}/${csrcomplaint.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};
// Get Quotes
export const getQuotes = (
  city_id,
  test_id,
  search_type,
  address,
  longitude,
  latitude,
  km,
  locationAccessAllowed
) => {
  let formData = new FormData();
  formData.append("city_id", city_id);
  formData.append("test_id", test_id);
  formData.append("search_type", search_type);
  formData.append("longitude", longitude);
  formData.append("latitude", latitude);
  formData.append("address", address);
  formData.append("km", km);
  formData.append("locationAccessAllowed", locationAccessAllowed);
  console.log(
    "In near by lsbd: ",
    city_id,
    test_id,
    search_type,
    address,
    longitude,
    latitude,
    km
  );
  return axios.post(`${url.GET_QUOTES}`, formData, {
    headers: getHeader(authHeader()),
  });
};
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

  // formData.append("lab_id", cart.lab_id);
  formData.append(
    "lab_id",
    cart.lab_id !== undefined ? cart.lab_id : cart.lab_id_id
  );
  formData.append("offered_test_id", cart.id);
  formData.append("amount", cart.price);
  formData.append("guest_id", cart.guest_id);
  formData.append("invoice_discount", cart.discount);
  formData.append("invoice_labhazir_discount", cart.discount_by_labhazir);
  // formData.append("amount", cart.price);

  console.log("cart items in django apiiii", cart, cart.lab_id_id);

  return axios.post(`${url.ADD_TO_CART}/${id}`, formData, {
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

// FEEDBACK
export const getLabsRating = () =>
  get(`${url.GET_LABS_RATING}`, {
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
// Get Nearby Labs
export const getNearbyLabs = locationDetails => {
  let formData = new FormData();
  formData.append("latitude", locationDetails.latitude);
  formData.append("longitude", locationDetails.longitude);
  formData.append("search_type", locationDetails.search_type);
  formData.append("km", locationDetails.km);
  formData.append("name", locationDetails.name);
  formData.append("LabType", locationDetails.LabType);
  formData.append("address", locationDetails.address);
  formData.append("city", locationDetails.city);
  formData.append("guest_id", locationDetails.guest_id);
  formData.append(
    "locationAccessAllowed",
    locationDetails.locationAccessAllowed
  );
  formData.append("corporatepatient", locationDetails.corporatepatient);
  console.log("In near by lsbd: ", locationDetails);

  return axios.post(`${url.GET_NEARBY_LABS}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const addNewCemployeeData = (cemployeeData, id) => {
  let formData = new FormData();
  formData.append("name", cemployeeData.name);
  formData.append("employee_code", cemployeeData.employee_code);

  return axios.post(`${url.ADD_NEW_CEMPLOYEE_DATA}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const deletecedata = cemployee =>
  del(`${url.DELETE_CEDATA}/${cemployee.id}`, {
    headers: getHeader(authHeader()),
  });

export const addNewCemployeefile = cemployeeData => {
  let formData = new FormData();
  formData.append("excel_file", cemployeeData.excel_file);

  console.log("django api helper", cemployeeData);

  return axios.post(`${url.ADD_NEW_CEMPLOYEE_FILE}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateCemployee = cemployeeData => {
  let formData = new FormData();
  formData.append("name", cemployeeData.name);
  formData.append("employee_code", cemployeeData.employee_code);
  formData.append("status", cemployeeData.status);

  return axios.put(`${url.UPDATE_CEMPLOYEE}/${cemployeeData.id}`, formData, {
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
export const addStaff = (userID, staff) => {
  let formData = new FormData();
  formData.append("name", staff.name);
  formData.append("email", staff.email);
  formData.append("cnic", staff.cnic);
  formData.append("phone", staff.phone);
  formData.append("city", staff.city);
  formData.append("photo", staff.photo);

  console.log("data", staff, userID);

  return axios
    .post(`${url.ADD_STAFF}/${userID}`, formData, {
      headers: getHeader(authHeader()),
    })
    .then(response => {
      if (response.status >= 200 && response.status <= 299) {
        return response.data;
      }
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
            message = "Sorry! The page you are looking for could not be found";
            break;
          case 500:
            message =
              "Sorry! Something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = "An unknown error occurred";
            break;
        }
      } else {
        message = "Network error or server is not responding";
      }
      console.log("django staff error:", message); // Log the error message here
      throw message; // Throw the error message to be caught in the saga
    });
};

export const updateStaff = staff => {
  let formData = new FormData();
  formData.append("name", staff.name);
  formData.append("cnic", staff.cnic);
  formData.append("phone", staff.phone);
  // formData.append("email", staff.email);
  formData.append("cnic", staff.cnic);
  formData.append("phone", staff.phone);
  formData.append("isActive", staff.isActive);
  // formData.append("roles", staff.roles);
  // formData.append("city", staff.city);
  // formData.append("territory_office", staff.territory_office);

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
export const getCSRList = id =>
  get(`${url.GET_CSR_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getAuditorList = id =>
  get(`${url.GET_AUDITOR_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getOrganizationList = () =>
  get(`${url.GET_ORGANIZATION_LIST}`, {
    headers: getHeader(authHeader()),
  });

export const getRegistrationAdminList = id =>
  get(`${url.GET_FINANCE_OFFICER_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
  

//          Registration Admin
export const getRoundlist = id =>
  get(`${url.GET_ROUND_LIST}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const addNewRound = (createUnit, id) => {
  console.log("Adding New Round", createUnit, id);
  let formData = new FormData();
  formData.append("rounds", createUnit.rounds);
  formData.append("scheme", createUnit.scheme);
  formData.append("cycle_no", createUnit.cycle_no);
  formData.append("sample", createUnit.sample);
  formData.append("issue_date", createUnit.issue_date);
  formData.append("closing_date", createUnit.closing_date);
  formData.append("status", createUnit.status);
  formData.append("added_by", createUnit.added_by);
  formData.append("participants", createUnit.participants);
  return axios
    .post(`${url.ADD_NEW_ROUND}`, formData, {
      headers: {
        ...getHeader(authHeader()),
        "Content-Type": "multipart/form-data",
      },
    })
    .then(response => {
      console.log("Round added successfully:", response.data);
      return response.data;
    })
    .catch(error => {
      console.error(
        "Error adding roound:",
        error.response ? error.response.data : error.message
      );
      throw error;
    });
};

export const updateRound = unit => {
  let formData = new FormData();
  formData.append("rounds", unit.rounds);
  formData.append("sample", unit.sample);
  formData.append("issue_date", unit.issue_date);
  formData.append("closing_date", unit.closing_date);
  // formData.append("notes", unit.notes);
  formData.append("status", unit.status);
  formData.append("added_by", unit.added_by);
  return axios.put(
    `${url.UPDATE_ROUND}/${unit.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const deleteRound = round =>
  del(`${url.DELETE_ROUND}/${round.id}`, {
    headers: getHeader(authHeader()),
  });


// ------------- Registration Admin requests START -------------

export const getPendingCorporate = () =>
  get(`${url.GET_PENDING_CORPORATE}`, {
    headers: getHeader(authHeader()),
  });
export const getApprovedCorporate = () =>
  get(`${url.GET_APPROVED_CORPORATE}`, {
    headers: getHeader(authHeader()),
  });
export const getUnapprovedCorporate = () =>
  get(`${url.GET_UNAPPROVED_CORPORATE}`, {
    headers: getHeader(authHeader()),
  });

export const getAllLabs = id =>
  get(`${url.GET_ALL_PARTICIPANT}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getPendingLabs = id =>
  get(`${url.GET_PENDING_LABS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getApprovedLabs = id =>
  get(`${url.GET_APPROVED_LABS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getUnapprovedLabs = id =>
  get(`${url.GET_UNAPPROVED_LABS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const approveUnapproveCorporate = data => {
  let formData = new FormData();
  formData.append("corporate_id", data.corporate_id);
  formData.append("is_approved", data.isApproved);

  return axios.put(`${url.APPROVE_UNAPPROVE_CORPORATE}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const approveUnapproveLab = data => {
  let formData = new FormData();
  formData.append("lab_id", data.labId);
  formData.append("is_approved", data.isApproved);

  return axios.put(`${url.APPROVE_UNAPPROVE_LAB}/${data.id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Pending offered test labs list

export const getLabsListPendingFee = () =>
  get(`${url.GET_LABS_LIST_PENDING_FEE}`, {
    headers: getHeader(authHeader()),
  });
export const getLabsListApprovedFee = () =>
  get(`${url.GET_LABS_LIST_APPROVED_FEE}`, {
    headers: getHeader(authHeader()),
  });

export const getSharedPercentagePendingFeeTests = id =>
  get(`${url.GET_SHARED_PERCENTAGE_PENDING_FEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getSharedPercentageApprovedFeeTests = id =>
  get(`${url.GET_SHARED_PERCENTAGE_APPROVED_FEE}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const updateSharedPercentagePendingFeeTest = data => {
  let formData = new FormData();

  formData.append("shared_percentage", data.shared_percentage);

  return axios.put(
    `${url.UPDATE_SHARED_PERCENTAGE_PENDING_FEE}/${data.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

export const updateSharedPercentageAllPendingFeeTest = data => {
  let formData = new FormData();
  // formData.append("account_id", id);
  formData.append("shared_percentage", data.shared_percentage);
  // formData.append("shared_percentage", data.shared_percentage);

  return axios.put(
    `${url.UPDATE_SHARED_PERCENTAGE_ALL_PENDING_FEE}/${data.lab_id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};
// Get Checkout Items
export const getCheckoutItems = (
  id,
  is_home_sampling_availed,
  is_state_sampling_availed
) => {
  let formData = new FormData();
  formData.append("is_home_sampling_availed", is_home_sampling_availed);
  formData.append("is_state_sampling_availed", is_state_sampling_availed);
  console.log("different values", id, is_home_sampling_availed);
  console.log("different values", id, is_state_sampling_availed);

  return axios.post(`${url.GET_CHECKOUT_ITEMS}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// Add checkout data
export const addCheckoutData = (checkoutData, id) => {
  let formData = new FormData();
  formData.append("uuid", checkoutData.uuid);
  formData.append("csr_id", checkoutData.csr_id);
  formData.append("booked_by", checkoutData.booked_by);
  formData.append("patient_name", checkoutData.patient_name);
  formData.append("patient_age", checkoutData.patient_age);
  formData.append("patient_phone", checkoutData.patient_phone);
  formData.append("patient_gender", checkoutData.patient_gender);
  formData.append("patient_address", checkoutData.patient_address);
  formData.append("ageFormat", checkoutData.ageFormat);
  // formData.append("patient_city", checkoutData.patient_city);
  // formData.append("patient_district", checkoutData.patient_district);
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
  formData.append(
    "is_state_sampling_availed",
    checkoutData.is_state_sampling_availed
  );
  formData.append("payment_method", checkoutData.payment_method);
  formData.append("card_number", checkoutData.card_number);
  formData.append("name_on_card", checkoutData.name_on_card);
  formData.append("expiry_date", checkoutData.expiry_date);
  formData.append("cvv_code", checkoutData.cvv_code);

  console.log(
    "add different with address data with home sampling",
    checkoutData
  );

  return axios.post(`${url.ADD_CHECKOUT_DATA}/${id}`, formData, {
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
  get(`${url.GET_INPROCESS_COMPLAINTS_LABHAZIR}`, {
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
  formData.append("is_it_urgent", data.is_it_urgent);

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

export const getAcceptedLabAdvertisements = () =>
  get(`${url.GET_ACCEPTED_LAB_ADVERTISEMENTS}`, {
    headers: getHeader(authHeader()),
  });

export const addNewAdvertisement = (advertisement, id) => {
  let formData = new FormData();
  formData.append("title", advertisement.title);
  formData.append("poster", advertisement.poster);
  formData.append("posted_at", advertisement.posted_at);
  formData.append("posted_till", advertisement.posted_till);
  // formData.append("region_type", advertisement.region_type);
  // formData.append("province", advertisement.province);
  formData.append("city_id", advertisement.city_id);
  // formData.append("district", advertisement.district);

  console.log("advertisement", advertisement, id);

  return axios.post(`${url.ADD_NEW_ADVERTISEMENT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateAdvertisement = advertisement => {
  let formData = new FormData();
  formData.append("id", advertisement.id);
  formData.append("title", advertisement.title);
  formData.append("poster", advertisement.poster);
  formData.append("posted_at", advertisement.posted_at);
  formData.append("posted_till", advertisement.posted_till);
  // formData.append("region_type", advertisement.region_type);
  // formData.append("province", advertisement.province);
  formData.append("city_id", advertisement.city_id);
  // formData.append("district", advertisement.district);

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

export const getLabsList = () =>
  get(`${url.GET_LABS_LIST}`, {
    headers: getHeader(authHeader()),
  });

export const getClList = () =>
  get(`${url.GET_CL_LIST}`, {
    headers: getHeader(authHeader()),
  })
    .then(response => {
      console.log("Dataaaaaaaaaaaa in helper:", response); // Logging the response data
      return response;
    })
    .catch(error => {
      console.error("Error:", error); // Logging the error
      throw error; // Re-throwing the error for the caller to handle
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

  return axios.put(
    `${url.UPDATE_DISCOUNT_LABHAZIRTOLAB}/${data.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
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

  return axios.put(
    `${url.UPDATE_DISCOUNT_ALL_LABHAZIRTOLAB}/${data.lab_id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

// export const getReferrelFeeLabs = id =>
//   get(`${url.GET_REFERREL_FEES}/${id}`, {
//     headers: getHeader(authHeader()),
//   });
// export const getPutReferrelFeeLabs = () =>
//   get(`${url.GET_PUT_REFERREL_FEES}`, {
//     headers: getHeader(authHeader()),
//   });
// Get Nearby Labs

export const getPutReferrelFeeLabs = data => {
  let formData = new FormData();

  formData.append("test_name", data.test_name);

  console.log("In registration admin: ", data);

  return axios.post(`${url.GET_PUT_REFERREL_FEES}`, formData, {
    headers: getHeader(authHeader()),
  });
};
export const getReferrelFeeLabs = () =>
  get(`${url.GET_REFERREL_FEES}`, {
    headers: getHeader(authHeader()),
  });

export const updateReferrelFeeLab = referrelLabFee => {
  let formData = new FormData();

  formData.append("shared_percentage", referrelLabFee.shared_percentage);

  return axios.put(
    `${url.UPDATE_REFERREL_FEE}/${referrelLabFee.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};
export const updateReferrelAllFeeLab = referrelLabFee => {
  let formData = new FormData();
  // formData.append("account_id", id);
  formData.append("shared_percentage", referrelLabFee.shared_percentage);

  return axios.put(
    `${url.UPDATE_REFERREL_ALL_FEE}/${referrelLabFee.lab_id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
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
  formData.append("posted_at", advertisement.posted_at);
  formData.append("posted_till", advertisement.posted_till);
  // formData.append("region_type", advertisement.region_type);
  // formData.append("province", advertisement.province);
  // formData.append("city_id", advertisement.city_id);

  formData.append("km", advertisement.km);

  console.log("advertisement", advertisement, id);
  // formData.append("amount", advertisement.amount);

  return axios.post(`${url.ADD_NEW_LAB_ADVERTISEMENT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const updateLabAdvertisement = advertisement => {
  let formData = new FormData();
  formData.append("id", advertisement.id);
  formData.append("title", advertisement.title);
  formData.append("poster", advertisement.poster);
  formData.append("km", advertisement.km);
  formData.append("posted_till", advertisement.posted_till);
  formData.append("posted_at", advertisement.posted_at);
  formData.append("number_of_days", advertisement.number_of_days);
  formData.append("amount", advertisement.amount);

  console.log("api helper", advertisement);

  return axios.put(
    `${url.UPDATE_LAB_ADVERTISEMENT}/${advertisement.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

// ------------- inPayments Settings Requests START -------------

export const getAllLabsList = () =>
  get(`${url.GET_ALL_LABS_LIST}`, {
    headers: getHeader(authHeader()),
  });

export const addNewInPayment = (inPayment, id) => {
  let formData = new FormData();
  formData.append("payment_for", inPayment.payment_for);
  formData.append("lab_id", inPayment.lab_id);
  formData.append("test_appointment_id", inPayment.test_appointment_id);

  formData.append("advertisement_id", inPayment.advertisement_id);
  formData.append("payment_method", inPayment.payment_method);
  formData.append("recieved_by", inPayment.recieved_by);
  formData.append("handover_to", inPayment.handover_to);
  formData.append("amount", inPayment.amount);
  formData.append("tax", inPayment.tax);
  formData.append("paid_at", inPayment.paid_at);
  formData.append("cheque_payment_date", inPayment.cheque_payment_date);
  formData.append("cheque_no", inPayment.cheque_no);
  formData.append("cheque_image", inPayment.cheque_image);
  formData.append("refered_no", inPayment.refered_no);
  formData.append("payment_status", inPayment.payment_status);

  return axios.post(`${url.ADD_NEW_IN_PAYMENT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// ------------- PAYMENT IN STATUS---------------------
export const updatePaymentStatus = paymentStatus => {
  let formData = new FormData();
  formData.append("id", paymentStatus.id);
  formData.append("deposit_at", paymentStatus.deposit_at);

  // formData.append("deposit_slip", paymentStatus.deposit_slip);
  formData.append("payment_status", paymentStatus.payment_status);
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
  formData.append("is_cleared", paymentInStatus.is_cleared);
  formData.append("cleared_at", paymentInStatus.cleared_at);
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
  formData.append("deposit_slip", paymentInBouncedStatus.deposit_slip);
  formData.append("payment_status", paymentInBouncedStatus.payment_status);
  formData.append("verified_by", paymentInBouncedStatus.verified_by);

  console.log("payment in django api helper", paymentInBouncedStatus);
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
export const getPaymentOutClearStatuss = id =>
  get(`${url.GET_PAYMENTOUT_CLEAR_STATUSS}/${id}`, {
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

  return axios.put(
    `${url.UPDATE_APPROVE_UNAPPROVE_IN_PAYMENT}/${data.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
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

// Donation Appointments
export const getAllDonationAppointments = id =>
  get(`${url.GET_ALL_DONATION_APPOINTMENTS}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getOutPayment = id =>
  get(`${url.GET_OUT_PAYMENT}/${id}`, {
    headers: getHeader(authHeader()),
  });
export const getLabsMof = () =>
  get(`${url.GET_LABS_MOF}`, {
    headers: getHeader(authHeader()),
  });

export const getLabsc = id =>
  get(`${url.GET_LABS_C}/${id}`, {
    headers: getHeader(authHeader()),
  });

export const getListDonationAppointment = () =>
  get(`${url.GET_LIST_DONATIONAPPOINTMENT}`, {
    headers: getHeader(authHeader()),
  });

export const getListCLabs = () =>
  get(`${url.GET_LIST_CLABS}`, {
    headers: getHeader(authHeader()),
  });

export const getListInvoice = () =>
  get(`${url.GET_LIST_INVOICE}`, {
    headers: getHeader(authHeader()),
  });

// ------------- inPayments Settings Requests START -------------
export const addNewOutPayment = (outPayment, id) => {
  let formData = new FormData();
  formData.append("payment_for", outPayment.payment_for);
  formData.append("transection_type", outPayment.transection_type);
  formData.append("lab_id", outPayment.lab_id);
  formData.append("test_appointment_id", outPayment.test_appointment_id);

  formData.append("payment_method", outPayment.payment_method);

  formData.append("tax", outPayment.tax);
  formData.append("amount", outPayment.amount);
  formData.append("payment_at", outPayment.payment_at);
  formData.append("cheque_no", outPayment.cheque_no);
  formData.append("deposit_copy", outPayment.deposit_copy);
  formData.append("refered_no", outPayment.refered_no);
  formData.append("status", outPayment.status);
  // formData.append("is_cleared",  outPayment.is_cleared);
  // formData.append("cleared_at",   outPayment.cleared_at);
  formData.append("comments", outPayment.comments);

  console.log("django api helper", outPayment, id);

  return axios.post(`${url.ADD_NEW_OUT_PAYMENT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

export const addNewCorporatePayment = (outPayment, id) => {
  let formData = new FormData();
  formData.append("payment_for", outPayment.payment_for);
  formData.append("lab_id", outPayment.lab_id);
  formData.append("test_appointment_id", outPayment.test_appointment_id);
  formData.append("payment_method", outPayment.payment_method);
  formData.append("tax", outPayment.tax);
  formData.append("amount", outPayment.amount);
  formData.append("payment_at", outPayment.payment_at);
  formData.append("cheque_no", outPayment.cheque_no);
  formData.append("cheque_image", outPayment.cheque_image);
  formData.append("payment_status", outPayment.payment_status);
  // formData.append("is_cleared",  outPayment.is_cleared);
  // formData.append("cleared_at",   outPayment.cleared_at);
  formData.append("comments", outPayment.comments);

  console.log("django api helper", outPayment, id);

  return axios.post(`${url.ADD_NEW_CORPORATE_PAYMENT}/${id}`, formData, {
    headers: getHeader(authHeader()),
  });
};

// update corporate out payment
export const updatePaymentOutCCreatedStatuss = paymentOutCreatedStatuss => {
  let formData = new FormData();
  // formData.append("payment_for",  paymentOutCreatedStatuss.payment_for);
  // formData.append("lab_id",   paymentOutCreatedStatuss.lab_id);
  // formData.append("test_appointment_id",   paymentOutCreatedStatuss.test_appointment_id);
  // formData.append("tax", paymentOutCreatedStatuss.tax);
  formData.append("amount", paymentOutCreatedStatuss.amount);
  formData.append("cheque_no", paymentOutCreatedStatuss.cheque_no);
  formData.append("payment_at", paymentOutCreatedStatuss.payment_at);
  formData.append("cheque_image", paymentOutCreatedStatuss.cheque_image);
  formData.append("payment_method", paymentOutCreatedStatuss.payment_method);

  formData.append("payment_status", paymentOutCreatedStatuss.payment_status);
  formData.append("comments", paymentOutCreatedStatuss.comments);

  return axios.put(
    `${url.UPDATE_PAYMENTOUTCCREATED_STATUS}/${paymentOutCreatedStatuss.id}`,
    formData,
    {
      headers: getHeader(authHeader()),
    }
  );
};

// ------------- invoice adjustment Settings Requests START -------------
export const addNewInvoiceAdjustment = (outPayment, id) => {
  let formData = new FormData();
  formData.append("invoice_id", outPayment.invoice_id);
  formData.append("tax", outPayment.tax);
  formData.append("total_adjustment", outPayment.total_adjustment);
  formData.append("price_discount", outPayment.price_discount);
  formData.append("others", outPayment.others);
  formData.append("status", outPayment.status);
  formData.append("comments", outPayment.comments);

  console.log("django api helper", outPayment, id);

  return axios.post(`${url.ADD_NEW_INVOICE_ADJUSTMENT}/${id}`, formData, {
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

// corporate out payment
// export const getCCreatedOutStatuss = id =>
//   get(`${url.GET_CCREATEDOUT_STATUSS}/${id}`, {
//     headers: getHeader(authHeader()),
//   });
export const getCCreatedOutStatuss = id =>
  get(`${url.GET_CCREATEDOUT_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
  })
    .then(response => {
      console.log("api response is :", response); // Log the response to the console
      return response; // Optionally return the response if needed
    })
    .catch(error => {
      console.error("Error fetching API:", error); // Log any errors to the console
      throw error; // Optionally rethrow the error if needed
    });

export const getCreatedOutStatuss = id =>
  get(`${url.GET_CREATEDOUT_STATUSS}/${id}`, {
    headers: getHeader(authHeader()),
  });
// ------------- PAYMENT IN STATUS---------------------
export const updatePaymentOutStatus = paymentOutStatus => {
  let formData = new FormData();
  formData.append("is_cleared", paymentOutStatus.is_cleared);
  formData.append("cleared_at", paymentOutStatus.cleared_at);
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
  formData.append("amount", paymentOutCreatedStatuss.amount);
  formData.append("cheque_no", paymentOutCreatedStatuss.cheque_no);
  formData.append("payment_at", paymentOutCreatedStatuss.payment_at);
  formData.append("deposit_copy", paymentOutCreatedStatuss.deposit_copy);
  formData.append("payment_method", paymentOutCreatedStatuss.payment_method);

  // formData.append("refered_no",   paymentOutCreatedStatuss.refered_no);
  // formData.append("cleared_at",   paymentOutCreatedStatuss.cleared_at);
  formData.append("status", paymentOutCreatedStatuss.status);
  formData.append("comments", paymentOutCreatedStatuss.comments);

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
  formData.append("request_status", advertisement.request_status);
  formData.append("declined_reason", advertisement.declined_reason);
  formData.append("responded_at", advertisement.responded_at);

  console.log("django api helper", advertisement);

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
export const getLabAdvertisementRequestsAccepted = () =>
  get(`${url.GET_LAB_ADVERTISEMENT_REQUESTS_ACCEPTED}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Advertisements Live START -------------
export const getAdvertisementLives = () =>
  get(`${url.GET_ADVERTISEMENT_LIVES}`, {
    headers: getHeader(authHeader()),
  });

// ------------- Advertisements Live START -------------
// export const getAdvLive=() =>
//   get(`${url.GET_ADV_LIVE}`, {
//     headers: getHeader(authHeader()),
//   });
// Get Region Wise Advertisement
export const getAdvLive = locationDetails => {
  let formData = new FormData();
  formData.append("latitude", locationDetails.latitude);
  formData.append("longitude", locationDetails.longitude);
  formData.append("search_type", locationDetails.search_type);
  formData.append("address", locationDetails.address);
  formData.append("city", locationDetails.city);

  console.log("labhaziradvLives: ", locationDetails);

  return axios.post(`${url.GET_ADV_LIVE}`, formData, {
    headers: getHeader(authHeader()),
  });
};

//------------ Get Advertisement Invoice Detail-------------
export const getAdvInvoice = id =>
  get(
    `${url.GET_ADV_INVOICE}/${id}`,
    {
      headers: getHeader(authHeader()),
    },
    console.log(id)
  );

//------------ Get Territories List-------------
export const getTerritoriesList = () =>
  get(`${url.GET_TERRITORIES_LIST}`, {
    headers: getHeader(authHeader()),
  });

//------------ Get Territories List-------------
export const getCorporatesList = () =>
  get(`${url.GET_CORPORATES_LIST}`, {
    headers: getHeader(authHeader()),
  });

//------------ Get Names List-------------
export const getLabNamesList = () =>
  get(`${url.GET_LAB_NAMES_LIST}`, {
    headers: getHeader(authHeader()),
  });

//------------ Get Medical Test List-------------
export const onlyMedicalTestList = () =>
  get(`${url.GET_ONLY_MEDICAL_LIST}`, {
    headers: getHeader(authHeader()),
  });

//------------ Get CSR Central Territories List-------------
export const getCsrCentralList = () =>
  get(`${url.GET_CSR_CENTRAL_TERRITORY_LIST}`, {
    headers: getHeader(authHeader()),
  });

//------------ Get CSR SOUTH Territories List-------------
export const getCsrSouthList = () =>
  get(`${url.GET_CSR_SOUTH_TERRITORY_LIST}`, {
    headers: getHeader(authHeader()),
  });

//------------ Get CSR NORTH Territories List-------------
export const getCsrNorthList = () =>
  get(`${url.GET_CSR_NORTH_TERRITORY_LIST}`, {
    headers: getHeader(authHeader()),
  });

//------------ Get AUDITOR Central Territories List-------------
export const getAuditorCentralList = () =>
  get(`${url.GET_AUDITOR_CENTRAL_TERRITORY_LIST}`, {
    headers: getHeader(authHeader()),
  });

//------------ Get Auditor SOUTH Territories List-------------
export const getAuditorSouthList = () =>
  get(`${url.GET_AUDITOR_SOUTH_TERRITORY_LIST}`, {
    headers: getHeader(authHeader()),
  });

//------------ Get Auditor NORTH Territories List-------------
// export const getAuditorNorthList = ()=>
// get(`${url.GET_AUDITOR_NORTH_TERRITORY_LIST}`, {
//   headers: getHeader(authHeader()),
// });

// export const getAuditorNorthList = () =>
//   get(`${url.GET_AUDITOR_NORTH_TERRITORY_LIST}`, {
//     headers: getHeader(authHeader()),
//   });
