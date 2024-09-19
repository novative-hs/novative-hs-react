import {
  
  SELECTED_SCHEMES_SUCCESS,
  SELECTED_SCHEMES_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  SelectedSchemeList: [],
  error: {}, 
};

const SelectedSchemeList = (state = INIT_STATE, action) => {
  switch (action.type) {
            case SELECTED_SCHEMES_SUCCESS:
              console.log("Data received in success action:", action.payload); // Log the action.payload
              return {
                ...state,
                SelectedSchemeList: action.payload,
              };
        
            case SELECTED_SCHEMES_FAIL:
              return {
                ...state,
                error: action.payload,
              };
    default:
      return state;
  }
};

export default SelectedSchemeList;

