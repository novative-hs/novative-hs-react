import {
  GET_NEARBY_PACKAGES_FAIL,
  GET_NEARBY_PACKAGES_SUCCESS,
  GET_PACKAGES_FAIL,
  GET_PACKAGES_SUCCESS
} from "./actionTypes";

const INIT_STATE = {
  nearbyPackages: [],
  Packages:[],
  error: {},
};

const PackageMarket = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_NEARBY_PACKAGES_SUCCESS:
      return {
        ...state,
        nearbyPackages: action.payload.data,
      };

    case GET_NEARBY_PACKAGES_FAIL:
      return {
        ...state,
        error: action.payload,
      };
      case GET_PACKAGES_SUCCESS:
        return {
          ...state,
          Packages: action.payload.data,
        };
  
      case GET_PACKAGES_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    default:
      return state;
  }
};

export default PackageMarket;
