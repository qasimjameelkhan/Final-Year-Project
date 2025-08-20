import axios from "axios";
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

// Get all transactions
export const getAllTransactions = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_TRANSACTIONS_REQUEST });

    const { data } = await axios.get("/api/v1/admin/transactions", {
      withCredentials: true,
    });

    dispatch({
      type: GET_ALL_TRANSACTIONS_SUCCESS,
      payload: data.transactions,
    });
  } catch (error) {
    dispatch({
      type: GET_ALL_TRANSACTIONS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get analytics summary
export const getAnalyticsSummary = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ANALYTICS_SUMMARY_REQUEST });

    const { data } = await axios.get("/api/v1/admin/analytics", {
      withCredentials: true,
    });

    dispatch({
      type: GET_ANALYTICS_SUMMARY_SUCCESS,
      payload: data.analytics,
    });
  } catch (error) {
    dispatch({
      type: GET_ANALYTICS_SUMMARY_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get sales by category
export const getSalesByCategory = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SALES_BY_CATEGORY_REQUEST });

    const { data } = await axios.get("/api/v1/admin/sales-by-category", {
      withCredentials: true,
    });

    dispatch({
      type: GET_SALES_BY_CATEGORY_SUCCESS,
      payload: data.salesByCategory,
    });
  } catch (error) {
    dispatch({
      type: GET_SALES_BY_CATEGORY_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
