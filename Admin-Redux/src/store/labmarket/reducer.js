import {
  GET_CART_DATA_FAIL,
  GET_CART_DATA_SUCCESS,
  GET_CUSTOMERS_FAIL,
  GET_CUSTOMERS_SUCCESS,
  GET_ORDERS_FAIL,
  GET_ORDERS_SUCCESS,
  ADD_ORDER_SUCCESS,
  ADD_ORDER_FAIL,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
  GET_NEARBY_LABS_FAIL,
  GET_NEARBY_LABS_SUCCESS,
  GET_SHOPS_FAIL,
  GET_SHOPS_SUCCESS,
  GET_PRODUCT_DETAIL_SUCCESS,
  GET_PRODUCT_DETAIL_FAIL,
  ADD_CUSTOMER_SUCCESS,
  ADD_CUSTOMER_FAIL,
  UPDATE_CUSTOMER_SUCCESS,
  UPDATE_CUSTOMER_FAIL,
  DELETE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_FAIL,
} from "./actionTypes";

const INIT_STATE = {
  nearbyLabs: [],
  product: {},
  orders: [],
  cartData: {},
  customers: [],
  shops: [],
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

    case GET_PRODUCT_DETAIL_SUCCESS:
      return {
        ...state,
        product: action.payload,
      };

    case GET_PRODUCT_DETAIL_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default labMarket;
