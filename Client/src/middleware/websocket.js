import { WEBSOCKET_CONNECT } from "../actions/types";

let websocket;

const websocketMiddleware = store => next => action => {
  if (action.type === WEBSOCKET_CONNECT) {
    websocket = new WebSocket(action.payload);
  }
  return next(action);
};

export default websocketMiddleware;
