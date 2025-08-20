import {
  GET_ALL_TRANSACTIONS_REQUEST,
  GET_ALL_TRANSACTIONS_SUCCESS,
  GET_ALL_TRANSACTIONS_FAIL,
  GET_ANALYTICS_SUMMARY_REQUEST,
  GET_ANALYTICS_SUMMARY_SUCCESS,
  GET_ANALYTICS_SUMMARY_FAIL,
  GET_SALES_BY_CATEGORY_REQUEST,
  GET_SALES_BY_CATEGORY_SUCCESS,
  GET_SALES_BY_CATEGORY_FAIL,
  CLEAR_ERRORS,
} from "../constants/analyticsConstants";

const initialState = {
  transactions: [],
  analytics: null,
  salesByCategory: [],
  loading: false,
  error: null,
};

export const analyticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_TRANSACTIONS_REQUEST:
    case GET_ANALYTICS_SUMMARY_REQUEST:
    case GET_SALES_BY_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_ALL_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        transactions: action.payload,
      };

    case GET_ANALYTICS_SUMMARY_SUCCESS:
      return {
        ...state,
        loading: false,
        analytics: action.payload,
      };

    case GET_SALES_BY_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        salesByCategory: action.payload,
      };

    case GET_ALL_TRANSACTIONS_FAIL:
    case GET_ANALYTICS_SUMMARY_FAIL:
    case GET_SALES_BY_CATEGORY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
