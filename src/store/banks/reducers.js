

import {
    GET_BANK_LIST_SUCCESS,
    GET_BANK_LIST_FAIL,
    ADD_NEW_BANK_SUCCESS,
    ADD_NEW_BANK_FAIL,
    UPDATE_BANK_SUCCESS,
    UPDATE_BANK_FAIL,


  } from "./actionTypes";
  
  const INIT_STATE = {
    ListBank: [],
    error: {},
    AddBank: [],
    bank: [],
  };
  
  const ListBank = (state = INIT_STATE, action) => {
    switch (action.type) {
      
      ////BANK
     case GET_BANK_LIST_SUCCESS:
  console.log("✅ Reducer → GET_BANK_LIST_SUCCESS:", action.payload); // log success payload
  return {
    ...state,
    ListBank: action.payload,
  };

case GET_BANK_LIST_FAIL:
  console.error("❌ Reducer → GET_BANK_LIST_FAIL:", action.payload); // log error payload
  return {
    ...state,
    error: action.payload,
  };

      case ADD_NEW_BANK_SUCCESS:
        return {
          ...state,
          AddBank: [...state.AddBank, action.payload.data],
        };
  
      case ADD_NEW_BANK_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case UPDATE_BANK_SUCCESS:
        return {
          ...state,
          ListBank: state.ListBank.map(bank =>
            bank.id.toString() === action.payload.id.toString()
              ? { bank, ...action.payload }
              : bank
          ),
        };
  
      case UPDATE_BANK_FAIL:
        return {
          ...state,
          error: action.payload,
        };


      default:
        return state;
    }
  };
  
  export default ListBank;
  