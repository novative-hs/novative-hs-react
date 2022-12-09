import {
  GET_TERRITORIES_LIST,
  GET_TERRITORIES_LIST_SUCCESS,
  GET_TERRITORIES_LIST_FAIL,
  GET_LABS,
  GET_LABS_SUCCESS,
  GET_LABS_FAIL,
  ADD_LAB_INFORMATION,
  ADD_LAB_INFORMATION_SUCCESSFUL,
  ADD_LAB_INFORMATION_FAILED,
} from "./actionTypes";


// Territories
export const getTerritoriesList = () => ({
  type: GET_TERRITORIES_LIST,
  payload: {},
});


export const getTerritoriesListSuccess =
  territories => ({
    type: GET_TERRITORIES_LIST_SUCCESS,
    payload: territories,
  });

export const getTerritoriesListFail = error => ({
  type: GET_TERRITORIES_LIST_FAIL,
  payload: error,
});
// lab info
export const getLabs = () => ({
  type: GET_LABS,
});

export const getLabsSuccess = labs => ({
  type: GET_LABS_SUCCESS,
  payload: labs,
});

export const getLabsFail = error => ({
  type: GET_LABS_FAIL,
  payload: error,
});

export const addLabInformation = (lab, id) => {
  return {
    type: ADD_LAB_INFORMATION,
    payload: { lab, id },
  };
};

export const addLabInformationSuccessful = (lab, id) => {
  return {
    type: ADD_LAB_INFORMATION_SUCCESSFUL,
    payload: { lab, id },
  };
};

export const addLabInformationFailed = (lab, id) => {
  return {
    type: ADD_LAB_INFORMATION_FAILED,
    payload: { lab, id },
  };
};

