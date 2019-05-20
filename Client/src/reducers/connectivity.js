import {
  LOGIN,
  LOGIN_SUCCES,
  LOGIN_FAILURE,
  GAME_STARTING,
  GAME_STARTED
} from "../actions/types";

const initialState = {
  isFetching: false,
  isStarting: false,
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

    case GAME_STARTING:
      return { ...state, isStarting: true };

    case GAME_STARTED:
      return { ...state, isStarting: false };

    default:
      return state;
  }
}
