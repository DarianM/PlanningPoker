import {
  ADD_STORY,
  DELETE_STORY,
  EDIT_STORY,
  EDIT_HISTORY,
  UPDATE_ROOM
} from "../actions/types";

const initialState = {
  room: {}
};

export default function(state = initialState, action) {
  if (action.type === ADD_STORY) {
    return {
      ...state,
      stories: [...state.stories, action.payload]
    };
  }
  if (action.type === "START_STORY") {
    const { date, storyId } = action.payload;
    const startedStory = { ...state.activeStory, started: new Date(date) };
    return { ...state, activeStory: startedStory };
  }
  if (action.type === DELETE_STORY) {
    const { id } = action.payload;
    const newList = state.stories.filter(e => e.id !== id);
    return { ...state, stories: [...newList] };
  }
  if (action.type === EDIT_HISTORY) {
    return {
      ...state,
      ...action.payload
    };
  }
  if (action.type === UPDATE_ROOM) {
    const { roomStories } = action.payload;
    const currentStory = roomStories.find(story => !story.completed);
    return {
      ...state,
      stories: roomStories.map(story => {
        return {
          story: story.description,
          id: story.id,
          completed: story.completed === 1
        };
      }),
      activeStory: currentStory
        ? {
            id: currentStory.id,
            text: currentStory.description,
            started: currentStory.started
              ? new Date(currentStory.started)
              : null
          }
        : ""
    };
  }
  if (action.type === EDIT_STORY) {
    const { id, description } = action.payload;
    return {
      ...state,
      stories: state.stories.map(e =>
        e.id === id ? { ...e, story: description } : e
      ),
      activeStory:
        state.activeStory.id === id
          ? { ...state.activeStory, text: description }
          : { ...state.activeStory }
    };
  }

  return state;
}
