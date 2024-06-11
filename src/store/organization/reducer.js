import {
  REGISTER_ORGANIZATION,
  REGISTER_ORGANIZATION_SUCCESSFUL,
  REGISTER_ORGANIZATION_FAILED,
} from "./actionTypes";

const initialState = {
  emailError: null,
  usernameError: null,
  passwordError: null,
  incompleteRegistrationError: null,
  message: null,
  loading: false,
};

const organizationaccount = (state = initialState, action) => {
  switch (action.type) {
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
