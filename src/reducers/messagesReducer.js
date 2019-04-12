import { ADD_VOTE, ADD_MESSAGE } from "../actions/types";

const initialState = {
  messages: {}
};

export default function(state = initialState, action) {
  if (action.type === ADD_MESSAGE) {
    const message = {
      ...action.payload,
      id: state.nextId
    };
    return {
      ...state,
      messages: [...state.messages, message],
      nextId: state.nextId + 1
    };
  }
  if (action.type === ADD_VOTE) {
    const message = {
      message: "voted!!",
      user: action.payload.user,
      id: state.nextId
    };
    return {
      ...state,
      messages: [...state.messages, message],
      nextId: state.nextId + 1
    };
  }

  return state;
}
