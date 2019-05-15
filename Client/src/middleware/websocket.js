import { WEBSOCKET_CONNECT, WEBSOCKET_CLOSE } from "../actions/types";
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
    default:
      return next(action);
  }
  return store;
};

export default websocketMiddleware;
