import suspendedLabs from "pages/RegistrationAdmin/suspended-labs";
import {

  GET_PENDING_LABS_SUCCESS,
  GET_PENDING_LABS_FAIL,
  GET_APPROVED_LABS_SUCCESS,
  GET_APPROVED_LABS_FAIL,
  GET_UNAPPROVED_LABS_SUCCESS,
  GET_UNAPPROVED_LABS_FAIL,
  GET_SUSPENDED_LABS_SUCCESS,
  GET_SUSPENDED_LABS_FAIL,
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
  GET_ALL_PARTICIPANT_SUCCESS,
  GET_ALL_PARTICIPANT_FAIL,
  UPDATE_MEMBERSHIP_STATUS_SUCCESS,
  UPDATE_MEMBERSHIP_STATUS_FAIL,
  UPDATE_LABS_SUCCESS,
  UPDATE_LABS_FAIL,
  GET_DELETE_PARTICIPANT_SUCCESS,
  GET_DELETE_PARTICIPANT_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  AllLabs:[],
  pendingLabs: [],
  approvedLabs: [],
  unapprovedLabs: [],
  suspendedLabs: [],
  pendingB2BClients: [],
  approvedB2BClients: [],
  unapprovedB2BClients: [],
  deleteparticipants:[],
  success: [],
  error: {},
  Membershipstatus:[],
};

const registrationAdmin = (state = INIT_STATE, action) => {
  switch (action.type) {

    case UPDATE_MEMBERSHIP_STATUS_SUCCESS:
      return {
        ...state,
        Membershipstatus: state.Membershipstatus.map(status =>
          status.id.toString() === action.payload.id.toString()
            ? { status, ...action.payload }
            : status
        ),
      };

    case UPDATE_MEMBERSHIP_STATUS_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case GET_ALL_PARTICIPANT_SUCCESS:
      return {
        ...state,
        AllLabs: action.payload.data,
      };

    case GET_ALL_PARTICIPANT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case UPDATE_LABS_SUCCESS:
        return {
          ...state,
          updateAllLabs: state.updateAllLabs.map(status =>
            status.id.toString() === action.payload.id.toString()
              ? { status, ...action.payload }
              : status
          ),
        };
  
      case UPDATE_LABS_FAIL:
        return {
          ...state,
          error: action.payload,
        };
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
      case GET_SUSPENDED_LABS_SUCCESS:
        return {
          ...state,
          suspendedLabs: action.payload.data,
        };
  
      case GET_SUSPENDED_LABS_FAIL:
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

      /// delete partcipants///
       case GET_DELETE_PARTICIPANT_SUCCESS:
      return {
        ...state,
        approvedLabs: action.payload.data,
      };

    case GET_DELETE_PARTICIPANT_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default registrationAdmin;
