import {
  ADD_STORY,
  START_STORY,
  END_STORY,
  DELETE_STORY,
  EDIT_STORY,
  GAME_STARTING,
  GAME_STARTED,
  GAME_FAILURE,
  FLIP_CARDS,
  DELETE_VOTES,
  RESET_TIMER,
  FLIP_STARTING,
  FLIP_SUCCESS,
  FLIP_FAILURE,
  CLEAR_STARTING,
  CLEAR_SUCCESS,
  CLEAR_FAILURE,
  END_STARTING,
  END_SUCCESS,
  END_FAILURE,
  RESET_STARTING,
  RESET_SUCCESS,
  RESET_FAILURE
} from "./types";
import { addToast } from "./toastsActions";
import { getActiveStory, isFlipped } from "../selectors";
import * as Api from "../Api";

function addVote(payload) {
  return async (dispatch, getState) => {
    const { value } = payload;
    const state = getState();
    const { start, id } = getActiveStory(state);
    const flipped = isFlipped(state);
    const { user, id: roomId } = state.gameRoom;
    if (!start) {
      dispatch(addToast({ text: "Press start" }));
    } else if (start && !flipped) {
      try {
        await Api.vote(user, id, roomId, value);
      } catch (error) {
        error.map(e => dispatch(addToast({ text: e.message })));
      }
    }
  };
}

function flipCards() {
  return async (dispatch, getState) => {
    dispatch({ type: FLIP_STARTING });
    const roomId = getState().gameRoom.id;
    try {
      await Api.flip(roomId);
      dispatch({ type: FLIP_SUCCESS });
    } catch (error) {
      dispatch({ type: FLIP_FAILURE });
      error.map(e => dispatch(addToast({ text: e.message })));
    }
  };
}

function flippingCards(payload) {
  return {
    type: FLIP_CARDS,
    payload
  };
}

function deleteVotes() {
  return async (dispatch, getState) => {
    dispatch({ type: CLEAR_STARTING });
    const { id: roomId } = getState().gameRoom;
    const { activeStoryId } = getState().stories;
    try {
      await Api.clearVotes(roomId, activeStoryId);
      dispatch({ type: CLEAR_SUCCESS });
    } catch (error) {
      dispatch({ type: CLEAR_FAILURE });
      dispatch(addToast({ text: error.message }));
    }
  };
}

function deletingVotes() {
  return {
    type: DELETE_VOTES
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

function addingStory(payload) {
  return {
    type: ADD_STORY,
    payload
  };
}

function startStory() {
  return async (dispatch, getState) => {
    dispatch({ type: GAME_STARTING });
    const state = getState();
    const gameStart = new Date();
    const { id: roomId } = state.gameRoom;
    const { id: storyId } = getActiveStory(state);
    if (!storyId) {
      dispatch({ type: GAME_FAILURE });
      dispatch(addToast({ text: "There are no more stories in the backlog" }));
    } else {
      try {
        await Api.start(gameStart, roomId, storyId);
        dispatch({ type: GAME_STARTED });
      } catch (error) {
        dispatch({ type: GAME_FAILURE, payload: error });
      }
    }
  };
}

function startingStory(payload) {
  return { type: START_STORY, payload };
}

function resetingStory() {
  return async (dispatch, getState) => {
    const { activeStoryId } = getState().stories;
    if (activeStoryId) {
      dispatch({ type: "RESET_STORY", payload: { activeStoryId } });
    }
  };
}

function endStory() {
  return async (dispatch, getState) => {
    dispatch({ type: END_STARTING });
    const state = getState();
    const storyEnd = new Date();
    const roomId = state.gameRoom.id;
    const storyId = getActiveStory(state).id;
    try {
      await Api.end(storyEnd, roomId, storyId);
      dispatch({ type: END_SUCCESS });
    } catch (error) {
      dispatch({ type: END_FAILURE });
      error.map(e => dispatch(addToast({ text: e.message })));
    }
  };
}

function endingStory(payload) {
  return { type: END_STORY, payload };
}

function deleteStory(payload) {
  // to be treated on server
  return {
    type: DELETE_STORY,
    payload
  };
}

function editStory(payload) {
  return async dispatch => {
    const { value, id, roomId } = payload;
    try {
      await Api.editStory(value, id, roomId);
    } catch (error) {
      error.map(e => dispatch(addToast({ text: e.message })));
    }
  };
}

function renamingStory(payload) {
  return { type: EDIT_STORY, payload };
}

function resetTimer() {
  return async (dispatch, getState) => {
    dispatch({ type: RESET_STARTING });
    const state = getState();
    const { id: storyId } = getActiveStory(state);
    const { id: roomId } = state.gameRoom;
    try {
      await Api.resetTimer(roomId, storyId);
      dispatch({ type: RESET_SUCCESS });
    } catch (error) {
      dispatch({ type: RESET_FAILURE });
      error.map(e => dispatch(addToast({ text: e.message })));
    }
  };
}

function resetingTimer(payload) {
  return { type: RESET_TIMER, payload };
}

function nextStory() {
  return async (dispatch, getState) => {
    const state = getState();
    const { id: roomId } = state.gameRoom;
    const { id: endedStoryId } = getActiveStory(state);

    await Api.next(endedStoryId, roomId);
  };
}

function movingToNextStory(payload) {
  return async dispatch => {
    const { activeStoryId } = payload;
    if (!activeStoryId)
      dispatch(addToast({ text: "There are no more stories in the backlog" }));
    else {
      dispatch({ type: "NEXT_STORY", payload: { activeStoryId } });
    }
  };
}

function reorderStories(payload) {
  const { draggedItem: sourceId, draggedOverItem: destinationId } = payload;
  console.log(sourceId, destinationId);
  return async (dispatch, getState) => {
    const roomId = getState().gameRoom.id;
    try {
      await Api.reorder(roomId, sourceId, destinationId);
    } catch (error) {
      error.map(e => dispatch(addToast({ text: e.message })));
    }
  };
}

export {
  addVote,
  flipCards,
  flippingCards,
  deleteVotes,
  deletingVotes,
  newStory,
  addingStory,
  startStory,
  startingStory,
  endStory,
  endingStory,
  nextStory,
  movingToNextStory,
  deleteStory,
  editStory,
  resetTimer,
  resetingStory,
  resetingTimer,
  renamingStory,
  reorderStories
};
