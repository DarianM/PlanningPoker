import { WEBSOCKET_CONNECT, WEBSOCKET_CLOSE } from "../actions/types";

let websocket;

const websocketMiddleware = store => next => action => {
  switch (action.type) {
    case WEBSOCKET_CONNECT:
      websocket = new WebSocket(action.payload);
      break;
    case WEBSOCKET_CLOSE:
      websocket.close();
  }
  return next(action);
};

export default websocketMiddleware;
