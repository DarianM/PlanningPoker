import {
  CREATE_ROOM,
  JOIN_ROOM,
  REJOIN_ROOM,
  START_GAME,
  USER_VOTE,
  NEW_MEMBER,
  DELETE_VOTES,
  RESET_TIMER,
  WEBSOCKET_OPEN
} from "../actions/types";

const initialState = {
  room: {}
};

export default function(state = initialState, action) {
  if (action.type === CREATE_ROOM) {
    return { ...state, ...action.payload };
  }
  if (action.type === WEBSOCKET_OPEN) {
    return { ...state, hasJoined: true };
  }
  if (action.type === START_GAME) {
    return { ...state, ...action.payload };
  }
  if (action.type === NEW_MEMBER) {
    const member = { ...action.payload, voted: false };
    return {
      ...state,
      members: [...state.members, member]
    };
  }

  if (action.type === JOIN_ROOM) {
    return {
      ...state,
      ...action.payload
    };
  }
  if (action.type === REJOIN_ROOM) {
    return {
      ...state,
      ...action.payload
    };
  }

  if (action.type === USER_VOTE) {
    const { user, voted } = action.payload;
    return {
      ...state,
      members: state.members.map(e => (e.member === user ? { ...e, voted } : e))
    };
  }
  if (action.type === DELETE_VOTES) {
    return {
      ...state,
      members: state.members.map(e => ({ ...e, voted: false }))
    };
  }

  if (action.type === RESET_TIMER) {
    return {
      ...state,
      gameStart: new Date()
    };
  }

  return state;
}
