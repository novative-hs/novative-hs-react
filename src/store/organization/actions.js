import {
  REGISTER_ORGANIZATION,
  REGISTER_ORGANIZATION_SUCCESSFUL,
  REGISTER_ORGANIZATION_FAILED,
  API_ERROR,
} from "./actionTypes"

export const registerOrganization = user => {
  return {
    type: REGISTER_ORGANIZATION,
    payload: { user },
  }  
}

export const registerOrganizationSuccessful = user => {
  console.log(user)
    return {
    type: REGISTER_ORGANIZATION_SUCCESSFUL,
    payload: user,
  }
}

export const registerOrganizationFailed = error => {
  return {
    type: REGISTER_ORGANIZATION_FAILED,
    payload: error,
  }
}

