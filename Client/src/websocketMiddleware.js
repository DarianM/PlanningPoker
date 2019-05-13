import { addToast } from "./actions/toastsActions";
import {
  REJOIN_ROOM,
  WEBSOCKET_CONNECT,
  WEBSOCKET_CLOSE,
  WEBSOCKET_MESSAGE
} from "./actions/types";

const reconnectMiddleware = store => next => action => {
  if (action.type === WEBSOCKET_MESSAGE) {
    const { reason, data } = action.payload;

    if (reason === "USER_JOINED") {
      store.dispatch({
        type: "NEW_MEMBER",
        payload: {
          member: data.user,
          voted: false,
          id: data.userId
        }
      });
    }
  }
  if (action.type === WEBSOCKET_CLOSE) {
    const roomId = store.getState().gameRoom.id;
    store.dispatch(
      addToast({ text: "Connection lost. Attempting to reconnect" })
    );
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/${roomId}`);
        if (response.status === 200) {
          clearInterval(interval);
          store.dispatch({
            type: WEBSOCKET_CONNECT,
            payload: `ws://${window.location.host}:2345/${roomId}`
          });
          const data = await response.json();
          store.dispatch(addToast({ text: "Reconnecting successful..." }));
          store.dispatch({
            type: REJOIN_ROOM,
            payload: {
              roomName: data.roomName,
              members: data.members
            }
          });
        } else {
          store.dispatch(
            addToast({ text: "Server seems to be offline. Retrying..." })
          );
        }
      } catch (error) {
        store.dispatch(addToast({ text: "Reconnecting failed..." }));
      }
    }, 10000);
  }
  return next(action);
};

export default reconnectMiddleware;
