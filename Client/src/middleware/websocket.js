import { WEBSOCKET_CONNECT, WEBSOCKET_CLOSE } from "../actions/types";
import { error, open, message } from "../actions/websocketActions";

class ReduxWebsocket {
  constructor() {
    this.websocket = null;
    this.lastUrl = null;
  }

  close() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  connect(url, dispatch) {
    if (this.websocket) {
      throw new Error("Websocket already connected");
    }
    this.lastUrl = url;
    this.websocket = new WebSocket(url);
    this.websocket.onopen = () => this.onOpen(dispatch);
    this.websocket.onmessage = e => dispatch(message(JSON.parse(e.data)));
    this.websocket.onerror = () => this.onError(dispatch);
  }

  onOpen(dispatch) {
    dispatch(open());
  }

  onError(dispatch) {
    dispatch(error(new Error("Web socket error")));
    this.reconnect(dispatch);
  }

  reconnect(dispatch) {
    this.websocket = null;
    this.connect(this.lastUrl, dispatch);
  }
}

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
