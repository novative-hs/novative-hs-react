import {

  GET_PENDING_LABS,
  GET_PENDING_LABS_SUCCESS,
  GET_PENDING_LABS_FAIL,
  GET_APPROVED_LABS,
  GET_APPROVED_LABS_SUCCESS,
  GET_APPROVED_LABS_FAIL,
  GET_UNAPPROVED_LABS,
  GET_UNAPPROVED_LABS_SUCCESS,
  GET_UNAPPROVED_LABS_FAIL,
  APPROVE_UNAPPROVE_LAB,
  APPROVE_UNAPPROVE_LAB_SUCCESS,
  APPROVE_UNAPPROVE_LAB_FAIL,
  GET_PENDING_B2B_CLIENTS,
  GET_PENDING_B2B_CLIENTS_SUCCESS,
  GET_PENDING_B2B_CLIENTS_FAIL,
  GET_APPROVED_B2B_CLIENTS,
  GET_APPROVED_B2B_CLIENTS_SUCCESS,
  GET_APPROVED_B2B_CLIENTS_FAIL,
  GET_UNAPPROVED_B2B_CLIENTS,
  GET_UNAPPROVED_B2B_CLIENTS_SUCCESS,
  GET_UNAPPROVED_B2B_CLIENTS_FAIL,
  APPROVE_UNAPPROVE_B2B_CLIENT,
  APPROVE_UNAPPROVE_B2B_CLIENT_SUCCESS,
  APPROVE_UNAPPROVE_B2B_CLIENT_FAIL,

} from "./actionTypes";

// -------------------- LAB ACTIONS --------------------
export const getPendingLabs = () => ({
  type: GET_PENDING_LABS,
  payload: {},
});

export const getPendingLabsSuccess = pendingLabs => ({
  type: GET_PENDING_LABS_SUCCESS,
  payload: pendingLabs,
});

export const getPendingLabsFail = error => ({
  type: GET_PENDING_LABS_FAIL,
  payload: error,
});

export const getApprovedLabs = () => ({
  type: GET_APPROVED_LABS,
  payload: {},
});

export const getApprovedLabsSuccess = approvedLabs => ({
  type: GET_APPROVED_LABS_SUCCESS,
  payload: approvedLabs,
});

export const getApprovedLabsFail = error => ({
  type: GET_APPROVED_LABS_FAIL,
  payload: error,
});

export const getUnapprovedLabs = () => ({
  type: GET_UNAPPROVED_LABS,
  payload: {},
});

export const getUnapprovedLabsSuccess = unapprovedLabs => ({
  type: GET_UNAPPROVED_LABS_SUCCESS,
  payload: unapprovedLabs,
});

export const getUnapprovedLabsFail = error => ({
  type: GET_UNAPPROVED_LABS_FAIL,
  payload: error,
});

export const approveUnapproveLab = data => ({
  type: APPROVE_UNAPPROVE_LAB,
  payload: { data },
});

export const approveUnapproveLabSuccess = success => ({
  type: APPROVE_UNAPPROVE_LAB_SUCCESS,
  payload: success,
});

export const approveUnapproveLabFail = error => ({
  type: APPROVE_UNAPPROVE_LAB_FAIL,
  payload: error,
});

// -------------------- B2B ACTIONS --------------------
export const getPendingB2BClients = () => ({
  type: GET_PENDING_B2B_CLIENTS,
  payload: {},
});

export const getPendingB2BClientsSuccess = pendingB2BClients => ({
  type: GET_PENDING_B2B_CLIENTS_SUCCESS,
  payload: pendingB2BClients,
});

export const getPendingB2BClientsFail = error => ({
  type: GET_PENDING_B2B_CLIENTS_FAIL,
  payload: error,
});

export const getApprovedB2BClients = () => ({
  type: GET_APPROVED_B2B_CLIENTS,
  payload: {},
});

export const getApprovedB2BClientsSuccess = approvedB2BClients => ({
  type: GET_APPROVED_B2B_CLIENTS_SUCCESS,
  payload: approvedB2BClients,
});

export const getApprovedB2BClientsFail = error => ({
  type: GET_APPROVED_B2B_CLIENTS_FAIL,
  payload: error,
});

export const getUnapprovedB2BClients = () => ({
  type: GET_UNAPPROVED_B2B_CLIENTS,
  payload: {},
});

export const getUnapprovedB2BClientsSuccess = unapprovedB2BClients => ({
  type: GET_UNAPPROVED_B2B_CLIENTS_SUCCESS,
  payload: unapprovedB2BClients,
});

export const getUnapprovedB2BClientsFail = error => ({
  type: GET_UNAPPROVED_B2B_CLIENTS_FAIL,
  payload: error,
});

export const approveUnapproveB2BClient = data => ({
  type: APPROVE_UNAPPROVE_B2B_CLIENT,
  payload: { data },
});

export const approveUnapproveB2BClientSuccess = success => ({
  type: APPROVE_UNAPPROVE_B2B_CLIENT_SUCCESS,
  payload: success,
});

export const approveUnapproveB2BClientFail = error => ({
  type: APPROVE_UNAPPROVE_B2B_CLIENT_FAIL,
  payload: error,
});

