const getActiveStory = state => {
  const { activeStoryId } = state.stories;
  return state.stories.byId[activeStoryId] || {};
};

const isFlipped = state => {
  const { votes } = getActiveStory(state);
  return Boolean(votes && votes.some(vote => vote.vote !== undefined));
};
const hasStarted = state => {
  const { start } = getActiveStory(state);
  return Boolean(start || null);
};
const hasEnded = state => Boolean(getActiveStory(state).end || null);

export { getActiveStory, isFlipped, hasStarted, hasEnded };
