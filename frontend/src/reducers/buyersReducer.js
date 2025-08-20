import {
  GET_ALL_BUYERS_REQUEST,
  GET_ALL_BUYERS_SUCCESS,
  GET_ALL_BUYERS_FAIL,
  CLEAR_ERRORS,
} from "../constants/UserConstants";

const initialState = {
  buyers: [],
  loading: false,
  error: null,
};

export const buyersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_BUYERS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_ALL_BUYERS_SUCCESS:
      return {
        ...state,
        loading: false,
        buyers: action.payload,
      };

    case GET_ALL_BUYERS_FAIL:
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
