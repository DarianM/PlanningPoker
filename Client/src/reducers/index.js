import { combineReducers } from "redux";
import roomReducer from "./logReducer";
import storiesReducer from "./storiesReducer";
import toasts from "./toasts";
import connection from "./connectivity";

export default combineReducers({
  gameRoom: roomReducer,
  stories: storiesReducer,
  toasts,
  connection
});
