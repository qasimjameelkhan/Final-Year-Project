import axios from "axios";
import {
  WALLET_DETAILS_REQUEST,
  WALLET_DETAILS_SUCCESS,
  WALLET_DETAILS_FAIL,
  ADD_FUNDS_REQUEST,
  ADD_FUNDS_SUCCESS,
  ADD_FUNDS_FAIL,
  TRANSFER_FUNDS_REQUEST,
  TRANSFER_FUNDS_SUCCESS,
  TRANSFER_FUNDS_FAIL,
  GET_TRANSACTIONS_REQUEST,
  GET_TRANSACTIONS_SUCCESS,
  GET_TRANSACTIONS_FAIL,
  CLEAR_ERRORS,
} from "../constants/walletConstants";

// Get wallet details
export const getWalletDetails = () => async (dispatch) => {
  try {
    dispatch({ type: WALLET_DETAILS_REQUEST });

    const { data } = await axios.get("/api/v1/wallet");

    dispatch({
      type: WALLET_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: WALLET_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Create payment intent
export const createPaymentIntent = (amount) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/v1/wallet/create-payment-intent",
      { amount },
      config
    );

    return data.clientSecret;
  } catch (error) {
    dispatch({
      type: ADD_FUNDS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Add funds to wallet
export const addFunds = (paymentIntentId) => async (dispatch) => {
  try {
    dispatch({ type: ADD_FUNDS_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/v1/wallet/add-funds",
      { paymentIntentId },
      config
    );

    dispatch({
      type: ADD_FUNDS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ADD_FUNDS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Transfer funds
export const transferFunds = (toUserId, amount) => async (dispatch) => {
  try {
    dispatch({ type: TRANSFER_FUNDS_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/v1/wallet/transfer",
      { toUserId, amount },
      config
    );

    dispatch({
      type: TRANSFER_FUNDS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: TRANSFER_FUNDS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get transactions
export const getTransactions = () => async (dispatch) => {
  try {
    dispatch({ type: GET_TRANSACTIONS_REQUEST });

    const { data } = await axios.get("/api/v1/wallet/transactions");

    dispatch({
      type: GET_TRANSACTIONS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_TRANSACTIONS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
