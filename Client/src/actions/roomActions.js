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
  RESET_TIMER
} from "./types";
import { addToast } from "./toastsActions";

function openWebSocket(user, roomId, dispatch) {
  console.log(`opening web socket for room ${roomId}`);
  const socket = new WebSocket(`ws://192.168.0.101:2345/`);
  socket.onopen = () => socket.send(JSON.stringify({ id: roomId }));
  const pingInterval = setInterval(() => {
    socket.send("ping");
  }, 7000);
  socket.onerror = () => {
    console.log("Error ");
    clearInterval(pingInterval);
  };
  socket.onclose = () => {
    dispatch(addToast({ text: "Connection lost. Attempting to reconnect..." }));
    const rejoinInterval = setInterval(() => {
      dispatch(rejoin({ user, roomId, rejoinInterval }));
    }, 10000);
  };
  socket.onmessage = event => {
    const data = JSON.parse(event.data);
    dispatch({
      type: NEW_MEMBER,
      payload: {
        member: data.user,
        voted: false,
        id: data.userId
      }
    });
  };
}

function rejoin(payload) {
  return async dispatch => {
    const { roomId, user } = payload;
    try {
      const response = await fetch(`/api/${roomId}`);
      if (response.status === 200) {
        clearInterval(payload.rejoinInterval);
        openWebSocket(user, roomId, dispatch);
        const data = await response.json();
        dispatch(addToast({ text: "Reconnecting successful..." }));
        dispatch({
          type: JOIN_ROOM,
          payload: {
            id: roomId,
            roomName: data.roomName,
            user,
            members: data.members,
            hasJoined: true
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
      const data = await response.json();
      ({ roomName } = data);
      const { roomId, memberId } = data;
      openWebSocket(user, roomId, dispatch);

      dispatch({
        type: CREATE_ROOM,
        payload: {
          id: roomId,
          hasJoined: true,
          roomName
        }
      });
      dispatch({
        type: NEW_MEMBER,
        payload: { member: user, voted: false, id: memberId }
      });
    } catch (error) {
      dispatch(addToast({ text: "Server is offline..." }));
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
      const data = await response.json();
      console.log(data);
      if (response.status === 400) {
        console.log(data.error);
      } else {
        openWebSocket(user, roomId, dispatch);
        dispatch({
          type: JOIN_ROOM,
          payload: {
            id: roomId,
            roomName: data.roomName,
            user,
            members: data.roomMembers,
            hasJoined: true
          }
        });
      }
    } catch (error) {
      dispatch(addToast({ text: "Server offline" }));
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
  return { type: ADD_VOTE, payload };
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
