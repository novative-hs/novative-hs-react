import {
    GET_DISTRICT_LIST_SUCCESS,
    GET_DISTRICT_LIST_FAIL,
    ADD_NEW_DISTRICT_SUCCESS,
    ADD_NEW_DISTRICT_FAIL,
    UPDATE_DISTRICT_SUCCESS,
    UPDATE_DISTRICT_FAIL,


  } from "./actionTypes";
  
  const INIT_STATE = {
    ListDistrict: [],
    error: {},
    AddDistrict: [],
    district: [],
  };
  
  const ListDistrict = (state = INIT_STATE, action) => {
    switch (action.type) {
      
      ////DISTRICT
      case GET_DISTRICT_LIST_SUCCESS:
        return {
          ...state,
          ListDistrict: action.payload,
        };
  
      case GET_DISTRICT_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case ADD_NEW_DISTRICT_SUCCESS:
        return {
          ...state,
          AddDistrict: [...state.AddDistrict, action.payload.data],
        };
  
      case ADD_NEW_DISTRICT_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case UPDATE_DISTRICT_SUCCESS:
        return {
          ...state,
          ListDistrict: state.ListDistrict.map(district =>
            district.id.toString() === action.payload.id.toString()
              ? { district, ...action.payload }
              : district
          ),
        };
  
      case UPDATE_DISTRICT_FAIL:
        return {
          ...state,
          error: action.payload,
        };


      default:
        return state;
    }
  };
  
  export default ListDistrict;
  