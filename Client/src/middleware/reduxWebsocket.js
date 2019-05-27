import {
  error,
  open,
  message,
  reconnecting,
  reconnected
} from "../actions/websocketActions";

const NORMAL_CLOSURE = 1001;
const ABNORMAL_CLOSURE = 1006;

const ONE_SECOND = 1000;
const MAX_WAIT = 2 * 60 * ONE_SECOND;

class ReduxWebsocket {
  constructor(maxWaitPeriodBetweenRetries) {
    this.websocket = null;
    this.lastUrl = null;
    this.maxWaitPeriodBetweenRetries = maxWaitPeriodBetweenRetries || MAX_WAIT;
    this.isReconnecting = false;
    this.reconnectTries = 0;
  }

  close() {
    if (this.websocket) {
      this.websocket.close(NORMAL_CLOSURE, "Websocket is closing");
      this.websocket = null;
      this.isReconnecting = false;
      this.reconnectTries = 0;
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
      this.websocket.onclose = e => this.onClose(dispatch, e.code, e.reason);
    } catch (e) {
      this.onClose(dispatch, 1006, ABNORMAL_CLOSURE);
    }
  }

  onOpen(dispatch) {
    if (this.isReconnecting) {
      this.isReconnecting = false;
      this.reconnectTries = 0;
      dispatch(reconnected());
    }
    dispatch(open());
  }

  onClose(dispatch, code, reason) {
    if (code === NORMAL_CLOSURE) {
      return;
    }
    dispatch(error(new Error(reason)));
    this.isReconnecting = true;
    setTimeout(
      () => this.reconnect(dispatch),
      Math.min(
        this.reconnectTries * ONE_SECOND,
        this.maxWaitPeriodBetweenRetries
      )
    );
  }

  reconnect(dispatch) {
    this.websocket = null;
    this.isReconnecting = true;
    this.reconnectTries += 1;
    dispatch(reconnecting());
    this.connect(this.lastUrl, dispatch);
  }

  send(data) {
    if (!this.websocket) {
      return;
    }
    this.websocket.send(JSON.stringify(data));
  }
}

export default ReduxWebsocket;
