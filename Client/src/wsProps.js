import {
  WEBSOCKET_CLOSE,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_ERROR,
  WEBSOCKET_OPEN,
  WEBSOCKET_MESSAGE
} from "./actions/types";

export default class Wsprops {
  constructor(URL, dispatch) {
    this.ws = new WebSocket(URL);
    this.dispatch = dispatch;

    this.ws.onopen = () => this.open();

    this.ws.onerror = () => this.error();

    this.ws.onclose = () => this.close();

    this.ws.onmessage = event => this.message(event.data);
  }

  open() {
    this.ws.hasOpened = true;
    this.dispatch({ type: WEBSOCKET_OPEN });
    this.ws.pingInterval = setInterval(() => {
      this.ws.send("ping");
    }, 7000);
  }

  error() {
    clearInterval(this.ws.pingInterval);
    if (this.ws.hasOpened) {
      const reconnectInterval = setInterval(() => {
        this.ws = new Wsprops(URL);
        const data = fetch;
        this.dispatch({
          type: "WEBSOCKET_REJOIN",
          payload: { reconnectInterval, data }
        });
      }, 10000);
    }
  }

  close() {
    this.dispatch({ type: WEBSOCKET_CLOSE });
  }

  message(payload) {
    this.dispatch({
      type: WEBSOCKET_MESSAGE,
      payload: JSON.parse(payload)
    });
  }
}
