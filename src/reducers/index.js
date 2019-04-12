import { combineReducers } from "redux";
import roomReducer from "./logReducer";
import storiesReducer from "./storiesReducer";
import voteReducer from "./voteReducer";
import msgReducer from "./messagesReducer";
import toasts from "./toasts";

export default combineReducers({
  gameRoom: roomReducer,
  gameHistory: storiesReducer,
  gameVotes: voteReducer,
  chat: msgReducer,
  toasts
});
