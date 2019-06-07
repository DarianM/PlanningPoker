import { addToast } from "../actions/toastsActions";
import { newMember, renameRoom, removeMember } from "../actions/roomActions";
import {
  addingStory,
  startingStory,
  endingStory,
  renamingStory,
  flippingCards,
  addingVote,
  memberVoted,
  deletingVotes,
  resetingTimer
} from "../actions/storyActions";
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
    const response = await fetch(`/api/room/${roomId}`);
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
        addingVote({ user: data.user, voted: data.value, id: data.id })
      );
      store.dispatch(memberVoted({ user: data.user, voted: true }));
    }

    if (reason === "FLIP_CARDS") {
      store.dispatch(flippingCards(data));
    }

    if (reason === "STORY_STARTED") {
      store.dispatch(startingStory(data));
    }
    if (reason === "STORY_ENDED") {
      store.dispatch(endingStory(data));
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
    if (reason === "NEW_STORY") {
      store.dispatch(addingStory(data));
    }
    if (reason === "STORY_RENAMED") {
      store.dispatch(renamingStory(data));
    }
    if (reason === "TIMER_RESET") {
      store.dispatch(resetingTimer(data));
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
