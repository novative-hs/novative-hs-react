import {
  SELECTED_SCHEMES,
  SELECTED_SCHEMES_SUCCESS,
  SELECTED_SCHEMES_FAIL,
  
} from "./actionTypes";

//////////////Scheme////////////
export const getSelectedSchemesList = (id) => ({
  type: SELECTED_SCHEMES,
  payload: id,
});

export const getSelectedSchemesListSuccess = (SelectedSchemes) => {
  console.log("SelectedSchemes response in success action:", SelectedSchemes); 
  return {
    type: SELECTED_SCHEMES_SUCCESS,
    payload: SelectedSchemes,
  };
};

export const getSelectedSchemesListFail = (error) => {
  console.log("Error response in fail action:", error); 
  return {
    type: SELECTED_SCHEMES_FAIL,
    payload: error,
  };
};
