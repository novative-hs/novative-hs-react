import {
  GET_NEARBY_LABS_FAIL,
  GET_NEARBY_LABS_SUCCESS,
 
  GET_REGION_WISE_ADVERTISEMENT_FAIL,
  GET_REGION_WISE_ADVERTISEMENT_SUCCESS,
  GET_ADV_LIVE_FAIL,
  GET_ADV_LIVE_SUCCESS,
  
} from "./actionTypes";

const INIT_STATE = {
  regionWiseAdvertisement:[],
  nearbyLabs: [],

  advLives: [],
 
  error: {},
};

const labMarket = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_NEARBY_LABS_SUCCESS:
      return {
        ...state,
        nearbyLabs: action.payload.data,
      };

    case GET_NEARBY_LABS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
 

    case GET_REGION_WISE_ADVERTISEMENT_SUCCESS:
        return {
          ...state,
          regionWiseAdvertisement: action.payload.data,
        };
  
    case GET_REGION_WISE_ADVERTISEMENT_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    case GET_ADV_LIVE_SUCCESS:
        return {
          ...state,
          advLives: action.payload.data,
        };
  
      case GET_ADV_LIVE_FAIL:
        return {
          ...state,
          error: action.payload,
        };

    default:
      return state;
  }
};

export default labMarket;
