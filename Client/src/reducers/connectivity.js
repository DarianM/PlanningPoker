import {
  LOGIN,
  LOGIN_SUCCES,
  LOGIN_FAILURE,
  GAME_STARTING,
  GAME_STARTED,
  GAME_FAILURE,
  FLIP_STARTING,
  FLIP_SUCCESS,
  FLIP_FAILURE,
  CLEAR_STARTING,
  CLEAR_SUCCESS,
  CLEAR_FAILURE,
  END_STARTING,
  END_SUCCESS,
  END_FAILURE,
  RESET_STARTING,
  RESET_SUCCESS,
  RESET_FAILURE
} from "../actions/types";

const initialState = {
  isLoading: false,
  error: []
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

    case FLIP_STARTING:
      return starting;

    case FLIP_SUCCESS:
      return success;

    case FLIP_FAILURE:
      return failure;

    case CLEAR_STARTING:
      return starting;

    case CLEAR_SUCCESS:
      return success;

    case CLEAR_FAILURE:
      return failure;

    case END_STARTING:
      return starting;

    case END_SUCCESS:
      return success;

    case END_FAILURE:
      return failure;

    case RESET_STARTING:
      return starting;

    case RESET_SUCCESS:
      return success;

    case RESET_FAILURE:
      return failure;

    default:
      return state;
  }
}
