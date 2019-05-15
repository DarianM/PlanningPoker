import { LOGIN, LOGIN_SUCCES, LOGIN_FAILURE } from "../actions/types";

const initialState = {
  isFetching: false,
  error: ""
};

export default function connection(state = initialState, action) {
  switch (action.type) {
    case LOGIN: {
      return { ...state, isFetching: true };
    }

    case LOGIN_SUCCES:
      return { ...state, isFetching: false, error: null };

    case LOGIN_FAILURE:
      return { ...state, isFetching: false, error: action.payload };

    default:
      return state;
  }
}
