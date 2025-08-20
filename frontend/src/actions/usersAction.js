import {
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_FAILED,
  GET_ALL_USERS_SUCCESS,
  PUBLIC_ARTISTS_LIST_REQUEST,
  PUBLIC_ARTISTS_LIST_SUCCESS,
  PUBLIC_ARTISTS_LIST_FAIL,
  CLEAR_ERRORS,
  GET_ALL_BUYERS_REQUEST,
  GET_ALL_BUYERS_SUCCESS,
  GET_ALL_BUYERS_FAIL,
} from "../constants/UserConstants";
import axios from "axios";

export const getAllArtists = () => async (dispatch) => {
  console.log("Dispatching GET_ALL_USERS_REQUEST...");
  try {
    dispatch({ type: GET_ALL_USERS_REQUEST });
    console.log("Making API call...");

    const { data } = await axios.get("/api/v1/getallArtists");
    console.log("API Response:", data);

    dispatch({ type: GET_ALL_USERS_SUCCESS, payload: data.artists });
  } catch (error) {
    console.error("API Error:", error);
    dispatch({
      type: GET_ALL_USERS_FAILED,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const getAllBuyers = () => async (dispatch) => {
  console.log("Dispatching GET_ALL_USERS_REQUEST...");
  try {
    dispatch({ type: GET_ALL_BUYERS_REQUEST });
    console.log("Making API call...");

    const { data } = await axios.get("/api/v1/getallBuyers");
    console.log("API Response:", data);

    dispatch({ type: GET_ALL_BUYERS_SUCCESS, payload: data.buyers });
  } catch (error) {
    console.error("API Error:", error);
    dispatch({
      type: GET_ALL_BUYERS_FAIL,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};

export const listPublicArtists = () => async (dispatch) => {
  try {
    dispatch({ type: PUBLIC_ARTISTS_LIST_REQUEST });

    const { data } = await axios.get("/api/v1/user/getAllPublicArtists");
    console.log("Artists data:", data);

    dispatch({
      type: PUBLIC_ARTISTS_LIST_SUCCESS,
      payload: data.formattedUsers || [],
    });
  } catch (error) {
    dispatch({
      type: PUBLIC_ARTISTS_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
