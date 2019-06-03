const getActiveStory = state => {
  const { activeStoryId } = state.stories;
  return state.stories.byId[activeStoryId] || {};
};

const isFlipped = state => {
  try {
    const { votes } = getActiveStory(state);
    return votes.some(vote => vote.vote !== undefined);
  } catch (error) {
    return false;
  }
};
const isStarted = state => {
  const activeStory = getActiveStory(state);
  return activeStory.start;
};
const isEnded = state => getActiveStory(state).end;

export { getActiveStory, isFlipped, isStarted, isEnded };
