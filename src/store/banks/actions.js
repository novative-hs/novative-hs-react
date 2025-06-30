import {
    GET_BANK_LIST,
    GET_BANK_LIST_FAIL,
    GET_BANK_LIST_SUCCESS,
    ADD_NEW_BANK,
    ADD_NEW_BANK_SUCCESS,
    ADD_NEW_BANK_FAIL,
    UPDATE_BANK,
    UPDATE_BANK_SUCCESS,
    UPDATE_BANK_FAIL,
  } from "./actionTypes";
  // get Bank Action
 export const getbanklist = (id) => {
  console.log("🚀 Action → getbanklist called with ID:", id);
  return {
    type: GET_BANK_LIST,
    payload: id,
  };
};

  
  export const getbanklistSuccess = ListBank => ({
    type: GET_BANK_LIST_SUCCESS,
    payload: ListBank,
  });
  
  export const getbanklistFail = error => ({
    type: GET_BANK_LIST_FAIL,
    payload: error,
  });
  //Add  Bank Action
  export const addNewBank = (createBank, id) => ({
    type: ADD_NEW_BANK,
    payload: { createBank, id },
  });

  export const addNewBankSuccess = createBank => ({
    type: ADD_NEW_BANK_SUCCESS,
    payload: createBank,
  });
  
  export const addNewBankFail = error => ({
    type: ADD_NEW_BANK_FAIL,
    payload: error,
  });
  //Update  Bank Action
  export const updateBank = bank => {
    return {
      type: UPDATE_BANK,
      payload: bank,
    };
  };
  
  export const updateBanksSuccess = bank => ({
    type: UPDATE_BANK_SUCCESS,
    payload: bank,
  });
  
  export const updateBanksFail = error => ({
    type: UPDATE_BANK_FAIL,
    payload: error,
  });
