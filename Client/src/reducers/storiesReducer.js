import {
  ADD_STORY,
  DELETE_STORY,
  EDIT_STORY,
  EDIT_HISTORY
} from "../actions/types";

const initialState = {
  room: {}
};

export default function(state = initialState, action) {
  if (action.type === ADD_STORY) {
    const story = { ...action.payload.new, id: state.nextStoryId };
    return {
      ...state,
      stories: [...state.stories, story],
      nextStoryId: state.nextStoryId + 1
    };
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
  if (action.type === EDIT_STORY) {
    const { id } = action.payload;
    const newStory = action.payload.value;
    return {
      ...state,
      stories: state.stories.map(e =>
        e.id === id ? { ...e, story: newStory } : e
      )
    };
  }

  return state;
}
