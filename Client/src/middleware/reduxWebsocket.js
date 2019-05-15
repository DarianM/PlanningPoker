import {
  error,
  open,
  message,
  reconnecting,
  reconnected
} from "../actions/websocketActions";

class ReduxWebsocket {
  constructor() {
    this.websocket = null;
    this.lastUrl = null;
    this.isReconnecting = false;
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
    if (this.isReconnecting) {
      dispatch(reconnected());
      this.isReconnecting = false;
    }
    dispatch(open());
  }

  onError(dispatch) {
    dispatch(error(new Error("Web socket error")));
    this.reconnect(dispatch);
  }

  reconnect(dispatch) {
    this.websocket = null;
    this.isReconnecting = true;
    dispatch(reconnecting());
    this.connect(this.lastUrl, dispatch);
  }
}

export default ReduxWebsocket;
