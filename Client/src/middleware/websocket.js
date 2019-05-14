import { WEBSOCKET_CONNECT, WEBSOCKET_SEND } from "../actions/types";
import WS from "../wsProps";

let websocket;

const socketMiddleware = store => next => action => {
  if (action.type === WEBSOCKET_CONNECT) {
    websocket = new WS(action.payload, store.dispatch);
  }
  if (action.type === WEBSOCKET_SEND) {
    websocket.send(JSON.stringify(action.payload));
  }
  return next(action);
};

export default socketMiddleware;
