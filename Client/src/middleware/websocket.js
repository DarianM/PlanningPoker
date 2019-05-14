import { WEBSOCKET_CONNECT, WEBSOCKET_CLOSE } from "../actions/types";
import { open } from "../actions/websocketActions";

let websocket;

const onOpen = dispatch => {
  dispatch(open());
};

const websocketMiddleware = store => next => action => {
  switch (action.type) {
    case WEBSOCKET_CONNECT:
      if (websocket) {
        throw new Error("Websocket already connected");
      }
      websocket = new WebSocket(action.payload);
      websocket.onopen = () => onOpen(store.dispatch);
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
