import { ADD_VOTE, FLIP_CARDS, DELETE_VOTES, END_GAME } from "../actions/types";

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

  if (action.type === "UPDATE_VOTES") {
    return {
      ...state,
      list: [...state.list, ...action.payload]
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
