import {
  // GET_CEMPLOYEE_DATAS_SUCCESS,
  // GET_CEMPLOYEE_DATAS_FAIL,
  ADD_CEMPLOYEE_DATA_SUCCESS,
  ADD_CEMPLOYEE_DATA_FAIL,
  GET_CEMPLOYEES_SUCCESS,
  GET_CEMPLOYEES_FAIL,
  UPDATE_CEMPLOYEE_SUCCESS,
  UPDATE_CEMPLOYEE_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  cemployeeDatas: [],
  cemployee: [],
  cemployees: [],
  error: {},
};

const cemployeeDatas = (state = INIT_STATE, action) => {
  switch (action.type) {
    // case GET_CEMPLOYEE_DATAS_SUCCESS:
    //   return {
    //     ...state,
    //     cemployeeDatas: action.payload.data,
    //   };

    // case GET_CEMPLOYEE_DATAS_FAIL:
    //   return {
    //     ...state,
    //     error: action.payload,
    //   };
    case GET_CEMPLOYEES_SUCCESS:
      return {
        ...state,
        cemployees: action.payload.data,
      };

    case GET_CEMPLOYEES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_CEMPLOYEE_DATA_SUCCESS:
      return {
        ...state,
        cemployeeDatas: [...state.cemployeeDatas, action.payload.data],
      };

    case ADD_CEMPLOYEE_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    
    case UPDATE_CEMPLOYEE_SUCCESS:
      return {
        ...state,
        cemployees: state.cemployees.map(cemployee =>
          cemployee.id.toString() === action.payload.id.toString()
            ? { cemployee, ...action.payload }
            : cemployee
        ),
      };

    case UPDATE_CEMPLOYEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default cemployeeDatas;
