import {
  REGISTER_ORGANIZATION,
  REGISTER_ORGANIZATION_SUCCESSFUL,
  REGISTER_ORGANIZATION_FAILED,
  GET_ORGANIZATION_LIST_SUCCESS,
  GET_ORGANIZATION_LIST_FAIL,
  UPDATE_ORGANIZATION_LIST_SUCCESS,
  UPDATE_ORGANIZATION_LIST_FAIL,
  // DELETE_ORGANIZATION_LIST_SUCCESS,
  // DELETE_ORGANIZATION_LIST_FAIL,
} from "./actionTypes";

const initialState = {
  emailError: null,
  usernameError: null,
  passwordError: null,
  incompleteRegistrationError: null,
  message: null,
  loading: false,
  userAccountType: null,
  OrganizationList: [],
};

const organizationaccount = (state = initialState, action) => {
  switch (action.type) {
    case GET_ORGANIZATION_LIST_SUCCESS:
      console.log("Data received in success action:", action.payload); // Log the action.payload
      return {
        ...state,
        OrganizationList: action.payload.data,
      };

    case GET_ORGANIZATION_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case UPDATE_ORGANIZATION_LIST_SUCCESS:
        return {
          ...state,
          OrganizationList: state.OrganizationList.map(organization =>
            organization.id.toString() === action.payload.id.toString()
              ? { organization, ...action.payload }
              : organization
          ),
        };
      case UPDATE_ORGANIZATION_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        }; 
        // case DELETE_ORGANIZATION_LIST_SUCCESS:
          
        //     return {
        //       ...state,
        //       organization: state.OrganizationList.filter(
        //         person => person.id.toString() !== action.payload.id.toString()
              
            
        //     ),
        //   };
    
        // case DELETE_ORGANIZATION_LIST_FAIL:
        //   return {
        //     ...state,
        //     error: action.payload,
        //   };
    case REGISTER_ORGANIZATION:
      state = {
        ...state,
        userID: null,
        userAccountType: null,
        loading: true,
        emailError: null,
        usernameError: null,
        passwordError: null,
        incompleteRegistrationError: null,
      };
      break;
    case REGISTER_ORGANIZATION_SUCCESSFUL:
      console.log(state = {
        ...state,
        loading: false,
        userID: action.payload.id,
        userAccountType: action.payload.account_type,
        emailError: null,
        usernameError: null,
        passwordError: null,
        incompleteRegistrationError: null,
      });
      break;
      
    case REGISTER_ORGANIZATION_FAILED:
      
      state = {
        ...state,
        userID: null,
        userAccountType: null,
        loading: false,
        emailError: action.payload.status === 400 ? action.payload.error : null,
        usernameError: action.payload.username,
        passwordError: action.payload.password,
        incompleteRegistrationError: action.payload.error,
      };
      console.log("Username Errorrrr:", action.payload.username,); 
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default organizationaccount;
