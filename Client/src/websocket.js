import * as types from "./actions/types";
import { rejoin } from "./actions/roomActions";
import { addToast } from "./actions/toastsActions";

let websocket;
let pingInterval;
let roomId;

const socketMiddleware = store => next => action => {
  if (action.type === types.WEBSOCKET_CONNECT) {
    ({ roomId } = action.payload);
    websocket = new WebSocket(`ws://192.168.1.105:2345/${roomId}`);

    websocket.onopen = () => {
      store.dispatch({ type: "WEBSOCKET_OPEN" });
      pingInterval = setInterval(() => {
        websocket.send("ping");
      }, 7000);
    };

    websocket.onerror = err => {
      console.log(err);
      clearInterval(pingInterval);
    };

    websocket.onclose = event => {
      const { user } = store.getState().gameRoom;
      store.dispatch(
        addToast({ text: "Connection lost. Attempting to reconnect..." })
      );
      const rejoinInterval = setInterval(() => {
        store.dispatch(rejoin({ user, roomId, rejoinInterval }));
      }, 10000);
      store.dispatch({ type: "WEBSOCKET_CLOSE", payload: event });
    };

    websocket.onmessage = event =>
      store.dispatch({ type: "WEBSOCKET_MESSAGE", payload: event });
  }
  if (action.type === types.WEBSOCKET_SEND) {
    setTimeout(() => {
      websocket.send(JSON.stringify(action.payload));
    }, 2000);
  }
  return next(action);
};

export default socketMiddleware;
