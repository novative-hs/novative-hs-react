import {
  // GET_CREATE_CEMPLOYEES,
  // GET_CREATE_CEMPLOYEES_FAIL,
  // GET_CREATE_CEMPLOYEES_SUCCESS,
  ADD_NEW_CEMPLOYEE_DATA,
  ADD_CEMPLOYEE_DATA_SUCCESS,
  ADD_CEMPLOYEE_DATA_FAIL,
  GET_CEMPLOYEES,
  GET_CEMPLOYEES_SUCCESS,
  GET_CEMPLOYEES_FAIL,
  UPDATE_CEMPLOYEE,
  UPDATE_CEMPLOYEE_SUCCESS,
  UPDATE_CEMPLOYEE_FAIL,
} from "./actionTypes";

// export const getCreateCemployees = id => ({
//   type: GET_CREATE_CEMPLOYEES,
//   payload: id,
// });

// export const getCreateCemployeesSuccess = createCemployees => ({
//   type: GET_CREATE_CEMPLOYEES_SUCCESS,
//   payload: createCemployees,
// });

// export const getCreateCemployeesFail = error => ({
//   type: GET_CREATE_CEMPLOYEES_FAIL,
//   payload: error,
// });
export const getCemployees = () => ({
  type: GET_CEMPLOYEES,
});

export const getCemployeesSuccess = cemployees => ({
  type: GET_CEMPLOYEES_SUCCESS,
  payload: cemployees,
});

export const getCemployeesFail = error => ({
  type: GET_CEMPLOYEES_FAIL,
  payload: error,
});

export const addNewCemployeeData = (cemployeeData, id) => ({
  type: ADD_NEW_CEMPLOYEE_DATA,
  payload: { cemployeeData, id },
});

export const addCemployeeDataSuccess = cemployeeData => ({
  type: ADD_CEMPLOYEE_DATA_SUCCESS,
  payload: cemployeeData,
});

export const addCemployeeDataFail = error => ({
  type: ADD_CEMPLOYEE_DATA_FAIL,
  payload: error,
});
export const updateCemployee = cemployee => ({
  type: UPDATE_CEMPLOYEE,
  payload: cemployee,
});

export const updateCemployeeSuccess = cemployee => ({
  type: UPDATE_CEMPLOYEE_SUCCESS,
  payload: cemployee,
});

export const updateCemployeeFail = error => ({
  type: UPDATE_CEMPLOYEE_FAIL,
  payload: error,
});
