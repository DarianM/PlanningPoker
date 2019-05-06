import {
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

function openWebSocket(user, roomId, dispatch, s) {
  // return functest => {
  console.log(`opening web socket for room ${roomId}`);
  const socket = s;
  console.log(socket);
  // const socket = new WebSocket(`ws://192.168.1.105:2345/`);
  socket.onopen = () => {
    socket.send(JSON.stringify({ action: "USER_JOINED", id: roomId }));
  };
  const pingInterval = setInterval(() => {
    socket.send("ping");
  }, 7000);
  socket.onerror = () => clearInterval(pingInterval);
  socket.onclose = () => {
    dispatch(addToast({ text: "Connection lost. Attempting to reconnect..." }));
    const rejoinInterval = setInterval(() => {
      dispatch(rejoin({ user, roomId, rejoinInterval }));
    }, 10000);
  };
  socket.onmessage = event => {
    const data = JSON.parse(event.data);
    if (data.action === "USER_JOINED") {
      dispatch({
        type: NEW_MEMBER,
        payload: {
          member: data.user,
          voted: false,
          id: data.userId
        }
      });
    }
    if (data.action === "USER_VOTED") {
      const { user, roomId, voted, id } = data;
      dispatch({ type: ADD_VOTE, payload: { user, roomId, voted, id } });
    }
  };
  // };
}

export function rejoin(payload) {
  return async dispatch => {
    const { roomId, user } = payload;
    try {
      const response = await fetch(`/api/${roomId}`);
      if (response.status === 200) {
        clearInterval(payload.rejoinInterval);
        dispatch({ type: "WEBSOCKET_CONNECT", payload: { id: roomId } });
        const data = await response.json();
        dispatch(addToast({ text: "Reconnecting successful..." }));
        dispatch({
          type: JOIN_ROOM,
          payload: {
            id: roomId,
            roomName: data.roomName,
            user,
            members: data.members
            // hasJoined: true
          }
        });
      } else {
        dispatch(addToast({ text: "Server seems to be offline. Retrying..." }));
      }
    } catch (error) {
      dispatch(addToast({ text: "Reconnecting failed..." }));
    }
  };
}

function createRoom(payload) {
  const { user, component } = payload;
  return async dispatch => {
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
          payload: { roomId }
        });

        dispatch({
          type: CREATE_ROOM,
          payload: {
            id: roomId,
            roomName
          }
        });

        dispatch({
          type: NEW_MEMBER,
          payload: { member: user, voted: false, id: memberId }
        });
      } else {
        dispatch(addToast({ text: "Server offline..." }));
        component.setState({ isLoading: false });
      }
    } catch (error) {
      dispatch(addToast({ text: "Check your internet connection" }));
      component.setState({ isLoading: false });
    }
  };
}

function joinRoom(payload) {
  const { user, roomId, component } = payload;
  return async dispatch => {
    try {
      const response = await fetch("/api/member", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, roomId })
      });
      if (response.status === 200) {
        const data = await response.json();
        dispatch({ type: "WEBSOCKET_CONNECT", payload: { id: roomId } });
        dispatch({
          type: JOIN_ROOM,
          payload: {
            id: roomId,
            roomName: data.roomName,
            user,
            members: data.roomMembers
            // hasJoined: true
          }
        });
      } else if (response.status === 400) {
        const data = await response.json();
        console.log(data.error);
      } else {
        dispatch(addToast({ text: "Server offline..." }));
        component.setState({ isLoading: false });
      }
    } catch (error) {
      dispatch(addToast({ text: "Check your internet connection" }));
      component.setState({ isLoading: false });
    }
  };
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
        socket.send({ action: "USER_VOTED", user, roomId, voted, id });
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
  joinRoom,
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
