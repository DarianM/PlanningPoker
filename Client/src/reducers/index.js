import { combineReducers } from "redux";
import roomReducer from "./logReducer";
import storiesReducer from "./storiesReducer";
import voteReducer from "./voteReducer";
import toasts from "./toasts";
import connection from "./connectivity";

export default combineReducers({
  gameRoom: roomReducer,
  gameHistory: storiesReducer,
  gameVotes: voteReducer,
  toasts,
  connection
});
