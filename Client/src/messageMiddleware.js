import { addToast } from "./actions/toastsActions";
import { newMember } from "./actions/roomActions";
import {
  REJOIN_ROOM,
  WEBSOCKET_CLOSE,
  WEBSOCKET_MESSAGE
} from "./actions/types";

const messageMiddleware = store => next => async action => {
  if (action.type === WEBSOCKET_MESSAGE) {
    const { reason, data } = action.payload;

    if (reason === "USER_JOINED") {
      store.dispatch(newMember({ member: data.user, id: data.userId }));
    }
  }

  if (action.type === WEBSOCKET_CLOSE) {
    store.dispatch(
      addToast({ text: "Connection lost. Attempting to reconnect" })
    );
  }

  if (action.type === "WEBSOCKET_REJOIN") {
    const roomId = store.getState().gameRoom.id;
    const { dispatch } = store;
    const { reconnectInterval, fetch } = action.payload;
    reconnectRoomF(roomId, reconnectInterval, dispatch, fetch);
  }

  return next(action);
};

export default messageMiddleware;

async function reconnectRoomF(roomId, reconnectInterval, dispatch, fetch) {
  try {
    const response = await fetch(`/api/${roomId}`);
    if (response.status === 200) {
      clearInterval(reconnectInterval);
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
