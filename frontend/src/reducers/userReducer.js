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
  CLEAR_ERRORS,
  GET_USER_PROFILE_REQUEST,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_FAIL,
  UPDATE_USER_PROFILE_REQUEST,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_FAIL,
} from "../constants/UserConstants";

const initialState = {
  user: null,
  loading: false,
  error: null,
  publicArtists: [],
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case UPDATE_USER_REQUEST:
    case REGISTER_USER_REQUEST:
      return {
        ...state,
        loading: true,
        isAuthenticated: false,
      };

    case REGISTER_USER_SUCCESS:
      return {
        loading: true,
        isAuthenticated: false,
      };

    case LOGIN_SUCCESS:
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };

    case LOGOUT_USER_SUCCESS:
      return {
        loading: false,
        user: null,
        isAuthenticated: false,
      };

    case REGISTER_USER_FAIL: {
      return {
        loading: false,
        isAuthenticated: false,
        error: action.payload,
      };
    }
    case LOGIN_FAIL:
    case UPDATE_USER_FAILED:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    case LOGOUT_USER_FAIL:
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

    case GET_USER_PROFILE_REQUEST:
    case UPDATE_USER_PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_USER_PROFILE_SUCCESS:
    case UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };

    case GET_USER_PROFILE_FAIL:
    case UPDATE_USER_PROFILE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
