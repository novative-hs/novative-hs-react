import {
    GET_SECTOR_LIST_SUCCESS,
    GET_SECTOR_LIST_FAIL,
    ADD_NEW_SECTOR_SUCCESS,
    ADD_NEW_SECTOR_FAIL,
    UPDATE_SECTOR_SUCCESS,
    UPDATE_SECTOR_FAIL,


  } from "./actionTypes";
  
  const INIT_STATE = {
    ListSector: [],
    error: {},
    AddSector: [],
    sector: [],
  };
  
  const ListSector = (state = INIT_STATE, action) => {
    switch (action.type) {
      
      ////SECTOR
      case GET_SECTOR_LIST_SUCCESS:
        return {
          ...state,
          ListSector: action.payload,
        };
  
      case GET_SECTOR_LIST_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case ADD_NEW_SECTOR_SUCCESS:
        return {
          ...state,
          AddSector: [...state.AddSector, action.payload.data],
        };
  
      case ADD_NEW_SECTOR_FAIL:
        return {
          ...state,
          error: action.payload,
        };
      case UPDATE_SECTOR_SUCCESS:
        return {
          ...state,
          ListSector: state.ListSector.map(sector =>
            sector.id.toString() === action.payload.id.toString()
              ? { sector, ...action.payload }
              : sector
          ),
        };
  
      case UPDATE_SECTOR_FAIL:
        return {
          ...state,
          error: action.payload,
        };


      default:
        return state;
    }
  };
  
  export default ListSector;
  