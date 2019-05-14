import { WEBSOCKET_CONNECT, WEBSOCKET_CLOSE } from "../actions/types";
import { error, open, message } from "../actions/websocketActions";

let websocket;

const onOpen = dispatch => {
  dispatch(open());
};

const onMessage = (dispatch, data) => {
  dispatch(message(JSON.parse(data)));
};

const onError = dispatch => {
  dispatch(error(new Error("Web socket error")));
};

const websocketMiddleware = store => next => action => {
  switch (action.type) {
    case WEBSOCKET_CONNECT:
      if (websocket) {
        throw new Error("Websocket already connected");
      }
      websocket = new WebSocket(action.payload);
      websocket.onopen = () => onOpen(store.dispatch);
      websocket.onmessage = e => onMessage(store.dispatch, e.data);
      websocket.onerror = () => onError(store.dispatch);
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
  return store;
};

export default websocketMiddleware;
