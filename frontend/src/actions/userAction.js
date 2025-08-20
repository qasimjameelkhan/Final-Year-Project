import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAIL,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_REQUEST,
  UPDATE_USER_FAILED,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  GET_USER_PROFILE_REQUEST,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_FAIL,
  UPDATE_USER_PROFILE_REQUEST,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_FAIL,
  CLEAR_ERRORS,
} from "../constants/UserConstants";

import axios from "axios";

// Register user
export const register = (formData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST });

    console.log("formData", formData);
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.post(`/api/v1/register`, formData, config);

    dispatch({ type: REGISTER_USER_SUCCESS });
  } catch (error) {
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response.data.message,
    });
  }
};

// user login

export const login = (formData) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.post(`/api/v1/loggedIn`, formData, config);

    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: error.response.data.message });
  }
};

export const userLogOut = () => async (dispatch) => {
  try {
    await axios.get(`/api/v1/logout`);

    dispatch({
      type: LOGOUT_USER_SUCCESS,
    });
  } catch (error) {
    dispatch({ type: LOGOUT_USER_FAIL, payload: error.response.data.message });
  }
};

export const getUserProfile = () => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_PROFILE_REQUEST });

    const { data } = await axios.get("/api/v1/user/getUserProfile");

    dispatch({
      type: GET_USER_PROFILE_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: GET_USER_PROFILE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateUserProfile = (profileData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_PROFILE_REQUEST });

    const formData = new FormData();
    formData.append("username", profileData.username);
    formData.append("email", profileData.email);
    if (profileData.file) {
      formData.append("file", profileData.file);
    }

    console.log("Sending form data:", {
      username: profileData.username,
      email: profileData.email,
      hasFile: !!profileData.file,
    });

    const { data } = await axios.put(
      "/api/v1/user/updateUserProfile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch({
      type: UPDATE_USER_PROFILE_SUCCESS,
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_USER_PROFILE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

// clearing errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
