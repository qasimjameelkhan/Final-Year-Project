import {
  PORTFOLIO_CREATE_REQUEST,
  PORTFOLIO_CREATE_SUCCESS,
  PORTFOLIO_CREATE_FAIL,
  PORTFOLIO_UPDATE_REQUEST,
  PORTFOLIO_UPDATE_SUCCESS,
  PORTFOLIO_UPDATE_FAIL,
  PORTFOLIO_DELETE_REQUEST,
  PORTFOLIO_DELETE_SUCCESS,
  PORTFOLIO_DELETE_FAIL,
  PORTFOLIO_LIST_REQUEST,
  PORTFOLIO_LIST_SUCCESS,
  PORTFOLIO_LIST_FAIL,
} from "../constants/portfolioConstants";

const initialState = {
  portfolios: [],
  loading: false,
  error: null,
};

export const portfolioReducer = (state = initialState, action) => {
  switch (action.type) {
    case PORTFOLIO_CREATE_REQUEST:
    case PORTFOLIO_UPDATE_REQUEST:
    case PORTFOLIO_DELETE_REQUEST:
    case PORTFOLIO_LIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case PORTFOLIO_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        portfolios: [...state.portfolios, action.payload],
      };

    case PORTFOLIO_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        portfolios: state.portfolios.map((portfolio) =>
          portfolio.id === action.payload.id ? action.payload : portfolio
        ),
      };

    case PORTFOLIO_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        portfolios: state.portfolios.filter(
          (portfolio) => portfolio.id !== action.payload
        ),
      };

    case PORTFOLIO_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        portfolios: action.payload,
      };

    case PORTFOLIO_CREATE_FAIL:
    case PORTFOLIO_UPDATE_FAIL:
    case PORTFOLIO_DELETE_FAIL:
    case PORTFOLIO_LIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
