import {

  GET_PENDING_LABS_SUCCESS,
  GET_PENDING_LABS_FAIL,
  GET_APPROVED_LABS_SUCCESS,
  GET_APPROVED_LABS_FAIL,
  GET_UNAPPROVED_LABS_SUCCESS,
  GET_UNAPPROVED_LABS_FAIL,
  APPROVE_UNAPPROVE_LAB_SUCCESS,
  APPROVE_UNAPPROVE_LAB_FAIL,
  GET_PENDING_B2B_CLIENTS_SUCCESS,
  GET_PENDING_B2B_CLIENTS_FAIL,
  GET_APPROVED_B2B_CLIENTS_SUCCESS,
  GET_APPROVED_B2B_CLIENTS_FAIL,
  GET_UNAPPROVED_B2B_CLIENTS_SUCCESS,
  GET_UNAPPROVED_B2B_CLIENTS_FAIL,
  APPROVE_UNAPPROVE_B2B_CLIENT_SUCCESS,
  APPROVE_UNAPPROVE_B2B_CLIENT_FAIL,
  
} from "./actionTypes";

const INIT_STATE = {

  pendingLabs: [],
  approvedLabs: [],
  unapprovedLabs: [],
  pendingB2BClients: [],
  approvedB2BClients: [],
  unapprovedB2BClients: [],
 
  success: [],
  error: {},
};

const registrationAdmin = (state = INIT_STATE, action) => {
  switch (action.type) {

    
    case GET_PENDING_LABS_SUCCESS:
      return {
        ...state,
        pendingLabs: action.payload.data,
      };

    case GET_PENDING_LABS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_APPROVED_LABS_SUCCESS:
      return {
        ...state,
        approvedLabs: action.payload.data,
      };

    case GET_APPROVED_LABS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_UNAPPROVED_LABS_SUCCESS:
      return {
        ...state,
        unapprovedLabs: action.payload.data,
      };

    case GET_UNAPPROVED_LABS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case APPROVE_UNAPPROVE_LAB_SUCCESS:
      return {
        ...state,
        success: [...state.success, action.payload],
      };

    case APPROVE_UNAPPROVE_LAB_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_PENDING_B2B_CLIENTS_SUCCESS:
      return {
        ...state,
        pendingB2BClients: action.payload.data,
      };

    case GET_PENDING_B2B_CLIENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_APPROVED_B2B_CLIENTS_SUCCESS:
      return {
        ...state,
        approvedB2BClients: action.payload.data,
      };

    case GET_APPROVED_B2B_CLIENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_UNAPPROVED_B2B_CLIENTS_SUCCESS:
      return {
        ...state,
        unapprovedB2BClients: action.payload.data,
      };

    case GET_UNAPPROVED_B2B_CLIENTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case APPROVE_UNAPPROVE_B2B_CLIENT_SUCCESS:
      return {
        ...state,
        success: [...state.success, action.payload],
      };

    case APPROVE_UNAPPROVE_B2B_CLIENT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    

    default:
      return state;
  }
};

export default registrationAdmin;
