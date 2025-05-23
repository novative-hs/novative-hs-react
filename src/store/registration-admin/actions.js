
import {
  GET_ALL_PARTICIPANT,
  GET_ALL_PARTICIPANT_SUCCESS,
  GET_ALL_PARTICIPANT_FAIL,
  GET_PENDING_LABS,
  GET_PENDING_LABS_SUCCESS,
  GET_PENDING_LABS_FAIL,
  GET_APPROVED_LABS,
  GET_APPROVED_LABS_SUCCESS,
  GET_APPROVED_LABS_FAIL,
  GET_UNAPPROVED_LABS,
  GET_UNAPPROVED_LABS_SUCCESS,
  GET_UNAPPROVED_LABS_FAIL,
  GET_SUSPENDED_LABS,
  GET_SUSPENDED_LABS_SUCCESS,
  GET_SUSPENDED_LABS_FAIL,
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
  UPDATE_MEMBERSHIP_STATUS,
  UPDATE_MEMBERSHIP_STATUS_SUCCESS,
  UPDATE_MEMBERSHIP_STATUS_FAIL,
  UPDATE_LABS,
  UPDATE_LABS_SUCCESS,
  UPDATE_LABS_FAIL, 
GET_DELETE_PARTICIPANT,
  GET_DELETE_PARTICIPANT_SUCCESS,
  GET_DELETE_PARTICIPANT_FAIL,

} from "./actionTypes";
  //Update  Membership Status Action
  export const updateMembershipStatus = status => {
    return {
      type: UPDATE_MEMBERSHIP_STATUS,
      payload: status,
    };
  };
  
  export const updateMembershipStatusSuccess = status => ({
    type: UPDATE_MEMBERSHIP_STATUS_SUCCESS,
    payload: status,
  });
  
  export const updateMembershipStatusFail = error => ({
    type: UPDATE_MEMBERSHIP_STATUS_FAIL,
    payload: error,
  });

// -------------------- LAB ACTIONS --------------------
export const getAllLabs = id => ({
  type: GET_ALL_PARTICIPANT,
  payload: id,
});

export const getAllLabsSuccess = AllLabs => ({
  type: GET_ALL_PARTICIPANT_SUCCESS,
  payload: AllLabs,
});

export const getAllLabsFail = error => ({
  type: GET_ALL_PARTICIPANT_FAIL,
  payload: error,
});
export const updateAllLabs = status => {
  return {
    type: UPDATE_LABS,
    payload: status,
  };
};

export const updateAllLabsSuccess = status => ({
  type: UPDATE_LABS_SUCCESS,
  payload: status,
});

export const updateAllLabsFail = error => ({
  type: UPDATE_LABS_FAIL,
  payload: error,
});

export const getPendingLabs = id => ({
  type: GET_PENDING_LABS,
  payload: id,
});

export const getPendingLabsSuccess = pendingLabs => ({
  type: GET_PENDING_LABS_SUCCESS,
  payload: pendingLabs,
});

export const getPendingLabsFail = error => ({
  type: GET_PENDING_LABS_FAIL,
  payload: error,
});

export const getApprovedLabs = id => ({
  type: GET_APPROVED_LABS,
  payload: id,
});

export const getApprovedLabsSuccess = approvedLabs => ({
  type: GET_APPROVED_LABS_SUCCESS,
  payload: approvedLabs,
});

export const getApprovedLabsFail = error => ({
  type: GET_APPROVED_LABS_FAIL,
  payload: error,
});

export const getUnapprovedLabs = id => ({
  type: GET_UNAPPROVED_LABS,
  payload: id,
});

export const getUnapprovedLabsSuccess = unapprovedLabs => ({
  type: GET_UNAPPROVED_LABS_SUCCESS,
  payload: unapprovedLabs,
});

export const getUnapprovedLabsFail = error => ({
  type: GET_UNAPPROVED_LABS_FAIL,
  payload: error,
});
export const getSuspendedLabs = id => ({
  type: GET_SUSPENDED_LABS,
  payload: id,
});

export const getSuspendedLabsSuccess = suspendedLabs => ({
  type: GET_SUSPENDED_LABS_SUCCESS,
  payload: suspendedLabs,
});

export const getSuspendedLabsFail = error => ({
  type: GET_SUSPENDED_LABS_FAIL,
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


export const getDeleteParticipant = (participantId) => ({
  type: GET_DELETE_PARTICIPANT,
  payload: { participantId },
});

export const getDeleteParticipantSuccess = (participantId) => ({
  type: GET_DELETE_PARTICIPANT_SUCCESS,
  payload: participantId,
});

export const getDeleteParticipantFail = (error) => ({
  type: GET_DELETE_PARTICIPANT_FAIL,
  payload: error,
});