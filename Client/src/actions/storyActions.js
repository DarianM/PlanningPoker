import {
  ADD_STORY,
  DELETE_STORY,
  EDIT_STORY,
  EDIT_HISTORY,
  GAME_STARTING
} from "./types";
import { addToast } from "./toastsActions";
import * as Api from "../Api";

function newStory(payload) {
  return async dispatch => {
    const { story, roomId } = payload;
    await Api.addStory(story, roomId);
  };
}

function startStory(payload) {
  return async dispatch => {
    const { gameStart, roomId, storyId } = payload;
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
  return (dispatch, getState) => {
    const { id, story } = payload;
    const { gameHistory } = getState();
    if (!gameHistory.activeStory)
      dispatch({
        type: EDIT_HISTORY,
        payload: {
          activeStory: { id, text: story }
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

function renameStory(payload) {
  return dispatch => {
    dispatch({ type: EDIT_STORY, payload });
  };
}

function editStory(payload) {
  // value, id, roomId
  return async dispatch => {
    const { value, id, roomId } = payload;
    await Api.editStory(value, id, roomId);
  };
}

export {
  newStory,
  addStory,
  startStory,
  makeStoryStarted,
  deleteStory,
  editStory,
  renameStory
};
