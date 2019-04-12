import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "../../../actions/roomActions";

const mapDispatchToProps = dispatch => ({
  startCurrentGame: game => dispatch(actions.startGame(game)),
  deleteVotes: votes => dispatch(actions.deleteVotes(votes)),
  flipCards: cards => dispatch(actions.flipCards(cards)),
  endCurrentGame: game => dispatch(actions.endGame(game)),
  resetTimer: time => dispatch(actions.resetTimer(time))
});

const startButton = startCurrentGame => {
  return (
    <div className="startgame-control">
      <button
        type="button"
        className="votes-blue"
        onClick={e => {
          e.preventDefault();
          startCurrentGame({ gameStart: new Date() });
        }}
      >
        {`Start`}
      </button>
    </div>
  );
};

const flipCardsButton = flipCards => {
  return (
    <button
      type="button"
      className="votes-option"
      onClick={e => {
        e.preventDefault();
        flipCards({ flip: true });
      }}
    >
      {`Flip Cards`}
    </button>
  );
};

const endVoteButton = (endCurrentGame, stopTimer) => {
  return (
    <button
      type="button"
      className="votes-blue"
      onClick={e => {
        e.preventDefault();
        endCurrentGame({ end: new Date() });
        stopTimer();
      }}
    >
      {`Finish Voting`}
    </button>
  );
};

const clearVotesButton = (deleteVotes, startTimer, startGame) => {
  return (
    <button
      type="button"
      className="votes-option"
      onClick={e => {
        e.preventDefault();
        deleteVotes({ flip: false, list: [], end: undefined });
        startTimer(startGame);
      }}
    >
      {`Clear Votes`}
    </button>
  );
};

const resetTimerButton = (reset, stopTimer) => {
  return (
    <button
      type="button"
      className="votes-option"
      onClick={e => {
        e.preventDefault();
        stopTimer();
        reset();
      }}
    >
      {`Reset Timer`}
    </button>
  );
};

const nextStoryButton = () => {
  return (
    <button
      type="button"
      className="votes-option"
      onClick={e => {
        e.preventDefault();
      }}
    >
      {`Next Story`}
    </button>
  );
};

export const ConnectedGameControls = ({
  startGame,
  results,
  startCurrentGame,
  flipCards,
  endCurrentGame,
  deleteVotes,
  resetTimer,
  stopTimer,
  startTimer
}) => {
  return (
    <>
      {!startGame ? (
        startButton(startCurrentGame)
      ) : (
        <div className="controls">
          {!results.flip
            ? flipCardsButton(flipCards)
            : !results.end && endVoteButton(endCurrentGame, stopTimer)}
          {clearVotesButton(deleteVotes, startTimer, startGame)}
          {!results.end && resetTimerButton(resetTimer, stopTimer)}
          {nextStoryButton()}
        </div>
      )}
    </>
  );
};

const ControlButtons = connect(
  null,
  mapDispatchToProps
)(ConnectedGameControls);
export default ControlButtons;

ConnectedGameControls.propTypes = {
  results: PropTypes.shape({
    end: PropTypes.instanceOf(Date),
    flip: PropTypes.bool
  }).isRequired,
  startGame: PropTypes.instanceOf(Date),
  startCurrentGame: PropTypes.func.isRequired,
  endCurrentGame: PropTypes.func.isRequired,
  flipCards: PropTypes.func.isRequired,
  deleteVotes: PropTypes.func.isRequired,
  resetTimer: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,
  startTimer: PropTypes.func.isRequired
};

ConnectedGameControls.defaultProps = {
  startGame: PropTypes.instanceOf(undefined)
};
