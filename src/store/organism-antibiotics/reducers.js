// import { addOrganismlist } from "./actions";
import {
  GET_ORGANISM_LIST_SUCCESS,
  GET_ORGANISM_LIST_FAIL,
  ADD_ORGANISM_LIST_SUCCESS,
  ADD_ORGANISM_LIST_FAIL,
  UPDATE_ORGANISM_LIST_SUCCESS,
  UPDATE_ORGANISM_LIST_FAIL,
  DELETE_ORGANISM_LIST_SUCCESS,
  DELETE_ORGANISM_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  ListOrganism: [],
  AddOrganismlist: [],
  UpdateOrganismlist: [],
  DeleteOrganism: [],
};
const ListOrganism = (state = INIT_STATE, action) => {
  switch (action.type) {
    /////////////analyte
    case GET_ORGANISM_LIST_SUCCESS:
      console.log("Data received in success action:", action.payload); // Log the action.payload
      return {
        ...state,
        ListOrganism: action.payload,
      };

    case GET_ORGANISM_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_ORGANISM_LIST_SUCCESS:
      return {
        ...state,
        AddOrganismlist: [...state.AddOrganismlist, action.payload.data],
      };

    case ADD_ORGANISM_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
     case UPDATE_ORGANISM_LIST_SUCCESS:
      return {
        ...state,
        UpdateOrganismlist: [...state.UpdateOrganismlist, action.payload.data],
      };

    case UPDATE_ORGANISM_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case DELETE_ORGANISM_LIST_SUCCESS:
      return {
        ...state,
        DeleteOrganismlist: [...state.DeleteOrganismlistOrganismlist, action.payload.data],
      };

    case DELETE_ORGANISM_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    
    
    default:
      return state;
  }
};

export default ListOrganism;
