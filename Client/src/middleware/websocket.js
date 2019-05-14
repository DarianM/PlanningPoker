import { WEBSOCKET_CONNECT } from "../actions/types";

let websocket;

const websocketMiddleware = store => next => action => {
  websocket = new WebSocket(action.payload);
  return next(action);
};

export default websocketMiddleware;
