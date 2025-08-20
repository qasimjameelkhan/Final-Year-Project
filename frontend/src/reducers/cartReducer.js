import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  GET_CART_FAIL,
  UPDATE_CART_ITEM_REQUEST,
  UPDATE_CART_ITEM_SUCCESS,
  UPDATE_CART_ITEM_FAIL,
  REMOVE_FROM_CART_REQUEST,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_FAIL,
  CLEAR_CART_REQUEST,
  CLEAR_CART_SUCCESS,
  CLEAR_CART_FAIL,
  CLEAR_CART_ERRORS,
} from "../constants/cartConstants";

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART_REQUEST:
    case GET_CART_REQUEST:
    case UPDATE_CART_ITEM_REQUEST:
    case REMOVE_FROM_CART_REQUEST:
    case CLEAR_CART_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ADD_TO_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        cartItems: [...state.cartItems, action.payload],
      };

    case GET_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        cartItems: action.payload,
      };

    case UPDATE_CART_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        cartItems: state.cartItems.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };

    case REMOVE_FROM_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        cartItems: state.cartItems.filter((item) => item.id !== action.payload),
      };

    case CLEAR_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        cartItems: [],
      };

    case ADD_TO_CART_FAIL:
    case GET_CART_FAIL:
    case UPDATE_CART_ITEM_FAIL:
    case REMOVE_FROM_CART_FAIL:
    case CLEAR_CART_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_CART_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
