import {
  ADD_PATIENT_INFORMATION,
  ADD_PATIENT_INFORMATION_SUCCESSFUL,
  ADD_PATIENT_INFORMATION_FAILED,
} from "./actionTypes"

const initialState = {
  addPatientError: null,
  message: null,
  loading: false,
}

const patientInformation = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PATIENT_INFORMATION:
      state = {
        ...state,
        patient: null,
        loading: true,
        addPatientError: null,
      }
      break
    case ADD_PATIENT_INFORMATION_SUCCESSFUL:
      state = {
        ...state,
        loading: false,
        patient: action.payload,
        addPatientError: null,
      }
      break
    case ADD_PATIENT_INFORMATION_FAILED:
      state = {
        ...state,
        patient: null,
        loading: false,
        addPatientError: action.payload.patient
      }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default patientInformation
