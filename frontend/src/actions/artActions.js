import axios from "axios";
import {
  ART_CREATE_REQUEST,
  ART_CREATE_SUCCESS,
  ART_CREATE_FAIL,
  ART_UPDATE_REQUEST,
  ART_UPDATE_SUCCESS,
  ART_UPDATE_FAIL,
  ART_DELETE_REQUEST,
  ART_DELETE_SUCCESS,
  ART_DELETE_FAIL,
  ART_LIST_REQUEST,
  ART_LIST_SUCCESS,
  ART_LIST_FAIL,
  ART_DETAILS_REQUEST,
  ART_DETAILS_SUCCESS,
  ART_DETAILS_FAIL,
  PUBLIC_ART_LIST_REQUEST,
  PUBLIC_ART_LIST_SUCCESS,
  PUBLIC_ART_LIST_FAIL,
  PUBLIC_ART_DETAILS_REQUEST,
  PUBLIC_ART_DETAILS_SUCCESS,
  PUBLIC_ART_DETAILS_FAIL,
} from "../constants/artConstants";

export const createArt = (artData) => async (dispatch) => {
  try {
    dispatch({ type: ART_CREATE_REQUEST });

    const formData = new FormData();
    formData.append("title", artData.title);
    formData.append("description", artData.description);
    formData.append("category", artData.category);
    formData.append("price", artData.price);
    if (artData.file) {
      formData.append("file", artData.file);
    }

    const { data } = await axios.post(`/api/v1/art/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch({
      type: ART_CREATE_SUCCESS,
      payload: data.art,
    });
  } catch (error) {
    dispatch({
      type: ART_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updateArt = (id, artData) => async (dispatch) => {
  try {
    dispatch({ type: ART_UPDATE_REQUEST });

    const formData = new FormData();
    formData.append("title", artData.title);
    formData.append("description", artData.description);
    formData.append("category", artData.category);
    formData.append("price", artData.price);
    formData.append("status", artData.status);
    if (artData.file) {
      formData.append("file", artData.file);
    }

    const { data } = await axios.put(`/api/v1/art/update/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch({
      type: ART_UPDATE_SUCCESS,
      payload: data.art,
    });
  } catch (error) {
    dispatch({
      type: ART_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const deleteArt = (id) => async (dispatch) => {
  try {
    dispatch({ type: ART_DELETE_REQUEST });

    await axios.delete(`/api/v1/art/delete/${id}`);

    dispatch({
      type: ART_DELETE_SUCCESS,
      payload: id,
    });
  } catch (error) {
    dispatch({
      type: ART_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const listArts = () => async (dispatch) => {
  try {
    dispatch({ type: ART_LIST_REQUEST });

    const { data } = await axios.get(`/api/v1/art/getAllArts`);

    dispatch({
      type: ART_LIST_SUCCESS,
      payload: data.arts,
    });
  } catch (error) {
    dispatch({
      type: ART_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getArtDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ART_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/arts/getSingleArt/${id}`);

    dispatch({
      type: ART_DETAILS_SUCCESS,
      payload: data.art,
    });
  } catch (error) {
    dispatch({
      type: ART_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const listPublicArts = () => async (dispatch) => {
  try {
    dispatch({ type: PUBLIC_ART_LIST_REQUEST });

    const { data } = await axios.get(`/api/v1/arts/getAllPublicArts`);

    dispatch({
      type: PUBLIC_ART_LIST_SUCCESS,
      payload: data.arts,
    });
  } catch (error) {
    dispatch({
      type: PUBLIC_ART_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getPublicArtDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PUBLIC_ART_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/arts/getSinglePublicArt/${id}`);

    dispatch({
      type: PUBLIC_ART_DETAILS_SUCCESS,
      payload: data.art,
    });
  } catch (error) {
    dispatch({
      type: PUBLIC_ART_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
