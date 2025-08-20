import axios from "axios";
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

export const createPortfolio = (portfolioData) => async (dispatch) => {
  try {
    dispatch({ type: PORTFOLIO_CREATE_REQUEST });

    const formData = new FormData();
    formData.append("title", portfolioData.title);
    formData.append("description", portfolioData.description);
    if (portfolioData.file) {
      formData.append("file", portfolioData.file);
    }

    const { data } = await axios.post(`/api/v1/portfolio/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch({
      type: PORTFOLIO_CREATE_SUCCESS,
      payload: data.portfolio,
    });
  } catch (error) {
    dispatch({
      type: PORTFOLIO_CREATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const updatePortfolio = (id, portfolioData) => async (dispatch) => {
  try {
    dispatch({ type: PORTFOLIO_UPDATE_REQUEST });

    const formData = new FormData();

    // Append text fields
    if (portfolioData.title) formData.append("title", portfolioData.title);
    if (portfolioData.description)
      formData.append("description", portfolioData.description);

    // Only append file if it exists and is a new file
    if (portfolioData.file && portfolioData.file instanceof File) {
      formData.append("file", portfolioData.file);
    }

    const { data } = await axios.put(
      `/api/v1/portfolio/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch({
      type: PORTFOLIO_UPDATE_SUCCESS,
      payload: data.portfolio,
    });
  } catch (error) {
    dispatch({
      type: PORTFOLIO_UPDATE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const deletePortfolio = (id) => async (dispatch) => {
  try {
    dispatch({ type: PORTFOLIO_DELETE_REQUEST });

    await axios.delete(`/api/v1/portfolio/delete/${id}`);

    dispatch({
      type: PORTFOLIO_DELETE_SUCCESS,
      payload: id,
    });
  } catch (error) {
    dispatch({
      type: PORTFOLIO_DELETE_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const listPortfolios = () => async (dispatch) => {
  try {
    dispatch({ type: PORTFOLIO_LIST_REQUEST });

    const { data } = await axios.get(`/api/v1/portfolio`);

    dispatch({
      type: PORTFOLIO_LIST_SUCCESS,
      payload: data.portfolios,
    });
  } catch (error) {
    dispatch({
      type: PORTFOLIO_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};
