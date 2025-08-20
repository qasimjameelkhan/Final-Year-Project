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

const initialState = {
  arts: [],
  publicArts: [],
  art: null,
  publicArt: null,
  loading: false,
  error: null,
};

export const artReducer = (state = initialState, action) => {
  switch (action.type) {
    case ART_CREATE_REQUEST:
    case ART_UPDATE_REQUEST:
    case ART_DELETE_REQUEST:
    case ART_LIST_REQUEST:
    case ART_DETAILS_REQUEST:
    case PUBLIC_ART_LIST_REQUEST:
    case PUBLIC_ART_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case ART_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        arts: [...state.arts, action.payload],
      };

    case ART_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        arts: state.arts.map((art) =>
          art.id === action.payload.id ? action.payload : art
        ),
      };

    case ART_DELETE_SUCCESS:
      return {
        ...state,
        loading: false,
        arts: state.arts.filter((art) => art.id !== action.payload),
      };

    case ART_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        arts: action.payload,
      };

    case ART_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        art: action.payload,
      };

    case PUBLIC_ART_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        publicArts: action.payload,
      };

    case PUBLIC_ART_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        publicArt: action.payload,
      };

    case ART_CREATE_FAIL:
    case ART_UPDATE_FAIL:
    case ART_DELETE_FAIL:
    case ART_LIST_FAIL:
    case ART_DETAILS_FAIL:
    case PUBLIC_ART_LIST_FAIL:
    case PUBLIC_ART_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
