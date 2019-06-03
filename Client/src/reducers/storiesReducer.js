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
  // if (action.type === UPDATE_ROOM) {
  //   const { roomMembers, flipped } = action.payload;
  //   const voted = roomMembers
  //     .filter(member => member.voted)
  //     .map(m => ({ user: m.member, voted: m.voted, id: m.id }));
  //   return {
  //     ...state,
  //     list: voted,
  //     flip: flipped
  //   };
  // }

  if (action.type === REMOVE_MEMBER) {
    const { name } = action.payload;
    return { ...state, list: state.list.filter(m => m.user !== name) };
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
    console.log(action.payload);
    // const { id: activeStoryId } =
    //   roomStories.find(story => story.isActive) || undefined;
    // console.log(activeStoryId);
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
    console.log(byIdArray);
    return {
      ...state
    };
  }
  if (action.type === EDIT_STORY) {
    const { id, description } = action.payload;
    return {
      ...state,
      stories: state.stories.map(e =>
        e.id === id ? { ...e, story: description } : e
      ),
      activeStoryId:
        state.activeStoryId.id === id
          ? { ...state.activeStoryId, text: description }
          : { ...state.activeStoryId }
    };
  }

  return state;
}
