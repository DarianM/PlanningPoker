import {
  WEBSOCKET_CONNECT,
  WEBSOCKET_CLOSE,
  WEBSOCKET_SEND
} from "../actions/types";
import ReduxWebsocket from "./reduxWebsocket";

const reduxWebsocket = new ReduxWebsocket();

const websocketMiddleware = store => next => action => {
  switch (action.type) {
    case WEBSOCKET_CONNECT:
      reduxWebsocket.connect(action.payload, store.dispatch);
      break;
    case WEBSOCKET_CLOSE:
      reduxWebsocket.close();
      break;
    case WEBSOCKET_SEND:
      reduxWebsocket.send(action.payload);
      break;
    default:
      return next(action);
  }
  return store;
};

export default websocketMiddleware;
