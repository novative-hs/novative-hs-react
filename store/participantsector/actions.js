import {
    GET_SECTOR_LIST,
    GET_SECTOR_LIST_FAIL,
    GET_SECTOR_LIST_SUCCESS,
    ADD_NEW_SECTOR,
    ADD_NEW_SECTOR_SUCCESS,
    ADD_NEW_SECTOR_FAIL,
    UPDATE_SECTOR,
    UPDATE_SECTOR_SUCCESS,
    UPDATE_SECTOR_FAIL,
  } from "./actionTypes";
  // get Sector Action
  export const getsectorlist = (id) => ({
    type: 'GET_SECTOR_LIST',
    payload: id,
  });
  
  export const getsectorlistSuccess = ListSector => ({
    type: GET_SECTOR_LIST_SUCCESS,
    payload: ListSector,
  });
  
  export const getsectorlistFail = error => ({
    type: GET_SECTOR_LIST_FAIL,
    payload: error,
  });
  //Add  Sector Action
  export const addNewSector = (createSector, id) => ({
    type: ADD_NEW_SECTOR,
    payload: { createSector, id },
  });

  export const addNewSectorSuccess = createSector => ({
    type: ADD_NEW_SECTOR_SUCCESS,
    payload: createSector,
  });
  
  export const addNewSectorFail = error => ({
    type: ADD_NEW_SECTOR_FAIL,
    payload: error,
  });
  //Update  Sector Action
  export const updateSector = sector => {
    return {
      type: UPDATE_SECTOR,
      payload: sector,
    };
  };
  
  export const updateSectorsSuccess = sector => ({
    type: UPDATE_SECTOR_SUCCESS,
    payload: sector,
  });
  
  export const updateSectorsFail = error => ({
    type: UPDATE_SECTOR_FAIL,
    payload: error,
  });

  
