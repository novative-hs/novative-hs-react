
import {
  REGISTER_ORGANIZATION,
  REGISTER_ORGANIZATION_SUCCESSFUL,
  REGISTER_ORGANIZATION_FAILED,

  GET_ORGANIZATION_LIST,
  GET_ORGANIZATION_LIST_SUCCESS,
  GET_ORGANIZATION_LIST_FAIL,
  
  UPDATE_ORGANIZATION_LIST,
  UPDATE_ORGANIZATION_LIST_SUCCESS,
  UPDATE_ORGANIZATION_LIST_FAIL,

  DELETE_ORGANIZATION_LIST,
  DELETE_ORGANIZATION_LIST_SUCCESS,
  DELETE_ORGANIZATION_LIST_FAIL,
} from "./actionTypes"

export const getOrganizationlist = () => ({
  type: GET_ORGANIZATION_LIST,
  payload: {},
});

export const getOrganizationlistSuccess = (OrganizationList) => {
  return {
    type: GET_ORGANIZATION_LIST_SUCCESS,
    payload: OrganizationList,
  };
};

export const getOrganizationlistFail = (error) => { 
  return {
    type: GET_ORGANIZATION_LIST_FAIL,
    payload: error,
  };
};

export const updateOrganizationList = organization => ({
  type: UPDATE_ORGANIZATION_LIST,
  payload: organization,
});
export const updateOrganizationListSuccess = organization => ({
    type:   UPDATE_ORGANIZATION_LIST_SUCCESS,
    payload: organization,
  });

export const updateOrganizationListFail = error => ({
    type: UPDATE_ORGANIZATION_LIST_FAIL,
    payload: error,
  });



export const deleteOrganizationList = organization => ({
  type: DELETE_ORGANIZATION_LIST,
  payload: organization,
});

export const deleteOrganizationListSuccess = organization => ({
  type: DELETE_ORGANIZATION_LIST_SUCCESS,
  payload: organization,
});

export const deleteOrganizationListFail = error => ({
  type: DELETE_ORGANIZATION_LIST_FAIL,
  payload: error,
});

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

