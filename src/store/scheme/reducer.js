import {
  
  GET_SCHEME_LIST_SUCCESS,
  GET_SCHEME_LIST_FAIL,
  GET_SCHEMENAME_SUCCESS,
  GET_SCHEMENAME_FAIL,
  GET_SCHEMEANALYTE_SUCCESS,
  GET_SCHEMEANALYTE_FAIL,
  ADD_NEW_SCHEME_LIST_SUCCESS,
  ADD_NEW_SCHEME_LIST_FAIL,
  UPDATE_NEW_SCHEME_LIST_SUCCESS,
  UPDATE_NEW_SCHEME_LIST_FAIL,
  DELETE_SCHEME_SUCCESS,
  DELETE_SCHEME_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  SchemeList: [],
  AddUnits: [], 
  SchemeAnalytes: [],   
  unit: [],
  error: {}, 
};

const SchemeList = (state = INIT_STATE, action) => {
  switch (action.type) {
            case GET_SCHEME_LIST_SUCCESS:
              console.log("Data received in success action:", action.payload); // Log the action.payload
              return {
                ...state,
                SchemeList: action.payload,
              };
        
            case GET_SCHEME_LIST_FAIL:
              return {
                ...state,
                error: action.payload,
              };
             case GET_SCHEMEANALYTE_SUCCESS:
  console.log("SCHEMEANALYTE:", action.payload);  // Log the received data

  return {
    ...state,
    SchemeAnalyte: 
      Array.isArray(action.payload?.data?.analytes) 
        ? action.payload.data.analytes 
        : [],  // Extract analytes array
    error: null,  // Clear any previous errors
  };

              
              case GET_SCHEMEANALYTE_FAIL:
                console.error("Failed to fetch scheme analyte:", action.payload);
                return {
                  ...state,
                  SchemeAnalyte: [], // Reset to empty array on failure
                  error: action.payload || 'Failed to fetch analyte data.', // Store the error message
                };
              
              
                    /////analytes associated with units
                  case GET_SCHEMENAME_SUCCESS:
                    console.log("SCHEMENAME:", action.payload);
                    return {
                      ...state,
                      SchemeAnalyte: action.payload, // Update to handle units array
                    };
              
                  case GET_SCHEMENAME_FAIL:
                    return {
                      ...state,
                      error: action.payload,
                    };
              case ADD_NEW_SCHEME_LIST_SUCCESS:
                return {
                  ...state,
                  AddUnits: [...state.AddUnits, action.payload.data],
                };
          
              case ADD_NEW_SCHEME_LIST_FAIL:
                return {
                  ...state,
                  error: action.payload,
                };
              case UPDATE_NEW_SCHEME_LIST_SUCCESS:
                return {
                  ...state,
                  SchemeList: state.SchemeList.map(unit =>
                    unit.id.toString() === action.payload.id.toString()
                      ? { unit, ...action.payload }
                      : unit
                  ),
                };
          
              case UPDATE_NEW_SCHEME_LIST_FAIL:
                return {
                  ...state,
                  error: action.payload,
                }; 

              case DELETE_SCHEME_SUCCESS:
                return {
                  ...state,
                  unit: state.unit.filter(
                    person => person.id.toString() !== action.payload.id.toString()
                  ),
                };
              
              case DELETE_SCHEME_FAIL:
                return {
                  ...state,
                  error: action.payload,
                };

    default:
      return state;
  }
};

export default SchemeList;

