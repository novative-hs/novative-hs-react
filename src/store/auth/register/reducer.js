import {
  REGISTER_USER,
  REGISTER_USER_SUCCESSFUL,
  REGISTER_USER_FAILED,
} from "./actionTypes";

const initialState = {
  usernameError: null,
  passwordError: null,
  incompleteRegistrationError: null,
  message: null,
  loading: false,
  emailError: null,
};

const account = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER:
      state = {
        ...state,
        userID: null,
        userAccountType: null,
        loading: true,
        usernameError: null,
        emailError: null,
        passwordError: null,
        incompleteRegistrationError: null,
      };
      break;
    case REGISTER_USER_SUCCESSFUL:
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
    case REGISTER_USER_FAILED:
      console.error("Error occurred during registration:", action.payload);
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
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default account;
