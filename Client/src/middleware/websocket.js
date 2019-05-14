import { WEBSOCKET_CONNECT, WEBSOCKET_CLOSE } from "../actions/types";

let websocket;

const websocketMiddleware = store => next => action => {
  switch (action.type) {
    case WEBSOCKET_CONNECT:
      if (websocket) {
        throw new Error("Websocket already connected");
      }
      websocket = new WebSocket(action.payload);
      break;
    case WEBSOCKET_CLOSE:
      if (websocket) {
        websocket.close();
        websocket = null;
      }
      break;
    default:
      return next(action);
  }
};

export default websocketMiddleware;
