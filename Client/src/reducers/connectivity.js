import * as types from "../actions/types";

const initialState = {
  isFetching: false,
  error: ""
};

export default function connection(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN: {
      return { ...state, isFetching: true };
    }

    case types.LOGIN_SUCCES:
      return { ...state, isFetching: false, error: null };

    case types.LOGIN_FAILURE:
      return { ...state, isFetching: false, error: action.payload };

    default:
      return state;
  }
}
