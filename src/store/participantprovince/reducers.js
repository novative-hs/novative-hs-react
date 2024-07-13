import {
    GET_PROVINCE_LIST_SUCCESS,
    GET_PROVINCE_LIST_FAIL,
    ADD_NEW_PROVINCE_SUCCESS,
    ADD_NEW_PROVINCE_FAIL,
    UPDATE_PROVINCE_SUCCESS,
    UPDATE_PROVINCE_FAIL,


  } from "./actionTypes";
  
  const INIT_STATE = {
    ListProvince: [],
    error: {},
    AddProvince: [],
    province: [],
  };
  
  const ListProvince = (state = INIT_STATE, action) => {
    switch (action.type) {
      
      ////PROVINCE
      case GET_PROVINCE_LIST_SUCCESS:
        return {
          ...state,
          ListProvince: action.payload,
        };
  
      case GET_PROVINCE_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case ADD_NEW_PROVINCE_SUCCESS:
        return {
          ...state,
          AddProvince: [...state.AddProvince, action.payload.data],
        };
  
      case ADD_NEW_PROVINCE_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case UPDATE_PROVINCE_SUCCESS:
        return {
          ...state,
          ListProvince: state.ListProvince.map(province =>
            province.id.toString() === action.payload.id.toString()
              ? { province, ...action.payload }
              : province
          ),
        };
  
      case UPDATE_PROVINCE_FAIL:
        return {
          ...state,
          error: action.payload,
        };


      default:
        return state;
    }
  };
  
  export default ListProvince;
  