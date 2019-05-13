import {
  LOGIN,
  LOGIN_SUCCES,
  LOGIN_FAILURE,
  CREATE_ROOM,
  JOIN_ROOM,
  START_GAME,
  NEW_MEMBER,
  ADD_VOTE,
  ADD_MESSAGE,
  ADD_STORY,
  DELETE_STORY,
  EDIT_STORY,
  EDIT_HISTORY,
  USER_VOTE,
  FLIP_CARDS,
  DELETE_VOTES,
  END_GAME,
  RESET_TIMER,
  WEBSOCKET_OPEN,
  WEBSOCKET_SEND,
  WEBSOCKET_CONNECT
} from "./types";
import { addToast } from "./toastsActions";

function createRoomF(payload, fetch) {
  const { user } = payload;
  return async dispatch => {
    dispatch({ type: LOGIN });
    let { roomName } = payload;
    try {
      const response = await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, roomName })
      });
      if (response.ok) {
        const data = await response.json();
        ({ roomName } = data);
        const { roomId, memberId } = data;

        dispatch({
          type: WEBSOCKET_CONNECT,
          payload: `ws://192.168.1.113:2345/${roomId}`
        });

        dispatch({
          type: CREATE_ROOM,
          payload: {
            id: roomId,
            roomName,
            user
          }
        });

        dispatch({
          type: NEW_MEMBER,
          payload: { member: user, voted: false, id: memberId }
        });
        dispatch({ type: LOGIN_SUCCES });
      } else {
        dispatch(addToast({ text: "Server offline..." }));
        dispatch({ type: LOGIN_FAILURE });
      }
    } catch (error) {
      dispatch(addToast({ text: "Check your internet connection" }));
      dispatch({ type: LOGIN_FAILURE });
    }
  };
}

function createRoom(payload) {
  return createRoomF(payload, fetch);
}

function joinRoomF(payload, fetch) {
  const { user, roomId } = payload;
  return async dispatch => {
    dispatch({ type: LOGIN });
    try {
      const response = await fetch("/api/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, roomId })
      });
      if (response.status === 200) {
        const data = await response.json();
        dispatch({
          type: "WEBSOCKET_CONNECT",
          payload: `ws://192.168.1.113:2345/${roomId}`
        });
        dispatch({
          type: JOIN_ROOM,
          payload: {
            id: roomId,
            roomName: data.roomName,
            user,
            members: data.roomMembers
          }
        });
        dispatch({ type: LOGIN_SUCCES });
      } else if (response.status === 400) {
        const data = await response.json();
        console.log(data.error);
        dispatch({ type: LOGIN_FAILURE, payload: data.error });
      } else {
        dispatch(addToast({ text: "Server offline..." }));
        dispatch({ type: LOGIN_FAILURE });
      }
    } catch (error) {
      dispatch(addToast({ text: "Check your internet connection" }));
      dispatch({ type: LOGIN_FAILURE });
    }
  };
}

function joinRoom(payload) {
  return joinRoomF(payload, fetch);
}

function startGame(payload) {
  return {
    type: START_GAME,
    payload
  };
}

function addVote(payload) {
  return async dispatch => {
    const { user, roomId, voted } = payload;
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, roomId, voted })
      });
      if (response.ok) {
        const { id } = await response.json();
        payload.id = id;

        dispatch({
          type: "WEBSOCKET_SEND",
          payload: {
            action: "USER_VOTED",
            data: { user, roomId, voted, id }
          }
        });
        dispatch({
          type: ADD_VOTE,
          payload
        });
      }
    } catch (error) {
      console.log(error);
    }
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

function addMessage(payload) {
  return {
    type: ADD_MESSAGE,
    payload
  };
}

function memberVoted(payload) {
  return {
    type: USER_VOTE,
    payload
  };
}

function flipCards(payload) {
  return {
    type: FLIP_CARDS,
    payload
  };
}

function deleteVotes(payload) {
  return {
    type: DELETE_VOTES,
    payload
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

export default {
  createRoom,
  createRoomF,
  joinRoom,
  joinRoomF,
  startGame,
  addVote,
  addStory,
  deleteStory,
  editStory,
  editRoomName,
  addMessage,
  memberVoted,
  flipCards,
  deleteVotes,
  endGame,
  resetTimer
};
