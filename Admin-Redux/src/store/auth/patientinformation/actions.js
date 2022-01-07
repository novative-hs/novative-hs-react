import {
  ADD_PATIENT_INFORMATION,
  ADD_PATIENT_INFORMATION_SUCCESSFUL,
  ADD_PATIENT_INFORMATION_FAILED,
} from "./actionTypes"

export const addPatientInformation = (patient, id) => {
  return {
    type: ADD_PATIENT_INFORMATION,
    payload: { patient, id },
  }
}

export const addPatientInformationSuccessful = (patient, id) => {
  return {
    type: ADD_PATIENT_INFORMATION_SUCCESSFUL,
    payload: { patient, id },
  }
}

export const addPatientInformationFailed = (patient, id) => {
  return {
    type: ADD_PATIENT_INFORMATION_FAILED,
    payload: { patient, id },
  }
}
