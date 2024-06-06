import {
  GET_LAB_PROFILE_SUCCESS,
  GET_LAB_PROFILE_FAIL,
  UPDATE_LAB_PROFILE,
  UPDATE_LAB_PROFILE_SUCCESS,
  UPDATE_LAB_PROFILE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  labProfile: [],
  error: "",
  success: "",
  message: null,
  emailError: null,
};

const labProfile = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_LAB_PROFILE_SUCCESS:
      return {
        ...state,
        success: action.payload.data,
        emailError: null,
      };

    case GET_LAB_PROFILE_FAIL:
      return {
        ...state,
        emailError: action.payload.email,
        error: action.payload,
      };
    case UPDATE_LAB_PROFILE:
      state = {
        ...state,

        emailError: null,
      };

    case UPDATE_LAB_PROFILE_SUCCESS:
      return {
        ...state,
        emailError: null,
        labProfile: state.labProfile.map(labProfile =>
          labProfile.id.toString() === action.payload.id.toString()
            ? { labProfile, ...action.payload }
            : labProfile
        ),
      };

    case UPDATE_LAB_PROFILE_FAIL:
      console.log("Email Errorrrr:", action.payload.email); 
      return {
        ...state,
        emailError: action.payload.email,
        error: action.payload,
      };
      
      default:
        return state;
    }
  };

export default labProfile;
