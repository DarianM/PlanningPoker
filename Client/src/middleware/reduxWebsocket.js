import {
  error,
  open,
  message,
  reconnecting,
  reconnected
} from "../actions/websocketActions";

class ReduxWebsocket {
  constructor(waitBetweenRetries) {
    this.websocket = null;
    this.lastUrl = null;
    this.waitBetweenRetries = waitBetweenRetries || 5000;
    this.isReconnecting = false;
  }

  close() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
      this.isReconnecting = false;
    }
  }

  connect(url, dispatch) {
    if (this.websocket) {
      throw new Error("Websocket already connected");
    }
    this.lastUrl = url;
    try {
      this.websocket = new WebSocket(url);
      this.websocket.onopen = () => this.onOpen(dispatch);
      this.websocket.onmessage = e => dispatch(message(JSON.parse(e.data)));
      this.websocket.onerror = () => this.onError(dispatch);
    } catch (e) {
      this.onError(dispatch);
    }
  }

  onOpen(dispatch) {
    if (this.isReconnecting) {
      this.isReconnecting = false;
      dispatch(reconnected());
    }
    dispatch(open());
  }

  onError(dispatch) {
    dispatch(error(new Error("Web socket error")));
    this.handleBroken(dispatch);
  }

  handleBroken(dispatch) {
    if (!this.isReconnecting) {
      this.reconnect(dispatch);
    }
    setTimeout(() => this.reconnect(dispatch), this.waitBetweenRetries);
  }

  reconnect(dispatch) {
    this.websocket = null;
    this.isReconnecting = true;
    dispatch(reconnecting());
    this.connect(this.lastUrl, dispatch);
  }
}

export default ReduxWebsocket;
