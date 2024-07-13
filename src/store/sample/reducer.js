import {
  GET_SAMPLE_LIST_SUCCESS,
  GET_SAMPLE_LIST_FAIL,

  ADD_NEW_SAMPLE_LIST_SUCCESS,
  ADD_NEW_SAMPLE_LIST_FAIL,

  UPDATE_NEW_SAMPLE_LIST_SUCCESS,
  UPDATE_NEW_SAMPLE_LIST_FAIL,
  
  DELETE_NEW_SAMPLE_LIST_SUCCESS,
  DELETE_NEW_SAMPLE_LIST_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  ListUnitt: [],
  sample: [],
  error: {},
};

const ListUnitt = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SAMPLE_LIST_SUCCESS:
      return {
        ...state,
        ListUnitt: action.payload,
      };

    case GET_SAMPLE_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_NEW_SAMPLE_LIST_SUCCESS:
      return {
        ...state,
        sample: [...state.sample, action.payload.data],
      };

    case ADD_NEW_SAMPLE_LIST_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_NEW_SAMPLE_LIST_SUCCESS:
      console.log("Data received in UPDATE_NEW_SAMPLE_LIST_SUCCESS:", action.payload); // Log the action.payload
      return {
        ...state,
          ListUnitt: state.ListUnitt.map(sample =>
            sample.id.toString() === action.payload.id.toString()
              ? { sample, ...action.payload }
              : sample
          ),
      };
    
    case UPDATE_NEW_SAMPLE_LIST_FAIL:
      console.log("Error in UPDATE_NEW_SAMPLE_LIST_FAIL:", action.payload); // Log the action.payload
      return {
        ...state,
        error: action.payload,
      };


  

      case DELETE_NEW_SAMPLE_LIST_SUCCESS:
        console.log("Deleted data successfully:", action.payload);
        return {
          ...state,
          sample: state.sample.filter(
            person => person.id.toString() !== action.payload.id.toString()
          ),
          error: null, // Reset error when successful
        };

    case DELETE_NEW_SAMPLE_LIST_FAIL:
      console.log("Error in DELETE_NEW_SAMPLE_LIST_FAIL:", action.payload); 
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default ListUnitt;
