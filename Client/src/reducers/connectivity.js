import {
  LOGIN,
  LOGIN_SUCCES,
  LOGIN_FAILURE,
  GAME_STARTING,
  GAME_STARTED,
  GAME_FAILURE
} from "../actions/types";

const initialState = {
  isLoading: false,
  error: ""
};

export default function connection(state = initialState, action) {
  const starting = { ...state, isLoading: true };
  const success = { ...state, isLoading: false, error: null };
  const failure = { ...state, isLoading: false, error: action.payload };

  switch (action.type) {
    case LOGIN: {
      return starting;
    }

    case LOGIN_SUCCES:
      return success;

    case LOGIN_FAILURE:
      return failure;

    case GAME_STARTING:
      return starting;

    case GAME_STARTED:
      return success;

    case GAME_FAILURE:
      return failure;

    default:
      return state;
  }
}
