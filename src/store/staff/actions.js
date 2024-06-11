import {
  GET_CSR_LIST,
  GET_CSR_LIST_SUCCESS,
  GET_CSR_LIST_FAIL,
  GET_AUDITOR_LIST,
  GET_AUDITOR_LIST_SUCCESS,
  GET_AUDITOR_LIST_FAIL,
  GET_FINANCE_OFFICER_LIST,
  GET_FINANCE_OFFICER_LIST_SUCCESS,
  GET_FINANCE_OFFICER_LIST_FAIL,
  ADD_STAFF,
  ADD_STAFF_SUCCESS,
  UPDATE_STAFF,
  UPDATE_STAFF_SUCCESS,
  UPDATE_STAFF_FAIL,
  DELETE_STAFF,
  DELETE_STAFF_SUCCESS,
  DELETE_STAFF_FAIL,
  GET_TERRITORIES_LIST,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  ADD_STAFF_FAIL,
  GET_ORGANIZATION_LIST,
  GET_ORGANIZATION_LIST_SUCCESS,
  GET_ORGANIZATION_LIST_FAIL
} from "./actionTypes";

// Territories
export const getTerritoriesList = () => ({
  type: GET_TERRITORIES_LIST,
  payload: {},
});


export const getTerritoriesListSuccess =
  territories => ({
    type: GET_TERRITORIES_LIST_SUCCESS,
    payload: territories,
  });

export const getTerritoriesListFail = error => ({
  type: GET_TERRITORIES_LIST_FAIL,
  payload: error,
});
export const getCSRList = id => ({
  type: GET_CSR_LIST,
  payload: id,
});

export const getCSRListSuccess = csrList => ({
  type: GET_CSR_LIST_SUCCESS,
  payload: csrList,
});

export const getCSRListFail = error => ({
  type: GET_CSR_LIST_FAIL,
  payload: error,
});

export const getDatabaseadminList = id => ({
  type: GET_AUDITOR_LIST,
  payload: id,
});
export const getDatabaseadminListSuccess = databaseadminList => ({
  type: GET_AUDITOR_LIST_SUCCESS,
  payload: databaseadminList,
});

export const getDatabaseadminListFail = error => ({
  type: GET_AUDITOR_LIST_FAIL,
  payload: error,
});

export const getOrganizationList = () => ({
  type: GET_ORGANIZATION_LIST,
  payload: {},
});

export const getOrganizationListSuccess = databaseadminList => ({
  type: GET_ORGANIZATION_LIST_SUCCESS,
  payload: databaseadminList,
});

export const getOrganizationListFail = error => ({
  type: GET_ORGANIZATION_LIST_FAIL,
  payload: error,
});


export const getRegistrationAdminList = id => ({
  type: GET_FINANCE_OFFICER_LIST,
  payload: id,
});

export const getRegistrationAdminListSuccess = financeOfficerList => ({
  type: GET_FINANCE_OFFICER_LIST_SUCCESS,
  payload: financeOfficerList,
});

export const getRegistrationAdminListFail = error => ({
  type: GET_FINANCE_OFFICER_LIST_FAIL,
  payload: error,
});
export const addStaff = (staff, userID) => ({
  type: ADD_STAFF,
  payload: { staff, userID },
});


export const addStaffSuccess = (staff, userID) => {
  return {
    type: ADD_STAFF_SUCCESS,
    payload: { staff, userID },
  };
};

export const addStaffFail = (error) => {
  return {
    type: ADD_STAFF_FAIL,
    payload: error,
  };
};

export const updateStaff = staff => ({
  type: UPDATE_STAFF,
  payload: staff,
});

export const updateStaffSuccess = staff => ({
  type: UPDATE_STAFF_SUCCESS,
  payload: staff,
});

export const updateStaffFail = error => ({
  type: UPDATE_STAFF_FAIL,
  payload: error,
});

export const deleteStaff = staff => ({
  type: DELETE_STAFF,
  payload: staff,
});

export const deleteStaffSuccess = staff => ({
  type: DELETE_STAFF_SUCCESS,
  payload: staff,
});

export const deleteStaffFail = error => ({
  type: DELETE_STAFF_FAIL,
  payload: error,
});
