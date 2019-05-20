import { ADD_VOTE, USER_VOTE, FLIP_CARDS, DELETE_VOTES } from "./types";
import { addToast } from "./toastsActions";
import * as Api from "../Api";

function addVote(payload) {
  return async dispatch => {
    const { user, roomId, voted } = payload;
    Api.vote(user, roomId, voted).catch(err =>
      dispatch(addToast({ text: err.message }))
    );
  };
}

function pushVote(payload) {
  return {
    type: ADD_VOTE,
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
  return dispatch => {
    dispatch({
      type: "WEBSOCKET_SEND",
      payload: { reason: "FLIP_CARDS", data: payload }
    });
  };
}

function pushFlipCards(payload) {
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

export {
  addVote,
  pushVote,
  memberVoted,
  flipCards,
  pushFlipCards,
  deleteVotes
};
