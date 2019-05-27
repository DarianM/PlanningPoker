import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as room from "../../../actions/roomActions";
import * as vote from "../../../actions/voteActions";

const mapDispatchToProps = dispatch => ({
  startCurrentGame: game => dispatch(room.startGame(game)),
  deleteVotes: votes => dispatch(vote.deleteVotes(votes)),
  flipCards: cards => dispatch(vote.flipCards(cards)),
  endCurrentGame: game => dispatch(room.endGame(game)),
  resetTimer: time => dispatch(room.resetTimer(time))
});

const startButton = (startCurrentGame, isStarting, roomId) => {
  return (
    <div className="startgame-control">
      <button
        type="button"
        className="votes-blue"
        onClick={e => {
          e.preventDefault();
          startCurrentGame({ gameStart: new Date(), roomId });
        }}
      >
        {isStarting ? `Starting...` : `Start`}
      </button>
    </div>
  );
};

const flipCardsButton = (flipCards, roomId) => {
  return (
    <button
      type="button"
      className="votes-option"
      onClick={e => {
        e.preventDefault();
        flipCards({ roomId });
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

const clearVotesButton = (deleteVotes, startTimer, startGame, roomId) => {
  return (
    <button
      type="button"
      className="votes-option"
      onClick={e => {
        e.preventDefault();
        deleteVotes({ flip: false, list: [], end: undefined, roomId });
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
  game,
  results,
  connection,
  startCurrentGame,
  flipCards,
  endCurrentGame,
  deleteVotes,
  resetTimer,
  stopTimer,
  startTimer
}) => {
  const { gameStart, id } = game;
  const { isStarting } = connection;

  return (
    <>
      {!gameStart ? (
        startButton(startCurrentGame, isStarting, id)
      ) : (
        <div className="controls">
          {!results.flip
            ? flipCardsButton(flipCards, id)
            : !results.end && endVoteButton(endCurrentGame, stopTimer)}
          {clearVotesButton(deleteVotes, startTimer, gameStart, id)}
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
  game: PropTypes.shape({
    gameStart: PropTypes.instanceOf(Date),
    id: PropTypes.number
  }),
  connection: PropTypes.shape({
    isFetching: PropTypes.bool,
    isStarting: PropTypes.bool,
    error: PropTypes.string
  }).isRequired,
  startCurrentGame: PropTypes.func.isRequired,
  endCurrentGame: PropTypes.func.isRequired,
  flipCards: PropTypes.func.isRequired,
  deleteVotes: PropTypes.func.isRequired,
  resetTimer: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,
  startTimer: PropTypes.func.isRequired
};

ConnectedGameControls.defaultProps = {
  game: PropTypes.shape({
    gameStart: PropTypes.instanceOf(undefined),
    id: PropTypes.number
  })
};
