import {
  LOGIN,
  LOGIN_SUCCES,
  LOGIN_FAILURE,
  CREATE_ROOM,
  UPDATE_ROOM,
  NEW_MEMBER,
  USER_VOTE,
  REMOVE_MEMBER
} from "./types";
import { addToast } from "./toastsActions";
import { connect } from "./websocketActions";
import * as Api from "../Api";

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
      dispatch(
        connect(
          roomId,
          memberId
        )
      );
      dispatch({
        type: CREATE_ROOM,
        payload: {
          id: roomId,
          roomName,
          user
        }
      });
      dispatch(newMember({ member: user, id: memberId }));
      dispatch({ type: LOGIN_SUCCES });
    } catch (err) {
      dispatch({ type: LOGIN_FAILURE, payload: err.map(e => e.message) });
    }
  };
}

function joinRoom(payload) {
  const { user, roomId } = payload;
  return async dispatch => {
    dispatch({ type: LOGIN });
    try {
      const data = await Api.join(user, roomId);
      const { roomInfo } = data;

      dispatch(
        connect(
          roomId,
          roomInfo.userId
        )
      );
      dispatch({ type: UPDATE_ROOM, payload: roomInfo });
      dispatch({ type: LOGIN_SUCCES });
    } catch (err) {
      dispatch({
        type: LOGIN_FAILURE,
        payload: err.map(e => e.message)
      });
    }
  };
}

function removeMember(payload) {
  return dispatch => {
    const { name } = payload;
    dispatch({ type: REMOVE_MEMBER, payload });
    dispatch(addToast({ text: `${name} has left the room` }));
  };
}

function editRoomName(payload) {
  return async dispatch => {
    const { roomName, roomId } = payload;
    if (new RegExp(/^\s*(\S\s*){5,30}$/, "g").test(roomName)) {
      await Api.updateRoomName(roomId, roomName);
    } else dispatch(addToast({ text: "Please provide a valid room name" }));
  };
}

function renameRoom(payload) {
  return {
    type: "RENAME_ROOM",
    payload
  };
}

function memberVoted(payload) {
  return { type: USER_VOTE, payload };
}

export {
  createRoom,
  renameRoom,
  joinRoom,
  newMember,
  removeMember,
  editRoomName,
  memberVoted
};
