const getActiveStory = state => {
  const { activeStoryId } = state.stories;
  return state.stories.byId[activeStoryId] || {};
};

const isFlipped = state => {
  const { votes } = getActiveStory(state);
  return votes && votes.some(vote => vote.vote !== undefined);
};
const isStarted = state => {
  const { start } = getActiveStory(state);
  return start || null;
};
const isEnded = state => getActiveStory(state).end;

export { getActiveStory, isFlipped, isStarted, isEnded };
