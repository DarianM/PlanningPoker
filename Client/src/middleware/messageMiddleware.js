import { addToast } from "../actions/toastsActions";
import {
  startingGame,
  newMember,
  renameRoom,
  removeMember
} from "../actions/roomActions";
import {
  addingVote,
  memberVoted,
  flippingCards,
  deletingVotes
} from "../actions/voteActions";
import { send } from "../actions/websocketActions";
import {
  UPDATE_ROOM,
  WEBSOCKET_ERROR,
  WEBSOCKET_MESSAGE,
  WEBSOCKET_RECONNECTING,
  WEBSOCKET_RECONNECTED,
  WEBSOCKET_OPEN
} from "../actions/types";

const TIMEOUT_BETWEEN_PINGS = 5000;

let pingInterval = null;
async function reconnectRoomF(roomId, user, interval, dispatch, fetch) {
  try {
    const response = await fetch(`/api/${roomId}`);
    if (response.status === 200) {
      clearInterval(interval);
      const data = await response.json();
      dispatch({ type: UPDATE_ROOM, payload: { ...data, roomId, user } });

      dispatch(addToast({ text: "Reconnecting successful..." }));
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
        addingVote({ user: data.user, voted: data.voted, id: data.id })
      );
      store.dispatch(memberVoted({ user: data.user, voted: true }));
    }

    if (reason === "FLIP_CARDS") {
      store.dispatch(flippingCards({ flip: data.flip }));
    }

    if (reason === "GAME_STARTED") {
      store.dispatch(startingGame({ gameStart: new Date(data.date) }));
    }
    if (reason === "CLEAR_VOTES") {
      store.dispatch(deletingVotes(data));
    }
    if (reason === "ROOM_NAME_UPDATED") {
      store.dispatch(renameRoom(data));
    }
    if (reason === "USER_LEFT") {
      store.dispatch(removeMember(data));
    }
    return {};
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
    const { id, user } = store.getState().gameRoom;
    const { dispatch } = store;
    const interval = action.payload;
    await reconnectRoomF(id, user, interval, dispatch, fetch);
  }

  return next(action);
};

export default messageMiddleware(window.fetch);
export { messageMiddleware as messageMidTest };
