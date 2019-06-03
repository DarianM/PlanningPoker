import {
  ADD_STORY,
  DELETE_STORY,
  EDIT_STORY,
  GAME_STARTING,
  FLIP_CARDS,
  ADD_VOTE,
  USER_VOTE,
  DELETE_VOTES
} from "./types";
import { addToast } from "./toastsActions";
import { getActiveStory, isFlipped } from "../selectors";
import * as Api from "../Api";

function flippingCards(payload) {
  return {
    type: FLIP_CARDS,
    payload
  };
}

function addVote(payload) {
  return async (dispatch, getState) => {
    const { value } = payload;
    const state = getState();
    const { start, id } = getActiveStory(state);
    const flipped = isFlipped(state);
    const { user } = state.gameRoom;
    const roomId = state.gameRoom.id;
    if (!start) {
      dispatch(addToast({ text: "Press start" }));
    } else if (start && !flipped) {
      Api.vote(user, roomId, id, value).catch(err =>
        dispatch(addToast({ text: err.message }))
      );
    }
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

function flipCards() {
  return async (dispatch, getState) => {
    const roomId = getState().gameRoom.id;
    await Api.flip(roomId);
  };
}

function deleteVotes() {
  return async (dispatch, getState) => {
    const { id } = getState().gameRoom;
    Api.clearVotes(id).catch(err => dispatch(addToast({ text: err.message })));
  };
}

function deletingVotes(payload) {
  return {
    type: DELETE_VOTES,
    payload
  };
}

function newStory(payload) {
  return async (dispatch, getState) => {
    const { activeStoryId } = getState().stories;
    const { story, roomId } = payload;

    if (!activeStoryId) await Api.addStory(story, roomId, true);
    else {
      await Api.addStory(story, roomId, false);
    }
  };
}

function startStory() {
  return async (dispatch, getState) => {
    const state = getState();
    const gameStart = new Date();
    const roomId = state.gameRoom.id;
    const storyId = getActiveStory(state).id;
    if (!storyId)
      dispatch(addToast({ text: "There are no more stories in the backlog" }));
    else {
      dispatch({ type: GAME_STARTING });
      await Api.start(gameStart, roomId, storyId);
    }
  };
}

function makeStoryStarted(payload) {
  return dispatch => {
    dispatch({ type: "START_STORY", payload });
  };
}

function addStory(payload) {
  return dispatch => {
    dispatch({ type: ADD_STORY, payload });
  };
}

function deleteStory(payload) {
  return {
    type: DELETE_STORY,
    payload
  };
}

function renameStory(payload) {
  return dispatch => {
    dispatch({ type: EDIT_STORY, payload });
  };
}

function editStory(payload) {
  return async dispatch => {
    const { value, id, roomId } = payload;
    await Api.editStory(value, id, roomId);
  };
}

export {
  addVote,
  addingVote,
  memberVoted,
  flipCards,
  deleteVotes,
  deletingVotes,
  newStory,
  addStory,
  startStory,
  makeStoryStarted,
  deleteStory,
  editStory,
  renameStory,
  flippingCards
};