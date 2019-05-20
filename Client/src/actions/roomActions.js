import {
  LOGIN,
  LOGIN_SUCCES,
  LOGIN_FAILURE,
  CREATE_ROOM,
  JOIN_ROOM,
  START_GAME,
  NEW_MEMBER,
  ADD_STORY,
  DELETE_STORY,
  EDIT_STORY,
  EDIT_HISTORY,
  END_GAME,
  RESET_TIMER,
  WEBSOCKET_CONNECT
} from "./types";
import { addToast } from "./toastsActions";
import * as Api from "../Api";

function connectToRoom(payload) {
  return {
    type: WEBSOCKET_CONNECT,
    payload
  };
}

function newMember(payload) {
  return {
    type: NEW_MEMBER,
    payload
  };
}

function createRoom(payload) {
  const { user } = payload;
  let { roomName } = payload;
  return async dispatch => {
    dispatch({ type: LOGIN });
    try {
      const data = await Api.create(user, roomName);
      const { roomId, memberId } = data;
      ({ roomName } = data);
      dispatch(connectToRoom(`ws://localhost:2345/${roomId}`));
      dispatch({
        type: CREATE_ROOM,
        payload: {
          id: roomId,
          roomName,
          user
        }
      });
      dispatch(newMember({ member: user, voted: false, id: memberId }));
      dispatch({ type: LOGIN_SUCCES });
    } catch (err) {
      dispatch(addToast({ text: err.message }));
      dispatch({ type: LOGIN_FAILURE });
    }
  };
}

function joinRoom(payload) {
  const { user, roomId } = payload;
  return async dispatch => {
    dispatch({ type: LOGIN });
    try {
      const data = await Api.join(user, roomId);
      const { roomName, roomMembers, started } = data.roomInfo;
      dispatch(connectToRoom(`ws://localhost:2345/${roomId}`));
      dispatch({
        type: JOIN_ROOM,
        payload: {
          id: roomId,
          roomName,
          user,
          members: roomMembers
        }
      });
      dispatch({
        type: START_GAME,
        payload: { gameStart: new Date(started) }
      });
      dispatch({ type: LOGIN_SUCCES });
    } catch (err) {
      if (err instanceof Error) {
        dispatch(addToast({ text: err.message }));
        dispatch({ type: LOGIN_FAILURE }); // sets isFetching back to false
      } else dispatch({ type: LOGIN_FAILURE, payload: err }); // same + renders error
    }
  };
}

function startGame(payload) {
  const { gameStart, roomId } = payload;
  return dispatch => {
    Api.start(gameStart, roomId);
  };
}

function addStory(payload) {
  return (dispatch, getState) => {
    const { gameHistory } = getState();
    if (gameHistory.activeStory === "")
      dispatch({
        type: EDIT_HISTORY,
        payload: {
          activeStory: { id: 1, text: payload.new.story }
        }
      });
    dispatch({ type: ADD_STORY, payload });
  };
}

function deleteStory(payload) {
  return {
    type: DELETE_STORY,
    payload
  };
}

function editStory(payload) {
  return (dispatch, getState) => {
    const { gameHistory } = getState();
    if (payload.id === gameHistory.activeStory.id)
      dispatch({
        type: EDIT_HISTORY,
        payload: {
          activeStory: { id: gameHistory.activeStory.id, text: payload.value }
        }
      });
    dispatch({ type: EDIT_STORY, payload });
  };
}

function editRoomName(payload) {
  return {
    type: CREATE_ROOM,
    payload: { roomName: payload.value }
  };
}

function endGame(payload) {
  return {
    type: END_GAME,
    payload
  };
}

function resetTimer(payload) {
  return {
    type: RESET_TIMER,
    payload
  };
}

export {
  createRoom,
  joinRoom,
  newMember,
  startGame,
  addStory,
  deleteStory,
  editStory,
  editRoomName,
  endGame,
  resetTimer
};
