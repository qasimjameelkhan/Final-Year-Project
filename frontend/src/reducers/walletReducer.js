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

export const walletReducer = (state = { wallet: {} }, action) => {
  switch (action.type) {
    case WALLET_DETAILS_REQUEST:
    case ADD_FUNDS_REQUEST:
    case TRANSFER_FUNDS_REQUEST:
    case GET_TRANSACTIONS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case WALLET_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        wallet: action.payload.wallet,
      };

    case ADD_FUNDS_SUCCESS:
      return {
        ...state,
        loading: false,
        wallet: action.payload.wallet,
        success: true,
      };

    case TRANSFER_FUNDS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };

    case GET_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        transactions: action.payload.transactions,
      };

    case WALLET_DETAILS_FAIL:
    case ADD_FUNDS_FAIL:
    case TRANSFER_FUNDS_FAIL:
    case GET_TRANSACTIONS_FAIL:
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
