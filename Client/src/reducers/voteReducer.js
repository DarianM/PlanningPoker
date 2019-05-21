import {
  ADD_VOTE,
  FLIP_CARDS,
  DELETE_VOTES,
  END_GAME,
  UPDATE_ROOM
} from "../actions/types";

const initialState = {
  votes: {}
};

export default function(state = initialState, action) {
  if (action.type === ADD_VOTE) {
    const { user, voted } = action.payload;
    const alreadyVoted = state.list.find(e => e.user === user);
    const vote = {
      ...action.payload
    };
    if (alreadyVoted === undefined)
      return {
        ...state,
        list: [...state.list, vote]
      };
    const updatedVote = { ...alreadyVoted, voted };
    const newList = state.list.filter(e => e.user !== user);
    return { ...state, list: [...newList, updatedVote] };
  }

  if (action.type === UPDATE_ROOM) {
    const { roomMembers } = action.payload;
    const voted = roomMembers
      .filter(member => member.voted)
      .map(m => ({ user: m.member, voted: m.voted, id: m.id }));
    return {
      ...state,
      list: voted
    };
  }

  if (action.type === FLIP_CARDS) {
    return { ...state, ...action.payload };
  }

  if (action.type === DELETE_VOTES) {
    return { ...state, ...action.payload };
  }

  if (action.type === END_GAME) {
    return { ...state, ...action.payload };
  }

  return state;
}
