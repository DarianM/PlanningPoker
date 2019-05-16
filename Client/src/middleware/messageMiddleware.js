import { addToast } from "../actions/toastsActions";
import { newMember, pushVote } from "../actions/roomActions";
import { send } from "../actions/websocketActions";
import {
  REJOIN_ROOM,
  WEBSOCKET_ERROR,
  WEBSOCKET_MESSAGE,
  WEBSOCKET_RECONNECTING,
  WEBSOCKET_RECONNECTED,
  WEBSOCKET_OPEN
} from "../actions/types";

const TIMEOUT_BETWEEN_PINGS = 5000;

let pingInterval = null;
async function reconnectRoomF(roomId, interval, dispatch, fetch) {
  try {
    const response = await fetch(`/api/${roomId}`);
    if (response.status === 200) {
      clearInterval(interval);
      const data = await response.json();
      dispatch(addToast({ text: "Reconnecting successful..." }));
      dispatch({
        type: REJOIN_ROOM,
        payload: {
          roomName: data.roomName,
          members: data.members
        }
      });
    } else {
      dispatch(addToast({ text: "Server seems to be offline. Retrying..." }));
    }
  } catch (error) {
    dispatch(addToast({ text: "Reconnecting failed..." }));
  }
}

const messageMiddleware = fetch => store => next => async action => {
  if (action.type === WEBSOCKET_MESSAGE) {
    const { reason, data } = action.payload;

    if (reason === "USER_JOINED") {
      store.dispatch(newMember({ member: data.user, id: data.userId }));
    }

    if (reason === "USER_VOTED") {
      store.dispatch(
        pushVote({ user: data.user, voted: data.voted, id: data.id })
      );
    }

    if (reason === "GAME_STARTED") {
      store.dispatch({
        type: "START_GAME",
        payload: { gameStart: new Date(data.gameStart) }
      });
    }
  }

  if (action.type === WEBSOCKET_OPEN) {
    pingInterval = setInterval(() => {
      store.dispatch(send("ping"));
    }, TIMEOUT_BETWEEN_PINGS);
  }

  if (action.type === WEBSOCKET_ERROR) {
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
    store.dispatch(addToast({ text: "Connection lost" }));
  }

  if (action.type === WEBSOCKET_RECONNECTING) {
    store.dispatch(addToast({ text: "Attempting to reconnect" }));
  }

  if (action.type === WEBSOCKET_RECONNECTED) {
    const roomId = store.getState().gameRoom.id;
    const { dispatch } = store;
    const interval = action.payload;
    reconnectRoomF(roomId, interval, dispatch, fetch);
  }

  return next(action);
};

export default messageMiddleware(fetch);
export { messageMiddleware as messageMidTest };
