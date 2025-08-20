import axios from "axios";
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

// Add to cart
export const addToCart = (artId) => async (dispatch) => {
  try {
    dispatch({ type: ADD_TO_CART_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.post("/api/v1/cart/add", { artId }, config);

    dispatch({
      type: ADD_TO_CART_SUCCESS,
      payload: data.cartItem,
    });
  } catch (error) {
    dispatch({
      type: ADD_TO_CART_FAIL,
      payload: error.response?.data?.message || "Error adding to cart",
    });
  }
};

// Get cart items
export const getCart = () => async (dispatch) => {
  try {
    dispatch({ type: GET_CART_REQUEST });

    const { data } = await axios.get("/api/v1/cart", {
      withCredentials: true,
    });

    if (data.success) {
      dispatch({
        type: GET_CART_SUCCESS,
        payload: data.cartItems,
      });
    } else {
      dispatch({
        type: GET_CART_FAIL,
        payload: data.message || "Error getting cart",
      });
    }
  } catch (error) {
    dispatch({
      type: GET_CART_FAIL,
      payload: error.response?.data?.message || "Error getting cart",
    });
  }
};

// Update cart item quantity
export const updateCartItem = (cartId, quantity) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CART_ITEM_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };

    const { data } = await axios.put(
      `/api/v1/cart/${cartId}`,
      { quantity },
      config
    );

    dispatch({
      type: UPDATE_CART_ITEM_SUCCESS,
      payload: data.cartItem,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CART_ITEM_FAIL,
      payload: error.response?.data?.message || "Error updating cart item",
    });
  }
};

// Remove from cart
export const removeFromCart = (cartId) => async (dispatch) => {
  try {
    dispatch({ type: REMOVE_FROM_CART_REQUEST });

    await axios.delete(`/api/v1/cart/${cartId}`, {
      withCredentials: true,
    });

    dispatch({
      type: REMOVE_FROM_CART_SUCCESS,
      payload: cartId,
    });
  } catch (error) {
    dispatch({
      type: REMOVE_FROM_CART_FAIL,
      payload: error.response?.data?.message || "Error removing from cart",
    });
  }
};

// Clear cart
export const clearCart = () => async (dispatch) => {
  try {
    dispatch({ type: CLEAR_CART_REQUEST });

    await axios.delete("/api/v1/cart", {
      withCredentials: true,
    });

    dispatch({ type: CLEAR_CART_SUCCESS });
  } catch (error) {
    dispatch({
      type: CLEAR_CART_FAIL,
      payload: error.response?.data?.message || "Error clearing cart",
    });
  }
};

// Clear cart errors
export const clearCartErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_CART_ERRORS });
};
