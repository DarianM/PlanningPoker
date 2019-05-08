import {
  WEBSOCKET_CONNECT,
  WEBSOCKET_SEND,
  WEBSOCKET_CLOSE,
  WEBSOCKET_DISCONNECT,
  WEBSOCKET_ERROR,
  WEBSOCKET_OPEN,
  WEBSOCKET_MESSAGE
} from "./actions/types";

let websocket;
let pingInterval;

const socketMiddleware = store => next => action => {
  if (action.type === WEBSOCKET_CONNECT) {
    websocket = new WebSocket(action.payload);

    websocket.onopen = () => {
      store.dispatch({ type: WEBSOCKET_OPEN });
      pingInterval = setInterval(() => {
        websocket.send("ping");
      }, 7000);
    };

    websocket.onerror = err => {
      console.log(err);
      clearInterval(pingInterval);
    };

    websocket.onclose = () => {
      store.dispatch({ type: WEBSOCKET_CLOSE });
    };

    websocket.onmessage = event => {
      store.dispatch({
        type: WEBSOCKET_MESSAGE,
        payload: JSON.parse(event.data)
      });
    };
  }
  if (action.type === WEBSOCKET_SEND) {
    websocket.send(JSON.stringify(action.payload));
  }
  return next(action);
};

export default socketMiddleware;
