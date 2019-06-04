import {
  ADD_STORY,
  DELETE_STORY,
  EDIT_STORY,
  EDIT_HISTORY,
  UPDATE_ROOM,
  FLIP_CARDS,
  ADD_VOTE,
  DELETE_VOTES,
  END_GAME,
  REMOVE_MEMBER
} from "../actions/types";

const initialState = {
  stories: {}
};

export default function(state = initialState, action) {
  if (action.type === REMOVE_MEMBER) {
    const { name } = action.payload;
    const { activeStoryId } = state;
    return {
      ...state,
      byId: {
        ...state.byId,
        [activeStoryId]: {
          ...state.byId[activeStoryId],
          votes: state.byId[activeStoryId].votes.filter(
            item => item.name !== name
          )
        }
      }
    };
  }

  if (action.type === DELETE_VOTES) {
    const { votes } = action.payload;
    const { activeStoryId } = state;
    return {
      ...state,
      byId: {
        ...state.byId,
        [activeStoryId]: {
          ...state.byId[activeStoryId],
          end: null,
          votes
        }
      }
    };
  }

  if (action.type === END_GAME) {
    return { ...state, ...action.payload };
  }
  if (action.type === ADD_STORY) {
    const { id, story } = action.payload;
    let { activeStoryId } = state;
    const newStory = {
      [id]: {
        id,
        text: story,
        start: null,
        end: null,
        votes: []
      }
    };
    if (!state.activeStoryId) {
      activeStoryId = action.payload.id;
    }
    return {
      ...state,
      byId: { ...state.byId, ...newStory },
      allIds: [...state.allIds, id],
      activeStoryId
    };
  }

  if (action.type === "START_STORY") {
    const { date } = action.payload;
    const { activeStoryId } = state;
    return {
      ...state,
      byId: {
        ...state.byId,
        [activeStoryId]: {
          ...state.byId[activeStoryId],
          start: new Date(date)
        }
      }
    };
  }

  if (action.type === "END_STORY") {
    const { date } = action.payload;
    const { activeStoryId } = state;
    return {
      ...state,
      byId: {
        ...state.byId,
        [activeStoryId]: {
          ...state.byId[activeStoryId],
          end: new Date(date)
        }
      }
    };
  }

  if (action.type === FLIP_CARDS) {
    const { votes } = action.payload;
    const { activeStoryId } = state;

    return {
      ...state,
      byId: {
        ...state.byId,
        [activeStoryId]: {
          ...state.byId[activeStoryId],
          votes
        }
      }
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
  if (action.type === UPDATE_ROOM) {
    const { roomStories } = action.payload;
    const allIds = roomStories.map(story => story.id);
    const { id: activeStoryId } =
      roomStories.find(story => story.isActive) || [];
    const byIdArray = roomStories.map(story => {
      const { id, description: text, started: start, ended: end } = story;
      return {
        [story.id]: {
          id,
          text,
          start,
          end,
          votes: []
        }
      };
    });
    const byId = Object.assign({}, ...byIdArray.map(item => item));

    return {
      ...state,
      byId,
      activeStoryId,
      allIds
    };
  }
  if (action.type === EDIT_STORY) {
    const { id, description: text } = action.payload;
    return {
      ...state,
      byId: {
        ...state.byId,
        [id]: {
          ...state.byId[id],
          text
        }
      }
    };
  }

  return state;
}
