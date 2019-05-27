import {
  ADD_VOTE,
  USER_VOTE,
  FLIP_CARDS,
  DELETE_VOTES,
  WEBSOCKET_SEND
} from "./types";
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

function addingVote(payload) {
  return {
    type: ADD_VOTE,
    payload
  };
}

function memberVoted(payload) {
  return { type: USER_VOTE, payload };
}

function flipCards(payload) {
  const { roomId } = payload;
  return async dispatch => {
    Api.flip(roomId);
  };
}

function flippingCards(payload) {
  return {
    type: FLIP_CARDS,
    payload
  };
}

function deleteVotes(payload) {
  const { roomId } = payload;
  return async dispatch => {
    Api.clearVotes(roomId).catch(err =>
      dispatch(addToast({ text: err.message }))
    );
  };
}

function deletingVotes(payload) {
  return {
    type: DELETE_VOTES,
    payload
  };
}

export {
  addVote,
  addingVote,
  memberVoted,
  flipCards,
  flippingCards,
  deleteVotes,
  deletingVotes
};
